import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime, timedelta
import glob

LOG_CONFIG = {
    'level': logging.INFO,
    'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    'date_format': '%Y-%m-%d %H:%M:%S',
    'max_bytes': 1 * 1024 * 1024 * 1024,  # 1G
    'backup_count': 5,
    'days_to_keep': 14  # 保留最近14天的日志
}


def clean_old_logs(log_dir: str):
    """
    清理超过指定天数的日志文件
    Args:
        log_dir: 日志目录路径
    """
    try:
        # 获取当前日期
        current_date = datetime.now()
        # 计算14天前的日期
        cutoff_date = current_date - timedelta(days=LOG_CONFIG['days_to_keep'])

        # 获取所有日志文件
        log_files = glob.glob(os.path.join(log_dir, 'app_*.log*'))

        for log_file in log_files:
            try:
                # 从文件名中提取日期
                file_date_str = log_file.split('app_')[1].split('.')[0]
                file_date = datetime.strptime(file_date_str, '%Y%m%d')

                # 如果文件日期早于截止日期,则删除
                if file_date < cutoff_date:
                    os.remove(log_file)
                    print(f"已删除旧日志文件: {log_file}")
            except (ValueError, IndexError):
                # 如果文件名格式不正确,跳过该文件
                continue
    except Exception as e:
        print(f"清理日志文件时出错: {str(e)}")


def setup_logger(name: str) -> logging.Logger:
    """
    设置指定名称的日志记录器
    Args:
        name: 日志记录器名称
    Returns:
        logging.Logger: 配置好的日志记录器
    """
    # 获取根日志记录器
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)

    # 如果已经有处理器,直接返回
    if logger.handlers:
        return logger

    # 创建日志目录
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs')
    os.makedirs(log_dir, exist_ok=True)

    # 清理旧日志文件
    clean_old_logs(log_dir)

    # 创建日志文件路径
    log_file = os.path.join(log_dir, f'app_{datetime.now().strftime("%Y%m%d")}.log')

    # 创建文件处理器
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=LOG_CONFIG['max_bytes'],
        backupCount=LOG_CONFIG['backup_count'],
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)

    # 创建控制台处理器
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # 创建格式化器
    formatter = logging.Formatter(
        fmt=LOG_CONFIG['format'],
        datefmt=LOG_CONFIG['date_format']
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # 添加处理器到日志记录器
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger
