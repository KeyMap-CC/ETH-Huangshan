import { useState, useEffect } from "react";
import { authApi, type User } from "../services/api";
import { web3Service } from "../services/web3";
import { CONTRACT_CONFIG, BADGE_TYPES, type BadgeType } from "../config/contract";

interface ProfileProps {
	user: User | null;
	setUser: (user: User | null) => void;
}

interface NFTMetadata {
	name: string;
	description: string;
	image: string;
	attributes: Array<{
		trait_type: string;
		value: string;
	}>;
}

interface UserNFT {
	tokenId: string;
	badgeType: BadgeType;
	metadata: NFTMetadata;
	transactionHash?: string;
}

export default function Profile({ user, setUser }: ProfileProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [username, setUsername] = useState(user?.username || "");
	const [loading, setLoading] = useState(false);
	const [walletAddress, setWalletAddress] = useState<string>("");
	const [nfts, setNfts] = useState<UserNFT[]>([]);
	const [nftLoading, setNftLoading] = useState(false);
	const [copiedAddress, setCopiedAddress] = useState(false);

	useEffect(() => {
		if (user) {
			setUsername(user.username);
			setWalletAddress(user.walletAddress);
			loadUserNFTs();
		}
	}, [user]);

	// 加载用户NFT
	const loadUserNFTs = async () => {
		if (!user?.walletAddress) return;

		setNftLoading(true);
		try {
			// 尝试初始化web3服务（如果没有连接）
			try {
				await web3Service.connectWallet();
			} catch {
				console.log("钱包未连接，使用只读模式");
			}

			// 使用新的web3方法获取用户NFT
			const nftData = await web3Service.getUserNFTsWithMetadata(user.walletAddress);
			
			const userNFTs: UserNFT[] = nftData.map((nft, index) => ({
				tokenId: `${nft.badgeType}_${user.walletAddress}_${index}`,
				badgeType: nft.badgeType,
				metadata: nft.metadata,
			}));

			setNfts(userNFTs);
		} catch (error) {
			console.error("加载NFT失败:", error);
			// 如果web3调用失败，回退到本地检查
			try {
				const userNFTs: UserNFT[] = [];
				for (const [badgeType, badgeInfo] of Object.entries(BADGE_TYPES)) {
					try {
						const hasBadge = await web3Service.hasBadge(user.walletAddress, badgeType as BadgeType);
						if (hasBadge) {
							userNFTs.push({
								tokenId: `${badgeType}_${user.walletAddress}`,
								badgeType: badgeType as BadgeType,
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
									],
								},
							});
						}
					} catch (error) {
						console.error(`检查${badgeType}徽章失败:`, error);
					}
				}
				setNfts(userNFTs);
			} catch (fallbackError) {
				console.error("回退方法也失败了:", fallbackError);
			}
		} finally {
			setNftLoading(false);
		}
	};

	// 保存用户名
	const handleSaveUsername = async () => {
		if (!username.trim()) {
			alert("用户名不能为空");
			return;
		}

		setLoading(true);
		try {
			const response = await authApi.updateMe({ username });
			setUser(response.data);
			setIsEditing(false);
			alert("用户名更新成功！");
		} catch (error) {
			console.error("更新用户名失败:", error);
			alert("更新用户名失败，请重试");
		} finally {
			setLoading(false);
		}
	};

	// 复制钱包地址
	const handleCopyAddress = async () => {
		try {
			await navigator.clipboard.writeText(walletAddress);
			setCopiedAddress(true);
			setTimeout(() => setCopiedAddress(false), 2000);
		} catch (error) {
			console.error("复制失败:", error);
			// 降级处理
			const textArea = document.createElement("textarea");
			textArea.value = walletAddress;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			setCopiedAddress(true);
			setTimeout(() => setCopiedAddress(false), 2000);
		}
	};

	// 查看NFT详情
	const viewNFTOnExplorer = () => {
		const explorerUrl = `${CONTRACT_CONFIG.FLOW_TESTNET.blockExplorer}/token/${CONTRACT_CONFIG.CONTRACT_ADDRESS}`;
		window.open(explorerUrl, "_blank");
	};

	if (!user) {
		return (
			<div className="layout-container flex items-center justify-center">
				<div className="card-glass text-center">
					<div className="text-lg text-gray-700">请先登录</div>
				</div>
			</div>
		);
	}

	return (
		<div className="layout-container">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* 页面标题 */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
						个人中心
					</h1>
					<p className="text-gray-600">管理您的个人信息和数字资产</p>
				</div>

				{/* 基本信息卡片 */}
				<div className="card-glass">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-800">基本信息</h2>
						{!isEditing && (
							<button 
								onClick={() => setIsEditing(true)}
								className="btn btn-primary btn-sm"
							>
								编辑
							</button>
						)}
					</div>

					<div className="space-y-4">
						{/* 头像 */}
						<div className="flex items-center space-x-4">
							<img 
								src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.walletAddress}`}
								alt="头像"
								className="w-16 h-16 rounded-full bg-gray-100"
							/>
							<div>
								<h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
								<p className="text-sm text-gray-500">注册时间: {new Date(user.createdAt).toLocaleDateString()}</p>
							</div>
						</div>

						{/* 用户名编辑 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
							{isEditing ? (
								<div className="flex items-center space-x-2">
									<input
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										className="input-field flex-1"
										placeholder="请输入用户名"
									/>
									<button 
										onClick={handleSaveUsername}
										disabled={loading}
										className="btn btn-primary btn-sm"
									>
										{loading ? "保存中..." : "保存"}
									</button>
									<button 
										onClick={() => {
											setIsEditing(false);
											setUsername(user.username);
										}}
										className="btn btn-ghost btn-sm"
									>
										取消
									</button>
								</div>
							) : (
								<div className="text-gray-900">{user.username}</div>
							)}
						</div>

						{/* 用户统计 */}
						<div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
							<div className="text-center">
								<div className="text-2xl font-bold text-purple-600">{user.stats?.placesVisited}</div>
								<div className="text-sm text-gray-500">访问地点</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">{user.stats?.commentsCount}</div>
								<div className="text-sm text-gray-500">评论数量</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">{nfts.length}</div>
								<div className="text-sm text-gray-500">NFT徽章</div>
							</div>
						</div>
					</div>
				</div>

				{/* 钱包信息卡片 */}
				<div className="card-glass">
					<h2 className="text-xl font-semibold text-gray-800 mb-6">钱包信息</h2>
					
					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">钱包地址</label>
							<div className="flex items-center space-x-2">
								<div className="input-field flex-1 font-mono text-sm bg-gray-50">
									{walletAddress}
								</div>
								<button
									onClick={handleCopyAddress}
									className={`btn btn-sm transition-colors ${
										copiedAddress 
											? "btn-success" 
											: "btn-outline hover:bg-blue-50 hover:border-blue-300"
									}`}
								>
									{copiedAddress ? "已复制!" : "复制"}
								</button>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">钱包类型</label>
							<div className="text-gray-900">{user.walletType || "MetaMask"}</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">网络</label>
							<div className="text-gray-900">Flow EVM Testnet</div>
						</div>
					</div>
				</div>

				{/* NFT徽章卡片 */}
				<div className="card-glass">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-800">我的NFT徽章</h2>
						<button
							onClick={loadUserNFTs}
							disabled={nftLoading}
							className="btn btn-outline btn-sm"
						>
							{nftLoading ? "加载中..." : "刷新"}
						</button>
					</div>

					{nftLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="loading-spinner"></div>
							<span className="ml-2 text-gray-600">加载NFT中...</span>
						</div>
					) : nfts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{nfts.map((nft) => (
								<div 
									key={nft.tokenId}
									className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
									onClick={() => viewNFTOnExplorer()}
								>
									<div className="flex items-center space-x-3 mb-3">
										<div className="text-2xl">{BADGE_TYPES[nft.badgeType].icon}</div>
										<div>
											<h3 className="font-medium text-gray-900">{nft.metadata.name}</h3>
											<p className="text-sm text-gray-500">{nft.metadata.description}</p>
										</div>
									</div>
									
									<div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
										<div>类型: {nft.badgeType}</div>
										<div>平台: GatherMap</div>
									</div>
									
									<div className="mt-3 text-center">
										<button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
											在区块链浏览器查看 →
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<div className="text-6xl mb-4">🎁</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">暂无NFT徽章</h3>
							<p className="text-gray-500 mb-4">
								通过参与活动、访问地点、发表评论等方式获得专属NFT徽章
							</p>
							<a 
								href={`${CONTRACT_CONFIG.FLOW_TESTNET.blockExplorer}/token/${CONTRACT_CONFIG.CONTRACT_ADDRESS}`}
								target="_blank"
								rel="noopener noreferrer"
								className="btn btn-outline btn-sm"
							>
								查看合约详情
							</a>
						</div>
					)}
				</div>
			</div>
		</div>
	);
} 