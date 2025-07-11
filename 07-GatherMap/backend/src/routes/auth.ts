import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 扩展Request接口以包含user属性
interface AuthenticatedRequest extends Request {
	user?: {
		userId: string;
		walletAddress: string;
		role: string;
	};
}

// 钱包登录
router.post('/login', async (req: Request, res: Response): Promise<void> => {
	try {
		const { walletAddress, signature, message, walletType = 'metamask' } = req.body;

		if (!walletAddress) {
			res.status(400).json({ success: false, message: '钱包地址不能为空' });
			return;
		}

		// 验证签名（这里简化处理，实际应该验证签名）
		// const isValidSignature = verifySignature(message, signature, walletAddress);
		// if (!isValidSignature) {
		// 	res.status(401).json({ success: false, message: '签名验证失败' });
		// 	return;
		// }

		// 查找或创建用户
		let user = await User.findOne({ walletAddress });

		if (!user) {
			// 创建新用户
			user = new User({
				walletAddress,
				walletType,
				username: `User_${walletAddress.slice(2, 8)}`, // 使用钱包地址前6位作为用户名
				role: 'user'
			});
			await user.save();
		} else {
			// 更新最后活跃时间
			if (user.stats) {
				user.stats.lastActive = new Date();
			}
			await user.save();
		}

		// 生成JWT token
		const token = jwt.sign(
			{ 
				userId: user._id, 
				walletAddress: user.walletAddress,
				role: user.role 
			},
			JWT_SECRET,
			{ expiresIn: '7d' }
		);

		res.json({
			success: true,
			data: {
				token,
				user: {
					id: user._id,
					walletAddress: user.walletAddress,
					username: user.username,
					avatar: user.avatar,
					role: user.role
				}
			}
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

// 验证token中间件
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		res.status(401).json({ success: false, message: '访问令牌缺失' });
		return;
	}

	jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
		if (err) {
			res.status(403).json({ success: false, message: '访问令牌无效' });
			return;
		}
		req.user = user;
		next();
	});
};

// 管理员权限中间件
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
	if (req.user?.role !== 'admin') {
		res.status(403).json({ success: false, message: '需要管理员权限' });
		return;
	}
	next();
};

// 获取当前用户信息
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		const user = await User.findById(req.user?.userId).select('-__v');
		
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

// 更新用户信息
router.put('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
	try {
		const { username, avatar, email } = req.body;
		
		const user = await User.findByIdAndUpdate(
			req.user?.userId,
			{ username, avatar, email },
			{ new: true }
		).select('-__v');

		res.json({ success: true, data: user });
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		res.status(500).json({ success: false, message: '服务器错误', error: errorMessage });
	}
});

export default router; 