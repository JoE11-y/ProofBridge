// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {AdManager} from "src/AdManager.sol";
import {OrderPortal} from "src/OrderPortal.sol";
import {HonkVerifier} from "src/Verifier.sol";
import {IVerifier} from "src/Verifier.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract MockAdManager is AdManager {
    constructor(address admin, IVerifier v) AdManager(admin, v) {}

    string public lastId;

    function setLastId(string memory id) public {
        lastId = id;
    }

    function hashOrderPublic(OrderParams calldata p) external view returns (bytes32) {
        return _hashOrder(p, block.chainid, address(this));
    }
}

contract MockOrderPortal is OrderPortal {
    constructor(address admin, IVerifier v) OrderPortal(admin, v) {}

    function hashOrderPublic(OrderParams calldata p) external view returns (bytes32) {
        return _hashOrder(p, block.chainid, address(this));
    }
}

contract ProofBridge is Test {
    MockAdManager internal adManager;
    MockOrderPortal internal orderPortal;
    HonkVerifier internal adChainVerifier;
    HonkVerifier internal orderChainVerifier;
    ERC20Mock internal orderToken;
    ERC20Mock internal adToken;

    address admin;
    uint256 adminPk;

    address nonAdmin = makeAddr("nonAdmin");
    address maker;
    uint256 makerPk;
    address bridger;
    uint256 bridgerPk;
    address nonMaker = makeAddr("nonMaker");

    address orderRecipient = makeAddr("orderRecipient");
    address adRecipient = makeAddr("adRecipient");
    address recipient = makeAddr("recipient");
    address other = makeAddr("other");

    uint256 internal adChainId = 111_55_111;
    uint256 internal orderChainId = 296;

    uint256 internal unsupportedChainId = 25_000_000;

    uint256 internal minted = 2_000 ether;
    uint256 internal fundAmt = 1_000 ether;
    uint256 internal orderAmt = 100 ether;

    struct Order {
        address orderToken;
        address adToken;
        uint256 amount;
        address bridger;
        uint256 orderChainId;
        address orderPortal;
        address orderRecipient;
        uint256 adChainId;
        address adManager;
        string adId;
        address adCreator;
        address adRecipient;
        uint256 salt;
    }

    function setUp() public {
        uint256 neutral = block.chainid;

        // setup addresses
        (admin, adminPk) = makeAddrAndKey("admin");
        (maker, makerPk) = makeAddrAndKey("maker");
        (bridger, bridgerPk) = makeAddrAndKey("bridger");

        // Initialize the contracts
        // AdChain contracts
        vm.chainId(adChainId);
        adChainVerifier = new HonkVerifier();
        adManager = new MockAdManager(admin, adChainVerifier);
        adToken = new ERC20Mock();

        // Order chain Contracts
        vm.chainId(orderChainId);
        orderChainVerifier = new HonkVerifier();
        orderPortal = new MockOrderPortal(admin, orderChainVerifier);
        orderToken = new ERC20Mock();

        // Set Ad Chain configs
        vm.chainId(adChainId);
        // Mint ad tokens to the maker
        adToken.mint(maker, minted);
        // Set up AdManager configs
        vm.startPrank(admin);
        // Register the order chain
        adManager.setChain(orderChainId, address(orderPortal), true);
        // Set token route
        adManager.setTokenRoute(address(adToken), address(orderToken), orderChainId);
        vm.stopPrank();
        // Setup Ads
        vm.startPrank(maker);
        // Create an ad
        string memory adId = "1";
        // Generate request params
        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateCreateAdRequestParams(adId);
        // Create the ad
        adManager.createAd(signature, authToken, ttl, adId, address(adToken), orderChainId, adRecipient);
        // Set last id to the created ad
        adManager.setLastId(adId);
        // Approve the ad with tokens
        adToken.approve(address(adManager), fundAmt);
        // Generate request params
        (bytes32 authToken2, uint256 ttl2, bytes memory signature2) = generateFundAdRequestParams(adId, fundAmt);
        // Fund the ad
        adManager.fundAd(signature2, authToken2, ttl2, adId, fundAmt);
        vm.stopPrank();

        // Set Order Chain configs
        vm.chainId(orderChainId);
        // mint order tokens to bridger
        orderToken.mint(bridger, minted);
        // Set up OrderPortal configs
        vm.startPrank(admin);
        orderPortal.setChain(adChainId, address(adManager), true);
        orderPortal.setTokenRoute(address(orderToken), adChainId, address(adToken));
        vm.stopPrank();

        vm.chainId(neutral);
    }

    /*//////////////////////////////////////////////////////////////
           HELPERS
    //////////////////////////////////////////////////////////////*/
    function _defaultAdChainParams(string memory adId, uint256 amount, uint256 salt)
        internal
        view
        returns (AdManager.OrderParams memory p)
    {
        p.orderChainToken = address(orderToken);
        p.adChainToken = address(adToken);
        p.amount = amount;
        p.bridger = bridger;
        p.orderChainId = orderChainId;
        p.srcOrderPortal = address(orderPortal);
        p.orderRecipient = orderRecipient;
        p.adId = adId;
        p.adCreator = maker;
        p.adRecipient = adRecipient;
        p.salt = salt;
    }

    function _defaultOrderChainParams(string memory adId, uint256 amount, uint256 salt)
        internal
        view
        returns (OrderPortal.OrderParams memory p)
    {
        p.orderChainToken = address(orderToken);
        p.adChainToken = address(adToken);
        p.amount = amount;
        p.bridger = bridger;
        p.orderRecipient = orderRecipient;
        p.adChainId = adChainId;
        p.adManager = address(adManager);
        p.adId = adId;
        p.adCreator = maker;
        p.adRecipient = adRecipient;
        p.salt = salt;
    }

    function _adId() internal returns (string memory adId) {
        uint256 prevChain = block.chainid;
        vm.chainId(adChainId);
        adId = adManager.lastId();
        vm.chainId(prevChain);
    }

    function signECDSA(bytes32 message, uint256 pk) public pure returns (bytes memory signature) {
        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(message);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, hash);
        signature = abi.encodePacked(r, s, v);
    }

    function generateCreateAdRequestParams(string memory adId)
        internal
        view
        returns (bytes32 authToken, uint256 ttl, bytes memory signature)
    {
        authToken = bytes32(vm.randomBytes(32));
        ttl = block.timestamp + 1 hours;
        bytes32 message =
            adManager.createAdRequestHash(adId, address(adToken), orderChainId, adRecipient, authToken, ttl);

        signature = signECDSA(message, adminPk);
    }

    function generateFundAdRequestParams(string memory adId, uint256 amount)
        internal
        view
        returns (bytes32 authToken, uint256 ttl, bytes memory signature)
    {
        authToken = bytes32(vm.randomBytes(32));
        ttl = block.timestamp + 1 hours;
        bytes32 message = adManager.fundAdRequestHash(adId, amount, authToken, ttl);
        signature = signECDSA(message, adminPk);
    }

    function generateLockForOrderRequestHash(string memory adId, bytes32 orderHash)
        internal
        view
        returns (bytes32 authToken, uint256 ttl, bytes memory signature)
    {
        authToken = bytes32(vm.randomBytes(32));
        ttl = block.timestamp + 1 hours;

        bytes32 message = adManager.lockForOrderRequestHash(adId, orderHash, authToken, ttl);
        signature = signECDSA(message, adminPk);
    }

    function generateCreateOrderRequestParams(string memory adId, bytes32 orderHash)
        internal
        view
        returns (bytes32 authToken, uint256 ttl, bytes memory signature)
    {
        authToken = bytes32(vm.randomBytes(32));
        ttl = block.timestamp + 1 hours;
        bytes32 message = orderPortal.createOrderRequestHash(adId, orderHash, authToken, ttl);
        signature = signECDSA(message, adminPk);
    }

    /*//////////////////////////////////////////////////////////////
            check that order hashes matches for same data
    //////////////////////////////////////////////////////////////*/
    function test_orderHashMatchesOnBothChains() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, 100 ether, 777);

        // get ad chain params
        AdManager.OrderParams memory adChainParams = _defaultAdChainParams(adId, 100 ether, 777);

        bytes32 orderChainOrderHash;
        bytes32 adChainOrderHash;

        vm.chainId(orderChainId);
        orderChainOrderHash = orderPortal.hashOrderPublic(orderChainParams);

        vm.chainId(adChainId);
        adChainOrderHash = adManager.hashOrderPublic(adChainParams);

        assertEq(orderChainOrderHash, adChainOrderHash);

        vm.chainId(neutral);
    }

    /*//////////////////////////////////////////////////////////////
            check that order hashes not match for different data
    //////////////////////////////////////////////////////////////*/
    function test_orderHashNotMatchesOnBothChainsIfParamsDifferent() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, 90 ether, 777);

        // get ad chain params
        AdManager.OrderParams memory adChainParams = _defaultAdChainParams(adId, 100 ether, 777);

        vm.chainId(orderChainId);
        bytes32 orderChainOrderHash = orderPortal.hashOrderPublic(orderChainParams);

        vm.chainId(adChainId);
        bytes32 adChainOrderHash = adManager.hashOrderPublic(adChainParams);

        assertNotEq(orderChainOrderHash, adChainOrderHash);

        vm.chainId(neutral);
    }

    function getTypedHash(Order memory order) public returns (bytes32 typedHash) {
        string[] memory inputs = new string[](16);

        inputs[0] = "npx";
        inputs[1] = "tsx";
        inputs[2] = "js-scripts/hashTypedData.ts";
        inputs[3] = vm.toString(order.orderToken);
        inputs[4] = vm.toString(order.adToken);
        inputs[5] = vm.toString(order.amount);
        inputs[6] = vm.toString(order.bridger);
        inputs[7] = vm.toString(order.orderChainId);
        inputs[8] = vm.toString(order.orderPortal);
        inputs[9] = vm.toString(order.orderRecipient);
        inputs[10] = vm.toString(order.adChainId);
        inputs[11] = vm.toString(order.adManager);
        inputs[12] = order.adId;
        inputs[13] = vm.toString(order.adCreator);
        inputs[14] = vm.toString(order.adRecipient);
        inputs[15] = vm.toString(order.salt);

        bytes memory result = vm.ffi(inputs);

        typedHash = abi.decode(result, (bytes32));
    }

    function getNullfierHash(bytes memory signature) public returns (bytes32 nullifierHash) {
        string[] memory inputs = new string[](4);

        inputs[0] = "npx";
        inputs[1] = "tsx";
        inputs[2] = "js-scripts/getNullifierHash.ts";
        inputs[3] = vm.toString(signature);

        bytes memory result = vm.ffi(inputs);
        nullifierHash = abi.decode(result, (bytes32));
    }

    function getProof(
        bool isAdContract,
        bytes32 nullifierHash,
        address _maker,
        bytes memory makerSig,
        address _bridger,
        bytes memory bridgerSig,
        bytes32 orderHash
    ) public returns (bytes memory proof, bytes32[] memory publicInputs) {
        string[] memory inputs = new string[](10);

        inputs[0] = "npx";
        inputs[1] = "tsx";
        inputs[2] = "js-scripts/generateProof.ts";
        inputs[3] = vm.toString(nullifierHash); // nullifierHash
        inputs[4] = vm.toString(_maker); // maker
        inputs[5] = vm.toString(makerSig); // maker signature
        inputs[6] = vm.toString(_bridger); // bridger
        inputs[7] = vm.toString(bridgerSig); // bridger signature
        inputs[8] = vm.toString(isAdContract); // to known whose nullifier we're using
        inputs[9] = vm.toString(orderHash); // order hash

        bytes memory result = vm.ffi(inputs);
        (proof, publicInputs) = abi.decode(result, (bytes, bytes32[]));
    }

    function sign(bytes32 hash, uint256 pk) public pure returns (bytes memory signature) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, hash);
        signature = abi.encodePacked(r, s, v);
    }

    // Test that EIP712 hash matches onchain hashes
    function test_onChainHashesMatchesTypedDataHash() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, 100 ether, 777);

        // get ad chain params
        AdManager.OrderParams memory adChainParams = _defaultAdChainParams(adId, 100 ether, 777);

        // order chain params for typed data hash
        Order memory order = Order({
            orderToken: orderChainParams.orderChainToken,
            adToken: orderChainParams.adChainToken,
            amount: orderChainParams.amount,
            bridger: orderChainParams.bridger,
            orderChainId: adChainParams.orderChainId,
            orderPortal: adChainParams.srcOrderPortal,
            orderRecipient: orderChainParams.orderRecipient,
            adChainId: orderChainParams.adChainId,
            adManager: orderChainParams.adManager,
            adId: orderChainParams.adId,
            adCreator: orderChainParams.adCreator,
            adRecipient: orderChainParams.adRecipient,
            salt: orderChainParams.salt
        });

        // get on-chain hashes
        vm.chainId(orderChainId);
        bytes32 orderChainOrderHash = orderPortal.hashOrderPublic(orderChainParams);

        vm.chainId(adChainId);
        bytes32 adChainOrderHash = adManager.hashOrderPublic(adChainParams);

        vm.chainId(neutral);

        // get typed data hash
        bytes32 typedHash = getTypedHash(order);
        assertEq(orderChainOrderHash, adChainOrderHash);
        assertEq(typedHash, orderChainOrderHash);
        assertEq(typedHash, adChainOrderHash);
    }

    // Test that proof verifies offchain if maker is on order chain
    function test_makerCanVerifyWithMakerSecretOffChain() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, 100 ether, 777);

        vm.chainId(orderChainId);
        // since both hashes match, we can just use any chain's
        bytes32 orderHash = orderPortal.hashOrderPublic(orderChainParams);
        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get maker nullifier hash
        bytes32 makerNullifierHash = getNullfierHash(makerSig);

        // get proof
        (bytes memory proof, bytes32[] memory publicInputs) =
            getProof(false, makerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(orderChainId);

        bool res = orderChainVerifier.verify(proof, publicInputs);
        assertTrue(res);

        vm.chainId(neutral);
    }

    // Test that maker proof verifies on order chain and fulfills the order
    function test_makerCanVerifyWithMakerSecretOnOrderChainAndOrderFulfills() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, orderAmt, 777);

        // create order
        vm.chainId(orderChainId);
        bytes32 expectedHash = orderPortal.hashOrderPublic(orderChainParams);

        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateCreateOrderRequestParams(adId, expectedHash);

        vm.startPrank(bridger);
        orderToken.approve(address(orderPortal), orderAmt);
        bytes32 orderHash = orderPortal.createOrder(signature, authToken, ttl, orderChainParams);
        vm.stopPrank();

        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get maker nullifier hash
        bytes32 makerNullifierHash = getNullfierHash(makerSig);

        // get proof
        (bytes memory proof,) = getProof(false, makerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(orderChainId);
        // check balances before
        uint256 orderPortalBalanceBefore = orderToken.balanceOf(address(orderPortal));
        uint256 recipientBalBefore = orderToken.balanceOf(adRecipient);

        // verify and fulfill order
        vm.prank(maker);
        orderPortal.unlock(orderChainParams, makerNullifierHash, proof);

        // check balances after
        uint256 orderPortalBalanceAfter = orderToken.balanceOf(address(orderPortal));
        uint256 recipientBalAfter = orderToken.balanceOf(adRecipient);

        assertEq(orderPortalBalanceBefore - orderPortalBalanceAfter, orderAmt);
        assertEq(recipientBalAfter - recipientBalBefore, orderAmt);
    }

    // Test that maker secret cannot be user to unlock on ad chain even if they know the right proof
    function test_makerCannotUnlockOnAdChain() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get adchain params
        AdManager.OrderParams memory adChainParams = _defaultAdChainParams(adId, orderAmt, 777);

        vm.chainId(adChainId);
        vm.startPrank(maker);

        bytes32 orderHash = adManager.hashOrderPublic(adChainParams);

        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateLockForOrderRequestHash(adId, orderHash);

        adManager.lockForOrder(signature, authToken, ttl, adChainParams);
        vm.stopPrank();

        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get maker nullifier hash
        bytes32 makerNullifierHash = getNullfierHash(makerSig);

        // get bridger nullifier hash
        bytes32 bridgerNullifierHash = getNullfierHash(bridgerSig);

        // get proof
        (bytes memory proof,) = getProof(true, bridgerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(adChainId);

        // verify and fulfill order
        vm.prank(maker);
        vm.expectRevert(); // should revert because the nullifier is not for the bridger
        adManager.unlock(adChainParams, makerNullifierHash, proof);

        vm.chainId(neutral);
    }

    // Test that proof verifies offchain if bridger is on ad chain
    function test_bridgerCanVerifyWithBridgerSecretOffchain() public {
        uint256 neutral = block.chainid;

        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, 100 ether, 777);

        vm.chainId(orderChainId);
        // since both hashes match, we can just use any chain's
        bytes32 orderHash = orderPortal.hashOrderPublic(orderChainParams);
        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get maker nullifier hash
        bytes32 bridgerNullifierHash = getNullfierHash(bridgerSig);

        // get proof
        (bytes memory proof, bytes32[] memory publicInputs) =
            getProof(true, bridgerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(adChainId);

        bool res = adChainVerifier.verify(proof, publicInputs);
        assertTrue(res);

        vm.chainId(neutral);
    }

    // Test that bridger proof verifies on ad chain and fulfills the order
    function test_bridgerCanVerifyWithBridgerSecretOnAdChainAndOrderFulfills() public {
        uint256 neutral = block.chainid;
        string memory adId = _adId();

        // get adchain params
        AdManager.OrderParams memory adChainParams = _defaultAdChainParams(adId, orderAmt, 777);

        vm.chainId(adChainId);

        vm.startPrank(maker);

        bytes32 orderHash = adManager.hashOrderPublic(adChainParams);
        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateLockForOrderRequestHash(adId, orderHash);

        adManager.lockForOrder(signature, authToken, ttl, adChainParams);
        vm.stopPrank();

        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);
        // get bridger nullifier hash
        bytes32 bridgerNullifierHash = getNullfierHash(bridgerSig);
        // get proof
        (bytes memory proof,) = getProof(true, bridgerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(adChainId);
        // check balances before
        uint256 adManagerBalanceBefore = adToken.balanceOf(address(adManager));
        uint256 recipientBalBefore = adToken.balanceOf(orderRecipient);

        // verify and fulfill order
        vm.prank(bridger);
        adManager.unlock(adChainParams, bridgerNullifierHash, proof);
        // check balances after
        uint256 adManagerBalanceAfter = adToken.balanceOf(address(adManager));
        uint256 recipientBalAfter = adToken.balanceOf(orderRecipient);
        assertEq(adManagerBalanceBefore - adManagerBalanceAfter, orderAmt);
        assertEq(recipientBalAfter - recipientBalBefore, orderAmt);
    }

    // Test that bridger secret cannot be user to unlock on order chain even if they know the right proof
    function test_bridgerCannotUnlockOnOrderChain() public {
        uint256 neutral = block.chainid;
        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, orderAmt, 777);

        vm.chainId(orderChainId);

        bytes32 expectedHash = orderPortal.hashOrderPublic(orderChainParams);

        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateCreateOrderRequestParams(adId, expectedHash);

        vm.startPrank(bridger);
        orderToken.approve(address(orderPortal), orderAmt);
        bytes32 orderHash = orderPortal.createOrder(signature, authToken, ttl, orderChainParams);
        vm.stopPrank();

        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get bridger nullifier hash
        bytes32 bridgerNullifierHash = getNullfierHash(bridgerSig);

        // get maker nullifier hash
        bytes32 makerNullifierHash = getNullfierHash(makerSig);

        // get proof
        (bytes memory proof,) = getProof(false, makerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(orderChainId);

        // verify and fulfill order
        vm.prank(bridger);
        vm.expectRevert(); // should revert because the nullifier is not for the maker
        orderPortal.unlock(orderChainParams, bridgerNullifierHash, proof);

        vm.chainId(neutral);
    }

    // Test that nullifier hash cannot be used twice on order chain
    function test_nullifierCannotBeUsedTwiceOnOrderChain() public {
        uint256 neutral = block.chainid;
        string memory adId = _adId();

        // get order chain params
        OrderPortal.OrderParams memory orderChainParams = _defaultOrderChainParams(adId, orderAmt, 777);

        vm.chainId(orderChainId);

        bytes32 expectedHash = orderPortal.hashOrderPublic(orderChainParams);

        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateCreateOrderRequestParams(adId, expectedHash);

        vm.startPrank(bridger);
        orderToken.approve(address(orderPortal), orderAmt);
        bytes32 orderHash = orderPortal.createOrder(signature, authToken, ttl, orderChainParams);
        vm.stopPrank();

        vm.chainId(neutral);
        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get maker nullifier hash
        bytes32 makerNullifierHash = getNullfierHash(makerSig);
        // get proof
        (bytes memory proof,) = getProof(false, makerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);

        vm.chainId(orderChainId);

        // verify and fulfill order
        vm.prank(maker);
        orderPortal.unlock(orderChainParams, makerNullifierHash, proof);
        // try to use the same nullifier again
        vm.prank(maker);
        vm.expectRevert(); // should revert because the nullifier is already used
        orderPortal.unlock(orderChainParams, makerNullifierHash, proof);
    }

    // Test that nullifier hash cannot be used twice on ad chain
    function test_nullifierCannotBeUsedTwiceOnAdChain() public {
        uint256 neutral = block.chainid;
        string memory adId = _adId();
        // get adchain params
        AdManager.OrderParams memory adChainParams = _defaultAdChainParams(adId, orderAmt, 777);
        vm.chainId(adChainId);
        vm.startPrank(maker);

        bytes32 orderHash = adManager.hashOrderPublic(adChainParams);

        (bytes32 authToken, uint256 ttl, bytes memory signature) = generateLockForOrderRequestHash(adId, orderHash);
        adManager.lockForOrder(signature, authToken, ttl, adChainParams);

        vm.stopPrank();
        vm.chainId(neutral);

        // sign order hash by maker and bridger
        bytes memory makerSig = sign(orderHash, makerPk);
        bytes memory bridgerSig = sign(orderHash, bridgerPk);

        // get bridger nullifier hash
        bytes32 bridgerNullifierHash = getNullfierHash(bridgerSig);
        // get proof
        (bytes memory proof,) = getProof(true, bridgerNullifierHash, maker, makerSig, bridger, bridgerSig, orderHash);
        vm.chainId(adChainId);

        // verify and fulfill order
        vm.prank(bridger);
        adManager.unlock(adChainParams, bridgerNullifierHash, proof);
        // try to use the same nullifier again
        vm.prank(bridger);
        vm.expectRevert(); // should revert because the nullifier is already used
        adManager.unlock(adChainParams, bridgerNullifierHash, proof);
    }
}
