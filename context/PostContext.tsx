"use client";
import { UserContext } from "./UserContext";
import {
	createContext,
	useState,
	useEffect,
	useContext,
	PropsWithChildren,
} from "react";
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
	comments: Comment[];
	image?: string;
};

type PostContextType = {
	posts: Post[];
	addPost: (text: string) => void;
	likePost: (postId: string) => void;
	isPostLiked: (postId: string) => boolean;
	addComment: (postId: string, text: string) => void;
	getUserPosts: (username: string) => Post[];
	refreshPosts: () => Promise<void>;
};

export const PostContext = createContext<PostContextType>({
	posts: [],
	addPost: () => {},
	likePost: () => {},
	isPostLiked: (postId: string) => false,
	addComment: () => {},
	getUserPosts: () => [],
	refreshPosts: async () => {},
});

export const PostProvider = ({ children }: PropsWithChildren) => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [likedPosts, setLikedPosts] = useState<string[]>([]);
	const { currentUser } = useContext(UserContext);

	useEffect(() => {
		loadPosts();
	}, []);

	const loadPosts = async () => {
		try {
			const storedPosts = await AsyncStorage.getItem("posts");
			if (storedPosts) {
				setPosts(JSON.parse(storedPosts));
			} else {
				setPosts(samplePosts);
				await AsyncStorage.setItem("posts", JSON.stringify(samplePosts));
			}
		} catch (error) {
			console.error("Error loading posts:", error);
			setPosts(samplePosts);
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
			comments: [],
		};

		const updatedPosts = [newPost, ...posts];
		setPosts(updatedPosts);
		savePosts(updatedPosts);
	};

	const likePost = (postId: string) => {
		if (likedPosts.includes(postId)) {
			return;
		}
		const updatedPosts = posts.map((post) => {
			if (post.id === postId) {
				return { ...post, likes: post.likes + 1 };
			}
			return post;
		});
		setPosts(updatedPosts);
		savePosts(updatedPosts);
		setLikedPosts([...likedPosts, postId]);
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
				isPostLiked: (postId: string) => likedPosts.includes(postId),
				addComment,
				getUserPosts,
				refreshPosts,
			}}
		>
			{children}
		</PostContext.Provider>
	);
};
