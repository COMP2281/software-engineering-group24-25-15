// Try to import from @env, but provide fallback in case it fails
let importedApiUrl = "";
try {
	importedApiUrl = process.env.EXPO_PUBLIC_API_URL || "";

	if (importedApiUrl) {
		console.log(`Using API URL from environment: ${importedApiUrl}`);
	} else {
		console.warn("API_URL was empty in environment variables");
	}
} catch (error) {
	console.warn("Error importing from @env, using fallback API URL");
}

// API configuration
export const API_URL = importedApiUrl || "http://192.168.0.5:8000";
console.log(`Final API URL: ${API_URL}`);

// Auth configuration
export const AUTH_CONFIG = {
	// Token expiration time in minutes
	tokenExpiryBuffer: 5, // Refresh token 5 minutes before expiry

	// Set to true to use mock data even if API is available (for testing)
	useMockDataForTesting: false,
};
