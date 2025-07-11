// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/// @title DataContribution
/// @notice Record data registration and usage behavior for community contribution analysis
/// @dev Designed to work with an event-driven off-chain indexing system

contract DataContribution {
    address public owner;
    IERC20 public daoToken;

    //消耗值
    
    event DataRegistered(address indexed contributor, string indexed cid);
    event DataUsed(address indexed scientist, string indexed cid, string dataset, uint256 when);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address daoAddress, address daoTokenAddress) {
        owner = daoAddress;
        daoToken = IERC20(daoTokenAddress);
    }

    // 消耗代币
    function consumeToken(uint256 amount) external {
        require(daoToken.transferFrom(msg.sender, owner, amount), "Token transfer failed");
    }

    /// @notice Register a new data contribution on behalf of the user
    /// @param contributor The address that contributed the data
    /// @param cid The IPFS CID representing the data
    function registerData(address contributor, string calldata cid) external {
        // 调用这个放
        require(bytes(cid).length <= 64, "CID too long");
        emit DataRegistered(contributor, cid);
    }
}
