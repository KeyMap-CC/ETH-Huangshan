/**
 * Utility functions for handling transactions
 */

/**
 * Add a transaction to the transaction history and save to localStorage
 * @param {Object} transaction - Transaction object to add
 * @param {string} account - User's wallet address
 * @returns {Array} Updated transactions array
 */
export const addTransaction = (transaction, account = '') => {
  if (!transaction) return [];
  
  // Create storage key with account address
  const storageKey = account ? `safeWalletTransactions_${account.toLowerCase()}` : 'safeWalletTransactions';
  
  // Add new transaction to the beginning of the array
  const updatedTransactions = [transaction, ...getTransactions(account)];
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem(storageKey, JSON.stringify(updatedTransactions));
  } catch (e) {
    console.error('Error storing transaction in localStorage:', e);
  }
  
  return updatedTransactions;
};

/**
 * Get transactions from localStorage
 * @param {string} account - User's wallet address
 * @returns {Array} Transactions array
 */
export const getTransactions = (account = '') => {
  try {
    // Try to get transactions with account-specific key
    const storageKey = account ? `safeWalletTransactions_${account.toLowerCase()}` : 'safeWalletTransactions';
    const txsString = localStorage.getItem(storageKey);
    
    if (txsString) {
      return JSON.parse(txsString);
    }
    
    // If no account-specific transactions found, try the generic key as fallback
    if (account) {
      const fallbackTxsString = localStorage.getItem('safeWalletTransactions');
      if (fallbackTxsString) {
        const transactions = JSON.parse(fallbackTxsString);
        // Migrate old transactions to the new account-specific storage
        localStorage.setItem(storageKey, fallbackTxsString);
        return transactions;
      }
    }
  } catch (e) {
    console.error('Error retrieving transactions from localStorage:', e);
  }
  
  return [];
};

/**
 * Update a transaction in the transaction history
 * @param {string} txHash - Transaction hash to update
 * @param {Object} updates - Properties to update
 * @param {Array} currentTransactions - Current list of transactions
 * @param {string} account - User's wallet address
 * @returns {Array} Updated transactions array
 */
export const updateTransaction = (txHash, updates, currentTransactions = [], account = '') => {
  if (!txHash || !updates) return currentTransactions;
  
  // Create storage key with account address
  const storageKey = account ? `safeWalletTransactions_${account.toLowerCase()}` : 'safeWalletTransactions';
  
  // Find and update the transaction
  const updatedTransactions = currentTransactions.map(tx => {
    if (tx.hash === txHash) {
      return { ...tx, ...updates };
    }
    return tx;
  });
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem(storageKey, JSON.stringify(updatedTransactions));
  } catch (e) {
    console.error('Error storing updated transaction in localStorage:', e);
  }
  
  return updatedTransactions;
};
