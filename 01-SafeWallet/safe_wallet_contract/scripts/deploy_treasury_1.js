const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("开始部署SafeWallet金库和DAO合约到Sepolia测试网...");
  
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
    // 1. 获取已部署的SWT代币地址
    let swtAddress;
    try {

      swtAddress = "0xe7645Ab744A71D5b187d931c873b12F3CBf1b65a";
      
      console.log("已找到部署的SWT代币地址:", swtAddress);
    } catch (error) {
      console.log("未找到SWT代币部署信息，请先运行 npm run deploy:token");
      process.exit(1);
    }

    // 2. 设置USDT地址（Sepolia测试网上的USDT地址）
    // 注意：这是示例地址，实际部署时需要替换为真实的Sepolia测试网USDT地址
    const usdtAddress = "0x24B5fD18E3268cDed8235FF1670a68e977512379"; // 替换为实际的Sepolia USDT地址
    console.log("使用USDT地址:", usdtAddress);


    // 5. 部署金库合约
    console.log("\n部署SafeWalletTreasury合约...");
    const SafeWalletTreasury = await ethers.getContractFactory("SafeWalletTreasury");
    const treasury = await SafeWalletTreasury.deploy(usdtAddress, swtAddress, "0xC70025f24bE879be9258Ac41932bAE873bF7FF0a");
    await treasury.waitForDeployment();
    const treasuryAddress = await treasury.getAddress();
    console.log("SafeWalletTreasury合约已部署到:", treasuryAddress);


    // 8. 向金库转移SWT代币
    console.log("\n向金库转移SWT代币...");
    const swtToken = await ethers.getContractAt("SafeWalletToken", swtAddress);
    const transferAmount = ethers.parseUnits("10000", 18); // 转移10,000 SWT到金库
    const transferTx = await  swtToken.connect(deployer).transfer(treasuryAddress, transferAmount );
    await transferTx.wait();
    console.log(`已向金库转移 ${ethers.formatUnits(transferAmount, 18)} SWT`);

    // 计算部署花费
    const finalBalance = await deployer.provider.getBalance(deployer.address);
    const ethSpent = ethers.formatEther(initialBalance - finalBalance);
    console.log("\n部署花费:", ethSpent, "ETH");
    
    // 保存部署信息到文件
    const deploymentInfo = {
      network: "sepolia",
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      deploymentCost: ethSpent,
      contracts: {
        token: {
          swt: swtAddress,
          usdt: usdtAddress
        },
        treasury: treasuryAddress
      }
    };

    const fs = require("fs");
    fs.writeFileSync(
      "deployment-treasury-dao-sepolia.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n部署信息已保存到 deployment-treasury-dao-sepolia.json");

    console.log("\n" + "=".repeat(60));
    console.log("SafeWallet金库和DAO部署完成！");
    console.log("=".repeat(60));
    console.log("SWT代币地址:", swtAddress);
    console.log("USDT代币地址:", usdtAddress);
    console.log("金库地址:", treasuryAddress);
    console.log("=".repeat(60));

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