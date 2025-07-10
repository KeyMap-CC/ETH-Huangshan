// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * PublicKeyRegistry 智能合约
 * 用于存储和管理 App Attest 的公钥
 */
contract PublicKeyRegistry {
    
    // 存储 keyID 到 publicKey 的映射
    mapping(string => string) private publicKeys;
    
    // 存储已注册的 keyID
    mapping(string => bool) private registered;
    
    // 事件：公钥注册
    event PublicKeyRegistered(string indexed keyId, string publicKey, address indexed registrar);
    
    // 注册公钥
    function registerPublicKey(string memory keyId, string memory publicKey) public {
        require(bytes(keyId).length > 0, "Key ID cannot be empty");
        require(bytes(publicKey).length > 0, "Public key cannot be empty");
        require(!registered[keyId], "Key ID already registered");
        
        publicKeys[keyId] = publicKey;
        registered[keyId] = true;
        
        emit PublicKeyRegistered(keyId, publicKey, msg.sender);
    }
    
    // 获取公钥
    function getPublicKey(string memory keyId) public view returns (string memory) {
        require(registered[keyId], "Key ID not registered");
        return publicKeys[keyId];
    }
    
    // 检查是否已注册
    function isRegistered(string memory keyId) public view returns (bool) {
        return registered[keyId];
    }
    
    // 获取注册状态和公钥（如果存在）
    function getRegistrationInfo(string memory keyId) public view returns (bool isReg, string memory pubKey) {
        isReg = registered[keyId];
        if (isReg) {
            pubKey = publicKeys[keyId];
        }
    }
}
