import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6Eu3c1mDBfE7lVhO5EkDCNtMpjgbl1qY",
  authDomain: "sahayak-new-5aeea.firebaseapp.com",
  projectId: "sahayak-new-5aeea",
  storageBucket: "sahayak-new-5aeea.firebasestorage.app",
  messagingSenderId: "87109560056",
  appId: "1:87109560056:web:9cf47f375f70f7338ffd0d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
