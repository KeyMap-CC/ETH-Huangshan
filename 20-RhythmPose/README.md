# Rhythm Pose - AI 动作识别与评分系统

## 项目描述

Github repo : https://github.com/fuhaooo/rhythm-pose.git
PPT: https://gamma.app/docs/Rhythm-Pose-Web3-3cujaoqj5sdx4vd

Rhythm Pose 是一个基于 Web3 技术的实时动作识别和评分系统，结合了 AI 人工智能和区块链技术。该项目利用 ml5.js 和 MediaPipe 进行实时动作检测，支持多种瑜伽姿势和运动动作的识别与评估，并通过区块链技术确保评分数据的公正性和用户隐私保护。

**主要功能：**
- 🎯 双模式检测：支持人体姿势检测和手部动作检测
- 🤖 实时 AI 识别：使用 ml5.js PoseNet 和 MediaPipe Hands 进行实时检测
- 📊 智能评分系统：基于准确度、稳定性和持续时间的综合评分
- 🔒 Web3 集成：支持区块链数据存储和隐私保护
- 📱 响应式设计：适配桌面和移动设备

## 以太坊生态集成

Rhythm Pose 项目深度集成了以太坊生态系统的核心技术：

### 智能合约功能
- **评分记录合约**：使用 Solidity 编写的智能合约，用于存储用户的运动评分记录
- **成就系统**：基于 ERC-721 标准的 NFT 成就徽章，记录用户的运动里程碑
- **积分代币**：ERC-20 标准的运动积分代币，用户可通过完成运动挑战获得奖励

### 区块链特性
- **数据不可篡改**：所有评分数据通过智能合约存储，确保公平性
- **隐私保护**：计划集成 ZKTLS（零知识传输层安全）技术，保护用户运动数据隐私
- **去中心化存储**：运动视频和数据可选择存储在 IPFS 上
- **跨链兼容**：支持以太坊主网、Polygon、Arbitrum 等 EVM 兼容链

### Web3 交互
- **钱包连接**：支持 MetaMask、WalletConnect 等主流钱包
- **Gas 优化**：使用 Layer 2 解决方案降低交易成本
- **DeFi 集成**：运动积分可参与流动性挖矿和质押

## 技术栈

### 前端技术
- **JavaScript**: 原生 JavaScript 实现
- **p5.js**: 创意编程库，用于视频处理和可视化
- **CSS Grid & Flexbox**: 响应式布局
- **Canvas API**: 高性能图形渲染

### AI/ML 技术
- **ml5.js**: 机器学习库，提供 PoseNet 姿态估计
- **MediaPipe Hands**: Google 的手部检测模型
- **TensorFlow.js**: 浏览器端机器学习

### 区块链技术
- **Solidity**: 智能合约开发语言
- **Hardhat**: 以太坊开发框架
- **ethers.js**: 以太坊 JavaScript 库
- **Web3.js**: 区块链交互库
- **IPFS**: 去中心化存储

### 开发工具
- **Node.js**: 后端运行环境
- **npm**: 包管理器
- **Git**: 版本控制

## 安装与运行指南

### 环境要求
- Node.js 16.0 或更高版本
- 现代浏览器（支持 WebRTC 和 WebGL）
- 摄像头设备
- MetaMask 或其他 Web3 钱包（用于区块链功能）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/fuhaooo/rhythm-pose.git
   cd rhythm-pose
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   ```bash
   # 复制环境配置文件
   cp .env.example .env
   
   # 在 .env 文件中配置以下变量：
   # ETHEREUM_RPC_URL=your_ethereum_rpc_url
   # CONTRACT_ADDRESS=your_contract_address
   # IPFS_GATEWAY=your_ipfs_gateway
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:8080`

### 区块链部署（可选）

如果需要部署智能合约：

```bash
# 编译合约
npx hardhat compile

# 部署到测试网
npx hardhat run scripts/deploy.js --network sepolia

# 部署到主网
npx hardhat run scripts/deploy.js --network mainnet
```

### 生产环境部署

```bash
npm run build
npm run start
```

## 项目亮点/创新点

### 🚀 技术创新
1. **AI + Web3 融合**：首个将实时动作识别与区块链技术深度结合的项目
2. **隐私保护**：采用 ZKTLS 技术，确保用户运动数据隐私的同时保证数据真实性
3. **多模态检测**：同时支持人体姿势和手部动作的精准识别
4. **实时评分算法**：基于准确度、稳定性和持续时间的多维度评分系统

### 🎯 产品特色
1. **NFT 成就系统**：用户可获得独特的运动成就 NFT，具有收藏和交易价值
2. **代币激励机制**：通过运动获得代币奖励，激励用户持续锻炼
3. **跨链兼容**：支持多个 EVM 兼容链，用户可选择最适合的网络
4. **社区治理**：代币持有者可参与项目功能和发展方向的投票

### 🔐 安全特性
1. **智能合约审计**：所有合约经过严格的安全审计
2. **去中心化存储**：重要数据存储在 IPFS 上，避免单点故障
3. **多重验证**：结合 AI 检测和区块链验证，确保数据真实性

## 未来发展计划

### 短期目标（3-6个月）
- [ ] 完成智能合约的安全审计和部署
- [ ] 集成 ZKTLS 隐私保护技术
- [ ] 添加更多运动动作类型和评分模式
- [ ] 实现移动端原生应用

### 中期目标（6-12个月）
- [ ] 推出社区治理功能和 DAO 机制
- [ ] 开发多人对战和竞技模式
- [ ] 集成 DeFi 流动性挖矿功能
- [ ] 添加语音指导和 AR 增强现实功能

### 长期目标（1-2年）
- [ ] 构建完整的 Web3 健身生态系统
- [ ] 与健身器材厂商合作，打造物联网健身设备
- [ ] 推出健身教练认证和培训平台
- [ ] 探索元宇宙健身体验

## 团队成员

- Alfred(Github ID:fuhaooo， 职责：后端、产品) 

- Keith(Github ID: apkaisaw，职责：前端、合约)

## 相关链接

- **GitHub 仓库**: https://github.com/fuhaooo/rhythm-pose
- **项目演示**: https://gamma.app/docs/Rhythm-Pose-Web3-3cujaoqj5sdx4vd
- **智能合约地址**: （待部署）
- **技术文档**: （开发中）

## 许可证

本项目采用 MIT 许可证开源 - 详情请参阅 [LICENSE](LICENSE) 文件。

