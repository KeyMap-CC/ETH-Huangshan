import apiClient from './apiClient';

/**
 * Contract service for handling contract-related API endpoints
 */
const contractService = {
  /**
   * Scan a contract for security vulnerabilities
   * @param {string} contractAddress - Address of the contract to scan
   * @param {string} contractCode - Source code of the contract
   * @returns {Promise} - API response with scan results
   */
  scanContract: async (contractAddress, contractCode) => {
    try {
      // Using apiClient with local proxy
      // The request will be proxied to the external API through the local server
      const response = await apiClient.post(
        '/transaction/scan', // This will be appended to the BASE_URL in apiClient
        {
          contractAddress,
          contractCode
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error scanning contract:', error);
      throw error;
    }
  }
};

export default contractService;
