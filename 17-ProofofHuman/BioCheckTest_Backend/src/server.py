# src/server.py
"""
BioCheck App Attest 服务器
支持可选的区块链集成
"""

from flask import Flask, request, jsonify, abort
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
import base64
import os
import struct
import time
import argparse
import logging

# 导入区块链服务
from src.blockchain import blockchain_service

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# 内存数据库
_db = {}    # keyID -> publicKey object

# 全局配置
BLOCKCHAIN_ENABLED = True  # 默认启用区块链


def sha256(data: bytes) -> str:
    """计算SHA256哈希"""
    digest = hashes.Hash(hashes.SHA256())
    digest.update(data)
    return digest.finalize().hex()


def load_pubkey(x963_b64: str):
    """从Base64编码的X9.63格式加载公钥"""
    raw = base64.b64decode(x963_b64)
    return ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), raw)


@app.route("/attest", methods=["POST"])
def attest():
    """
    设备注册端点
    验证App Attest并可选地注册到区块链
    """
    try:
        obj = request.get_json(force=True)
        public_key_b64 = obj["publicKey"]
        key_id = obj["keyID"]
        timestamp = obj["timestamp"]
        signature = base64.b64decode(obj["signature"])

        # 1. 验证 keyID = SHA256(pubKey)
        pub_raw = base64.b64decode(public_key_b64)
        if sha256(pub_raw) != key_id:
            abort(400, "keyID mismatch")

        # 2. 复原 payload = appID || keyID || timestamp(big endian u64)
        app_id = obj["appID"].encode()
        payload = app_id + key_id.encode() + struct.pack(">Q", timestamp)

        # 3. 验签
        pub = load_pubkey(public_key_b64)
        try:
            pub.verify(signature, payload, ec.ECDSA(hashes.SHA256()))
        except Exception:
            abort(400, "attestation signature invalid")

        # 4. 保存公钥到内存
        _db[key_id] = pub
        logger.info(f"设备注册成功: {key_id}")

        # 5. 可选：注册到区块链
        blockchain_success = False
        if BLOCKCHAIN_ENABLED:
            blockchain_success = blockchain_service.register_public_key(key_id, public_key_b64)
        else:
            logger.info("区块链功能已禁用，跳过区块链注册")

        # 6. 返回响应
        challenge = os.urandom(32)
        response = {
            "keyID": key_id, 
            "challenge": base64.b64encode(challenge).decode(),
            "blockchainEnabled": BLOCKCHAIN_ENABLED,
            "blockchainRegistered": blockchain_success
        }
        return jsonify(response)

    except Exception as e:
        logger.error(f"注册失败: {str(e)}")
        abort(500, "Internal server error")


@app.route("/assert", methods=["POST"])
def assert_():
    """
    设备断言验证端点
    """
    try:
        obj = request.get_json(force=True)
        key_id = obj["keyID"]
        challenge = base64.b64decode(obj["challenge"])
        signature = base64.b64decode(obj["signature"])

        pub = _db.get(key_id)
        if pub is None:
            abort(400, "unknown keyID")

        try:
            pub.verify(signature, challenge, ec.ECDSA(hashes.SHA256()))
        except Exception:
            abort(400, "assertion signature invalid")

        logger.info(f"断言验证成功: {key_id}")
        return jsonify({"result": "ok"})

    except Exception as e:
        logger.error(f"断言验证失败: {str(e)}")
        abort(500, "Internal server error")


@app.route("/status/<key_id>", methods=["GET"])
def status(key_id):
    """检查本地注册状态"""
    if key_id in _db:
        challenge = os.urandom(32)
        return jsonify({
            "registered": True,
            "challenge": base64.b64encode(challenge).decode()
        })
    return jsonify({"registered": False}), 404


@app.route("/blockchain/status/<key_id>", methods=["GET"])
def blockchain_status(key_id):
    """查询区块链上的公钥状态"""
    if not BLOCKCHAIN_ENABLED:
        return jsonify({"error": "Blockchain functionality is disabled"}), 503
    
    blockchain_public_key = blockchain_service.get_public_key(key_id)
    
    if blockchain_public_key:
        return jsonify({
            "registered": True,
            "keyID": key_id,
            "publicKey": blockchain_public_key
        })
    else:
        return jsonify({"registered": False}), 404


