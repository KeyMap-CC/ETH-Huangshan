//
//  MockAppAttest.swift
//
//  离线演示用的 “App Attest” 客户端侧伪实现。
//  ⚠️ 仅用于 demo / 测试，**绝不可** 在实际生产环境中替代真正的 App Attest。
//  作者：ChatGPT（2025-07-10）
//

import Foundation
import CryptoKit
import Security

// MARK: - 对外可序列化的数据结构

/// 注册阶段返回给服务器的“Attestation 对象”
public struct MockAttestation: Codable {
    /// app bundle id（方便服务端比对）
    public let appID: String
    /// 公钥 (ANSI X9.63) base64
    public let publicKey: String
    /// keyID = SHA-256(publicKey) 16 进制
    public let keyID: String
    /// 设备侧时间戳（秒）
    public let timestamp: UInt64
    /// 服务器可验证的签名 (base64, DER encoded)
    public let signature: String
}

/// 断言阶段返回给服务器的“Assertion 对象”
public struct MockAssertion: Codable {
    public let keyID: String          // 与注册时相同
    public let challenge: String      // 服务端下发的 challenge (base64)
    public let signature: String      // 签名(challenge) (base64)
}

// MARK: - 主服务

public final class MockAppAttest {
    // 你可以把 tag 换成自己项目的 reverse-DNS 前缀
    private static let keyTag = "com.example.mockappattest.key".data(using: .utf8)!

    /// 获取或生成私钥（P‑256，原始字节存入钥匙串）
    private static func loadOrCreatePrivateKey() throws -> P256.Signing.PrivateKey {
        // 1. 尝试读取钥匙串
        var query: [String: Any] = [
            kSecClass as String:            kSecClassKey,
            kSecAttrApplicationTag as String: keyTag,
            kSecReturnData as String:       true,
            kSecAttrAccessible as String:   kSecAttrAccessibleAfterFirstUnlock
        ]

        var item: CFTypeRef?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        switch status {
        case errSecSuccess:
            // 已存在：用原始字节还原私钥
            guard let data = item as? Data else { throw MockError.keyNotFound }
            return try P256.Signing.PrivateKey(rawRepresentation: data)

        case errSecItemNotFound:
            // 不存在：生成新钥匙并以原始字节形式写入钥匙串
            let privateKey = P256.Signing.PrivateKey()
            var addQuery = query
            // 写入时不能同时带 kSecReturnData，与存储键值冲突，移除
            addQuery.removeValue(forKey: kSecReturnData as String)
            addQuery[kSecValueData as String] = privateKey.rawRepresentation

            let addStatus = SecItemAdd(addQuery as CFDictionary, nil)
            guard addStatus == errSecSuccess else { throw MockError.keyAddFailed(addStatus) }
            return privateKey

        default:
            throw MockError.keychain(status)
        }
    }
    
    // MARK: - 辅助

    /// 返回当前设备密钥对应的 keyID；若无密钥则自动生成
    public static func currentKeyID() throws -> String {
        let privKey = try loadOrCreatePrivateKey()
        return SHA256.hash(data: privKey.publicKey.x963Representation)
            .map { String(format: "%02x", $0) }
            .joined()
    }

    // MARK: 注册 (Attestation)

    /// 生成离线 Attestation，并序列化为 JSON Data 返给服务器
    public static func register() throws -> Data {
        let privKey = try loadOrCreatePrivateKey()
        let pubKeyData = privKey.publicKey.x963Representation
        let keyID = SHA256.hash(data: pubKeyData).map { String(format: "%02x", $0) }.joined()

        // payload = appID || keyID || timestamp
        guard let appID = Bundle.main.bundleIdentifier else { throw MockError.missingBundleID }
        let timestamp = UInt64(Date().timeIntervalSince1970)

        var payload = Data()
        payload += Data(appID.utf8)
        payload += Data(keyID.utf8)
        withUnsafeBytes(of: timestamp.bigEndian) { payload.append(contentsOf: $0) }

        // 用客户端私钥签名
        let signature = try privKey.signature(for: payload).derRepresentation

        let attestation = MockAttestation(
            appID: appID,
            publicKey: pubKeyData.base64EncodedString(),
            keyID: keyID,
            timestamp: timestamp,
            signature: signature.base64EncodedString()
        )
        return try JSONEncoder().encode(attestation)
    }

    // MARK: 生成断言 (Assertion)

    /// 传入服务器 challenge (任意 Data)，生成断言 JSON Data
    public static func generateAssertion(challenge: Data) throws -> Data {
        let privKey = try loadOrCreatePrivateKey()
        let keyID = SHA256.hash(data: privKey.publicKey.x963Representation)
            .map { String(format: "%02x", $0) }.joined()

        let signature = try privKey.signature(for: challenge).derRepresentation
        let assertion = MockAssertion(
            keyID: keyID,
            challenge: challenge.base64EncodedString(),
            signature: signature.base64EncodedString()
        )
        return try JSONEncoder().encode(assertion)
    }
}

// MARK: - Tooling

private enum MockError: Error {
    case keyNotFound
    case keyAddFailed(OSStatus)
    case keychain(OSStatus)
    case missingBundleID
}

// Data 拼接语法糖
private extension Data {
    static func += (lhs: inout Data, rhs: Data) {
        lhs.append(rhs)
    }
}

// MARK: - 快速自测 (仅 DEBUG 环境编译)

#if DEBUG
///  小型自测：直接在单元测试里或 AppDelegate didFinishLaunching 里调用
func _mockAppAttestSelfTest() {
    do {
        let attJSON = try MockAppAttest.register()
        print("[Attestation]", String(data: attJSON, encoding: .utf8) ?? "")

        let challenge = Data("Hello-Server-Challenge".utf8)
        let assertJSON = try MockAppAttest.generateAssertion(challenge: challenge)
        print("[Assertion]", String(data: assertJSON, encoding: .utf8) ?? "")
    } catch {
        print("❌ MockAppAttest Error:", error)
    }
}
#endif
