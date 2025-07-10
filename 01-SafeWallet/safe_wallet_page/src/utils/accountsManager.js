import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

// Storage key for accounts in localStorage
const ACCOUNTS_STORAGE_KEY = 'safeWalletAccounts';

/**
 * Encrypt a private key with a password
 * @param {string} privateKey - The private key to encrypt
 * @param {string} password - The password to encrypt with
 * @returns {string} - The encrypted private key
 */
const encryptPrivateKey = (privateKey, password) => {
  try {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  } catch (error) {
    console.error('Error encrypting private key:', error);
    throw new Error('Failed to encrypt private key');
  }
};

/**
 * Decrypt a private key with a password
 * @param {string} encryptedPrivateKey - The encrypted private key
 * @param {string} password - The password to decrypt with
 * @returns {string} - The decrypted private key
 */
const decryptPrivateKey = (encryptedPrivateKey, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Error decrypting private key:', error);
    throw new Error('Failed to decrypt private key. Incorrect password or corrupted data.');
  }
};

/**
 * Generate a new Ethereum account
 * @param {string} password - Password to encrypt the private key
 * @returns {Object} - Object containing address and encrypted private key
 */
export const generateAccount = (password) => {
  try {
    if (!password) {
      throw new Error('Password is required to generate an account');
    }
    
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    const privateKey = wallet.privateKey;
    
    // Encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password);
    
    // Create account object
    const account = {
      id: Date.now().toString(),
      address,
      encryptedPrivateKey,
      createdAt: Date.now(),
      isDeleted: false
    };
    
    // Save to storage
    saveAccount(account);
    
    return account;
  } catch (error) {
    console.error('Error generating account:', error);
    throw error;
  }
};

/**
 * Save an account to localStorage
 * @param {Object} account - The account to save
 */
const saveAccount = (account) => {
  try {
    const accounts = getAccounts();
    
    // Check if account already exists
    const existingIndex = accounts.findIndex(acc => acc.address === account.address);
    
    if (existingIndex >= 0) {
      // Update existing account
      accounts[existingIndex] = account;
    } else {
      // Add new account
      accounts.push(account);
    }
    
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (error) {
    console.error('Error saving account:', error);
    throw new Error('Failed to save account');
  }
};

/**
 * Get all accounts from localStorage
 * @param {boolean} includeDeleted - Whether to include deleted accounts
 * @returns {Array} - Array of accounts
 */
export const getAccounts = (includeDeleted = false) => {
  try {
    const accountsJson = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    const accounts = accountsJson ? JSON.parse(accountsJson) : [];
    
    if (includeDeleted) {
      return accounts;
    }
    
    // Filter out deleted accounts
    return accounts.filter(account => !account.isDeleted);
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

/**
 * Get a specific account by address
 * @param {string} address - The address to look for
 * @returns {Object|null} - The account or null if not found
 */
export const getAccountByAddress = (address) => {
  try {
    const accounts = getAccounts(true); // Include deleted accounts
    return accounts.find(account => account.address.toLowerCase() === address.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting account by address:', error);
    return null;
  }
};

/**
 * Delete an account (mark as deleted)
 * @param {string} address - The address of the account to delete
 * @returns {boolean} - Whether the deletion was successful
 */
export const deleteAccount = (address) => {
  try {
    const accounts = getAccounts(true); // Include deleted accounts
    const accountIndex = accounts.findIndex(account => 
      account.address.toLowerCase() === address.toLowerCase());
    
    if (accountIndex === -1) {
      return false;
    }
    
    // Mark as deleted instead of removing
    accounts[accountIndex].isDeleted = true;
    accounts[accountIndex].deletedAt = Date.now();
    
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    return false;
  }
};

/**
 * Restore a deleted account
 * @param {string} address - The address of the account to restore
 * @returns {boolean} - Whether the restoration was successful
 */
export const restoreAccount = (address) => {
  try {
    const accounts = getAccounts(true); // Include deleted accounts
    const accountIndex = accounts.findIndex(account => 
      account.address.toLowerCase() === address.toLowerCase() && account.isDeleted);
    
    if (accountIndex === -1) {
      return false;
    }
    
    // Unmark as deleted
    accounts[accountIndex].isDeleted = false;
    delete accounts[accountIndex].deletedAt;
    
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return true;
  } catch (error) {
    console.error('Error restoring account:', error);
    return false;
  }
};

/**
 * Get the decrypted private key for an account
 * @param {string} address - The address of the account
 * @param {string} password - The password to decrypt the private key
 * @returns {string} - The decrypted private key
 */
export const getPrivateKey = (address, password) => {
  try {
    const account = getAccountByAddress(address);
    
    if (!account) {
      throw new Error('Account not found');
    }
    
    return decryptPrivateKey(account.encryptedPrivateKey, password);
  } catch (error) {
    console.error('Error getting private key:', error);
    throw error;
  }
};

/**
 * Import an account using a private key
 * @param {string} privateKey - The private key to import
 * @param {string} password - The password to encrypt the private key
 * @returns {Object} - The imported account
 */
export const importAccount = (privateKey, password) => {
  try {
    if (!privateKey || !password) {
      throw new Error('Private key and password are required');
    }
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;
    
    // Check if account already exists
    const existingAccount = getAccountByAddress(address);
    if (existingAccount && !existingAccount.isDeleted) {
      throw new Error('Account already exists');
    }
    
    // Encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password);
    
    // Create account object
    const account = {
      id: Date.now().toString(),
      address,
      encryptedPrivateKey,
      createdAt: Date.now(),
      isDeleted: false,
      imported: true
    };
    
    // Save to storage
    saveAccount(account);
    
    return account;
  } catch (error) {
    console.error('Error importing account:', error);
    throw error;
  }
};

/**
 * Change the password for an account
 * @param {string} address - The address of the account
 * @param {string} oldPassword - The current password
 * @param {string} newPassword - The new password
 * @returns {boolean} - Whether the password change was successful
 */
export const changePassword = (address, oldPassword, newPassword) => {
  try {
    // Get the account
    const account = getAccountByAddress(address);
    if (!account) {
      throw new Error('Account not found');
    }
    
    // Decrypt with old password
    const privateKey = decryptPrivateKey(account.encryptedPrivateKey, oldPassword);
    
    // Encrypt with new password
    const newEncryptedPrivateKey = encryptPrivateKey(privateKey, newPassword);
    
    // Update account
    account.encryptedPrivateKey = newEncryptedPrivateKey;
    account.updatedAt = Date.now();
    
    // Save updated account
    saveAccount(account);
    
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
};

/**
 * Verify if a password is correct for an account
 * @param {string} address - The address of the account
 * @param {string} password - The password to verify
 * @returns {boolean} - Whether the password is correct
 */
export const verifyPassword = (address, password) => {
  try {
    const account = getAccountByAddress(address);
    
    if (!account) {
      return false;
    }
    
    // Try to decrypt - if it works, the password is correct
    decryptPrivateKey(account.encryptedPrivateKey, password);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get a signer for an account
 * @param {string} address - The address of the account
 * @param {string} password - The password to decrypt the private key
 * @param {ethers.providers.Provider} provider - The provider to use
 * @returns {ethers.Wallet} - The wallet signer
 */
export const getSigner = (address, password, provider) => {
  try {
    const privateKey = getPrivateKey(address, password);
    const wallet = new ethers.Wallet(privateKey);
    
    if (provider) {
      return wallet.connect(provider);
    }
    
    return wallet;
  } catch (error) {
    console.error('Error getting signer:', error);
    throw error;
  }
};