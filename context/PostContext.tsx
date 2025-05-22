"use client";
import { UserContext } from "./UserContext";
import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { samplePosts } from "../data/sampleData";

export type Comment = {
	id: string;
	postId: string;
	username: string;
	text: string;
	timestamp: string;
};

export type Post = {
	id: string;
	username: string;
	userAvatar: string;
	text: string;
	timestamp: string;
	likes: number;
	likedBy: string[];
	comments: Comment[];
	image?: string;
};

type PostContextType = {
	posts: Post[];
	addPost: (text: string) => void;
	likePost: (postId: string) => void;
	unlikePost: (postId: string) => void;
	isPostLiked: (postId: string) => boolean;
	addComment: (postId: string, text: string) => void;
	getUserPosts: (username: string) => Post[];
	refreshPosts: () => Promise<void>;
};

export const PostContext = createContext<PostContextType>({
	posts: [],
	addPost: () => {},
	likePost: () => {},
	unlikePost: () => {},
	isPostLiked: () => false,
	addComment: () => {},
	getUserPosts: () => [],
	refreshPosts: async () => {},
});

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const { currentUser } = useContext(UserContext);

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = async () => {
		try {
			const storedPosts = await AsyncStorage.getItem("posts");
			if (storedPosts) {
				const parsedPosts = JSON.parse(storedPosts);
				const updatedPosts = parsedPosts.map((post: any) => {
					if (!post.likedBy) {
						return { ...post, likedBy: [] };
					}
					return post;
				});
				setPosts(updatedPosts);
			} else {
				const updatedSamplePosts = samplePosts.map((post) => {
					if (!post.likedBy) {
						return { ...post, likedBy: [] };
					}
					return post;
				});
				setPosts(updatedSamplePosts);
				await AsyncStorage.setItem("posts", JSON.stringify(updatedSamplePosts));
			}
		} catch (error) {
			console.error("Error loading posts:", error);

			const updatedSamplePosts = samplePosts.map((post) => {
				if (!post.likedBy) {
					return { ...post, likedBy: [] };
				}
				return post;
			});
			setPosts(updatedSamplePosts);
		}
	};

	const savePosts = async (updatedPosts: Post[]) => {
		try {
			await AsyncStorage.setItem("posts", JSON.stringify(updatedPosts));
		} catch (error) {
			console.error("Error saving posts:", error);
		}
	};

	const addPost = (text: string) => {
		if (!currentUser) {
			Alert.alert("Error", "You must be logged in to post");
			return;
		}

		if (text.length > 280) {
			Alert.alert("Error", "Post cannot exceed 280 characters");
			return;
		}

		const newPost: Post = {
			id: Date.now().toString(),
			username: currentUser.username,
			userAvatar: currentUser.avatar,
			text,
			timestamp: new Date().toISOString(),
			likes: 0,
			likedBy: [],
			comments: [],
		};

		const updatedPosts = [newPost, ...posts];
		setPosts(updatedPosts);
		savePosts(updatedPosts);
	};

	const isPostLiked = (postId: string): boolean => {
		if (!currentUser) return false;

		const post = posts.find((p) => p.id === postId);
		return post ? post.likedBy.includes(currentUser.id) : false;
	};

	const likePost = (postId: string) => {
		if (!currentUser) {
			Alert.alert("Error", "You must be logged in to like posts");
			return;
		}

		const updatedPosts = posts.map((post) => {
			if (post.id === postId) {
				if (post.likedBy.includes(currentUser.id)) {
					return post;
				}

				return {
					...post,
					likes: post.likes + 1,
					likedBy: [...post.likedBy, currentUser.id],
				};
			}
			return post;
		});

		setPosts(updatedPosts);
		savePosts(updatedPosts);
	};

	const unlikePost = (postId: string) => {
		if (!currentUser) {
			return;
		}

		const updatedPosts = posts.map((post) => {
			if (post.id === postId) {
				if (!post.likedBy.includes(currentUser.id)) {
					return post;
				}

				return {
					...post,
					likes: Math.max(0, post.likes - 1), // Ensure likes don't go below 0
					likedBy: post.likedBy.filter((id) => id !== currentUser.id),
				};
			}
			return post;
		});

		setPosts(updatedPosts);
		savePosts(updatedPosts);
	};

	const addComment = (postId: string, text: string) => {
		if (!currentUser) {
			Alert.alert("Error", "You must be logged in to comment");
			return;
		}

		const newComment: Comment = {
			id: Date.now().toString(),
			postId,
			username: currentUser.username,
			text,
			timestamp: new Date().toISOString(),
		};

		const updatedPosts = posts.map((post) => {
			if (post.id === postId) {
				return { ...post, comments: [...post.comments, newComment] };
			}
			return post;
		});
		setPosts(updatedPosts);
		savePosts(updatedPosts);
	};

	const getUserPosts = (username: string) => {
		return posts.filter((post) => post.username === username);
	};

	const refreshPosts = async () => {
		await loadPosts();
	};

	return (
		<PostContext.Provider
			value={{
				posts,
				addPost,
				likePost,
				unlikePost,
				isPostLiked,
				addComment,
				getUserPosts,
				refreshPosts,
			}}
		>
			{children}
		</PostContext.Provider>
	);
};
