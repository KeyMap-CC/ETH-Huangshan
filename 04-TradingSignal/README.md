# TradingSignal
## 项目描述

用户在 TradingFlow 上可以创建策略，也可以使用其他用户公开出来的策略。使用他人公开出来的策略这个行为叫做跟单。

用户可以看到所有公开策略的管理资产规模，30日收益率，30日最大回撤，运行天数，平台等数据。用户可以自行决定是否跟投这个策略，跟多少钱。

前期这个跟单功能，只对接 TradingFlow 这个平台，后续会接入其他的 Flow 或者交易所。用户可以在一个平台里，查看他所在跟单的所有的策略的收益情况。

使用到 EVM 的部分在 TradingFlow 中。包含了保管用户的资金，执行买入卖出信号等。



## 技术栈

前端 React，后端 Python，合约 Solidity。

## 安装与运行指南

后端：python3.9，pip 25.1.1

数据库: MySQL 8.0

node.js：22.14

pnpm：10.11.0

需要安装 MySQL 数据库，新建表

```sql
CREATE TABLE `subscribe` (
  `id` bigint NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL COMMENT '用户',
  `platform` varchar(255) DEFAULT NULL COMMENT '平台：TradingFlow, OKX, Binance',
  `product_id` varchar(255) DEFAULT NULL COMMENT '平台的交易产品',
  `is_active` tinyint(1) DEFAULT NULL COMMENT '是否订阅',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

后端 pip 依赖安装，前端 pnpm 以来安装

```
pip install -r requirements.txt
pnpm install
```

## 项目亮点/创新点

1. 跨平台整合

   - 首创性地将不同交易平台的策略信号整合到一个统一的界面
   - 用户可以在单一平台管理多个来源的交易策略
   - 为后续扩展到其他交易平台预留了良好的架构设计

2. 智能合约保障

   - 利用以太坊智能合约技术保障用户资金安全
   - 通过智能合约自动化执行交易信号，降低人为干预风险
   - 所有交易操作透明可追溯，记录在区块链上

3. 数据透明度

   - 完整展示策略的关键指标：管理资产规模、30 日收益率、最大回撤等
   - 帮助用户做出更明智的投资决策
   - 建立策略提供者和跟随者之间的信任机制

4. 用户自主权

   - 用户可以自由选择跟单金额
   - 灵活的订阅机制，随时可以开启或关闭跟单
   - 充分尊重用户的投资决策权

5. 技术创新
   - 采用前后端分离架构，确保系统的可扩展性
   - 使用 MySQL 实现高效的数据管理
   - React 前端提供流畅的用户体验

## 团队成员 

CL，谷

