https://docs.google.com/presentation/d/1Yfxr--E_Xv9AbKYgALymh0vPTUCf6Tw1l7pF_XUe-TI/edit?usp=sharing

- 项目名称：ProofOfHuman

- 项目描述：利用 Web2 的可信设施来证明用户是一个活着的人

- ⚠️ 注意 本项目不具备生产环境部署能力 尤其是 BioCheckTest/MockAppAttest.swift 部分，因 Apple 限制 免费账户在调用该能力的时候会导致编译不通过 仅做流程展示

- 以太坊生态集成：明确说明你的项目是如何利用以太坊生态的特性和技术栈的。例如，使用了 solidity 智能合约，或者如何与 EVM 链进行交互。

- 技术栈：列出你的项目使用的所有主要技术，包括前端、后端、智能合约语言（solidity）、以及任何库或框架。
  - 前端 Swift
    - 硬件能力 App attest FaceID
  - 后端 Flask
  - 一致性检查 CDHASH 
  - 合约 Sol
  - 密码学保障 Sha256 X509

- 安装与运行指南：提供详细的步骤，说明如何安装、部署和运行你的项目。这对于评委测试你的项目至关重要。如果需要特定的环境配置（例如 Node.js 版本、钱包插件等），请务必注明。
  - 前端 新建Xcode项目 名为 并复制 BioCheckTest 中的文件到你的同名目录中 Build 并在模拟器或者是手机上运行，因除源码之外的文件可能会包含开发者账号实名信息 故删除
  - 后端 进入 BioCheckTest_Backend 目录 参考其Readme.md

- 项目亮点/创新点：项目本身的业务仅仅是创新点的一种实例化应用，重点是我们可以在一个可信设备上实现一致性和完整性检查，从而可以使用 WEB2 的可信对象实现向链上输送数据的能力的

- 未来发展计划 (可选)：如果你对项目有未来的规划，例如希望添加的新功能、改进方向等，可以在这里简要说明。
  - 使用 注册的 Apple developer 账号完善 App attest 的流程
  - 研究 Reproduction build
  - Android 设备应用的一致性检查和完整性检查
  - 实现验证 Attest 证书的 ZK 电路，从而能让区块链识别到消息，完成信息上链自动化。

- 团队成员 (可选)： Solo。

- 演示视频/截图：如果条件允许，提供一个简短的演示视频链接（例如上传到 YouTube、Bilibili 等）或项目截图会非常有帮助，让评委能直观地看到你的项目效果。
