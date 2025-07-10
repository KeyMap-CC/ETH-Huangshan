import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { User } from '../services/api';
import { adminApi, placesApi } from '../services/api';

interface EditPlaceProps {
	user: User | null;
}

const EditPlace: React.FC<EditPlaceProps> = ({ user }) => {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: '',
		type: 'gathering' as 'gathering' | 'event',
		status: '内测中',
		location: '',
		city: '',
		cost: '',
		wechat: '',
		investor: '',
		tour: '',
		convenience: '',
		scale: '',
		atmosphere: '',
		workEnv: '',
		cover: '',
		capacity: {
			rooms: 0,
			maxPeople: 0,
			currentPeople: 0
		},
		// 新增字段
		solgan: '',
		tags: [] as string[],
		roomTypes: [] as string[],
		openingTime: '',
		officialAccount: '',
		xiaohongshu: '',
		relatedLinks: '',
		bookingMethod: '',
		notes: '',
		priceRange: {
			min: 0,
			max: 0,
			currency: 'CNY'
		},
		// 坐标信息
		coordinates: {
			type: 'Point',
			coordinates: [0, 0] // [经度, 纬度]
		}
	});

	// 加载现有数据
	useEffect(() => {
		if (id) {
			loadPlaceData();
		}
	}, [id]);

	const loadPlaceData = async () => {
		try {
			setInitialLoading(true);
			const response = await placesApi.getPlaceById(id!);
			const place = response.data;
			
			setFormData({
				name: place.name,
				type: place.type,
				status: place.status,
				location: place.location,
				city: place.city || '',
				cost: place.cost || '',
				wechat: place.wechat || '',
				investor: place.investor || '',
				tour: place.tour || '',
				convenience: place.convenience || '',
				scale: place.scale || '',
				atmosphere: place.atmosphere || '',
				workEnv: place.workEnv || '',
				cover: place.cover || '',
				capacity: {
					rooms: place.capacity?.rooms || 0,
					maxPeople: place.capacity?.maxPeople || 0,
					currentPeople: place.capacity?.currentPeople || 0
				},
				// 新增字段
				solgan: place.solgan || '',
				tags: place.tags || [],
				roomTypes: place.roomTypes || [],
				openingTime: place.openingTime || '',
				officialAccount: place.officialAccount || '',
				xiaohongshu: place.xiaohongshu || '',
				relatedLinks: place.relatedLinks || '',
				bookingMethod: place.bookingMethod || '',
				notes: place.notes || '',
				priceRange: {
					min: place.priceRange?.min || 0,
					max: place.priceRange?.max || 0,
					currency: place.priceRange?.currency || 'CNY'
				},
				// 坐标信息
				coordinates: {
					type: 'Point',
					coordinates: place.coordinates?.coordinates || [0, 0]
				}
			});
		} catch (error) {
			console.error('加载聚集地数据失败:', error);
			alert('加载数据失败');
			navigate('/admin');
		} finally {
			setInitialLoading(false);
		}
	};

	const handleInputChange = (field: string, value: string | number | string[] | { rooms?: number; maxPeople?: number; currentPeople?: number } | { min?: number; max?: number; currency?: string }) => {
		if (field.includes('.')) {
			const [parentField, childField] = field.split('.');
			setFormData(prev => {
				const parentValue = prev[parentField as keyof typeof prev];
				const parentObject = typeof parentValue === 'object' && parentValue !== null ? parentValue : {};
				return {
					...prev,
					[parentField]: {
						...parentObject,
						[childField]: value
					}
				};
			});
		} else {
			setFormData(prev => ({
				...prev,
				[field]: value
			}));
		}
	};

	const handleTagsChange = (value: string) => {
		const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
		setFormData(prev => ({ ...prev, tags }));
	};

	const handleRoomTypesChange = (value: string) => {
		const roomTypes = value.split(',').map(type => type.trim()).filter(type => type.length > 0);
		setFormData(prev => ({ ...prev, roomTypes }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.name || !formData.location) {
			alert('名称和地址为必填项');
			return;
		}

		try {
			setLoading(true);
			await adminApi.updatePlace(id!, formData);
			alert('更新成功！');
			navigate('/admin');
		} catch (error) {
			console.error('更新失败:', error);
			alert('更新失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	if (!user || user.role !== 'admin') {
		navigate('/');
		return null;
	}

	if (initialLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">加载中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 顶部导航 */}
			<header className="bg-white shadow-sm border-b px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2 sm:space-x-4">
						<button
							onClick={() => navigate('/admin')}
							className="btn-secondary text-xs sm:text-sm"
						>
							← 返回管理后台
						</button>
						<h1 className="text-lg sm:text-xl font-bold text-gray-900">编辑聚集地</h1>
					</div>
				</div>
			</header>

			<div className="max-w-4xl mx-auto p-4 sm:p-6">
				<div className="card">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* 基本信息 */}
						<div>
							<h2 className="text-base sm:text-lg font-semibold mb-4">基本信息</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										名称 *
									</label>
									<input
										type="text"
										value={formData.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										className="input w-full"
										required
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										类型
									</label>
									<select
										value={formData.type}
										onChange={(e) => handleInputChange('type', e.target.value)}
										className="input w-full"
									>
										<option value="gathering">聚集地</option>
										<option value="event">活动场地</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										状态
									</label>
									<select
									value={formData.status}
									onChange={(e) => handleInputChange('status', e.target.value)}
									className="input w-full"
								>
									<option value="内测中">内测中</option>
									<option value="开放中">开放中</option>
									<option value="疑似关闭">疑似关闭</option>
									<option value="已关闭">已关闭</option>
								</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										城市
									</label>
									<input
										type="text"
										value={formData.city}
										onChange={(e) => handleInputChange('city', e.target.value)}
										className="input w-full"
									/>
								</div>
							</div>
						</div>

						{/* 地址信息 */}
					<div>
						<h2 className="text-lg font-semibold mb-4">地址信息</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									详细地址 *
								</label>
								<input
									type="text"
									value={formData.location}
									onChange={(e) => handleInputChange('location', e.target.value)}
									className="input w-full"
									required
								/>
							</div>
							
							{/* 坐标信息 */}
							<div>
								<h3 className="text-md font-medium text-gray-800 mb-2">坐标信息</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											经度 (Longitude)
										</label>
										<input
											type="number"
											step="any"
											value={formData.coordinates.coordinates[0]}
											onChange={(e) => {
												const newCoords = [...formData.coordinates.coordinates];
												newCoords[0] = parseFloat(e.target.value) || 0;
												handleInputChange('coordinates', {
													type: 'Point',
													coordinates: newCoords
												});
											}}
											className="input w-full"
											placeholder="例如：116.397128"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											纬度 (Latitude)
										</label>
										<input
											type="number"
											step="any"
											value={formData.coordinates.coordinates[1]}
											onChange={(e) => {
												const newCoords = [...formData.coordinates.coordinates];
												newCoords[1] = parseFloat(e.target.value) || 0;
												handleInputChange('coordinates', {
													type: 'Point',
													coordinates: newCoords
												});
											}}
											className="input w-full"
											placeholder="例如：39.916527"
										/>
									</div>
								</div>
								<div className="text-sm text-gray-500">
									<p>提示：可以通过地图工具获取准确的经纬度坐标</p>
									<p>经度范围：-180 到 180，纬度范围：-90 到 90</p>
								</div>
							</div>
						</div>
					</div>

						{/* 费用信息 */}
						<div>
							<h2 className="text-lg font-semibold mb-4">费用信息</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									费用描述
								</label>
								<textarea
									value={formData.cost}
									onChange={(e) => handleInputChange('cost', e.target.value)}
									className="input w-full h-20"
									placeholder="例如：多人间 300/月，单人间 1000/月"
								/>
							</div>
						</div>

						{/* 容量信息 */}
						<div>
							<h2 className="text-lg font-semibold mb-4">容量信息</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										房间数
									</label>
									<input
										type="number"
										value={formData.capacity.rooms}
										onChange={(e) => handleInputChange('capacity.rooms', parseInt(e.target.value) || 0)}
										className="input w-full"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										最大容纳人数
									</label>
									<input
										type="number"
										value={formData.capacity.maxPeople}
										onChange={(e) => handleInputChange('capacity.maxPeople', parseInt(e.target.value) || 0)}
										className="input w-full"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										当前人数
									</label>
									<input
										type="number"
										value={formData.capacity.currentPeople}
										onChange={(e) => handleInputChange('capacity.currentPeople', parseInt(e.target.value) || 0)}
										className="input w-full"
									/>
								</div>
							</div>
						</div>

						{/* 详细信息 */}
						<div>
							<h2 className="text-lg font-semibold mb-4">详细信息</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										投资方和运营方
									</label>
									<input
										type="text"
										value={formData.investor}
										onChange={(e) => handleInputChange('investor', e.target.value)}
										className="input w-full"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										公众号
									</label>
									<input
										type="text"
										value={formData.wechat}
										onChange={(e) => handleInputChange('wechat', e.target.value)}
										className="input w-full"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										旅游和休闲
									</label>
									<textarea
										value={formData.tour}
										onChange={(e) => handleInputChange('tour', e.target.value)}
										className="input w-full h-20"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										生活便利性
									</label>
									<textarea
										value={formData.convenience}
										onChange={(e) => handleInputChange('convenience', e.target.value)}
										className="input w-full h-20"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										社群规模
									</label>
									<input
										type="text"
										value={formData.scale}
										onChange={(e) => handleInputChange('scale', e.target.value)}
										className="input w-full"
									/>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										氛围
									</label>
									<input
										type="text"
										value={formData.atmosphere}
										onChange={(e) => handleInputChange('atmosphere', e.target.value)}
										className="input w-full"
									/>
								</div>
								
								<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								工作环境
							</label>
							<textarea
								value={formData.workEnv}
								onChange={(e) => handleInputChange('workEnv', e.target.value)}
								className="input w-full h-20"
							/>
						</div>
					</div>
				</div>

				{/* 扩展信息 */}
				<div>
					<h2 className="text-lg font-semibold mb-4">扩展信息</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								标语
							</label>
							<input
								type="text"
								value={formData.solgan}
								onChange={(e) => handleInputChange('solgan', e.target.value)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								开业时间
							</label>
							<input
								type="date"
								value={formData.openingTime}
								onChange={(e) => handleInputChange('openingTime', e.target.value)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								官方公众号
							</label>
							<input
								type="text"
								value={formData.officialAccount}
								onChange={(e) => handleInputChange('officialAccount', e.target.value)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								小红书
							</label>
							<input
								type="text"
								value={formData.xiaohongshu}
								onChange={(e) => handleInputChange('xiaohongshu', e.target.value)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								预定方式
							</label>
							<input
								type="text"
								value={formData.bookingMethod}
								onChange={(e) => handleInputChange('bookingMethod', e.target.value)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								标签 (用逗号分隔)
							</label>
							<input
								type="text"
								value={formData.tags.join(', ')}
								onChange={(e) => handleTagsChange(e.target.value)}
								className="input w-full"
								placeholder="例如：大草坪, 海景, 过冬"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								可订房型 (用逗号分隔)
							</label>
							<input
								type="text"
								value={formData.roomTypes.join(', ')}
								onChange={(e) => handleRoomTypesChange(e.target.value)}
								className="input w-full"
								placeholder="例如：单人间, 双人间, 四人间"
							/>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								相关链接
							</label>
							<textarea
								value={formData.relatedLinks}
								onChange={(e) => handleInputChange('relatedLinks', e.target.value)}
								className="input w-full h-20"
								placeholder="相关网站或社交媒体链接"
							/>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								备注
							</label>
							<textarea
								value={formData.notes}
								onChange={(e) => handleInputChange('notes', e.target.value)}
								className="input w-full h-20"
								placeholder="其他备注信息"
							/>
						</div>
					</div>
				</div>

				{/* 价格范围 */}
				<div>
					<h2 className="text-lg font-semibold mb-4">价格范围</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								最低价格
							</label>
							<input
								type="number"
								value={formData.priceRange.min}
								onChange={(e) => handleInputChange('priceRange.min', parseInt(e.target.value) || 0)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								最高价格
							</label>
							<input
								type="number"
								value={formData.priceRange.max}
								onChange={(e) => handleInputChange('priceRange.max', parseInt(e.target.value) || 0)}
								className="input w-full"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								货币
							</label>
							<select
								value={formData.priceRange.currency}
								onChange={(e) => handleInputChange('priceRange.currency', e.target.value)}
								className="input w-full"
							>
								<option value="CNY">人民币 (CNY)</option>
								<option value="USD">美元 (USD)</option>
								<option value="EUR">欧元 (EUR)</option>
							</select>
						</div>
					</div>
				</div>

						{/* 封面图片 */}
						<div>
							<h2 className="text-lg font-semibold mb-4">封面图片</h2>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									封面图片URL
								</label>
								<input
									type="url"
									value={formData.cover}
									onChange={(e) => handleInputChange('cover', e.target.value)}
									className="input w-full"
									placeholder="https://example.com/image.jpg"
								/>
							</div>
						</div>

						{/* 提交按钮 */}
						<div className="flex justify-end space-x-4 pt-6 border-t">
							<button
								type="button"
								onClick={() => navigate('/admin')}
								className="btn-secondary"
							>
								取消
							</button>
							<button
								type="submit"
								disabled={loading}
								className="btn-primary"
							>
								{loading ? '更新中...' : '更新聚集地'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditPlace;