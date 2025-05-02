import { API_URL } from "@/constants/config";
import { getMockQuestions, getMockIntroduction } from "./mockQuestions";

// Interface for Question from the API
export interface Question {
	id: number;
	question: string;
	category: string;
	options: string[];
	correct_answer: string;
	hint?: string;
}

// Interface for raw Question data from the API
interface ApiQuestion {
	id: number;
	question_text: string;
	category: string;
	correct_answer: string;
	incorrect_answer1: string;
	incorrect_answer2: string;
	incorrect_answer3: string;
	hint?: string;
}

// Get questions from the API with fallback to mock data
export const getQuestions = async (token: string, category: string, n: number = 3, includeHint: boolean = true) => {
	try {
		console.log(`Fetching questions for category: ${category}, count: ${n}, hint: ${includeHint}`);

		const url = `${API_URL}/game/questions/?category=${encodeURIComponent(category)}&n=${n}&hint=${includeHint}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `JWT ${token}`,
			},
		});

		if (!response.ok) {
			console.log(`API request failed with status ${response.status}, using mock data`);
			return getMockQuestions(category, n);
		}

		const data = await response.json();
		console.log(`Successfully fetched ${data.length} questions`);

		// Transform API response to match our Question interface
		const questions: Question[] = data.map((q: ApiQuestion) => {
			// Create options array by combining correct and incorrect answers and shuffling them
			const options = [q.correct_answer, q.incorrect_answer1, q.incorrect_answer2, q.incorrect_answer3].filter((answer) => answer !== ""); // Remove any empty answers

			// Shuffle the options so correct answer isn't always first
			const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

			return {
				id: q.id,
				question: q.question_text,
				category: q.category,
				options: shuffledOptions,
				correct_answer: q.correct_answer,
				hint: q.hint ? q.hint.trim() : undefined, // Trim the hint to remove whitespace
			};
		});

		return questions;
	} catch (error) {
		console.error("Error fetching questions:", error);
		console.log("Falling back to mock data");
		return getMockQuestions(category, n);
	}
};

// Get AI response for topic introduction with fallback to mock data
export const getAIResponse = async (token: string, prompt: string) => {
	// Try to extract topic from prompt format
	const topicMatch = prompt.match(/quiz about (.*?)\./i) || prompt.match(/Introduce the topic of (.*?) in/i);
	const topic = topicMatch ? topicMatch[1] : "";

	try {
		console.log(`Fetching AI response for prompt: ${prompt}`);
		
		// Ensure the URL is correctly constructed and encoded
		const url = `${API_URL}/game/responce/?request=${encodeURIComponent(prompt)}`;
		console.log("Request URL:", url);
		
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `JWT ${token}`,
				"Accept": "application/json",
			},
		});

		// Log the response status for debugging
		console.log(`AI response status: ${response.status}`);

		if (!response.ok) {
			console.error(`AI response request failed with status ${response.status}`);
			return topic ? getMockIntroduction(topic) : "I'm your AI host for today's game. Let's test your knowledge!";
		}

		// Get the response text or JSON
		const responseData = await response.text();
		console.log("Raw AI response:", responseData);
		
		// Try to parse as JSON if possible
		let data;
		try {
			data = JSON.parse(responseData);
		} catch (e) {
			// If not JSON, use the raw text
			data = responseData;
		}

		// Extract the actual response text
		const responseText = typeof data === "string" ? data : (
			data?.response || 
			(typeof data === "object" ? JSON.stringify(data) : data.toString())
		);
		
		console.log("Processed AI response:", responseText);

		// Improved generic response detection - only filter out very obvious generic responses
		const genericResponses = [
			/^how can i assist you/i, 
			/^how may i help you/i, 
			/^i'm here to help/i, 
			/^hello\s+there/i,
			/^hi\s+there/i
		];

		// Check if this is a generic response (starts with generic phrase AND is very short)
		const isGenericResponse =
			genericResponses.some((pattern) => pattern.test(responseText.trim())) &&
			responseText.trim().split(/\s+/).length < 8; // More generous length threshold

		if (isGenericResponse && topic) {
			console.log("Detected generic AI response:", responseText);
			console.log("Falling back to mock introduction for topic:", topic);
			return getMockIntroduction(topic);
		}

		// If response is too short (likely error), fallback to mock
		if (responseText.trim().length < 15 && topic) {
			console.log("AI response too short, using mock data");
			return getMockIntroduction(topic);
		}

		return responseText;
	} catch (error) {
		console.error("Error getting AI response:", error);
		console.log("Falling back to mock introduction");
		return topic ? getMockIntroduction(topic) : "I'm your AI host for today's game. Let's test your knowledge!";
	}
};

// Update user statistics
export const updateStatistics = async (token: string, score: number) => {
	try {
		console.log(`Updating statistics with score: ${score}`);

		const response = await fetch(`${API_URL}/game/my-statistics/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `JWT ${token}`,
			},
			body: JSON.stringify({
				score: score, // Ensure parameter name is explicitly 'score'
			}),
		});

		if (!response.ok) {
			console.log(`Failed to update statistics: ${response.status}`);
			throw new Error(`Failed to update statistics: ${response.status}`);
		}

		const data = await response.json();
		console.log("Successfully updated statistics");
		return data;
	} catch (error) {
		console.error("Error updating statistics:", error);
		return { success: false, error: error instanceof Error ? error.message : String(error) };
	}
};
