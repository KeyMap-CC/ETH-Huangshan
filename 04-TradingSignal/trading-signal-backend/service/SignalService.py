from common.mysql.connection import get_db
from common.utils.logger import setup_logger


class SignalService:
    def __init__(self):
        self.logger = setup_logger(self.__class__.__name__)
        self.db = next(get_db())

    def buy_signal(self):
        pass

    def sell_signal(self):
        pass
