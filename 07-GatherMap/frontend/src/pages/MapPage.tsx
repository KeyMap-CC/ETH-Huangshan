import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { Place } from '../services/api';
import { placesApi } from '../services/api';
import 'leaflet/dist/leaflet.css';

 

// 自定义地图图标 - 根据类型设置不同颜色
const createCustomIcon = (type: 'gathering' | 'event') => {
	// 使用简单的默认图标进行测试
	const iconUrl = type === 'gathering' 
		? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
		: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
	
	console.log(`创建图标: ${type}, URL: ${iconUrl}`);
	
	return new Icon({
		iconUrl,
		iconSize: [25, 41], // 使用标准尺寸
		iconAnchor: [12, 41], // 标准锚点
		popupAnchor: [1, -34],
		shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
		shadowSize: [41, 41],
		shadowAnchor: [12, 41],
	});
};

// 地图事件监听组件
const MapEvents: React.FC<{ onZoomChange: (zoom: number) => void }> = ({ onZoomChange }) => {
	const map = useMap();
	
	useEffect(() => {
		const handleZoomEnd = () => {
			onZoomChange(map.getZoom());
		};
		
		map.on('zoomend', handleZoomEnd);
		return () => {
			map.off('zoomend', handleZoomEnd);
		};
	}, [map, onZoomChange]);
	
	return null;
};

// 悬浮信息组件
const FloatingInfo: React.FC<{ 
	place: Place; 
	isVisible: boolean;
	onViewDetail: (placeId: string) => void;
}> = ({ place, isVisible, onViewDetail }) => {
	if (!isVisible) return null;
	
	// 安全地获取容量信息，避免运行时错误
	const capacity = place.capacity || { rooms: 0, maxPeople: 0, currentPeople: 0 };
	const availableRooms = capacity.rooms?capacity.rooms - (capacity.currentPeople||0):0;
	
	return (
		<div className="absolute bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 p-4 max-w-xs z-20 transform -translate-x-1/2 -translate-y-full -mt-2 animate-scale-in">
			<div className="text-sm font-semibold text-gray-900 mb-2">{place.name}</div>
			<div className="text-xs text-gray-600 mb-2">{place.cost || '费用信息暂无'}</div>
			<div className="text-xs text-gray-500 mb-3">
				剩余房源: {availableRooms > 0 ? `${availableRooms}间` : '已满员'}
			</div>
			
			{/* 详情跳转按钮 */}
			<button
				onClick={(e) => {
					e.stopPropagation(); // 阻止事件冒泡
					onViewDetail(place._id);
				}}
				className="w-full btn-primary text-xs py-2 px-3"
			>
				查看详情
			</button>
			
			<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
		</div>
	);
};

