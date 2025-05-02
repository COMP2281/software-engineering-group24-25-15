import React, { createContext, useState, useContext, useEffect, ReactNode, SetStateAction } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, AUTH_CONFIG } from "@/constants/config";

// Helper function to parse JWT token and get expiry time
const getTokenExpiry = (token: string): number => {
	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);
		return JSON.parse(jsonPayload).exp * 1000; // Convert to milliseconds
	} catch (error) {
		console.error("Error parsing token:", error);
		return 0;
	}
};

// Define the shape of our auth state
interface AuthContextType {
	token: string | null;
	refreshToken: string | null;
	userId: string | null;
	username: string | null;
	isAuthenticated: boolean;
	login: (accessToken: string, refreshToken: string, username: string, id: number) => Promise<boolean>;
	logout: () => Promise<void>;
	refreshAuthToken: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
	token: null,
	refreshToken: null,
	userId: null,
	username: null,
	isAuthenticated: false,
	login: async () => false,
	logout: async () => {},
	refreshAuthToken: async () => false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);

	// Load tokens from storage on startup
	useEffect(() => {
		const loadTokens = async () => {
			try {
				const storedToken = await AsyncStorage.getItem("access_token");
				const storedRefreshToken = await AsyncStorage.getItem("refresh_token");
				const storedUserId = await AsyncStorage.getItem("user_id");
				const storedUsername = await AsyncStorage.getItem("username");

				if (storedToken) setToken(storedToken);
				if (storedRefreshToken) setRefreshToken(storedRefreshToken);
				if (storedUserId) setUserId(storedUserId);
				if (storedUsername) setUsername(storedUsername);
			} catch (error) {
				console.error("Failed to load tokens from storage:", error);
			}
		};

		loadTokens();
	}, []);

	// Setup token refresh timer
	useEffect(() => {
		if (!token) return;

		const tokenExpiry = getTokenExpiry(token);
		const now = Date.now();
		const timeUntilExpiry = tokenExpiry - now;

		// If token is already expired, refresh immediately
		if (timeUntilExpiry <= 0) {
			refreshAuthToken();
			return;
		}

		// Set timer to refresh token before it expires
		const refreshBuffer = AUTH_CONFIG.tokenExpiryBuffer * 60 * 1000; // Convert minutes to ms
		const refreshTime = Math.max(0, timeUntilExpiry - refreshBuffer);

		const refreshTimer = setTimeout(() => {
			refreshAuthToken();
		}, refreshTime);

		return () => clearTimeout(refreshTimer);
	}, [token]);

	// Login function
	const login = async (accessToken: string, refreshToken: string, username: string, id: number): Promise<boolean> => {
		try {
			// Store tokens
			setToken(accessToken);
			setRefreshToken(refreshToken);
			setUsername(username);
			setUserId(id.toString());

			// Get user details with the token
			const userResponse = await fetch(`${API_URL}/accounts/me/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `JWT ${accessToken}`,
				},
			});

			if (userResponse.ok) {
				const userData = await userResponse.json();

				// Save everything to storage
				await AsyncStorage.setItem("access_token", accessToken);
				await AsyncStorage.setItem("refresh_token", refreshToken);
				await AsyncStorage.setItem("username", username);
				await AsyncStorage.setItem("user_id", id.toString());
			}

			return true;
		} catch (error) {
			console.error("Login error:", error);
			return false;
		}
	};

	// Logout function
	const logout = async (): Promise<void> => {
		try {
			// Clear state
			setToken(null);
			setRefreshToken(null);
			setUserId(null);
			setUsername(null);

			// Clear storage
			await AsyncStorage.removeItem("access_token");
			await AsyncStorage.removeItem("refresh_token");
			await AsyncStorage.removeItem("user_id");
			await AsyncStorage.removeItem("username");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Refresh token function
	const refreshAuthToken = async (): Promise<boolean> => {
		if (!refreshToken) return false;

		try {
			const response = await fetch(`${API_URL}/auth/jwt/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ refresh: refreshToken }),
			});

			if (!response.ok) {
				// If refresh fails, clear tokens and return false
				await logout();
				return false;
			}

			const data = await response.json();
			setToken(data.access);

			// Save new access token
			await AsyncStorage.setItem("access_token", data.access);

			return true;
		} catch (error) {
			console.error("Token refresh error:", error);
			return false;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				refreshToken,
				userId,
				username,
				isAuthenticated: !!token,
				login,
				logout,
				refreshAuthToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
