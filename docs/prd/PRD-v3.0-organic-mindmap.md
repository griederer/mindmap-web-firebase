# PRD: Organic Mindmap v3.0

**Version:** 3.0.0
**Status:** Draft
**Author:** Claude Code
**Date:** 2025-12-07
**Previous Version:** v2.0.0 (Production)

---

## Executive Summary

Transform NODEM from a rigid hierarchical mindmap into a flexible, organic visualization tool inspired by traditional hand-drawn mindmaps. This release introduces bidirectional layouts, text-only nodes, image nodes, connector annotations, and color-coded branches.

---

## Problem Statement

Current NODEM limitations:
1. **Unidirectional layout** - All nodes extend only to the right
2. **Rigid node style** - All nodes have the same boxed appearance
3. **No visual hierarchy** - All connectors look identical
4. **Limited content types** - Nodes can only contain text
5. **No connector context** - Cannot add notes/descriptions to relationships

---

## Goals & Success Metrics

### Goals
1. Create more visually appealing, organic mindmaps
2. Support diverse content types (text, images, mixed)
3. Enable bidirectional layouts for better space utilization
4. Allow customization of node and connector styles

### Success Metrics
| Metric | Target |
|--------|--------|
| User engagement | 2x time spent in editor |
| Mindmap complexity | Average 50+ nodes per map |
| Export/Share rate | 30% of completed maps |

---

## Feature Requirements

### F1: Bidirectional Layout
**Priority:** P0 (Must Have)

**Description:**
Nodes can branch to both LEFT and RIGHT sides of the root node. User can configure which branches go to which side, or let the system auto-balance.

**Requirements:**
- [ ] Root node positioned at center
- [ ] Child nodes can be assigned to LEFT or RIGHT side
- [ ] Auto-balance algorithm distributes nodes evenly
- [ ] Manual override per branch
- [ ] Layout recalculates on node add/remove

**Technical Notes:**
- Modify `layoutEngine.ts` to support `direction: 'left' | 'right' | 'auto'`
- Left-side nodes have negative X offsets
- Connector control points flip for left-side nodes

**UI/UX:**
- Right-click node → "Move to Left/Right"
- Drag node across center to switch sides
- Settings toggle: "Auto-balance branches"

---

### F2: Organic Curved Connectors
**Priority:** P0 (Must Have)

**Description:**
Replace uniform orange connectors with organic, flowing curves. Each main branch has a unique color that flows through its descendants.

**Requirements:**
- [ ] Smooth Bezier curves with natural flow
- [ ] Variable stroke width (thicker near root, thinner at leaves)
- [ ] Color palette for main branches (8-10 colors)
- [ ] Color inheritance: children inherit parent's branch color
- [ ] Optional: gradient along connector length

**Technical Notes:**
- Extend `Connector.tsx` with `branchColor` prop
- Implement `getBranchColor(nodeId)` utility
- Stroke width: `Math.max(1, 4 - level * 0.5)`

**Color Palette (Example):**
```
Branch 1: #F59E0B (Amber)
Branch 2: #10B981 (Emerald)
Branch 3: #3B82F6 (Blue)
Branch 4: #8B5CF6 (Violet)
Branch 5: #EC4899 (Pink)
Branch 6: #14B8A6 (Teal)
Branch 7: #F97316 (Orange)
Branch 8: #6366F1 (Indigo)
```

---

### F3: Flexible Node Styles
**Priority:** P0 (Must Have)

**Description:**
Support multiple node styles beyond the current boxed format.

**Node Style Options:**
1. **Boxed** (current) - White background, border, shadow
2. **Text Only** - Just the text, no background
3. **Bubble** - Rounded pill shape
4. **Minimal** - Light background, no border

**Requirements:**
- [ ] Node style property: `style: 'boxed' | 'text' | 'bubble' | 'minimal'`
- [ ] Style selector in node edit panel
- [ ] Default style configurable in settings
- [ ] Style can vary per node

**UI/UX:**
- Click node → Style picker in toolbar
- Quick toggle: double-click cycles through styles

---

### F4: Image Nodes
**Priority:** P1 (Should Have)

**Description:**
Nodes can contain images alongside or instead of text.

**Requirements:**
- [ ] Upload image to node (drag & drop or file picker)
- [ ] Image display modes:
  - `thumbnail` - Small preview in node
  - `inline` - Full image replaces node content
  - `icon` - Small icon next to title
- [ ] Image storage via Firebase Storage
- [ ] Lazy loading for performance
- [ ] Maximum file size: 2MB
- [ ] Supported formats: PNG, JPG, GIF, WebP

