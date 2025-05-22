import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

					if (route.name === "index") {
						iconName = focused ? "home" : "home-outline";
					} else if (route.name === "create") {
						iconName = focused ? "add-circle" : "add-circle-outline";
					} else if (route.name === "reels") {
						iconName = focused ? "play-circle" : "play-circle-outline";
					} else if (route.name === "explore") {
						iconName = focused ? "compass" : "compass-outline";
					} else if (route.name === "profile") {
						iconName = focused ? "person" : "person-outline";
					}

					return <Ionicons name={iconName} size={size} color={color} />;
				},
				tabBarActiveTintColor: "#1DA1F2",
				tabBarInactiveTintColor: "gray",
				headerShown: true,
			})}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Feed",
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
				}}
			/>
			<Tabs.Screen
				name="create"
				options={{
					title: "Create Post",
				}}
			/>
			<Tabs.Screen
				name="reels"
				options={{
					title: "Reels",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
				}}
			/>
		</Tabs>
	);
}
