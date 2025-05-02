export interface LoginUserData {
	username: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
	username: string;
	id: number;
}

export interface ApiError {
	message?: string;
	errors?: Record<string, string[]>;
	detail?: string;
}

import { API_URL } from "@/constants/config";

export const loginUser = async (userData: LoginUserData): Promise<LoginResponse> => {
	try {
		const response = await fetch(`${API_URL}/auth/jwt/create/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		const data = await response.json();

		if (!response.ok) {
			const errorData = data as ApiError;
			throw new Error(
				errorData.detail ||
					errorData.message ||
					Object.entries(errorData.errors || {})
						.map(([key, errors]) => `${key}: ${errors.join(", ")}`)
						.join("; ") ||
					"Login failed"
			);
		}

		const id = await findUserId(userData.username, data.access);

		// Return tokens along with the username that was used to log in
		return {
			access: data.access,
			refresh: data.refresh,
			username: userData.username,
			id: id,
		};
	} catch (error) {
		console.error("Login fetch error:", error);
		if (error instanceof TypeError && error.message === "Network request failed") {
			throw new Error(`Network request failed. Please check if the API server is running and accessible at ${API_URL}`);
		}
		throw error;
	}
};

const findUserId = async (username: string, token: string): Promise<number> => {
	try {
		const response = await fetch(`${API_URL}/accounts/retrieve-user/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `JWT ${token}`,
			},
			body: JSON.stringify({ username }),
		});

		if (response.ok) {
			const data = await response.json();
			return data.id;
		} else {
			console.error("Failed to find user ID:", response.statusText);
			return 0;
		}
	} catch (error) {
		console.error("Error finding user ID:", error);
		return 0;
	}
};

export const refreshToken = async (refreshToken: string): Promise<{ access: string }> => {
	try {
		const response = await fetch(`${API_URL}/auth/jwt/refresh/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refresh: refreshToken }),
		});

		if (!response.ok) {
			throw new Error("Failed to refresh token");
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Token refresh failed: ${error.message}`);
		}
		throw new Error("Token refresh failed: Unknown error");
	}
};
