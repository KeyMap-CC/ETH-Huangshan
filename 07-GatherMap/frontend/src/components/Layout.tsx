import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import type { User } from '../services/api';

interface LayoutProps {
	children: React.ReactNode;
	user: User | null;
	setUser: (user: User | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, setUser, children }) => {
	const location = useLocation();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	
	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		setUser(null);
		setDropdownOpen(false);
	};

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	
	return (
		<div className="layout-container">
			{/* 独立Header */}
			<header className="header">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo和导航 */}
						<div className="flex items-center space-x-4 sm:space-x-8">
							<Link to="/" className="flex items-center space-x-2 group decoration-none">
								<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-mint-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
									🌍
								</div>
								<span className="text-lg sm:text-xl font-bold gradient-text">GatherMap</span>
							</Link>
							
							{/* 导航菜单 */}
							<nav className="hidden md:flex items-center space-x-6">
								<Link 
									to="/" 
									className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
										location.pathname === '/' 
											? 'bg-primary-100 text-primary-700 shadow-sm' 
											: 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
									}`}
								>
									地图探索
								</Link>
								<Link 
									to="/roadmap" 
									className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
										location.pathname === '/roadmap' 
											? 'bg-mint-100 text-mint-700 shadow-sm' 
											: 'text-gray-600 hover:text-mint-600 hover:bg-mint-50'
									}`}
								>
									产品路线图
								</Link>
							</nav>
						</div>
						
						{/* 用户操作区 */}
						<div className="flex items-center space-x-2 sm:space-x-4">
							{user ? (
								<div className="relative" ref={dropdownRef}>
									{/* 用户信息按钮 */}
									<button
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-all duration-200"
									>
										<div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-mint-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
											{user.username?.charAt(0)?.toUpperCase() || 'U'}
										</div>
										<div className="hidden sm:block text-left">
											<div className="text-sm font-medium text-gray-900">{user.username}</div>
											<div className="text-xs text-gray-500">{user.role === 'admin' ? '管理员' : '用户'}</div>
										</div>
										<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
										</svg>
									</button>

									{/* 下拉菜单 */}
									{dropdownOpen && (
										<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
											<Link
												to="/profile"
												onClick={() => setDropdownOpen(false)}
												className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
											>
												<div className="flex items-center space-x-2">
													<span>👤</span>
													<span>个人中心</span>
												</div>
											</Link>
											{user.role === 'admin' && (
												<Link
													to="/manage"
													onClick={() => setDropdownOpen(false)}
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
												>
													<div className="flex items-center space-x-2">
														<span>⚙️</span>
														<span>管理后台</span>
													</div>
												</Link>
											)}
											<button
												onClick={handleLogout}
												className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
											>
												<div className="flex items-center space-x-2">
													<span>🚪</span>
													<span>退出登录</span>
												</div>
											</button>
										</div>
									)}
								</div>
							) : (
								<Link to="/login" className="btn-primary text-xs sm:text-sm px-2 sm:px-4">
									<span className="mr-1 sm:mr-2">🦊</span>
									<span className="hidden sm:inline">小狐狸登录</span>
									<span className="sm:hidden">登录</span>
								</Link>
							)}
						</div>
					</div>
				</div>
			</header>
			
			{/* 主内容区域 */}
			<main className="main-content h-[calc(100vh-64px)]">
				{children}
			</main>
		</div>
	);
};

export default Layout; 