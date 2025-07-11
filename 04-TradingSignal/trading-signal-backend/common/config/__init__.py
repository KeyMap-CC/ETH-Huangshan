import os
from .dev_config import DevelopmentConfig
from .prod_config import ProductionConfig
from common.utils.logger import setup_logger

# 根据环境变量选择配置
ENV = os.getenv('QUANTITATIVE_ENV', 'DEV')

config_map = {
    'DEV': DevelopmentConfig,
    'PROD': ProductionConfig,
}

logger = setup_logger("config")

logger.info(f"读取配置: {ENV}")

# 当前环境的配置
current_config = config_map[ENV]


# 导出配置
MYSQL_CONFIG = current_config.MYSQL_CONFIG
REDIS_CONFIG = current_config.REDIS_CONFIG
