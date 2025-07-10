# 项目设置指南

## 1. 环境变量配置

### 创建环境变量文件
项目已经为您创建了 `.env` 文件，您需要编辑它来配置您的私钥。

### 编辑 .env 文件
打开 `.env` 文件，将以下内容：
```
PRIVATE_KEY=your_private_key_here
```

替换为您的实际私钥：
```
PRIVATE_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### 私钥格式要求
- 必须是64位十六进制字符串
- 不包含 `0x` 前缀
- 不要包含空格或其他字符

### 获取私钥的方法
1. **MetaMask**:
   - 打开MetaMask
   - 点击账户图标 → 账户详情
   - 点击"导出私钥"
   - 输入密码后复制私钥

2. **其他钱包**:
   - 根据您使用的钱包，找到导出私钥的选项
   - 确保导出的是私钥，不是助记词

## 2. 获取Sepolia测试网ETH

在部署之前，您需要确保账户有足够的Sepolia测试网ETH：

### 推荐的水龙头
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

### 获取步骤
1. 访问上述任一水龙头
2. 输入您的钱包地址
3. 等待几分钟接收ETH

## 3. 验证配置

### 检查编译
```bash
npm run compile
```

### 检查网络连接
```bash
npx hardhat console --network sepolia
```

## 4. 常见问题

### 问题1: "private key too short"
**原因**: 私钥格式不正确
**解决**: 确保私钥是64位十六进制字符串，不包含0x前缀

### 问题2: "insufficient funds"
**原因**: 账户余额不足
**解决**: 从Sepolia水龙头获取测试网ETH

### 问题3: "network error"
**原因**: 网络连接问题
**解决**: 检查网络连接，或更换RPC提供商

## 5. 安全提醒

⚠️ **重要安全提醒**:
- 永远不要将私钥提交到Git仓库
- 使用测试账户的私钥，不要使用主网账户
- 定期更换测试账户
- 确保 `.env` 文件已添加到 `.gitignore`

## 6. 下一步

配置完成后，您可以：
1. 运行测试部署: `npm run deploy:test`
2. 部署主要合约: `npm run deploy:main`
3. 部署所有合约: `npm run deploy:sepolia`

详细说明请参考 `DEPLOYMENT.md` 文件。 