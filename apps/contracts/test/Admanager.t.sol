// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {AdManager} from "src/AdManager.sol";
import {MockVerifier} from "src/mocks/MockVerifier.sol";
import {IVerifier} from "src/Verifier.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract MockAdManager is AdManager {
    constructor(address admin, IVerifier v) AdManager(admin, v) {}

    function hashOrderPublic(OrderParams calldata p) external view returns (bytes32) {
        return _hashOrder(p, block.chainid, address(this));
    }
}

contract AdManagerTest is Test {
    MockAdManager internal adManager;
    MockVerifier internal verifier;
    ERC20Mock internal adToken;

    address admin = makeAddr("admin");
    address nonAdmin = makeAddr("nonAdmin");
    address maker = makeAddr("maker");
    address nonMaker = makeAddr("nonMaker");
    address bridger = makeAddr("bridger");
    address orderRecipient = makeAddr("orderRecipient");
    address adRecipient = makeAddr("adRecipient");
    address recipient = makeAddr("recipient");
    address other = makeAddr("other");

    // Common addresses
    address internal orderPortal = makeAddr("orderPortal");
    address internal orderToken = makeAddr("orderToken");

    uint256 internal orderChainId = 111_55111; // e.g., Sepolia
    uint256 internal adChainId; // block.chainid at runtime
    uint256 internal unsupportedChainId = 25_000_001;

    uint256 internal minted = 1_000 ether;
    uint256 internal fundAmt = 300 ether;

    function setUp() public {
        verifier = new MockVerifier(true);
        adManager = new MockAdManager(admin, IVerifier(address(verifier)));
        adChainId = block.chainid;

        adToken = new ERC20Mock();
        adToken.mint(maker, minted);
    }

    /*//////////////////////////////////////////////////////////////
           HELPER
    //////////////////////////////////////////////////////////////*/
    function _adId() internal view returns (uint256) {
        return adManager.nextAdId() - 1;
    }

    function _defaultParams(uint256 adId) internal view returns (AdManager.OrderParams memory p) {
        p.orderChainToken = orderToken;
        p.adChainToken = address(adToken);
        p.amount = 100 ether;
        p.bridger = bridger;
        p.orderChainId = orderChainId;
        p.srcOrderPortal = orderPortal;
        p.orderRecipient = recipient;
        p.adId = adId;
        p.adCreator = maker;
        p.adRecipient = adRecipient;
        p.salt = 123;
    }

    /*//////////////////////////////////////////////////////////////
             ACCESS CONTROL: ROLES
    //////////////////////////////////////////////////////////////*/

    // Test that only the admin can call functions restricted by the admin role
    function test_AdminRoleAssignedOnDeploy() public {
        // nonAdmin should revert when calling onlyRole function
        vm.prank(nonAdmin);
        vm.expectRevert();
        adManager.setChain(orderChainId, orderPortal, true);

        // admin should succeed
        vm.prank(admin);
        adManager.setChain(orderChainId, orderPortal, true); // should succeed
    }

    /*//////////////////////////////////////////////////////////////
               setChain / removeChain
    //////////////////////////////////////////////////////////////*/

    // Test that only admin can call setChain
    function test_setChain_onlyAdmin() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        adManager.setChain(orderChainId, orderPortal, true);
    }

    // Test that setChain updates state and emits the correct event
    function test_setChain_updatesStateAndEmits() public {
        vm.prank(admin);
        vm.expectEmit(true, true, true, true);
        emit AdManager.ChainSet(orderChainId, orderPortal, true);
        adManager.setChain(orderChainId, orderPortal, true);

        (bool supported, address portal) = adManager.chains(orderChainId);
        assertTrue(supported, "chain not supported");
        assertEq(portal, orderPortal, "portal mismatch");
    }

    // Test that only admin can call removeChain
    function test_removeChain_onlyAdmin() public {
        vm.startPrank(admin);
        adManager.setChain(orderChainId, orderPortal, true);
        vm.stopPrank();

        vm.prank(nonAdmin);
        vm.expectRevert();
        adManager.removeChain(orderChainId);
    }

    // Test that removeChain clears state and emits the correct event
    function test_removeChain_clearsStateAndEmits() public {
        vm.startPrank(admin);
        adManager.setChain(orderChainId, orderPortal, true);

        vm.expectEmit(true, true, true, true);
        emit AdManager.ChainSet(orderChainId, address(0), false);
        adManager.removeChain(orderChainId);
        vm.stopPrank();

        (bool supported, address portal) = adManager.chains(orderChainId);
        assertTrue(!supported, "chain still supported");
        assertEq(portal, address(0), "portal not cleared");
    }

    /*//////////////////////////////////////////////////////////////
             setTokenRoute / removeTokenRoute
    //////////////////////////////////////////////////////////////*/

    // Test that only admin can call setTokenRoute
    function test_setTokenRoute_onlyAdmin() public {
        vm.prank(nonAdmin);
        vm.expectRevert();
        adManager.setTokenRoute(address(adToken), orderToken, orderChainId);
    }

    // Test that setTokenRoute rejects zero addresses
    function test_setTokenRoute_rejectsZeroAddresses() public {
        vm.prank(admin);
        vm.expectRevert(AdManager.AdManager__TokenZeroAddress.selector);
        adManager.setTokenRoute(address(0), orderToken, orderChainId);

        vm.prank(admin);
        vm.expectRevert(AdManager.AdManager__TokenZeroAddress.selector);
        adManager.setTokenRoute(address(adToken), address(0), orderChainId);
    }

    // Test that setTokenRoute rejects unsupported chain
    function test_setTokenRoute_rejectsUnsupportedChain() public {
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__ChainNotSupported.selector, orderChainId));
        adManager.setTokenRoute(address(adToken), orderToken, orderChainId);
    }

    // Test that setTokenRoute sets the route and emits the correct event
    function test_setTokenRoute_setsAndEmits() public {
        vm.startPrank(admin);
        adManager.setChain(orderChainId, orderPortal, true);

        vm.expectEmit(true, true, true, true);
        emit AdManager.TokenRouteSet(orderToken, orderChainId, address(adToken));
        adManager.setTokenRoute(address(adToken), orderToken, orderChainId);
        vm.stopPrank();

        address routed = adManager.tokenRoute(address(adToken), orderChainId);
        assertEq(routed, orderToken, "route not set");
    }

    // Test that only admin can call removeTokenRoute
    function test_removeTokenRoute_onlyAdmin() public {
        vm.startPrank(admin);
        adManager.setChain(orderChainId, orderPortal, true);
        adManager.setTokenRoute(address(adToken), orderToken, orderChainId);
        vm.stopPrank();

        vm.prank(nonAdmin);
        vm.expectRevert();
        adManager.removeTokenRoute(address(adToken), orderChainId);
    }

    // Test that removeTokenRoute clears the route and emits the correct event
    function test_removeTokenRoute_clearsAndEmits() public {
        vm.startPrank(admin);
        adManager.setChain(orderChainId, orderPortal, true);
        adManager.setTokenRoute(address(adToken), orderToken, orderChainId);

        vm.expectEmit(true, true, true, true);
        emit AdManager.TokenRouteRemoved(address(adToken), orderChainId);
        adManager.removeTokenRoute(address(adToken), orderChainId);
        vm.stopPrank();

        address routed = adManager.tokenRoute(address(adToken), orderChainId);
        assertEq(routed, address(0), "route not removed");
    }

    /*//////////////////////////////////////////////////////////////
                createAd setup
    //////////////////////////////////////////////////////////////*/

    // Test that createAd rejects zero adToken address
    function test_createAd_rejectsZeroAdToken() public {
        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__TokenZeroAddress.selector);
        adManager.createAd(address(0), orderChainId, address(0xDEAD));
    }

    // Test that createAd rejects when no route exists for the chain
    function test_createAd_rejectsWhenNoRoute() public {
        vm.prank(maker);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__ChainNotSupported.selector, orderChainId));
        adManager.createAd(address(adToken), orderChainId, address(0xDEAD));
    }

    // Test that createAd succeeds when route exists, emits event, and stores ad data
    function test_createAd_succeedsWhenRouteExists_emitsAndStores() public {
        vm.startPrank(admin);
        adManager.setChain(orderChainId, orderPortal, true);
        adManager.setTokenRoute(address(adToken), orderToken, orderChainId);
        vm.stopPrank();

        vm.prank(maker);
        vm.expectEmit(true, true, true, true);
        emit AdManager.AdCreated(1, maker, address(adToken), orderChainId);
        uint256 adId = adManager.createAd(address(adToken), orderChainId, adRecipient);
        assertEq(adId, 1, "first ad id should be 1");

        (
            uint256 id,
            uint256 linkedOrderChainId,
            address _adRecipient,
            address owner,
            address token,
            uint256 balance,
            uint256 locked,
            bool open
        ) = adManager.ads(adId);

        assertEq(id, 1);
        assertEq(linkedOrderChainId, orderChainId);
        assertEq(_adRecipient, adRecipient);
        assertEq(owner, maker);
        assertEq(token, address(adToken));
        assertEq(balance, 0);
        assertEq(locked, 0);
        assertTrue(open);
    }

    /*//////////////////////////////////////////////////////////////
                        fundAd: maker only
    ////////////////////////////////////////////////////////////////*/
    function test_fundAd_makerOnly() public {
        test_createAd_succeedsWhenRouteExists_emitsAndStores();
        uint256 adId = _adId();
        vm.prank(nonMaker);
        vm.expectRevert(AdManager.AdManager__NotMaker.selector);
        adManager.fundAd(adId, 1 ether);

        vm.prank(maker);
        adToken.approve(address(adManager), fundAmt);

        vm.prank(maker);
        adManager.fundAd(adId, fundAmt);
    }

    /*//////////////////////////////////////////////////////////////
                   fundAd: rejects when ad closed
    ////////////////////////////////////////////////////////////////*/
    function test_fundAd_rejects_whenAdClosed() public {
        test_createAd_succeedsWhenRouteExists_emitsAndStores();

        uint256 adId = _adId();

        // Close first (no locked funds, balance 0)
        vm.prank(maker);
        adManager.closeAd(adId, maker);

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__AdClosed.selector);
        adManager.fundAd(adId, 1 ether);
    }

    /*//////////////////////////////////////////////////////////////
                       fundAd: rejects zero amount
    ////////////////////////////////////////////////////////////////*/
    function test_fundAd_rejects_zeroAmount() public {
        test_createAd_succeedsWhenRouteExists_emitsAndStores();

        uint256 adId = _adId();

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__ZeroAmount.selector);
        adManager.fundAd(adId, 0);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when order chain not supported
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_orderChainMotSupported() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.orderChainId = unsupportedChainId;

        vm.prank(maker);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__ChainNotSupported.selector, p.orderChainId));
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when param chain mismatch
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_orderChainMismatch() public {
        uint256 anotherSupportedChainId = 5;
        address anotherOrderPortal = makeAddr("anotherOrderPortal");
        vm.startPrank(admin);
        adManager.setChain(anotherSupportedChainId, anotherOrderPortal, true);
        adManager.setTokenRoute(makeAddr("randomAdToken"), makeAddr("randomOrderToken"), anotherSupportedChainId);
        vm.stopPrank();

        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.orderChainId = anotherSupportedChainId;
        p.srcOrderPortal = anotherOrderPortal;

        vm.prank(maker);
        vm.expectRevert(
            abi.encodeWithSelector(AdManager.AdManager__OrderChainMismatch.selector, orderChainId, p.orderChainId)
        );
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when srcOrderPortal mismatch
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_srcOrderPortalMismatch() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.srcOrderPortal = address(0xBEEF);

        vm.prank(maker);
        vm.expectRevert(
            abi.encodeWithSelector(AdManager.AdManager__OrderPortalMismatch.selector, orderPortal, p.srcOrderPortal)
        );
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when missing token route
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_missingTokenRoute() public {
        test_fundAd_makerOnly();

        vm.prank(admin);
        adManager.removeTokenRoute(address(adToken), orderChainId);

        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);

        vm.prank(maker);
        vm.expectRevert(
            abi.encodeWithSelector(AdManager.AdManager__MissingRoute.selector, p.orderChainToken, block.chainid)
        );
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when route token != orderChainToken
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_routeTokenMismatch() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);

        address otherOrderToken = other;
        vm.prank(admin);
        adManager.setTokenRoute(address(adToken), otherOrderToken, orderChainId);

        vm.prank(maker);
        vm.expectRevert(
            abi.encodeWithSelector(
                AdManager.AdManager__OrderTokenMismatch.selector,
                otherOrderToken, // expected routed token
                p.orderChainToken // provided in params
            )
        );
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when params.adCreator != ad.maker
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_wrongAdCreator() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.adCreator = other;

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__NotMaker.selector);
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when adChainToken != ad.token
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_adTokenMismatch() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);

        // Create another ad-chain token and route so route check passes first
        ERC20Mock otherAdToken = new ERC20Mock();
        vm.prank(admin);
        adManager.setTokenRoute(address(otherAdToken), orderToken, orderChainId);

        p.adChainToken = address(otherAdToken);

        vm.prank(maker);
        vm.expectRevert(
            abi.encodeWithSelector(
                AdManager.AdManager__AdTokenMismatch.selector, address(adToken), address(otherAdToken)
            )
        );
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when adRecipient != ad.adRecipient
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_adRecipientMismatch() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);

        p.adRecipient = recipient;

        (,, address expected,,,,,) = adManager.ads(p.adId);

        vm.prank(maker);
        vm.expectRevert(
            abi.encodeWithSelector(AdManager.AdManager__AdRecipientMismatch.selector, expected, p.adRecipient)
        );
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects zero bridger
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_zeroBridger() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.bridger = address(0);

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__BridgerZero.selector);
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects zero orderRecipient
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_zeroOrderRecipient() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.orderRecipient = address(0);

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__RecipientZero.selector);
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects zero amount
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_zeroAmount() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.amount = 0;

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__ZeroAmount.selector);
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: rejects when amount > available
    // ─────────────────────────────────────────────────────────────
    function test_lock_rejects_amountExceedsAvailable() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);
        p.amount = fundAmt + 1;

        vm.prank(maker);
        vm.expectRevert(AdManager.AdManager__InsufficientLiquidity.selector);
        adManager.lockForOrder(p);
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: opens order, locks balance, emits OrderLocked
    // ─────────────────────────────────────────────────────────────
    function test_lock_opensOrder_updatesLocked_emitsEvent() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        AdManager.OrderParams memory p = _defaultParams(adId);

        (,,, address adMaker, address token,, uint256 lockedBefore, bool open) = adManager.ads(adId);
        assertTrue(open);
        assertEq(lockedBefore, 0);

        bytes32 expectedHash = adManager.hashOrderPublic(p);

        vm.expectEmit(true, true, true, true);
        emit AdManager.OrderLocked(adId, expectedHash, adMaker, token, p.amount, p.bridger, p.orderRecipient);

        vm.prank(maker);
        bytes32 orderHash = adManager.lockForOrder(p);
        assertEq(orderHash, expectedHash, "order hash mismatch");

        (,,,,,, uint256 lockedAfter,) = adManager.ads(adId);
        assertEq(lockedAfter, lockedBefore + p.amount, "locked not incremented");

        (AdManager.Status status) = adManager.orders(orderHash);
        assertEq(uint256(status), uint256(AdManager.Status.Open), "order not open");
    }

    // ─────────────────────────────────────────────────────────────
    // lockForOrder: idempotency—same params (same salt) -> OrderExists
    // ─────────────────────────────────────────────────────────────
    function test_lock_idempotency_sameParamsSameSalt_revertsOrderExists() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();

        AdManager.OrderParams memory p = _defaultParams(adId);

        vm.prank(maker);
        bytes32 h1 = adManager.lockForOrder(p);

        vm.prank(maker);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__OrderExists.selector, h1));
        adManager.lockForOrder(p);
    }

    /*//////////////////////////////////////////////////////////////
                       withdrawAd: maker only
    ////////////////////////////////////////////////////////////////*/
    function test_withdrawAd_makerOnly() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();

        vm.prank(nonMaker);
        vm.expectRevert(AdManager.AdManager__NotMaker.selector);
        adManager.withdrawAd(adId, 1 ether, recipient);

        vm.prank(maker);
        adManager.withdrawAd(adId, 3 ether, recipient);
    }

    /*//////////////////////////////////////////////////////////////
                     withdrawAd: rejects zero amount
    ////////////////////////////////////////////////////////////////*/
    function test_withdrawAd_rejects_zeroAmount() public {
        test_fundAd_makerOnly();

        uint256 adId = _adId();

        vm.startPrank(maker);
        vm.expectRevert(AdManager.AdManager__ZeroAmount.selector);
        adManager.withdrawAd(adId, 0, recipient);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                    withdrawAd: rejects > available
    ////////////////////////////////////////////////////////////////*/
    function test_withdrawAd_rejects_gtAvailable() public {
        test_fundAd_makerOnly();

        uint256 adId = _adId();

        vm.startPrank(maker);
        // available = fundAmt, ask for fundAmt + 1
        vm.expectRevert(AdManager.AdManager__InsufficientLiquidity.selector);
        adManager.withdrawAd(adId, fundAmt + 1, recipient);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                          closeAd: maker only
    ////////////////////////////////////////////////////////////////*/
    function test_closeAd_makerOnly() public {
        test_createAd_succeedsWhenRouteExists_emitsAndStores();

        uint256 adId = _adId();

        vm.prank(nonMaker);
        vm.expectRevert(AdManager.AdManager__NotMaker.selector);
        adManager.closeAd(adId, recipient);
    }

    /*//////////////////////////////////////////////////////////////
                 closeAd: rejects when locked > 0
    ////////////////////////////////////////////////////////////////*/
    function test_closeAd_rejects_whenLocked_gt0() public {
        test_fundAd_makerOnly();

        uint256 adId = _adId();

        vm.startPrank(maker);

        // Prepare a minimal valid lock to set locked > 0
        AdManager.OrderParams memory p = _defaultParams(adId);

        // Lock succeeds -> increases ad.locked
        adManager.lockForOrder(p);

        vm.expectRevert(AdManager.AdManager__InsufficientLiquidity.selector);
        adManager.closeAd(adId, recipient);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
           closeAd: transfers remaining and marks closed
    ////////////////////////////////////////////////////////////////*/
    function test_closeAd_transfersRemaining_andMarksClosed() public {
        test_fundAd_makerOnly();

        uint256 adId = _adId();

        uint256 balBefore = adToken.balanceOf(recipient);

        // Close (no locks)
        vm.prank(maker);
        adManager.closeAd(adId, recipient);

        // Remaining transferred to recipient
        uint256 balAfter = adToken.balanceOf(recipient);
        assertEq(balAfter - balBefore, fundAmt, "remaining not transferred");

        // Ad is closed, balance set to 0
        (,,,,, uint256 balance, uint256 locked, bool open) = adManager.ads(adId);
        assertEq(balance, 0, "balance not zeroed");
        assertEq(locked, 0, "locked should be zero (no open locks)");
        assertFalse(open, "ad not closed");
    }

    /*//////////////////////////////////////////////////////////////
     * unlock: rejects when order not open
     //////////////////////////////////////////////////////////////*/
    function test_unlock_rejects_orderNotOpen() public {
        test_fundAd_makerOnly();

        uint256 adId = _adId();

        AdManager.OrderParams memory p = _defaultParams(adId);
        bytes32 expected = adManager.hashOrderPublic(p);

        vm.prank(bridger);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__OrderNotOpen.selector, expected));
        adManager.unlock(p, bytes32(uint256(1)), hex"");
    }

    function _openOrder(uint256 adId, uint256 amount, uint256 salt, address _bridger, address _recipient)
        internal
        returns (AdManager.OrderParams memory p, bytes32 orderHash)
    {
        p = _defaultParams(adId);
        p.amount = amount;
        p.salt = salt;
        p.bridger = _bridger;
        p.orderRecipient = _recipient;

        vm.prank(maker);
        orderHash = adManager.lockForOrder(p);
    }

    /*//////////////////////////////////////////////////////////////
     * unlock: rejects when nullifier already used
     *  - Unlock order A with N
     *  - Try to unlock distinct order B (still Open) with same N -> NullifierUsed
     //////////////////////////////////////////////////////////////*/
    function test_unlock_rejects_nullifierAlreadyUsed_onDifferentOpenOrder() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();

        // Open two orders with different salts
        (AdManager.OrderParams memory p1,) = _openOrder(adId, 80 ether, 777, bridger, recipient);
        (AdManager.OrderParams memory p2,) = _openOrder(adId, 90 ether, 778, other, recipient);

        bytes32 nullifier = keccak256("N");

        // First unlock succeeds
        vm.prank(bridger);
        adManager.unlock(p1, nullifier, hex"");

        // Second unlock with the same nullifier on a different (still open) order
        vm.prank(bridger);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__NullifierUsed.selector, nullifier));
        adManager.unlock(p2, nullifier, hex"");
    }

    /*//////////////////////////////////////////////////////////////
     * unlock: verifier false -> InvalidProof (state unchanged)
     //////////////////////////////////////////////////////////////*/
    function test_unlock_verifierFalse_revertsInvalidProof_andNoStateChange() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();

        (AdManager.OrderParams memory p, bytes32 orderHash) = _openOrder(adId, 70 ether, 999, bridger, recipient);

        // Snapshot state
        (,,,,,, uint256 lockedBefore,) = adManager.ads(p.adId);
        (AdManager.Status statusBefore) = adManager.orders(orderHash);
        assertEq(uint256(statusBefore), uint256(AdManager.Status.Open));

        // Flip verifier to fail
        verifier.setResult(false);

        vm.prank(bridger);
        vm.expectRevert(AdManager.AdManager__InvalidProof.selector);
        adManager.unlock(p, keccak256("X"), hex"");

        // State unchanged
        (AdManager.Status statusAfter) = adManager.orders(orderHash);
        assertEq(uint256(statusAfter), uint256(AdManager.Status.Open), "status changed");
        (,,,,,, uint256 lockedAfter,) = adManager.ads(p.adId);
        assertEq(lockedAfter, lockedBefore, "locked changed");
    }

    /*//////////////////////////////////////////////////////////////
     * unlock: verifier true -> status Filled, reduces locked
     * unlock: transfers ad.token to orderRecipient
     * unlock: emits OrderUnlocked
     * unlock: cannot unlock twice with same nullifier (same order -> OrderNotOpen on 2nd call)
     //////////////////////////////////////////////////////////////*/
    function test_unlock_success_flow_updatesState_transfers_emits_andPreventsRepeat() public {
        test_fundAd_makerOnly();
        uint256 adId = _adId();
        (AdManager.OrderParams memory p, bytes32 orderHash) = _openOrder(adId, 60 ether, 111, bridger, recipient);

        // Balances and locked snapshot
        uint256 balBefore = adToken.balanceOf(p.orderRecipient);
        (,,,,,, uint256 lockedBefore,) = adManager.ads(p.adId);

        // Expect event
        vm.expectEmit(true, true, true, true);
        emit AdManager.OrderUnlocked(orderHash, p.orderRecipient, bytes32("N1"));

        // Verify success
        vm.prank(bridger);
        adManager.unlock(p, bytes32("N1"), hex"");

        // Status -> Filled
        (AdManager.Status status) = adManager.orders(orderHash);
        assertEq(uint256(status), uint256(AdManager.Status.Filled), "status not filled");

        // Locked reduced
        (,,,,,, uint256 lockedAfter,) = adManager.ads(p.adId);
        assertEq(lockedAfter, lockedBefore - p.amount, "locked not reduced");

        // Tokens transferred to orderRecipient
        uint256 balAfter = adToken.balanceOf(p.orderRecipient);
        assertEq(balAfter - balBefore, p.amount, "recipient not paid");

        // Second call (same order) should fail (order not open anymore)
        vm.prank(bridger);
        vm.expectRevert(abi.encodeWithSelector(AdManager.AdManager__OrderNotOpen.selector, orderHash));
        adManager.unlock(p, bytes32("N1"), hex"");
    }
}
