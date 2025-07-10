# 环境配置说明

## 问题描述
trading-signal-frontend 可能会请求生产API而不是本地开发API，导致CORS错误和过多请求。

## 解决方案

### 创建 .env 文件
在 `trading-signal-frontend` 根目录创建 `.env` 文件，内容如下：

```env
# TradingFlow Backend API Configuration
VITE_TRADINGFLOW_API_URL=http://localhost:8000/api/v1
```

### 验证配置
1. 确保 TradingFlow 后端在 `http://localhost:8000` 运行
2. 重启前端开发服务器：`npm run dev` 或 `pnpm dev`
3. 检查浏览器网络面板，确认请求发送到 `localhost:8000` 而不是 `stg.tradingflow.pro`

### 注意事项
- `.env` 文件已添加到 `.gitignore`，不会被提交到版本控制
- 如果后端运行在其他端口，请相应修改 `VITE_TRADINGFLOW_API_URL`
- 确保后端 CORS 配置包含前端端口（已在后端配置中修复）

## 认证频繁请求修复
✅ 已修复 `useAuth.ts` hook，添加了：
- 防抖机制（3秒冷却期）
- 请求缓存避免重复调用
- 401错误时自动清除token
- `isAuthenticated` 和 `isLoading` 状态

✅ 已修复 `Index.tsx` 页面，移除了可能导致循环请求的 useEffect

## 测试验证
修复后，trading-signal-frontend 应该：
1. 不再疯狂请求 `/auth/me`
2. 不再收到 429 Too Many Requests 错误
3. 正确处理认证状态 