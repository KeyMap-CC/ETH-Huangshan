// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title SafeWalletTemplate
 * @dev Template implementation contract for the SafeWallet7702 proxy.
 * Provides additional functionality that can be accessed through the proxy pattern.
 */
contract SafeWalletTemplate {
    // Storage layout to prevent slot collision
    bytes32 private constant OWNER_SLOT = keccak256("wallet.owner");
    bytes32 private constant MULTISIG_SLOT = keccak256("wallet.multisig");
    bytes32 private constant VAULT_SLOT = keccak256("wallet.vault");
    bytes32 private constant INITIALIZED_SLOT = keccak256("wallet.initialized");
    bytes32 private constant IMPLEMENTATION_SLOT = keccak256("wallet.implementation");
    bytes32 private constant NONCE_SLOT = keccak256("wallet.nonce");
    
    // Events
    event BatchTransferToVault(address[] tokens, uint256[] amounts);
    
    /**
     * @dev Check if this contract is a template
     * @return Always returns true for our template
     */
    function safeWalletTemplate() external pure returns (bool) {
        return true;
    }
    
    /**
     * @dev Transfer multiple ERC20 tokens to the vault in a single transaction
     * @param _tokens Array of ERC20 token addresses
     * @param _amounts Array of amounts to transfer
     */
    function transferToVault(
        address[] calldata _tokens,
        uint256[] calldata _amounts
    ) external {
        require(_tokens.length == _amounts.length, "Length mismatch: tokens and amounts");
        require(msg.sender == _getOwner(), "Only owner can transfer");
        
        address vault = _getVault();
        require(vault != address(0), "Vault not set");
        
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
        
        emit BatchTransferToVault(_tokens, _amounts);
    }
    
    /**
     * @dev Get the risk level from the multi-signature manager
     * @return The current risk level
     */
    function getRiskLevel() external view returns (uint256) {
        address multisig = _getMultiSig();
        require(multisig != address(0), "MultiSig not set");
        
        (bool success, bytes memory data) = multisig.staticcall(
            abi.encodeWithSignature("getRiskLevel()")
        );
        require(success, "Failed to get risk level");
        
        return abi.decode(data, (uint256));
    }
    
    /**
     * @dev Change the risk level in the multi-signature manager
     * @param _riskLevel The new risk level
     */
    function changeRiskLevel(uint256 _riskLevel) external {
        require(msg.sender == _getOwner(), "Only owner can change risk level");
        
        address multisig = _getMultiSig();
        require(multisig != address(0), "MultiSig not set");
        
        (bool success, ) = multisig.call(
            abi.encodeWithSignature("changeRiskLevel(uint256)", _riskLevel)
        );
        require(success, "Failed to change risk level");
    }
    
    /**
     * @dev Get the total balance of the wallet and vault
     * @return walletBalance The balance of the wallet
     * @return vaultBalance The balance of the vault
     * @return totalBalance The total balance
     */
    function getTotalBalance() external view returns (
        uint256 walletBalance,
        uint256 vaultBalance,
        uint256 totalBalance
    ) {
        walletBalance = address(this).balance;
        
        address vault = _getVault();
        if (vault != address(0)) {
            vaultBalance = vault.balance;
        }
        
        totalBalance = walletBalance + vaultBalance;
        
        return (walletBalance, vaultBalance, totalBalance);
    }
    
    // Internal functions for storage management
    
    function _getOwner() internal view returns (address owner) {
        bytes32 slot = OWNER_SLOT;
        assembly {
            owner := sload(slot)
        }
    }
    
    function _getMultiSig() internal view returns (address multisig) {
        bytes32 slot = MULTISIG_SLOT;
        assembly {
            multisig := sload(slot)
        }
    }
    
    function _getVault() internal view returns (address vault) {
        bytes32 slot = VAULT_SLOT;
        assembly {
            vault := sload(slot)
        }
    }
}