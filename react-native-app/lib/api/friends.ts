import { API_URL } from "@/constants/config";
import { ImageProps } from "react-native";

// Interface definitions
export interface Friend {
	id: number;
	username: string;
	status: string;
	avatar?: ImageProps;
}

export interface FriendRequest {
	id: number;
	from_user: {
		id: number;
		username: string;
	};
	to_user: {
		id: number;
		username: string;
	};
	created_at: string;
}

// Fetch user's friends
export const fetchFriends = async (token: string) => {
	try {
		const response = await fetch(`${API_URL}/friends/friends/`, {
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.log(`API request failed with status ${response.status}`);
			return [];
		}

		const data = await response.json();
		console.log("Fetched friends:", data);
		return data;
	} catch (err) {
		console.error("Error fetching friends:", err);
		return [];
	}
};

// Fetch received friend requests
export const fetchReceivedRequests = async (token: string) => {
	try {
		const response = await fetch(`${API_URL}/friends/requests/received/`, {
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.log(`API request failed with status ${response.status}`);
			return [];
		}

		const data = await response.json();
		console.log("Fetched received requests:", data);
		return data;
	} catch (err) {
		console.error("Error fetching received requests:", err);
		return [];
	}
};

// Fetch sent friend requests
export const fetchSentRequests = async (token: string) => {
	try {
		const response = await fetch(`${API_URL}/friends/requests/sent/`, {
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.log(`API request failed with status ${response.status}`);
			return [];
		}

		const data = await response.json();
		console.log("Fetched sent requests:", data);
		return data;
	} catch (err) {
		console.error("Error fetching sent requests:", err);
		return [];
	}
};

// Send a friend request
export const sendFriendRequest = async (token: string, toUserId: number) => {
	try {
		const response = await fetch(`${API_URL}/friends/request/send/`, {
			method: "POST",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				to_user_id: toUserId,
			}),
		});

		if (!response.ok) {
			console.log(`Failed to send friend request: ${response.status}`);
			throw new Error(`Failed to send friend request: ${response.status}`);
		}

		const data = await response.json();
		console.log("Friend request sent successfully:", data);
		return data;
	} catch (err) {
		console.error("Error sending friend request:", err);
		throw err;
	}
};

// Accept a friend request
export const acceptFriendRequest = async (token: string, requestId: number) => {
	try {
		const response = await fetch(`${API_URL}/friends/request/accept/`, {
			method: "POST",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				friend_request_id: requestId,
			}),
		});

		if (!response.ok) {
			console.log(`Failed to accept friend request: ${response.status}`);
			throw new Error(`Failed to accept friend request: ${response.status}`);
		}

		const data = await response.json();
		console.log("Friend request accepted successfully:", data);
		return data;
	} catch (err) {
		console.error("Error accepting friend request:", err);
		throw err;
	}
};

// Search for users by username
export const searchUsers = async (token: string, username: string) => {
	try {
		const response = await fetch(`${API_URL}/accounts/search/?username=${encodeURIComponent(username)}`, {
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			console.log(`API request failed with status ${response.status}`);
			return [];
		}

		const data = await response.json();
		console.log("Search results:", data);
		return data;
	} catch (err) {
		console.error("Error searching users:", err);
		return [];
	}
};

export default fetchFriends;
