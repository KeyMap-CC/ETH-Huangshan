const { run } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("开始验证SafeWalletToken合约...");
  
  try {
    // 读取部署信息
    if (!fs.existsSync("deployment-token-sepolia.json")) {
      console.error("错误: 找不到部署信息文件 'deployment-token-sepolia.json'");
      console.error("请先运行 'npm run deploy:token' 部署合约");
      process.exit(1);
    }
    
    const deploymentInfo = JSON.parse(fs.readFileSync("deployment-token-sepolia.json", "utf8"));
    const tokenAddress = deploymentInfo.token.address;
    const quziAddress = deploymentInfo.token.initialDistribution.quziAddress;
    
    console.log("代币地址:", tokenAddress);
    console.log("Quzi地址:", quziAddress);
    
    // 验证合约
    console.log("\n正在验证合约...");
    await run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [quziAddress],
      contract: "contracts/SafeWalletToken.sol:SafeWalletToken"
    });
    
    console.log("\n✅ 合约验证成功!");
    console.log("在Sepolia区块浏览器查看:");
    console.log(`https://sepolia.etherscan.io/token/${tokenAddress}`);
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("\n✅ 合约已经验证过了!");
    } else {
      console.error("验证过程中发生错误:", error);
      process.exit(1);
    }
  }
}

// 错误处理
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 