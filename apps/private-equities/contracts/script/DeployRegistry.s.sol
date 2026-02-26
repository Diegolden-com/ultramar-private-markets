// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SolvencyRegistry} from "../src/SolvencyRegistry.sol";

contract DeployRegistry is Script {
    function run() external {
        // Use the ORACLE_PRIVATE_KEY from .env if available, or a default Anvil key
        uint256 deployerPrivateKey = vm.envOr("ORACLE_PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));
        
        vm.startBroadcast(deployerPrivateKey);

        address admin = vm.addr(deployerPrivateKey);
        SolvencyRegistry registry = new SolvencyRegistry(admin);
        
        console.log("SolvencyRegistry deployed to:", address(registry));
        console.log("Admin/Oracle Address:", admin);

        vm.stopBroadcast();
    }
}
