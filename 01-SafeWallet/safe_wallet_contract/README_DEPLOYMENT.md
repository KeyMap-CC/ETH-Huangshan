# Sepolia测试网部署脚本

## 快速开始

### 1. 配置环境变量
```bash
# 复制环境变量文件
cp env.example .env

# 编辑 .env 文件，填入您的私钥
PRIVATE_KEY=your_private_key_here
```

### 2. 编译合约
```bash
npm run compile
```

### 3. 部署合约

#### 测试部署（推荐先运行）
```bash
npm run deploy:test
```

#### 部署主要合约
```bash
npm run deploy:main
```

#### 部署所有合约
```bash
npm run deploy:sepolia
```

#### 部署蜜罐合约（仅测试用）
```bash
npm run deploy:honeypot
```

## 脚本说明

- `scripts/deploy_test.js` - 测试部署脚本，部署单个合约验证配置
- `scripts/deploy_main_contracts.js` - 部署主要合约（SafeWalletTemplate, SafeWalletFactory, SafeVault, MultiSigManager）
- `scripts/deploy_sepolia.js` - 部署主要生产合约（不包含测试合约）
- `scripts/deploy_honeypot.js` - 部署蜜罐合约和攻击者合约（仅测试用）

## 部署信息

部署完成后，会生成以下文件：
- `deployment-sepolia.json` - 主要生产合约的部署信息
- `deployment-main-sepolia.json` - 主要合约的部署信息
- `deployment-honeypot-sepolia.json` - 蜜罐合约的部署信息

## 注意事项

1. **确保有足够的Sepolia ETH** - 可以从 [Sepolia Faucet](https://sepoliafaucet.com/) 获取
2. **使用测试账户** - 不要使用主网账户的私钥
3. **检查网络连接** - 确保可以访问Sepolia测试网

## 故障排除

如果遇到问题，请检查：
- 私钥格式是否正确
- 账户是否有足够的ETH
- 网络连接是否正常
- 合约是否编译成功

详细说明请参考 `DEPLOYMENT.md` 文件。 