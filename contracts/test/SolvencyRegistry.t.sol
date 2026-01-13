// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SolvencyRegistry} from "../src/SolvencyRegistry.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

contract SolvencyRegistryTest is Test {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    SolvencyRegistry public registry;
    address public admin = address(1);
    address public oracle = address(2);
    address public company = address(3);
    uint256 public oraclePrivateKey = 0xA11CE;

    function setUp() public {
        registry = new SolvencyRegistry(admin); // Deployer doesn't explicitly matter as we pass admin param

        // Setup oracle key
        oracle = vm.addr(oraclePrivateKey);
        
        vm.startPrank(admin);
        registry.grantRole(registry.ORACLE_ROLE(), oracle);
        vm.stopPrank();
    }

    function test_OracleCanUpdateSolvency() public {
        vm.prank(oracle);
        registry.publishSolvency(company, 150, 200, block.timestamp);

        SolvencyRegistry.SolvencyData memory data = registry.getLatestSolvency(company);
        assertEq(data.solvencyRatio, 150);
        assertEq(data.liquidityRatio, 200);
    }

    function test_NonOracleCannotUpdateSolvency() public {
        vm.prank(company);
        vm.expectRevert(); // AccessControl error
        registry.publishSolvency(company, 150, 200, block.timestamp);
    }

    function test_SignatureBasedUpdate() public {
        uint256 solvency = 300;
        uint256 liquidity = 400;
        uint256 timestamp = block.timestamp + 100;

        // Generate signature
        bytes32 hash = keccak256(abi.encodePacked(company, solvency, liquidity, timestamp));
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(hash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oraclePrivateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        // Anyone can submit the valid signature
        vm.prank(address(0xDEAD)); 
        registry.publishProvableSolvency(company, solvency, liquidity, timestamp, signature);

        SolvencyRegistry.SolvencyData memory data = registry.getLatestSolvency(company);
        assertEq(data.solvencyRatio, solvency);
    }

    function test_RevertInvalidSignature() public {
         uint256 solvency = 300;
        uint256 liquidity = 400;
        uint256 timestamp = block.timestamp + 100;

        // Sign with wrong key
        uint256 wrongKey = 0xB0B;
        bytes32 hash = keccak256(abi.encodePacked(company, solvency, liquidity, timestamp));
        bytes32 ethSignedHash = hash.toEthSignedMessageHash();
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wrongKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);

        vm.prank(address(0xDEAD));
        vm.expectRevert("Invalid Oracle Signature");
        registry.publishProvableSolvency(company, solvency, liquidity, timestamp, signature);
    }
}
