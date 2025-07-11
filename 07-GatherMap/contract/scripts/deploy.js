const { ethers } = require("hardhat");

async function main() {
	console.log("开始部署 GatherMapBadges 合约...");

	// 获取部署者账户
	const [deployer] = await ethers.getSigners();
	console.log("部署账户:", deployer.address);

	// 指定合约管理员地址 //部署时用自己的地址
	const adminAddress = "0x6b960418fe6984CBebb2e4D65332C393E75ae6c6";
	console.log("合约管理员地址:", adminAddress);

	// 获取账户余额
	const balance = await deployer.provider.getBalance(deployer.address);
	console.log("账户余额:", ethers.formatEther(balance), "ETH");

	// 部署合约
	const GatherMapBadges = await ethers.getContractFactory("GatherMapBadges");
	
	console.log("正在部署合约...");
	const contract = await GatherMapBadges.deploy(adminAddress);
	
	await contract.waitForDeployment();
	const contractAddress = await contract.getAddress();
	
	console.log("✅ GatherMapBadges 合约部署成功!");
	console.log("合约地址:", contractAddress);
	console.log("部署者地址:", deployer.address);
	console.log("合约管理员:", adminAddress);
	
	// 验证部署
	console.log("\n验证部署...");
	const name = await contract.name();
	const symbol = await contract.symbol();
	const owner = await contract.owner();
	
	console.log("合约名称:", name);
	console.log("合约符号:", symbol);
	console.log("合约所有者:", owner);
	
	// 验证管理员设置是否正确
	if (owner.toLowerCase() === adminAddress.toLowerCase()) {
		console.log("✅ 管理员地址设置正确");
	} else {
		console.log("❌ 管理员地址设置错误");
	}
	
	// 检查预设的徽章类型
	console.log("\n检查预设徽章类型...");
	const badgeTypes = ["explorer", "reviewer", "early_bird", "community_star", "place_hunter"];
	
	for (const badgeType of badgeTypes) {
		const exists = await contract.badgeTypes(badgeType);
		const metadata = await contract.badgeMetadata(badgeType);
		console.log(`${badgeType}: ${exists ? '✅' : '❌'} - ${metadata}`);
	}
	
	console.log("\n🎉 部署完成!");
	console.log("\n部署信息总结:");
	console.log("合约地址:", contractAddress);
	console.log("管理员地址:", adminAddress);
	console.log("网络: Flow EVM Testnet");
	console.log("区块链浏览器: https://evm-testnet.flowscan.org/address/" + contractAddress);
	
	console.log("\n下一步:");
	console.log("1. 保存合约地址用于前端集成");
	console.log("2. 在 Flow EVM Testnet 上验证合约");
	console.log("3. 测试NFT铸造功能");
	
	// 返回合约地址供其他脚本使用
	return contractAddress;
}

// 如果直接运行此脚本
if (require.main === module) {
	main()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error("部署失败:", error);
			process.exit(1);
		});
}

module.exports = main; 