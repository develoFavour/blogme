"use client";

import { useContext, useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	TextInput,
	ScrollView,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { PostContext, type Post } from "../../context/PostContext";
import { UserContext } from "../../context/UserContext";

export default function PostDetailScreen() {
	const { id } = useLocalSearchParams();
	const { posts, likePost, unlikePost, isPostLiked, addComment } =
		useContext(PostContext);
	const { currentUser, users, followUser, unfollowUser } =
		useContext(UserContext);
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);
	const [commentText, setCommentText] = useState("");
	const router = useRouter();

	useEffect(() => {
		if (id) {
			const foundPost = posts.find((p) => p.id === id);
			setPost(foundPost || null);
		}
		setLoading(false);
	}, [id, posts]);

	const handleLikeToggle = () => {
		if (!post) return;

		if (isPostLiked(post.id)) {
			unlikePost(post.id);
		} else {
			likePost(post.id);
		}
	};

	const handleAddComment = () => {
		if (!post || !commentText.trim()) return;

		addComment(post.id, commentText);
		setCommentText("");
	};

	const handleUserPress = (username: string) => {
		router.push({
			pathname: "/user/[username]",
			params: { username },
		});
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#1DA1F2" />
			</View>
		);
	}

	if (!post) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Post not found</Text>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>Go Back</Text>
				</TouchableOpacity>
			</View>
		);
	}

	const formattedDate = formatDistanceToNow(new Date(post.timestamp), {
		addSuffix: true,
	});
	const hasLiked = isPostLiked(post.id);

	// Find the post author in the users list
	const postAuthor = users.find((user) => user.username === post.username);

	// Check if current user is following the post author
	const isFollowing =
		postAuthor && currentUser?.following.includes(postAuthor.id);

	// Don't show follow button for current user's posts
	const isCurrentUser = postAuthor?.id === currentUser?.id;

	const handleFollowToggle = () => {
		if (!postAuthor) return;

		if (isFollowing) {
			unfollowUser(postAuthor.id);
		} else {
			followUser(postAuthor.id);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Stack.Screen
				options={{
					title: "Post",
					headerBackTitle: "Back",
				}}
			/>
			<ScrollView style={styles.scrollView}>
				<View style={styles.postContainer}>
					<TouchableOpacity
						style={styles.header}
						onPress={() => handleUserPress(post.username)}
						activeOpacity={0.7}
					>
						<View style={styles.userInfo}>
							<Image source={{ uri: post.userAvatar }} style={styles.avatar} />
							<View>
								<Text style={styles.username}>@{post.username}</Text>
								<Text style={styles.timestamp}>{formattedDate}</Text>
							</View>
						</View>

						{!isCurrentUser && postAuthor && (
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
					</TouchableOpacity>

					<Text style={styles.text}>{post.text}</Text>

					{post.image && (
						<Image source={{ uri: post.image }} style={styles.postImage} />
					)}

					<View style={styles.stats}>
						<Text style={styles.statsText}>
							<Text style={styles.statsNumber}>{post.likes}</Text> likes
						</Text>
						<Text style={styles.statsText}>
							<Text style={styles.statsNumber}>{post.comments.length}</Text>{" "}
							comments
						</Text>
					</View>

					<View style={styles.actions}>
						<TouchableOpacity
							style={styles.actionButton}
							onPress={handleLikeToggle}
						>
							<Ionicons
								name={hasLiked ? "heart" : "heart-outline"}
								size={24}
								color={hasLiked ? "#FF3B30" : "#666"}
							/>
							<Text style={styles.actionText}>Like</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton}>
							<Ionicons name="chatbubble-outline" size={24} color="#666" />
							<Text style={styles.actionText}>Comment</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionButton}>
							<Ionicons name="share-outline" size={24} color="#666" />
							<Text style={styles.actionText}>Share</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.commentsSection}>
						<Text style={styles.commentsHeader}>Comments</Text>

						<View style={styles.commentInputContainer}>
							<Image
								source={{ uri: currentUser?.avatar }}
								style={styles.commentAvatar}
							/>
							<TextInput
								style={styles.commentInput}
								placeholder="Write a comment..."
								value={commentText}
								onChangeText={setCommentText}
								multiline
							/>
							<TouchableOpacity
								style={[
									styles.sendButton,
									!commentText.trim() && styles.disabledButton,
								]}
								onPress={handleAddComment}
								disabled={!commentText.trim()}
							>
								<Ionicons
									name="send"
									size={20}
									color={commentText.trim() ? "#1DA1F2" : "#A5D8FA"}
								/>
							</TouchableOpacity>
						</View>

						{post.comments.length === 0 ? (
							<Text style={styles.noCommentsText}>
								No comments yet. Be the first to comment!
							</Text>
						) : (
							post.comments.map((comment) => {
								const commentUser = users.find(
									(u) => u.username === comment.username
								);
								return (
									<View key={comment.id} style={styles.comment}>
										<TouchableOpacity
											onPress={() => handleUserPress(comment.username)}
										>
											<Image
												source={{
													uri:
														commentUser?.avatar ||
														"https://randomuser.me/api/portraits/men/1.jpg",
												}}
												style={styles.commentAvatar}
											/>
										</TouchableOpacity>
										<View style={styles.commentContent}>
											<TouchableOpacity
												onPress={() => handleUserPress(comment.username)}
											>
												<Text style={styles.commentUsername}>
													@{comment.username}
												</Text>
											</TouchableOpacity>
											<Text style={styles.commentText}>{comment.text}</Text>
											<Text style={styles.commentTimestamp}>
												{formatDistanceToNow(new Date(comment.timestamp), {
													addSuffix: true,
												})}
											</Text>
										</View>
									</View>
								);
							})
						)}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	scrollView: {
		flex: 1,
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
	postContainer: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		margin: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 1,
		elevation: 1,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	username: {
		fontWeight: "bold",
		fontSize: 16,
	},
	timestamp: {
		fontSize: 14,
		color: "#666",
	},
	followButton: {
		backgroundColor: "#1DA1F2",
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
	},
	followButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 14,
	},
	followingButton: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#1DA1F2",
	},
	followingButtonText: {
		color: "#1DA1F2",
	},
	text: {
		fontSize: 18,
		marginBottom: 15,
		lineHeight: 24,
	},
	postImage: {
		width: "100%",
		height: 300,
		borderRadius: 10,
		marginBottom: 15,
	},
	stats: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#eee",
		paddingTop: 15,
		marginBottom: 15,
	},
	statsText: {
		marginRight: 20,
		color: "#666",
	},
	statsNumber: {
		fontWeight: "bold",
		color: "#333",
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-around",
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: "#eee",
		paddingVertical: 10,
		marginBottom: 15,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	actionText: {
		marginLeft: 5,
		color: "#666",
	},
	commentsSection: {
		marginTop: 10,
	},
	commentsHeader: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
	},
	commentInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	commentAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
	commentInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 10,
		maxHeight: 100,
	},
	sendButton: {
		marginLeft: 10,
		padding: 10,
	},
	disabledButton: {
		opacity: 0.5,
	},
	noCommentsText: {
		textAlign: "center",
		color: "#666",
		fontStyle: "italic",
		marginVertical: 20,
	},
	comment: {
		flexDirection: "row",
		marginBottom: 15,
	},
	commentContent: {
		flex: 1,
		backgroundColor: "#f8f8f8",
		borderRadius: 15,
		padding: 10,
	},
	commentUsername: {
		fontWeight: "bold",
		marginBottom: 5,
	},
	commentText: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 5,
	},
	commentTimestamp: {
		fontSize: 12,
		color: "#666",
		alignSelf: "flex-end",
	},
});
