import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../services/api';
import { adminApi } from '../services/api';

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

const UserManage: React.FC = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [filters, setFilters] = useState({
		role: '',
	});
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

	useEffect(() => {
		loadUsers();
	}, [currentPage, filters, debouncedSearchTerm]);

	const loadUsers = async () => {
		try {
			setLoading(true);
			const response = await adminApi.getAllUsers({
				page: currentPage,
				limit: 20,
				...filters,
				search: debouncedSearchTerm || undefined,
			});
			setUsers(response.data);
			setTotalPages(response.pagination.pages);
			setTotalCount(response.pagination.total);
		} catch (error) {
			console.error('加载用户失败:', error);
			alert('加载用户失败，请重试');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('确定要删除这个用户吗？')) return;

		try {
			await adminApi.deleteUser(id);
			alert('删除成功');
			loadUsers();
		} catch (error) {
			console.error('删除失败:', error);
			alert('删除失败，请重试');
		}
	};

	const handleBatchRoleUpdate = async (role: string) => {
		if (selectedUsers.length === 0) {
			alert('请选择要更新的用户');
			return;
		}

		try {
			await adminApi.batchUpdateUserRole(selectedUsers, role);
			alert('批量更新成功');
			setSelectedUsers([]);
			loadUsers();
		} catch (error) {
			console.error('批量更新失败:', error);
			alert('批量更新失败，请重试');
		}
	};

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedUsers(users.map(u => u._id));
		} else {
			setSelectedUsers([]);
		}
	};

	const handleSelectUser = (id: string, checked: boolean) => {
		if (checked) {
			setSelectedUsers(prev => [...prev, id]);
		} else {
			setSelectedUsers(prev => prev.filter(u => u !== id));
		}
	};

	return (
		<div className="animate-fade-in">
			{/* 页面标题 */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
				<p className="text-gray-600 mt-1">管理平台用户账户和权限</p>
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
								placeholder="搜索用户名或钱包地址..."
								className="input-glass text-sm w-full pl-10"
							/>
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
						</div>
						
						<select
							value={filters.role}
							onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
							className="input text-sm"
						>
							<option value="">全部角色</option>
							<option value="admin">管理员</option>
							<option value="user">普通用户</option>
						</select>
					</div>

					<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
						{selectedUsers.length > 0 && (
							<div className="flex flex-wrap gap-2">
								<button
									onClick={() => handleBatchRoleUpdate('admin')}
									className="btn-mint text-xs sm:text-sm"
								>
									批量设为管理员
								</button>
								<button
									onClick={() => handleBatchRoleUpdate('user')}
									className="btn-secondary text-xs sm:text-sm"
								>
									批量设为普通用户
								</button>
							</div>
						)}
						<button
							onClick={() => navigate('/manage/user/create')}
							className="btn-primary text-xs sm:text-sm w-full sm:w-auto"
						>
							➕ 新增用户
						</button>
					</div>
				</div>

				{/* 统计信息 */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
								👥
							</div>
							<div>
								<div className="text-2xl font-bold text-primary-700">{totalCount}</div>
								<div className="text-sm text-primary-600">总用户数</div>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-r from-mint-50 to-mint-100 p-4 rounded-lg">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-mint-500 rounded-lg flex items-center justify-center text-white">
								⚙️
							</div>
							<div>
								<div className="text-2xl font-bold text-mint-700">{users.filter(u => u.role === 'admin').length}</div>
								<div className="text-sm text-mint-600">管理员</div>
							</div>
						</div>
					</div>
					<div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
								👤
							</div>
							<div>
								<div className="text-2xl font-bold text-amber-700">{users.filter(u => u.role === 'user').length}</div>
								<div className="text-sm text-amber-600">普通用户</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 用户列表 */}
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
												checked={selectedUsers.length === users.length && users.length > 0}
												onChange={(e) => handleSelectAll(e.target.checked)}
												className="rounded"
											/>
										</th>
										<th className="text-left py-3 px-2 sm:px-4">用户</th>
										<th className="text-left py-3 px-2 sm:px-4 hidden md:table-cell">钱包地址</th>
										<th className="text-left py-3 px-2 sm:px-4">角色</th>
										<th className="text-left py-3 px-2 sm:px-4 hidden lg:table-cell">注册时间</th>
										<th className="text-left py-3 px-2 sm:px-4">操作</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
											<td className="py-3 px-2 sm:px-4">
												<input
													type="checkbox"
													checked={selectedUsers.includes(user._id)}
													onChange={(e) => handleSelectUser(user._id, e.target.checked)}
													className="rounded"
												/>
											</td>
											<td className="py-3 px-2 sm:px-4">
												<div className="flex items-center space-x-3">
													<div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-mint-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
														{user.username?.charAt(0)?.toUpperCase() || 'U'}
													</div>
													<div>
														<div className="font-medium text-gray-900 text-sm sm:text-base">{user.username}</div>
														<div className="md:hidden text-xs text-gray-500">{user.walletAddress?.slice(0, 10)}...</div>
													</div>
												</div>
											</td>
											<td className="py-3 px-2 sm:px-4 text-gray-600 hidden md:table-cell">
												<span className="font-mono text-sm">{user.walletAddress}</span>
											</td>
											<td className="py-3 px-2 sm:px-4">
												<span className={`tag ${
													user.role === 'admin' 
														? 'tag-mint'
														: 'tag-primary'
												}`}>
													{user.role === 'admin' ? '管理员' : '普通用户'}
												</span>
											</td>
											<td className="py-3 px-2 sm:px-4 text-gray-600 hidden lg:table-cell">
												{new Date(user.createdAt).toLocaleDateString()}
											</td>
											<td className="py-3 px-2 sm:px-4">
												<div className="flex items-center space-x-1 sm:space-x-2">
													<button
														onClick={() => navigate(`/manage/user/detail/${user._id}`)}
														className="text-primary-600 hover:text-primary-800 text-xs sm:text-sm transition-colors duration-200"
													>
														详情
													</button>
													<button
														onClick={() => navigate(`/manage/user/detail/${user._id}`)}
														className="text-mint-600 hover:text-mint-800 text-xs sm:text-sm transition-colors duration-200"
													>
														编辑
													</button>
													{user.role !== 'admin' && (
														<button
															onClick={() => handleDelete(user._id)}
															className="text-rose-600 hover:text-rose-800 text-xs sm:text-sm transition-colors duration-200"
														>
															删除
														</button>
													)}
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

export default UserManage; 