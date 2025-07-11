import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Place } from '../services/api';
import { adminApi } from '../services/api';
import PlaceStatsCard from '../components/PlaceStatsCard';

// 防抖Hook
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const PlaceManage: React.FC = () => {
	const navigate = useNavigate();
	const [places, setPlaces] = useState<Place[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [filters, setFilters] = useState({
		status: '',
		type: '',
	});
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);

	useEffect(() => {
		loadPlaces();
	}, [currentPage, filters, debouncedSearchTerm]);

	const loadPlaces = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getAllPlaces({
				page: currentPage,
				limit: 20,
				...filters,
				search: debouncedSearchTerm || undefined,
			});
			setPlaces(response.data);
			setTotalPages(response.pagination.pages);
			setTotalCount(response.pagination.total);
		} catch (error) {
			console.error('加载聚集地失败:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('确定要删除这个聚集地吗？')) return;

		try {
			await adminApi.deletePlace(id);
			loadPlaces();
		} catch (error) {
			console.error('删除失败:', error);
		}
	};

	const handleBatchStatusUpdate = async (status: string) => {
		if (selectedPlaces.length === 0) {
			alert('请选择要更新的聚集地');
			return;
		}

		try {
			await adminApi.batchUpdateStatus(selectedPlaces, status);
			setSelectedPlaces([]);
			loadPlaces();
		} catch (error) {
			console.error('批量更新失败:', error);
		}
	};

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedPlaces(places.map(p => p._id));
		} else {
			setSelectedPlaces([]);
		}
	};

	const handleSelectPlace = (id: string, checked: boolean) => {
		if (checked) {
			setSelectedPlaces(prev => [...prev, id]);
		} else {
			setSelectedPlaces(prev => prev.filter(p => p !== id));
		}
	};

	return (
		<div className="animate-fade-in">
			{/* 页面标题 */}
			<div className="mb-4 flex flex-row items-center justify-start gap-3">
				<h1 className="text-2xl font-bold text-gray-900 my-0">场地管理</h1>
				<p className="text-gray-600 my-0">管理数字游民聚集地和活动场地</p>
			</div>

			{/* 筛选和操作栏 */}
			<div className="card-glass mb-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
					<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
						{/* 搜索框 */}
						<div className="relative w-full sm:w-64">
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="搜索聚集地名称..."
								className="input-glass text-sm w-[200px] pl-10"
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
						</div>
						
						<select
							value={filters.status}
							onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
							className="input text-sm"
						>
							<option value="">全部状态</option>
							<option value="内测中">内测中</option>
							<option value="开放中">开放中</option>
							<option value="疑似关闭">疑似关闭</option>
							<option value="已关闭">已关闭</option>
						</select>
						
						<select
							value={filters.type}
							onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
							className="input-glass text-sm w-full sm:w-auto"
						>
							<option value="">全部类型</option>
							<option value="gathering">聚集地</option>
							<option value="event">活动场地</option>
						</select>
					</div>

					<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
						{selectedPlaces.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<button
									onClick={() => handleBatchStatusUpdate('开放中')}
									className="btn-mint text-xs sm:text-sm"
								>
									批量设为开放
								</button>
								<button
									onClick={() => handleBatchStatusUpdate('已关闭')}
									className="btn-rose text-xs sm:text-sm"
								>
									批量设为关闭
								</button>
							</div>
						)}
						<button
							onClick={() => navigate('/manage/place/create')}
							className="btn-primary text-xs sm:text-sm w-full sm:w-auto"
						>
							➕ 新增聚集地
						</button>
					</div>
				</div>

				{/* 统计信息 */}
				<PlaceStatsCard />
			</div>

			{/* 聚集地列表 */}
			<div className="card-glass">
				{loading ? (
					<div className="text-center py-12">
						<div className="loading-spinner mx-auto mb-4"></div>
						<div className="text-lg text-gray-700">加载中...</div>
					</div>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-2 sm:px-4">
											<input
												type="checkbox"
												checked={selectedPlaces.length === places.length && places.length > 0}
												onChange={(e) => handleSelectAll(e.target.checked)}
												className="rounded"
											/>
										</th>
										<th className="text-left py-3 px-2 sm:px-4">名称</th>
										<th className="text-left py-3 px-2 sm:px-4 hidden sm:table-cell">类型</th>
										<th className="text-left py-3 px-2 sm:px-4">状态</th>
										<th className="text-left py-3 px-2 sm:px-4 hidden md:table-cell">城市</th>
										<th className="text-left py-3 px-2 sm:px-4 hidden lg:table-cell">浏览量</th>
										<th className="text-left py-3 px-2 sm:px-4 hidden lg:table-cell">评论数</th>
										<th className="text-left py-3 px-2 sm:px-4">操作</th>
									</tr>
								</thead>
								<tbody>
									{places.map((place) => (
										<tr key={place._id} className="border-b border-gray-100 hover:bg-gray-50">
											<td className="py-3 px-2 sm:px-4">
												<input
													type="checkbox"
													checked={selectedPlaces.includes(place._id)}
													onChange={(e) => handleSelectPlace(place._id, e.target.checked)}
													className="rounded"
												/>
											</td>
											<td className="py-3 px-2 sm:px-4">
												<div>
													<div className="font-medium text-gray-900 text-sm sm:text-base">{place.name}</div>
													<div className="text-xs sm:text-sm text-gray-500">{place.location}</div>
													<div className="sm:hidden mt-1">
														<span className={`tag text-xs ${
															place.type === 'gathering' 
																? 'tag-primary' 
																: 'tag-mint'
														}`}>
															{place.type === 'gathering' ? '聚集地' : '活动场地'}
														</span>
													</div>
												</div>
											</td>
											<td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
												<span className={`tag ${
													place.type === 'gathering' 
														? 'tag-primary' 
														: 'tag-mint'
												}`}>
													{place.type === 'gathering' ? '聚集地' : '活动场地'}
												</span>
											</td>
											<td className="py-3 px-2 sm:px-4">
												<span className={`tag ${
													place.status === '开放中' 
														? 'tag-mint'
														: place.status === '内测中'
														? 'tag-amber'
														: 'tag-rose'
												}`}>
													{place.status}
												</span>
											</td>
											<td className="py-3 px-2 sm:px-4 text-gray-600 hidden md:table-cell">{place.city}</td>
											<td className="py-3 px-2 sm:px-4 text-gray-600 hidden lg:table-cell">{place.stats?.views}</td>
											<td className="py-3 px-2 sm:px-4 text-gray-600 hidden lg:table-cell">{place.stats?.comments}</td>
											<td className="py-3 px-2 sm:px-4">
												<div className="flex items-center space-x-1 sm:space-x-2">
													<button
														onClick={() => navigate(`/place/${place._id}`)}
														className="text-primary-600 hover:text-primary-800 text-xs sm:text-sm transition-colors duration-200"
													>
														查看
													</button>
													<button
														onClick={() => navigate(`/manage/place/edit/${place._id}`)}
														className="text-mint-600 hover:text-mint-800 text-xs sm:text-sm transition-colors duration-200"
													>
														编辑
													</button>
													<button
														onClick={() => handleDelete(place._id)}
														className="text-rose-600 hover:text-rose-800 text-xs sm:text-sm transition-colors duration-200"
													>
														删除
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* 分页和统计信息 */}
						<div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
							<div className="text-sm text-gray-600 text-center sm:text-left">
								共 {totalCount} 条记录
							</div>
							{totalPages > 1 && (
								<div className="flex items-center space-x-2">
									<button
										onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
										disabled={currentPage === 1}
										className="btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
									>
										上一页
									</button>
									<span className="text-xs sm:text-sm text-muted px-2 sm:px-3 py-1 bg-gray-50/50 rounded-lg">
										{currentPage} / {totalPages}
									</span>
									<button
										onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
										disabled={currentPage === totalPages}
										className="btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
									>
										下一页
									</button>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PlaceManage; 