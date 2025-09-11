// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OrderPortal (Proofbridge)
 * @notice Bridgers open cross-chain bridge *orders* by depositing token1 on this chain.
 *         Makers (ad creators) later *unlock* those funds on this chain after filling the user
 *         on the opposite chain. The contract computes an EIP-712 order hash
 *         to serve as a canonical order identifier across components.
 */
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {IVerifier} from "./Verifier.sol";
import {EfficientHashLib} from "solady/utils/EfficientHashLib.sol";

contract OrderPortal is AccessControl, ReentrancyGuard, EIP712 {
    using SafeERC20 for IERC20;

    // Verifier Contract
    IVerifier public immutable i_verifier;

    // ─────────────────────────────────────────────────────────────
    // EIP-712 Domain
    // ─────────────────────────────────────────────────────────────

    string private constant _NAME = "Proofbridge";
    string private constant _VERSION = "1";

    // Primary typehash for Order
    bytes32 public constant ORDER_TYPEHASH = keccak256(
        "Order(address token1,address token2,uint256 dstChainId,uint256 amount,address dstAdManager,uint256 dstAdId,address dstAdCreator,address dstRecipient,address srcRecipient,uint256 srcChainId,address bridger,uint256 salt)"
    );

    // ─────────────────────────────────────────────────────────────
    // Roles
    // ─────────────────────────────────────────────────────────────

    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    // ─────────────────────────────────────────────────────────────
    // Types
    // ─────────────────────────────────────────────────────────────

    struct ChainInfo {
        bool supported;
        address adManager; // counterpart Ad manager on destination chain
    }

    /**
     * @dev Parameters for bridger-created order (source = this chain).
     *
     * token1        : current chain token address (deposited here)
     * token2        : destination chain token address (routing check)
     * dstChainId    : destination chain id
     * amount        : token1 amount to deposit
     * dstAdManager  : Ad manager contract on destination chain
     * dstAdId       : Destination chain ad id
     * dstAdCreator  : Maker's address (destination side notion)
     * dstRecipient  : Recipient address on destination chain
     */
    struct OrderParams {
        address token1;
        address token2;
        uint256 dstChainId;
        uint256 amount;
        address dstAdManager;
        uint256 dstAdId;
        address dstAdCreator;
        address dstRecipient;
        address srcRecipient;
        uint256 salt;
    }

    struct OrderRecord {
        // Accounting
        address token1;
        address token2;
        uint256 amount;
        // Identity
        address bridger;
        uint256 srcChainId;
        uint256 dstChainId;
        // Destination details
        address dstAdManager;
        uint256 dstAdId;
        address dstAdCreator;
        address dstRecipient;
        address srcRecipient;
        uint256 salt;
    }

    // ─────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────

    // Destination chain configs
    mapping(uint256 => ChainInfo) public chains;

    // Supported token routes: src token on this chain → (dstChainId → dst token address)
    mapping(address => mapping(uint256 => address)) public tokenRoute;

    // Order hash → existence guard
    mapping(bytes32 => bool) public orderExists;

    // Order hash → record
    mapping(bytes32 => OrderRecord) public orders;

    // Nullifier hash consumption
    mapping(bytes32 => bool) public nullifierUsed;

    // ─────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────

    event ChainSet(uint256 indexed chainId, address indexed adManager, bool supported);
    event TokenRouteSet(address indexed token1, uint256 indexed dstChainId, address indexed token2);
    event TokenRouteRemoved(address indexed token1, uint256 indexed dstChainId);

    event OrderCreated(
        bytes32 indexed orderHash,
        address indexed bridger,
        address indexed token1,
        uint256 amount,
        uint256 dstChainId,
        address token2,
        address dstAdManager,
        uint256 dstAdId,
        address dstAdCreator,
        address dstRecipient
    );

    event OrderUnlocked(
        bytes32 indexed orderHash, address indexed adCreator, bytes32 indexed nullifierHash, bytes proof
    );

    // ─────────────────────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────────────────────
    error OrderPortal__InvalidProof();
    error OrderPortal__RoutesZeroAddress(address srcToken, address dstToken);
    error OrderPortal__DstChainNotSupported(uint256 dstChainId);
    error OrderPortal__ZeroAmount();
    error OrderPortal__AdmanagerMismatch(address adManager);
    error OrderPortal__MissingRoute();
    error OrderPortal__DstTokenMismatch();
    error OrderPortal__OrderExists(bytes32 orderHash);
    error OrderPortal__NullifierUsed(bytes32 nullifierHash);
    // ─────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────

    constructor(address admin, IVerifier _verifier) EIP712(_NAME, _VERSION) {
        _grantRole(ADMIN_ROLE, admin);
        i_verifier = _verifier;
    }

    // ─────────────────────────────────────────────────────────────
    // Admin — Chains
    // ─────────────────────────────────────────────────────────────

    function setChain(uint256 chainId, address adManager, bool supported) external onlyRole(ADMIN_ROLE) {
        chains[chainId] = ChainInfo({supported: supported, adManager: adManager});
        emit ChainSet(chainId, adManager, supported);
    }

    function removeChain(uint256 chainId) external onlyRole(ADMIN_ROLE) {
        delete chains[chainId];
        emit ChainSet(chainId, address(0), false);
    }

    // ─────────────────────────────────────────────────────────────
    // Admin — Token routes
    // ─────────────────────────────────────────────────────────────

    function setTokenRoute(address srcToken, uint256 dstChainId, address dstToken) external onlyRole(ADMIN_ROLE) {
        if (srcToken == address(0) || dstToken == address(0)) {
            revert OrderPortal__RoutesZeroAddress(srcToken, dstToken);
        }
        if (!chains[dstChainId].supported) {
            revert OrderPortal__DstChainNotSupported(dstChainId);
        }
        tokenRoute[srcToken][dstChainId] = dstToken;
        emit TokenRouteSet(srcToken, dstChainId, dstToken);
    }

    function removeTokenRoute(address srcToken, uint256 dstChainId) external onlyRole(ADMIN_ROLE) {
        delete tokenRoute[srcToken][dstChainId];
        emit TokenRouteRemoved(srcToken, dstChainId);
    }

    // ─────────────────────────────────────────────────────────────
    // User flow
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Bridger creates an order by depositing `params.token1` of `params.amount`.
     *         Emits a deterministic EIP-712 `orderHash` used as canonical order id.
     */
    function createOrder(OrderParams calldata params) external nonReentrant returns (bytes32 orderHash) {
        if (params.amount <= 0) {
            revert OrderPortal__ZeroAmount();
        }

        // Destination chain support
        ChainInfo memory ci = chains[params.dstChainId];

        if (!ci.supported) {
            revert OrderPortal__DstChainNotSupported(params.dstChainId);
        }

        // match the counterpart ad manager address
        if (ci.adManager == address(0) || ci.adManager != params.dstAdManager) {
            revert OrderPortal__AdmanagerMismatch(ci.adManager);
        }

        // Token route must exist and match expected destination token
        if (tokenRoute[params.token1][params.dstChainId] == address(0)) {
            revert OrderPortal__MissingRoute();
        }

        if (tokenRoute[params.token1][params.dstChainId] != params.token2) {
            revert OrderPortal__DstTokenMismatch();
        }

        // Compute order hash including srcChainId and bridger to prevent cross-chain/user replay
        // orderHash = _hashOrder(params, msg.sender, block.chainid);

        if (orderExists[orderHash]) {
            revert OrderPortal__OrderExists(orderHash);
        }

        // Pull funds
        IERC20(params.token1).safeTransferFrom(msg.sender, address(this), params.amount);

        // Persist order
        orders[orderHash] = OrderRecord({
            token1: params.token1,
            token2: params.token2,
            amount: params.amount,
            bridger: msg.sender,
            srcChainId: block.chainid,
            dstChainId: params.dstChainId,
            dstAdManager: params.dstAdManager,
            dstAdId: params.dstAdId,
            dstAdCreator: params.dstAdCreator,
            dstRecipient: params.dstRecipient,
            srcRecipient: params.srcRecipient,
            salt: params.salt
        });

        orderExists[orderHash] = true;

        emit OrderCreated(
            orderHash,
            msg.sender,
            params.token1,
            params.amount,
            params.dstChainId,
            params.token2,
            params.dstAdManager,
            params.dstAdId,
            params.dstAdCreator,
            params.dstRecipient
        );
    }

    /**
     * @notice Maker (ad creator) unlocks funds on this chain after fulfilling the user
     *         on the opposite chain. We only record the nullifier and payout.
     */
    function unlock(bytes32 orderHash, bytes32 nullifierHash, bytes calldata proof) external nonReentrant {
        OrderRecord storage o = orders[orderHash];

        if (nullifierUsed[nullifierHash]) {
            revert OrderPortal__NullifierUsed(nullifierHash);
        }

        bytes32[] memory publicInputs = new bytes32[](5);
        publicInputs[0] = nullifierHash;
        publicInputs[1] = bytes32(uint256(uint160(o.dstAdCreator)));
        publicInputs[2] = bytes32(uint256(uint160(o.bridger)));
        publicInputs[3] = orderHash;
        publicInputs[4] = bytes32(uint256(0));

        if (!i_verifier.verify(proof, publicInputs)) {
            revert OrderPortal__InvalidProof();
        }

        nullifierUsed[nullifierHash] = true;

        // Payout token1 to maker
        IERC20(o.token1).safeTransfer(o.srcRecipient, o.amount);

        emit OrderUnlocked(orderHash, o.srcRecipient, nullifierHash, proof);
    }

    // ─────────────────────────────────────────────────────────────
    // Internal — hashing
    // ─────────────────────────────────────────────────────────────

    function _hashOrder(OrderParams calldata p, address bridger, uint256 srcChainId) internal view returns (bytes32) {
        return _hashTypedDataV4(_structHash(p, bridger, srcChainId));
    }

    function _structHash(OrderParams calldata p, address bridger, uint256 srcChainId) internal pure returns (bytes32) {
        return EfficientHashLib.hash(
            ORDER_TYPEHASH,
            bytes32(uint256(uint160(p.token1))),
            bytes32(uint256(uint160(p.token2))),
            bytes32(p.dstChainId),
            bytes32(p.amount),
            bytes32(uint256(uint160(p.dstAdManager))),
            bytes32(p.dstAdId),
            bytes32(uint256(uint160(p.dstAdCreator))),
            bytes32(uint256(uint160(p.dstRecipient))),
            bytes32(uint256(uint160(p.srcRecipient))),
            bytes32(srcChainId),
            bytes32(uint256(uint160(bridger))),
            bytes32(p.salt)
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Misc views
    // ─────────────────────────────────────────────────────────────

    function getDestToken(address srcToken, uint256 dstChainId) external view returns (address) {
        return tokenRoute[srcToken][dstChainId];
    }
}
