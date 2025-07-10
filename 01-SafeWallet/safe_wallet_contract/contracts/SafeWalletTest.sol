// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./SafeWalletFactory.sol";
import "./IEIP7702.sol";

/**
 * @title SafeWalletTest
 * @dev Test contract to demonstrate how to use the SafeWallet7702 system.
 */
contract SafeWalletTest {
    // Events
    event WalletCreated(address indexed wallet, address indexed vault);
    event TransactionExecuted(address indexed target, uint256 value, bytes data, bool success);
    event BatchExecuted(address[] targets, uint256[] values, bool success);
    
    // Factory address
    SafeWalletFactory public factory;
    
    /**
     * @dev Constructor to set the factory address
     * @param _factory The address of the SafeWalletFactory
     */
    constructor(address _factory) {
        require(_factory != address(0), "Invalid factory address");
        factory = SafeWalletFactory(_factory);
    }
    
    /**
     * @dev Create a new wallet with the specified risk level
     * @param _riskLevel The risk level
     * @return wallet The address of the created wallet
     * @return vault The address of the created vault
     */
    function createWallet(uint256 _riskLevel) external returns (address wallet, address vault) {
        (wallet, vault) = factory.createWallet(_riskLevel);
        
        emit WalletCreated(wallet, vault);
        
        return (wallet, vault);
    }
    
    /**
     * @dev Execute a transaction through the wallet
     * @param _wallet The wallet address
     * @param _target The target address
     * @param _value The value to send
     * @param _data The call data
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     * @return success Whether the transaction was successful
     * @return result The result of the transaction
     */
    function executeTransaction(
        address _wallet,
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external returns (bool success, bytes memory result) {
        require(_wallet != address(0), "Invalid wallet address");
        
        IEIP7702 wallet = IEIP7702(_wallet);
        
        (success, result) = wallet.execute(_target, _value, _data, _userWeight, _companyWeight, _userSignature, _companySignature);
        
        emit TransactionExecuted(_target, _value, _data, success);
        
        return (success, result);
    }
    
    /**
     * @dev Execute a batch of transactions through the wallet
     * @param _wallet The wallet address
     * @param _targets The target addresses
     * @param _values The values to send
     * @param _data The call data for each transaction
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     * @return results The results of each transaction
     */
    function executeBatch(
        address _wallet,
        address[] calldata _targets,
        uint256[] calldata _values,
        bytes[] calldata _data,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external returns (bytes[] memory results) {
        require(_wallet != address(0), "Invalid wallet address");
        
        IEIP7702 wallet = IEIP7702(_wallet);
        
        results = wallet.executeBatch(_targets, _values, _data, _userWeight, _companyWeight, _userSignature, _companySignature);
        
        emit BatchExecuted(_targets, _values, true);
        
        return results;
    }
    
    /**
     * @dev Example function to demonstrate a simple transaction
     * @param _wallet The wallet address
     * @param _to The recipient address
     * @param _amount The amount to send
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     * @return success Whether the transaction was successful
     */
    function exampleTransfer(
        address _wallet,
        address payable _to,
        uint256 _amount,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external returns (bool success) {
        require(_wallet != address(0), "Invalid wallet address");
        require(_to != address(0), "Invalid recipient address");
        
        // Create the call data for a transfer
        bytes memory data = "";
        
        // Execute the transaction
        (success, ) = this.executeTransaction(_wallet, _to, _amount, data, _userWeight, _companyWeight, _userSignature, _companySignature);
        
        return success;
    }
    
    /**
     * @dev Example function to demonstrate a batch transaction
     * @param _wallet The wallet address
     * @param _recipients The recipient addresses
     * @param _amounts The amounts to send to each recipient
     * @param _userWeight The user's rejection weight for this transaction
     * @param _companyWeight The company's rejection weight for this transaction
     * @param _userSignature The user's signature for the transaction
     * @param _companySignature The company's signature for the transaction
     * @return success Whether the batch execution was successful
     */
    function exampleBatchTransfer(
        address _wallet,
        address payable[] calldata _recipients,
        uint256[] calldata _amounts,
        uint256 _userWeight,
        uint256 _companyWeight,
        bytes memory _userSignature,
        bytes memory _companySignature
    ) external returns (bool success) {
        require(_wallet != address(0), "Invalid wallet address");
        require(_recipients.length == _amounts.length, "Length mismatch");
        require(_recipients.length > 0, "Empty recipients");
        
        // Prepare the batch parameters
        address[] memory targets = new address[](_recipients.length);
        uint256[] memory values = new uint256[](_recipients.length);
        bytes[] memory data = new bytes[](_recipients.length);
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            targets[i] = _recipients[i];
            values[i] = _amounts[i];
            data[i] = "";
        }
        
        // Execute the batch
        bytes[] memory results = this.executeBatch(_wallet, targets, values, data, _userWeight, _companyWeight, _userSignature, _companySignature);
        
        // Check if all transactions were successful
        success = results.length == _recipients.length;
        
        return success;
    }
}