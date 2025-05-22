import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../context/UserContext";
import { PostProvider } from "../context/PostContext";

export default function RootLayout() {
	return (
		<UserProvider>
			<PostProvider>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
				<StatusBar style="auto" />
			</PostProvider>
		</UserProvider>
	);
}
