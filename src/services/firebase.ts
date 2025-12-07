import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC_jNIFA5qC0Ncp-MxkxBFsCDNLGgN_pK4",
  authDomain: "mymindmap-f77a5.firebaseapp.com",
  projectId: "mymindmap-f77a5",
  storageBucket: "mymindmap-f77a5.firebasestorage.app",
  messagingSenderId: "257176223159",
  appId: "1:257176223159:web:4402a2d6e5bddda8e4bc32",
  measurementId: "G-QX4KFM7JPY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Anonymous auth - transparent to user but satisfies Firestore rules
let authInitialized = false;
let currentUser: User | null = null;

export const initAuth = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    if (authInitialized && currentUser) {
      resolve(currentUser);
      return;
    }

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        authInitialized = true;
        resolve(user);
      } else {
        try {
          const result = await signInAnonymously(auth);
          currentUser = result.user;
          authInitialized = true;
          resolve(result.user);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
};

export const getCurrentUser = (): User | null => currentUser;
