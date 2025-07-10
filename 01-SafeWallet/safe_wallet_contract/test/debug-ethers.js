const { ethers } = require("hardhat");

// Debug script to check ethers version and structure
console.log("Ethers version:", ethers.version || "Unknown");
console.log("Ethers structure:", Object.keys(ethers));
console.log("Utils exists:", ethers.utils ? "Yes" : "No");
console.log("parseEther exists directly on ethers:", typeof ethers.parseEther === "function" ? "Yes" : "No");