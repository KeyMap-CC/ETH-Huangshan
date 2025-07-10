import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Place, User } from '../services/api';
import { placesApi } from '../services/api';

interface PlaceDetailProps {
	user: User | null;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ user }) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [place, setPlace] = useState<Place | null>(null);
	const [loading, setLoading] = useState(true);
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [commentContent, setCommentContent] = useState('');
	const [commentRating, setCommentRating] = useState(0);
	const [submitting, setSubmitting] = useState(false);
	const [userRating, setUserRating] = useState(0);

	useEffect(() => {
		if (id) {
			loadPlaceDetail();
		}
	}, [id]);

	const loadPlaceDetail = async () => {
		try {
			setLoading(true);
			const response = await placesApi.getPlaceById(id!);
			setPlace(response.data);
		} catch (error) {
			console.error('加载详情失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleBackToMap = () => {
		// 恢复地图位置和层级
		const savedPosition = localStorage.getItem('mapPosition');
		// const savedZoom = localStorage.getItem('mapZoom');
		if (savedPosition) {
			// 这里可以传递给地图组件
		}
		navigate('/');
	};

	const handleRatingSubmit = async (rating: number) => {
		if (!user) {
			alert('请先登录');
			return;
		}

		try {
			setSubmitting(true);
			await placesApi.addRating(id!, rating);
			setUserRating(rating);
			// 重新加载详情以更新评分
			await loadPlaceDetail();
			alert('评分提交成功！');
		} catch (error) {
			console.error('评分提交失败:', error);
			alert('评分提交失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const handleCommentSubmit = async () => {
		if (!user) {
			alert('请先登录');
			return;
		}

		if (!commentContent.trim()) {
			alert('请输入评论内容');
			return;
		}

		try {
			setSubmitting(true);
			await placesApi.addComment(id!, {
				content: commentContent.trim(),
				rating: commentRating > 0 ? commentRating : undefined
			});
			
			// 重置表单
			setCommentContent('');
			setCommentRating(0);
			setShowCommentForm(false);
			
			// 重新加载详情以更新评论
			await loadPlaceDetail();
			alert('评论发布成功！');
		} catch (error) {
			console.error('评论发布失败:', error);
			alert('评论发布失败，请重试');
		} finally {
			setSubmitting(false);
		}
	};

	const formatTime = (time: string) => {
		const date = new Date(time);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor(diff / (1000 * 60));

		if (days > 0) return `${days}天前`;
		if (hours > 0) return `${hours}小时前`;
		if (minutes > 0) return `${minutes}分钟前`;
		return '刚刚';
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">加载中...</div>
			</div>
		);
	}

	if (!place) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">聚集地不存在</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 顶部导航 */}
			<header className="bg-white shadow-sm border-b px-4 py-3">
				<div className="flex items-center justify-between">
					<button
						onClick={handleBackToMap}
						className="btn-secondary text-xs sm:text-sm"
					>
						← 返回地图
					</button>
					<h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-none">{place.name}</h1>
					<div className="w-16 sm:w-20"></div>
				</div>
			</header>

			<div className="max-w-4xl mx-auto p-4 sm:p-6">
				{/* 基本信息 */}
				<div className="card mb-6">
					<div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
						{place.cover && (
							<img
								src={place.cover}
								alt={place.name}
								className="w-full sm:w-48 h-32 object-cover rounded-lg"
							/>
						)}
						<div className="flex-1">
							<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{place.name}</h2>
							<p className="text-sm sm:text-base text-gray-600 mb-2">{place.location}</p>
							{place.solgan && (
								<p className="text-sm sm:text-base text-primary-600 font-medium mb-2">{place.solgan}</p>
							)}
							<div className="flex flex-wrap items-center gap-2 sm:gap-4">
								<span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs sm:text-sm">
									{place.type === 'gathering' ? '聚集地' : '活动场地'}
								</span>
								<span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm">
									{place.status}
								</span>
								<span className="text-gray-500 text-xs sm:text-sm">
									👁️ {place.stats.views} 浏览
								</span>
								<span className="text-gray-500 text-xs sm:text-sm">
									💬 {place.stats.comments} 评论
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* 左侧详细信息 */}
					<div className="lg:col-span-2 space-y-6">
						{/* 费用信息 */}
						{place.cost && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">💰 费用信息</h3>
								<p className="text-gray-700">{place.cost}</p>
							</div>
						)}

						{/* 容量信息 */}
						{place.capacity && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">🏠 容量信息</h3>
								<div className="grid grid-cols-2 gap-4">
									{place.capacity.rooms && (
										<div>
											<span className="text-gray-600">剩余房间：</span>
											<span className="font-medium">{place.capacity.rooms} 间</span>
										</div>
									)}
									{place.capacity.maxPeople && (
										<div>
											<span className="text-gray-600">可容纳：</span>
											<span className="font-medium">{place.capacity.maxPeople} 人</span>
										</div>
									)}
									{place.capacity.currentPeople && (
										<div>
											<span className="text-gray-600">当前人数：</span>
											<span className="font-medium">{place.capacity.currentPeople} 人</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* 详细信息 */}
						{place.investor && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">🏢 投资方和运营方</h3>
								<p className="text-gray-700 whitespace-pre-line">{place.investor}</p>
							</div>
						)}

						{place.tour && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">🌴 旅游和休闲</h3>
								<p className="text-gray-700">{place.tour}</p>
							</div>
						)}

						{place.convenience && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">🏪 生活便利性</h3>
								<p className="text-gray-700">{place.convenience}</p>
							</div>
						)}

						{place.scale && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">👥 社群规模</h3>
								<p className="text-gray-700">{place.scale}</p>
							</div>
						)}

						{place.atmosphere && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">🌟 氛围</h3>
								<p className="text-gray-700 whitespace-pre-line">{place.atmosphere}</p>
							</div>
						)}

						{place.workEnv && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">💼 工作环境</h3>
								<p className="text-gray-700">{place.workEnv}</p>
							</div>
						)}

						{/* 评论区域 */}
						<div className="card">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-semibold text-gray-900">
									💬 评论 ({place.comments?.length || 0})
								</h3>
								{user && (
									<button
										onClick={() => setShowCommentForm(!showCommentForm)}
										className="btn-primary text-sm"
									>
										{showCommentForm ? '取消' : '写评论'}
									</button>
								)}
							</div>

							{/* 评论表单 */}
							{showCommentForm && user && (
								<div className="border border-gray-200 rounded-lg p-4 mb-4">
									<div className="mb-3">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											评分（可选）：
										</label>
										<div className="flex items-center space-x-1">
											{Array.from({ length: 5 }).map((_, i) => (
												<button
													key={i}
													onClick={() => setCommentRating(i + 1)}
													className={`text-xl transition-colors ${
														i < commentRating ? 'text-yellow-400' : 'text-gray-300'
													} hover:text-yellow-300`}
												>
													★
												</button>
											))}
										</div>
										{commentRating > 0 && (
											<p className="text-sm text-gray-500 mt-1">
												您选择了 {commentRating} 星
											</p>
										)}
									</div>
									<div className="mb-3">
										<label className="block text-sm font-medium text-gray-700 mb-1">
											评论内容：
										</label>
										<textarea
											value={commentContent}
											onChange={(e) => setCommentContent(e.target.value)}
											placeholder="分享您的体验和感受..."
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
											rows={3}
											maxLength={500}
										/>
										<div className="text-right text-sm text-gray-500 mt-1">
											{commentContent.length}/500
										</div>
									</div>
									<div className="flex justify-end space-x-2">
										<button
											onClick={() => {
												setShowCommentForm(false);
												setCommentContent('');
												setCommentRating(0);
											}}
											className="btn-secondary text-sm"
										>
											取消
										</button>
										<button
											onClick={handleCommentSubmit}
											disabled={submitting || !commentContent.trim()}
											className="btn-primary text-sm disabled:opacity-50"
										>
											{submitting ? '发布中...' : '发布评论'}
										</button>
									</div>
								</div>
							)}

							{/* 评论列表 */}
							{place.comments && place.comments.length > 0 ? (
								<div className="space-y-4">
									{place.comments.map((comment, index) => (
										<div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
											<div className="flex items-start space-x-3">
												{comment.avatar ? (
													<img
														src={comment.avatar}
														alt={comment.user}
														className="w-10 h-10 rounded-full"
													/>
												) : (
													<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
														<span className="text-gray-600 font-medium">
															{comment.user.charAt(0)}
														</span>
													</div>
												)}
												<div className="flex-1">
													<div className="flex items-center space-x-2 mb-1">
														<span className="font-medium text-gray-900">{comment.user}</span>
														<span className="text-gray-500 text-sm">{formatTime(comment.time)}</span>
														{comment.rating && (
															<div className="flex items-center">
																{Array.from({ length: 5 }).map((_, i) => (
																	<span
																		key={i}
																		className={`text-sm ${
																			i < comment.rating! ? 'text-yellow-400' : 'text-gray-300'
																		}`}
																	>
																		★
																	</span>
																))}
															</div>
														)}
													</div>
													<p className="text-gray-700">{comment.content}</p>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									<p>暂无评论</p>
									{user && (
										<p className="text-sm mt-2">成为第一个评论的人吧！</p>
									)}
								</div>
							)}
						</div>
					</div>

					{/* 右侧信息栏 */}
					<div className="space-y-6">
						{/* 联系信息 */}
						{place.wechat && (
							<div className="card">
								<h3 className="text-lg font-semibold text-gray-900 mb-3">📱 联系方式</h3>
								<p className="text-gray-700">公众号：{place.wechat}</p>
							</div>
						)}

						{/* 评分统计 */}
						<div className="card">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">⭐ 评分</h3>
							{place.stats.rating > 0 ? (
								<div className="text-center mb-4">
									<div className="text-3xl font-bold text-yellow-500 mb-1">
										{place.stats.rating.toFixed(1)}
									</div>
									<div className="flex items-center justify-center mb-2">
										{Array.from({ length: 5 }).map((_, i) => (
											<span
												key={i}
												className={`text-lg ${
													i < Math.round(place.stats.rating) ? 'text-yellow-400' : 'text-gray-300'
												}`}
											>
												★
											</span>
										))}
									</div>
									<p className="text-gray-500 text-sm">
										{place.stats.ratingCount} 人评分
									</p>
								</div>
							) : (
								<p className="text-gray-500 text-center mb-4">暂无评分</p>
							)}
							
							{/* 用户评分 */}
							{user && (
								<div>
									<p className="text-sm text-gray-600 mb-2">您的评分：</p>
									<div className="flex items-center justify-center space-x-1">
										{Array.from({ length: 5 }).map((_, i) => (
											<button
												key={i}
												onClick={() => handleRatingSubmit(i + 1)}
												disabled={submitting}
												className={`text-2xl transition-colors ${
													i < userRating ? 'text-yellow-400' : 'text-gray-300'
												} hover:text-yellow-300 disabled:opacity-50`}
											>
												★
											</button>
										))}
									</div>
									{userRating > 0 && (
										<p className="text-center text-sm text-gray-500 mt-1">
											您给了 {userRating} 星
										</p>
									)}
								</div>
							)}
						</div>

						{/* 操作按钮 */}
						<div className="card">
							<div className="space-y-3">
								<button className="btn-primary w-full">
									📞 联系咨询
								</button>
								<button className="btn-secondary w-full">
									❤️ 收藏
								</button>
								<button className="btn-secondary w-full">
									📤 分享
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaceDetail; 