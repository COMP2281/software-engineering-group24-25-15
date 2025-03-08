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

export const registerUser = async (userData: RegisterUserData): Promise<RegisterResponse> => {
	try {
		const response = await fetch("http://192.168.174.203:8000/auth/users/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.username || errorData.password || "Registration failed");
		}

		const data: RegisterResponse = await response.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		}
		throw new Error("Registration failed: Unknown error");
	}
};

// export const verifyEmail = async (username: string): Promise<void> => {
// 	try {
// 		const response = await fetch(`http://
