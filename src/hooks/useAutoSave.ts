import { useEffect, useRef, useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useRelationshipStore } from '../stores/relationshipStore';
import { useSaveStatusStore } from '../stores/saveStatusStore';
import { saveProject } from '../services/firebaseService';
import type { ProjectBundle } from '../types/project';

const DEBOUNCE_MS = 2000; // 2 seconds

/**
 * Hook that automatically saves the current project to Firebase
 * with debouncing to avoid excessive writes
 */
export const useAutoSave = () => {
  const currentProject = useProjectStore((state) => state.currentProject);
  const currentBundle = useProjectStore((state) => state.currentBundle);
  const nodes = useProjectStore((state) => state.nodes);
  const rootNodeId = useProjectStore((state) => state.rootNodeId);
  const relationships = useRelationshipStore((state) => state.relationships);

  const { setStatus, setLastSaved } = useSaveStatusStore();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const doSave = useCallback(async (project: ProjectBundle) => {
    try {
      setStatus('saving');
      await saveProject(project);
      setStatus('saved');
      setLastSaved(Date.now());

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setStatus('error');
    }
  }, [setStatus, setLastSaved]);

  useEffect(() => {
    if (!currentProject?.projectId) {
      return;
    }

    // Create a snapshot of current state to check for changes
    const currentSnapshot = JSON.stringify({
      nodes,
      relationships,
      metadata: currentProject.metadata,
    });

    // Skip if nothing changed
    if (currentSnapshot === lastSavedRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set pending status immediately
    setStatus('pending');

    // Debounce the save
    timeoutRef.current = setTimeout(() => {
      const projectToSave: ProjectBundle = {
        projectId: currentProject.projectId,
        metadata: {
          ...currentProject.metadata,
          updatedAt: Date.now(),
        },
        mindmap: rootNodeId
          ? {
              rootNodeId,
              nodes,
            }
          : undefined,
        timeline: currentBundle?.timeline,
        relationships,
      };

      doSave(projectToSave);
      lastSavedRef.current = currentSnapshot;
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentProject, currentBundle, nodes, rootNodeId, relationships, doSave, setStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
