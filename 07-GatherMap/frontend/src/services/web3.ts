import { ethers } from "ethers";
import { CONTRACT_CONFIG, CONTRACT_ABI, BADGE_TYPES, type BadgeType } from "../config/contract";

class Web3Service {
	private provider: ethers.BrowserProvider | null = null;
	private signer: ethers.JsonRpcSigner | null = null;
	private contract: ethers.Contract | null = null;

	/**
	 * 检查是否安装了钱包
	 */
	isWalletInstalled(): boolean {
		return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
	}

	/**
	 * 连接钱包
	 */
	async connectWallet(): Promise<string> {
		if (!this.isWalletInstalled()) {
			throw new Error("请安装MetaMask或其他以太坊钱包");
		}

		try {
			// 请求连接钱包
			await window.ethereum!.request({ method: "eth_requestAccounts" });

			// 创建provider和signer
			this.provider = new ethers.BrowserProvider(window.ethereum as never);
			this.signer = await this.provider.getSigner();

			// 检查网络
			await this.checkNetwork();

			// 初始化合约
			this.initContract();

			return await this.signer.getAddress();
		} catch (error) {
			console.error("连接钱包失败:", error);
			throw new Error("连接钱包失败，请重试");
		}
	}

	/**
	 * 检查并切换到Flow EVM Testnet
	 */
	async checkNetwork(): Promise<void> {
		if (!this.provider) {
			throw new Error("请先连接钱包");
		}

		const network = await this.provider.getNetwork();
		const targetChainId = CONTRACT_CONFIG.FLOW_TESTNET.chainId;

		if (Number(network.chainId) !== targetChainId) {
			try {
				// 尝试切换到Flow EVM Testnet
				await window.ethereum!.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: `0x${targetChainId.toString(16)}` }],
				});
			} catch (switchError: unknown) {
				// 如果网络不存在，则添加网络
				const error = switchError as { code?: number };
				if (error.code === 4902) {
					await window.ethereum!.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: `0x${targetChainId.toString(16)}`,
								chainName: CONTRACT_CONFIG.FLOW_TESTNET.chainName,
								rpcUrls: [CONTRACT_CONFIG.FLOW_TESTNET.rpcUrl],
								nativeCurrency: CONTRACT_CONFIG.FLOW_TESTNET.nativeCurrency,
								blockExplorerUrls: [CONTRACT_CONFIG.FLOW_TESTNET.blockExplorer],
							},
						],
					});
				} else {
					throw switchError;
				}
			}
		}
	}

	/**
	 * 初始化合约
	 */
	private initContract(): void {
		if (!this.signer) {
			throw new Error("请先连接钱包");
		}

		if (!CONTRACT_CONFIG.CONTRACT_ADDRESS) {
			throw new Error("合约地址未配置");
		}

		this.contract = new ethers.Contract(CONTRACT_CONFIG.CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
	}

	/**
	 * 获取当前连接的钱包地址
	 */
	async getCurrentAccount(): Promise<string | null> {
		if (!this.signer) {
			return null;
		}
		return await this.signer.getAddress();
	}

	/**
	 * 检查用户是否拥有特定徽章
	 */
	async hasBadge(userAddress: string, badgeType: BadgeType): Promise<boolean> {
		if (!this.contract) {
			throw new Error("合约未初始化");
		}

		return await this.contract.hasBadge(userAddress, badgeType);
	}

	/**
	 * 为用户铸造NFT徽章
	 */
	async mintBadge(recipientAddress: string, badgeType: BadgeType): Promise<string> {
		if (!this.contract) {
			throw new Error("合约未初始化");
		}

		try {
			// 检查用户是否已拥有此徽章
			const hasBadge = await this.hasBadge(recipientAddress, badgeType);
			if (hasBadge) {
				throw new Error("用户已拥有此类型徽章");
			}

			// 生成元数据URI
			const metadata = BADGE_TYPES[badgeType];
			const metadataUri = `data:application/json;base64,${btoa(
				JSON.stringify({
					name: metadata.label,
					description: metadata.description,
					image: `https://api.dicebear.com/7.x/shapes/svg?seed=${badgeType}`,
					attributes: [
						{
							trait_type: "Badge Type",
							value: badgeType,
						},
						{
							trait_type: "Platform",
							value: "GatherMap",
						},
					],
				}),
			)}`;

			// 铸造NFT
			const tx = await this.contract.mintBadge(recipientAddress, badgeType, metadataUri);

			console.log("交易已提交:", tx.hash);

			// 等待交易确认
			const receipt = await tx.wait();
			console.log("交易已确认:", receipt.hash);

			return receipt.hash;
		} catch (error: unknown) {
			console.error("铸造NFT失败:", error);

			const err = error as { code?: string; message?: string };

			// 处理常见错误
			if (err.code === "ACTION_REJECTED") {
				throw new Error("用户取消了交易");
			} else if (err.message?.includes("User already has this badge")) {
				throw new Error("用户已拥有此类型徽章");
			} else if (err.message?.includes("Ownable: caller is not the owner")) {
				throw new Error("只有管理员可以铸造NFT");
			} else {
				throw new Error(`铸造失败: ${err.message || "未知错误"}`);
			}
		}
	}

	/**
	 * 获取合约信息
	 */
	async getContractInfo(): Promise<{
		name: string;
		symbol: string;
		owner: string;
	}> {
		if (!this.contract) {
			throw new Error("合约未初始化");
		}

		const [name, symbol, owner] = await Promise.all([
			this.contract.name(),
			this.contract.symbol(),
			this.contract.owner(),
		]);

		return { name, symbol, owner };
	}

	/**
	 * 检查当前用户是否为合约管理员
	 */
	async isAdmin(): Promise<boolean> {
		if (!this.contract || !this.signer) {
			return false;
		}

		try {
			const userAddress = await this.signer.getAddress();
			const owner = await this.contract.owner();
			return userAddress.toLowerCase() === owner.toLowerCase();
		} catch (error) {
			console.error("检查管理员权限失败:", error);
			return false;
		}
	}

	/**
	 * 获取用户拥有的NFT数量
	 */
	async getUserNFTBalance(userAddress: string): Promise<number> {
		if (!this.contract) {
			throw new Error("合约未初始化");
		}

		try {
			const balance = await this.contract.balanceOf(userAddress);
			return Number(balance);
		} catch (error) {
			console.error("获取NFT余额失败:", error);
			return 0;
		}
	}

	/**
	 * 获取用户拥有的所有NFT类型
	 */
	async getUserBadges(userAddress: string): Promise<BadgeType[]> {
		if (!this.contract) {
			throw new Error("合约未初始化");
		}

		const ownedBadges: BadgeType[] = [];

		// 检查每种徽章类型
		for (const badgeType of Object.keys(BADGE_TYPES) as BadgeType[]) {
			try {
				const hasBadge = await this.contract.hasBadge(userAddress, badgeType);
				if (hasBadge) {
					ownedBadges.push(badgeType);
				}
			} catch (error) {
				console.error(`检查${badgeType}徽章失败:`, error);
			}
		}

		return ownedBadges;
	}

	/**
	 * 获取用户NFT的详细信息（包括元数据）
	 */
	async getUserNFTsWithMetadata(userAddress: string): Promise<Array<{
		badgeType: BadgeType;
		metadata: {
			name: string;
			description: string;
			image: string;
			attributes: Array<{
				trait_type: string;
				value: string;
			}>;
		};
	}>> {
		const ownedBadges = await this.getUserBadges(userAddress);
		
		return ownedBadges.map(badgeType => {
			const badgeInfo = BADGE_TYPES[badgeType];
			return {
				badgeType,
				metadata: {
					name: badgeInfo.label,
					description: badgeInfo.description,
					image: `https://api.dicebear.com/7.x/shapes/svg?seed=${badgeType}`,
					attributes: [
						{
							trait_type: "Badge Type",
							value: badgeType,
						},
						{
							trait_type: "Platform",
							value: "GatherMap",
						},
						{
							trait_type: "Icon",
							value: badgeInfo.icon,
						},
						{
							trait_type: "Color",
							value: badgeInfo.color,
						},
					],
				},
			};
		});
	}

	/**
	 * 断开钱包连接
	 */
	disconnect(): void {
		this.provider = null;
		this.signer = null;
		this.contract = null;
	}
}

// 导出单例实例
export const web3Service = new Web3Service();
export default web3Service; 