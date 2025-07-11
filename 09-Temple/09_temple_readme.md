# Temple - 财神殿 Web3 祈福平台

## 项目简介

Rich Temple（财神殿）是一个结合传统中式文化与现代Web3技术的祈福上香平台。用户可以在线许愿、进行小六壬神算、支付香火并获得功德记录，所有交易都在区块链上进行。

## ETH黄山 黑客松小组人员
- 开发：Jordan
- 产品：Alexis
- 美术：柚梓

## 项目地址
https://github.com/PolarTechJordan/richtemple
访问网址：  https://temple.polarjordan.xyz/

## 主要功能

- 🙏 **祈愿许愿**: 用户可以输入心愿并进行祈福
- 🔮 **小六壬神算**: 基于DeepSeek AI的传统占卜算命
- 💰 **香火支付**: 支持ETH/USDT的Web3支付
- 📱 **移动端适配**: 完全响应式设计，支持移动端
- 🎨 **新中式美学**: 传统水墨风格的现代化界面
- 🏪 **法物商城**: 购买实体和数字法物

## 技术栈

### 前端
- **框架**: Next.js 14
- **样式**: Tailwind CSS
- **字体**: 楷体 (KaiTi)
- **动画**: Framer Motion
- **图标**: Lucide React

### 后端服务
- **AI模型**: DeepSeek API
- **Web3**: RainbowKit + Wagmi
- **区块链**: Ethereum
- **支付**: ETH/USDT

## 项目结构

```
rich-temple/
├── pages/              # 页面文件
│   ├── index.js       # 初始动画页面
│   ├── wish.js        # 许愿页面
│   ├── calculate.js   # 算命页面
│   ├── result.js      # 结果页面
│   ├── merit.js       # 功德页面
│   └── store.js       # 商城页面
├── components/        # 组件文件
│   └── FloatingSidebar.js
├── services/          # 服务文件
│   └── deepseekService.js
├── styles/            # 样式文件
│   └── globals.css
├── public/            # 静态资源
│   └── videos/        # 视频文件
└── README.md
```

## 安装和运行

### 1. 克隆项目

```bash
git clone https://github.com/PolarTechJordan/richtemple/
cd rich-temple
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置环境变量

复制 `env.example` 文件为 `.env.local`：

```bash
cp env.example .env.local
```

编辑 `.env.local` 文件，填入相应的API密钥：

```bash
# DeepSeek API配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# WalletConnect配置  
WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
```

### 4. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看项目。

## 页面流程

1. **初始页面** (`/`) - 播放进场动画，点击进入许愿页面
2. **许愿页面** (`/wish`) - 用户输入心愿，连接钱包
3. **算命页面** (`/calculate`) - 输入3个数字进行小六壬神算
4. **结果页面** (`/result`) - 显示算命结果，进行香火支付
5. **功德页面** (`/merit`) - 支付成功后的功德记录和更多功能
6. **商城页面** (`/store`) - 购买实体和数字法物

## 特色功能

### 新中式美学设计
- 宣纸色背景 (#F9F4E2)
- 墨色文字 (#2C2C2C)
- 水墨渐变效果
- 涟漪交互动画
- 楷体字体

### Web3集成
- MetaMask钱包连接
- ETH/USDT支付支持
- 区块链交易验证
- NFT法物购买

### AI算命系统
- DeepSeek大模型集成
- 传统小六壬算法
- 个性化占卜结果
- 每日运势功能

## 开发指南

### 添加新页面
1. 在 `pages/` 目录下创建新的页面文件
2. 使用统一的页面模板和样式
3. 确保移动端适配

### 修改样式
- 主要样式在 `styles/globals.css` 中
- 使用 Tailwind CSS 类名
- 遵循新中式美学设计原则

### 集成新的AI服务
- 在 `services/` 目录下创建新的服务文件
- 参考 `deepseekService.js` 的结构
- 确保错误处理和默认值

## 部署

### Vercel部署（推荐）

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 设置环境变量
4. 部署

### 自定义部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 环境变量说明

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API密钥 | 是 |
| `WALLET_CONNECT_PROJECT_ID` | WalletConnect项目ID | 是 |
| `NEXT_PUBLIC_SITE_URL` | 网站URL | 否 |
| `NEXT_PUBLIC_SITE_NAME` | 网站名称 | 否 |

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证。查看 [LICENSE](LICENSE) 文件了解更多信息。

