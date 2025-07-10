import json
from pathlib import Path




class DevelopmentConfig:
    # 读取配置文件
    config_path = Path(__file__).parent / 'config.json'
    with open(config_path, 'r', encoding='utf-8') as f:
        config_data = json.load(f)

    # MySQL 配置
    MYSQL_CONFIG = {
        'host': config_data['MYSQL_CONFIG']['host'],
        'port': config_data['MYSQL_CONFIG']['port'],
        'user': config_data['MYSQL_CONFIG']['user'],
        'password': config_data['MYSQL_CONFIG']['password'],
        'database': 'trading_signal',
        'pool_size': 1000,
        'max_overflow': 10,
        'pool_timeout': 300,
        'pool_recycle': 3600,
    }

    # Redis 配置
    REDIS_CONFIG = {
        'host': 'localhost',
        'port': 6379,
        'db': 0,
        'max_connections': 10,  # 连接池最大连接数
        'timeout': 20,  # 连接超时时间（秒）
        'decode_responses': True  # 自动解码响应
    }


