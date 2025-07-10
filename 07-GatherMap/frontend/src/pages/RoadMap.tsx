import React from 'react';

const RoadMap: React.FC = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto">
				{/* 页面头部 */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold gradient-text mb-4">产品路线图</h1>
					<p className="text-xl text-gray-600">GatherMap 的未来发展规划</p>
				</div>

				{/* 路线图内容 */}
				<div className="space-y-8">
					{/* 当前版本 */}
					<div className="card-glass">
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0">
								<div className="w-12 h-12 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
									✅
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">当前版本 - 基础功能完善</h3>
								<p className="text-gray-600 mb-4">
									已完成数字游民聚集地和活动场地的地图展示、用户登录、管理后台等核心功能
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="tag tag-mint">地图探索</span>
									<span className="tag tag-mint">场地详情</span>
									<span className="tag tag-mint">用户管理</span>
									<span className="tag tag-mint">管理后台</span>
								</div>
							</div>
						</div>
					</div>

					{/* 下一阶段 */}
					<div className="card-glass">
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0">
								<div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
									🚀
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">下一阶段 - AI 智能化升级</h3>
								<p className="text-gray-600 mb-4">
									将结合AI优化数据录入功能，以及打造全球数字游民网络地图，推出Agent客服帮用户快速找到场地或者理想居住地
								</p>
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full"></div>
										<span className="text-gray-700">🤖 AI Agent 客服系统 - 智能推荐场地和居住地</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full"></div>
										<span className="text-gray-700">🧠 AI 数据录入助手 - 自动化场地信息采集</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full"></div>
										<span className="text-gray-700">🌍 全球数字游民网络地图 - 连接全球社区</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-primary-500 rounded-full"></div>
										<span className="text-gray-700">🎯 个性化推荐引擎 - 基于用户偏好匹配</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* 未来规划 */}
					<div className="card-glass">
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0">
								<div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
									🔮
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">未来规划 - 生态完善</h3>
								<p className="text-gray-600 mb-4">
									构建完整的数字游民生态系统，包括社交、商务、生活服务等全方位支持
								</p>
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-amber-500 rounded-full"></div>
										<span className="text-gray-700">👥 社区功能 - 数字游民社交网络</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-amber-500 rounded-full"></div>
										<span className="text-gray-700">💼 商务服务 - 远程工作机会匹配</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-amber-500 rounded-full"></div>
										<span className="text-gray-700">🏠 住宿预订 - 整合住宿服务</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-amber-500 rounded-full"></div>
										<span className="text-gray-700">🎊 活动组织 - 本地活动和聚会</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Web3 集成 */}
					<div className="card-glass">
						<div className="flex items-start space-x-4">
							<div className="flex-shrink-0">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
									🔗
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-gray-900 mb-2">Web3 集成 - 区块链增强</h3>
								<p className="text-gray-600 mb-4">
									引入区块链技术，为用户提供NFT徽章、加密支付、去中心化身份等Web3功能
								</p>
								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
										<span className="text-gray-700">🏆 NFT 成就徽章 - 记录数字游民足迹</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
										<span className="text-gray-700">💳 加密货币支付 - 无边界支付体验</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
										<span className="text-gray-700">🆔 去中心化身份 - DID 身份验证</span>
									</div>
									<div className="flex items-center space-x-3">
										<div className="w-2 h-2 bg-purple-500 rounded-full"></div>
										<span className="text-gray-700">🔐 数据所有权 - 用户数据主权</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 联系我们 */}
				<div className="text-center mt-12">
					<div className="card-glass">
						<h3 className="text-xl font-semibold text-gray-900 mb-4">参与我们的发展</h3>
						<p className="text-gray-600 mb-6">
							我们欢迎社区的反馈和建议，一起打造更好的数字游民平台
						</p>
						<div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
							<a
								href="mailto:feedback@gathermap.com"
								className="btn-primary"
							>
								📧 发送反馈
							</a>
							<a
								href="https://github.com/gathermap"
								target="_blank"
								rel="noopener noreferrer"
								className="btn-secondary"
							>
								⭐ GitHub 关注
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoadMap; 