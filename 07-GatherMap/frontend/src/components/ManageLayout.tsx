import React from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import type { User } from '../services/api';

interface ManageLayoutProps {
	user: User | null;
}

const ManageLayout: React.FC<ManageLayoutProps> = ({ user }) => {
	const location = useLocation();

	// 检查用户权限
	if (!user || user.role !== 'admin') {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="flex">
				{/* 侧边栏 */}
				<div className="w-64 bg-white shadow-lg min-h-screen">
					<div className="p-6">
						<h2 className="text-xl font-bold gradient-text mb-6">管理后台</h2>
						<nav className="space-y-2">
							<Link
								to="/manage/place"
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
									location.pathname.startsWith('/manage/place')
										? 'bg-primary-100 text-primary-700 shadow-sm'
										: 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
								}`}
							>
								<span className="text-xl">🏢</span>
								<span className="font-medium">场地管理</span>
							</Link>
							<Link
								to="/manage/user"
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
									location.pathname.startsWith('/manage/user')
										? 'bg-mint-100 text-mint-700 shadow-sm'
										: 'text-gray-600 hover:text-mint-600 hover:bg-mint-50'
								}`}
							>
								<span className="text-xl">👥</span>
								<span className="font-medium">用户管理</span>
							</Link>
						</nav>
					</div>
				</div>

				{/* 主内容区域 */}
				<div className="flex-1 p-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default ManageLayout; 