const { ethers } = require("hardhat");

async function main() {
  // 获取命令行参数
  const contractName = process.argv[2];
  if (!contractName) {
    console.error("请提供合约名称作为参数");
    console.error("示例: npx hardhat run scripts/deploy_single.js --network sepolia SafeWalletTemplate");
    process.exit(1);
  }

  console.log(`开始部署${contractName}合约到Sepolia测试网...`);
  
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
    // 部署合约
    console.log(`\n部署${contractName}合约...`);
    const ContractFactory = await ethers.getContractFactory(contractName);
    
    // 检查合约是否需要构造函数参数
    let contract;
    const constructorArgs = process.argv.slice(3);
    
    if (constructorArgs.length > 0) {
      console.log(`使用构造函数参数:`, constructorArgs);
      contract = await ContractFactory.deploy(...constructorArgs);
    } else {
      contract = await ContractFactory.deploy();
    }
    
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`${contractName}合约已部署到:`, contractAddress);

    // 计算部署花费
    const finalBalance = await deployer.provider.getBalance(deployer.address);
    const ethSpent = ethers.formatEther(initialBalance - finalBalance);
    console.log("\n部署花费:", ethSpent, "ETH");
    
    // 保存部署信息到文件
    const deploymentInfo = {
      network: "sepolia",
      contractName: contractName,
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      deploymentCost: ethSpent,
      constructorArgs: constructorArgs,
      address: contractAddress
    };

    const fs = require("fs");
    const fileName = `deployment-${contractName.toLowerCase()}-sepolia.json`;
    fs.writeFileSync(
      fileName,
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log(`\n部署信息已保存到 ${fileName}`);

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