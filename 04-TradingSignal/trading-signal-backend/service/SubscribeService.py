from flask import jsonify
from sqlalchemy import true

from common.mysql.connection import get_db
from common.mysql.models import Subscribe
from common.utils.logger import setup_logger


class SubscribeService:
    def __init__(self):
        self.logger = setup_logger(self.__class__.__name__)
        self.db = next(get_db())

    def subscribe(self, user_id, platform, product_id):
        # 1. 先找之前的订阅是否存在，如果存在，就启用它。
        # 2. 如果不存在之前订阅过，就新建
        subscribe = self.db.query(Subscribe).filter(Subscribe.user_id == user_id,
                                                    Subscribe.platform == platform,
                                                    Subscribe.product_id == product_id).first()

        if subscribe is not None:
            if subscribe.is_active:
                return "正在订阅"
            else:
                subscribe.is_active = True
        else:
            subscribe = Subscribe(
                user_id=user_id,
                platform=platform,
                product_id=product_id,
                is_active=True
            )
            self.db.add(subscribe)

        self.db.commit()
        return jsonify({
            'code': 200,
            'message': '订阅成功',
            'data': "订阅成功"
        }), 200

    def unsubscribe(self, user_id, platform, product_id):
        subscribe = self.db.query(Subscribe).filter(Subscribe.user_id == user_id,
                                                    Subscribe.platform == platform,
                                                    Subscribe.product_id == product_id).first()
        if subscribe is not None:
            if subscribe.is_active:
                subscribe.is_active = False
                self.db.commit()

            return jsonify({
                'code': 200,
                'message': '取消订阅成功',
                'data': "取消订阅成功"
            }), 200

        else:
            return jsonify({
                'code': 500,
                'message': '订阅信息不存在',
                'data': "订阅信息不存在"
            }), 200

    def select_user_subscribe(self, user_id, platform):
        subscribe_list = self.db.query(Subscribe).filter(Subscribe.user_id == user_id,
                                                         Subscribe.platform == platform,
                                                         Subscribe.is_active.is_(true())).all()
        result_list = []

        if len(subscribe_list) > 0:
            result_list = [subscribe.product_id for subscribe in subscribe_list]

        return jsonify({
            'code': 200,
            'message': '查询成功',
            'data': result_list
        }), 200

    def select_product_subscribe_of_user(self, platform, product_id):
        subscribe_list = self.db.query(Subscribe).filter(Subscribe.product_id == product_id,
                                                         Subscribe.platform == platform,
                                                         Subscribe.is_active.is_(true())).all()
        result_list = []

        if len(subscribe_list) > 0:
            result_list = [subscribe.user_id for subscribe in subscribe_list]

        return jsonify({
            'code': 200,
            'message': '查询成功',
            'data': result_list
        }), 200
