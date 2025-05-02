import { API_URL } from "@/constants/config";

export const fetchStatistics = async (token: string) => {
	try {
		const response = await fetch(`${API_URL}/game/my-statistics/`, {
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.error("Failed to fetch statistics:", response.statusText);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching statistics:", error);
		return null;
	}
};
