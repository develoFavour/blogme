"use client";

import { useState, useContext } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Text,
	KeyboardAvoidingView,
	Platform,
	Image,
} from "react-native";
import { PostContext } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";
import { router } from "expo-router";

export default function CreatePostScreen() {
	const [postText, setPostText] = useState("");
	const { addPost } = useContext(PostContext);
	const { currentUser } = useContext(UserContext);
	const charLimit = 280;
	const charCount = postText.length;

	const handlePost = () => {
		if (postText.trim() && charCount <= charLimit) {
			addPost(postText);
			setPostText("");
			router.replace("/(tabs)");
		}
	};

	const isOverLimit = charCount > charLimit;

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={100}
		>
			<View style={styles.header}>
				{currentUser && (
					<Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
				)}
				<View style={styles.charCountContainer}>
					<Text
						style={[
							styles.charCount,
							isOverLimit
								? styles.overLimit
								: charCount > 240
								? styles.nearLimit
								: {},
						]}
					>
						{charCount}/{charLimit}
					</Text>
				</View>
			</View>

			<TextInput
				style={styles.input}
				placeholder="What's happening?"
				multiline
				value={postText}
				onChangeText={setPostText}
				maxLength={350}
			/>

			<View style={styles.footer}>
				<TouchableOpacity
					style={[
						styles.postButton,
						!postText.trim() || isOverLimit ? styles.disabledButton : {},
					]}
					onPress={handlePost}
					disabled={!postText.trim() || isOverLimit}
				>
					<Text style={styles.postButtonText}>Post</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		padding: 15,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	charCountContainer: {
		alignItems: "flex-end",
	},
	charCount: {
		color: "#666",
	},
	nearLimit: {
		color: "orange",
	},
	overLimit: {
		color: "red",
	},
	input: {
		flex: 1,
		fontSize: 18,
		textAlignVertical: "top",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		borderTopWidth: 1,
		borderTopColor: "#eee",
		paddingTop: 15,
	},
	postButton: {
		backgroundColor: "#1DA1F2",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 25,
	},
	disabledButton: {
		backgroundColor: "#A5D8FA",
	},
	postButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});
