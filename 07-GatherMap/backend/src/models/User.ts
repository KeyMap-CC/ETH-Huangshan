import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	// 钱包信息
	walletAddress: { type: String, required: true, unique: true }, // 钱包地址
	walletType: { type: String, default: 'metamask' }, // 钱包类型
	
	// 用户信息
	username: String, // 用户名
	avatar: String, // 头像
	email: String, // 邮箱
	
	// 角色权限
	role: { type: String, enum: ['user', 'admin'], default: 'user' }, // 用户角色
	
	// 统计数据
	stats: {
		placesVisited: { type: Number, default: 0 }, // 访问过的聚集地数量
		commentsCount: { type: Number, default: 0 }, // 评论数量
		lastActive: { type: Date, default: Date.now } // 最后活跃时间
	},
	
	// 收藏
	favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }], // 收藏的聚集地
	
	// 元数据
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
}, {
	timestamps: true
});

// 创建索引
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema, 'users'); 