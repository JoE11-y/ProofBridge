// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "forge-std/console2.sol";

import {HonkVerifier} from "src/Verifier.sol";
import {AdManager} from "src/AdManager.sol";
import {OrderPortal} from "src/OrderPortal.sol";
import {IVerifier} from "src/Verifier.sol";

contract Proofbridge is Script {
    function _envOrAddress(string memory key, address fallback_) internal view returns (address out) {
        try vm.envAddress(key) returns (address v) {
            out = v;
        } catch {
            out = fallback_;
        }
    }

    function run() external {
        // --- Load deployer ---
        uint256 pk = vm.envUint("PRIVATE_KEY");
        require(pk != 0, "PRIVATE_KEY not set");
        address deployer = vm.addr(pk);

        // --- Choose admin (defaults to deployer, can override via ADMIN env var) ---
        address adminDefault = deployer;
        address admin = _envOrAddress("ADMIN", adminDefault);

        vm.startBroadcast(pk);

        // --- Verifier: reuse or deploy ---
        address verifierMaybe = _envOrAddress("VERIFIER", address(0));
        IVerifier verifier;
        if (verifierMaybe == address(0)) {
            verifier = IVerifier(address(new HonkVerifier()));
            console2.log("Deployed Verifier    :", address(verifier));
        } else {
            verifier = IVerifier(verifierMaybe);
            console2.log("Reusing Verifier     :", address(verifier));
        }

        // --- Deploy AdManager & OrderPortal ---
        AdManager adManager = new AdManager(admin, verifier);
        console2.log("Deployed AdManager   :", address(adManager));

        OrderPortal orderPortal = new OrderPortal(admin, verifier);
        console2.log("Deployed OrderPortal :", address(orderPortal));

        vm.stopBroadcast();
    }
}
