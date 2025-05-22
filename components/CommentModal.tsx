"use client";

import { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	FlatList,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";

type Comment = {
	id: string;
	username: string;
	userAvatar: string;
	text: string;
	timestamp: string;
	likes: number;
};

type CommentModalProps = {
	visible: boolean;
	onClose: () => void;
	videoId: string | null;
	comments: Comment[];
	onAddComment: (videoId: string, text: string) => void;
};

const CommentModal = ({
	visible,
	onClose,
	videoId,
	comments,
	onAddComment,
}: CommentModalProps) => {
	const [commentText, setCommentText] = useState("");

	const handleSubmitComment = () => {
		if (commentText.trim() && videoId) {
			onAddComment(videoId, commentText);
			setCommentText("");
		}
	};

	const renderComment = ({ item }: { item: Comment }) => {
		const formattedDate = formatDistanceToNow(new Date(item.timestamp), {
			addSuffix: true,
		});

		return (
			<View style={styles.commentItem}>
				<Image source={{ uri: item.userAvatar }} style={styles.commentAvatar} />
				<View style={styles.commentContent}>
					<Text style={styles.commentUsername}>{item.username}</Text>
					<Text style={styles.commentText}>{item.text}</Text>
					<View style={styles.commentFooter}>
						<Text style={styles.commentTime}>{formattedDate}</Text>
						<View style={styles.commentLikes}>
							<Text style={styles.commentLikesCount}>{item.likes}</Text>
							<Ionicons name="heart-outline" size={14} color="#666" />
						</View>
					</View>
				</View>
			</View>
		);
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Comments</Text>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<Ionicons name="close" size={24} color="#333" />
						</TouchableOpacity>
					</View>

					<FlatList
						data={comments}
						keyExtractor={(item) => item.id}
						renderItem={renderComment}
						contentContainerStyle={styles.commentsList}
						ListEmptyComponent={
							<View style={styles.emptyContainer}>
								<Text style={styles.emptyText}>
									No comments yet. Be the first to comment!
								</Text>
							</View>
						}
					/>

					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
						style={styles.inputContainer}
					>
						<TextInput
							style={styles.input}
							placeholder="Add a comment..."
							value={commentText}
							onChangeText={setCommentText}
							multiline
						/>
						<TouchableOpacity
							style={[
								styles.sendButton,
								!commentText.trim() && styles.disabledButton,
							]}
							onPress={handleSubmitComment}
							disabled={!commentText.trim()}
						>
							<Ionicons
								name="send"
								size={20}
								color={commentText.trim() ? "#1DA1F2" : "#A5D8FA"}
							/>
						</TouchableOpacity>
					</KeyboardAvoidingView>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		height: "80%",
		paddingBottom: Platform.OS === "ios" ? 30 : 0,
	},
	modalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		paddingVertical: 15,
		position: "relative",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	closeButton: {
		position: "absolute",
		right: 15,
	},
	commentsList: {
		padding: 15,
	},
	commentItem: {
		flexDirection: "row",
		marginBottom: 20,
	},
	commentAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
	commentContent: {
		flex: 1,
	},
	commentUsername: {
		fontWeight: "bold",
		marginBottom: 3,
	},
	commentText: {
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 5,
	},
	commentFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	commentTime: {
		fontSize: 12,
		color: "#666",
	},
	commentLikes: {
		flexDirection: "row",
		alignItems: "center",
	},
	commentLikesCount: {
		fontSize: 12,
		color: "#666",
		marginRight: 3,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "#eee",
		padding: 10,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 20,
		paddingHorizontal: 15,
		paddingVertical: 8,
		maxHeight: 100,
	},
	sendButton: {
		marginLeft: 10,
		padding: 10,
	},
	disabledButton: {
		opacity: 0.5,
	},
	emptyContainer: {
		padding: 20,
		alignItems: "center",
	},
	emptyText: {
		color: "#666",
		textAlign: "center",
	},
});

export default CommentModal;