@app.route("/blockchain/info", methods=["GET"])
def blockchain_info():
    """获取区块链网络信息"""
    if not BLOCKCHAIN_ENABLED:
        return jsonify({"error": "Blockchain functionality is disabled"}), 503
    
    return jsonify(blockchain_service.get_network_info())


@app.route("/health", methods=["GET"])
def health():
    """健康检查端点"""
    return jsonify({
        "status": "healthy",
        "blockchain_enabled": BLOCKCHAIN_ENABLED,
        "blockchain_available": blockchain_service.is_available() if BLOCKCHAIN_ENABLED else False,
        "registered_devices": len(_db)
    })


def create_app(blockchain_enabled=True):
    """创建Flask应用"""
    global BLOCKCHAIN_ENABLED
    BLOCKCHAIN_ENABLED = blockchain_enabled
    
    if BLOCKCHAIN_ENABLED:
        logger.info("BioCheck服务器启动 - 区块链功能已启用")
    else:
        logger.info("BioCheck服务器启动 - 区块链功能已禁用")
    
    return app


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='BioCheck App Attest Server')
    parser.add_argument(
        '--no-blockchain', 
        action='store_true',
        help='禁用区块链功能，仅使用本地存储'
    )
    parser.add_argument(
        '--port', 
        type=int, 
        default=5000,
        help='服务器端口 (默认: 5000)'
    )
    parser.add_argument(
        '--host', 
        default='127.0.0.1',
        help='服务器地址 (默认: 127.0.0.1)'
    )
    
    args = parser.parse_args()
    
    # 处理启动模式
    if args.no_blockchain:
        # 纯本地模式
        app = create_app(blockchain_enabled=False)
        print(f"🚀 BioCheck服务器启动 (本地模式)")
        print(f"   地址: http://{args.host}:{args.port}")
        print(f"   区块链: 禁用")
        print(f"   健康检查: http://{args.host}:{args.port}/health")
        app.run(host=args.host, port=args.port, debug=False)
        
    else:
        # 区块链模式 (检测是本地还是测试网)
        from dotenv import load_dotenv
        load_dotenv()
        
        rpc_url = os.getenv('BLOCKCHAIN_RPC_URL', '')
        
        if 'localhost' in rpc_url or '127.0.0.1' in rpc_url:
            # 本地 Ganache 模式
            print("🛠️  本地 Ganache 模式")
            print("📋 请确保:")
            print("   1. Ganache 已启动: ./start_ganache.sh")
            print("   2. 合约已部署: python deploy_local.py")
            print("   3. .env 文件已配置")
            print("")
            
            # 检查环境配置
            required_vars = ['BLOCKCHAIN_RPC_URL', 'CONTRACT_ADDRESS', 'SENDER_ADDRESS', 'PRIVATE_KEY']
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            
            if missing_vars:
                print("❌ 缺少必要的环境变量配置:")
                for var in missing_vars:
                    print(f"   - {var}")
                print("\n请运行以下步骤:")
                print("1. 启动 Ganache: ./start_ganache.sh")
                print("2. 部署合约: python deploy_local.py")
                return
            
        else:
            # Sepolia 测试网模式
            print("🌐 启动 Sepolia 测试网模式...")
            
            # 检查环境配置
            required_vars = ['BLOCKCHAIN_RPC_URL', 'CONTRACT_ADDRESS', 'SENDER_ADDRESS', 'PRIVATE_KEY']
            missing_vars = [var for var in required_vars if not os.getenv(var)]
            
            if missing_vars:
                print("❌ 缺少必要的环境变量配置:")
                for var in missing_vars:
                    print(f"   - {var}")
                print("\n请在 .env 文件中配置这些变量，或参考 .env.example")
                print("如果您没有 Sepolia 测试账户，可以:")
                print("1. 使用本地模式: 先运行 ./start_ganache.sh 然后 python deploy_local.py")
                print("2. 或访问 https://faucet.sepolia.dev/ 获取测试币")
                return
        
        # 创建应用
        app = create_app(blockchain_enabled=True)
        
        print(f"✅ 区块链配置检查通过")
        print(f"📋 合约地址: {os.getenv('CONTRACT_ADDRESS')}")
        print(f"💼 发送账户: {os.getenv('SENDER_ADDRESS')}")
        print(f"🌐 服务器启动: http://{args.host}:{args.port}")
        print(f"🔍 健康检查: http://{args.host}:{args.port}/health")
        
        app.run(host=args.host, port=args.port, debug=False)


if __name__ == "__main__":
    main()
