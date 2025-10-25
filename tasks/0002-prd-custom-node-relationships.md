# PRD: Custom Node Relationships System

## 1. Introduction/Overview

Implement a visual relationship system that allows users to define custom connections between nodes beyond the hierarchical parent-child structure. Users can create named relationships (e.g., "Dependencies", "Related Topics", "Cross-references") with custom styling, then assign multiple nodes to each relationship. Visual connectors appear/disappear on demand to show these relationships.

**Goal**: Enable users to visualize non-hierarchical connections between nodes while maintaining the clean, organized appearance of the mind map.

## 2. Goals

1. **Flexible relationship creation**: Users can define unlimited custom relationship types
2. **Visual clarity**: Relationship lines clearly distinguished from hierarchy connectors
3. **Interactive control**: Toggle relationships on/off without affecting data
4. **Dynamic rendering**: Lines update automatically when nodes move/collapse
5. **Persistent storage**: Relationships saved with project data
6. **Auto Focus integration**: Relationship activation works with focus mode
7. **Intuitive UX**: Simple workflow to create and assign relationships

## 3. User Stories

1. **As a user**, I want to create custom relationship types (e.g., "Dependencies", "Prerequisites") so I can categorize different types of connections
2. **As a user**, I want to customize relationship appearance (color, line style) so I can visually distinguish different relationship types
3. **As a user**, I want to assign multiple nodes to a relationship from the node action menu so I can quickly build connections
4. **As a user**, I want to toggle relationships on/off from a sidebar so I can focus on specific connection types without clutter
5. **As a user**, I want relationship lines to update automatically when nodes move or collapse so the visualization stays accurate
6. **As a user**, I want to see all nodes in an active relationship focused on screen so I can understand the full connection
7. **As a user**, I want relationships to be saved with my project so I don't lose this metadata

## 4. Functional Requirements

### 4.1 Relationship Manager Sidebar (Right Side)

**FR-1.1**: Collapsible sidebar on the right side of canvas
- Toggle button to show/hide (icon: link/chain)
- Width: 280px when expanded
- Dark theme to contrast with canvas
- Position: Fixed to right edge, full height

**FR-1.2**: Sidebar header
- Title: "Relationships"
- Close/collapse button (X)
- "+ New Relationship" button (primary action)

**FR-1.3**: Relationship list display
- Show all created relationships
- Each item displays:
  - Checkbox (toggle visibility)
  - Color indicator (circle/square)
  - Relationship title
  - Node count badge (e.g., "5 nodes")
  - Edit button (pencil icon)
  - Delete button (trash icon)
- Active (visible) relationships: checkbox checked, bolder text
- Inactive relationships: checkbox unchecked, lighter text

**FR-1.4**: Empty state
- When no relationships exist: "No relationships yet. Create one to connect nodes across your mind map."
- Icon + message + "Create Relationship" button

### 4.2 Create/Edit Relationship Modal

**FR-2.1**: Modal form for relationship creation/editing
- Title field (required, max 50 chars)
- Color picker (preset colors + custom hex)
- Line type selector:
  - Solid (──────)
  - Dashed (─ ─ ─ ─)
  - Dotted (· · · · ·)
- Line width slider (1-5px, default 2px)
- Preview section showing sample line with settings
- Actions: "Cancel" | "Save"

**FR-2.2**: Validation
- Title required (show error if empty)
- Title must be unique (prevent duplicates)
- Default values:
  - Color: Random from preset palette
  - Line type: Solid
  - Line width: 2px

**FR-2.3**: Edit mode
- Pre-fill form with existing relationship data
- Show "Edit Relationship" as title
- Preserve node associations when editing style

### 4.3 Node Action Menu Integration

**FR-3.1**: Add "Manage Relationships" option to node action menu
- Icon: link/chain
- Position: After "Show Info", before "Focus"
- Opens relationship assignment submenu

**FR-3.2**: Relationship assignment submenu
- Shows list of all available relationships
- Checkbox for each relationship
- Checked = node belongs to this relationship
- Unchecked = node not in this relationship
- Allow multiple selections (node can be in many relationships)
- "Done" button to close submenu

