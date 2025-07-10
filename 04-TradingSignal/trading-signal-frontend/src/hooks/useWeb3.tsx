/** @jsxImportSource react */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthAPI } from "@/services/authAPI/api";
import type { OKXWalletProvider, EthereumProvider } from "@/types/wallet";
import { setSessionItem } from "@/utils/storage";

// 扩展 Window 接口以包含钱包提供程序
declare global {
	interface Window {
		ethereum?: EthereumProvider;
		okxwallet?: OKXWalletProvider;
		phantom?: {
			solana?: any;
		};
	}
}

// Constants
const CONNECTED_WALLET_KEY = "connected_wallet";

// Types
export type WalletType = "okx" | "metamask" | "phantom";
export type ChainType = "ethereum" | "aptos" | "solana" | "flow" | "bsc";

export interface WalletInfo {
	address: string;
	publicKey?: string;
	walletType: WalletType;
	chainType: ChainType;
	isConnected: boolean;
}

interface Web3ContextType {
	wallet: WalletInfo | null;
	isConnecting: boolean;
	error: string | null;
	connectWallet: (walletType: WalletType, chainType: ChainType) => Promise<WalletInfo>;
	disconnectWallet: () => void;
	switchChain: (chainType: ChainType) => Promise<boolean>;
	getBalance: () => Promise<string>;
	checkWalletConnection: () => Promise<void>;
	walletBindingStatus?: WalletBindingStatus;
	checkWalletBinding: (address: string, chainType: ChainType) => Promise<WalletBindingStatus>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Helper functions
const getWalletProvider = (walletType: WalletType): any => {
	switch (walletType) {
		case "okx":
			return window.okxwallet;
		case "metamask":
			return window.ethereum;
		case "phantom":
			return window.phantom?.solana;
		default:
			return null;
	}
};

const getWalletAddress = async (
	walletType: WalletType,
	chainType: ChainType
): Promise<{ address: string; publicKey?: string }> => {
	const provider = getWalletProvider(walletType);

	if (!provider) {
		throw new Error(`${walletType} wallet not installed`);
	}

	try {
		// OKX 钱包处理
		if (walletType === "okx") {
			if (chainType === "aptos") {
				const accounts = await provider.aptos.account();
				return { address: accounts.address, publicKey: accounts.publicKey };
			} else if (chainType === "flow") {
				// OKX钱包通过EVM支持Flow
				// 首先切换到Flow EVM网络
				try {
					await provider.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: "0x2EB" }], // 747 in hex
					});
				} catch (switchError: any) {
					// 如果网络不存在，添加网络
					if (switchError.code === 4902) {
						await provider.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x2EB", // 747 in hex
									chainName: "Flow EVM Mainnet",
									nativeCurrency: {
										name: "FLOW",
										symbol: "FLOW",
										decimals: 18,
									},
									rpcUrls: ["https://mainnet.evm.nodes.onflow.org"],
									blockExplorerUrls: ["https://evm.flowscan.io"],
								},
							],
						});
					} else {
						throw switchError;
					}
				}

				// 获取账户地址
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				return { address: accounts[0] };
			} else if (chainType === "solana") {
				const accounts = await (provider as any).solana.connect();
				return { address: accounts.publicKey.toString() };
			} else if (chainType === "bsc") {
				// BSC网络
				try {
					await provider.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: "0x38" }], // 56 in hex
					});
				} catch (switchError: any) {
					// 如果网络不存在，添加网络
					if (switchError.code === 4902) {
						await provider.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x38", // 56 in hex
									chainName: "BNB Smart Chain",
									nativeCurrency: {
										name: "BNB",
										symbol: "BNB",
										decimals: 18,
									},
									rpcUrls: ["https://bsc-dataseed.binance.org/"],
									blockExplorerUrls: ["https://bscscan.com"],
								},
							],
						});
					} else {
						throw switchError;
					}
				}
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				return { address: accounts[0] };
			} else {
				// 以太坊链
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				return { address: accounts[0] };
			}
		}

		// MetaMask 钱包处理 (支持以太坊链和Flow链)
		if (walletType === "metamask") {
			if (chainType === "ethereum") {
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				return { address: accounts[0] };
			} else if (chainType === "flow") {
				// MetaMask通过EVM支持Flow
				// 首先切换到Flow EVM网络
				try {
					await provider.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: "0x2EB" }], // 747 in hex
					});
				} catch (switchError: any) {
					// 如果网络不存在，添加网络
					if (switchError.code === 4902) {
						await provider.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x2EB", // 747 in hex
									chainName: "Flow EVM Mainnet",
									nativeCurrency: {
										name: "FLOW",
										symbol: "FLOW",
										decimals: 18,
									},
									rpcUrls: ["https://mainnet.evm.nodes.onflow.org"],
									blockExplorerUrls: ["https://evm.flowscan.io"],
								},
							],
						});
					} else {
						throw switchError;
					}
				}

				// 获取账户地址
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				return { address: accounts[0] };
			} else if (chainType === "bsc") {
				// MetaMask支持BSC
				try {
					await provider.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: "0x38" }], // 56 in hex
					});
				} catch (switchError: any) {
					// 如果网络不存在，添加网络
					if (switchError.code === 4902) {
						await provider.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: "0x38", // 56 in hex
									chainName: "BNB Smart Chain",
									nativeCurrency: {
										name: "BNB",
										symbol: "BNB",
										decimals: 18,
									},
									rpcUrls: ["https://bsc-dataseed.binance.org/"],
									blockExplorerUrls: ["https://bscscan.com"],
								},
							],
						});
					} else {
						throw switchError;
					}
				}
				const accounts = await provider.request({ method: "eth_requestAccounts" });
				return { address: accounts[0] };
			} else {
				throw new Error(`MetaMask does not support ${chainType} chain`);
			}
		}

		// Phantom 钱包处理 (仅支持 Solana)
		if (walletType === "phantom") {
			if (chainType === "solana") {
				const accounts = await provider.connect();
				return { address: accounts.publicKey.toString() };
			} else {
				throw new Error(`Phantom wallet only supports Solana chain`);
			}
		}

		throw new Error(`Unsupported wallet type: ${walletType}`);
	} catch (error) {
		console.error("Error getting wallet address:", error);
		throw error;
	}
};

