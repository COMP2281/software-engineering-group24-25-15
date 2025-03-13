// Try to import from @env, but provide fallback in case it fails
let importedApiUrl = '';
try {
  const env = require('@env');
  importedApiUrl = env.API_URL;
} catch (error) {
  console.warn('Error importing from @env, using fallback API URL');
}

// API configuration 
export const API_URL = importedApiUrl || 'http://192.168.4.22:8000';

// Auth configuration
export const AUTH_CONFIG = {
  // Token expiration time in minutes
  tokenExpiryBuffer: 5, // Refresh token 5 minutes before expiry
  
  // Set to true to use mock data even if API is available (for testing)
  useMockDataForTesting: false
};
