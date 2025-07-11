# SafeWalletToken 部署指南

本文档介绍如何部署和验证SafeWalletToken代币合约到Sepolia测试网。

## 准备工作

### 1. 确保环境配置正确

确保您已经按照`SETUP.md`中的说明配置了环境：

- 安装了所有依赖
- 配置了`.env`文件，包含有效的私钥
- 账户中有足够的Sepolia测试网ETH

### 2. 确认OpenZeppelin合约库已安装

SafeWalletToken依赖于OpenZeppelin合约库。确认是否已安装：

```bash
npm list @openzeppelin/contracts
```

如果未安装，请执行：

```bash
npm install @openzeppelin/contracts
```

## 部署代币

### 1. 编译合约

首先确保合约编译成功：

```bash
npm run compile
```

### 2. 部署代币合约

执行以下命令部署SafeWalletToken合约：

```bash
npm run deploy:token
```

部署脚本会：
- 使用指定的quzi地址（0xc70025f24be879be9258ac41932bae873bf7ff0a）
- 部署SafeWalletToken合约
- 显示代币信息（名称、符号、总供应量等）
- 计算部署花费
- 保存部署信息到`deployment-token-sepolia.json`文件

### 3. 验证合约

部署完成后，您可以验证合约，使其在Etherscan上可见：

```bash
npm run verify:token
```

验证脚本会：
- 读取部署信息
- 在Etherscan上验证合约
- 显示验证结果

## 代币信息

SafeWalletToken (SWT) 是一个标准的ERC20代币，具有以下特点：

- 名称: Safe Wallet Token
- 符号: SWT
- 小数位: 18
- 初始供应量: 2,000,000 SWT
  - 1,000,000 SWT 分配给部署者
  - 1,000,000 SWT 分配给quzi地址

## 代币功能

SafeWalletToken具有以下功能：

1. **标准ERC20功能**：
   - 转账 (transfer)
   - 授权转账 (approve/transferFrom)
   - 查询余额 (balanceOf)
   - 查询总供应量 (totalSupply)

2. **铸造功能**：
   - 合约所有者可以铸造新代币到指定地址
   - 函数: `mint(address to, uint256 amount)`
   - 只有合约所有者可以调用此函数

## 在区块浏览器上查看

部署和验证完成后，您可以在Sepolia区块浏览器上查看代币：

```
https://sepolia.etherscan.io/token/YOUR_TOKEN_ADDRESS
```

其中`YOUR_TOKEN_ADDRESS`是部署脚本输出的代币地址。

## 故障排除

### 部署失败

如果部署失败，请检查：
- 账户余额是否足够
- 环境变量是否配置正确
- gas价格是否合理

### 验证失败

如果验证失败，请检查：
- 是否已经部署了合约
- 部署信息文件是否存在
- 是否配置了Etherscan API密钥

如果需要手动验证，可以在Etherscan上进行：
1. 访问 https://sepolia.etherscan.io/verifyContract
2. 输入合约地址
3. 选择"Solidity (Standard-Input-JSON)"
4. 上传编译器输入JSON
5. 输入构造函数参数：quzi地址 