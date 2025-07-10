import axios, { AxiosResponse } from "axios";

// 统一认证服务配置
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:3001";

class AuthService {
	private baseURL: string;
	private axios: any;

	constructor() {
		this.baseURL = `${AUTH_SERVICE_URL}/auth`;
		this.axios = axios.create({
			baseURL: this.baseURL,
			withCredentials: true,
			timeout: 10000,
		});

		// 请求拦截器 - 自动添加token
		this.axios.interceptors.request.use((config: any) => {
			const token = this.getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		// 响应拦截器 - 处理token过期
		this.axios.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error: any) => {
				if (error.response?.status === 401) {
					// Token过期，尝试刷新
					const refreshToken = this.getRefreshToken();
					if (refreshToken) {
						try {
							const refreshResponse = await this.refreshToken(refreshToken);
							this.setToken(refreshResponse.accessToken);
							this.setRefreshToken(refreshResponse.refreshToken);

							// 重试原请求
							const originalRequest = error.config;
							originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
							return this.axios(originalRequest);
						} catch (refreshError) {
							// 刷新失败，清除所有认证信息
							this.logout();
							window.location.href = "/login";
						}
					} else {
						// 没有refresh token，直接登出
						this.logout();
						window.location.href = "/login";
					}
				}
				return Promise.reject(error);
			}
		);
	}

	// 获取当前用户信息
	async getCurrentUser() {
		try {
			const response = await this.axios.get("/me");
			return response.data;
		} catch (error) {
			console.error("获取用户信息失败:", error);
			throw error;
		}
	}

	// 验证跨域会话
	async validateSession(sessionToken?: string) {
		try {
			const url = sessionToken ? `/session/validate?sessionToken=${sessionToken}` : "/session/validate";
			const response = await this.axios.get(url);
			return response.data;
		} catch (error) {
			console.error("会话验证失败:", error);
			throw error;
		}
	}

	// Google登录
	async loginWithGoogle() {
		const currentOrigin = window.location.origin;
		const returnUrl = window.location.pathname;
		window.location.href = `${this.baseURL}/google?origin=${encodeURIComponent(currentOrigin)}&returnUrl=${encodeURIComponent(returnUrl)}`;
	}

	// Telegram登录
	async loginWithTelegram(telegramData: any) {
		try {
			const response = await this.axios.post("/telegram", telegramData);
			const { token, refreshToken, user, identity } = response.data;

			this.setToken(token);
			this.setRefreshToken(refreshToken);

			return { token, user, identity };
		} catch (error) {
			console.error("Telegram登录失败:", error);
			throw error;
		}
	}

	// 钱包登录 - 获取nonce
	async getWalletNonce(address: string, chain: string = "ethereum") {
		try {
			const response = await this.axios.get(`/wallet/nonce?address=${address}&chain=${chain}`);
			return response.data;
		} catch (error) {
			console.error("获取nonce失败:", error);
			throw error;
		}
	}

	// 钱包登录 - 验证签名
	async verifyWalletSignature(
		address: string,
		pubKey: string,
		signature: string,
		walletType: string,
		chain: string,
		nonce: string
	) {
		try {
			const response = await this.axios.post("/wallet/verify", {
				address,
				pubKey,
				signature,
				walletType,
				chain,
				nonce,
			});

			const { token, refreshToken, user, identity, bound } = response.data;

			if (token) {
				this.setToken(token);
			}
			if (refreshToken) {
				this.setRefreshToken(refreshToken);
			}

			return { token, user, identity, bound };
		} catch (error) {
			console.error("钱包签名验证失败:", error);
			throw error;
		}
	}

	// 刷新token
	async refreshToken(refreshToken: string) {
		try {
			const response = await this.axios.post("/refresh", { refreshToken });
			return response.data;
		} catch (error) {
			console.error("Token刷新失败:", error);
			throw error;
		}
	}

	// 注销
	async logout() {
		try {
			await this.axios.post("/logout");
		} catch (error) {
			console.error("注销请求失败:", error);
		} finally {
			// 无论请求是否成功，都清除本地存储
			this.clearTokens();
		}
	}

	// SSO登录到其他平台
	async ssoLoginToPlatform(platform: string, returnUrl?: string) {
		try {
			const params = new URLSearchParams({ platform });
			if (returnUrl) {
				params.append("returnUrl", returnUrl);
			}

			const response = await this.axios.get(`/sso/login?${params.toString()}`);
			const { redirectUrl } = response.data;

			// 跳转到SSO登录页面
			window.location.href = redirectUrl;
		} catch (error) {
			console.error("SSO登录失败:", error);
			throw error;
		}
	}

	// 处理SSO回调
	async handleSSOCallback(token: string, platform?: string) {
		try {
			const params = new URLSearchParams({ token });
			if (platform) {
				params.append("platform", platform);
			}

			const response = await this.axios.get(`/sso/callback?${params.toString()}`);
			const { user, token: accessToken, refreshToken } = response.data;

			this.setToken(accessToken);
			if (refreshToken) {
				this.setRefreshToken(refreshToken);
			}

			return { user, token: accessToken };
		} catch (error) {
			console.error("SSO回调处理失败:", error);
			throw error;
		}
	}

	// Token管理
	setToken(token: string) {
		localStorage.setItem("ts_token", token);
	}

	getToken(): string | null {
		return localStorage.getItem("ts_token");
	}

	setRefreshToken(token: string) {
		localStorage.setItem("ts_refresh_token", token);
	}

	getRefreshToken(): string | null {
		return localStorage.getItem("ts_refresh_token");
	}

	clearTokens() {
		localStorage.removeItem("ts_token");
		localStorage.removeItem("ts_refresh_token");
		localStorage.removeItem("ts_user_info");
	}

	// 检查是否已登录
	isAuthenticated(): boolean {
		return !!this.getToken();
	}

	// 从其他平台导入session（SSO功能）
	async importSessionFromPlatform(platform: "tf" | "tn") {
		try {
			// 跳转到认证服务的SSO端点
			const currentUrl = window.location.href;
			window.location.href = `${AUTH_SERVICE_URL}/auth/sso/ts?returnUrl=${encodeURIComponent(currentUrl)}&from=${platform}`;
		} catch (error) {
			console.error("导入会话失败:", error);
			throw error;
		}
	}
}

export const authService = new AuthService();
export default authService; 