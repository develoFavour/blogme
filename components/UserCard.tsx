"use client";

import type React from "react";

import { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { type User, UserContext } from "../context/UserContext";

type UserCardProps = {
	user: User;
	onPress?: () => void;
};

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
	const { currentUser, followUser, unfollowUser } = useContext(UserContext);

	const isFollowing = currentUser?.following.includes(user.id) || false;
	const isCurrentUser = currentUser?.id === user.id;

	const handleFollowToggle = () => {
		if (isFollowing) {
			unfollowUser(user.id);
		} else {
			followUser(user.id);
		}
	};

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={onPress}
			disabled={!onPress}
		>
			<Image source={{ uri: user.avatar }} style={styles.avatar} />
			<View style={styles.info}>
				<Text style={styles.name}>{user.name}</Text>
				<Text style={styles.username}>@{user.username}</Text>
				<Text style={styles.bio} numberOfLines={2}>
					{user.bio}
				</Text>
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
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		alignItems: "center",
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	info: {
		flex: 1,
		marginLeft: 15,
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
	},
	username: {
		color: "#666",
		marginBottom: 5,
	},
	bio: {
		fontSize: 14,
		color: "#333",
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
	},
	followingButton: {
		backgroundColor: "white",
		borderWidth: 1,
		borderColor: "#1DA1F2",
	},
	followingButtonText: {
		color: "#1DA1F2",
	},
});

export default UserCard;
