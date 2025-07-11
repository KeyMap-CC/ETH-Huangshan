import apiClient from './apiClient';

/**
 * Chat service for handling chat-related API endpoints
 */
const chatService = {
  /**
   * Create a new chat session
   * @returns {Promise} - API response with new chat details
   */
  newChat: async () => {
    try {
      const response = await apiClient.post('/chat/newChat');
      return response.data;
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  },
  
  /**
   * Send a message to a chat and get response
   * @param {string} chatId - ID of the chat session
   * @param {string} query - User's message
   * @returns {Promise} - API response with chat messages
   */
  sendMessage: async (chatId, query) => {
    try {
      const response = await apiClient.post('/chat/chatMessages', {
        chatId,
        query
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  /**
   * Get message history for all chats
   * @returns {Promise} - API response with message history
   */
  getMessageHistory: async () => {
    try {
      const response = await apiClient.get('/chat/messageHistory');
      return response.data;
    } catch (error) {
      console.error('Error getting message history:', error);
      throw error;
    }
  }
};

export default chatService;
