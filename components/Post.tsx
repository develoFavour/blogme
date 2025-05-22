"use client";

import type React from "react";

import { useState, useContext } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { type Post as PostType, PostContext } from "../context/PostContext";
import { UserContext } from "../context/UserContext";
import { useRouter } from "expo-router";

type PostProps = {
	post: PostType;
};

const Post: React.FC<PostProps> = ({ post }) => {
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");
	const { likePost, unlikePost, isPostLiked, addComment } =
		useContext(PostContext);
	const { currentUser, followUser, unfollowUser, users } =
		useContext(UserContext);
	const router = useRouter();

	const handleLikeToggle = () => {
		if (isPostLiked(post.id)) {
			unlikePost(post.id);
		} else {
			likePost(post.id);
		}
	};

	const handleAddComment = () => {
		if (commentText.trim()) {
			addComment(post.id, commentText);
			setCommentText("");
		}
	};

	const formattedDate = formatDistanceToNow(new Date(post.timestamp), {
		addSuffix: true,
	});

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

	// Check if the current user has liked this post
	const hasLiked = isPostLiked(post.id);

	const navigateToPostDetail = () => {
		router.push({
			pathname: "/post/[id]",
			params: { id: post.id },
		});
	};

	const navigateToUserProfile = () => {
		router.push({
			pathname: "/user/[username]",
			params: { username: post.username },
		});
	};

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={navigateToPostDetail}
			activeOpacity={0.9}
		>
			<View style={styles.header}>
				<TouchableOpacity
					style={styles.userInfo}
					onPress={navigateToUserProfile}
					activeOpacity={0.7}
				>
					<Image source={{ uri: post.userAvatar }} style={styles.avatar} />
					<View>
						<Text style={styles.username}>@{post.username}</Text>
						<Text style={styles.timestamp}>{formattedDate}</Text>
					</View>
				</TouchableOpacity>

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
			</View>

			<Text style={styles.text}>{post.text}</Text>

			{post.image && (
				<Image source={{ uri: post.image }} style={styles.postImage} />
			)}

			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.actionButton}
					onPress={handleLikeToggle}
				>
					<Ionicons
						name={hasLiked ? "heart" : "heart-outline"}
						size={20}
						color={hasLiked ? "#FF3B30" : "#666"}
					/>
					<Text style={styles.actionText}>{post.likes}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.actionButton}
					onPress={() => setShowComments(!showComments)}
				>
					<Ionicons name="chatbubble-outline" size={20} color="#666" />
					<Text style={styles.actionText}>{post.comments.length}</Text>
				</TouchableOpacity>
			</View>

			{showComments && (
				<View style={styles.commentsSection}>
					<View style={styles.commentInputContainer}>
						<TextInput
							style={styles.commentInput}
							placeholder="Add a comment..."
							value={commentText}
							onChangeText={setCommentText}
						/>
						<TouchableOpacity onPress={handleAddComment}>
							<Ionicons name="send" size={20} color="#1DA1F2" />
						</TouchableOpacity>
					</View>

					{post.comments.map((comment) => (
						<View key={comment.id} style={styles.comment}>
							<Text style={styles.commentUsername}>@{comment.username}</Text>
							<Text style={styles.commentText}>{comment.text}</Text>
						</View>
					))}
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
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
		marginBottom: 10,
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
	username: {
		fontWeight: "bold",
	},
	timestamp: {
		fontSize: 12,
		color: "#666",
	},
	followButton: {
		backgroundColor: "#1DA1F2",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 15,
	},
	followButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 12,
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
		fontSize: 16,
		marginBottom: 10,
		lineHeight: 22,
	},
	postImage: {
		width: "100%",
		height: 200,
		borderRadius: 10,
		marginBottom: 10,
	},
	actions: {
		flexDirection: "row",
		borderTopWidth: 1,
		borderTopColor: "#eee",
		paddingTop: 10,
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 20,
	},
	actionText: {
		marginLeft: 5,
		color: "#666",
	},
	commentsSection: {
		marginTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#eee",
		paddingTop: 10,
	},
	commentInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	commentInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 8,
		marginRight: 10,
	},
	comment: {
		marginBottom: 8,
		paddingVertical: 5,
	},
	commentUsername: {
		fontWeight: "bold",
		fontSize: 13,
	},
	commentText: {
		fontSize: 14,
	},
});

export default Post;
