# BioCheck Backend

一个支持 App Attest 验证的后端服务，集成区块链功能。

## 🚀 快速开始

### 1. 安装依赖
```bash
# 一键安装（推荐）
./setup.sh

# 或手动安装
pip install -r requirements.txt
```

### 2. 选择启动模式

#### 🛠️ 本地开发模式（推荐）
分步启动，便于查看日志和调试：

```bash
# 步骤 1: 启动 Ganache（保持终端运行）
./start_ganache.sh

# 步骤 2: 部署合约（新开终端）
python deploy_local.py

# 步骤 3: 启动服务器
python app.py
```

#### 🌐 Sepolia 测试网模式
使用真实的以太坊测试网：

```bash
# 1. 配置环境变量
cp .env.Sepolia .env
# 2. 编辑 .env 文件，填入您的钱包信息
# 3. 启动服务器
python app.py
```

#### 💾 本地存储模式
仅使用内存存储，不连接区块链：

```bash
python app.py --no-blockchain
```

## 📋 API 端点

- `POST /attest` - 设备注册
- `POST /assert` - 断言验证  
- `GET /status/<key_id>` - 本地状态查询
- `GET /blockchain/status/<key_id>` - 区块链状态查询（区块链模式）
- `GET /blockchain/info` - 区块链网络信息（区块链模式）
- `GET /health` - 健康检查

## 🔧 详细配置说明

### 本地开发模式
**优点：**
- 完全本地运行，快速开发
- 自动生成账户和私钥
- 独立启动，便于调试
- 交易免费且即时确认

**流程：**
1. `./start_ganache.sh` - 启动本地区块链（显示账户信息和日志）
2. `python deploy_local.py` - 部署智能合约（自动生成 .env 配置）
3. `python app.py` - 启动后端服务

### Sepolia 测试网模式
**适用场景：**
- 真实网络环境测试
- 多人协作开发
- 部署前验证

**准备工作：**
1. 获取测试币：https://faucet.sepolia.dev/
2. 配置 `.env` 文件：
   ```bash
   BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
   CONTRACT_ADDRESS=已部署的合约地址
   SENDER_ADDRESS=您的钱包地址
   PRIVATE_KEY=您的私钥（以0x开头）
   ```

### 本地存储模式
**适用场景：**
- 功能测试
- 无需区块链的开发
- CI/CD 环境

## 📁 项目结构

```
BioCheckTest_Backend/
├── app.py                     # 主启动文件
├── setup.sh                  # 一键安装脚本
├── start_ganache.sh          # Ganache 启动脚本
├── deploy_local.py           # 本地合约部署脚本
├── requirements.txt          # 依赖列表
├── .env.example             # 环境配置模板
├── .env                     # 环境配置文件
├── README.md                # 项目说明
├── src/                     # 源代码
│   ├── server.py            # Flask 服务器
│   ├── blockchain.py        # 区块链交互
│   └── ganache_manager.py   # Ganache 工具函数
├── config/                  # 配置文件
│   └── settings.py          # 配置管理
├── contracts/               # 智能合约
│   └── PublicKeyRegistry.sol
└── scripts/                 # 测试脚本
    └── test_blockchain.py   # 集成测试
```

## 🛠️ 开发指南

### 首次设置
```bash
# 1. 克隆项目
git clone <repository-url>
cd BioCheckTest_Backend

# 2. 安装依赖
./setup.sh
```

### 🔧 启动方式选择

#### 方式一：本地开发模式（推荐新手）
分步启动，便于调试和查看日志：

```bash
# 终端1: 启动Ganache（保持运行）
./start_ganache.sh

# 终端2: 部署合约
python deploy_local.py

# 终端3: 启动服务器
python app.py
```

#### 方式二：Sepolia 测试网模式
使用真实的以太坊测试网：

```bash
# 1. 配置环境变量
cp .env.example .env

# 2. 编辑 .env 文件，设置您的钱包信息
# SENDER_ADDRESS=您的钱包地址
# PRIVATE_KEY=您的私钥

# 3. 获取测试币（如果需要）
# 访问：https://faucet.sepolia.dev/

# 4. 启动服务器
python app.py
```

#### 方式三：纯本地存储模式
不使用区块链，仅用于功能测试：

```bash
python app.py --no-blockchain
```

### 📋 验证启动成功
```bash
# 健康检查
curl http://localhost:5000/health
# 或者（如果5000端口被占用）
curl http://localhost:8080/health

# 区块链信息查询（仅区块链模式）
curl http://localhost:5000/blockchain/info
```

### 日常开发
```bash
# 启动开发环境（如果 Ganache 已运行）
python app.py

# 重新部署合约（如果合约有变化）
python deploy_local.py

# 运行测试
python scripts/test_blockchain.py
```