**Technical Notes:**
- Extend Node type with `image?: { url: string, mode: string }`
- Use Konva `Image` component
- Implement image upload service

**UI/UX:**
- Drag image onto node to attach
- Click image to expand preview
- Right-click → Remove image

---

### F5: Connector Annotations
**Priority:** P1 (Should Have)

**Description:**
Add text labels/notes along connectors to describe relationships.

**Requirements:**
- [ ] Optional label on any connector
- [ ] Label positioned at midpoint of curve
- [ ] Small font, subtle styling
- [ ] Editable on click
- [ ] Max 50 characters

**Technical Notes:**
- Extend `Connector.tsx` with optional `label` prop
- Use Konva `Text` positioned at Bezier midpoint
- Calculate midpoint: `bezierPoint(0.5, p0, p1, p2, p3)`

**UI/UX:**
- Click connector → Edit label
- Empty label = no display

---

### F6: Description Tooltips
**Priority:** P2 (Nice to Have)

**Description:**
Node descriptions appear as tooltips on hover, similar to the reference image where full text shows near nodes.

**Requirements:**
- [ ] Hover delay: 500ms
- [ ] Tooltip positioned near node, avoiding overlap
- [ ] Rich text support (bold, italic)
- [ ] Max width: 300px
- [ ] Fade in/out animation

---

### F7: Export Options
**Priority:** P2 (Nice to Have)

**Description:**
Export mindmaps in various formats.

**Requirements:**
- [ ] PNG export (current viewport or full map)
- [ ] SVG export (vector)
- [ ] PDF export
- [ ] JSON export (for backup/sharing)

---

## Technical Architecture

### Data Model Changes

```typescript
interface Node {
  // Existing fields...

  // New fields for v3.0
  style: 'boxed' | 'text' | 'bubble' | 'minimal';
  layoutSide: 'left' | 'right' | 'auto';
  branchColor?: string; // Override branch color
  image?: {
    url: string;
    mode: 'thumbnail' | 'inline' | 'icon';
    width?: number;
    height?: number;
  };
}

interface Connector {
  from: string;
  to: string;
  label?: string;
  color?: string; // Inherited from branch
}
```

### Component Changes

| Component | Changes |
|-----------|---------|
| `Canvas.tsx` | Handle bidirectional layout, image loading |
| `NodeComponent.tsx` | Multiple style renderers |
| `Connector.tsx` | Variable colors, widths, labels |
| `layoutEngine.ts` | Bidirectional algorithm |
| `Sidebar.tsx` | Style controls, export options |

### New Components

| Component | Purpose |
|-----------|---------|
| `NodeStylePicker.tsx` | Style selection UI |
| `ImageUploader.tsx` | Image attachment UI |
| `ConnectorLabel.tsx` | Editable connector labels |
| `ExportDialog.tsx` | Export options modal |

---

## Implementation Phases

### Phase 1: Core Layout (Week 1-2)
- [ ] Bidirectional layout algorithm
- [ ] Left/right node assignment
- [ ] Auto-balance logic

### Phase 2: Visual Styling (Week 2-3)
- [ ] Color-coded branches
- [ ] Variable stroke widths
- [ ] Node style options (text, bubble, minimal)

### Phase 3: Rich Content (Week 3-4)
- [ ] Image upload & storage
- [ ] Image display modes
- [ ] Connector labels

### Phase 4: Polish & Export (Week 4-5)
- [ ] Description tooltips
- [ ] Export functionality
- [ ] Performance optimization

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Performance with images | High | Lazy loading, image compression |
| Layout complexity | Medium | Incremental layout updates |
| Firebase Storage costs | Medium | File size limits, compression |
| Breaking changes | High | Maintain v2.0 compatibility layer |

---

## Rollback Plan

If issues arise:
```bash
# Rollback to v2.0.0
git checkout v2.0.0

# Or revert specific features
git revert <commit-hash>
```

---

## Open Questions

1. Should text-only nodes have a hover background for better UX?
2. Maximum number of images per node?
3. Should connector labels support multi-line?
4. Auto-color assignment algorithm preference?

---

## Appendix

### Reference Image Analysis

From the provided Quality Management mindmap:

**Observed Features:**
- Central node with gray rounded rectangle
- Branches extending both left AND right
- Each branch has distinct color (yellow, green, blue, purple, etc.)
- Some nodes are text-only (descriptions)
- Some nodes contain images
- Organic, flowing curves
- Variable connector thickness
- Text descriptions appear inline near nodes

**Design Inspiration:**
- XMind
- MindMeister
- Coggle
- Traditional hand-drawn mindmaps

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Owner | - | - | Pending |
| Tech Lead | - | - | Pending |
| Design | - | - | Pending |
