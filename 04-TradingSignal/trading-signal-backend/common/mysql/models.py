from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, DECIMAL, Boolean
from common.mysql.connection import Base


# 订阅记录
class Subscribe(Base):
    __tablename__ = "subscribe"

    id = Column(Integer, primary_key=True, index=True)
    create_time = Column(DateTime, default=datetime.now)
    update_time = Column(DateTime)
    user_id = Column(String)  # 用户
    platform = Column(String) # 平台：TradingFlow, OKX, Binance
    product_id = Column(String) # 平台的交易产品
    is_active = Column(Boolean) # 是否订阅

