import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, initAuth, getCurrentUser } from './firebase';
import type { ProjectBundle, ProjectMetadata } from '../types/project';
import type { Node } from '../types/node';
import type { Relationship } from '../types/relationship';

const PROJECTS_COLLECTION = 'projects';

// ============================================================================
// Types for Firestore
// ============================================================================

export interface FirestoreProject {
  projectId: string;
  userId: string;
  metadata: ProjectMetadata;
  mindmap?: {
    rootNodeId: string;
    nodes: Record<string, Node>;
  };
  timeline?: ProjectBundle['timeline'];
  relationships?: Relationship[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProjectListItem {
  projectId: string;
  title: string;
  description?: string;
  updatedAt: number;
  nodeCount: number;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Initialize Firebase auth (anonymous) - call on app start
 */
export const initFirebase = async (): Promise<void> => {
  await initAuth();
};

/**
 * List all projects for the current user
 */
export const listProjects = async (): Promise<ProjectListItem[]> => {
  await initAuth();

  const projectsRef = collection(db, PROJECTS_COLLECTION);
  const q = query(projectsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as FirestoreProject;
    return {
      projectId: doc.id,
      title: data.metadata?.title || 'Untitled',
      description: data.metadata?.description,
      updatedAt: data.updatedAt?.toMillis() || Date.now(),
      nodeCount: data.mindmap?.nodes ? Object.keys(data.mindmap.nodes).length : 0,
    };
  });
};

/**
 * Load a complete project by ID
 */
export const loadProject = async (projectId: string): Promise<ProjectBundle | null> => {
  await initAuth();

  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as FirestoreProject;

  return {
    projectId: data.projectId,
    metadata: {
      ...data.metadata,
      updatedAt: data.updatedAt?.toMillis() || Date.now(),
      createdAt: data.createdAt?.toMillis() || Date.now(),
    },
    mindmap: data.mindmap,
    timeline: data.timeline,
    relationships: data.relationships,
  };
};

/**
 * Save a project (create or update)
 */
export const saveProject = async (project: ProjectBundle): Promise<void> => {
  await initAuth();
  const user = getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const docRef = doc(db, PROJECTS_COLLECTION, project.projectId);

  const firestoreData: Partial<FirestoreProject> = {
    projectId: project.projectId,
    userId: user.uid,
    metadata: {
      ...project.metadata,
      updatedAt: Date.now(),
    },
    mindmap: project.mindmap,
    timeline: project.timeline,
    relationships: project.relationships,
    updatedAt: serverTimestamp() as Timestamp,
  };

  // Check if document exists to preserve createdAt
  const existing = await getDoc(docRef);
  if (!existing.exists()) {
    firestoreData.createdAt = serverTimestamp() as Timestamp;
    firestoreData.metadata!.createdAt = Date.now();
  }

  await setDoc(docRef, firestoreData, { merge: true });
};

/**
 * Create a new empty project
 */
export const createProject = async (title: string): Promise<ProjectBundle> => {
  await initAuth();
  const user = getCurrentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const rootNodeId = `node-${Date.now()}`;
  const now = Date.now();

  const newProject: ProjectBundle = {
    projectId,
    metadata: {
      title,
      description: '',
      author: 'Anonymous',
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',
    },
    mindmap: {
      rootNodeId,
      nodes: {
        [rootNodeId]: {
          id: rootNodeId,
          title,
          description: '',
          children: [],
          level: 0,
          parentId: null,
          position: { x: 0, y: 0 },
          isExpanded: true,
          isVisible: true,
          createdAt: now,
          updatedAt: now,
        },
      },
    },
    relationships: [],
  };

  await saveProject(newProject);

  return newProject;
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  await initAuth();

  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
};

/**
 * Check if a project exists
 */
export const projectExists = async (projectId: string): Promise<boolean> => {
  await initAuth();

  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists();
};
