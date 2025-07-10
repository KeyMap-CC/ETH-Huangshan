# SafeWallet 金库和DAO使用指南

本文档介绍了SafeWallet金库和DAO系统的架构、部署和使用方法。

## 系统架构

SafeWallet金库和DAO系统由以下几个主要组件组成：

1. **SafeWalletToken (SWT)**: 治理代币，用于DAO投票和金库兑换
2. **SafeWalletTreasury**: 金库合约，用户可以存入USDT获取SWT代币
3. **SafeWalletDAO**: DAO治理合约，控制金库的参数和操作
4. **SafeWalletTimelock**: 时间锁控制器，确保DAO决策的安全执行

## 金库功能

SafeWalletTreasury金库合约提供以下功能：

1. **代币兑换**: 用户存入150 USDT可获得100个SWT代币
2. **兑换比例调整**: DAO可以调整USDT和SWT的兑换比例
3. **紧急提款**: DAO可以在紧急情况下提取金库中的代币
4. **暂停/恢复**: DAO可以暂停或恢复兑换功能

## DAO功能

SafeWalletDAO合约提供以下功能：

1. **提案创建**: 代币持有者可以创建治理提案
2. **投票**: 代币持有者可以对提案进行投票
3. **执行**: 通过的提案经过时间锁后可以执行
4. **金库管理**: 调整金库参数、暂停/恢复金库功能、紧急提款等

## 部署步骤

### 前提条件

1. 确保已部署SafeWalletToken (SWT)代币
2. 确保Sepolia测试网上有USDT代币合约（或使用其他ERC20代币作为替代）

### 部署命令

```bash
# 1. 先部署SWT代币（如果尚未部署）
npm run deploy:token

# 2. 部署金库和DAO系统
npm run deploy:treasury
```

部署脚本会执行以下操作：
1. 读取已部署的SWT代币地址
2. 部署时间锁控制器
3. 部署DAO合约
4. 部署金库合约
5. 配置DAO和时间锁角色
6. 向金库转移初始SWT代币

## 用户操作指南

### 用户兑换SWT代币

1. **授权USDT**:
   ```javascript
   // 授权金库合约使用您的USDT
   const usdtContract = await ethers.getContractAt("IERC20", usdtAddress);
   await usdtContract.approve(treasuryAddress, ethers.parseUnits("150", 6));
   ```

2. **兑换SWT**:
   ```javascript
   // 调用金库合约的兑换函数
   const treasury = await ethers.getContractAt("SafeWalletTreasury", treasuryAddress);
   await treasury.exchangeTokens();
   ```

### DAO治理操作

1. **委托投票权**:
   ```javascript
   // 委托您的投票权（可以委托给自己）
   const swtToken = await ethers.getContractAt("SafeWalletToken", swtAddress);
   await swtToken.delegate(yourAddress);
   ```

2. **创建提案**:
   ```javascript
   // 创建一个调整兑换比例的提案
   const dao = await ethers.getContractAt("SafeWalletDAO", daoAddress);
   const targets = [treasuryAddress];
   const values = [0];
   const calldatas = [
     treasury.interface.encodeFunctionData("updateExchangeRates", [
       ethers.parseUnits("200", 6), // 新的USDT数量: 200 USDT
       ethers.parseUnits("100", 18)  // 新的SWT数量: 100 SWT
     ])
   ];
   const description = "Adjust exchange rate to 200 USDT for 100 SWT";
   
   await dao.propose(targets, values, calldatas, description);
   ```

3. **投票**:
   ```javascript
   // 对提案进行投票
   // 0 = Against, 1 = For, 2 = Abstain
   await dao.castVote(proposalId, 1); // 投赞成票
   ```

4. **执行提案**:
   ```javascript
   // 等待投票期结束和时间锁延迟后执行提案
   await dao.execute(targets, values, calldatas, descriptionHash);
   ```

## 安全注意事项

1. **时间锁延迟**: 所有DAO决策都有时间锁延迟，以防止恶意提案
2. **法定人数要求**: 提案需要达到40%的法定人数才能通过
3. **投票权委托**: 用户需要先委托投票权才能参与治理
4. **紧急提款**: 只能通过DAO提案执行，有时间锁保护

## 合约地址（Sepolia测试网）

部署完成后，您可以在`deployment-treasury-dao-sepolia.json`文件中找到所有合约地址：

```json
{
  "network": "sepolia",
  "contracts": {
    "token": {
      "swt": "0x...",
      "usdt": "0x..."
    },
    "timelock": "0x...",
    "dao": "0x...",
    "treasury": "0x..."
  }
}
```

## 故障排除

### 兑换失败

如果兑换失败，请检查：
1. 您是否有足够的USDT余额
2. 您是否已授权金库使用您的USDT
3. 金库是否有足够的SWT代币
4. 金库是否处于暂停状态

### 提案创建失败

如果提案创建失败，请检查：
1. 您是否有足够的SWT代币
2. 您是否已委托投票权
3. 提案描述是否为空 