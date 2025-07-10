// scripts/interact.js
const { ethers } = require("hardhat");

async function main() {
  // Replace these addresses with your deployed contract addresses
  const governanceTokenAddress = "YOUR_GOVERNANCE_TOKEN_ADDRESS";
  const algorithmReviewAddress = "YOUR_ALGORITHM_REVIEW_ADDRESS";

  // Get the contract instances
  const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
  const algorithmReview = await ethers.getContractAt("AlgorithmReview", algorithmReviewAddress);

  // Get signers
  const [deployer, member1, member2, scientist] = await ethers.getSigners();
  
  console.log("Interacting with AlgorithmReview DAO...");
  console.log(`Using deployer address: ${deployer.address}`);

  // Example: Add committee members
  console.log("\nAdding committee members...");
  await algorithmReview.connect(deployer).setCommitteeMember(member1.address, true);
  console.log(`Added ${member1.address} as committee member`);
  await algorithmReview.connect(deployer).setCommitteeMember(member2.address, true);
  console.log(`Added ${member2.address} as committee member`);

  // Example: Transfer tokens to members
  console.log("\nTransferring governance tokens to members...");
  const tokenAmount = ethers.parseEther("1000"); // 1000 tokens
  await governanceToken.connect(deployer).transfer(member1.address, tokenAmount);
  console.log(`Transferred ${ethers.formatEther(tokenAmount)} tokens to ${member1.address}`);
  await governanceToken.connect(deployer).transfer(member2.address, tokenAmount);
  console.log(`Transferred ${ethers.formatEther(tokenAmount)} tokens to ${member2.address}`);

  // Example: Create a proposal to review an algorithm
  console.log("\nCreating a proposal to review an algorithm...");
  const cid = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"; // Example IPFS CID
  const description = "Review algorithm for data processing";
  
  await algorithmReview.connect(member1).proposeAlgorithm(
    scientist.address,
    cid,
    description
  );
  
  // Get the proposal ID (assuming it's the first proposal)
  const proposalId = 0;
  console.log(`Created proposal with ID: ${proposalId}`);

  // Example: Vote on the proposal
  console.log("\nVoting on the proposal...");
  await algorithmReview.connect(member1).voteOnProposal(proposalId, true);
  console.log(`Member1 voted YES on proposal ${proposalId}`);
  await algorithmReview.connect(member2).voteOnProposal(proposalId, true);
  console.log(`Member2 voted YES on proposal ${proposalId}`);

  // Example: Execute the proposal after voting period ends
  console.log("\nIn a real scenario, you would need to wait for the voting period to end");
  console.log("For demonstration, we'll simulate time passing and execute the proposal");
  
  // In a real scenario, you would use something like:
  // await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]); // 3 days
  // await ethers.provider.send("evm_mine");
  
  // Execute the proposal
  console.log("\nExecuting the proposal...");
  await algorithmReview.connect(deployer).executeProposal(proposalId);
  console.log(`Executed proposal ${proposalId}`);

  // Example: Committee members vote on the algorithm
  console.log("\nCommittee members voting on the algorithm...");
  const voteAmount = ethers.parseEther("500"); // 500 tokens
  await algorithmReview.connect(member1).vote(cid, true, voteAmount);
  console.log(`Member1 voted YES with ${ethers.formatEther(voteAmount)} tokens`);
  await algorithmReview.connect(member2).vote(cid, true, voteAmount);
  console.log(`Member2 voted YES with ${ethers.formatEther(voteAmount)} tokens`);

  // Example: Resolve the algorithm after voting period
  console.log("\nResolving the algorithm...");
  // In a real scenario, you would wait for the voting period to end
  // await algorithmReview.connect(deployer).resolve(cid, 0);
  console.log("Algorithm would be resolved after voting period");

  console.log("\nInteraction completed successfully!");
}

// Execute the interaction
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Interaction failed:", error);
    process.exit(1);
  }); 