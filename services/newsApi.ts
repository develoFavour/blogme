export const fetchTrendingNews = async () => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return [
		{
			id: "1",
			title: "Tech Giants Announce New AI Collaboration",
			description:
				"Major tech companies are joining forces to develop ethical AI standards.",
			url: "https://example.com/tech-ai-collaboration",
			urlToImage: "https://picsum.photos/id/1/600/400",
			publishedAt: "2023-05-20T09:30:00Z",
			source: {
				name: "Tech Today",
			},
		},
		{
			id: "2",
			title: "New Study Shows Benefits of Remote Work",
			description:
				"Research indicates productivity increases with flexible work arrangements.",
			url: "https://example.com/remote-work-benefits",
			urlToImage: "https://picsum.photos/id/48/600/400",
			publishedAt: "2023-05-19T14:45:00Z",
			source: {
				name: "Business Insider",
			},
		},
		{
			id: "3",
			title: "Climate Change Summit Reaches Historic Agreement",
			description:
				"World leaders commit to ambitious carbon reduction targets.",
			url: "https://example.com/climate-summit",
			urlToImage: "https://picsum.photos/id/10/600/400",
			publishedAt: "2023-05-18T11:20:00Z",
			source: {
				name: "Global News",
			},
		},
		{
			id: "4",
			title: "Breakthrough in Quantum Computing Announced",
			description:
				"Scientists achieve quantum supremacy with new processor design.",
			url: "https://example.com/quantum-breakthrough",
			urlToImage: "https://picsum.photos/id/96/600/400",
			publishedAt: "2023-05-17T16:10:00Z",
			source: {
				name: "Science Daily",
			},
		},
		{
			id: "5",
			title: "Global Chip Shortage Expected to Ease by Year End",
			description:
				"Industry analysts predict supply chain improvements for semiconductors.",
			url: "https://example.com/chip-shortage",
			urlToImage: "https://picsum.photos/id/60/600/400",
			publishedAt: "2023-05-16T08:50:00Z",
			source: {
				name: "Tech Radar",
			},
		},
		{
			id: "6",
			title: "New Health Study Reveals Benefits of Mediterranean Diet",
			description:
				"Research confirms positive impacts on longevity and heart health.",
			url: "https://example.com/mediterranean-diet",
			urlToImage: "https://picsum.photos/id/292/600/400",
			publishedAt: "2023-05-15T13:40:00Z",
			source: {
				name: "Health Journal",
			},
		},
		{
			id: "7",
			title: "Space Tourism Company Announces First Civilian Mission",
			description:
				"Private space flight to orbit Earth with non-astronaut crew.",
			url: "https://example.com/space-tourism",
			urlToImage: "https://picsum.photos/id/41/600/400",
			publishedAt: "2023-05-14T10:15:00Z",
			source: {
				name: "Space News",
			},
		},
	];
};