**FR-3.3**: Visual feedback
- Nodes in active relationships: small colored badge/indicator on node
- Badge shows count of active relationships (e.g., "2" if in 2 visible relationships)

### 4.4 Relationship Line Rendering

**FR-4.1**: Mesh connection pattern
- When relationship has N nodes, draw N(N-1)/2 lines (full mesh)
- Example: 3 nodes = 3 connections (A-B, B-C, A-C)
- Lines connect center of each node to center of related nodes

**FR-4.2**: Line styling
- Use relationship's configured color
- Use relationship's configured line type (solid/dashed/dotted)
- Use relationship's configured line width
- Z-index: Below nodes, above background
- Distinguish from hierarchy lines (hierarchy = gray, thin, always on top)

**FR-4.3**: Dynamic updates
- Lines re-render when:
  - Node position changes
  - Node collapses (hide lines to/from invisible nodes)
  - Node expands (show lines to newly visible nodes)
  - Relationship toggled on/off
  - Node added/removed from relationship

**FR-4.4**: Visibility rules
- Only draw lines between visible nodes
- If node collapses and children have relationships, hide those relationship lines
- When relationship toggled off: fade out lines over 0.3s
- When relationship toggled on: fade in lines over 0.5s

### 4.5 Auto Focus Integration

**FR-5.1**: Focus on relationship activation
- When user checks a relationship checkbox in sidebar:
  - If Auto Focus enabled → focus camera on all nodes in that relationship
  - Use same 4-second smooth animation as node expansion
  - Calculate bounding box of all relationship nodes

**FR-5.2**: Multi-relationship focus
- If multiple relationships active:
  - Focus on union of all nodes in active relationships
  - Update focus when any relationship toggled

**FR-5.3**: Focus mode interaction
- When focus mode active (single node focused):
  - Relationship lines still render if both nodes visible
  - Blurred nodes still show relationship lines (at 0.3 opacity)

### 4.6 Data Persistence

**FR-6.1**: Add relationships to project data structure
```typescript
interface Project {
  // ... existing fields
  relationships: Relationship[];
}

interface Relationship {
  id: string; // UUID
  title: string;
  color: string; // Hex color
  lineType: 'solid' | 'dashed' | 'dotted';
  lineWidth: number; // 1-5
  nodeIds: string[]; // Array of node IDs
  isVisible: boolean; // Toggle state
  createdAt: number;
  updatedAt: number;
}
```

**FR-6.2**: Save/load operations
- Relationships saved in .pmap file
- Load relationships when project opens
- Validate node IDs exist (remove references to deleted nodes)
- Export/import with project

