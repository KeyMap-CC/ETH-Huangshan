const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GatherMapBadges", function () {
	let gatherMapBadges;
	let owner;
	let user1;
	let user2;

	beforeEach(async function () {
		// 获取签名者
		[owner, user1, user2] = await ethers.getSigners();

		// 部署合约
		const GatherMapBadges = await ethers.getContractFactory("GatherMapBadges");
		gatherMapBadges = await GatherMapBadges.deploy(owner.address);
		await gatherMapBadges.waitForDeployment();
	});

	describe("部署", function () {
		it("应该设置正确的所有者", async function () {
			expect(await gatherMapBadges.owner()).to.equal(owner.address);
		});

		it("应该设置正确的名称和符号", async function () {
			expect(await gatherMapBadges.name()).to.equal("GatherMap Digital Nomad Badges");
			expect(await gatherMapBadges.symbol()).to.equal("GMDN");
		});

		it("应该初始化预设徽章类型", async function () {
			const badgeTypes = ["explorer", "reviewer", "early_bird", "community_star", "place_hunter"];
			
			for (const badgeType of badgeTypes) {
				expect(await gatherMapBadges.badgeTypes(badgeType)).to.be.true;
				const metadata = await gatherMapBadges.badgeMetadata(badgeType);
				expect(metadata).to.not.be.empty;
			}
		});
	});

	describe("徽章铸造", function () {
		it("所有者应该能够铸造徽章", async function () {
			const badgeType = "explorer";
			const tokenURI = "https://api.gathermap.com/metadata/explorer/1";

			await expect(gatherMapBadges.mintBadge(user1.address, badgeType, tokenURI))
				.to.emit(gatherMapBadges, "BadgeMinted")
				.withArgs(user1.address, 0, badgeType);

			// 验证徽章已铸造
			expect(await gatherMapBadges.ownerOf(0)).to.equal(user1.address);
			expect(await gatherMapBadges.hasBadge(user1.address, badgeType)).to.be.true;
			expect(await gatherMapBadges.tokenURI(0)).to.equal(tokenURI);
		});

		it("非所有者不应该能够铸造徽章", async function () {
			const badgeType = "explorer";
			const tokenURI = "https://api.gathermap.com/metadata/explorer/1";

			await expect(
				gatherMapBadges.connect(user1).mintBadge(user2.address, badgeType, tokenURI)
			).to.be.revertedWithCustomError(gatherMapBadges, "OwnableUnauthorizedAccount");
		});

		it("不应该为同一用户铸造重复徽章", async function () {
			const badgeType = "explorer";
			const tokenURI = "https://api.gathermap.com/metadata/explorer/1";

			// 第一次铸造
			await gatherMapBadges.mintBadge(user1.address, badgeType, tokenURI);

			// 第二次铸造应该失败
			await expect(
				gatherMapBadges.mintBadge(user1.address, badgeType, tokenURI)
			).to.be.revertedWith("User already has this badge");
		});

		it("不应该为无效徽章类型铸造", async function () {
			const invalidBadgeType = "invalid_badge";
			const tokenURI = "https://api.gathermap.com/metadata/invalid/1";

			await expect(
				gatherMapBadges.mintBadge(user1.address, invalidBadgeType, tokenURI)
			).to.be.revertedWith("Invalid badge type");
		});

		it("不应该为零地址铸造", async function () {
			const badgeType = "explorer";
			const tokenURI = "https://api.gathermap.com/metadata/explorer/1";

			await expect(
				gatherMapBadges.mintBadge(ethers.ZeroAddress, badgeType, tokenURI)
			).to.be.revertedWith("Cannot mint to zero address");
		});
	});

	describe("批量铸造", function () {
		it("应该能够批量铸造徽章", async function () {
			const badgeType = "reviewer";
			const recipients = [user1.address, user2.address];
			const tokenURIs = [
				"https://api.gathermap.com/metadata/reviewer/1",
				"https://api.gathermap.com/metadata/reviewer/2"
			];

			await gatherMapBadges.batchMintBadges(recipients, badgeType, tokenURIs);

			// 验证徽章已铸造
			expect(await gatherMapBadges.hasBadge(user1.address, badgeType)).to.be.true;
			expect(await gatherMapBadges.hasBadge(user2.address, badgeType)).to.be.true;
			expect(await gatherMapBadges.ownerOf(0)).to.equal(user1.address);
			expect(await gatherMapBadges.ownerOf(1)).to.equal(user2.address);
		});

		it("批量铸造时应该跳过重复徽章", async function () {
			const badgeType = "community_star";
			const tokenURI = "https://api.gathermap.com/metadata/community_star/1";

			// 先为user1铸造
			await gatherMapBadges.mintBadge(user1.address, badgeType, tokenURI);

			// 批量铸造（包含已有徽章的用户）
			const recipients = [user1.address, user2.address];
			const tokenURIs = [tokenURI, "https://api.gathermap.com/metadata/community_star/2"];

			await gatherMapBadges.batchMintBadges(recipients, badgeType, tokenURIs);

			// user1应该只有一个徽章，user2应该有新徽章
			expect(await gatherMapBadges.getCurrentTokenId()).to.equal(2);
			expect(await gatherMapBadges.hasBadge(user2.address, badgeType)).to.be.true;
		});
	});

	describe("徽章类型管理", function () {
		it("所有者应该能够添加新徽章类型", async function () {
			const newBadgeType = "travel_guru";
			const metadata = "🌟 旅行大师 - 环游世界的数字游民";

			await expect(gatherMapBadges.addBadgeType(newBadgeType, metadata))
				.to.emit(gatherMapBadges, "BadgeTypeAdded")
				.withArgs(newBadgeType, metadata);

			expect(await gatherMapBadges.badgeTypes(newBadgeType)).to.be.true;
			expect(await gatherMapBadges.getBadgeMetadata(newBadgeType)).to.equal(metadata);
		});

		it("不应该添加重复的徽章类型", async function () {
			const existingBadgeType = "explorer";
			const metadata = "重复的探索者徽章";

			await expect(
				gatherMapBadges.addBadgeType(existingBadgeType, metadata)
			).to.be.revertedWith("Badge type already exists");
		});
	});

	describe("转移限制", function () {
		it("徽章不应该可以转移", async function () {
			const badgeType = "explorer";
			const tokenURI = "https://api.gathermap.com/metadata/explorer/1";

			// 铸造徽章
			await gatherMapBadges.mintBadge(user1.address, badgeType, tokenURI);

			// 尝试转移应该失败
			await expect(
				gatherMapBadges.connect(user1).transferFrom(user1.address, user2.address, 0)
			).to.be.revertedWith("Badge transfers are not allowed");
		});
	});

	describe("查询功能", function () {
		it("应该正确返回用户徽章状态", async function () {
			const badgeType = "place_hunter";
			const tokenURI = "https://api.gathermap.com/metadata/place_hunter/1";

			// 铸造前检查
			expect(await gatherMapBadges.hasBadge(user1.address, badgeType)).to.be.false;

			// 铸造徽章
			await gatherMapBadges.mintBadge(user1.address, badgeType, tokenURI);

			// 铸造后检查
			expect(await gatherMapBadges.hasBadge(user1.address, badgeType)).to.be.true;
			expect(await gatherMapBadges.hasBadge(user2.address, badgeType)).to.be.false;
		});

		it("应该正确返回token ID计数器", async function () {
			expect(await gatherMapBadges.getCurrentTokenId()).to.equal(0);

			// 铸造第一个徽章
			await gatherMapBadges.mintBadge(user1.address, "explorer", "uri1");
			expect(await gatherMapBadges.getCurrentTokenId()).to.equal(1);

			// 铸造第二个徽章
			await gatherMapBadges.mintBadge(user2.address, "reviewer", "uri2");
			expect(await gatherMapBadges.getCurrentTokenId()).to.equal(2);
		});
	});
}); 