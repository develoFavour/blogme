import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with your Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyAf4gnLwGGv4xgyrr4425iIXy6pk3GCm2A",
	authDomain: "blog-me-aeb92.firebaseapp.com",
	projectId: "blog-me-aeb92",
	storageBucket: "blog-me-aeb92.firebasestorage.app",
	messagingSenderId: "537385443705",
	appId: "1:537385443705:web:ed4c36f9dd79f29781cfa8",
	measurementId: "G-Y6B0RTNTVE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
