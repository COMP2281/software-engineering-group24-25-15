interface RegisterUserData {
	username: string;
	email: string;
	password: string;
	re_password: string;
}

interface RegisterResponse {
	id: number;
	username: string;
	email: string;
}

interface ApiError {
	message: string;
	errors?: Record<string, string[]>;
}

export const registerUser = async (userData: RegisterUserData): Promise<RegisterResponse> => {
	try {
		const response = await fetch("http://192.168.107.203:8000/auth/users/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		console.log(response);

		if (!response.ok) {
			const errorData: ApiError = await response.json();
			throw new Error(
				errorData.message ||
					Object.entries(errorData.errors || {})
						.map(([key, errors]) => `${key}: ${errors.join(", ")}`)
						.join("; ") ||
					"Registration failed"
			);
		}

		const data: RegisterResponse = await response.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Registration failed: ${error.message}`);
		}
		throw new Error("Registration failed: Unknown error");
	}
};