**FR-6.3**: Node deletion handling
- When node deleted, remove from all relationships
- Update relationship node count badges
- If relationship becomes empty (0 nodes), keep it (don't auto-delete)

## 5. Non-Goals (Out of Scope)

**NG-1**: Directional relationships (A → B vs B → A) - All relationships bidirectional
**NG-2**: Weighted relationships (strength/importance indicators)
**NG-3**: Hierarchical relationship types (relationships are flat, not nested)
**NG-4**: Relationship templates or presets (users create from scratch)
**NG-5**: Bulk node operations (e.g., "Add all level 2 nodes to relationship")
**NG-6**: Relationship search/filter (future enhancement)
**NG-7**: Relationship analytics (e.g., "Most connected node")

## 6. Design Considerations

### 6.1 Sidebar Design

**Collapsed state**:
- Thin vertical bar on right edge (40px width)
- Icon button to expand
- Hover: slight highlight

**Expanded state**:
- Width: 280px
- Background: Dark semi-transparent (#1f2937 with 95% opacity)
- Border-left: 1px solid #374151
- Smooth slide-in animation (0.3s)

**Relationship item design**:
```
┌─────────────────────────────────────┐
│ ☑ ⬤ Dependencies            [5] ✏️ 🗑️│
│ ☐ ⬤ Cross-references        [2] ✏️ 🗑️│
│ ☐ ⬤ Related Topics          [8] ✏️ 🗑️│
└─────────────────────────────────────┘
```
- Checkbox: Toggle visibility
- Color dot: Visual indicator
- Title: Relationship name
- Badge: Node count
- Icons: Edit/delete actions

### 6.2 Line Rendering Strategy

**Konva implementation**:
- Separate Layer for relationship lines
- Layer z-index: Between connectors and nodes
- Each relationship = Group of Lines
- Lines use Konva.Line component

**Performance optimization**:
- Only render lines for visible nodes
- Cache line calculations when nodes static
- Use Konva's built-in caching for complex meshes
- Limit to 100 total relationship lines on screen (prevent performance issues)

### 6.3 Color Palette

**Preset colors for relationships**:
- #EF4444 (Red)
- #F59E0B (Amber)
- #10B981 (Green)
- #3B82F6 (Blue)
- #8B5CF6 (Purple)
- #EC4899 (Pink)
- #14B8A6 (Teal)
- #F97316 (Orange)
- Custom: Color picker for any hex color

### 6.4 Mobile/Responsive Considerations

- Sidebar stacks on top of canvas on mobile
- Touch gestures to show/hide sidebar
- Larger touch targets for checkboxes/buttons
- Simplified relationship manager (scrollable list)

## 7. Technical Considerations

### 7.1 New Files to Create

1. **src/stores/relationshipStore.ts**
   - Zustand store for relationship state
   - CRUD operations
   - Visibility toggles

2. **src/components/RelationshipSidebar/RelationshipSidebar.tsx**
   - Main sidebar component
   - Collapse/expand logic

3. **src/components/RelationshipSidebar/RelationshipList.tsx**
   - List of relationships with checkboxes

4. **src/components/RelationshipSidebar/RelationshipModal.tsx**
   - Create/edit relationship form

5. **src/components/Canvas/RelationshipLines.tsx**
   - Konva component to render relationship lines

6. **src/types/relationship.ts**
   - TypeScript interfaces

### 7.2 Files to Modify

1. **src/components/Canvas/Canvas.tsx**
   - Add RelationshipLines component
   - Add sidebar toggle button

2. **src/components/Canvas/NodeActionMenu.tsx**
   - Add "Manage Relationships" option

3. **src/stores/projectStore.ts**
   - Add relationships array to project state
   - Handle node deletion → update relationships

4. **src/stores/viewportStore.ts**
   - Add focusOnRelationship() function

### 7.3 Data Flow

```
User creates relationship in sidebar
  ↓
relationshipStore.addRelationship()
  ↓
Relationship saved to state
  ↓
User assigns nodes via action menu
  ↓
relationshipStore.addNodeToRelationship()
  ↓
User toggles relationship visibility
  ↓
relationshipStore.toggleRelationship()
  ↓
RelationshipLines component re-renders
  ↓
Konva draws/hides lines
  ↓
If Auto Focus enabled → focusOnRelationship()
```

### 7.4 Performance Optimization

- **Virtualization**: Only render relationship lines for on-screen nodes
- **Debouncing**: Batch relationship line updates during rapid node movements
- **Memoization**: Cache line calculations between renders
- **Lazy loading**: Sidebar content loads on first open

### 7.5 Testing Considerations

- Test with 0, 1, 10, 50 relationships
- Test with nodes in 0, 1, 5, 10 relationships
- Test relationship lines with collapsed/expanded nodes
- Test persistence (save/load project with relationships)
- Test node deletion impact on relationships
- Test Auto Focus with active relationships
- Test sidebar collapse/expand animation
- Test line rendering performance with 100+ nodes

## 8. Success Metrics

1. **Functionality**: Users can create, edit, delete relationships without errors
2. **Performance**: Relationship lines render at 60fps with 50 active relationships
3. **UX**: Users can assign nodes to relationships in < 5 seconds
4. **Integration**: Auto Focus works seamlessly with relationship activation
5. **Persistence**: 100% of relationships saved/loaded correctly
6. **Visual clarity**: Users can distinguish relationship types by color/style

## 9. Open Questions

**Q1**: Should there be a maximum number of relationships per project?
- **Proposed**: Soft limit of 20 relationships (warn user, don't block)

**Q2**: Should relationship lines have hover tooltips showing relationship name?
- **Proposed**: Yes, show tooltip on hover (relationship title + node count)

**Q3**: Should nodes show which relationships they belong to visually?
- **Proposed**: Yes, small colored badges on node corner (stacked dots)

**Q4**: Should there be keyboard shortcuts for relationship operations?
- **Proposed**:
  - `Cmd/Ctrl + K`: Open relationship sidebar
  - `Cmd/Ctrl + Shift + R`: Create new relationship

**Q5**: Should relationship line color fade when not focused?
- **Proposed**: Yes, use 0.3 opacity for lines involving blurred nodes

## 10. Implementation Phases

### Phase 1: Core Data Structure (2 hours)
- [ ] Create relationship type definitions
- [ ] Create relationshipStore with CRUD operations
- [ ] Update project data structure
- [ ] Add persistence logic

### Phase 2: Sidebar UI (3 hours)
- [ ] Create RelationshipSidebar component
- [ ] Implement collapse/expand animation
- [ ] Create RelationshipList with checkboxes
- [ ] Create RelationshipModal form
- [ ] Add color picker and line style selectors

### Phase 3: Node Assignment (2 hours)
- [ ] Add "Manage Relationships" to NodeActionMenu
- [ ] Create relationship assignment submenu
- [ ] Update node visual indicators (badges)

### Phase 4: Line Rendering (3 hours)
- [ ] Create RelationshipLines Konva component
- [ ] Implement mesh connection algorithm
- [ ] Add line styling (color, type, width)
- [ ] Handle visibility toggling with animations

### Phase 5: Auto Focus Integration (1.5 hours)
- [ ] Add focusOnRelationship() to viewportStore
- [ ] Trigger focus on relationship checkbox
- [ ] Handle multi-relationship focus
- [ ] Test with existing Auto Focus features

### Phase 6: Dynamic Updates (2 hours)
- [ ] Update lines when nodes move
- [ ] Hide lines when nodes collapse
- [ ] Handle node deletion
- [ ] Optimize rendering performance

### Phase 7: Testing & Polish (1.5 hours)
- [ ] Test all CRUD operations
- [ ] Test persistence
- [ ] Test with various node configurations
- [ ] Test Auto Focus integration
- [ ] Performance testing
- [ ] Bug fixes

**Total Estimated Time**: 15 hours

## 11. UI Mockups (ASCII)

### Sidebar Collapsed
```
┌──────────────────────────────┐
│ Canvas                    │⚡│
│                          │  │
│  [Node A]                │  │
│                          │  │
│      [Node B]            │  │
└──────────────────────────┴──┘
```

### Sidebar Expanded
```
┌──────────────────────┬───────────────┐
│ Canvas               │ Relationships │
│                      │ ┌───────────┐ │
│  [Node A]            │ │+ New      │ │
│     ═══╗             │ └───────────┘ │
│        ║             │               │
│        ╠═══ [Node B] │ ☑ ⬤ Deps  [3]│
│        ║             │ ☐ ⬤ Refs  [2]│
│  [Node C]            │               │
│     ═══╝             │               │
└──────────────────────┴───────────────┘
```

### Node with Relationship Badge
```
┌──────────────────┐ ②
│  Node Title      │
│                  │
└──────────────────┘
  (Badge shows node is in 2 active relationships)
```

### Relationship Lines (Mesh)
```
     [A]
    ╱ ║ ╲
   ╱  ║  ╲
  ╱   ║   ╲
[B]═══╬═══[C]
      ║
     [D]
(All nodes connected to each other in mesh)
```

---

**Status**: Draft - Ready for review
**Priority**: High (New major feature)
**Estimated effort**: 15 hours
**Dependencies**: None (builds on existing Auto Focus system)
