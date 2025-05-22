# Microblogging Social Platform Prototype

A React Native/Expo prototype for a microblogging social platform that allows users to post short text updates, view a feed, and interact with posts through likes and comments.

## Features

- **Feed Screen**: Displays a scrollable list of posts with username, timestamp, and text content (max 280 characters)
- **Post Creation**: Provides a text input for users to create a new post with character limit validation
- **Like/Comment Functionality**: Allows users to like posts and add text comments
- **User Profile**: Shows the user's name, bio, and their posts
- **Basic Navigation**: Enables switching between feed, post creation, and profile screens
- **Follow/Unfollow Feature**: Users can follow/unfollow other users
- **Pull-to-Refresh**: Implemented for the feed
- **Local Storage**: Posts and user data are persisted using AsyncStorage

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Start the Expo development server:
   \`\`\`
   npx expo start
   \`\`\`
4. Use the Expo Go app on your device or an emulator to run the application

## Project Structure

- **app/**: Main application screens using Expo Router
  - **(tabs)/**: Tab-based navigation
    - **index.tsx**: Feed screen
    - **create.tsx**: Post creation screen
    - **profile.tsx**: User profile screen
  - **\_layout.tsx**: Root layout with navigation setup
- **context/**: Contains context providers for state management
  - **PostContext.tsx**: Manages posts, likes, and comments
  - **UserContext.tsx**: Manages user data and follow/unfollow functionality
- **components/**: Reusable UI components
  - **Post.tsx**: Individual post component with like and comment functionality
  - **UserCard.tsx**: User information card with follow/unfollow button
- **data/**: Sample data for the prototype
  - **sampleData.tsx**: Contains mock users and posts

## Assumptions and Design Decisions

1. **Authentication**: For this prototype, a default user is automatically logged in
2. **Data Persistence**: AsyncStorage is used to persist data locally
3. **Images**: Sample images are loaded from remote URLs
4. **Character Limit**: Posts are limited to 280 characters
