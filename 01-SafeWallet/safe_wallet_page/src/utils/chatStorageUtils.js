/**
 * Utility functions for managing chat messages and related data in local storage
 */

const CHAT_STORAGE_KEY = 'chatMessages_01';
const CHAT_ID_KEY = 'currentChatId';
const CHAT_INFO_KEY = 'currentChatInfo';

/**
 * Save chat messages to local storage
 * @param {Array} messages - Array of chat message objects
 */
export const saveChatMessages = (account, messages) => {
  if (messages.length > 0) {
    // Check if existing messages are longer than the new ones
    const existingMessages = loadChatMessages();
    if (existingMessages && existingMessages.length > messages.length) {
      console.log('Skipping save: new messages array is shorter than existing one');
      return;
    }
    localStorage.setItem(`${account}_${CHAT_STORAGE_KEY}`, JSON.stringify(messages));
  }
};

/**
 * Load chat messages from local storage
 * @returns {Array|null} Array of chat message objects or null if not found
 */
export const loadChatMessages = (account) => {
  const storedMessages = localStorage.getItem(`${account}_${CHAT_STORAGE_KEY}`);
  if (storedMessages) {
    return JSON.parse(storedMessages);
  }
  return null;
};

/**
 * Clear chat messages from local storage
 */
export const clearChatMessages = (account) => {
  localStorage.removeItem(`${account}_${CHAT_STORAGE_KEY}`);
};

/**
 * Save current chat ID to local storage
 * @param {string} chatId - The chat ID to save
 */
export const saveChatId = (account, chatId) => {
  localStorage.setItem(`${account}_${CHAT_ID_KEY}`, chatId);
};

/**
 * Load current chat ID from local storage
 * @returns {string|null} The chat ID or null if not found
 */
export const loadChatId = () => {
  return localStorage.getItem(CHAT_ID_KEY);
};

/**
 * Save chat information object to local storage
 * @param {Object} chatInfo - Chat information object
 */
export const saveChatInfo = (account, chatInfo) => {
  localStorage.setItem(`${account}_${CHAT_INFO_KEY}`, JSON.stringify(chatInfo));
};

/**
 * Load chat information object from local storage
 * @returns {Object|null} Chat information object or null if not found
 */
export const loadChatInfo = (account) => {
  const storedInfo = localStorage.getItem(`${account}_${CHAT_INFO_KEY}`);
  if (storedInfo) {
    return JSON.parse(storedInfo);
  }
  return null;
};

/**
 * Clear all chat-related data from local storage
 */
export const clearAllChatData = (account) => {
  localStorage.removeItem(`${account}_${CHAT_STORAGE_KEY}`);
  localStorage.removeItem(`${account}_${CHAT_ID_KEY}`);
  localStorage.removeItem(`${account}_${CHAT_INFO_KEY}`);
};

/**
 * Get the chat storage key
 * @returns {string} The key used for chat storage
 */
export const getChatStorageKey = (account) => `${account}_${CHAT_STORAGE_KEY}`;

export default {
  saveChatMessages,
  loadChatMessages,
  clearChatMessages,
  saveChatId,
  loadChatId,
  saveChatInfo,
  loadChatInfo,
  clearAllChatData,
  getChatStorageKey
};
