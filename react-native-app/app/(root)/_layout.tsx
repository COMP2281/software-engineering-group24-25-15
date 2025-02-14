import { Slot, Redirect } from "expo-router";

const AppLayout = () => {
	const isLoggedIn = true;

	if (!isLoggedIn) return <Redirect href="/sign-in" />;

	return <Slot />;
};

export default AppLayout;
