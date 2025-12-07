/**
 * Script to load WW2 mindmap into Firebase
 * Run with: npx tsx scripts/load-ww2-mindmap.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import ww2Data from '../public/examples/ww2-mindmap.json';

const firebaseConfig = {
  apiKey: "AIzaSyC_jNIFA5qC0Ncp-MxkxBFsCDNLGgN_pK4",
  authDomain: "mymindmap-f77a5.firebaseapp.com",
  projectId: "mymindmap-f77a5",
  storageBucket: "mymindmap-f77a5.firebasestorage.app",
  messagingSenderId: "257176223159",
  appId: "1:257176223159:web:4402a2d6e5bddda8e4bc32"
};

async function loadWW2Mindmap() {
  console.log('Initializing Firebase...');
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('Signing in anonymously...');
  await signInAnonymously(auth);
  console.log('Authenticated!');

  const projectId = `ww2-${Date.now()}`;

  const projectData = {
    projectId,
    metadata: {
      title: "World War II (1939-1945)",
      description: "Performance test with 40 nodes",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    mindmap: ww2Data.mindmap,
    relationships: [],
  };

  console.log(`Creating project: ${projectId}`);
  console.log(`Nodes: ${Object.keys(ww2Data.mindmap.nodes).length}`);

  const docRef = doc(db, 'mindmap_projects', projectId);
  await setDoc(docRef, projectData);

  console.log('✅ WW2 Mindmap loaded successfully!');
  console.log(`Project ID: ${projectId}`);
  process.exit(0);
}

loadWW2Mindmap().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
