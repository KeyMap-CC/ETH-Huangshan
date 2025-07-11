# config/settings.py
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class Config:
    """基础配置"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
class BlockchainConfig:
    """区块链配置"""
    RPC_URL = os.getenv('BLOCKCHAIN_RPC_URL', 'http://127.0.0.1:8545')
    CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS', '')
    SENDER_ADDRESS = os.getenv('SENDER_ADDRESS', '')
    PRIVATE_KEY = os.getenv('PRIVATE_KEY', '')
    GAS_LIMIT = int(os.getenv('GAS_LIMIT', '200000'))
    GAS_PRICE_GWEI = int(os.getenv('GAS_PRICE_GWEI', '20'))
    
    # 合约 ABI
    CONTRACT_ABI = [
        {
            "inputs": [
                {"internalType": "string", "name": "keyId", "type": "string"},
                {"internalType": "string", "name": "publicKey", "type": "string"}
            ],
            "name": "registerPublicKey",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "string", "name": "keyId", "type": "string"}],
            "name": "getPublicKey",
            "outputs": [{"internalType": "string", "name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]
