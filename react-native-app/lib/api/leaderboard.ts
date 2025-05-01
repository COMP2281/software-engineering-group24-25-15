import { API_URL } from "@/constants/config";

export interface LeaderboardEntry {
	username: string;
	score: number;
	games: number;
	wins: number;
}

export interface LeaderboardResponse {
	entries: LeaderboardEntry[];
}

export const fetchLeaderboard = async (token: string): Promise<LeaderboardResponse | null> => {
	try {
		const response = await fetch(`${API_URL}/game/user-statistics/all/`, {
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.log(`API request failed with status ${response.status}`);
			return null;
		}

		const data = await response.json();
		console.log("Fetched leaderboard:", data);
		return data;
	} catch (err) {
		console.error("Error fetching leaderboard:", err);
		return null;
	}
};
