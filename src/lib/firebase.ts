// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC_jNIFA5qC0Ncp-MxkxBFsCDNLGgN_pK4',
  authDomain: 'mymindmap-f77a5.firebaseapp.com',
  projectId: 'mymindmap-f77a5',
  storageBucket: 'mymindmap-f77a5.firebasestorage.app',
  messagingSenderId: '257176223159',
  appId: '1:257176223159:web:4402a2d6e5bddda8e4bc32',
  measurementId: 'G-QX4KFM7JPY',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
