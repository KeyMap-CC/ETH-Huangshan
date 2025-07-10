// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

/// @title GovernanceToken
/// @notice A simple ERC20 token used for governance in the AlgorithmReview DAO
contract GovernanceToken is ERC20, Ownable {
    constructor() ERC20("Algorithm Governance Token", "AGT") Ownable(msg.sender) {
        // Mint initial supply to the contract creator
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    /// @notice Allows the owner to mint new tokens to specific addresses
    /// @param to The address that will receive the minted tokens
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
} 