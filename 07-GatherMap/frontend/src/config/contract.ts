// 合约配置
export const CONTRACT_CONFIG = {
	// Flow EVM Testnet 配置
	FLOW_TESTNET: {
		chainId: 545,
		chainName: "Flow EVM Testnet",
		rpcUrl: "https://testnet.evm.nodes.onflow.org",
		blockExplorer: "https://evm-testnet.flowscan.org",
		nativeCurrency: {
			name: "Flow",
			symbol: "FLOW",
			decimals: 18,
		},
	},
	// 合约地址（部署后需要更新）
	CONTRACT_ADDRESS: import.meta.env.VITE_CONTRACT_ADDRESS || "0xe0340Fca56D9db0A55f7dca5DB11abe78aCA9DeB",
};

// 合约ABI - GatherMapBadges核心函数
export const CONTRACT_ABI = [
	// 只读函数
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function owner() view returns (address)",
	"function hasBadge(address user, string badgeType) view returns (bool)",
	"function getBadgeMetadata(string badgeType) view returns (string)",
	"function badgeTypes(string) view returns (bool)",
	"function tokenURI(uint256 tokenId) view returns (string)",
	"function ownerOf(uint256 tokenId) view returns (address)",
	"function balanceOf(address owner) view returns (uint256)",

	// 写入函数（仅管理员）
	"function mintBadge(address recipient, string badgeType, string uri)",
	"function batchMintBadges(address[] recipients, string badgeType, string[] uris)",
	"function addBadgeType(string badgeType, string metadata)",

	// 事件
	"event BadgeMinted(address indexed recipient, uint256 tokenId, string badgeType)",
	"event BadgeTypeAdded(string badgeType, string metadata)",
];

// 徽章类型配置
export const BADGE_TYPES = {
	explorer: {
		label: "Digital Nomad Explorer",
		description: "Visited more than 5 places",
		icon: "🌍",
		color: "primary",
	},
	reviewer: {
		label: "Quality Reviewer", 
		description: "Posted more than 10 quality reviews",
		icon: "⭐",
		color: "mint",
	},
	early_bird: {
		label: "Early Bird",
		description: "Early platform registered user",
		icon: "🐦",
		color: "amber",
	},
	community_star: {
		label: "Community Star",
		description: "Active community contributor",
		icon: "🌟",
		color: "rose",
	},
	place_hunter: {
		label: "Place Hunter",
		description: "Discovered and recommended new places",
		icon: "🏹",
		color: "purple",
	},
} as const;

export type BadgeType = keyof typeof BADGE_TYPES; 