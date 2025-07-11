from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.pool import QueuePool
from common.config import MYSQL_CONFIG
from urllib.parse import quote

# 对包含特殊字符的host进行URL编码
encoded_password = quote(MYSQL_CONFIG['password'])
encoded_host = quote(MYSQL_CONFIG['host'])

# 创建数据库连接 URL
DATABASE_URL = f"mysql+mysqlconnector://{MYSQL_CONFIG['user']}:{encoded_password}@{encoded_host}:{MYSQL_CONFIG['port']}/{MYSQL_CONFIG['database']}"

# 创建数据库引擎（使用连接池）
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=MYSQL_CONFIG['pool_size'],
    max_overflow=MYSQL_CONFIG['max_overflow'],
    pool_timeout=MYSQL_CONFIG['pool_timeout'],
    pool_recycle=MYSQL_CONFIG['pool_recycle'],
    # 禁用查询缓存
    isolation_level="READ COMMITTED",
    # 设置连接池选项
    pool_pre_ping=True,  # 在从池中获取连接时检查连接是否有效
    pool_use_lifo=True,  # 使用 LIFO 策略,优先使用最近使用的连接
    # 设置会话选项
    echo=False,  # 不打印 SQL 语句
    # 设置连接选项
    connect_args={
        'autocommit': False,  # 禁用自动提交
        'consume_results': True,  # 立即消费结果
        'buffered': True,  # 使用缓冲游标
    }
)

# 创建会话工厂,设置会话选项
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=True  # 提交后使所有对象过期
)

# 创建基类
Base = declarative_base()

def get_db():
    """
    获取数据库会话
    """
    db = SessionLocal()
    try:
        # 设置会话选项
        db.expire_on_commit = True  # 确保提交后对象过期
        yield db
    finally:
        db.close() 