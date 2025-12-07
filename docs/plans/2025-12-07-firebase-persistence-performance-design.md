# Firebase Persistence & Performance Optimization

**Date:** 2025-12-07
**Status:** Approved
**Author:** Claude + Gonzalo

---

## Overview

Two improvements for NODEM mindmap app:
1. Firebase persistence with auto-save
2. Performance optimization for medium-sized mindmaps (50-200 nodes)

---

## Part 1: Firebase Persistence

### Requirements
- Single user (personal use)
- Projects listed in sidebar
- Auto-save (debounced 2-3 seconds)
- Visual indicator: "Saving..." / "Saved ✓"

### Firestore Structure

```
/projects/{projectId}
  - metadata: { title, description, createdAt, updatedAt }
  - rootNodeId: string

/projects/{projectId}/nodes/{nodeId}
  - title, description, level, parentId
  - position: { x, y }
  - children: string[]
  - isExpanded, isVisible
  - images: []

/projects/{projectId}/relationships/{relationshipId}
  - title, color, lineType, nodeIds[]
```

### New Files

**`src/services/firebaseService.ts`**
- `listProjects()` - fetch project list for sidebar
- `loadProject(id)` - load complete project
- `saveProject(project)` - save entire project
- `createProject(title)` - create new project
- `deleteProject(id)` - delete project

**`src/hooks/useAutoSave.ts`**
- Debounced auto-save hook
- Tracks dirty state
- Visual status indicator

### Data Flow

1. App opens → `listProjects()` → populate sidebar
2. User clicks project → `loadProject(id)` → load into store
3. User makes changes → debounce 2s → `saveProject()` → update Firestore
4. Status indicator shows "Saving..." then "Saved ✓"

---

## Part 2: Performance Optimization

### Target
Medium-sized mindmaps: 50-200 nodes

### Optimizations

#### 1. Component Memoization

```typescript
// NodeComponent.tsx
export const NodeComponent = React.memo(({ node, ... }) => {
  // component code
}, (prevProps, nextProps) => {
  return prevProps.node.id === nextProps.node.id &&
         prevProps.node.title === nextProps.node.title &&
         prevProps.node.position.x === nextProps.node.position.x &&
         prevProps.node.position.y === nextProps.node.position.y &&
         prevProps.node.isVisible === nextProps.node.isVisible &&
         prevProps.isSelected === nextProps.isSelected;
});
```

**Components to memoize:**
- `NodeComponent` (critical - one per node)
- `Connector` (lines between nodes)
- `RelationshipLines` (custom relationships)

#### 2. Zustand Selector Optimization

```typescript
// Before: re-renders on any nodes change
const nodes = useProjectStore(state => state.nodes)

// After: granular subscription
const node = useProjectStore(state => state.nodes[nodeId])
const visibleNodeIds = useProjectStore(
  useCallback(state =>
    Object.keys(state.nodes).filter(id => state.nodes[id].isVisible),
    []
  )
)
```

#### 3. Layout Engine Optimization

```typescript
// Partial recalculation for subtrees
calculateSubtreeLayout(nodes, changedNodeId)
```

#### 4. Canvas.tsx Optimizations

- `useMemo` for derived data (visible nodes, connections)
- `useCallback` for event handlers
- Avoid recreating arrays/objects on every render

---

## Implementation Order

1. Firebase service setup
2. Auto-save hook
3. Sidebar integration (list projects)
4. Create/Load/Delete project flows
5. Component memoization
6. Zustand selector optimization
7. Layout engine optimization
8. Testing & verification

---

## Success Criteria

- [ ] Projects persist across sessions
- [ ] Projects appear in sidebar on app load
- [ ] Auto-save works with visual indicator
- [ ] No noticeable lag with 100+ nodes
- [ ] Smooth expand/collapse animations
