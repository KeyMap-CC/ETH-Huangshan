# 优化部署指南

## 问题解决

我们解决了部署合约时gas消耗过高的问题。主要原因是：

1. 之前的配置中设置了固定的gas limit (`gas: 2100000`)，导致每个交易都使用过高的gas
2. gas价格设置过高 (`gasPrice: 8000000000` = 8 Gwei)，超过了Sepolia测试网的实际需求

## 优化措施

1. **移除固定gas limit**：让网络自动估算每个交易所需的gas
2. **降低gas价格**：从8 Gwei降低到1.5 Gwei
3. **添加gas使用监控**：在部署脚本中添加了部署成本计算和报告
4. **创建单个合约部署脚本**：可以更精细地控制部署过程

## 使用方法

### 1. 部署单个合约

这是最推荐的方法，可以逐个部署合约，控制gas使用：

```bash
# 部署不需要构造函数参数的合约
npm run deploy:single SafeWalletTemplate

# 部署需要构造函数参数的合约
npm run deploy:single SafeWalletFactory 0x123...abc
```

### 2. 部署主要合约

如果您想一次性部署所有主要合约：

```bash
npm run deploy:main
```

### 3. 部署测试合约

只部署一个测试合约，验证配置：

```bash
npm run deploy:test
```

### 4. 部署蜜罐合约

部署蜜罐合约和攻击者合约：

```bash
npm run deploy:honeypot
```

## 部署顺序建议

为了最大限度地节省gas，建议按以下顺序部署：

1. 先部署一个测试合约，验证配置：
   ```bash
   npm run deploy:test
   ```

2. 部署SafeWalletTemplate合约：
   ```bash
   npm run deploy:single SafeWalletTemplate
   ```

3. 使用SafeWalletTemplate地址部署SafeWalletFactory：
   ```bash
   npm run deploy:single SafeWalletFactory 0x123...abc
   ```

4. 部署其他合约：
   ```bash
   npm run deploy:single SafeVault
   npm run deploy:single MultiSigManager
   npm run deploy:single SafeWallet7702
   ```

## 监控部署成本

每次部署后，脚本会输出部署花费的ETH数量，并将其保存在部署信息文件中。这样您可以跟踪每个合约的部署成本。

## 调整gas价格

如果部署仍然太慢或失败，您可以在hardhat.config.js中调整gasPrice：

```javascript
sepolia: {
  // ...
  gasPrice: 2000000000 // 增加到2 Gwei
}
```

## 注意事项

1. 确保账户有足够的Sepolia ETH
2. 如果交易长时间未确认，可能需要稍微提高gasPrice
3. 部署大型合约可能需要更多gas，请确保账户余额充足

## 故障排除

如果遇到"insufficient funds"错误：
1. 检查账户余额
2. 尝试单独部署合约
3. 如果是大型合约，可能需要更多ETH 