// 详情弹窗组件
const DetailModal: React.FC<{ 
	place: Place | null; 
	isOpen: boolean; 
	onClose: () => void;
	onViewDetail: (placeId: string) => void;
}> = ({ place, isOpen, onClose, onViewDetail }) => {
	if (!isOpen || !place) return null;
	
	const isMobile = window.innerWidth <= 768;
	
	return (
		<>
			{/* 弹窗内容 */}
			<div className={`fixed z-[100] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 ${
				isMobile 
					? 'bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto animate-slide-up' 
					: 'top-[205px] right-[32px] max-w-md w-full max-h-[80vh] overflow-y-auto animate-fade-in'
			}`}>
				{/* 移动端拖拽指示器 */}
				{isMobile && (
					<div className="flex justify-center py-3">
						<div className="w-12 h-1 bg-gray-300/50 rounded-full"></div>
					</div>
				)}
				
				<div className="p-6">
					{/* 头部 */}
					<div className="flex items-start justify-between mb-6">
						<div className="flex-1">
							<h2 className="text-xl font-bold gradient-text mb-3">{place.name}</h2>
							<div className="flex items-center space-x-2 mb-3">
								<span className={`tag ${
									place.type === 'gathering' 
										? 'tag-primary' 
										: 'tag-mint'
								}`}>
									{place.type === 'gathering' ? '聚集地' : '活动场地'}
								</span>
								<span className={`tag ${
									place.status === '开放中' 
										? 'tag-mint'
										: place.status === '内测中'
										? 'tag-amber'
										: 'tag-rose'
								}`}>
									{place.status}
								</span>
							</div>
						</div>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 hover:scale-110"
						>
							×
						</button>
					</div>
					
					{/* 封面图片 */}
					{place.cover && place.cover.trim() !== '' && (
						<div className="mb-6">
							<img 
								src={place.cover} 
								alt={place.name}
								className="w-full h-40 object-cover rounded-xl shadow-lg"
								onError={(e) => {
									// 图片加载失败时隐藏图片
									e.currentTarget.style.display = 'none';
								}}
							/>
						</div>
					)}
					
					{/* 基本信息 */}
					<div className="space-y-4 mb-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-1 block">地址</label>
								<p className="text-sm text-gray-900 bg-gray-50/50 p-3 rounded-lg">{place.location || '地址信息暂无'}</p>
							</div>
							
							<div>
								<label className="text-sm font-medium text-gray-700 mb-1 block">城市</label>
								<p className="text-sm text-gray-900 bg-gray-50/50 p-3 rounded-lg">{place.city || '城市信息暂无'}</p>
							</div>
						</div>
						
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-1 block">费用</label>
								<p className="text-sm text-gray-900 bg-gray-50/50 p-3 rounded-lg">{place.cost || '费用信息暂无'}</p>
							</div>
							
							<div>
								<label className="text-sm font-medium text-gray-700 mb-1 block">容量</label>
								<p className="text-sm text-gray-900 bg-gray-50/50 p-3 rounded-lg">
									{place.capacity?.rooms || 0}间房 / {place.capacity?.maxPeople || 0}人
									{place.capacity?.currentPeople && place.capacity?.currentPeople > 0 && (
										<span className="text-gray-500 ml-2">
											(当前{place.capacity.currentPeople}人)
										</span>
									)}
								</p>
							</div>
						</div>
					</div>
					
					{/* 统计信息 */}
					<div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-primary-50 to-mint-50 rounded-xl border border-primary-100/50">
						<div className="text-center">
							<div className="text-lg font-bold text-primary-600">{place.stats?.views || 0}</div>
							<div className="text-xs text-gray-600">浏览量</div>
						</div>
						<div className="text-center">
							<div className="text-lg font-bold text-mint-600">{place.stats?.comments || 0}</div>
							<div className="text-xs text-gray-600">评论</div>
						</div>
						<div className="text-center">
							<div className="text-lg font-bold text-amber-600">{(place.stats?.rating || 0).toFixed(1)}</div>
							<div className="text-xs text-gray-600">评分</div>
						</div>
					</div>
					
					{/* 操作按钮 */}
					<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
						<button
							onClick={() => onViewDetail(place._id)}
							className="flex-1 btn-primary"
						>
							查看详情
						</button>
						<button
							onClick={onClose}
							className="flex-1 btn-secondary"
						>
							关闭
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

const MapPage: React.FC = () => {
	const [places, setPlaces] = useState<Place[]>([]);
	const [loading, setLoading] = useState(true);
	const [mapZoom, setMapZoom] = useState(5);
	const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [filters, setFilters] = useState({
		type: '',
		status: '',
		city: '',
		search: '',
	});
	const [cities, setCities] = useState<string[]>([]);
	const [loadingCities, setLoadingCities] = useState(false);
	const [mapPosition] = useState<[number, number]>([35.8617, 104.1954]); // 中国中心

	const loadPlaces = useCallback(async () => {
		try {
			setLoading(true);
			const response = await placesApi.getPlaces({
				...filters,
				limit: 200, // 获取更多数据用于地图显示
			});
			console.log('API返回的聚集地数据:', response.data);
			console.log('数据总数:', response.data.length);
			
			// 检查数据完整性
			response.data.forEach((place, index) => {
				console.log(`聚集地 ${index + 1}: ${place.name}`);
				console.log(`  - 坐标:`, place.coordinates);
				console.log(`  - 容量:`, place.capacity);
				console.log(`  - 统计:`, place.stats);
			});
			
			setPlaces(response.data);
		} catch (error) {
			console.error('加载聚集地失败:', error);
		} finally {
			setLoading(false);
		}
	}, [filters]);

	useEffect(() => {
		loadPlaces();
		loadCities();
	}, [loadPlaces]);

	const loadCities = useCallback(async () => {
		try {
			setLoadingCities(true);
			const response = await placesApi.getCities();
			setCities(response.data);
		} catch (error) {
			console.error('加载城市列表失败:', error);
		} finally {
			setLoadingCities(false);
		}
	}, []);

	const handleFilterChange = (key: string, value: string) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const handleMarkerClick = (place: Place) => {
		setSelectedPlace(place);
		setIsModalOpen(true);
	};

	const handleMarkerMouseOver = (place: Place) => {
		if (mapZoom >= 8) { // 只在较高缩放级别显示悬浮信息
			setHoveredPlace(place);
		}
	};

	const handleMarkerMouseOut = () => {
		setHoveredPlace(null);
	};

	const handleViewDetail = (placeId: string) => {
		setIsModalOpen(false);
		window.location.href = `/place/${placeId}`;
	};

	// 过滤出有有效坐标的place
	const placesWithCoordinates = places.filter(place => {
		const hasValidCoordinates = place.coordinates && 
			place.coordinates.coordinates && 
			Array.isArray(place.coordinates.coordinates) && 
			place.coordinates.coordinates.length === 2 &&
			typeof place.coordinates.coordinates[0] === 'number' &&
			typeof place.coordinates.coordinates[1] === 'number';
		
		if (!hasValidCoordinates) {
			console.log(`跳过 ${place.name}: 无效坐标`, place.coordinates);
		}
		
		return hasValidCoordinates;
	});

	console.log('过滤后的有效坐标数据:', placesWithCoordinates);
	console.log('有效坐标数据数量:', placesWithCoordinates.length);

	return (
		<div className="h-full flex flex-col">
			{/* 筛选器工具栏 */}
			<div className="card-glass mb-4 animate-fade-in">
				<div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">
					<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
						<span className="text-sm font-medium text-gray-700 hidden sm:block">筛选:</span>
						<div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
							<select
								value={filters.type}
								onChange={(e) => handleFilterChange('type', e.target.value)}
								className="input-glass text-sm"
							>
								<option value="">全部类型</option>
								<option value="gathering">聚集地</option>
								<option value="event">活动场地</option>
							</select>
							
							<select
								value={filters.status}
								onChange={(e) => handleFilterChange('status', e.target.value)}
								className="input-glass text-sm"
							>
								<option value="">全部状态</option>
								<option value="开放中">开放中</option>
								<option value="内测中">内测中</option>
								<option value="已关闭">已关闭</option>
							</select>
						</div>
						
						<div className="relative">
							<select
								value={filters.city}
								onChange={(e) => handleFilterChange('city', e.target.value)}
								className="input-glass text-sm"
								disabled={loadingCities}
							>
								<option value="">{loadingCities ? '加载中...' : '全部城市'}</option>
								{cities.map((city) => (
									<option key={city} value={city}>{city}</option>
								))}
							</select>
						</div>
					</div>
					
					<div className="text-sm text-muted text-center sm:text-left w-full sm:w-auto">
						共找到 <span className="font-semibold text-primary-600">{placesWithCoordinates.length}</span> 个地点
					</div>
				</div>
			</div>

			{/* 地图容器 */}
			<div className="flex-1 relative z-[99] rounded-2xl overflow-hidden shadow-xl border border-white/20">
				{loading && (
					<div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
						<div className="card-glass text-center">
							<div className="loading-spinner mx-auto mb-3"></div>
							<div className="text-lg text-gray-700">加载地图中...</div>
						</div>
					</div>
				)}
				
				<MapContainer
					center={mapPosition}
					zoom={5}
					className="h-full w-full"
				>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					
					<MapEvents onZoomChange={setMapZoom} />
					
					{placesWithCoordinates.map((place) => {
						// 转换坐标顺序：从 [经度, 纬度] 转换为 [纬度, 经度]
						const latLng: [number, number] = [
							place.coordinates!.coordinates[1], // 纬度
							place.coordinates!.coordinates[0]  // 经度
						];
						
						console.log(`渲染标记: ${place.name}, 原始坐标: ${place.coordinates!.coordinates}, 转换后坐标: ${latLng}, 类型: ${place.type}`);
						
						return (
							<Marker
								key={place._id}
								position={latLng}
								icon={createCustomIcon(place.type)}
								eventHandlers={{
									click: () => handleMarkerClick(place),
									mouseover: () => handleMarkerMouseOver(place),
									mouseout: handleMarkerMouseOut,
								}}
							>
								{/* 悬浮信息 */}
								{hoveredPlace?._id === place._id && place.coordinates && (
									<Popup
										position={latLng}
										className="custom-popup"
										closeButton={false}
									>
										<FloatingInfo 
											place={place} 
											isVisible={mapZoom >= 2}
											onViewDetail={handleViewDetail}
										/>
									</Popup>
								)}
							</Marker>
						);
					})}
				</MapContainer>
			</div>

			{/* 详情弹窗 */}
			<DetailModal
				place={selectedPlace}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onViewDetail={handleViewDetail}
			/>
		</div>
	);
};

export default MapPage;