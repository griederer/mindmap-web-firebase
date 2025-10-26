# Custom Node Relationships System

## Overview

The relationship system allows users to create custom connections between nodes beyond the hierarchical parent-child structure. This enables expressing complex relationships like dependencies, cross-references, comparisons, etc.

## Features

### Visual Representation
- **Curved Mesh Lines**: Bézier curves connect all node pairs in a relationship
- **Customizable Styling**:
  - 8 preset colors (red, amber, green, blue, purple, pink, teal, orange)
  - 3 line types (solid, dashed, dotted)
  - Adjustable line width (1-5px)
- **Opacity**: Lines render at 70% opacity to avoid overwhelming the hierarchy

### User Interface

#### Relationship Sidebar
- **Location**: Right side of screen
- **Trigger**: Relationships button (⛓ icon) in top-right corner
- **Features**:
  - Create new relationships
  - Edit existing relationships
  - Delete relationships
  - Toggle visibility per relationship
  - View node count per relationship

#### Node Assignment
- **Access**: Action menu on any node → Relationships button (⛓ icon)
- **Interface**: Checkbox list of all relationships
- **Behavior**:
  - Check to add node to relationship
  - Uncheck to remove node from relationship
  - Real-time update of mesh connections

#### Focus Integration
- **Trigger**: Click relationship title in sidebar
- **Behavior**: Camera automatically focuses on all nodes in relationship
- **Animation**: Smooth zoom and pan to frame all relationship nodes

### Technical Implementation

#### Data Structure

```typescript
interface Relationship {
  id: string;                    // Unique identifier
  title: string;                 // User-defined name
  color: string;                 // Hex color code
  lineType: 'solid' | 'dashed' | 'dotted';
  lineWidth: number;             // 1-5px
  nodeIds: string[];             // Array of node IDs
  isVisible: boolean;            // Toggle state
  createdAt: number;             // Timestamp
  updatedAt: number;             // Timestamp
}
```

#### Mesh Connection Algorithm

For N nodes in a relationship:
- Creates N(N-1)/2 connections (all pairs)
- Each connection is a unique curved line
- Lines only render for visible nodes

Example:
- 2 nodes → 1 line
- 3 nodes → 3 lines
- 4 nodes → 6 lines
- 5 nodes → 10 lines

#### Curved Line Generation

Uses quadratic Bézier curves:

```typescript
generateCurvedPath(fromX, fromY, toX, toY, curvature = 0.3)
```

**Algorithm**:
1. Calculate midpoint between nodes
2. Find perpendicular vector to the line
3. Offset control point by 30% of line length
4. Generate SVG path: `M fromX fromY Q controlX controlY toX toY`

**Benefits**:
- Each connection has unique visual path
- Prevents overlapping straight lines
- Clear distinction when multiple nodes are connected
- Natural, organic appearance

#### Dynamic Updates

**Node Movement**:
- Lines read node positions directly from store
- Automatic update on every render

**Node Collapse**:
- Lines filter by `node.isVisible` flag
- Hidden nodes don't show connections

**Node Deletion**:
- Cleanup in `projectStore.deleteNode()`
- Removed node IDs from all relationships
- Lines disappear automatically

#### Persistence

