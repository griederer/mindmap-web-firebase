import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Detect environment from hostname
 * - dev: URLs containing '--dev-'
 * - staging: URLs containing '--staging-'
 * - prod: Default (main Firebase hosting URL)
 */
const getEnvironment = (): 'dev' | 'staging' | 'prod' => {
  const hostname = window.location.hostname;
  if (hostname.includes('--dev-')) return 'dev';
  if (hostname.includes('--staging-')) return 'staging';
  return 'prod';
};

/**
 * Firebase configuration for mymindmap-f77a5
 * This is a public Firebase config - safe to commit
 */
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
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Environment-based collection and storage paths
// This ensures dev/staging/prod data is completely isolated
export const ENV = getEnvironment();
export const PROJECTS_COLLECTION =
  ENV === 'prod' ? 'projects' : `projects-${ENV}`;
export const USERS_COLLECTION = ENV === 'prod' ? 'users' : `users-${ENV}`;
export const STORAGE_PATH = ENV === 'prod' ? 'projects' : `projects-${ENV}`;

// Log initialization (helps debugging environment issues)
console.log(`🔥 Firebase initialized - Environment: ${ENV}`);
console.log(`📁 Projects collection: ${PROJECTS_COLLECTION}`);
console.log(`📁 Users collection: ${USERS_COLLECTION}`);
console.log(`📦 Storage path: ${STORAGE_PATH}`);

export default app;
