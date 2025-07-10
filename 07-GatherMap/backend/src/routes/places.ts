import express, { Request, Response } from 'express';
import { Place } from '../models/Place';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
import { authenticateToken } from './auth';

const router = express.Router();

// 获取聚集地列表
router.get('/list', async (req: Request, res: Response): Promise<void> => {
	try {
		const { 
			type, 
			status, 
			city, 
			search, 
			page = 1, 
			limit = 20,
			lng,
			lat,
			radius = 50 // 搜索半径（公里）
		} = req.query;

		const query: any = {};

		// 类型筛选
		if (type) {
			query.type = type;
		}

		// 状态筛选
		if (status) {
			query.status = status;
		}

		// 城市筛选
		if (city) {
			query.city = new RegExp(city as string, 'i');
		}

		// 文本搜索
		if (search) {
			query.$text = { $search: search as string };
		}

		// 地理位置搜索
		if (lng && lat) {
			query.coordinates = {
				$near: {
					$geometry: {
						type: 'Point',
						coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
					},
					$maxDistance: parseFloat(radius as string) * 1000 // 转换为米
				}
			};
		}

		const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

		const places = await Place.find(query)
			.select('name type status location city cost capacity stats cover coordinates')
			.skip(skip)
			.limit(parseInt(limit as string))
			.sort({ 'stats.views': -1, createdAt: -1 });

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

// 获取所有城市列表
router.get('/cities', async (req: Request, res: Response): Promise<void> => {
	try {
		// 获取所有不重复的城市名称
		const cities = await Place.distinct('city', { $and: [{ city: { $ne: null } }, { city: { $ne: '' } }] });
		
		// 过滤掉空值并排序
		const filteredCities = cities
			.filter(city => city && city.trim() !== '')
			.sort();

		res.json({ success: true, data: filteredCities });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 获取热门聚集地
router.get('/popular', async (req: Request, res: Response): Promise<void> => {
	try {
		const { limit = 10 } = req.query;

		const places = await Place.find({ status: '开放中' })
			.select('name type status location city cost capacity stats cover coordinates')
			.sort({ 'stats.views': -1, 'stats.rating': -1 })
			.limit(parseInt(limit as string));

		res.json({ success: true, data: places });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 搜索聚集地
router.get('/search', async (req: Request, res: Response): Promise<void> => {
	try {
		const { keyword, page = 1, limit = 10 } = req.query;

		if (!keyword) {
			res.status(400).json({ success: false, message: '搜索关键词不能为空' });
			return;
		}

		const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

		const places = await Place.find({
			$or: [
				{ name: new RegExp(keyword as string, 'i') },
				{ location: new RegExp(keyword as string, 'i') },
				{ city: new RegExp(keyword as string, 'i') }
			]
		})
			.select('name type status location city cost capacity stats cover coordinates')
			.skip(skip)
			.limit(parseInt(limit as string))
			.sort({ 'stats.views': -1 });

		const total = await Place.countDocuments({
			$or: [
				{ name: new RegExp(keyword as string, 'i') },
				{ location: new RegExp(keyword as string, 'i') },
				{ city: new RegExp(keyword as string, 'i') }
			]
		});

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

// 获取聚集地详情
router.get('/detail/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const place = await Place.findById(id);

		if (!place) {
			res.status(404).json({ success: false, message: '聚集地不存在' });
			return;
		}

		// 增加浏览量
		await Place.findByIdAndUpdate(id, { $inc: { 'stats.views': 1 } });

		// 获取评论列表
		const comments = await Comment.find({ 
			placeId: id, 
			status: 'approved' 
		})
			.populate('userId', 'username avatar walletAddress')
			.sort({ createdAt: -1 })
			.limit(10);

		// 格式化评论数据
		const formattedComments = comments.map(comment => ({
			_id: comment._id,
			content: comment.content,
			rating: comment.rating,
			user: comment.userInfo?.username || (comment.userId as any)?.username || '匿名用户',
			avatar: comment.userInfo?.avatar || (comment.userId as any)?.avatar || '',
			time: comment.createdAt,
			stats: comment.stats
		}));

		// 计算平均评分
		const ratingStats = await Comment.aggregate([
			{ $match: { placeId: place._id, status: 'approved', rating: { $exists: true, $ne: null } } },
			{
				$group: {
					_id: null,
					averageRating: { $avg: '$rating' },
					totalRatings: { $sum: 1 }
				}
			}
		]);

		const placeWithComments = {
			...place.toObject(),
			comments: formattedComments,
			stats: {
				...place.stats,
				rating: ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
				ratingCount: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0
			}
		};

		res.json({ success: true, data: placeWithComments });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 获取评论列表
router.get('/:id/comments', async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const { page = 1, limit = 20 } = req.query;

		const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

		const comments = await Comment.find({ 
			placeId: id, 
			status: 'approved' 
		})
			.populate('userId', 'username avatar walletAddress')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(parseInt(limit as string));

		const total = await Comment.countDocuments({ placeId: id, status: 'approved' });

		// 格式化评论数据
		const formattedComments = comments.map(comment => ({
			_id: comment._id,
			content: comment.content,
			rating: comment.rating,
			user: comment.userInfo?.username || (comment.userId as any)?.username || '匿名用户',
			avatar: comment.userInfo?.avatar || (comment.userId as any)?.avatar || '',
			time: comment.createdAt,
			stats: comment.stats
		}));

		res.json({
			success: true,
			data: formattedComments,
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

// 添加评论（需要登录）
router.post('/:id/comments', authenticateToken, async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const { content, rating } = req.body;
		const userId = (req as any).user.userId;

		// 验证聚集地是否存在
		const place = await Place.findById(id);
		if (!place) {
			res.status(404).json({ success: false, message: '聚集地不存在' });
			return;
		}

		// 验证评论内容
		if (!content || content.trim().length === 0) {
			res.status(400).json({ success: false, message: '评论内容不能为空' });
			return;
		}

		if (content.length > 500) {
			res.status(400).json({ success: false, message: '评论内容不能超过500字' });
			return;
		}

		// 验证评分
		if (rating && (rating < 1 || rating > 5)) {
			res.status(400).json({ success: false, message: '评分必须在1-5之间' });
			return;
		}

		// 获取用户信息
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ success: false, message: '用户不存在' });
			return;
		}

		// 检查是否已经评论过
		const existingComment = await Comment.findOne({ placeId: id, userId });
		if (existingComment) {
			res.status(400).json({ success: false, message: '您已经评论过这个聚集地了' });
			return;
		}

		// 创建评论
		const comment = new Comment({
			placeId: id,
			userId,
			content: content.trim(),
			rating,
			userInfo: {
				username: user.username,
				avatar: user.avatar,
				walletAddress: user.walletAddress
			}
		});

		await comment.save();

		// 更新聚集地评论数
		await Place.findByIdAndUpdate(id, { $inc: { 'stats.comments': 1 } });

		// 更新用户评论数
		await User.findByIdAndUpdate(userId, { $inc: { 'stats.commentsCount': 1 } });

		res.json({ 
			success: true, 
			message: '评论发布成功',
			data: {
				_id: comment._id,
				content: comment.content,
				rating: comment.rating,
				user: user.username,
				avatar: user.avatar,
				time: comment.createdAt,
				stats: comment.stats
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 添加评分（需要登录）
router.post('/:id/rating', authenticateToken, async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const { rating } = req.body;
		const userId = (req as any).user.userId;

		// 验证聚集地是否存在
		const place = await Place.findById(id);
		if (!place) {
			res.status(404).json({ success: false, message: '聚集地不存在' });
			return;
		}

		// 验证评分
		if (!rating || rating < 1 || rating > 5) {
			res.status(400).json({ success: false, message: '评分必须在1-5之间' });
			return;
		}

		// 检查是否已经评分过
		const existingRating = await Comment.findOne({ placeId: id, userId, rating: { $exists: true, $ne: null } });
		if (existingRating) {
			// 更新现有评分
			existingRating.rating = rating;
			await existingRating.save();
		} else {
			// 创建新的评分记录
			const user = await User.findById(userId);
			const ratingComment = new Comment({
				placeId: id,
				userId,
				rating,
				content: '', // 评分可以没有评论内容
				userInfo: {
					username: user?.username || '匿名用户',
					avatar: user?.avatar || '',
					walletAddress: user?.walletAddress || ''
				}
			});
			await ratingComment.save();
		}

		res.json({ success: true, message: '评分提交成功' });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

export default router;