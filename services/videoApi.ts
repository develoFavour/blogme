export const fetchTrendingVideos = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return [
		{
			id: "1",
			url: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
			poster: "https://picsum.photos/id/237/720/1280",
			username: "nature_lover",
			description:
				"Amazing wildlife spotted during my hike! 🌿🦌 #nature #wildlife",
			likes: 1245,
			comments: 89,
		},
		{
			id: "2",
			url: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
			poster: "https://picsum.photos/id/26/720/1280",
			username: "travel_addict",
			description:
				"Sunset views from my latest adventure 🌅 #travel #sunset #views",
			likes: 2389,
			comments: 156,
		},
		{
			id: "3",
			url: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
			poster: "https://picsum.photos/id/96/720/1280",
			username: "food_guru",
			description:
				"Quick recipe for the perfect breakfast! 🍳 #food #recipe #breakfast",
			likes: 876,
			comments: 42,
		},
		{
			id: "4",
			url: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
			poster: "https://picsum.photos/id/64/720/1280",
			username: "fitness_coach",
			description:
				"Try this 30-second exercise for better posture! 💪 #fitness #workout",
			likes: 3421,
			comments: 211,
		},
		{
			id: "5",
			url: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
			poster: "https://picsum.photos/id/42/720/1280",
			username: "tech_reviewer",
			description:
				"First look at the newest smartphone features! 📱 #tech #review",
			likes: 1876,
			comments: 134,
		},
	];
};
