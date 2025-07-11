import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	// 关联信息
	placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true }, // 聚集地ID
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 用户ID（可选，支持匿名评论）
	
	// 评论内容
	content: { type: String, required: true }, // 评论内容
	rating: { type: Number, min: 1, max: 5 }, // 评分
	
	// 用户信息（冗余存储，避免关联查询）
	userInfo: {
		username: String,
		avatar: String,
		walletAddress: String
	},
	
	// 状态
	status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }, // 评论状态
	
	// 统计数据
	stats: {
		likes: { type: Number, default: 0 }, // 点赞数
		replies: { type: Number, default: 0 } // 回复数
	},
	
	// 元数据
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
}, {
	timestamps: true
});

// 创建索引
commentSchema.index({ placeId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ status: 1 });

export const Comment = mongoose.model('Comment', commentSchema, 'comments'); 