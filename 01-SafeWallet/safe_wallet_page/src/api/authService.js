import apiClient from './apiClient';

/**
 * Authentication service for handling user login and signature verification
 */
const authService = {
  /**
   * Login with wallet address and signature
   * @param {string} address - User's wallet address
   * @param {number} timestamp - Current timestamp
   * @param {string} nonce - Random nonce for signature
   * @param {string} signature - Signed message
   * @returns {Promise} - API response
   */
  login: async (address, timestamp, nonce, signature) => {
    try {
      // Use the standard apiClient which will go through our proxy middleware
      const response = await apiClient.post('/user/login', null, {
        params: {
          address,
          timestamp,
          nonce,
          signature
        }
      });
      
      console.log('Login response:', response.data);
      
      // The token should be automatically extracted by our response interceptor
      // and added to response.data.token
      const token = response.data?.token || 
                   (typeof response.data === 'string' ? response.data : null) || 
                   response.data?.data || 
                   response.data?.access_token;
      
      if (token) {
        console.log('Setting auth token:', token);
        localStorage.setItem('authToken', token);
      } else {
        console.warn('No token found in response');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('authToken');
    // Add any additional logout logic here
  }
};

export default authService;
