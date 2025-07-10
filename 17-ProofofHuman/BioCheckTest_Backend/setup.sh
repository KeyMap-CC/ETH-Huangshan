#!/bin/bash
# setup.sh - BioCheck 项目一键安装脚本

echo "🚀 BioCheck Backend 一键安装"
echo "================================"

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 未找到 Python3，请先安装 Python"
    exit 1
fi

# 检查 pip
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "❌ 未找到 pip，请先安装 pip"
    exit 1
fi

# 使用正确的 pip 命令
PIP_CMD="pip"
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
fi

echo "✅ Python 环境检查通过"

# 检查 Node.js (Ganache 需要)
if ! command -v node &> /dev/null; then
    echo "⚠️  未找到 Node.js，Ganache 模式可能无法使用"
    echo "   请访问 https://nodejs.org/ 安装 Node.js"
    echo "   或者使用其他模式: python app.py --no-blockchain"
    echo ""
fi

# 安装 Python 依赖
echo "📦 安装 Python 依赖..."
$PIP_CMD install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Python 依赖安装失败"
    echo "   请检查网络连接或尝试: pip install --user -r requirements.txt"
    exit 1
fi

# 检查 Ganache CLI
if command -v node &> /dev/null; then
    echo "🔧 检查 Ganache CLI..."
    if ! command -v ganache &> /dev/null; then
        echo "📥 安装 Ganache CLI..."
        npm install -g ganache
        if [ $? -ne 0 ]; then
            echo "⚠️  Ganache CLI 安装失败，可能需要管理员权限"
            echo "   请手动安装: sudo npm install -g ganache"
            echo "   或使用其他模式进行开发"
        fi
    else
        echo "✅ Ganache CLI 已安装"
    fi
fi

# 创建示例环境文件
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "✅ 已创建 .env 文件，如需使用 Sepolia 测试网请编辑此文件"
fi

echo ""
echo "✅ 安装完成！"
echo ""
echo "🎯 快速开始:"
echo "   本地开发:    python app.py --ganache"
echo "   测试网模式:  python app.py"
echo "   本地存储:    python app.py --no-blockchain"
echo ""
echo "🔧 其他选项:"
echo "   查看帮助:    python app.py --help"
echo "   健康检查:    curl http://localhost:5000/health"
echo ""
echo "📖 更多信息请查看 README.md"