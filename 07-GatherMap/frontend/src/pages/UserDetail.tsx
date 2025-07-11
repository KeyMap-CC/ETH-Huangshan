import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User } from '../services/api';
import { adminApi } from '../services/api';
import { web3Service } from '../services/web3';
import { BADGE_TYPES, type BadgeType } from '../config/contract';

const UserDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [nftLoading, setNftLoading] = useState(false);
	const [selectedNft, setSelectedNft] = useState('');
	const [walletConnected, setWalletConnected] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			loadUser();
		}
		checkWalletConnection();
	}, [id]);

	const loadUser = async () => {
		try {
			setLoading(true);
			if (!id) {
				throw new Error('用户ID不存在');
			}
			const response = await adminApi.getUserById(id);
			setUser(response.data);
		} catch (error) {
			console.error('加载用户失败:', error);
			alert('加载用户失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	const checkWalletConnection = async () => {
		if (web3Service.isWalletInstalled()) {
			try {
				const account = await web3Service.getCurrentAccount();
				if (account) {
					setWalletConnected(true);
					setWalletAddress(account);
					const adminStatus = await web3Service.isAdmin();
					setIsAdmin(adminStatus);
				}
			} catch (error) {
				console.error('检查钱包连接失败:', error);
			}
		}
	};

	const connectWallet = async () => {
		try {
			const account = await web3Service.connectWallet();
			setWalletConnected(true);
			setWalletAddress(account);
			const adminStatus = await web3Service.isAdmin();
			setIsAdmin(adminStatus);
			alert('钱包连接成功！');
		} catch (error) {
			console.error('连接钱包失败:', error);
			alert(`连接钱包失败: ${error instanceof Error ? error.message : '未知错误'}`);
		}
	};

	const handleSendNft = async () => {
		if (!selectedNft || !user) {
			alert('请选择要发送的NFT');
			return;
		}

		if (!walletConnected) {
			alert('请先连接钱包');
			return;
		}

		if (!isAdmin) {
			alert('只有合约管理员可以铸造NFT');
			return;
		}

		try {
			setNftLoading(true);
			
			// 调用智能合约铸造NFT
			const txHash = await web3Service.mintBadge(user.walletAddress, selectedNft as BadgeType);
			
			alert(`NFT铸造成功！\n交易哈希: ${txHash}\n用户 ${user.username} 已获得 "${BADGE_TYPES[selectedNft as BadgeType].label}" 徽章!`);
			setSelectedNft('');
		} catch (error) {
			console.error('发送NFT失败:', error);
			alert(`发送NFT失败: ${error instanceof Error ? error.message : '未知错误'}`);
		} finally {
			setNftLoading(false);
		}
	};

	const nftOptions = Object.entries(BADGE_TYPES).map(([value, config]) => ({
		value,
		label: config.label,
		description: config.description,
		icon: config.icon,
	}));

	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="loading-spinner mx-auto mb-4"></div>
				<div className="text-lg text-gray-700">加载中...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="text-center py-12">
				<div className="text-lg text-gray-700">用户不存在</div>
				<button onClick={() => navigate('/manage/user')} className="btn-primary mt-4">
					返回用户列表
				</button>
			</div>
		);
	}

	return (
		<div className="animate-fade-in">
			{/* 页面头部 */}
			<div className="flex items-center justify-between mb-6">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">用户详情</h1>
					<p className="text-gray-600 mt-1">查看和管理用户信息</p>
				</div>
				<button
					onClick={() => navigate('/manage/user')}
					className="btn-secondary"
				>
					← 返回列表
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 用户基本信息 */}
				<div className="lg:col-span-2">
					<div className="card-glass mb-6">
						<div className="flex items-start space-x-6">
							<div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-mint-400 rounded-full flex items-center justify-center text-white text-2xl font-medium">
								{user.username?.charAt(0)?.toUpperCase() || 'U'}
							</div>
							<div className="flex-1">
								<div className="flex items-center space-x-3 mb-2">
									<h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
									<span className={`tag ${
										user.role === 'admin' ? 'tag-mint' : 'tag-primary'
									}`}>
										{user.role === 'admin' ? '管理员' : '普通用户'}
									</span>
								</div>
								<div className="space-y-2 text-sm text-gray-600">
									<div className="flex items-center space-x-2">
										<span className="font-medium">钱包地址:</span>
										<span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
											{user.walletAddress}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="font-medium">钱包类型:</span>
										<span>{user.walletType}</span>
									</div>
									{user.email && (
										<div className="flex items-center space-x-2">
											<span className="font-medium">邮箱:</span>
											<span>{user.email}</span>
										</div>
									)}
									<div className="flex items-center space-x-2">
										<span className="font-medium">注册时间:</span>
										<span>{new Date(user.createdAt).toLocaleDateString()}</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="font-medium">最后活跃:</span>
										<span>{new Date(user.stats.lastActive).toLocaleDateString()}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 用户统计 */}
					<div className="card-glass">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">用户统计</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
										🏢
									</div>
									<div>
										<div className="text-2xl font-bold text-primary-700">{user.stats.placesVisited}</div>
										<div className="text-sm text-primary-600">访问场地</div>
									</div>
								</div>
							</div>
							<div className="bg-gradient-to-r from-mint-50 to-mint-100 p-4 rounded-lg">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-mint-500 rounded-lg flex items-center justify-center text-white">
										💬
									</div>
									<div>
										<div className="text-2xl font-bold text-mint-700">{user.stats.commentsCount}</div>
										<div className="text-sm text-mint-600">发表评论</div>
									</div>
								</div>
							</div>
							<div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
										❤️
									</div>
									<div>
										<div className="text-2xl font-bold text-amber-700">{user.favorites.length}</div>
										<div className="text-sm text-amber-600">收藏场地</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* NFT发送面板 */}
				<div className="lg:col-span-1">
					{/* 钱包连接状态 */}
					<div className="card-glass mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">钱包状态</h3>
						{walletConnected ? (
							<div className="space-y-2">
								<div className="flex items-center space-x-2 text-green-600">
									<span>✅</span>
									<span className="text-sm">钱包已连接</span>
								</div>
								<div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded">
									{walletAddress}
								</div>
								{isAdmin ? (
									<div className="flex items-center space-x-2 text-blue-600">
										<span>👑</span>
										<span className="text-sm">管理员权限</span>
									</div>
								) : (
									<div className="flex items-center space-x-2 text-gray-500">
										<span>⚠️</span>
										<span className="text-sm">无管理员权限</span>
									</div>
								)}
							</div>
						) : (
							<div className="space-y-3">
								<div className="flex items-center space-x-2 text-gray-500">
									<span>❌</span>
									<span className="text-sm">钱包未连接</span>
								</div>
								<button onClick={connectWallet} className="btn-primary w-full">
									连接钱包
								</button>
							</div>
						)}
					</div>

					{/* NFT铸造面板 */}
					<div className="card-glass">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">发送NFT徽章</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									选择NFT类型
								</label>
								<select
									value={selectedNft}
									onChange={(e) => setSelectedNft(e.target.value)}
									className="input w-full"
									disabled={!walletConnected || !isAdmin}
								>
									<option value="">请选择NFT...</option>
									{nftOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.icon} {option.label}
										</option>
									))}
								</select>
							</div>

							{selectedNft && (
								<div className="bg-gray-50 p-3 rounded-lg">
									<div className="text-sm font-medium text-gray-900 mb-1">
										{nftOptions.find(opt => opt.value === selectedNft)?.icon} {" "}
										{nftOptions.find(opt => opt.value === selectedNft)?.label}
									</div>
									<div className="text-xs text-gray-600">
										{nftOptions.find(opt => opt.value === selectedNft)?.description}
									</div>
								</div>
							)}

							<button
								onClick={handleSendNft}
								disabled={!selectedNft || nftLoading || !walletConnected || !isAdmin}
								className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{nftLoading ? (
									<>
										<div className="loading-spinner w-4 h-4 mr-2"></div>
										铸造中...
									</>
								) : (
									'🎁 铸造NFT'
								)}
							</button>

							<div className="text-xs text-gray-500 mt-2">
								<p>💡 NFT将通过智能合约铸造并转移到用户钱包地址</p>
								{!walletConnected && <p>⚠️ 需要先连接钱包</p>}
								{walletConnected && !isAdmin && <p>⚠️ 需要管理员权限</p>}
							</div>
						</div>
					</div>

					{/* 操作面板 */}
					<div className="card-glass mt-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">管理操作</h3>
						<div className="space-y-3">
							<button
								onClick={() => navigate(`/manage/user/detail/${user._id}`)}
								className="btn-mint w-full"
							>
								✏️ 编辑用户
							</button>
							{user.role !== 'admin' && (
								<button
									onClick={async () => {
										if (confirm('确定要删除此用户吗？')) {
											try {
												await adminApi.deleteUser(user._id);
												alert('删除成功');
												navigate('/manage/user');
											} catch (error) {
												console.error('删除用户失败:', error);
												alert('删除失败，请重试');
											}
										}
									}}
									className="btn-rose w-full"
								>
									🗑️ 删除用户
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDetail; 