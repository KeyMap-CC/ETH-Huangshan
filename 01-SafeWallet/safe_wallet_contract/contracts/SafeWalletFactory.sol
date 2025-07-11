// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./SafeWallet7702.sol";

/**
 * @title SafeWalletFactory
 * @dev Factory contract for deploying SafeWallet7702 instances.
 * Simplifies the creation of secure wallets with all necessary components.
 */
contract SafeWalletFactory {
    // Company address (security provider)
    address public companyAddress;
    
    // Events
    event WalletCreated(address indexed owner, address indexed wallet, address indexed vault);
    
    /**
     * @dev Constructor to set the company address
     * @param _companyAddress The address of the company (security provider)
     */
    constructor(address _companyAddress) {
        require(_companyAddress != address(0), "Invalid company address");
        companyAddress = _companyAddress;
    }
    
    /**
     * @dev Create a new SafeWallet7702 instance
     * @param _riskLevel The initial risk level
     * @return wallet The address of the created wallet
     * @return vault The address of the created vault
     */
    function createWallet(uint256 _riskLevel) public returns (address wallet, address vault) {
        // Deploy SafeWallet7702
        SafeWallet7702 safeWallet = new SafeWallet7702();
        
        // Initialize the wallet
        safeWallet.initialize(msg.sender, companyAddress, _riskLevel);
        
        // Get the vault address
        vault = safeWallet.getVault();
        
        emit WalletCreated(msg.sender, address(safeWallet), vault);
        
        return (address(safeWallet), vault);
    }
    
    /**
     * @dev Create a new SafeWallet7702 instance and transfer assets to the vault
     * @param _riskLevel The initial risk level
     * @param _tokens Array of ERC20 token addresses to transfer
     * @param _amounts Array of amounts to transfer for each token
     * @return wallet The address of the created wallet
     * @return vault The address of the created vault
     */
    function createWalletAndTransferAssets(
        uint256 _riskLevel,
        address[] calldata _tokens,
        uint256[] calldata _amounts
    ) external payable returns (address wallet, address vault) {
        require(_tokens.length == _amounts.length, "Length mismatch: tokens and amounts");
        
        // Create wallet
        (wallet, vault) = createWallet(_riskLevel);
        
        // Transfer ETH to vault if provided
        if (msg.value > 0) {
            (bool success, ) = vault.call{value: msg.value}("");
            require(success, "ETH transfer failed");
        }
        
        // Transfer ERC20 tokens to vault
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (_amounts[i] > 0) {
                (bool success, bytes memory data) = _tokens[i].call(
                    abi.encodeWithSignature("transferFrom(address,address,uint256)",
                    msg.sender,
                    vault,
                    _amounts[i])
                );
                require(success && (data.length == 0 || abi.decode(data, (bool))), "ERC20 transfer failed");
            }
        }
        
        return (wallet, vault);
    }
    
    /**
     * @dev Update the company address
     * @param _newCompanyAddress The new company address
     */
    function updateCompanyAddress(address _newCompanyAddress) external {
        require(msg.sender == companyAddress, "Only company can update");
        require(_newCompanyAddress != address(0), "Invalid company address");
        
        companyAddress = _newCompanyAddress;
    }
}