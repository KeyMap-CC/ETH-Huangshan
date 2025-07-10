import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
	// 基本信息
	name: { type: String, required: true, index: true }, // 聚集地名称
	type: { type: String, enum: ['gathering', 'event'], default: 'gathering' }, // 类型：聚集地/活动场地
	status: { 
		type: String, 
		enum: ['内测中', '疑似关闭', '已关闭', '开放中'], 
		default: '开放中' 
	}, // 状态
	solgan: String, // 标语
	cover: String, // 宣传图
	
	// 新增字段 - 从CSV导入
	tags: [String], // 标签，如：大草坪、海景、过冬等
	roomTypes: [String], // 可订房型，如：单人间、双人间、四人间等
	openingTime: Date, // 开业时间
	officialAccount: String, // 公众号
	xiaohongshu: String, // 小红书
	relatedLinks: String, // 相关链接
	bookingMethod: String, // 预定方式
	notes: String, // 备注
	
	// 地理位置
	location: { type: String, required: true }, // 详细地址
	coordinates: {
		type: { type: String, default: 'Point' },
		coordinates: { 
			type: [Number], 
			default: undefined,
			validate: {
				validator: function(coords: number[]) {
					return !coords || (Array.isArray(coords) && coords.length === 2 && 
						typeof coords[0] === 'number' && typeof coords[1] === 'number');
				},
				message: '坐标必须是包含两个数字的数组 [经度, 纬度]'
			}
		}
	},
	city: String, // 城市
	
	// 费用信息
	cost: String, // 费用描述
	priceRange: {
		min: Number,
		max: Number,
		currency: { type: String, default: 'CNY' }
	},
	
	// 容量信息
	capacity: {
		rooms: Number, // 剩余房间数（聚集地）
		maxPeople: Number, // 可容纳人数（活动场地）
		currentPeople: Number // 当前人数
	},
	
	// 详细信息
	investor: String, // 投资方和运营方
	tour: String, // 旅游和休闲
	convenience: String, // 生活便利性
	scale: String, // 社群规模
	atmosphere: String, // 氛围
	workEnv: String, // 工作环境
	wechat: String, // 公众号
	
	// 统计数据
	stats: {
		views: { type: Number, default: 0 }, // 浏览量
		comments: { type: Number, default: 0 }, // 评论数
		searches: { type: Number, default: 0 }, // 搜索量
		rating: { type: Number, default: 0 }, // 评分
		ratingCount: { type: Number, default: 0 } // 评分人数
	},
	
	// 评论
	comments: [{
		avatar: String,
		user: String,
		time: String,
		content: String,
		rating: { type: Number, min: 1, max: 5 }
	}],
	
	// 元数据
	htmlFile: String, // 原始HTML文件名
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
}, {
	timestamps: true
});

// 创建地理空间索引
placeSchema.index({ coordinates: '2dsphere' });
placeSchema.index({ name: 'text', location: 'text' });

export const Place = mongoose.model('Place', placeSchema, 'places'); 