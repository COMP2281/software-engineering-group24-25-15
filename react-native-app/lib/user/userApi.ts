import { ApiError } from "../auth/authApi";
import { API_URL } from "../../constants/config";

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

export interface CheckActivationData {
	username: string;
	email: string;
	password: string;
}

export const checkVerifiedEmail = async (userData: CheckActivationData): Promise<boolean> => {
	try {
		console.log(userData);
		const response = await fetch(`${API_URL}/check_user_activation/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || errorData.message || "Failed to verify email");
		}

		const data = await response.json();
		return data.active === true;
	} catch (error) {
		console.error("Error checking verification status:", error);
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Failed to verify email: Unknown error");
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
			const errorData = await response.json();
			throw new Error(errorData.detail || errorData.message || "Failed to resend verification email");
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Email resend failed: ${error.message}`);
		}
		throw new Error("Email resend failed: Unknown error");
	}
};

export const resetPassword = async (email: string): Promise<{ success: boolean }> => {
	try {
		const response = await fetch(`${API_URL}/auth/users/custom_reset_password/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.detail || errorData.message || "Failed to reset password");
		}

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Password reset failed: ${error.message}`);
		}
		throw new Error("Password reset failed: Unknown error");
	}
};
