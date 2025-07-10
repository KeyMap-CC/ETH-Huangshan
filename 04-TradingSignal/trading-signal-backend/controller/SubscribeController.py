from flask import Blueprint, jsonify
from service.SubscribeService import SubscribeService

# 创建蓝图
subscribe_bp = Blueprint('subscribe', __name__)
subscribe_service = SubscribeService()


@subscribe_bp.route('/subscribe', methods=['POST'])
def subscribe():
    return subscribe_service.subscribe("user_id", "TradingFlow", "flowID")


@subscribe_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    return subscribe_service.unsubscribe("user_id", "TradingFlow", "flowID")


@subscribe_bp.route('/select_user_subscribe', methods=['POST'])
def select_user_subscribe():
    return subscribe_service.select_user_subscribe("user_id", "TradingFlow")


@subscribe_bp.route('/select_flow_subscribe_of_user', methods=['POST'])
def select_flow_subscribe_of_user():
    return subscribe_service.select_product_subscribe_of_user("TradingFlow", "flowID")
