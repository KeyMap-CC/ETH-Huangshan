const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署到Sepolia测试网...");
  
  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  const initialBalance = await deployer.provider.getBalance(deployer.address);
  console.log("部署账户:", deployer.address);
  console.log("初始账户余额:", ethers.formatEther(initialBalance), "ETH");
  
  // 获取当前gas价格
  const gasPrice = await deployer.provider.getFeeData();
  console.log("当前gas价格:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "Gwei");

  // 检查环境变量
  if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "your_private_key_here") {
    console.log("⚠️  警告: 请设置有效的PRIVATE_KEY环境变量");
    console.log("1. 编辑 .env 文件");
    console.log("2. 将 your_private_key_here 替换为您的实际私钥");
    console.log("3. 私钥应该是64位十六进制字符串（不包含0x前缀）");
    process.exit(1);
  }
   


try{

           // 5. 部署SafeWallet7702合约
    console.log("\n设置SafeWallet7702合约Owner...");
    const SafeWallet7702 = await ethers.getContractAt("SafeWallet7702", "0x4f88680BE181A50C7E540F92DAF32CE5D7896535");
    const safeWallet7702 = await SafeWallet7702.initialize("0xEa5e8c4fb4A5EdE79Bee9Bc62B17eE70ff0e11eE", "0xEa5e8c4fb4A5EdE79Bee9Bc62B17eE70ff0e11eE", 1);
    // await safeWallet7702.waitForDeployment();
    const safeWallet7702Address = await safeWallet7702.getAddress();
    console.log("SafeWallet7702合约Owner已设置成:", "0xEa5e8c4fb4A5EdE79Bee9Bc62B17eE70ff0e11eE");

    // const fs = require("fs");
    // fs.writeFileSync(
    //   "deployment-sepolia.json",
    //   JSON.stringify(deploymentInfo, null, 2)
    // );
    // console.log("\n部署信息已保存到 deployment-sepolia.json");

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