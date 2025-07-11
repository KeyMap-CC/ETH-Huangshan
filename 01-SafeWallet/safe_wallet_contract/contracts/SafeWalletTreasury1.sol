// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SafeWalletTreasury
 * @dev 金库合约，用户存入150 USDT可获得100个SWT代币
 * 该合约由DAO控制
 */
contract SafeWalletTreasury is Ownable, ReentrancyGuard, Pausable {
    // USDT合约地址
    address public usdtToken;
    
    // SWT代币合约地址
    address public swtToken;
    
    // 兑换比例：用户需要存入的USDT数量
    uint256 public requiredUsdtAmount = 150 * 10**18; // 150 USDT (考虑到USDT是18位小数)
    
    // 兑换比例：用户可以获得的SWT数量
    uint256 public rewardSwtAmount = 100 * 10**18; // 100 SWT (考虑到SWT是18位小数)
    
    // 记录用户已兑换的SWT总量
    mapping(address => uint256) public userExchangedAmount;
    
    // 事件
    event TokensExchanged(address indexed user, uint256 usdtAmount, uint256 swtAmount);
    event RatesUpdated(uint256 newRequiredUsdtAmount, uint256 newRewardSwtAmount);
    event EmergencyWithdraw(address token, address to, uint256 amount);
    
    /**
     * @dev 构造函数
     * @param _usdtToken USDT代币合约地址
     * @param _swtToken SWT代币合约地址
     */
    constructor(address _usdtToken, address _swtToken, address owner) Ownable(owner) {
        require(_usdtToken != address(0), "Invalid USDT address");
        require(_swtToken != address(0), "Invalid SWT address");
        
        usdtToken = _usdtToken;
        swtToken = _swtToken;
    }

    // 查询用户是否已经兑换过
    function isExchanged(address _user) external view returns (bool) {
        return userExchangedAmount[_user] > 0;
    }



    /**
     * @dev 用户存入USDT并获得SWT
     * 用户需要先授权本合约使用其USDT
     */
    function exchangeTokens(address recipient) external {
        // 检查金库中是否有足够的SWT
        // uint aa = IERC20(swtToken).balanceOf(address(this));
       
        // require(aa >= rewardSwtAmount, "Insufficient SWT in treasury");
        
        // // // // 转移USDT到金库
        // require(IERC20(usdtToken).transferFrom(recipient, address(this), requiredUsdtAmount), "USDT transfer failed");
        
        // // // 转移SWT到用户
        // require(IERC20(swtToken).transferFrom(address(this), recipient, rewardSwtAmount), "SWT transfer failed");
        
        // 更新用户兑换记录
        userExchangedAmount[recipient] += rewardSwtAmount;
        
        // 触发事件
        emit TokensExchanged(recipient, requiredUsdtAmount, rewardSwtAmount);
    }
    
    /**
     * @dev 更新兑换比例
     * @param _newRequiredUsdtAmount 新的USDT数量要求
     * @param _newRewardSwtAmount 新的SWT奖励数量
     */
    function updateExchangeRates(uint256 _newRequiredUsdtAmount, uint256 _newRewardSwtAmount) external onlyOwner {
        require(_newRequiredUsdtAmount > 0, "USDT amount must be > 0");
        require(_newRewardSwtAmount > 0, "SWT amount must be > 0");
        
        requiredUsdtAmount = _newRequiredUsdtAmount;
        rewardSwtAmount = _newRewardSwtAmount;
        
        emit RatesUpdated(_newRequiredUsdtAmount, _newRewardSwtAmount);
    }
    
    /**
     * @dev 暂停兑换功能
     */
    function pauseExchange() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev 恢复兑换功能
     */
    function unpauseExchange() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev 紧急提款功能，
     * @param _token 要提取的代币地址
     * @param _to 接收地址
     * @param _amount 提取数量
     */
    function emergencyWithdraw(address _token, address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Cannot withdraw to zero address");
        
        IERC20 token = IERC20(_token);
        require(token.transfer(_to, _amount), "Token transfer failed");
        
        emit EmergencyWithdraw(_token, _to, _amount);
    }
    
    /**
     * @dev 查询用户可以兑换的SWT数量
     * @param _user 用户地址
     * @return 可兑换的SWT数量
     */
    function getExchangeableAmount(address _user) external view returns (uint256) {
        uint256 usdtAllowance = IERC20(usdtToken).allowance(_user, address(this));
        uint256 usdtBalance = IERC20(usdtToken).balanceOf(_user);
        
        // 用户需要有足够的USDT余额和授权
        if (usdtAllowance < requiredUsdtAmount || usdtBalance < requiredUsdtAmount) {
            return 0;
        }
        
        // 金库需要有足够的SWT
        if (IERC20(swtToken).balanceOf(address(this)) < rewardSwtAmount) {
            return 0;
        }
        
        return rewardSwtAmount;
    }
} 