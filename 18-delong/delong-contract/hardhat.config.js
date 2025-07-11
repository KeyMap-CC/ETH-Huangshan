require("@nomicfoundation/hardhat-toolbox");

// 尝试加载环境变量，如果文件不存在则忽略
try {
  require("dotenv").config();
} catch (error) {
  console.log("未找到.env文件，将使用默认配置");
}

// 注意：Sepolia网络的gas价格配置
// 我们将使用较低的固定gasPrice，但让系统自动估算gas limit

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      hardfork: "prague",
      allowUnlimitedContractSize: true
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "https://sepolia.infura.io/v3/fec12bb23d6146ac98ad9a33df8bde95",
      accounts: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length >= 64 ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      // 删除固定gas设置，让网络自动估算
      gasPrice: "auto", // 降低为1.5 Gwei
      solidity: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000
          }
        }
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};