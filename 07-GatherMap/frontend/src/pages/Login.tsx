import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../services/api';
import { authApi } from '../services/api';

interface LoginProps {
	setUser: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleMetamaskLogin = async () => {
		try {
			setLoading(true);
			setError('');

			// 检查是否安装了MetaMask
			if (typeof window.ethereum === 'undefined') {
				setError('请先安装MetaMask钱包');
				return;
			}

			// 请求连接钱包
			const accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});

			if (accounts.length === 0) {
				setError('请连接MetaMask钱包');
				return;
			}

			const walletAddress = accounts[0];

			// 生成随机消息用于签名
			const message = `GatherMap登录验证\n时间: ${new Date().toISOString()}\n随机数: ${Math.random().toString(36).substring(2)}`;

			// 请求签名
			const signature = await window.ethereum.request({
				method: 'personal_sign',
				params: [message, walletAddress],
			});

			// 调用后端登录API
			const response = await authApi.login({
				walletAddress,
				signature,
				message,
				walletType: 'metamask',
			});

			// 保存token和用户信息
			localStorage.setItem('token', response.data.token);
			setUser(response.data.user);

			// 跳转到首页
			navigate('/');
		} catch (error: unknown) {
			console.error('登录失败:', error);
			const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-full py-8 sm:py-12 px-4">
			<div className="max-w-md w-full animate-fade-in">
				<div className="card-glass text-center">
					{/* Logo和标题 */}
					<div className="mb-6 sm:mb-8">
						<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-mint-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-3 sm:mb-4 shadow-lg float-animation">
							🌍
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">数字游民大本营</h1>
						<p className="text-sm sm:text-base text-muted">使用小狐狸钱包登录</p>
					</div>

					{/* 错误提示 */}
					{error && (
						<div className="bg-rose-50/80 backdrop-blur-sm border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 animate-bounce-in">
							{error}
						</div>
					)}

					{/* 登录按钮 */}
					<button
						onClick={handleMetamaskLogin}
						disabled={loading}
						className="w-full btn-primary text-base sm:text-lg py-3 sm:py-4 flex items-center justify-center space-x-2 sm:space-x-3 mb-6"
					>
						{loading ? (
							<>
								<div className="loading-spinner"></div>
								<span>连接中...</span>
							</>
						) : (
							<>
								<span className="text-xl sm:text-2xl">🦊</span>
								<span>连接MetaMask</span>
							</>
						)}
					</button>

					{/* 帮助信息 */}
					<div className="mb-6 sm:mb-8">
						<p className="text-xs sm:text-sm text-muted">
							还没有MetaMask钱包？
							<a
								href="https://metamask.io/download/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary-600 hover:text-primary-700 ml-1 transition-colors duration-200"
							>
								立即下载
							</a>
						</p>
					</div>

					{/* 返回按钮 */}
					<div className="pt-6 border-t border-gray-200/50">
						<button
							onClick={() => navigate('/')}
							className="text-muted hover:text-gray-700 text-sm transition-colors duration-200"
						>
							← 返回首页
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login; 