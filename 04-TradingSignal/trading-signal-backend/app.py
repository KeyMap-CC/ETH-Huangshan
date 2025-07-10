from flask import Flask
from flask_cors import CORS

from controller.SubscribeController import subscribe_bp

# 创建 Flask 应用
app = Flask(__name__)

# 配置 CORS
CORS(app)

# 注册蓝图
app.register_blueprint(subscribe_bp, url_prefix='/api/subscribe')
