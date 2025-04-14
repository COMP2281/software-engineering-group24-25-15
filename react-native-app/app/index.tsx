import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth/authContext";

export default function RootIndex() {
	const { isAuthenticated } = useAuth();

	// Redirect to tabs if authenticated, otherwise go to sign-in
	return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/sign-in" />;
}
