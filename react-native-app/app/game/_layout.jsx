import { Stack } from "expo-router/stack";

const GameLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="menu" options={{ headerShown: false }} />
		</Stack>
	);
};

export default GameLayout;
