const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeWallet Honeypot Interaction Tests", function () {
  let safeWallet;
  let honeypotAttacker;
  let honeypotContract;
  let owner;
  let company;
  let otherAccount;
  let multiSigManager;

  // Helper function to create and sign rejection signatures
  async function createRejectionSignatures(signers, txHash) {
    const signatures = [];
    for (const signer of signers) {
      const signature = await signer.signMessage(ethers.utils.arrayify(txHash));
      signatures.push(signature);
    }
    return signatures;
  }

  // Set up the test environment once before all tests
  before(async function () {
    // Get signers
    [owner, company, otherAccount] = await ethers.getSigners();

    // Deploy a simple mock contract to simulate the honeypot
    const HoneypotContractFactory = await ethers.getContractFactory("HoneypotContract");
    honeypotContract = await HoneypotContractFactory.deploy();
    
    // Deploy the mock attacker
    const HoneypotAttackerFactory = await ethers.getContractFactory("HoneypotAttacker");
    honeypotAttacker = await HoneypotAttackerFactory.deploy(honeypotContract.address);
  });
  
  // Set up the SafeWallet for each test case
  beforeEach(async function () {
    // Deploy SafeWallet
    const SafeWallet = await ethers.getContractFactory("SafeWallet7702");
    safeWallet = await SafeWallet.deploy();

    // Initialize SafeWallet with default risk level (RISK_BALANCED = 20)
    await safeWallet.initialize(owner.address, company.address, 20);

    // Get MultiSigManager address
    const multiSigAddress = await safeWallet.getMultiSig();
    multiSigManager = await ethers.getContractAt("MultiSigManager", multiSigAddress);
  });

  it("Scenario 1: User default risk level medium (20), backend risk assessment (30)", async function () {
    // In this scenario, user has default rejection weight of 20 (RISK_BALANCED)
    // Company has rejection weight of 30 (RISK_HIGH)
    
    // Change company's weight to 30 (RISK_HIGH)
    await multiSigManager.connect(owner).changeWeight(company.address, 30);
    
    // Verify weights
    expect(await multiSigManager.getWeight(owner.address)).to.equal(51);
    expect(await multiSigManager.getWeight(company.address)).to.equal(30);
    
    // Create transaction to interact with honeypot
    const target = honeypotContract.address;
    const value = ethers.utils.parseEther("1.0");
    console.log("fdsafdsafdsafdsa")
    const data = "0x9e5faafc"; // Function selector for attack()
    
    // Get nonce for transaction hash
    const nonce = await safeWallet.getNonce();
    
    // Create transaction hash
    const txHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["string", "address", "uint256", "bytes32", "uint256", "uint256", "address"],
        [
          "execute",
          target,
          value,
          ethers.utils.keccak256(data),
          nonce,
          await ethers.provider.getNetwork().then(n => n.chainId),
          safeWallet.address
        ]
      )
    );
    
    // Create rejection signatures from company only
    const signatures = await createRejectionSignatures([company], txHash);
    
    // Company's rejection weight (30) is less than threshold (50), so transaction should proceed
    // But it will fail because it's a honeypot
    await expect(
      safeWallet.connect(owner).execute(target, value, data, signatures)
    ).to.be.revertedWith("Transaction execution failed");
  });

  it("Scenario 2: User rejection 51, backend rejection 0", async function () {
    // In this scenario, user has rejection weight of 51
    // Company has rejection weight of 0 (no rejection)
    
    // Change company's weight to 0 (no rejection power)
    await multiSigManager.connect(owner).changeWeight(company.address, 0);
    
    // Verify weights
    expect(await multiSigManager.getWeight(owner.address)).to.equal(51);
    expect(await multiSigManager.getWeight(company.address)).to.equal(0);
    
    // Create transaction to interact with honeypot
    const target = honeypotAttacker.address;
    const value = ethers.utils.parseEther("1.0");
    const data = honeypotAttacker.interface.encodeFunctionData("attack", []);
    
    // Get nonce for transaction hash
    const nonce = await safeWallet.getNonce();
    
    // Create transaction hash
    const txHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["string", "address", "uint256", "bytes32", "uint256", "uint256", "address"],
        [
          "execute",
          target,
          value,
          ethers.utils.keccak256(data),
          nonce,
          await ethers.provider.getNetwork().then(n => n.chainId),
          safeWallet.address
        ]
      )
    );
    
    // Create rejection signatures from owner
    const signatures = await createRejectionSignatures([owner], txHash);
    
    // Owner's rejection weight (51) is greater than threshold (50), so transaction should be rejected
    await expect(
      safeWallet.connect(owner).execute(target, value, data, signatures)
    ).to.be.revertedWith("Transaction rejected by multi-signature");
  });

  it("Scenario 3: User rejection 0, backend rejection 49", async function () {
    // In this scenario, user has rejection weight of 0 (no rejection)
    // Company has rejection weight of 49
    
    // Change owner's weight to 0 (no rejection power)
    await multiSigManager.connect(owner).changeWeight(owner.address, 0);
    
    // Change company's weight to 49
    await multiSigManager.connect(company).changeWeight(company.address, 49);
    
    // Add a third owner with 51 weight to maintain control
    await multiSigManager.connect(company).addOwner(otherAccount.address, 51);
    
    // Verify weights
    expect(await multiSigManager.getWeight(owner.address)).to.equal(0);
    expect(await multiSigManager.getWeight(company.address)).to.equal(49);
    expect(await multiSigManager.getWeight(otherAccount.address)).to.equal(51);
    
    // Create transaction to interact with honeypot
    const target = honeypotAttacker.address;
    const value = ethers.utils.parseEther("1.0");
    const data = honeypotAttacker.interface.encodeFunctionData("attack", []);
    
    // Get nonce for transaction hash
    const nonce = await safeWallet.getNonce();
    
    // Create transaction hash
    const txHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["string", "address", "uint256", "bytes32", "uint256", "uint256", "address"],
        [
          "execute",
          target,
          value,
          ethers.utils.keccak256(data),
          nonce,
          await ethers.provider.getNetwork().then(n => n.chainId),
          safeWallet.address
        ]
      )
    );
    
    // Create rejection signatures from company only
    const signatures = await createRejectionSignatures([company], txHash);
    
    // Company's rejection weight (49) is less than threshold (50), so transaction should proceed
    // But it will fail because it's a honeypot
    await expect(
      safeWallet.connect(otherAccount).execute(target, value, data, signatures)
    ).to.be.revertedWith("Only owner can execute");
    
    // Try with the original owner
    await expect(
      safeWallet.connect(owner).execute(target, value, data, signatures)
    ).to.be.revertedWith("Transaction execution failed");
  });

  it("Scenario 4: User rejection 51, backend rejection 49", async function () {
    // In this scenario, user has rejection weight of 51
    // Company has rejection weight of 49
    
    // Change company's weight to 49 (maximum company weight)
    await multiSigManager.connect(owner).changeWeight(company.address, 49);
    
    // Verify weights
    expect(await multiSigManager.getWeight(owner.address)).to.equal(51);
    expect(await multiSigManager.getWeight(company.address)).to.equal(49);
    
    // Create transaction to interact with honeypot
    const target = honeypotAttacker.address;
    const value = ethers.utils.parseEther("1.0");
    const data = honeypotAttacker.interface.encodeFunctionData("attack", []);
    
    // Get nonce for transaction hash
    const nonce = await safeWallet.getNonce();
    
    // Create transaction hash
    const txHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["string", "address", "uint256", "bytes32", "uint256", "uint256", "address"],
        [
          "execute",
          target,
          value,
          ethers.utils.keccak256(data),
          nonce,
          await ethers.provider.getNetwork().then(n => n.chainId),
          safeWallet.address
        ]
      )
    );
    
    // Test with both user and company rejecting
    const signatures = await createRejectionSignatures([owner, company], txHash);
    
    // Combined rejection weight (51 + 49 = 100) is greater than threshold (50), so transaction should be rejected
    await expect(
      safeWallet.connect(owner).execute(target, value, data, signatures)
    ).to.be.revertedWith("Transaction rejected by multi-signature");
    
    // Test with only user rejecting
    const userSignatures = await createRejectionSignatures([owner], txHash);
    
    // User's rejection weight (51) is greater than threshold (50), so transaction should be rejected
    await expect(
      safeWallet.connect(owner).execute(target, value, data, userSignatures)
    ).to.be.revertedWith("Transaction rejected by multi-signature");
    
    // Test with only company rejecting
    const companySignatures = await createRejectionSignatures([company], txHash);
    
    // Company's rejection weight (49) is less than threshold (50), so transaction should proceed
    // But it will fail because it's a honeypot
    await expect(
      safeWallet.connect(owner).execute(target, value, data, companySignatures)
    ).to.be.revertedWith("Transaction execution failed");
  });
});