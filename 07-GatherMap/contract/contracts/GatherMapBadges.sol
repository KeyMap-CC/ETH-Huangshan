// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GatherMapBadges
 * @dev 数字游民徽章NFT合约 - 用于GatherMap平台的成就系统
 */
contract GatherMapBadges is ERC721, ERC721URIStorage, Ownable {
	// Token ID 计数器
	uint256 private _nextTokenId;

	// 徽章类型映射
	mapping(string => bool) public badgeTypes;
	
	// 用户徽章映射 - 防止重复发放相同类型徽章
	mapping(address => mapping(string => bool)) public userBadges;
	
	// 徽章元数据映射
	mapping(string => string) public badgeMetadata;

	// 事件
	event BadgeTypeAdded(string badgeType, string metadata);
	event BadgeMinted(address indexed recipient, uint256 tokenId, string badgeType);

	constructor(address initialOwner) 
		ERC721("GatherMap Digital Nomad Badges", "GMDN") 
		Ownable(initialOwner) 
	{
		// 初始化 token ID 计数器，从 0 开始
		_nextTokenId = 0;
		// 初始化徽章类型
		_initializeBadgeTypes();
	}

	/**
	 * @dev 初始化徽章类型
	 */
	function _initializeBadgeTypes() private {
		_addBadgeType("explorer", "Digital Nomad Explorer - Visited more than 5 places");
		_addBadgeType("reviewer", "Quality Reviewer - Posted more than 10 quality reviews");
		_addBadgeType("early_bird", "Early Bird - Early platform registered user");
		_addBadgeType("community_star", "Community Star - Active community contributor");
		_addBadgeType("place_hunter", "Place Hunter - Discovered and recommended new places");
	}

	/**
	 * @dev 添加新的徽章类型
	 * @param badgeType 徽章类型标识
	 * @param metadata 徽章元数据描述
	 */
	function addBadgeType(string memory badgeType, string memory metadata) public onlyOwner {
		_addBadgeType(badgeType, metadata);
	}

	/**
	 * @dev 内部函数：添加徽章类型
	 */
	function _addBadgeType(string memory badgeType, string memory metadata) private {
		require(!badgeTypes[badgeType], "Badge type already exists");
		badgeTypes[badgeType] = true;
		badgeMetadata[badgeType] = metadata;
		emit BadgeTypeAdded(badgeType, metadata);
	}

	/**
	 * @dev 为用户铸造徽章NFT
	 * @param recipient 接收者地址
	 * @param badgeType 徽章类型
	 * @param uri NFT元数据URI
	 */
	function mintBadge(
		address recipient, 
		string memory badgeType, 
		string memory uri
	) public onlyOwner {
		require(badgeTypes[badgeType], "Invalid badge type");
		require(!userBadges[recipient][badgeType], "User already has this badge");
		require(recipient != address(0), "Cannot mint to zero address");

		uint256 tokenId = _nextTokenId;
		_nextTokenId++;

		_safeMint(recipient, tokenId);
		_setTokenURI(tokenId, uri);
		
		// 标记用户已拥有此类型徽章
		userBadges[recipient][badgeType] = true;

		emit BadgeMinted(recipient, tokenId, badgeType);
	}

	/**
	 * @dev 批量铸造徽章
	 * @param recipients 接收者地址数组
	 * @param badgeType 徽章类型
	 * @param uris NFT元数据URI数组
	 */
	function batchMintBadges(
		address[] memory recipients,
		string memory badgeType,
		string[] memory uris
	) public onlyOwner {
		require(recipients.length == uris.length, "Arrays length mismatch");
		require(badgeTypes[badgeType], "Invalid badge type");

		for (uint256 i = 0; i < recipients.length; i++) {
			if (!userBadges[recipients[i]][badgeType] && recipients[i] != address(0)) {
				uint256 tokenId = _nextTokenId;
				_nextTokenId++;

				_safeMint(recipients[i], tokenId);
				_setTokenURI(tokenId, uris[i]);
				
				userBadges[recipients[i]][badgeType] = true;
				emit BadgeMinted(recipients[i], tokenId, badgeType);
			}
		}
	}

	/**
	 * @dev 检查用户是否拥有特定类型徽章
	 * @param user 用户地址
	 * @param badgeType 徽章类型
	 * @return 是否拥有该徽章
	 */
	function hasBadge(address user, string memory badgeType) public view returns (bool) {
		return userBadges[user][badgeType];
	}

	/**
	 * @dev 获取当前token ID计数器
	 * @return 下一个将要分配的token ID
	 */
	function getCurrentTokenId() public view returns (uint256) {
		return _nextTokenId;
	}

	/**
	 * @dev 获取徽章类型的元数据
	 * @param badgeType 徽章类型
	 * @return 徽章元数据描述
	 */
	function getBadgeMetadata(string memory badgeType) public view returns (string memory) {
		require(badgeTypes[badgeType], "Invalid badge type");
		return badgeMetadata[badgeType];
	}

	/**
	 * @dev 重写tokenURI函数
	 */
	function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
		return super.tokenURI(tokenId);
	}

	/**
	 * @dev 重写supportsInterface函数
	 */
	function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
		return super.supportsInterface(interfaceId);
	}

	/**
	 * @dev 禁止转移 - 徽章应该是灵魂绑定的
	 */
	function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
		address from = _ownerOf(tokenId);
		
		// 只允许铸造（from == address(0)），不允许转移
		if (from != address(0) && to != address(0)) {
			require(false, "Badge transfers are not allowed");
		}
		
		return super._update(to, tokenId, auth);
	}

	/**
	 * @dev 紧急提取合约余额（如果有的话）
	 */
	function withdraw() public onlyOwner {
		uint256 balance = address(this).balance;
		require(balance > 0, "No funds to withdraw");
		
		(bool success, ) = payable(owner()).call{value: balance}("");
		require(success, "Withdrawal failed");
	}
} 