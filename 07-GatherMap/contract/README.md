# GatherMap NFT 智能合约

## 项目简介

这是 GatherMap 数字游民平台的 NFT 徽章智能合约，部署在 Flow EVM Testnet 上。合约允许管理员为用户发放不可转移的成就徽章 NFT。

## 合约特性

- **ERC721 NFT 标准**：基于 OpenZeppelin 实现
- **灵魂绑定**：徽章不可转移，永久绑定到用户
- **防重复发放**：同一用户不能获得重复的同类型徽章
- **批量铸造**：支持批量为多个用户发放徽章
- **预设徽章类型**：包含5种预设的数字游民徽章类型

## 徽章类型

1. **🗺️ 数字游民探索者** (`explorer`) - 访问超过5个聚集地
2. **📝 优质评论者** (`reviewer`) - 发表超过10条优质评论  
3. **🐦 早期用户** (`early_bird`) - 平台早期注册用户
4. **⭐ 社区之星** (`community_star`) - 活跃社区贡献者
5. **🏃 场地猎手** (`place_hunter`) - 发现并推荐新场地

## 技术栈

- **Solidity** ^0.8.20
- **Hardhat** - 开发框架
- **OpenZeppelin** - 安全的智能合约库
- **Flow EVM Testnet** - 部署网络

## 快速开始

### 1. 安装依赖

```bash
cd contract
pnpm install
```

### 2. 环境配置

创建 `.env` 文件：

```bash
# 私钥 (不要提交到git!)
PRIVATE_KEY=your_private_key_here

# 可选：用于gas报告
REPORT_GAS=false
```

### 3. 编译合约

```bash
pnpm run compile
```

### 4. 部署到 Flow EVM Testnet

```bash
pnpm run deploy:testnet
```

### 5. 验证合约

```bash
npx hardhat verify --network flow-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 网络配置

### Flow EVM Testnet
- **Chain ID**: 545
- **RPC URL**: https://testnet.evm.nodes.onflow.org
- **Block Explorer**: https://evm-testnet.flowscan.org
- **Faucet**: https://testnet-faucet.onflow.org

### Flow EVM Mainnet
- **Chain ID**: 747  
- **RPC URL**: https://mainnet.evm.nodes.onflow.org
- **Block Explorer**: https://evm.flowscan.org

## 合约接口

### 主要函数

```solidity
// 铸造单个徽章
function mintBadge(address recipient, string memory badgeType, string memory tokenURI) public onlyOwner

// 批量铸造徽章
function batchMintBadges(address[] memory recipients, string memory badgeType, string[] memory tokenURIs) public onlyOwner

// 检查用户是否拥有徽章
function hasBadge(address user, string memory badgeType) public view returns (bool)

// 添加新徽章类型
function addBadgeType(string memory badgeType, string memory metadata) public onlyOwner
```

### 事件

```solidity
event BadgeMinted(address indexed recipient, uint256 tokenId, string badgeType);
event BadgeTypeAdded(string badgeType, string metadata);
```

## 前端集成

### 1. 安装 Web3 依赖

```bash
pnpm add ethers @wagmi/core viem
```

### 2. 合约 ABI

部署后会在 `artifacts/contracts/GatherMapBadges.sol/` 目录生成 ABI 文件。

### 3. 示例代码

```javascript
import { ethers } from 'ethers';
import contractABI from './GatherMapBadges.json';

const CONTRACT_ADDRESS = 'your_deployed_contract_address';

// 连接到合约
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

// 为用户铸造徽章 (只有合约所有者可以调用)
async function mintBadge(userAddress, badgeType) {
  const tokenURI = `https://api.gathermap.com/metadata/${badgeType}`;
  const tx = await contract.mintBadge(userAddress, badgeType, tokenURI);
  await tx.wait();
  console.log('徽章铸造成功!');
}

// 检查用户是否拥有徽章
async function checkBadge(userAddress, badgeType) {
  const hasBadge = await contract.hasBadge(userAddress, badgeType);
  return hasBadge;
}
```

## 安全考虑

1. **所有者权限**：只有合约所有者可以铸造徽章
2. **防重复发放**：合约会检查用户是否已拥有同类型徽章
3. **不可转移**：徽章NFT不可转移，防止交易
4. **地址验证**：铸造前验证接收者地址有效性

## 测试

```bash
# 运行测试
pnpm run test

# 生成覆盖率报告
pnpm run coverage
```

## 许可证

MIT License

## 贡献

欢迎提交 Pull Request 和 Issue！

## 联系方式

- 项目地址：https://github.com/gathermap
- 官网：https://gathermap.com
- 邮箱：dev@gathermap.com 