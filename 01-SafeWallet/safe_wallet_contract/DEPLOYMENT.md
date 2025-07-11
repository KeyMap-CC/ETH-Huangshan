# Sepolia测试网部署指南

## 准备工作

### 1. 获取Sepolia测试网ETH
在部署之前，您需要确保您的账户有足够的Sepolia测试网ETH。您可以从以下水龙头获取：
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

### 2. 配置环境变量
1. 复制环境变量示例文件：
   ```bash
   cp env.example .env
   ```

2. 编辑 `.env` 文件，填入您的私钥：
   ```
   PRIVATE_KEY=your_private_key_here
   ```

**⚠️ 安全提醒：**
- 永远不要将私钥提交到Git仓库
- 确保 `.env` 文件已添加到 `.gitignore`
- 使用测试账户的私钥，不要使用主网账户

### 3. 更新Hardhat配置
如果需要，您可以在 `hardhat.config.js` 中更新Sepolia网络配置：

```javascript
sepolia: {
  url: "https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 11155111,
  gas: 2100000,
  gasPrice: 8000000000
}
```

## 部署步骤

### 方法1：使用npm脚本（推荐）

1. **编译合约**：
   ```bash
   npm run compile
   ```

2. **部署所有合约**：
   ```bash
   npm run deploy:sepolia
   ```

3. **仅部署主要合约**：
   ```bash
   npm run deploy:main
   ```

### 方法2：直接使用Hardhat命令

1. **部署所有合约**：
   ```bash
   npx hardhat run scripts/deploy_sepolia.js --network sepolia
   ```

2. **部署主要合约**：
   ```bash
   npx hardhat run scripts/deploy_main_contracts.js --network sepolia
   ```

## 部署的合约

### 主要合约
- **SafeWalletTemplate**: 钱包模板合约
- **SafeWalletFactory**: 钱包工厂合约
- **SafeVault**: 安全金库合约
- **MultiSigManager**: 多签管理器合约

### 测试合约
- **SafeWalletTest**: 钱包测试合约
- **MockAttacker**: 模拟攻击者合约
- **HoneypotContract**: 蜜罐合约
- **HoneypotAttacker**: 蜜罐攻击者合约

## 部署后验证

### 1. 检查部署信息
部署完成后，会生成以下文件：
- `deployment-sepolia.json`: 所有合约的部署信息
- `deployment-main-sepolia.json`: 主要合约的部署信息

### 2. 在Sepolia区块浏览器中验证
1. 访问 [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. 搜索部署的合约地址
3. 验证合约代码（可选）

### 3. 合约交互测试
部署完成后，您可以使用以下方式测试合约：
- 使用Hardhat控制台
- 编写测试脚本
- 使用前端应用

## 故障排除

### 常见问题

1. **Gas费用不足**
   - 确保账户有足够的Sepolia ETH
   - 调整 `hardhat.config.js` 中的gas设置

2. **网络连接问题**
   - 检查网络连接
   - 验证RPC URL是否正确
   - 尝试使用不同的RPC提供商

3. **合约编译错误**
   - 运行 `npm run compile` 检查编译错误
   - 确保所有依赖都已安装

4. **私钥配置错误**
   - 确保私钥格式正确（64位十六进制字符串）
   - 检查私钥是否包含0x前缀

### 获取帮助
如果遇到问题，请检查：
1. Hardhat控制台输出
2. 网络连接状态
3. 账户余额
4. 合约编译状态

## 安全注意事项

1. **私钥安全**
   - 使用测试账户，不要使用主网账户
   - 不要在代码中硬编码私钥
   - 定期更换测试账户

2. **合约安全**
   - 在部署到主网之前，充分测试所有功能
   - 考虑进行安全审计
   - 使用多签钱包管理重要合约

3. **网络安全**
   - 使用HTTPS连接
   - 验证RPC提供商的可信度
   - 监控网络活动 