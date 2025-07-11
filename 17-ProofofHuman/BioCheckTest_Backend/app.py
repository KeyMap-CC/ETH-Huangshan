#!/usr/bin/env python3
# app.py - 主启动文件

"""
BioCheck App Attest 服务器
主启动入口
"""

import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.server import main

if __name__ == "__main__":
    main()
