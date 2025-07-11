#!/usr/bin/env python3
"""
测试脚本：验证区块链集成功能
"""

import requests
import json
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
import time

def sha256(data: bytes) -> str:
    digest = hashes.Hash(hashes.SHA256())
    digest.update(data)
    return digest.finalize().hex()

def test_blockchain_integration():
    """
    测试区块链集成功能
    """
    # 尝试不同的端口
    ports = [5000, 8080, 3000]
    base_url = None
    
    for port in ports:
        try:
            test_url = f"http://127.0.0.1:{port}"
            response = requests.get(f"{test_url}/health", timeout=3)
            if response.status_code == 200:
                base_url = test_url
                print(f"✅ 找到运行中的服务器: {base_url}")
                break
        except:
            continue
    
    if not base_url:
        print("❌ 未找到运行中的服务器")
        print("请先启动服务器:")
        print("  - 本地模式: python app.py")
        print("  - 指定端口: python app.py --port 8080")
        return
    
    # 生成测试密钥对
    private_key = ec.generate_private_key(ec.SECP256R1())
    public_key = private_key.public_key()
    
    # 获取公钥的 X9.63 格式
    public_key_bytes = public_key.public_numbers().x.to_bytes(32, 'big') + \
                      public_key.public_numbers().y.to_bytes(32, 'big')
    public_key_b64 = base64.b64encode(b'\x04' + public_key_bytes).decode()
    
    # 计算 keyID
    key_id = sha256(base64.b64decode(public_key_b64))
    
    # 准备注册数据
    app_id = "com.example.biocheck"
    timestamp = int(time.time())
    
    # 创建签名 payload
    payload = app_id.encode() + key_id.encode() + timestamp.to_bytes(8, 'big')
    signature = private_key.sign(payload, ec.ECDSA(hashes.SHA256()))
    
    # 注册请求
    register_data = {
        "publicKey": public_key_b64,
        "keyID": key_id,
        "appID": app_id,
        "timestamp": timestamp,
        "signature": base64.b64encode(signature).decode()
    }
    
    print("🚀 开始测试区块链集成...")
    print(f"📋 Key ID: {key_id}")
    
    # 1. 测试注册
    print("\n1️⃣ 测试注册到区块链...")
    try:
        response = requests.post(f"{base_url}/attest", json=register_data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 注册成功!")
            print(f"   Key ID: {result['keyID']}")
            print(f"   区块链注册状态: {result.get('blockchainRegistered', 'Unknown')}")
            challenge = result['challenge']
        else:
            print(f"❌ 注册失败: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ 注册请求异常: {e}")
        return
    
    # 2. 测试本地状态查询
    print("\n2️⃣ 测试本地状态查询...")
    try:
        response = requests.get(f"{base_url}/status/{key_id}")
        if response.status_code == 200:
            print("✅ 本地状态查询成功!")
            print(f"   状态: {response.json()}")
        else:
            print(f"❌ 本地状态查询失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 本地状态查询异常: {e}")
    
    # 3. 测试区块链状态查询
    print("\n3️⃣ 测试区块链状态查询...")
    try:
        response = requests.get(f"{base_url}/blockchain/status/{key_id}")
        if response.status_code == 200:
            result = response.json()
            print("✅ 区块链状态查询成功!")
            print(f"   注册状态: {result['registered']}")
            if result['registered']:
                print(f"   公钥: {result['publicKey'][:50]}...")
        elif response.status_code == 404:
            print("⚠️ 区块链上未找到该公钥（可能区块链未正确配置）")
        else:
            print(f"❌ 区块链状态查询失败: {response.status_code}")
    except Exception as e:
        print(f"❌ 区块链状态查询异常: {e}")
    
    # 4. 测试断言验证
    print("\n4️⃣ 测试断言验证...")
    try:
        challenge_bytes = base64.b64decode(challenge)
        assertion_signature = private_key.sign(challenge_bytes, ec.ECDSA(hashes.SHA256()))
        
        assert_data = {
            "keyID": key_id,
            "challenge": challenge,
            "signature": base64.b64encode(assertion_signature).decode()
        }
        
        response = requests.post(f"{base_url}/assert", json=assert_data)
        if response.status_code == 200:
            print("✅ 断言验证成功!")
            print(f"   结果: {response.json()}")
        else:
            print(f"❌ 断言验证失败: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ 断言验证异常: {e}")
    
    print("\n🎉 测试完成!")

if __name__ == "__main__":
    test_blockchain_integration()
