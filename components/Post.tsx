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

type PostProps = {
	post: PostType;
};
type Comment = {
	id: string;
	username: string;
	text: string;
	timestamp: string;
};

const Post: React.FC<PostProps> = ({ post }) => {
	const [showComments, setShowComments] = useState(false);
	const [commentText, setCommentText] = useState("");
	const { likePost, addComment, isPostLiked } = useContext(PostContext);
	console.log("Is post liked", isPostLiked(post.id));

	const handleLike = () => {
		likePost(post.id);
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

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Image source={{ uri: post.userAvatar }} style={styles.avatar} />
				<View>
					<Text style={styles.username}>@{post.username}</Text>
					<Text style={styles.timestamp}>{formattedDate}</Text>
				</View>
			</View>

			<Text style={styles.text}>{post.text}</Text>

			{post.image && (
				<Image source={{ uri: post.image }} style={styles.postImage} />
			)}

			<View style={styles.actions}>
				<TouchableOpacity style={styles.actionButton} onPress={handleLike}>
					<Ionicons
						name="heart-outline"
						size={20}
						color={isPostLiked(post.id) ? "red" : "#666"}
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
						r
						<TouchableOpacity onPress={handleAddComment}>
							<Ionicons name="send" size={20} color="#1DA1F2" />
						</TouchableOpacity>
					</View>

					{post.comments.map((comment: Comment) => (
						<View key={comment.id} style={styles.comment}>
							<Text style={styles.commentUsername}>@{comment.username}</Text>
							<Text style={styles.commentText}>{comment.text}</Text>
						</View>
					))}
				</View>
			)}
		</View>
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
		marginBottom: 10,
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
