// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AlgorithmReview DAO contracts...");

  // Get the contract factories
  const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
  const AlgorithmReview = await ethers.getContractFactory("AlgorithmReview");

  // Deploy the governance token
  console.log("Deploying GovernanceToken...");
  const governanceToken = await GovernanceToken.deploy();
  await governanceToken.waitForDeployment();
  const governanceTokenAddress = await governanceToken.getAddress();
  console.log(`GovernanceToken deployed to: ${governanceTokenAddress}`);

  // Deploy the DAO with the token address
  console.log("Deploying AlgorithmReview DAO...");
  const algorithmReview = await AlgorithmReview.deploy(governanceTokenAddress);
  await algorithmReview.waitForDeployment();
  const algorithmReviewAddress = await algorithmReview.getAddress();
  console.log(`AlgorithmReview DAO deployed to: ${algorithmReviewAddress}`);

  // Optional: Transfer ownership of the token to the DAO
  // Uncomment if you want the DAO to control the token
  // console.log("Transferring token ownership to DAO...");
  // await governanceToken.transferOwnership(algorithmReviewAddress);
  // console.log("Token ownership transferred to DAO");

  console.log("Deployment completed successfully!");
  
  // Return the deployed contract addresses for testing/frontend
  return {
    governanceToken: governanceTokenAddress,
    algorithmReview: algorithmReviewAddress
  };
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 