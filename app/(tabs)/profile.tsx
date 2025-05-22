"use client";

import { useContext, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	FlatList,
	TouchableOpacity,
	Modal,
	TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../context/UserContext";
import { PostContext } from "../../context/PostContext";
import Post from "../../components/Post";
import UserCard from "../../components/UserCard";

export default function ProfileScreen() {
	const { currentUser, users, updateUserProfile } = useContext(UserContext);
	const { getUserPosts } = useContext(PostContext);
	const [activeTab, setActiveTab] = useState("posts");
	const [showEditModal, setShowEditModal] = useState(false);
	const [newBio, setNewBio] = useState(currentUser?.bio || "");

	if (!currentUser) return null;

	const userPosts = getUserPosts(currentUser.username);
	const followers = users.filter((user) =>
		user.followers.includes(currentUser.id)
	);
	const following = users.filter((user) =>
		currentUser.following.includes(user.id)
	);

	const handleUpdateProfile = () => {
		updateUserProfile(newBio);
		setShowEditModal(false);
	};

	const renderContent = () => {
		switch (activeTab) {
			case "posts":
				return (
					<FlatList
						data={userPosts}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <Post post={item} />}
						contentContainerStyle={styles.listContent}
						ListEmptyComponent={
							<Text style={styles.emptyText}>No posts yet</Text>
						}
					/>
				);
			case "followers":
				return (
					<FlatList
						data={followers}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <UserCard user={item} />}
						contentContainerStyle={styles.listContent}
						ListEmptyComponent={
							<Text style={styles.emptyText}>No followers yet</Text>
						}
					/>
				);
			case "following":
				return (
					<FlatList
						data={following}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => <UserCard user={item} />}
						contentContainerStyle={styles.listContent}
						ListEmptyComponent={
							<Text style={styles.emptyText}>Not following anyone yet</Text>
						}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.profileHeader}>
				<Image source={{ uri: currentUser.avatar }} style={styles.avatar} />

				<View style={styles.profileInfo}>
					<Text style={styles.name}>{currentUser.name}</Text>
					<Text style={styles.username}>@{currentUser.username}</Text>
					<Text style={styles.bio}>{currentUser.bio}</Text>

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

					<TouchableOpacity
						style={styles.editButton}
						onPress={() => setShowEditModal(true)}
					>
						<Text style={styles.editButtonText}>Edit Profile</Text>
					</TouchableOpacity>
				</View>
			</View>

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

			{renderContent()}

			<Modal visible={showEditModal} animationType="slide" transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Edit Profile</Text>

						<Text style={styles.inputLabel}>Bio</Text>
						<TextInput
							style={styles.bioInput}
							multiline
							value={newBio}
							onChangeText={setNewBio}
							placeholder="Tell us about yourself"
							maxLength={160}
						/>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => {
									setNewBio(currentUser.bio);
									setShowEditModal(false);
								}}
							>
								<Text style={styles.cancelButtonText}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.saveButton}
								onPress={handleUpdateProfile}
							>
								<Text style={styles.saveButtonText}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	profileHeader: {
		backgroundColor: "white",
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
	editButton: {
		borderWidth: 1,
		borderColor: "#1DA1F2",
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 15,
		alignSelf: "flex-start",
	},
	editButtonText: {
		color: "#1DA1F2",
		fontWeight: "bold",
	},
	tabsContainer: {
		flexDirection: "row",
		backgroundColor: "white",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	tab: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 15,
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		margin: 20,
		borderRadius: 10,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
	},
	inputLabel: {
		fontSize: 16,
		marginBottom: 5,
		color: "#666",
	},
	bioInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 5,
		padding: 10,
		minHeight: 100,
		textAlignVertical: "top",
		marginBottom: 20,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	cancelButton: {
		marginRight: 10,
		padding: 10,
	},
	cancelButtonText: {
		color: "#666",
	},
	saveButton: {
		backgroundColor: "#1DA1F2",
		padding: 10,
		borderRadius: 5,
	},
	saveButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});
