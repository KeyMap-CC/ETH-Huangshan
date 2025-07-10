const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AlgorithmReview DAO", function () {
  let governanceToken;
  let algorithmReview;
  let owner;
  let member1;
  let member2;
  let scientist;

  beforeEach(async function () {
    // Get signers
    [owner, member1, member2, scientist] = await ethers.getSigners();

    // Deploy governance token
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    governanceToken = await GovernanceToken.deploy();
    await governanceToken.waitForDeployment();

    // Deploy algorithm review contract
    const AlgorithmReview = await ethers.getContractFactory("AlgorithmReview");
    algorithmReview = await AlgorithmReview.deploy(await governanceToken.getAddress());
    await algorithmReview.waitForDeployment();

    // Transfer some tokens to members
    const tokenAmount = ethers.parseEther("1000");
    await governanceToken.transfer(member1.address, tokenAmount);
    await governanceToken.transfer(member2.address, tokenAmount);
  });

  describe("Basic Functionality", function () {
    it("Should set the correct owner", async function () {
      expect(await algorithmReview.owner()).to.equal(owner.address);
    });

    it("Should set the correct governance token", async function () {
      expect(await algorithmReview.governanceToken()).to.equal(await governanceToken.getAddress());
    });

    it("Should allow owner to add committee members", async function () {
      await algorithmReview.setCommitteeMember(member1.address, true);
      expect(await algorithmReview.isCommitteeMember(member1.address)).to.be.true;
    });
  });

  describe("Proposal System", function () {
    beforeEach(async function () {
      // Add committee members
      await algorithmReview.setCommitteeMember(member1.address, true);
      await algorithmReview.setCommitteeMember(member2.address, true);
    });

    it("Should allow creating a proposal", async function () {
      const cid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const description = "Test algorithm review";

      await algorithmReview.connect(member1).proposeAlgorithm(
        scientist.address,
        cid,
        description
      );

      // Check proposal count increased
      expect(await algorithmReview.proposalCount()).to.equal(1);
    });

    it("Should allow voting on a proposal", async function () {
      const cid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const description = "Test algorithm review";

      await algorithmReview.connect(member1).proposeAlgorithm(
        scientist.address,
        cid,
        description
      );

      const proposalId = 0;
      await algorithmReview.connect(member1).voteOnProposal(proposalId, true);
      await algorithmReview.connect(member2).voteOnProposal(proposalId, true);

      // We can't easily check the proposal votes directly as they're not exposed via a getter
      // But we can verify that voting doesn't revert
    });
  });

  describe("Algorithm Review", function () {
    beforeEach(async function () {
      // Add committee members
      await algorithmReview.setCommitteeMember(member1.address, true);
      await algorithmReview.setCommitteeMember(member2.address, true);

      // Create and execute a proposal
      const cid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const description = "Test algorithm review";

      await algorithmReview.connect(member1).proposeAlgorithm(
        scientist.address,
        cid,
        description
      );

      const proposalId = 0;
      
      // Vote on the proposal with enough votes to pass
      await algorithmReview.connect(member1).voteOnProposal(proposalId, true);
      await algorithmReview.connect(member2).voteOnProposal(proposalId, true);
      
      // Increase time to end voting period
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]); // 3 days
      await ethers.provider.send("evm_mine");

      // Execute the proposal
      await algorithmReview.connect(owner).executeProposal(0);
    });

    it("Should allow committee members to vote on algorithms", async function () {
      const cid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const voteAmount = ethers.parseEther("500");

      await algorithmReview.connect(member1).vote(cid, true, voteAmount);
      
      // We can't easily check the vote counts directly, but we can verify that voting doesn't revert
    });

    it("Should allow resolving algorithms after voting period", async function () {
      const cid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const voteAmount = ethers.parseEther("500");

      await algorithmReview.connect(member1).vote(cid, true, voteAmount);
      
      // Increase time to end voting period
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]); // 3 days
      await ethers.provider.send("evm_mine");

      // Resolve the algorithm
      await algorithmReview.connect(owner).resolve(cid, 0);
      
      // We can verify that resolving doesn't revert
    });
  });
}); 