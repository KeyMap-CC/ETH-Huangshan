#!/bin/bash
# start_ganache.sh - 独立启动 Ganache 脚本

echo "🚀 启动 Ganache 本地开发网络"
echo "================================"

# 检查 Ganache CLI 是否安装
if command -v ganache-cli &> /dev/null; then
    GANACHE_CMD="ganache-cli"
    echo "✅ 使用 ganache-cli"
elif command -v ganache &> /dev/null; then
    GANACHE_CMD="ganache"
    echo "✅ 使用 ganache"
else
    echo "❌ 未找到 Ganache CLI"
    echo "请安装 Ganache: npm install -g ganache"
    exit 1
fi

# 检查端口是否被占用
if lsof -i :8545 &> /dev/null; then
    echo "⚠️  端口 8545 已被占用"
    echo "请先停止占用端口的进程，或使用其他端口"
    exit 1
fi

echo "🌐 启动参数:"
echo "   - 端口: 8545"
echo "   - 账户数量: 10"
echo "   - 确定性模式: 启用"
echo "   - 每个账户余额: 1000 ETH"
echo ""

# 启动 Ganache
if [ "$GANACHE_CMD" = "ganache-cli" ]; then
    ganache-cli \
        --port 8545 \
        --accounts 10 \
        --deterministic \
        --defaultBalanceEther 1000 \
        --networkId 1337 \
        --gasLimit 10000000 \
        --gasPrice 20000000000
else
    ganache \
        --port 8545 \
        --accounts 10 \
        --deterministic \
        --defaultBalanceEther 1000 \
        --networkId 1337 \
        --gasLimit 10000000 \
        --gasPrice 20000000000
fi