const saveWalletInfo = (walletInfo: WalletInfo) => {
	try {
		setSessionItem(CONNECTED_WALLET_KEY, JSON.stringify(walletInfo));
	} catch (error) {
		console.error("Error saving wallet info:", error);
	}
};

// 钱包绑定状态类型
export type WalletBindingStatus = "linkedToSelf" | "notLinked" | "linkedToOther" | null;

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [wallet, setWallet] = useState<WalletInfo | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [walletBindingStatus, setWalletBindingStatus] = useState<WalletBindingStatus>(null);

	// 监听账户变化
	useEffect(() => {
		const handleAccountsChanged = async (accounts: string[]) => {
			if (accounts.length === 0) {
				// 用户断开连接
				disconnectWallet();
			} else if (wallet && accounts[0] !== wallet.address) {
				// 账户切换
				const newWallet: WalletInfo = {
					...wallet,
					address: accounts[0],
				};
				setWallet(newWallet);
				saveWalletInfo(newWallet);
			}
		};

		const handleChainChanged = (chainId: string) => {
			// 链切换时重新加载页面
			window.location.reload();
		};

		const setupEventListeners = () => {
			if (window.ethereum) {
				window.ethereum.on("accountsChanged", handleAccountsChanged);
				window.ethereum.on("chainChanged", handleChainChanged);
			}
			if (window.okxwallet) {
				window.okxwallet.on("accountsChanged", handleAccountsChanged);
				window.okxwallet.on("chainChanged", handleChainChanged);
			}
		};

		const cleanupEventListeners = () => {
			if (window.ethereum) {
				window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
				window.ethereum.removeListener("chainChanged", handleChainChanged);
			}
			if (window.okxwallet) {
				window.okxwallet.removeListener("accountsChanged", handleAccountsChanged);
				window.okxwallet.removeListener("chainChanged", handleChainChanged);
			}
		};

		setupEventListeners();

		return () => {
			cleanupEventListeners();
		};
	}, [wallet]);

	// 初始化时检查已连接的钱包
	useEffect(() => {
		checkWalletConnection();
	}, []);

	const checkWalletConnection = async () => {
		try {
			const savedWalletInfo = sessionStorage.getItem(CONNECTED_WALLET_KEY);
			if (savedWalletInfo) {
				const walletInfo: WalletInfo = JSON.parse(savedWalletInfo);
				const provider = getWalletProvider(walletInfo.walletType);

				if (provider) {
					// 验证钱包是否仍然连接
					let isStillConnected = false;
					try {
						if (walletInfo.chainType === "solana" && walletInfo.walletType === "phantom") {
							isStillConnected = provider.isConnected;
						} else if (walletInfo.chainType === "aptos" && walletInfo.walletType === "okx") {
							isStillConnected = await provider.aptos.isConnected();
						} else {
							// EVM chains
							const accounts = await provider.request({ method: "eth_accounts" });
							isStillConnected = accounts.includes(walletInfo.address);
						}
					} catch (error) {
						console.error("Error checking wallet connection:", error);
						isStillConnected = false;
					}

					if (isStillConnected) {
						setWallet(walletInfo);
					} else {
						// 清除无效的连接信息
						sessionStorage.removeItem(CONNECTED_WALLET_KEY);
					}
				}
			}
		} catch (error) {
			console.error("Error checking wallet connection:", error);
		}
	};

	const connectWallet = async (walletType: WalletType, chainType: ChainType): Promise<WalletInfo> => {
		setIsConnecting(true);
		setError(null);

		try {
			const { address, publicKey } = await getWalletAddress(walletType, chainType);

			const walletInfo: WalletInfo = {
				address,
				publicKey,
				walletType,
				chainType,
				isConnected: true,
			};

			setWallet(walletInfo);
			saveWalletInfo(walletInfo);

			return walletInfo;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
			setError(errorMessage);
			throw error;
		} finally {
			setIsConnecting(false);
		}
	};

	const disconnectWallet = () => {
		setWallet(null);
		sessionStorage.removeItem(CONNECTED_WALLET_KEY);
	};

	const switchChain = async (chainType: ChainType): Promise<boolean> => {
		if (!wallet) {
			throw new Error("No wallet connected");
		}

		try {
			await getWalletAddress(wallet.walletType, chainType);
			const newWallet: WalletInfo = {
				...wallet,
				chainType,
			};
			setWallet(newWallet);
			saveWalletInfo(newWallet);
			return true;
		} catch (error) {
			console.error("Error switching chain:", error);
			return false;
		}
	};

	const getBalance = async (): Promise<string> => {
		if (!wallet) {
			throw new Error("No wallet connected");
		}

		const provider = getWalletProvider(wallet.walletType);
		if (!provider) {
			throw new Error("Wallet provider not found");
		}

		try {
			if (wallet.chainType === "solana") {
				// Solana balance
				const balance = await provider.getBalance(wallet.address);
				return (balance / 1000000000).toString(); // Convert lamports to SOL
			} else if (wallet.chainType === "aptos") {
				// Aptos balance - would need specific implementation
				return "0";
			} else {
				// EVM chains
				const balance = await provider.request({
					method: "eth_getBalance",
					params: [wallet.address, "latest"],
				});
				// Convert from Wei to Ether
				const balanceInEther = parseInt(balance, 16) / Math.pow(10, 18);
				return balanceInEther.toString();
			}
		} catch (error) {
			console.error("Error getting balance:", error);
			throw error;
		}
	};

	const checkWalletBinding = async (address: string, chainType: ChainType): Promise<WalletBindingStatus> => {
		try {
			const response = await AuthAPI.checkWalletBinding(address, chainType);
			const status: WalletBindingStatus = response.status;
			setWalletBindingStatus(status);
			return status;
		} catch (error: any) {
			console.error("Error checking wallet binding:", error);
			// 如果是401错误（未登录），返回notLinked而不是抛出错误
			if (error?.response?.status === 401) {
				const status: WalletBindingStatus = "notLinked";
				setWalletBindingStatus(status);
				return status;
			}
			throw error;
		}
	};

	const value: Web3ContextType = {
		wallet,
		isConnecting,
		error,
		connectWallet,
		disconnectWallet,
		switchChain,
		getBalance,
		checkWalletConnection,
		walletBindingStatus,
		checkWalletBinding,
	};

	return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
	const context = useContext(Web3Context);
	if (context === undefined) {
		throw new Error("useWeb3 must be used within a Web3Provider");
	}
	return context;
}; 