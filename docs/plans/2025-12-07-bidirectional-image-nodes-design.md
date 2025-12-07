# Bidirectional Layout + Image Nodes Enhancement

**Date:** 2025-12-07
**Status:** Approved

## Overview

Enhance the mindmap application to support:
1. **Bidirectional layout** - branches can go left OR right from center
2. **Image nodes** - nodes can display as images with optional text labels
3. **Flexible display modes** - text-only, image-only, or both

## Data Model Changes

### Node Type Additions

```typescript
interface Node {
  // ... existing fields ...

  // NEW: Display mode for the node
  displayMode: 'text' | 'image' | 'both';  // default: 'text'

  // NEW: Primary image for display (when mode is 'image' or 'both')
  primaryImageId?: string;  // references an image in images[]

  // NEW: Branch direction (set by AI during creation)
  branchDirection?: 'left' | 'right';  // only for level 1 nodes
}
```

### Display Mode Behavior

| Mode | Visual |
|------|--------|
| `text` | Current behavior - rectangle with title |
| `image` | Image IS the node (150x100px fixed), title shows below |
| `both` | Same as `image` - image node with title below |

## Layout Engine Changes

### Current Behavior
- Root at left edge (x=100)
- All children branch rightward

### New Behavior
- Root at **canvas center**
- Level 1 children split based on `branchDirection`
- Left branches: positioned left of root, children continue leftward
- Right branches: positioned right of root, children continue rightward

### Algorithm

```
1. Position root at canvas center
2. Split level 1 children into leftChildren / rightChildren based on branchDirection
3. For right branches:
   - Same as current (children positioned to right of parent)
4. For left branches:
   - Children positioned to LEFT of parent
   - Recursively continue leftward
```

## Node Component Changes

### Image Node Rendering

```
┌─────────────────┐
│                 │
│    [IMAGE]      │  ← 150x100px fixed size
│                 │
└─────────────────┘
    Node Title       ← Text centered below
```

### Click Behavior
- Click image → opens fullscreen viewer (existing behavior)

## Node Edit Modal Changes

Add "Display As" toggle:
- Text (default)
- Image
- Both

When Image or Both selected:
- Show image selector from attached images
- User picks which image to display

## Connector Changes

For left-side branches:
- Connector exits from LEFT side of parent node
- Curves flow right-to-left (mirrored)
- Entry point: RIGHT side of child node

## Implementation Order

1. Update `types/node.ts` - add new fields
2. Update `layoutEngine.ts` - bidirectional algorithm
3. Update `NodeComponent.tsx` - render image nodes
4. Update `NodeEditModal.tsx` - display mode toggle
5. Update `Connector.tsx` - left-side curve handling
6. Create demo project with sample data

## Demo Project Structure

Topic: "Quality Management" (matching reference image)
- Central node: Quality Management
- Left branches: Quality Assurance, Quality Control, etc.
- Right branches: Product Life Cycle, PDSA, etc.
- Mix of text nodes and image nodes
