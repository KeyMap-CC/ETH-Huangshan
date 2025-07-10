# TradingSignal-前端
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

## 团队成员 

CL，谷

