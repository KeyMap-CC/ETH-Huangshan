const { ethers } = require("hardhat");

async function main() {
  console.log("开始测试部署到Sepolia测试网...");
  
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
    // 部署一个简单的测试合约
    console.log("\n部署测试合约...");
    const TestContract = await ethers.getContractFactory("SafeWalletTest");
    const testContract = await TestContract.deploy();
    await testContract.waitForDeployment();
    const testContractAddress = await testContract.getAddress();
    console.log("测试合约已部署到:", testContractAddress);

    console.log("\n部署测试成功！");
    console.log("合约地址:", testContractAddress);
    console.log("网络: Sepolia");
    console.log("部署者:", deployer.address);

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