**Storage Format** (.pmap files):
```json
{
  "projectId": "...",
  "nodes": {...},
  "relationships": [
    {
      "id": "rel-123",
      "title": "Dependencies",
      "color": "#EF4444",
      "lineType": "solid",
      "lineWidth": 2,
      "nodeIds": ["node-1", "node-2", "node-3"],
      "isVisible": true,
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

**Load/Save**:
- Loaded into `relationshipStore` on project open
- Saved to `project.relationships` on project save
- Synced with Firebase Storage

### Component Architecture

```
Canvas.tsx
├── RelationshipLines.tsx          # Renders curved mesh connections
├── RelationshipSidebar/
│   ├── RelationshipSidebar.tsx    # Main sidebar container
│   ├── RelationshipList.tsx       # List of relationships
│   └── RelationshipModal.tsx      # Create/edit form
└── RelationshipAssignMenu.tsx     # Node assignment submenu
```

**State Management**:
- `relationshipStore.ts` - Global relationship state (Zustand)
- `projectStore.ts` - Integration with project persistence
- `viewportStore.ts` - Focus camera integration

### User Workflow

#### Creating a Relationship

1. Click Relationships button (top-right)
2. Click "New Relationship"
3. Enter title (e.g., "Dependencies")
4. Choose color from 8 presets
5. Select line type (solid/dashed/dotted)
6. Adjust line width (1-5px)
7. Click "Create"

#### Assigning Nodes

1. Click on a node
2. Click Relationships button (⛓) in action menu
3. Check relationships to assign node
4. Uncheck to remove node
5. Lines update automatically

#### Viewing Relationships

1. Open Relationships sidebar
2. Click relationship title to focus camera
3. Toggle checkbox to show/hide lines
4. View node count badge

#### Editing Relationships

1. Open Relationships sidebar
2. Click "Edit" on relationship
3. Modify title, color, line type, or width
4. Click "Update"

#### Deleting Relationships

1. Open Relationships sidebar
2. Click "Delete" on relationship
3. Confirm deletion
4. All connections removed

### Use Cases

**Dependencies**:
- Connect nodes that depend on each other
- Use red dashed lines
- Example: "Batallas Principales" depends on "Aliados"

**Cross-References**:
- Link related concepts across hierarchy
- Use blue solid lines
- Example: "Epistemología" references "Límites del Conocimiento"

**Comparisons**:
- Group nodes for comparison
- Use green dotted lines
- Example: Compare "IA Responsable" concepts

**Workflows**:
- Show process flows between nodes
- Use orange solid lines
- Example: Task dependencies in project management

### Limitations

**Current**:
- Lines connect node centers (not smart edge routing)
- No line labels or annotations
- Single curvature value (30%) for all lines
- No line click interactions

**Future Enhancements**:
- Smart edge routing around nodes
- Line labels and annotations
- Variable curvature per relationship
- Click lines to edit relationship
- Line tooltips with relationship info
- Export relationships to graph formats

## API Reference

### RelationshipStore

```typescript
// CRUD operations
addRelationship(relationship: Omit<Relationship, 'id' | 'createdAt' | 'updatedAt'>): string
updateRelationship(id: string, updates: Partial<Omit<Relationship, 'id' | 'createdAt'>>): void
deleteRelationship(id: string): void

// Visibility
toggleRelationshipVisibility(id: string): void

// Node assignment
addNodeToRelationship(relationshipId: string, nodeId: string): void
removeNodeFromRelationship(relationshipId: string, nodeId: string): void
toggleNodeInRelationship(relationshipId: string, nodeId: string): void

// Queries
getRelationshipById(id: string): Relationship | undefined
getRelationshipsForNode(nodeId: string): Relationship[]
getVisibleRelationships(): Relationship[]

// Cleanup
removeNodeFromAllRelationships(nodeId: string): void

// Bulk operations
setRelationships(relationships: Relationship[]): void
```

### Usage Examples

#### Create Relationship

```typescript
import { useRelationshipStore } from '@/stores/relationshipStore';

const { addRelationship } = useRelationshipStore();

const relationshipId = addRelationship({
  title: 'Dependencies',
  color: '#EF4444',
  lineType: 'dashed',
  lineWidth: 2,
  nodeIds: [],
  isVisible: true,
});
```

#### Assign Node

```typescript
const { addNodeToRelationship } = useRelationshipStore();

addNodeToRelationship('rel-123', 'node-456');
```

#### Toggle Visibility

```typescript
const { toggleRelationshipVisibility } = useRelationshipStore();

toggleRelationshipVisibility('rel-123');
```

#### Focus on Relationship

```typescript
import { useViewportStore } from '@/stores/viewportStore';
import { useRelationshipStore } from '@/stores/relationshipStore';

const { focusOnNodes } = useViewportStore();
const { getRelationshipById } = useRelationshipStore();

const relationship = getRelationshipById('rel-123');
if (relationship) {
  focusOnNodes(relationship.nodeIds, true);
}
```

## Version History

### v1.3.0 (2025-01-26)
- ✅ Initial relationship system implementation
- ✅ Curved Bézier line rendering
- ✅ Sidebar management UI
- ✅ Node assignment via action menu
- ✅ Focus camera integration
- ✅ Dynamic line updates
- ✅ Persistent storage in .pmap files

## Related Documentation

- [Project Structure](../README.md#-project-structure)
- [PRD: Custom Node Relationships](../tasks/0002-prd-custom-node-relationships.md)
- [Task List](../tasks/tasks-0002-prd-custom-node-relationships.md)
