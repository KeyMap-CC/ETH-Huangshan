require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		version: "0.8.20",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		"flow-testnet": {
			url: "https://testnet.evm.nodes.onflow.org",
			chainId: 545,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			gasPrice: 1000000000, // 1 gwei
		},
		"flow-mainnet": {
			url: "https://mainnet.evm.nodes.onflow.org",
			chainId: 747,
			accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
			gasPrice: 1000000000, // 1 gwei
		},
	},
	etherscan: {
		apiKey: {
			"flow-testnet": "abc", // Flow EVM doesn't require API key
			"flow-mainnet": "abc",
		},
		customChains: [
			{
				network: "flow-testnet",
				chainId: 545,
				urls: {
					apiURL: "https://evm-testnet.flowscan.org/api",
					browserURL: "https://evm-testnet.flowscan.org",
				},
			},
			{
				network: "flow-mainnet",
				chainId: 747,
				urls: {
					apiURL: "https://evm.flowscan.org/api",
					browserURL: "https://evm.flowscan.org",
				},
			},
		],
	},
	gasReporter: {
		enabled: process.env.REPORT_GAS !== undefined,
		currency: "USD",
	},
}; 