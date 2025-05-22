"use client";

import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ActivityIndicator,
	Image,
	TouchableOpacity,
} from "react-native";
import { fetchTrendingNews } from "../../services/newsApi";
import { Ionicons } from "@expo/vector-icons";

type NewsItem = {
	id: string;
	title: string;
	description: string;
	url: string;
	urlToImage: string;
	publishedAt: string;
	source: {
		name: string;
	};
};

export default function ExploreScreen() {
	const [news, setNews] = useState<NewsItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadNews();
	}, []);

	const loadNews = async () => {
		try {
			setLoading(true);
			const newsData = await fetchTrendingNews();
			setNews(newsData);
			setError(null);
		} catch (err) {
			setError("Failed to load trending content. Please try again later.");
			console.error("Error fetching news:", err);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#1DA1F2" />
				<Text style={styles.loadingText}>Loading trending content...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.errorContainer}>
				<Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
				<Text style={styles.errorText}>{error}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={loadNews}>
					<Text style={styles.retryButtonText}>Retry</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.sectionTitle}>Trending Topics</Text>
			<FlatList
				data={news}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.newsItem}>
						{item.urlToImage ? (
							<Image
								source={{ uri: item.urlToImage }}
								style={styles.newsImage}
							/>
						) : (
							<View style={styles.placeholderImage}>
								<Ionicons name="newspaper-outline" size={40} color="#ccc" />
							</View>
						)}
						<View style={styles.newsContent}>
							<Text style={styles.newsSource}>{item.source.name}</Text>
							<Text style={styles.newsTitle} numberOfLines={2}>
								{item.title}
							</Text>
							<Text style={styles.newsDate}>
								{formatDate(item.publishedAt)}
							</Text>
						</View>
					</TouchableOpacity>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 15,
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 15,
	},
	newsItem: {
		backgroundColor: "white",
		borderRadius: 10,
		marginBottom: 15,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	newsImage: {
		width: "100%",
		height: 180,
	},
	placeholderImage: {
		width: "100%",
		height: 180,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
	},
	newsContent: {
		padding: 15,
	},
	newsSource: {
		fontSize: 14,
		color: "#1DA1F2",
		marginBottom: 5,
	},
	newsTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 8,
	},
	newsDate: {
		fontSize: 12,
		color: "#666",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: "#666",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		padding: 20,
	},
	errorText: {
		marginTop: 10,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
		marginBottom: 20,
	},
	retryButton: {
		backgroundColor: "#1DA1F2",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 25,
	},
	retryButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});
