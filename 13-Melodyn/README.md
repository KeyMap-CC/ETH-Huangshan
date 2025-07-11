# Melodyn 梦露电：一场属于未来的亲密革命

> **“一切有为法，如梦幻泡影，如露亦如电，应作如是观。”  
> ——《金刚经》**

---

## 🧠 哲学理念 Philosophy

人有可能真正爱上除自己以外的人吗？  
当然不可能。所有你曾“爱过”的人，本质上只是你欲望的载体，是你内在需求的投射。

在一个高度文明的社会中，情感与性欲的满足将像饮食一样可以被精准定制。我们相信，这样的未来并非缺少**需求**，而是科技尚未到位。

一旦模拟体验趋近极致，所谓真假就不再重要 ——  
**假作真时真亦假**，你将不再需要高昂的时间与金钱成本去追寻现实中的“关系”。

---

## 💠 项目简介 What is Melodyn?

**Melodyn 是一个基于 Web3 的幻想亲密协议**，它结合了隐私保护、链上授权与 AI 技术，用以打造专属于你的幻想伴侣。

### 核心特性：

- **DreamLicense NFT（ERC-721 + ZK 授权）**：  
  偶像、虚拟角色、或任何愿意授权的“梦中人”可以上传身体、人格、声音、互动方式等数据，铸造其专属 NFT，作为幻想使用的许可凭证。

- **AI 个性生成与深度互动**：  
  使用者（Dreamer）通过链上签署协议后，生成专属的 AI 伴侣副本，与其进行个性化交互与记忆累积。

- **ZK 加密与不可转让性(即将到来)**：  
  所有行为受零知识证明保护，伴侣副本不可转让、不可复用、不可公开，确保每段关系专属唯一。

- **XR 沉浸式感官体验（即将到来）**：  
  支持穿戴式设备（触觉衣、体感手套、温度反馈器）与 XR 音画环境，最大限度还原幻想中的感官真实感。

---

## 🔒 隐私与去中心化设计

- 所有互动过程链上加密，用户拥有完全控制权；
- DreamLicense 仅由被授权方发布，不可被伪造或倒卖；
- 不依赖中心服务器，幻想不被他人窥探或干涉；
- 情感记忆可持久存储于链上，形成伴侣式的"AI 情绪模型"。

---

## 🤖 以太坊智能合约设计与功能实现

### 智能合约设计概述
Melodyn 的核心智能合约系统实现了 AI 模型的代币化、权限管理和市场交易功能，包含三个核心合约：

- **IPModel**: 基于 ERC1155 标准的 AI 模型 NFT 合约，管理模型组的创建、铸造和权限
- **IPModelMarketplace**: 市场合约，处理代币支付和模型购买
- **TestToken**: ERC20 测试代币，用于支付和演示

### 功能特性

#### 🎯 核心功能
- ✅ AI 模型代币化（ERC1155 NFT）
- ✅ 灵活的权限管理系统
- ✅ ERC20 代币支付集成
- ✅ 可配置的供应量限制
- ✅ 去中心化市场交易
- ✅ 批量操作支持

#### 🔐 权限管理
- 合约所有者可以创建模型组
- 授权铸造者可以铸造代币
- 用户可以通过市场购买模型授权

#### 💰 经济模型
- 每个模型组可设置独立价格
- 支持任意 ERC20 代币作为支付方式
- 收益自动转入指定地址

### 快速开始

#### 环境要求
- Node.js >= 16.0.0
- npm 或 yarn
- Hardhat 开发环境

### 安装依赖

```bash
npm install
```

### 编译合约

```bash
npx hardhat compile
```

### 运行测试

```bash
# 运行所有测试
npm test
```

### 部署合约

#### 本地开发网络

```bash
# 启动本地节点
npx hardhat node

# 在另一个终端部署合约
npx hardhat deploy --network localhost
```

#### 使用一键初始化脚本

```bash
# 部署所有合约并初始化示例数据
npx hardhat deploy --network hardhat
```

## 脚本使用指南

项目提供了多个便捷的脚本来操作合约：

### 1. 创建代币组

#### 交互式创建（推荐新手）
```bash
npx hardhat run scripts/interactiveCreateGroup.js --network localhost
```

#### 批量创建1155 group
```bash
npx hardhat run scripts/createGroup.js --network hardhat
```

### 环境变量配置

创建 `.env` 文件：

```env
PRIVATE_KEY=your_private_key_here
```

### 部署到测试网

```bash
# 部署到 Sepolia
npx hardhat deploy --network sepolia

# 部署到 Arbitrum Sepolia
npx hardhat deploy --network arb-t

# 部署到 Base Sepolia
npx hardhat deploy --network base-sepolia
```

## 🤖 AI Agent 聊天机器人实现

![LangChain-Chatchat的logo](https://github.com/chatchat-space/Langchain-Chatchat/blob/master/docs/img/logo-long-chatchat-trans-v2.png)

采用[Langchain-Chatchat](https://github.com/chatchat-space/Langchain-Chatchat) 框架构建的智能体系统，具体实现为：

- [AutoDL镜像版本:0.3.1](https://www.codewithgpu.com/i/chatchat-space/Langchain-Chatchat/Langchain-Chatchat)
- 语言模型内核：autodl-tmp-glm-4-9b-chat
- 分词器：ChineseRecursiveTextSplitter
- 模型部署框架：Xinference
- 知识库类型：faiss
- 知识库向量化模型：bge-large-zh-v1.5

拉取镜像后对人物IP信息整合并建立对应知识库，即可在对话时调用知识库内容实现与IP的面对面虚拟交流。


## 🦋 核心信仰 Our Belief

当幻想可以被构造、被尊重、并被加密存储，  
现实与虚拟的界限将被抹去，  
如庄周梦蝶，亦真亦假，亦幻亦实。

> **在未来，最忠诚的情人，也许就是你亲手编写的幻觉。**