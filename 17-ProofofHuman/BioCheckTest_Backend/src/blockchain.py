# src/blockchain.py
"""
区块链交互模块
处理与智能合约的所有交互
"""

from web3 import Web3
from config.settings import BlockchainConfig
import logging

logger = logging.getLogger(__name__)

class BlockchainService:
    def __init__(self):
        """初始化区块链服务"""
        self.config = BlockchainConfig()
        self.w3 = None
        self.contract = None
        self._init_connection()
    
    def _init_connection(self):
        """初始化区块链连接"""
        try:
            self.w3 = Web3(Web3.HTTPProvider(self.config.RPC_URL))
            
            if not self.w3.is_connected():
                logger.warning("无法连接到区块链网络")
                return False
            
            if not self.config.CONTRACT_ADDRESS:
                logger.warning("未配置合约地址")
                return False
                
            self.contract = self.w3.eth.contract(
                address=self.config.CONTRACT_ADDRESS,
                abi=self.config.CONTRACT_ABI
            )
            
            logger.info(f"已连接到区块链网络: {self.config.RPC_URL}")
            return True
            
        except Exception as e:
            logger.error(f"初始化区块链连接失败: {str(e)}")
            return False
    
    def is_available(self) -> bool:
        """检查区块链服务是否可用"""
        return self.w3 is not None and self.contract is not None and self.w3.is_connected()
    
    def register_public_key(self, key_id: str, public_key_b64: str) -> bool:
        """
        将公钥注册到区块链合约
        
        Args:
            key_id: 密钥ID
            public_key_b64: Base64编码的公钥
            
        Returns:
            bool: 注册是否成功
        """
        if not self.is_available():
            logger.warning("区块链服务不可用，跳过注册")
            return False
        
        try:
            # 构建交易
            nonce = self.w3.eth.get_transaction_count(self.config.SENDER_ADDRESS)
            
            transaction = self.contract.functions.registerPublicKey(
                key_id, 
                public_key_b64
            ).build_transaction({
                'from': self.config.SENDER_ADDRESS,
                'nonce': nonce,
                'gas': self.config.GAS_LIMIT,
                'gasPrice': self.w3.to_wei(self.config.GAS_PRICE_GWEI, 'gwei'),
            })
            
            # 签名交易
            signed_txn = self.w3.eth.account.sign_transaction(
                transaction, 
                private_key=self.config.PRIVATE_KEY
            )
            
            # 发送交易 (兼容不同版本的 web3.py)
            raw_transaction = (signed_txn.rawTransaction 
                             if hasattr(signed_txn, 'rawTransaction') 
                             else signed_txn.raw_transaction)
            tx_hash = self.w3.eth.send_raw_transaction(raw_transaction)
            
            # 等待交易确认
            tx_receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if tx_receipt.status == 1:
                logger.info(f"公钥已成功注册到区块链，交易哈希: {tx_hash.hex()}")
                return True
            else:
                logger.error(f"区块链交易失败，交易哈希: {tx_hash.hex()}")
                return False
                
        except Exception as e:
            logger.error(f"区块链注册失败: {str(e)}")
            return False
    
    def get_public_key(self, key_id: str) -> str:
        """
        从区块链获取公钥
        
        Args:
            key_id: 密钥ID
            
        Returns:
            str: Base64编码的公钥，如果不存在则返回None
        """
        if not self.is_available():
            logger.warning("区块链服务不可用")
            return None
        
        try:
            public_key = self.contract.functions.getPublicKey(key_id).call()
            return public_key if public_key else None
        except Exception as e:
            logger.error(f"从区块链获取公钥失败: {str(e)}")
            return None
    
    def get_network_info(self) -> dict:
        """获取网络信息"""
        if not self.is_available():
            return {"connected": False}
        
        try:
            return {
                "connected": True,
                "chain_id": self.w3.eth.chain_id,
                "latest_block": self.w3.eth.block_number,
                "contract_address": self.config.CONTRACT_ADDRESS,
                "rpc_url": self.config.RPC_URL
            }
        except Exception as e:
            logger.error(f"获取网络信息失败: {str(e)}")
            return {"connected": False, "error": str(e)}


# 全局区块链服务实例
blockchain_service = BlockchainService()
