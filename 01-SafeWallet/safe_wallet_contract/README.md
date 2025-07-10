# 安全钱包智能合约架构

这个项目实现了一个基于EIP-7702的安全钱包智能合约系统，具有AI交互界面和安全检测功能。

## 架构概述

该系统由以下主要组件组成：

1. **EIP-7702 CA合约** (`SafeWallet7702.sol`)
   - 实现EIP-7702标准的合约账户
   - 支持批量交易执行
   - 内置多签拒绝机制，用于安全验证
   - 代理合约功能

2. **金库合约** (`SafeVault.sol`)
   - 存储用户资产
   - 多签保护机制
   - 支持ETH、ERC20和NFT资产管理

3. **多签管理合约** (`MultiSigManager.sol`)
   - 处理多签逻辑
   - 支持权重投票
   - 拒绝类型的多签机制

4. **工厂合约** (`SafeWalletFactory.sol`)
   - 简化钱包创建流程
   - 支持一键部署完整钱包系统
   - 可选资产转移功能

5. **模板合约** (`SafeWalletTemplate.sol`)
   - 提供代理功能的实现
   - 扩展钱包功能

6. **接口合约** (`IEIP7702.sol`)
   - 定义EIP-7702标准接口
   - 确保合约兼容性

7. **测试合约** (`SafeWalletTest.sol`)
   - 演示如何使用钱包系统
   - 提供示例交互方法

## 功能特点

- **安全检测**：检测交易链路中的合约安全风险
- **账户抽象**：通过EIP-7702实现一次交易中执行多个操作
- **风险管理**：基于用户风险接受度的多签拒绝机制
- **资产保护**：通过金库合约保护用户资产
- **代理功能**：支持通过代理模式扩展功能
- **批量交易**：支持在单个交易中执行多个操作

## 合约交互流程

1. 用户通过AI界面发起交易请求
2. 后端分析交易链路中的合约安全风险
3. 根据风险评估，生成相应权重的签名
4. 如果风险超过用户设定的接受度，交易将被拒绝
5. 安全交易通过多签验证后执行

## 风险级别

系统支持多种风险接受度级别：

- **低风险** (10%): 对安全要求极高，拒绝权重为10%
- **平衡风险** (20%): 默认设置，拒绝权重为20%
- **高风险** (30%): 较为宽松，拒绝权重为30%
- **极高风险** (40%): 最宽松设置，拒绝权重为40%

## 技术实现

- 使用存储变量而非全局变量，防止slot覆盖问题
- 通过fallback方法处理代理合约替换请求
- 实现拒绝类型的多签机制，默认阈值50%
- 公司最多持有49%权重，用户至少持有51%权重
- 使用assembly进行低级存储操作，确保slot不冲突

## 使用指南

### 部署流程

1. 部署 `SafeWalletFactory` 合约，指定公司地址
2. 通过工厂合约创建钱包：
   ```solidity
   // 创建基本钱包
   (address wallet, address vault) = factory.createWallet(20); // 使用平衡风险级别
   
   // 创建钱包并转移资产
   (address wallet, address vault) = factory.createWalletAndTransferAssets(
       20,                // 风险级别
       [token1, token2],  // 代币地址数组
       [amount1, amount2] // 金额数组
   );
   ```

### 执行交易

```solidity
// 单笔交易
(bool success, bytes memory result) = wallet.execute(
    target,     // 目标地址
    value,      // ETH金额
    data,       // 调用数据
    signatures  // 拒绝签名数组
);

// 批量交易
bytes[] memory results = wallet.executeBatch(
    targets,    // 目标地址数组
    values,     // ETH金额数组
    data,       // 调用数据数组
    signatures  // 拒绝签名数组
);
```

### 金库操作

```solidity
// 从金库转出ETH
vault.executeTransfer(recipient, amount, signatures);

// 从金库转出ERC20代币
vault.executeERC20Transfer(token, recipient, amount, signatures);

// 从金库转出NFT
vault.executeNFTTransfer(token, recipient, tokenId, signatures);
```

## 安全注意事项

- 确保多签密钥安全存储
- 定期检查风险设置是否符合需求
- 避免将所有资产存储在单一合约中
- 使用代理功能时注意验证新实现的安全性