import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MapPage from './pages/MapPage';
import PlaceDetail from './pages/PlaceDetail';
import Login from './pages/Login';
import RoadMap from './pages/RoadMap';
import CreatePlace from './pages/CreatePlace';
import EditPlace from './pages/EditPlace';
import PlaceManage from './pages/PlaceManage';
import UserManage from './pages/UserManage';
import UserDetail from './pages/UserDetail';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ManageLayout from './components/ManageLayout';
import type { User } from './services/api';
import { authApi } from './services/api';
import 'uno.css';
import 'leaflet/dist/leaflet.css';

function App() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 检查用户登录状态
		const token = localStorage.getItem('token');
		if (token) {
			// 获取用户信息
			authApi.getMe()
				.then(response => {
					console.log('获取用户信息成功:', response.data);
					setUser(response.data);
					// 缓存用户信息到localStorage
					localStorage.setItem('user', JSON.stringify(response.data));
				})
				.catch(error => {
					console.error('获取用户信息失败:', error);
					// token可能已过期，清除本地存储
					localStorage.removeItem('token');
					localStorage.removeItem('user');
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			// 尝试从localStorage恢复用户信息
			const cachedUser = localStorage.getItem('user');
			if (cachedUser) {
				try {
					const userData = JSON.parse(cachedUser);
					setUser(userData);
					console.log('从缓存恢复用户信息:', userData);
				} catch (error) {
					console.error('解析缓存用户信息失败:', error);
					localStorage.removeItem('user');
				}
			}
			setLoading(false);
		}
	}, []);

	// 更新用户信息的函数
	const updateUser = (newUser: User | null) => {
		setUser(newUser);
		if (newUser) {
			localStorage.setItem('user', JSON.stringify(newUser));
		} else {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		}
	};

	if (loading) {
		return (
			<div className="layout-container flex items-center justify-center">
				<div className="card-glass text-center animate-fade-in">
					<div className="loading-spinner mx-auto mb-4"></div>
					<div className="text-lg text-gray-700">加载中...</div>
				</div>
			</div>
		);
	}

	return (
		<Router>
			<Layout user={user} setUser={updateUser} >
			<Routes>
				{/* 主布局路由 */}
				<Route path="/" >
					<Route index element={<MapPage />} />
					<Route path="place/:id" element={<PlaceDetail user={user} />} />
					<Route path="profile" element={<Profile user={user} setUser={updateUser} />} />
					<Route path="login" element={<Login setUser={updateUser} />} />
					<Route path="roadmap" element={<RoadMap />} />
				</Route>

				{/* 管理后台路由 */}
				<Route path="/manage" element={<ManageLayout user={user} />}>
					<Route index element={<PlaceManage />} />
					<Route path="place" element={<PlaceManage />} />
					<Route path="place/create" element={<CreatePlace user={user} />} />
					<Route path="place/edit/:id" element={<EditPlace user={user} />} />
					<Route path="user" element={<UserManage />} />
					<Route path="user/detail/:id" element={<UserDetail />} />
				</Route>
			</Routes>
			</Layout>
		</Router>
	);
}

export default App;
