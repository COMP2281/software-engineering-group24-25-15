import { ApiError } from "../auth/authApi";

const API_URL = "http://192.168.0.5:8000";

export interface RegisterUserData {
	username: string;
	email: string;
	password: string;
	re_password: string;
}

export const registerUser = async (userData: RegisterUserData): Promise<{ success: boolean }> => {
	try {
		const response = await fetch(`${API_URL}/auth/users/`, {
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
						.map(([key, errors]) => `${key}: ${(errors as string[]).join(", ")}`)
						.join("; ") ||
					"Registration failed"
			);
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Registration failed: ${error.message}`);
		}
		throw new Error("Registration failed: Unknown error");
	}
};

export const checkVerifiedEmail = async (userData: { username: string; email: string; password: string }): Promise<boolean> => {
	try {
		const response = await fetch(`${API_URL}/auth/users/me/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `JWT ${userData.password}`, // This needs to be a token in the real implementation
			},
		});

		if (!response.ok) {
			return false;
		}

		// Check if the user is verified (this depends on your backend implementation)
		const user = await response.json();
		return user.is_active === true;
	} catch (error) {
		console.error("Error checking verification status:", error);
		return false;
	}
};

export const resendEmail = async (email: string): Promise<{ success: boolean }> => {
	try {
		const response = await fetch(`${API_URL}/auth/users/resend_activation/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		if (!response.ok) {
			throw new Error("Failed to resend verification email");
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Email resend failed: ${error.message}`);
		}
		throw new Error("Email resend failed: Unknown error");
	}
};
