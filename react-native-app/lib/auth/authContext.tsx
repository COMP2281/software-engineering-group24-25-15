import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshToken } from "./authApi";

// Define the shape of our auth state
interface AuthState {
	isLoggedIn: boolean;
	username: string | null;
	accessToken: string | null;
	refreshToken: string | null;
}

// Define the shape of our context
interface AuthContextType extends AuthState {
	login: (accessToken: string, refreshToken: string, username: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshAccessToken: () => Promise<boolean>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
	ACCESS_TOKEN: "auth_access_token",
	REFRESH_TOKEN: "auth_refresh_token",
	USERNAME: "auth_username",
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [authState, setAuthState] = useState<AuthState>({
		isLoggedIn: false,
		username: null,
		accessToken: null,
		refreshToken: null,
	});
	const [isLoading, setIsLoading] = useState(true);

	// Load auth state from storage on initial mount
	useEffect(() => {
		const loadAuthState = async () => {
			try {
				setIsLoading(true);
				const [accessToken, refreshTokenValue, username] = await Promise.all([
					AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
					AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
					AsyncStorage.getItem(STORAGE_KEYS.USERNAME),
				]);

				if (accessToken && refreshTokenValue && username) {
					setAuthState({
						isLoggedIn: true,
						username,
						accessToken,
						refreshToken: refreshTokenValue,
					});
				}
			} catch (error) {
				console.error("Failed to load auth state", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadAuthState();
	}, []);

	// Login function
	const login = async (accessToken: string, refreshTokenValue: string, username: string) => {
		try {
			// Save to storage
			await Promise.all([
				AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
				AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshTokenValue),
				AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username),
			]);

			// Update state
			setAuthState({
				isLoggedIn: true,
				username,
				accessToken,
				refreshToken: refreshTokenValue,
			});
		} catch (error) {
			console.error("Failed to save auth state", error);
			throw error;
		}
	};

	// Logout function
	const logout = async () => {
		try {
			// Clear storage
			await Promise.all([
				AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
				AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
				AsyncStorage.removeItem(STORAGE_KEYS.USERNAME),
			]);

			// Update state
			setAuthState({
				isLoggedIn: false,
				username: null,
				accessToken: null,
				refreshToken: null,
			});
		} catch (error) {
			console.error("Failed to clear auth state", error);
			throw error;
		}
	};

	// Refresh token function
	const refreshAccessToken = async (): Promise<boolean> => {
		try {
			if (!authState.refreshToken) return false;

			const data = await refreshToken(authState.refreshToken);

			// Save new access token
			await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access);

			// Update state
			setAuthState((prev) => ({
				...prev,
				accessToken: data.access,
			}));

			return true;
		} catch (error) {
			console.error("Failed to refresh token", error);
			return false;
		}
	};

	// Create context value object
	const value: AuthContextType = {
		...authState,
		login,
		logout,
		refreshAccessToken,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
