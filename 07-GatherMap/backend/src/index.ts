import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 导入模型（确保模型被注册）
import './models/Place';
import './models/User';
import './models/Comment';

// 导入路由
import placesRouter from './routes/places';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dnbase';

mongoose.connect(MONGO_URI)
	.then(() => console.log('MongoDB 连接成功'))
	.catch(err => console.error('MongoDB 连接失败', err));

// 路由
app.use('/api/places', placesRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// 健康检查
app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 根路径
app.get('/', (req: Request, res: Response) => {
	res.json({ 
		message: 'GatherMap 后端 API',
		version: '1.0.0',
		endpoints: {
			places: '/api/places',
			auth: '/api/auth',
			admin: '/api/admin'
		}
	});
});

// 错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ success: false, message: '服务器内部错误' });
});

// 404处理
app.use('*', (req: Request, res: Response) => {
	res.status(404).json({ success: false, message: '接口不存在' });
});

app.listen(PORT, () => {
	console.log(`服务器已启动，端口：${PORT}`);
	console.log(`API文档：http://localhost:${PORT}`);
}); 