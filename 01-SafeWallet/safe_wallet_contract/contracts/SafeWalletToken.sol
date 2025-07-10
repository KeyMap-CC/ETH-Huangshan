// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";
// npm install @openzeppelin/contracts

/// @title SafeWalletToken
contract SafeWalletToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    constructor(address quzi) 
        ERC20("Safe Wallet Token", "SWT") 
        ERC20Permit("Safe Wallet Token")
        Ownable(msg.sender) 
    {
        // Mint initial supply to the contract creator
        _mint(msg.sender, 1000000 * 10 ** decimals());
        _mint(quzi, 1000000 * 10 ** decimals());
    }

    /// @notice Allows the owner to mint new tokens to specific addresses
    /// @param to The address that will receive the minted tokens
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    // 以下函数是为了实现ERC20Votes接口所必需的
    
    function _update(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
} 