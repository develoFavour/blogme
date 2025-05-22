"use client";

import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sampleUsers } from "../data/sampleData";

export type User = {
	id: string;
	username: string;
	name: string;
	bio: string;
	avatar: string;
	followers: string[];
	following: string[];
};

type UserContextType = {
	users: User[];
	currentUser: User | null;
	setCurrentUser: (user: User | null) => void;
	followUser: (userId: string) => void;
	unfollowUser: (userId: string) => void;
	getUserByUsername: (username: string) => User | undefined;
	updateUserProfile: (bio: string) => void;
};

export const UserContext = createContext<UserContextType>({
	users: [],
	currentUser: null,
	setCurrentUser: () => {},
	followUser: () => {},
	unfollowUser: () => {},
	getUserByUsername: () => undefined,
	updateUserProfile: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		loadUsers();
		loadCurrentUser();
	}, []);

	const loadUsers = async () => {
		try {
			const storedUsers = await AsyncStorage.getItem("users");
			if (storedUsers) {
				setUsers(JSON.parse(storedUsers));
			} else {
				setUsers(sampleUsers);
				await AsyncStorage.setItem("users", JSON.stringify(sampleUsers));
			}
		} catch (error) {
			console.error("Error loading users:", error);
			setUsers(sampleUsers);
		}
	};

	const loadCurrentUser = async () => {
		try {
			const user = await AsyncStorage.getItem("currentUser");
			if (user) {
				setCurrentUser(JSON.parse(user));
			} else {
				// Set default user for demo purposes
				setCurrentUser(sampleUsers[0]);
				await AsyncStorage.setItem(
					"currentUser",
					JSON.stringify(sampleUsers[0])
				);
			}
		} catch (error) {
			console.error("Error loading current user:", error);
			setCurrentUser(sampleUsers[0]);
		}
	};

	const saveUsers = async (updatedUsers: User[]) => {
		try {
			await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
		} catch (error) {
			console.error("Error saving users:", error);
		}
	};

	const saveCurrentUser = async (user: User | null) => {
		try {
			if (user) {
				await AsyncStorage.setItem("currentUser", JSON.stringify(user));
			} else {
				await AsyncStorage.removeItem("currentUser");
			}
		} catch (error) {
			console.error("Error saving current user:", error);
		}
	};

	const followUser = (userId: string) => {
		if (!currentUser) return;

		const updatedUsers = users.map((user) => {
			if (user.id === userId) {
				return {
					...user,
					followers: [...user.followers, currentUser.id],
				};
			}
			if (user.id === currentUser.id) {
				return {
					...user,
					following: [...user.following, userId],
				};
			}
			return user;
		});

		const updatedCurrentUser =
			updatedUsers.find((user) => user.id === currentUser.id) || currentUser;

		setUsers(updatedUsers);
		setCurrentUser(updatedCurrentUser);
		saveUsers(updatedUsers);
		saveCurrentUser(updatedCurrentUser);
	};

	const unfollowUser = (userId: string) => {
		if (!currentUser) return;

		const updatedUsers = users.map((user) => {
			if (user.id === userId) {
				return {
					...user,
					followers: user.followers.filter((id) => id !== currentUser.id),
				};
			}
			if (user.id === currentUser.id) {
				return {
					...user,
					following: user.following.filter((id) => id !== userId),
				};
			}
			return user;
		});

		const updatedCurrentUser =
			updatedUsers.find((user) => user.id === currentUser.id) || currentUser;

		setUsers(updatedUsers);
		setCurrentUser(updatedCurrentUser);
		saveUsers(updatedUsers);
		saveCurrentUser(updatedCurrentUser);
	};

	const getUserByUsername = (username: string) => {
		return users.find((user) => user.username === username);
	};

	const updateUserProfile = (bio: string) => {
		if (!currentUser) return;

		const updatedUser = { ...currentUser, bio };
		const updatedUsers = users.map((user) =>
			user.id === currentUser.id ? updatedUser : user
		);

		setCurrentUser(updatedUser);
		setUsers(updatedUsers);
		saveCurrentUser(updatedUser);
		saveUsers(updatedUsers);
	};

	return (
		<UserContext.Provider
			value={{
				users,
				currentUser,
				setCurrentUser,
				followUser,
				unfollowUser,
				getUserByUsername,
				updateUserProfile,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
