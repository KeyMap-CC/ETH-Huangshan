import axios from 'axios';

// Use relative URL for proxy routing
const BASE_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 1 minute timeout (60000ms)
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling tokens and errors
apiClient.interceptors.response.use(
  (response) => {
    // Check for token in custom header added by our proxy
    const extractedToken = response.headers['x-extracted-token'];
    if (extractedToken) {
      console.log('Token extracted from proxy header:', extractedToken);
      localStorage.setItem('authToken', extractedToken);
      
      // Add the token to the response data for convenience
      if (typeof response.data === 'object' && response.data !== null) {
        response.data.token = extractedToken;
      }
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('authToken');
      // You might want to redirect to login page or trigger a re-auth flow
    }
    return Promise.reject(error);
  }
);

export default apiClient;
