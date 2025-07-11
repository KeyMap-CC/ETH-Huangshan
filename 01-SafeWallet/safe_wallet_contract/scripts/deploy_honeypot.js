const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署蜜罐合约到Sepolia测试网...");
  
  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 检查环境变量
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "your_private_key_here") {
    console.log("⚠️  警告: 请设置有效的PRIVATE_KEY环境变量");
    console.log("1. 编辑 .env 文件");
    console.log("2. 将 your_private_key_here 替换为您的实际私钥");
    console.log("3. 私钥应该是64位十六进制字符串（不包含0x前缀）");
    process.exit(1);
  }

  try {
    // 1. 部署蜜罐合约
    console.log("\n1. 部署蜜罐合约...");
    const HoneypotContract = await ethers.getContractFactory("HoneypotContract");
    const honeypotContract = await HoneypotContract.deploy();
    await honeypotContract.waitForDeployment();
    const honeypotContractAddress = await honeypotContract.getAddress();
    console.log("HoneypotContract合约已部署到:", honeypotContractAddress);

    // 2. 部署蜜罐攻击者合约
    console.log("\n2. 部署蜜罐攻击者合约...");
    const HoneypotAttacker = await ethers.getContractFactory("HoneypotAttacker");
    const honeypotAttacker = await HoneypotAttacker.deploy(honeypotContractAddress);
    await honeypotAttacker.waitForDeployment();
    const honeypotAttackerAddress = await honeypotAttacker.getAddress();
    console.log("HoneypotAttacker合约已部署到:", honeypotAttackerAddress);

    // 输出部署摘要
    console.log("\n" + "=".repeat(60));
    console.log("蜜罐合约部署完成！");
    console.log("=".repeat(60));
    console.log("HoneypotContract合约:", honeypotContractAddress);
    console.log("HoneypotAttacker合约:", honeypotAttackerAddress);
    console.log("=".repeat(60));

    // 保存部署信息到文件
    const deploymentInfo = {
      network: "sepolia",
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      contracts: {
        HoneypotContract: honeypotContractAddress,
        HoneypotAttacker: honeypotAttackerAddress
      }
    };

    const fs = require("fs");
    fs.writeFileSync(
      "deployment-honeypot-sepolia.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n部署信息已保存到 deployment-honeypot-sepolia.json");

  } catch (error) {
    console.error("部署过程中发生错误:", error);
    process.exit(1);
  }
}

// 错误处理
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 