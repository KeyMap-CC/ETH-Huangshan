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

  try {
    // // 1. 部署SafeWalletTemplate合约
    // console.log("\n1. 部署SafeWalletTemplate合约...");
    // const SafeWalletTemplate = await ethers.getContractFactory("SafeWalletTemplate");
    // const safeWalletTemplate = await SafeWalletTemplate.deploy();
    // await safeWalletTemplate.waitForDeployment();
    // const safeWalletTemplateAddress = await safeWalletTemplate.getAddress();
    // console.log("SafeWalletTemplate合约已部署到:", safeWalletTemplateAddress);

    // // 2. 部署SafeWalletFactory合约 (依赖SafeWalletTemplate)
    // console.log("\n2. 部署SafeWalletFactory合约...");
    // const SafeWalletFactory = await ethers.getContractFactory("SafeWalletFactory");
    // const safeWalletFactory = await SafeWalletFactory.deploy(safeWalletTemplateAddress);
    // await safeWalletFactory.waitForDeployment();
    // const safeWalletFactoryAddress = await safeWalletFactory.getAddress();
    // console.log("SafeWalletFactory合约已部署到:", safeWalletFactoryAddress);

    // // 3. 部署SafeVault合约
    // console.log("\n3. 部署SafeVault合约...");
    // const SafeVault = await ethers.getContractFactory("SafeVault");
    // const safeVault = await SafeVault.deploy();
    // await safeVault.waitForDeployment();
    // const safeVaultAddress = await safeVault.getAddress();
    // console.log("SafeVault合约已部署到:", safeVaultAddress);

    // // 4. 部署MultiSigManager合约
    // console.log("\n4. 部署MultiSigManager合约...");
    // const MultiSigManager = await ethers.getContractFactory("MultiSigManager");
    // const multiSigManager = await MultiSigManager.deploy();
    // await multiSigManager.waitForDeployment();
    // const multiSigManagerAddress = await multiSigManager.getAddress();
    // console.log("MultiSigManager合约已部署到:", multiSigManagerAddress);

    // 5. 部署SafeWallet7702合约
    console.log("\n5. 部署SafeWallet7702合约...");
    const SafeWallet7702 = await ethers.getContractFactory("SafeWallet7702");
    const safeWallet7702 = await SafeWallet7702.deploy();
    await safeWallet7702.waitForDeployment();
    await safeWallet7702.initialize("0xC70025f24bE879be9258Ac41932bAE873bF7FF0a", "0xEa5e8c4fb4A5EdE79Bee9Bc62B17eE70ff0e11eE", 1);
    const safeWallet7702Address = await safeWallet7702.getAddress();
    console.log("SafeWallet7702合约已部署到:", safeWallet7702Address);

    // // 输出部署摘要
    // console.log("\n" + "=".repeat(60));
    // console.log("部署完成！合约地址汇总:");
    // console.log("=".repeat(60));
    // console.log("SafeWalletTemplate合约:", safeWalletTemplateAddress);
    // console.log("SafeWalletFactory合约:", safeWalletFactoryAddress);
    // console.log("SafeVault合约:", safeVaultAddress);
    // console.log("MultiSigManager合约:", multiSigManagerAddress);
    // console.log("SafeWallet7702合约:", safeWallet7702Address);
    // console.log("=".repeat(60));

    // 计算部署花费
    const finalBalance = await deployer.provider.getBalance(deployer.address);
    const ethSpent = ethers.formatEther(initialBalance - finalBalance);
    console.log("\n部署花费:", ethSpent, "ETH");
    
    // // 保存部署信息到文件
    // const deploymentInfo = {
    //   network: "sepolia",
    //   deployer: deployer.address,
    //   deploymentTime: new Date().toISOString(),
    //   deploymentCost: ethSpent,
    //   contracts: {
    //     SafeWalletTemplate: safeWalletTemplateAddress,
    //     SafeWalletFactory: safeWalletFactoryAddress,
    //     SafeVault: safeVaultAddress,
    //     MultiSigManager: multiSigManagerAddress,
    //     SafeWallet7702: safeWallet7702Address
    //   }
    // };

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