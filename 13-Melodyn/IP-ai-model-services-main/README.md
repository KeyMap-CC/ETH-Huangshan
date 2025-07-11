# IP Model Chat Service

一个基于Node.js和Express的API服务，用于调用外部聊天API并提供简化的查询接口。

## 功能特点

- 🚀 简单易用的RESTful API
- 🔄 支持POST和GET两种查询方式
- 🛡️ 完善的错误处理机制
- 📊 健康检查和API信息端点
- 🌐 支持CORS跨域请求

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

```bash
npm start
```

服务将在 `http://localhost:3000` 启动。

### 开发模式

```bash
npm run dev
```

### 测试API

```bash
npm test
```

### 使用客户端工具

```bash
# 运行示例查询
npm run client

# 自定义查询
npm run client "你的问题"
```

### 浏览器测试界面

在浏览器中打开 `test.html` 文件，可以通过可视化界面测试所有API功能。

## API接口

### 1. POST查询

**请求:**
```bash
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query":"你好"}'
```

**响应:**
```json
{
  "success": true,
  "query": "你好",
  "response": "...",
  "timestamp": "2025-07-09T10:00:00.000Z"
}
```

### 2. GET查询

**请求:**
```bash
curl "http://localhost:3000/query?query=你好"
```

**响应:**
```json
{
  "success": true,
  "query": "你好",
  "response": "...",
  "timestamp": "2025-07-09T10:00:00.000Z"
}
```

### 3. 健康检查

**请求:**
```bash
curl http://localhost:3000/health
```

**响应:**
```json
{
  "status": "OK",
  "timestamp": "2025-07-09T10:00:00.000Z",
  "service": "IP Model Chat Service"
}
```

### 4. API信息

**请求:**
```bash
curl http://localhost:3000/info
```

**响应:**
```json
{
  "service": "IP Model Chat Service",
  "version": "1.0.0",
  "endpoints": {
    "POST /query": "发送聊天查询（JSON body中包含query字段）",
    "GET /query": "发送聊天查询（URL参数中包含query）",
    "GET /health": "健康检查",
    "GET /info": "API信息"
  },
  "externalAPI": {
    "url": "http://localhost:7861/chat/kb_chat",
    "kb_name": "wenxialin",
    "stream": true
  },
  "examples": {
    "POST /query": {
      "method": "POST",
      "url": "http://localhost:3000/query",
      "headers": { "Content-Type": "application/json" },
      "body": { "query": "你好" }
    },
    "GET /query": {
      "method": "GET",
      "url": "http://localhost:3000/query?query=你好"
    }
  }
}
```

## 配置

服务调用的外部API配置：

- **URL:** `http://localhost:7861/chat/kb_chat`
- **知识库名称:** `wenxialin`
- **流式响应:** `true`

你可以通过修改 `index.js` 中的 `EXTERNAL_API_CONFIG` 对象来更改这些配置。

## 错误处理

API包含完善的错误处理机制：

- 400: 缺少必需参数
- 500: 服务器内部错误或外部API调用失败

错误响应格式：
```json
{
  "success": false,
  "error": "错误信息",
  "timestamp": "2025-07-09T10:00:00.000Z"
}
```

## 项目结构

```
ip-model-services/
├── index.js              # 主服务文件
├── test.js               # API测试脚本
├── client.js             # 命令行客户端
├── test.html             # 浏览器测试界面
├── package.json          # 项目配置
├── .env.example          # 环境变量示例
├── README.md             # 项目说明
├── .vscode/
│   ├── tasks.json        # VS Code任务配置
│   └── launch.json       # 调试配置
└── .github/
    └── copilot-instructions.md  # Copilot指令
```

## 依赖

- **express**: Web应用框架
- **axios**: HTTP客户端
- **cors**: 跨域资源共享

## 注意事项

1. 确保外部API服务 `http://localhost:7861` 正在运行
2. 外部API的响应格式可能需要根据实际情况调整
3. 生产环境建议添加更多的安全性和监控功能

## 许可证

ISC
