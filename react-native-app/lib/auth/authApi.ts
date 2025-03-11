export interface LoginUserData {
	username: string;
	password: string;
}

export interface LoginResponse {
	access: string;
	refresh: string;
	username: string;
}

export interface ApiError {
	message?: string;
	errors?: Record<string, string[]>;
	detail?: string;
}

const API_URL = "http://192.168.0.5:8000";

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

		// Return tokens along with the username that was used to log in
		return {
			access: data.access,
			refresh: data.refresh,
			username: userData.username,
		};
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Login failed: ${error.message}`);
		}
		throw new Error("Login failed: Unknown error");
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
