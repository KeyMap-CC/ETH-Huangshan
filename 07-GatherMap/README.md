# GatherMap 🗺️

> 数字游民聚集地发现平台 - 基于以太坊的Web3地图应用

## 项目描述

GatherMap是一个专为数字游民设计的聚集地发现和分享平台。通过创新的地图界面，用户可以轻松发现和分享全球各地的数字游民聚集地、共享办公空间和活动场地。平台集成了以太坊生态系统，通过NFT徽章系统激励用户参与社区建设，打造一个去中心化的数字游民生态网络。

### 解决的问题
- **信息分散**：数字游民聚集地信息散布在各个平台，难以获取
- **缺乏激励**：用户分享优质内容缺乏有效激励机制
- **信任缺失**：地点信息真实性难以验证
- **社区建设**：缺乏有效的社区贡献认证系统

### 主要功能
- 🗺️ **交互式地图**：基于Leaflet的实时地图展示聚集地位置
- 🏠 **地点管理**：详细的聚集地信息包括价格、容量、设施等
- 💬 **评论系统**：用户可以对地点进行评价和评分
- 🎖️ **NFT徽章**：基于用户贡献的成就徽章系统
- 👤 **用户系统**：完整的用户认证和个人资料管理
- 🔍 **智能搜索**：支持地点名称、城市、标签等多维度搜索
- 📱 **响应式设计**：支持桌面端和移动端访问

## 以太坊生态集成

GatherMap深度集成了以太坊生态系统的核心技术和特性：

### 智能合约技术
- **ERC721标准**：使用OpenZeppelin库实现标准的NFT合约
- **灵魂绑定代币(SBT)**：徽章NFT采用不可转移设计，确保成就真实性
- **Gas优化**：合约支持批量铸造，降低用户使用成本

### Web3集成
- **钱包连接**：支持MetaMask等主流以太坊钱包
- **链上验证**：用户成就通过智能合约验证和记录
- **去中心化身份**：基于钱包地址的用户身份系统

### NFT徽章系统
- **多种徽章类型**：探索者、评论家、早期用户、社区之星、地点猎人
- **自动发放**：基于用户行为自动触发徽章铸造
- **元数据存储**：支持自定义徽章元数据和图片

## 技术栈

### 前端技术
- **React 19** - 现代化的UI框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的构建工具
- **UnoCSS** - 原子化CSS引擎
- **React Leaflet** - React地图组件库
- **Ethers.js** - 以太坊JavaScript库
- **Axios** - HTTP客户端库

### 后端技术
- **Node.js** - JavaScript运行时环境
- **TypeScript** - 服务端类型安全
- **Express** - Web应用框架
- **MongoDB** - NoSQL数据库
- **Mongoose** - MongoDB对象建模工具
- **JWT** - JSON Web Token认证

### 智能合约
- **Solidity ^0.8.20** - 以太坊智能合约语言
- **Hardhat** - 以太坊开发环境
- **OpenZeppelin** - 安全的智能合约库
- **ERC721** - NFT标准实现

### 开发工具
- **pnpm** - 高效的包管理器
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化工具

## 安装与运行指南

### 环境要求
- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **MongoDB** >= 5.0
- **MetaMask钱包** (用于Web3功能)


### 1. 安装依赖
```bash
# 安装所有项目依赖
pnpm install

# 或分别安装各模块依赖
cd frontend && pnpm install
cd ../backend && pnpm install
cd ../contract && pnpm install
```

### 2. 数据库设置
确保MongoDB服务运行：
```bash
# macOS (使用Homebrew)
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 3. 智能合约部署
```bash
cd contract

# 编译合约
pnpm run compile

# 部署到测试网络 (Flow EVM Testnet)
# 部署前请修改 deploy.js 中合约管理员地址
pnpm run deploy:testnet

# 记录部署的合约地址，更新前端环境变量
```

### 4. 环境配置

#### 后端配置
在`backend`目录创建`.env`文件：
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/gathermap
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

#### 前端配置
在`frontend`目录创建`.env`文件：
```env
VITE_API_URL=http://localhost:3001/api
VITE_CONTRACT_ADDRESS=0x...
```

#### 智能合约配置
在`contract`目录创建`.env`文件：
```env
PRIVATE_KEY=your-private-key
```

### 5. 启动服务

#### 开发模式
```bash
# 启动后端服务 (端口3001)
cd backend
pnpm run dev

# 启动前端服务 (端口5173)
cd frontend
pnpm run dev
```

#### 生产模式
```bash
# 构建前端
cd frontend
pnpm run build

# 构建后端
cd backend
pnpm run build

# 启动生产服务
pnpm run start
```

### 6. 访问应用
- **前端应用**: http://localhost:5173
- **后端API**: http://localhost:3001/api
- **管理后台**: http://localhost:5173/manage

## 项目亮点/创新点

### 🌟 Web3原生设计
- **灵魂绑定NFT**：创新性地将数字游民成就转化为不可转移的NFT徽章
- **去中心化激励**：通过智能合约自动化成就认证和奖励分发
- **链上声誉系统**：用户贡献永久记录在区块链上

### 🚀 用户体验优化
- **渐进式Web应用**：支持离线浏览和移动端原生体验
- **实时地图交互**：流畅的地图缩放、筛选和悬浮信息展示
- **智能推荐算法**：基于用户行为和地理位置的个性化推荐

### 💡 社区驱动机制
- **多维度激励**：探索、评论、分享等多种贡献方式获得奖励
- **质量控制系统**：通过社区评分和管理员审核保证信息质量
- **数据开放性**：API开放，支持第三方应用集成

### 🔒 安全与隐私
- **非托管设计**：用户完全控制自己的数字资产
- **数据最小化**：仅收集必要的用户信息
- **合约安全审计**：使用经过验证的OpenZeppelin合约库

## 未来发展计划

### Phase 1 - 社区扩展 (Q2 2024)
- [ ] 多语言支持 (英文、日文、韩文)
- [ ] 社交功能增强 (用户关注、动态分享)
- [ ] 移动端App开发 (React Native)

### Phase 2 - 生态建设 (Q3 2024)
- [ ] DAO治理机制
- [ ] 代币经济模型
- [ ] 合作伙伴API开放
- [ ] 第三方服务集成 (Airbnb、Booking等)

### Phase 3 - 技术升级 (Q4 2024)
- [ ] Layer 2解决方案集成
- [ ] AI驱动的智能推荐
- [ ] AR/VR地点预览功能
- [ ] 跨链资产支持

### Phase 4 - 全球扩展 (2025)
- [ ] 全球市场推广
- [ ] 本地化运营团队
- [ ] 政府合作计划
- [ ] 可持续发展倡议

## 团队成员

- **核心开发团队** - 全栈开发与产品设计
- **Web3技术顾问** - 智能合约架构与安全审计
- **数字游民社区** - 产品需求与用户体验反馈

## 演示与截图

### 📸 产品截图

**地图主界面**
- 地图展示全球数字游民聚集地,支持类型筛选和实时搜索
![GatherMap 地图主界面截图](./screenshots/map-main.png)

**地点详情页**
- 详细的地点信息展示，用户评论和评分系统
![GatherMap 地点详情页截图](./screenshots/place-detail.png)

**NFT徽章展示**
- 个人成就徽章收藏
![GatherMap 个人成就截图](./screenshots/profile-nft.jpeg)

**管理后台**
- 地点、用户信息管理,数据统计，NFT发放
![GatherMap 个人成就截图](./screenshots/manage.png)


## 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

*让我们一起构建更好的数字游民生态系统！* 🌍✨ 