import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

// 类型定义
export interface Place {
	_id: string;
	name: string;
	type: 'gathering' | 'event';
	status: string;
	solgan?: string;
	cover?: string;
	location: string;
	coordinates?: {
		type: 'Point';
		coordinates: [number, number];
	};
	city?: string;
	cost?: string;
	wechat?: string;
	investor?: string;
	tour?: string;
	convenience?: string;
	scale?: string;
	atmosphere?: string;
	workEnv?: string;
	// 新增字段 - 从CSV导入
	tags?: string[];
	roomTypes?: string[];
	openingTime?: string;
	officialAccount?: string;
	xiaohongshu?: string;
	relatedLinks?: string;
	bookingMethod?: string;
	notes?: string;
	priceRange?: {
		min?: number;
		max?: number;
		currency?: string;
	};
	capacity?: {
		rooms?: number;
		maxPeople?: number;
		currentPeople?: number;
	};
	stats?: {
		views: number;
		comments: number;
		searches: number;
		rating: number;
		ratingCount: number;
	};
	comments?: Array<{
		avatar: string;
		user: string;
		time: string;
		content: string;
		rating: number;
	}>;
	htmlFile?: string;
	createdAt: string;
	updatedAt: string;
}

export interface User {
	_id: string;
	walletAddress: string;
	walletType: string;
	username: string;
	avatar: string;
	email: string;
	role: 'user' | 'admin';
	stats: {
		placesVisited: number;
		commentsCount: number;
		lastActive: string;
	};
	favorites: string[];
	createdAt: string;
}

export interface Comment {
	_id: string;
	content: string;
	rating?: number;
	user: string;
	avatar: string;
	time: string;
	stats: {
		likes: number;
		replies: number;
	};
}

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export interface PlaceStatItem {
	label: string;
	value: number;
	type: 'total' | 'open' | 'testing' | 'suspected' | 'closed';
}

// API方法
export const placesApi = {
	// 获取聚集地列表
	getPlaces: (params?: {
		type?: string;
		status?: string;
		city?: string;
		search?: string;
		page?: number;
		limit?: number;
		lng?: number;
		lat?: number;
		radius?: number;
	}): Promise<PaginatedResponse<Place>> => {
		return api.get('/places/list', { params });
	},

	// 获取聚集地详情
	getPlaceById: (id: string): Promise<ApiResponse<Place>> => {
		return api.get(`/places/detail/${id}`);
	},

	// 搜索聚集地
	searchPlaces: (keyword: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Place>> => {
		return api.get('/places/search', { params: { keyword, ...params } });
	},

	// 获取热门聚集地
	getPopularPlaces: (limit?: number): Promise<ApiResponse<Place[]>> => {
		return api.get('/places/popular', { params: { limit } });
	},

	// 获取所有城市列表
	getCities: (): Promise<ApiResponse<string[]>> => {
		return api.get('/places/cities');
	},

	// 获取评论列表
	getComments: (placeId: string, params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Comment>> => {
		return api.get(`/places/${placeId}/comments`, { params });
	},

	// 添加评论
	addComment: (placeId: string, data: { content: string; rating?: number }): Promise<ApiResponse<Comment>> => {
		return api.post(`/places/${placeId}/comments`, data);
	},

	// 添加评分
	addRating: (placeId: string, rating: number): Promise<ApiResponse<null>> => {
		return api.post(`/places/${placeId}/rating`, { rating });
	},
};

export const authApi = {
	// 钱包登录
	login: (data: { walletAddress: string; signature?: string; message?: string; walletType?: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
		return api.post('/auth/login', data);
	},

	// 获取用户信息
	getMe: (): Promise<ApiResponse<User>> => {
		return api.get('/auth/me');
	},

	// 更新用户信息
	updateMe: (data: { username?: string; avatar?: string; email?: string }): Promise<ApiResponse<User>> => {
		return api.put('/auth/me', data);
	},
};

export const adminApi = {
	// 获取所有聚集地（管理员）
	getAllPlaces: (params?: { page?: number; limit?: number; status?: string; type?: string; search?: string }): Promise<PaginatedResponse<Place>> => {
		return api.get('/admin/places', { params });
	},

	// 创建聚集地
	createPlace: (data: Partial<Place>): Promise<ApiResponse<Place>> => {
		return api.post('/admin/places', data);
	},

	// 更新聚集地
	updatePlace: (id: string, data: Partial<Place>): Promise<ApiResponse<Place>> => {
		return api.put(`/admin/places/${id}`, data);
	},

	// 删除聚集地
	deletePlace: (id: string): Promise<ApiResponse<null>> => {
		return api.delete(`/admin/places/${id}`);
	},

	// 批量更新状态
	batchUpdateStatus: (ids: string[], status: string): Promise<ApiResponse<null>> => {
		return api.patch('/admin/places/batch-status', { ids, status });
	},

	// 获取统计数据
	getStats: (): Promise<ApiResponse<Record<string, unknown>>> => {
		return api.get('/admin/stats');
	},

	// 获取聚集地状态统计
	getPlaceStats: (): Promise<ApiResponse<PlaceStatItem[]>> => {
		return api.get('/admin/place-stats');
	},

	// 用户管理API
	getAllUsers: (params?: { page?: number; limit?: number; role?: string; search?: string }): Promise<PaginatedResponse<User>> => {
		return api.get('/admin/users', { params });
	},

	// 删除用户
	deleteUser: (id: string): Promise<ApiResponse<null>> => {
		return api.delete(`/admin/users/${id}`);
	},

	// 批量更新用户角色
	batchUpdateUserRole: (ids: string[], role: string): Promise<ApiResponse<null>> => {
		return api.patch('/admin/users/batch-role', { ids, role });
	},

	// 获取单个用户详情
	getUserById: (id: string): Promise<ApiResponse<User>> => {
		return api.get(`/admin/users/${id}`);
	},

	// 更新用户信息
	updateUser: (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
		return api.put(`/admin/users/${id}`, data);
	},

	// 获取用户统计数据
	getUserStats: (): Promise<ApiResponse<Record<string, unknown>>> => {
		return api.get('/admin/user-stats');
	},
};

export default api;