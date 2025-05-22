"use client";

import { useContext, useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
	Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { UserContext, type User } from "../../context/UserContext";
import { PostContext } from "../../context/PostContext";
import Post from "../../components/Post";

const HEADER_MAX_HEIGHT = 250;
const HEADER_MIN_HEIGHT = 85;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function UserProfileScreen() {
	const { username } = useLocalSearchParams();
	const { users, currentUser, followUser, unfollowUser } =
		useContext(UserContext);
	const { getUserPosts } = useContext(PostContext);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("posts");
	const router = useRouter();

	const scrollY = useRef(new Animated.Value(0)).current;
	const headerHeight = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE],
		outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: "clamp",
	});

	const headerOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [1, 0.5, 0],
		extrapolate: "clamp",
	});

	const nameOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
		outputRange: [0, 0.5, 1],
		extrapolate: "clamp",
	});

	useEffect(() => {
		if (username) {
			const foundUser = users.find((u) => u.username === username);
			setUser(foundUser || null);
		}
		setLoading(false);
	}, [username, users]);

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#1DA1F2" />
			</View>
		);
	}

	if (!user) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>User not found</Text>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const userPosts = getUserPosts(user.username);
	const isCurrentUser = user.id === currentUser?.id;
	const isFollowing = currentUser?.following.includes(user.id) || false;
	const followers = users.filter((u) => u.followers.includes(user.id));
	const following = users.filter((u) => user.following.includes(u.id));

	const handleFollowToggle = () => {
		if (isFollowing) {
			unfollowUser(user.id);
		} else {
			followUser(user.id);
		}
	};

	const handleUserPress = (username: string) => {
		router.push({
			pathname: "/user/[username]",
			params: { username },
		});
	};

	const renderContent = () => {
		switch (activeTab) {
			case "posts":
				return (
					<Animated.FlatList
						data={userPosts}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <Post post={item} />}
						contentContainerStyle={[
							styles.listContent,
							{ paddingTop: HEADER_MAX_HEIGHT + 50 },
						]}
						ListEmptyComponent={
							<Text style={styles.emptyText}>No posts yet</Text>
						}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: scrollY } } }],
							{ useNativeDriver: false }
						)}
						scrollEventThrottle={16}
					/>
				);
			case "followers":
				return (
					<Animated.FlatList
						data={followers}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => handleUserPress(item.username)}>
								<View style={styles.userCard}>
									<Image
										source={{ uri: item.avatar }}
										style={styles.userCardAvatar}
									/>
									<View style={styles.userCardInfo}>
										<Text style={styles.userCardName}>{item.name}</Text>
										<Text style={styles.userCardUsername}>
											@{item.username}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
						contentContainerStyle={[
							styles.listContent,
							{ paddingTop: HEADER_MAX_HEIGHT + 50 },
						]}
						ListEmptyComponent={
							<Text style={styles.emptyText}>No followers yet</Text>
						}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: scrollY } } }],
							{ useNativeDriver: false }
						)}
						scrollEventThrottle={16}
					/>
				);
			case "following":
				return (
					<Animated.FlatList
						data={following}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => handleUserPress(item.username)}>
								<View style={styles.userCard}>
									<Image
										source={{ uri: item.avatar }}
										style={styles.userCardAvatar}
									/>
									<View style={styles.userCardInfo}>
										<Text style={styles.userCardName}>{item.name}</Text>
										<Text style={styles.userCardUsername}>
											@{item.username}
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						)}
						contentContainerStyle={[
							styles.listContent,
							{ paddingTop: HEADER_MAX_HEIGHT + 50 },
						]}
						ListEmptyComponent={
							<Text style={styles.emptyText}>Not following anyone yet</Text>
						}
						onScroll={Animated.event(
							[{ nativeEvent: { contentOffset: { y: scrollY } } }],
							{ useNativeDriver: false }
						)}
						scrollEventThrottle={16}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen
				options={{
					title: user.name,
					headerBackTitle: "Back",
				}}
			/>

			{/* Collapsible Header */}
			<Animated.View style={[styles.header, { height: headerHeight }]}>
				<Animated.View
					style={[styles.profileHeader, { opacity: headerOpacity }]}
				>
					<Image source={{ uri: user.avatar }} style={styles.avatar} />

					<View style={styles.profileInfo}>
						<Text style={styles.name}>{user.name}</Text>
						<Text style={styles.username}>@{user.username}</Text>
						<Text style={styles.bio}>{user.bio}</Text>

						<View style={styles.statsContainer}>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>{userPosts.length}</Text>
								<Text style={styles.statLabel}>Posts</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>{followers.length}</Text>
								<Text style={styles.statLabel}>Followers</Text>
							</View>
							<View style={styles.stat}>
								<Text style={styles.statNumber}>{following.length}</Text>
								<Text style={styles.statLabel}>Following</Text>
							</View>
						</View>

						{!isCurrentUser && (
							<TouchableOpacity
								style={[
									styles.followButton,
									isFollowing ? styles.followingButton : {},
								]}
								onPress={handleFollowToggle}
							>
								<Text
									style={[
										styles.followButtonText,
										isFollowing ? styles.followingButtonText : {},
									]}
								>
									{isFollowing ? "Following" : "Follow"}
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</Animated.View>

				{/* Compact header that appears when scrolling */}
				<Animated.View style={[styles.compactHeader, { opacity: nameOpacity }]}>
					<Image source={{ uri: user.avatar }} style={styles.compactAvatar} />
					<Text style={styles.compactName}>{user.name}</Text>
				</Animated.View>

				<View style={styles.tabsContainer}>
					<TouchableOpacity
						style={[styles.tab, activeTab === "posts" && styles.activeTab]}
						onPress={() => setActiveTab("posts")}
					>
						<Ionicons
							name="grid-outline"
							size={22}
							color={activeTab === "posts" ? "#1DA1F2" : "#666"}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, activeTab === "followers" && styles.activeTab]}
						onPress={() => setActiveTab("followers")}
					>
						<Ionicons
							name="people-outline"
							size={22}
							color={activeTab === "followers" ? "#1DA1F2" : "#666"}
						/>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tab, activeTab === "following" && styles.activeTab]}
						onPress={() => setActiveTab("following")}
					>
						<Ionicons
							name="person-add-outline"
							size={22}
							color={activeTab === "following" ? "#1DA1F2" : "#666"}
						/>
					</TouchableOpacity>
				</View>
			</Animated.View>

			{renderContent()}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		fontSize: 18,
		color: "#666",
		marginBottom: 20,
		textAlign: "center",
	},
	backButton: {
		backgroundColor: "#1DA1F2",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 25,
	},
	backButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	header: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: "white",
		zIndex: 1000,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		overflow: "hidden",
	},
	profileHeader: {
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	avatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 10,
	},
	profileInfo: {
		marginTop: 10,
	},
	name: {
		fontSize: 20,
		fontWeight: "bold",
	},
	username: {
		fontSize: 16,
		color: "#666",
		marginBottom: 10,
	},
	bio: {
		fontSize: 16,
		marginBottom: 15,
		lineHeight: 22,
	},
	compactHeader: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: HEADER_MIN_HEIGHT - 50,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		backgroundColor: "white",
	},
	compactAvatar: {
		width: 30,
		height: 30,
		borderRadius: 15,
		marginRight: 10,
	},
	compactName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	statsContainer: {
		flexDirection: "row",
		marginBottom: 15,
	},
	stat: {
		marginRight: 20,
	},
	statNumber: {
		fontSize: 16,
		fontWeight: "bold",
	},
	statLabel: {
		fontSize: 14,
		color: "#666",
	},
	followButton: {
		backgroundColor: "#1DA1F2",
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 15,
		alignSelf: "flex-start",
	},
	followButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	followingButton: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#1DA1F2",
	},
	followingButtonText: {
		color: "#1DA1F2",
	},
	tabsContainer: {
		flexDirection: "row",
		backgroundColor: "white",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		height: 50,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	activeTab: {
		borderBottomColor: "#1DA1F2",
	},
	listContent: {
		padding: 10,
	},
	emptyText: {
		textAlign: "center",
		padding: 20,
		color: "#666",
	},
	userCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
	},
	userCardAvatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 15,
	},
	userCardInfo: {
		flex: 1,
	},
	userCardName: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 3,
	},
	userCardUsername: {
		color: "#666",
		fontSize: 14,
	},
});
