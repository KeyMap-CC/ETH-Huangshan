import SwiftUI
import LocalAuthentication

/// 业务状态
@Observable                               // Xcode 16 的新宏；若用旧版 SwiftUI 改为 class + @Published
final class AppState {
    var authenticated = false             // FaceID 是否通过
    var info: String? = nil               // 发送结果
}

struct ContentView: View {
    @State private var state = AppState()
    @State private var keyID: String = ""
    @State private var challengeData: Data? = nil
    @State private var serverRegistered: Bool? = nil   // nil = 未检查 / 加载中
    private let baseURL = URL(string: "http://127.0.0.1:5000")!
    
    var body: some View {
        ZStack {
            // ── 1. 中央按钮 ───────────────────────────────
            VStack {
                Spacer()
                if state.authenticated {
                    switch serverRegistered {
                    case .none:
                        ProgressView("Checking…")
                    case .some(false):
                        Button("Register (Attest)") {
                            Task { await register() }
                        }
                        .buttonStyle(.borderedProminent)
                    case .some(true):
                        Button("Send Message") {
                            Task { await sendAssertion() }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                } else {
                    Button("Continue by unlock Face ID") {
                        Task { await authenticate() }
                    }
                    .buttonStyle(.bordered)
                }
                Spacer()
            }
            
            // ── 2. 底部滚动窗口 ───────────────────────────
            ScrollView {
                if let info = state.info {
                    Text(info)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                }
            }
            .frame(height: 200)                            // 固定高度，可滚动
            .background(Color(uiColor: .systemGray6))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal)
            .frame(maxHeight: .infinity, alignment: .bottom) // 锚定到底部
            .padding(.bottom, 40)                           // 离屏幕底边 40pt
        }
        .padding(40)                                         // 整体留白
        .animation(.easeInOut, value: state.authenticated)   // 认证切换动画
    }
       
    
    // MARK: - Face ID
    @MainActor
    private func authenticate() async {
        let ctx = LAContext()
        ctx.localizedCancelTitle = "取消"
        
        var error: NSError?
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
                                    error: &error) else {
            state.info = error?.localizedDescription ?? "无法使用 Face ID"
            return
        }
        
        do {
            try await ctx.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
                                         localizedReason: "请验证身份以发送消息")
            state.authenticated = true
            Task { await checkServerRegistration() }
        } catch {
            state.info = "验证失败：\(error.localizedDescription)"
        }
    }

    // MARK: - Check registration status
    @MainActor
    private func checkServerRegistration() async {
        // 初始状态：正在检查
        serverRegistered = .none
        do {
            // 1. 保证有 keyID
            if keyID.isEmpty {
                keyID = try MockAppAttest.currentKeyID()
            }
            // 2. 请求服务器
            let url = baseURL.appendingPathComponent("status/\(keyID)")
            let (data, response) = try await URLSession.shared.data(from: url)

            guard let http = response as? HTTPURLResponse else {
                appendLog("❌ 无法解析 HTTP 响应")
                return
            }
            appendLog("🔗 已连接服务器 (状态 \(http.statusCode))")

            switch http.statusCode {
            case 200:
                // 服务器在线且已返回 JSON
                let resp = try JSONDecoder().decode(StatusResp.self, from: data)
                if resp.registered {
                    challengeData = Data(base64Encoded: resp.challenge)
                    serverRegistered = true
                    appendLog("✅ 服务器已存在公钥")
                } else {
                    serverRegistered = false
                    appendLog("ℹ️ 服务器无记录，需注册")
                }

            case 404:
                // 专门用 404 表示“找不到 key”
                serverRegistered = false
                appendLog("ℹ️ 服务器无记录 (404)，需注册")

            default:
                // 其它 HTTP 错误
                let bodyPreview = String(decoding: data, as: UTF8.self)
                appendLog("❌ HTTP \(http.statusCode) 错误，响应：\(bodyPreview)")
                serverRegistered = nil
            }

        } catch let urlErr as URLError {
            // 网络层无法连接
            appendLog("❌ 无法连接服务器：\(urlErr.code.rawValue) \(urlErr.localizedDescription)")
            serverRegistered = nil
        } catch {
            // 解析 / 其它错误
            appendLog("❌ 检查服务器状态失败：\(error.localizedDescription)")
            serverRegistered = nil
        }
    }

    private struct StatusResp: Decodable {
        let registered: Bool
        let challenge: String
    }
    // MARK: - App Attest Demo
    @MainActor
    private func register() async {
        do {
            let attData = try MockAppAttest.register()
            appendLog("发送 Attestation…")

            var req = URLRequest(url: baseURL.appendingPathComponent("attest"))
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = attData

            let (data, response) = try await URLSession.shared.data(for: req)
            if let http = response as? HTTPURLResponse {
                appendLog("🔗 Try to connect to server (status \(http.statusCode))")
                // 若非 2xx，直接打印响应并返回
                guard (200...299).contains(http.statusCode) else {
                    let bodyPreview = String(decoding: data, as: UTF8.self)
                    appendLog("❌ HTTP \(http.statusCode) Error, response：\(bodyPreview)")
                    return
                }
            }
            let resp: AttestResp
            do {
                resp = try JSONDecoder().decode(AttestResp.self, from: data)
            } catch {
                appendLog("❌ JSON 解析失败：\(error.localizedDescription)")
                return
            }
            keyID = resp.keyID
            challengeData = Data(base64Encoded: resp.challenge)
            serverRegistered = true          // 注册成功后标记为已在服务器登记
            appendLog("✔️ 注册成功，收到 challenge")
            sendMockMessage()
        } catch let urlErr as URLError {
            appendLog("❌ 无法连接服务器：\(urlErr.code.rawValue) \(urlErr.localizedDescription)")
        } catch {
            appendLog("❌ 注册失败 \(error.localizedDescription)")
        }
    }
    
    @MainActor
    private func sendAssertion() async {
        guard let challengeData = challengeData else { return }
        do {
            let assertData = try MockAppAttest.generateAssertion(challenge: challengeData)
            appendLog("发送 Assertion…")
            
            var req = URLRequest(url: baseURL.appendingPathComponent("assert"))
            req.httpMethod = "POST"
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            req.httpBody = assertData
            
            let (data, response) = try await URLSession.shared.data(for: req)
            if let http = response as? HTTPURLResponse {
                appendLog("🔗 Try to connect to server (status \(http.statusCode))")
                guard (200...299).contains(http.statusCode) else {
                    let bodyPreview = String(decoding: data, as: UTF8.self)
                    appendLog("❌ HTTP \(http.statusCode) 错误，响应：\(bodyPreview)")
                    return
                }
            }
            appendLog("🎉 断言验证通过！")
            sendMockMessage()
            await checkServerRegistration()
        } catch let urlErr as URLError {
            appendLog("❌ 无法连接服务器：\(urlErr.code.rawValue) \(urlErr.localizedDescription)")
        } catch {
            appendLog("❌ 断言失败 \(error.localizedDescription)")
        }
    }
    
    // MARK: - Log Helper
    @MainActor
    private func appendLog(_ msg: String) {
        if let cur = state.info {
            state.info = msg + "\n" + cur
        } else {
            state.info = msg
        }
    }
    
    /// 解码注册响应
    private struct AttestResp: Decodable {
        let keyID: String
        let challenge: String
    }
    // MARK: - Demo: Send message (pseudo)
    @MainActor
    private func sendMockMessage() {
        // 在此处替换为真实的网络发送逻辑
        // 例如：
        // let body = ["type": "ping", "keyID": keyID]
        // try await apiClient.post("/message", json: body)
        appendLog("📤 已发送消息（伪代码）")
    }
}
