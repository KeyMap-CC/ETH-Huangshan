const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署SafeWalletToken到Sepolia测试网...");
  
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
    // 设置quzi地址
    const quziAddress = "0xc70025f24be879be9258ac41932bae873bf7ff0a";
    console.log("Quzi地址:", quziAddress);

    // 部署SafeWalletToken合约
    console.log("\n部署SafeWalletToken合约...");
    const SafeWalletToken = await ethers.getContractFactory("SafeWalletToken");
    const safeWalletToken = await SafeWalletToken.deploy(quziAddress);
    await safeWalletToken.waitForDeployment();
    const tokenAddress = await safeWalletToken.getAddress();
    console.log("SafeWalletToken合约已部署到:", tokenAddress);

    // 获取代币信息
    const name = await safeWalletToken.name();
    const symbol = await safeWalletToken.symbol();
    const decimals = await safeWalletToken.decimals();
    const totalSupply = await safeWalletToken.totalSupply();
    const deployerBalance = await safeWalletToken.balanceOf(deployer.address);
    const quziBalance = await safeWalletToken.balanceOf(quziAddress);

    console.log("\n代币信息:");
    console.log("名称:", name);
    console.log("符号:", symbol);
    console.log("小数位:", decimals);
    console.log("总供应量:", ethers.formatUnits(totalSupply, decimals));
    console.log("部署者余额:", ethers.formatUnits(deployerBalance, decimals));
    console.log("Quzi余额:", ethers.formatUnits(quziBalance, decimals));

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
      token: {
        address: tokenAddress,
        name: name,
        symbol: symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        initialDistribution: {
          deployer: ethers.formatUnits(deployerBalance, decimals),
          quzi: ethers.formatUnits(quziBalance, decimals),
          quziAddress: quziAddress
        }
      }
    };

    const fs = require("fs");
    fs.writeFileSync(
      "deployment-token-sepolia.json",
      JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\n部署信息已保存到 deployment-token-sepolia.json");

    console.log("\n" + "=".repeat(60));
    console.log("SafeWalletToken部署完成！");
    console.log("=".repeat(60));
    console.log("代币地址:", tokenAddress);
    console.log("代币符号:", symbol);
    console.log("在Sepolia区块浏览器查看:");
    console.log(`https://sepolia.etherscan.io/token/${tokenAddress}`);
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