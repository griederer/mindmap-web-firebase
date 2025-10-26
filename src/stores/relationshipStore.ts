/**
 * Relationship Store
 * Manages custom node relationships with Zustand
 */

import { create } from 'zustand';
import { Relationship, RELATIONSHIP_COLORS } from '../types/relationship';

interface RelationshipStore {
  relationships: Relationship[];

  // CRUD operations
  addRelationship: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateRelationship: (id: string, updates: Partial<Omit<Relationship, 'id' | 'createdAt'>>) => void;
  deleteRelationship: (id: string) => void;

  // Visibility toggle
  toggleRelationshipVisibility: (id: string) => void;

  // Node assignment
  addNodeToRelationship: (relationshipId: string, nodeId: string) => void;
  removeNodeFromRelationship: (relationshipId: string, nodeId: string) => void;
  toggleNodeInRelationship: (relationshipId: string, nodeId: string) => void;

  // Queries
  getRelationshipById: (id: string) => Relationship | undefined;
  getRelationshipsForNode: (nodeId: string) => Relationship[];
  getVisibleRelationships: () => Relationship[];

  // Node cleanup (when node deleted)
  removeNodeFromAllRelationships: (nodeId: string) => void;

  // Bulk operations
  setRelationships: (relationships: Relationship[]) => void;
}

export const useRelationshipStore = create<RelationshipStore>((set, get) => ({
  relationships: [],

  addRelationship: (relationship) => {
    const id = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const newRelationship: Relationship = {
      ...relationship,
      id,
      createdAt: now,
      updatedAt: now,
    };

    set((state) => ({
      relationships: [...state.relationships, newRelationship],
    }));

    return id;
  },

  updateRelationship: (id, updates) => {
    set((state) => ({
      relationships: state.relationships.map((rel) =>
        rel.id === id
          ? { ...rel, ...updates, updatedAt: Date.now() }
          : rel
      ),
    }));
  },

  deleteRelationship: (id) => {
    set((state) => ({
      relationships: state.relationships.filter((rel) => rel.id !== id),
    }));
  },

  toggleRelationshipVisibility: (id) => {
    set((state) => ({
      relationships: state.relationships.map((rel) =>
        rel.id === id
          ? { ...rel, isVisible: !rel.isVisible, updatedAt: Date.now() }
          : rel
      ),
    }));
  },

  addNodeToRelationship: (relationshipId, nodeId) => {
    set((state) => ({
      relationships: state.relationships.map((rel) =>
        rel.id === relationshipId && !rel.nodeIds.includes(nodeId)
          ? { ...rel, nodeIds: [...rel.nodeIds, nodeId], updatedAt: Date.now() }
          : rel
      ),
    }));
  },

  removeNodeFromRelationship: (relationshipId, nodeId) => {
    set((state) => ({
      relationships: state.relationships.map((rel) =>
        rel.id === relationshipId
          ? { ...rel, nodeIds: rel.nodeIds.filter((id) => id !== nodeId), updatedAt: Date.now() }
          : rel
      ),
    }));
  },

  toggleNodeInRelationship: (relationshipId, nodeId) => {
    const relationship = get().getRelationshipById(relationshipId);
    if (!relationship) return;

    if (relationship.nodeIds.includes(nodeId)) {
      get().removeNodeFromRelationship(relationshipId, nodeId);
    } else {
      get().addNodeToRelationship(relationshipId, nodeId);
    }
  },

  getRelationshipById: (id) => {
    return get().relationships.find((rel) => rel.id === id);
  },

  getRelationshipsForNode: (nodeId) => {
    return get().relationships.filter((rel) => rel.nodeIds.includes(nodeId));
  },

  getVisibleRelationships: () => {
    return get().relationships.filter((rel) => rel.isVisible);
  },

  removeNodeFromAllRelationships: (nodeId) => {
    set((state) => ({
      relationships: state.relationships.map((rel) => ({
        ...rel,
        nodeIds: rel.nodeIds.filter((id) => id !== nodeId),
        updatedAt: Date.now(),
      })),
    }));
  },

  setRelationships: (relationships) => {
    set({ relationships });
  },
}));

// Helper to get a random color from palette
export const getRandomRelationshipColor = (): string => {
  const colors = RELATIONSHIP_COLORS;
  return colors[Math.floor(Math.random() * colors.length)];
};
