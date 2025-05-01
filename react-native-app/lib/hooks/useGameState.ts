import { useState, useMemo } from "react";
import { Question } from "@/lib/api/gameService";

export function useGameState() {
	// State variables with safe defaults
	const [loading, setLoading] = useState(true);
	const [questions, setQuestions] = useState<Question[][]>([]);
	const [hostIntroductions, setHostIntroductions] = useState<string[]>([]);
	const [currentRound, setCurrentRound] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [gameStage, setGameStage] = useState<"introduction" | "question" | "roundSummary" | "gameSummary">("introduction");

	const [hintUsed, setHintUsed] = useState(false);
	const [eliminationUsed, setEliminationUsed] = useState(false);
	const [eliminatedOptions, setEliminatedOptions] = useState<boolean[]>([]);
	const [timeLeft, setTimeLeft] = useState(20);
	const [totalScore, setTotalScore] = useState(0);
	const [roundScore, setRoundScore] = useState(0);
	const [correctCount, setCorrectCount] = useState(0);
	const [botScores, setBotScores] = useState<number[]>([0, 0, 0]);

	// Get current question based on round and question index - with safer access
	const currentQuestion = useMemo(() => {
		if (Array.isArray(questions) && questions.length > 0 && questions[currentRound] && questions[currentRound].length > 0) {
			// fallback to first question if currentQuestionIndex is out of bounds
			return questions[currentRound][currentQuestionIndex] || questions[currentRound][0];
		}
		return null;
	}, [questions, currentRound, currentQuestionIndex]);

	return {
		loading,
		setLoading,
		questions,
		setQuestions,
		hostIntroductions,
		setHostIntroductions,
		currentRound,
		setCurrentRound,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		gameStage,
		setGameStage,
		hintUsed,
		setHintUsed,
		eliminationUsed,
		setEliminationUsed,
		eliminatedOptions,
		setEliminatedOptions,
		timeLeft,
		setTimeLeft,
		totalScore,
		setTotalScore,
		roundScore,
		setRoundScore,
		correctCount,
		setCorrectCount,
		botScores,
		setBotScores,
		currentQuestion,
	};
}

export type GameState = ReturnType<typeof useGameState>;