### 🔄 模式切换
#### 从本地模式切换到 Sepolia：
```bash
# 1. 备份当前 .env（可选）
cp .env .env.ganache.backup

# 2. 使用 Sepolia 配置
cp .env.example .env

# 3. 编辑 .env 文件，配置您的钱包信息
# 4. 重启服务器
python app.py
```

#### 从 Sepolia 切换回本地模式：
```bash
# 1. 启动 Ganache
./start_ganache.sh

# 2. 重新部署合约（会自动更新 .env）
python deploy_local.py

# 3. 重启服务器
python app.py
```

### 🚨 重要提示
- **模式识别**：服务器会根据 `.env` 中的 `BLOCKCHAIN_RPC_URL` 自动识别模式
  - 包含 `localhost` 或 `127.0.0.1` → 本地 Ganache 模式
  - 其他 URL → Sepolia/远程网络模式
- **端口冲突**：如果 5000 端口被占用（如 macOS AirPlay），使用 `--port 8080`
- **私钥安全**：Sepolia 私钥仅用于测试，切勿用于主网

### 安全注意事项
- **本地模式**：私钥由脚本自动生成，仅用于开发
- **测试网模式**：使用测试网私钥，勿用于主网
- **生产环境**：使用环境变量或密钥管理服务存储私钥
- `.env` 文件已加入 `.gitignore`，避免提交敏感信息

## 🧪 测试

### 功能测试
```bash
# 测试区块链功能
python scripts/test_blockchain.py

# 健康检查
curl http://localhost:5000/health
```

### API 测试示例
```bash
# 设备注册
curl -X POST http://localhost:5000/attest \
  -H "Content-Type: application/json" \
  -d '{"keyId": "test-key", "attestationObject": "...", "clientDataJSON": "..."}'

# 查询状态
curl http://localhost:5000/status/test-key
```

## 🔧 故障排除

### Ganache 相关
- **端口占用**：`lsof -i :8545` 查看占用进程，`kill -9 <pid>` 结束进程
- **启动失败**：检查 Node.js 和 ganache 是否正确安装
- **连接失败**：确认 Ganache 在 8545 端口运行

### 合约部署
- **部署失败**：确认 Ganache 正在运行
- **编译错误**：检查 Solidity 编译器版本
- **权限问题**：确认账户有足够的 ETH

### 服务器启动
- **环境变量缺失**：检查 `.env` 文件是否正确配置
- **端口占用**：使用 `--port` 参数指定其他端口
- **依赖问题**：重新运行 `./setup.sh`

## 📚 更多信息

- [以太坊开发文档](https://ethereum.org/developers/)
- [Ganache 文档](https://trufflesuite.com/ganache/)
- [Web3.py 文档](https://web3py.readthedocs.io/)
- [Flask 文档](https://flask.palletsprojects.com/)
3. 启动服务: `python app.py`

### 运行测试
```bash
# 先启动服务器（任一模式）
python app.py --ganache

# 然后在另一个终端运行测试
python scripts/test_blockchain.py
```

## 🔒 安全提醒

- **私钥安全**: 生产环境中请使用硬件钱包或密钥管理服务
- **环境变量**: 不要在代码中硬编码私钥，使用 `.env` 文件管理
- **网络安全**: 生产环境请使用 HTTPS 和反向代理
- **依赖更新**: 定期更新依赖包以修复安全漏洞
- **访问控制**: 生产环境请配置适当的防火墙和访问控制

## 🚀 生产部署建议

- 使用 gunicorn 或 uWSGI 作为 WSGI 服务器
- 配置 Nginx 作为反向代理
- 使用 Docker 容器化部署
- 配置日志轮转和监控
- 使用主网而非测试网（需要真实的 ETH）

## 📞 故障排除

### 安装问题
- 运行一键安装脚本: `./setup.sh`
- 确保 Python 3.7+ 和 pip 已安装
- 如果权限问题，尝试: `pip install --user -r requirements.txt`

### Ganache 启动失败
- 确保已安装 Node.js: https://nodejs.org/
- 检查端口 8545 是否被占用: `lsof -i :8545`
- 手动安装 Ganache: `npm install -g ganache`
- 如果权限问题: `sudo npm install -g ganache`

### Sepolia 连接失败
- 检查网络连接和防火墙设置
- 验证 `.env` 文件中的配置是否正确
- 确认账户余额足够支付 Gas 费用
- 尝试使用不同的 RPC 端点

### 端口占用问题
- 使用不同端口: `python app.py --port 8080`
- 在 macOS 上，检查 AirPlay 接收器是否占用 5000 端口

### 其他问题
- 查看控制台日志获取详细错误信息
- 访问 `/health` 端点检查服务状态
- 检查 Python 和依赖包版本兼容性
- 重新运行安装脚本: `./setup.sh`
