#!/usr/bin/env python3
# deploy_local.py - 部署合约到本地 Ganache

"""
部署智能合约到本地 Ganache 网络
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import json
from web3 import Web3
from solcx import compile_source, install_solc
import time

def check_ganache_running():
    """检查 Ganache 是否正在运行"""
    try:
        response = requests.post(
            "http://127.0.0.1:8545",
            json={"jsonrpc": "2.0", "method": "eth_accounts", "id": 1},
            timeout=5
        )
        return response.status_code == 200
    except:
        return False

def get_ganache_accounts():
    """获取 Ganache 账户和私钥"""
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
    
    if not w3.is_connected():
        raise Exception("无法连接到 Ganache")
    
    accounts = w3.eth.accounts
    print(f"📋 获取到 {len(accounts)} 个账户")
    
    # Ganache 确定性私钥（与 ganache-cli --deterministic 对应）
    deterministic_private_keys = [
        "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
        "0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
        "0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c",
        "0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913",
        "0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743",
        "0x395df67f0c2d2d9fe1ad08d1bc8b6627011959b79c53d7dd6a3536a33ab8a4fd",
        "0xe485d098507f54e7733a205420dfddbe58db035fa577fc294ebd14db90767a52",
        "0xa453611d9419d0e56f499079478fd72c37b251a94bfde4d19872c44cf65386e3",
        "0x829e924fdf021ba3dbbc4225edfece9aca04b929d6e75613329ca6f1d31c0bb4",
        "0xb0057716d5917badaf911b193b12b910811c1497b5bada8d7711f758981c3773"
    ]
    
    # 验证账户数量
    if len(accounts) > len(deterministic_private_keys):
        print(f"⚠️  警告: 账户数量({len(accounts)}) 超过已知私钥数量({len(deterministic_private_keys)})")
        accounts = accounts[:len(deterministic_private_keys)]
    
    private_keys = deterministic_private_keys[:len(accounts)]
    
    # 验证私钥是否正确
    for i, (account, private_key) in enumerate(zip(accounts, private_keys)):
        try:
            # 验证私钥是否对应账户
            from eth_account import Account
            derived_account = Account.from_key(private_key).address
            if derived_account.lower() != account.lower():
                print(f"❌ 账户 {i} 私钥验证失败: {account} != {derived_account}")
                raise Exception(f"私钥验证失败")
            else:
                print(f"✅ 账户 {i}: {account}")
        except Exception as e:
            print(f"❌ 验证账户 {i} 时出错: {e}")
            raise
    
    return accounts, private_keys

def deploy_contract(accounts, private_keys):
    """部署智能合约"""
    try:
        # 安装 Solidity 编译器
        try:
            install_solc('0.8.19')
        except:
            pass
        
        # 读取合约源码
        contract_path = os.path.join(os.path.dirname(__file__), 'contracts', 'PublicKeyRegistry.sol')
        
        with open(contract_path, 'r') as f:
            contract_source = f.read()
        
        print("📄 编译智能合约...")
        compiled_sol = compile_source(contract_source, solc_version='0.8.19')
        contract_interface = compiled_sol['<stdin>:PublicKeyRegistry']
        
        # 连接到 Ganache
        w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
        
        # 部署合约
        contract = w3.eth.contract(
            abi=contract_interface['abi'],
            bytecode=contract_interface['bin']
        )
        
        print("🚀 部署智能合约...")
        transaction = contract.constructor().build_transaction({
            'from': accounts[0],
            'gas': 1000000,
            'gasPrice': w3.to_wei('20', 'gwei'),
            'nonce': w3.eth.get_transaction_count(accounts[0])
        })
        
        # 签名并发送交易
        signed_txn = w3.eth.account.sign_transaction(transaction, private_keys[0])
        
        # 处理不同版本的 web3.py
        raw_transaction = (signed_txn.rawTransaction 
                         if hasattr(signed_txn, 'rawTransaction') 
                         else signed_txn.raw_transaction)
        
        tx_hash = w3.eth.send_raw_transaction(raw_transaction)
        print(f"📋 交易哈希: {tx_hash.hex()}")
        
        # 等待交易确认
        print("⏳ 等待交易确认...")
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        if tx_receipt.status == 1:
            contract_address = tx_receipt.contractAddress
            print(f"✅ 合约部署成功!")
            print(f"📋 合约地址: {contract_address}")
            
            # 保存配置到 .env 文件
            env_content = f"""# Ganache 本地开发环境配置 (自动生成)
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS={contract_address}
SENDER_ADDRESS={accounts[0]}
PRIVATE_KEY={private_keys[0]}
GAS_LIMIT=200000
GAS_PRICE_GWEI=20
"""
            
            with open('.env', 'w') as f:
                f.write(env_content)
            
            print("✅ 配置已保存到 .env 文件")
            return contract_address
        else:
            raise Exception("合约部署失败")
            
    except Exception as e:
        print(f"❌ 部署合约时出错: {str(e)}")
        return None

def main():
    print("🚀 BioCheck 合约部署工具")
    print("=" * 50)
    
    # 检查 Ganache 是否运行
    if not check_ganache_running():
        print("❌ Ganache 未运行")
        print("请先启动 Ganache:")
        print("   ./start_ganache.sh")
        return
    
    print("✅ Ganache 正在运行")
    
    try:
        # 获取账户和私钥
        print("\n📋 获取账户信息...")
        accounts, private_keys = get_ganache_accounts()
        
        # 显示主账户余额
        w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
        balance = w3.eth.get_balance(accounts[0]) / 10**18
        print(f"💰 主账户余额: {balance:.2f} ETH")
        
        # 部署合约
        print("\n🚀 开始部署合约...")
        contract_address = deploy_contract(accounts, private_keys)
        
        if contract_address:
            print("\n" + "=" * 50)
            print("🎉 部署完成!")
            print("=" * 50)
            print(f"📡 RPC URL: http://127.0.0.1:8545")
            print(f"📋 合约地址: {contract_address}")
            print(f"💼 发送账户: {accounts[0]}")
            print(f"🔑 私钥: {private_keys[0][:10]}...")
            print(f"💰 账户余额: {balance:.2f} ETH")
            print("=" * 50)
            print("✅ 现在可以启动后端服务器:")
            print("   python app.py --port 5000")
        else:
            print("❌ 部署失败")
    
    except Exception as e:
        print(f"❌ 错误: {str(e)}")

if __name__ == "__main__":
    main()
