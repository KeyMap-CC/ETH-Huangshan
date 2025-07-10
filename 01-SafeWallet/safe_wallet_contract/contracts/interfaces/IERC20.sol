// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @dev ERC20代币标准接口
 */
interface IERC20 {
    /**
     * @dev 返回代币的总供应量
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev 返回账户的代币余额
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev 将`amount`数量的代币从调用者转移到`to`
     * 成功时返回true
     * 当`amount`超过调用者余额时抛出异常
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev 返回`owner`授权给`spender`的代币数量
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev 设置`spender`可以代表调用者转移的代币数量
     * 成功时返回true
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev 将`amount`数量的代币从`from`转移到`to`
     * 成功时返回true
     * 当`from`的余额不足或`spender`的授权不足时抛出异常
     */
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    /**
     * @dev 当代币被转移时触发，包括零值转移
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev 当代币授权设置时触发
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
} 