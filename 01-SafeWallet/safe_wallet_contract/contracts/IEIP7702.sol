// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title IEIP7702
 * @dev Interface for EIP-7702 Contract Account standard.
 * Defines the required functions for EIP-7702 compatibility.
 */
interface IEIP7702 {
    /**
     * @dev Execute a single transaction
     * @param _target The target address
     * @param _value The value to send
     * @param _data The call data
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     * @return success Whether the transaction was successful
     * @return result The result of the transaction
     */
    function execute(
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external returns (bool success, bytes memory result);
    
    /**
     * @dev Execute multiple transactions in a batch
     * @param _targets The target addresses
     * @param _values The values to send
     * @param _data The call data for each transaction
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction and weights
     * @param _companySignature The company's signature for the transaction and weights
     * @return results The results of each transaction
     */
    function executeBatch(
        address[] calldata _targets,
        uint256[] calldata _values,
        bytes[] calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external returns (bytes[] memory results);
    
    /**
     * @dev Get the current nonce
     * @return The current nonce
     */
    function getNonce() external view returns (uint256);
}