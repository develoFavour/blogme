"use client";

import { useContext, useState } from "react";
import { View, FlatList, StyleSheet, RefreshControl, Text } from "react-native";
import { PostContext } from "../../context/PostContext";
import Post from "../../components/Post";

export default function FeedScreen() {
	const { posts, refreshPosts } = useContext(PostContext);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await refreshPosts();
		setRefreshing(false);
	};

	return (
		<View style={styles.container}>
			{posts.length === 0 ? (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>
						No posts yet. Be the first to post!
					</Text>
				</View>
			) : (
				<FlatList
					data={posts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <Post post={item} />}
					contentContainerStyle={styles.listContent}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	listContent: {
		padding: 10,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	emptyText: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});
