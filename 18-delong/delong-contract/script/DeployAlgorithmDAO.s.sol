// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../lib/forge-std/src/Script.sol";
import "../src/GovernanceToken.sol";
import "../src/AlgorithmReview.sol";

contract DeployAlgorithmDAO is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the governance token
        GovernanceToken token = new GovernanceToken();
        
        // Deploy the DAO with the token address
        AlgorithmReview dao = new AlgorithmReview(address(token));
        
        // Transfer ownership of the token to the DAO
        // Uncomment if you want the DAO to control the token
        // token.transferOwnership(address(dao));
        
        vm.stopBroadcast();
        
        console.log("Governance Token deployed at:", address(token));
        console.log("AlgorithmReview DAO deployed at:", address(dao));
    }
} 