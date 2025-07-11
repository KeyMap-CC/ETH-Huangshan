// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title SafeWalletTimelock
 * @dev 时间锁控制器，用于DAO治理
 */
contract SafeWalletTimelock is TimelockController {
    /**
     * @dev 构造函数
     * @param minDelay 最小延迟时间（秒）
     * @param proposers 提案者地址列表
     * @param executors 执行者地址列表
     * @param admin 管理员地址
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
} 