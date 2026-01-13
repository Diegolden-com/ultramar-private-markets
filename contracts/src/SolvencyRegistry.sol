// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "openzeppelin-contracts/contracts/access/AccessControl.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title SolvencyRegistry
 * @dev Stores and verifies solvency proofs for companies using the Ultramar Oracle.
 */
contract SolvencyRegistry is AccessControl {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct SolvencyData {
        uint256 solvencyRatio;    // (Assets - Liabilities) / Liabilities * 100
        uint256 liquidityRatio;   // Current Assets / Current Liabilities * 100
        uint256 timestamp;
        uint256 blockNumber;
    }

    // Company Address => Solvency History
    mapping(address => SolvencyData) public latestSolvency;
    mapping(address => SolvencyData[]) public solvencyHistory;

    event SolvencyUpdated(address indexed company, uint256 solvencyRatio, uint256 liquidityRatio, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_ROLE, admin);
    }

    /**
     * @dev Publishes a new solvency record. 
     *      Can be called by the Oracle directly OR by anyone submitting a valid signature from the Oracle.
     *      For V1, we simply restrict it to the Oracle role to save gas on verification/calldata, 
     *      but we support signature verification for "lazy" updates if needed later.
     */
    function publishSolvency(
        address company,
        uint256 solvencyRatio,
        uint256 liquidityRatio,
        uint256 timestamp
    ) external onlyRole(ORACLE_ROLE) {
        _updateSolvency(company, solvencyRatio, liquidityRatio, timestamp);
    }

    function publishProvableSolvency(
        address company,
        uint256 solvencyRatio,
        uint256 liquidityRatio,
        uint256 timestamp,
        bytes calldata signature
    ) external {
        bytes32 hash = keccak256(abi.encodePacked(company, solvencyRatio, liquidityRatio, timestamp));
        // EIP-191 Signed Message Header
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(hash);
        
        address signer = ECDSA.recover(ethSignedHash, signature);
        require(hasRole(ORACLE_ROLE, signer), "Invalid Oracle Signature");
        require(timestamp > latestSolvency[company].timestamp, "Stale proof");

        _updateSolvency(company, solvencyRatio, liquidityRatio, timestamp);
    }

    function _updateSolvency(
        address company,
        uint256 solvencyRatio,
        uint256 liquidityRatio,
        uint256 timestamp
    ) internal {
        SolvencyData memory newData = SolvencyData({
            solvencyRatio: solvencyRatio,
            liquidityRatio: liquidityRatio,
            timestamp: timestamp,
            blockNumber: block.number
        });

        latestSolvency[company] = newData;
        solvencyHistory[company].push(newData);

        emit SolvencyUpdated(company, solvencyRatio, liquidityRatio, timestamp);
    }

    function getLatestSolvency(address company) external view returns (SolvencyData memory) {
        return latestSolvency[company];
    }
}
