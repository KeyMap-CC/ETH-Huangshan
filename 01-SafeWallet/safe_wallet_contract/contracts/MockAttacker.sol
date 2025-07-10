// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockHoneypot {
    mapping(address => uint256) public balances;
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        
        // Always fail on withdraw to simulate honeypot
        revert("Transaction failed");
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

contract MockAttacker {
    MockHoneypot public honeypot;
    address public owner;
    
    constructor(address _honeypotAddress) {
        honeypot = MockHoneypot(_honeypotAddress);
        owner = msg.sender;
    }
    
    // Attack function that will be called by the SafeWallet
    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH to attack");
        
        // Deposit into honeypot
        honeypot.deposit{value: msg.value}();
        
        // Try to withdraw (will fail)
        honeypot.withdraw(msg.value);
    }
    
    // Get balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}