import express, { Request, Response } from 'express';
import { Place } from '../models/Place';
import { User } from '../models/User';
import { authenticateToken, requireAdmin } from './auth';

const router = express.Router();

// 所有管理员路由都需要认证和权限
router.use(authenticateToken);
router.use(requireAdmin);

// 获取所有聚集地（管理员）
router.get('/places', async (req: Request, res: Response): Promise<void> => {
	try {
		const { page = 1, limit = 20, status, type, search } = req.query;
		const query: any = {};

		if (status) query.status = status;
		if (type) query.type = type;
		
		// 添加搜索功能 - 按名称模糊匹配
		if (search) {
			query.name = { $regex: search, $options: 'i' };
		}

		const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

		const places = await Place.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit as string));

		const total = await Place.countDocuments(query);

		res.json({
			success: true,
			data: places,
			pagination: {
				page: parseInt(page as string),
				limit: parseInt(limit as string),
				total,
				pages: Math.ceil(total / parseInt(limit as string))
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 创建聚集地
router.post('/places', async (req: Request, res: Response): Promise<void> => {
	try {
		const placeData = req.body;
		
		// 验证必填字段
		if (!placeData.name || !placeData.location) {
			res.status(400).json({ success: false, message: '名称和地址为必填项' });
			return;
		}

		const place = new Place(placeData);
		await place.save();

		res.status(201).json({ success: true, data: place });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 批量更新聚集地状态 - 放在参数路由之前
router.patch('/places/batch-status', async (req: Request, res: Response): Promise<void> => {
	try {
		const { ids, status } = req.body;

		if (!ids || !Array.isArray(ids) || !status) {
			res.status(400).json({ success: false, message: '参数错误' });
			return;
		}

		const result = await Place.updateMany(
			{ _id: { $in: ids } },
			{ status }
		);

		res.json({ success: true, message: `成功更新 ${result.modifiedCount} 个聚集地` });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 更新聚集地
router.put('/places/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		const place = await Place.findByIdAndUpdate(id, updateData, { new: true });

		if (!place) {
			res.status(404).json({ success: false, message: '聚集地不存在' });
			return;
		}

		res.json({ success: true, data: place });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 删除聚集地
router.delete('/places/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const place = await Place.findByIdAndDelete(id);

		if (!place) {
			res.status(404).json({ success: false, message: '聚集地不存在' });
			return;
		}

		res.json({ success: true, message: '删除成功' });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 获取统计数据
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
	try {
		const totalPlaces = await Place.countDocuments();
		const activePlaces = await Place.countDocuments({ status: '开放中' });
		const gatheringPlaces = await Place.countDocuments({ type: 'gathering' });
		const eventPlaces = await Place.countDocuments({ type: 'event' });

		// 按城市统计
		const cityStats = await Place.aggregate([
			{ $group: { _id: '$city', count: { $sum: 1 } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 }
		]);

		res.json({
			success: true,
			data: {
				total: totalPlaces,
				active: activePlaces,
				gathering: gatheringPlaces,
				event: eventPlaces,
				cityStats
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 获取聚集地状态统计
router.get('/place-stats', async (req: Request, res: Response): Promise<void> => {
	try {
		const totalPlaces = await Place.countDocuments();
		const openPlaces = await Place.countDocuments({ status: '开放中' });
		const testingPlaces = await Place.countDocuments({ status: '内测中' });
		const suspectedClosedPlaces = await Place.countDocuments({ status: '疑似关闭' });
		const closedPlaces = await Place.countDocuments({ status: '已关闭' });

		res.json({
			success: true,
			data: [
				{ label: '总聚集地', value: totalPlaces, type: 'total' },
				{ label: '开放中', value: openPlaces, type: 'open' },
				{ label: '内测中', value: testingPlaces, type: 'testing' },
				{ label: '疑似关闭', value: suspectedClosedPlaces, type: 'suspected' },
				{ label: '已关闭', value: closedPlaces, type: 'closed' }
			]
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// ===== 用户管理接口 =====

// 获取所有用户（管理员）
router.get('/users', async (req: Request, res: Response): Promise<void> => {
	try {
		const { page = 1, limit = 20, role, search } = req.query;
		const query: any = {};

		if (role) query.role = role;
		
		// 添加搜索功能 - 按用户名或钱包地址模糊匹配
		if (search) {
			query.$or = [
				{ username: { $regex: search, $options: 'i' } },
				{ walletAddress: { $regex: search, $options: 'i' } }
			];
		}

		const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

		const users = await User.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit as string));

		const total = await User.countDocuments(query);

		res.json({
			success: true,
			data: users,
			pagination: {
				page: parseInt(page as string),
				limit: parseInt(limit as string),
				total,
				pages: Math.ceil(total / parseInt(limit as string))
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 获取单个用户详情
router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const user = await User.findById(id);

		if (!user) {
			res.status(404).json({ success: false, message: '用户不存在' });
			return;
		}

		res.json({ success: true, data: user });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 删除用户
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const user = await User.findById(id);

		if (!user) {
			res.status(404).json({ success: false, message: '用户不存在' });
			return;
		}

		// 不允许删除管理员
		if (user.role === 'admin') {
			res.status(403).json({ success: false, message: '不能删除管理员用户' });
			return;
		}

		await User.findByIdAndDelete(id);

		res.json({ success: true, message: '删除成功' });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 批量更新用户角色
router.patch('/users/batch-role', async (req: Request, res: Response): Promise<void> => {
	try {
		const { ids, role } = req.body;

		if (!ids || !Array.isArray(ids) || !role) {
			res.status(400).json({ success: false, message: '参数错误' });
			return;
		}

		if (!['user', 'admin'].includes(role)) {
			res.status(400).json({ success: false, message: '无效的角色类型' });
			return;
		}

		const result = await User.updateMany(
			{ _id: { $in: ids } },
			{ role }
		);

		res.json({ success: true, message: `成功更新 ${result.modifiedCount} 个用户的角色为 ${role}` });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 更新用户信息
router.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const updateData = req.body;

		// 移除不允许通过此接口更新的字段
		delete updateData.walletAddress;
		delete updateData.createdAt;

		const user = await User.findByIdAndUpdate(id, updateData, { new: true });

		if (!user) {
			res.status(404).json({ success: false, message: '用户不存在' });
			return;
		}

		res.json({ success: true, data: user });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 获取用户统计数据
router.get('/user-stats', async (req: Request, res: Response): Promise<void> => {
	try {
		const totalUsers = await User.countDocuments();
		const adminUsers = await User.countDocuments({ role: 'admin' });
		const normalUsers = await User.countDocuments({ role: 'user' });

		// 按注册时间统计（最近30天每天的注册数）
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const dailyRegistrations = await User.aggregate([
			{
				$match: {
					createdAt: { $gte: thirtyDaysAgo }
				}
			},
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
					},
					count: { $sum: 1 }
				}
			},
			{ $sort: { _id: 1 } }
		]);

		res.json({
			success: true,
			data: {
				total: totalUsers,
				admin: adminUsers,
				normal: normalUsers,
				dailyRegistrations
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

export default router;