// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// What does this contract do
// User creates ads
// User can close ads
// User locks in orders
// Bridger unlocks orders using verifier contract providing

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

    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;

    constructor(address admin, IVerifier _verifier) EIP712(_NAME, _VERSION) {
        _grantRole(ADMIN_ROLE, admin);
        i_verifier = _verifier;
    }
}
