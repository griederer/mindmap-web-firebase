# PRD 0002: Node Image Attachments

**Product Requirement Document**
**Feature**: Image Attachments for Mind Map Nodes
**Version**: 1.0
**Date**: 2025-01-22
**Status**: Draft

---

## 1. Overview

Enable users to attach multiple images to mind map nodes. Images will display as thumbnails in the node info panel and can be viewed in fullscreen mode. All image data must be stored at the project level in JSON format, allowing for programmatic creation of mind maps with images.

### Goals

1. **Visual enrichment** - Allow users to add visual context to nodes beyond text descriptions
2. **Project portability** - Store all image data within project JSON (no external dependencies)
3. **Intuitive UX** - Simple upload/view workflow with keyboard shortcuts
4. **Programmatic creation** - Enable AI assistant to create projects with images embedded in JSON

---

## 2. User Stories

### Primary Stories

**US-1**: As a user creating a historical mind map, I want to attach photos to event nodes so that I can visualize the events alongside descriptions.

**US-2**: As a user viewing node information, I want to see image thumbnails below the description text so that I can quickly scan visual content.

**US-3**: As a user viewing thumbnails, I want to click an image to see it fullscreen so that I can examine details.

**US-4**: As a user in fullscreen mode, I want to press ESC to close the view so that I can return to the mind map quickly.

**US-5**: As a user requesting AI assistance, I want Claude to create mind map projects with embedded images so that I can quickly generate visual mind maps.

### Secondary Stories

**US-6**: As a user editing a node, I want to remove unwanted images so that I can keep content relevant.

**US-7**: As a user with many images, I want to navigate between fullscreen images using arrow keys so that I don't have to exit and re-enter fullscreen repeatedly.

---

## 3. Functional Requirements

### FR-1: Image Upload in Edit Modal

- **FR-1.1**: Edit modal must include an "Images" section below the description textarea
- **FR-1.2**: Users can click "Add Image" button to open file picker
- **FR-1.3**: File picker must accept: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **FR-1.4**: Selected images are converted to base64 data URIs and stored in node JSON
- **FR-1.5**: Maximum 5 images per node (prevents JSON bloat)
- **FR-1.6**: Maximum 2MB per image file (enforced before conversion)
- **FR-1.7**: Images exceeding size limit show error message: "Image too large. Maximum 2MB per file."
- **FR-1.8**: Uploaded images display as small previews (60px height) in edit modal with delete button (X)

### FR-2: Thumbnail Gallery in Info Panel

- **FR-2.1**: When node has images, NodeInfoPanel displays gallery below description text
- **FR-2.2**: Gallery layout: horizontal row with 80px × 80px thumbnails
- **FR-2.3**: Thumbnails have 8px gap between them
- **FR-2.4**: Thumbnails have subtle border and hover effect (scale 1.05, cursor pointer)
- **FR-2.5**: Panel height adjusts dynamically to accommodate images
- **FR-2.6**: Maximum 3 thumbnails visible, remaining count shown as "+N more" badge

### FR-3: Fullscreen Image Viewer

- **FR-3.1**: Clicking thumbnail opens fullscreen overlay (z-index 9999, black background 95% opacity)
- **FR-3.2**: Image centered on screen, scaled to fit viewport (max 90vw × 90vh)
- **FR-3.3**: Press ESC key to close viewer
- **FR-3.4**: Click outside image (on black background) to close viewer
- **FR-3.5**: If node has multiple images, show left/right arrow navigation buttons
- **FR-3.6**: Arrow keys (← →) navigate between images
- **FR-3.7**: Small close button (X) in top-right corner as alternative to ESC
- **FR-3.8**: Image counter shown at bottom: "2 / 5"

### FR-4: JSON Schema Extension

- **FR-4.1**: Node type extended with optional `images` array:
  ```typescript
  images?: Array<{
    id: string;          // Unique identifier (e.g., "img-1234567890")
    data: string;        // Base64 data URI (e.g., "data:image/png;base64,...")
    filename: string;    // Original filename (e.g., "berlin-wall.jpg")
    size: number;        // File size in bytes
    addedAt: number;     // Timestamp when added
  }>;
  ```
- **FR-4.2**: Example node with images in JSON:
  ```json
  {
    "id": "stalingrad",
    "title": "Batalla de Stalingrado",
    "description": "...",
    "images": [
      {
        "id": "img-1729554100000",
        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
        "filename": "stalingrad-ruins.jpg",
        "size": 156789,
        "addedAt": 1729554100000
      }
    ]
  }
  ```

### FR-5: Programmatic Project Creation

- **FR-5.1**: Claude assistant can generate project JSON with base64-encoded images
- **FR-5.2**: When user requests "create mind map about X with images", Claude searches for relevant images online or uses placeholders
- **FR-5.3**: Images converted to base64 before embedding in JSON
- **FR-5.4**: Helper script provided for batch image-to-base64 conversion (optional tool)

---

## 4. Technical Requirements

### TR-1: Architecture

- **TR-1.1**: No changes to layout engine (images don't affect node positioning)
- **TR-1.2**: Images stored exclusively in project JSON (no local storage, no external URLs)
- **TR-1.3**: Base64 encoding ensures project portability (single JSON file contains everything)

### TR-2: Components

**New Components**:
- `ImageUpload.tsx` - Image upload UI for edit modal (file picker, preview list, delete)
- `ImageGallery.tsx` - Thumbnail gallery for info panel (horizontal row with click handlers)
- `ImageViewer.tsx` - Fullscreen viewer (overlay with navigation, keyboard handlers)

**Modified Components**:
- `NodeEditModal.tsx` - Add ImageUpload component below description
- `NodeInfoPanel.tsx` - Add ImageGallery component, update height calculation

### TR-3: Type Definitions

Update `/Users/gonzaloriederer/nodem-clean/src/types/node.ts`:
```typescript
export interface NodeImage {
  id: string;
  data: string;        // Base64 data URI
  filename: string;
  size: number;
  addedAt: number;
}

export interface Node {
  // ... existing fields
  images?: NodeImage[];  // Optional array
}
```

### TR-4: State Management

- **TR-4.1**: No new Zustand stores required (images are part of node data)
- **TR-4.2**: `updateNode()` action handles image array updates
- **TR-4.3**: Fullscreen viewer state managed locally in ImageViewer component (useState)

### TR-5: Performance

- **TR-5.1**: Large base64 strings increase JSON file size (estimated 30-50% overhead)
- **TR-5.2**: 5-image limit per node × 2MB per image = ~10MB max per node (acceptable)
- **TR-5.3**: Lazy rendering: only render thumbnails for visible nodes
- **TR-5.4**: Consider warning if total project size exceeds 50MB (future enhancement)

---

## 5. UI/UX Requirements

### UX-1: Edit Modal Image Section

**Layout**:
```
┌─────────────────────────────────────┐
│ [Title Input]                       │
├─────────────────────────────────────┤
│ [Description Textarea]              │
├─────────────────────────────────────┤
│ IMAGES (2/5)                        │
│ ┌────┐ ┌────┐                       │
│ │img │ │img │  [+ Add Image]        │
│ │ X  │ │ X  │                       │
│ └────┘ └────┘                       │
├─────────────────────────────────────┤
│ [Cancel] [Save Changes]             │
└─────────────────────────────────────┘
```

**Details**:
- Section header: "IMAGES (N/5)" showing count
- 60px × 60px preview thumbnails with delete X overlay
- "Add Image" button with upload icon
- Responsive layout (wraps on small screens)

### UX-2: Info Panel Gallery

**Layout**:
```
┌────────────────────────────┐
│ Node Description Text      │
│ ...                        │
│                            │
│ ┌────┐ ┌────┐ ┌────┐ [+2] │
│ │img1│ │img2│ │img3│      │
│ └────┘ └────┘ └────┘      │
└────────────────────────────┘
```

**Details**:
- 80px × 80px thumbnails, 8px gap
- Hover: subtle scale effect + shadow
- "+N more" badge if > 3 images
- Gallery appears 16px below description text

### UX-3: Fullscreen Viewer

**Layout**:
```
┌─────────────────────────────────────┐
│ ╔════════════════════════════════╗ X│
│ ║                                ║  │
│ ║                                ║  │
│ ║        [Image Centered]        ║  │
│ ║                                ║  │
│ ║                                ║  │
│ ╚════════════════════════════════╝  │
│        ← [2 / 5] →                  │
└─────────────────────────────────────┘
```

**Details**:
- Black background (rgba(0,0,0,0.95))
- Image scaled to fit (maintain aspect ratio)
- Navigation arrows (only if multiple images)
- Counter at bottom center
- Close X in top-right corner
- Fade-in animation (0.2s)

---

## 6. Acceptance Criteria

### AC-1: Image Upload
- [ ] User can open edit modal and see "Images" section
- [ ] User can click "Add Image" and select file from disk
- [ ] Selected image appears as 60px thumbnail in edit modal
- [ ] User can delete uploaded image by clicking X
- [ ] Attempting to upload 6th image shows error: "Maximum 5 images per node"
- [ ] Uploading 3MB file shows error: "Image too large. Maximum 2MB per file."
- [ ] Saving modal stores images as base64 in node JSON

### AC-2: Thumbnail Gallery
- [ ] Opening info panel for node with images shows gallery below description
- [ ] Gallery displays 80px × 80px thumbnails with 8px gaps
- [ ] Thumbnails have hover effect (scale 1.05)
- [ ] If node has > 3 images, shows "+N more" badge
- [ ] Panel height expands to fit gallery without cutting off

### AC-3: Fullscreen Viewer
- [ ] Clicking thumbnail opens fullscreen viewer with black background
- [ ] Image centered and scaled to fit viewport (max 90vw × 90vh)
- [ ] Pressing ESC closes viewer
- [ ] Clicking black background closes viewer
- [ ] If multiple images, arrow buttons appear on left/right
- [ ] Pressing arrow keys (← →) navigates between images
- [ ] Counter shows "N / Total" at bottom
- [ ] Close X button in top-right corner works

### AC-4: JSON Storage
- [ ] Saving node with images creates `images` array in JSON
- [ ] Each image object contains: id, data, filename, size, addedAt
- [ ] Base64 data URI format: "data:image/[type];base64,[encoded]"
- [ ] Loading project with images displays thumbnails correctly
- [ ] Exporting project creates single JSON file with all images embedded

### AC-5: Programmatic Creation
- [ ] User can request "create mind map about WWII with images"
- [ ] Claude generates JSON with base64-encoded images
- [ ] Generated project loads correctly with images visible
- [ ] Images are historically relevant to node topics

---

## 7. Out of Scope (Non-Goals)

### What This Feature Will NOT Include:

- **Image editing** - No cropping, rotation, filters (users edit externally)
- **Cloud storage** - No Firebase Storage or external image hosting (JSON only)
- **Drag-and-drop reordering** - Images display in order added (future enhancement)
- **Image captions** - Filename serves as identifier (future enhancement)
- **Animated GIFs** - Static frame only displayed (full animation future enhancement)
- **SVG support** - Only raster formats (jpg, png, gif, webp)
- **Zoom/pan in fullscreen** - Image fits viewport, no pinch-zoom (future enhancement)
- **Bulk image import** - One-by-one upload only (future enhancement)
- **Image compression** - User responsible for optimizing before upload (future enhancement)

---

## 8. Dependencies

### Technical Dependencies
- Existing v1.3-stable codebase
- React 18.3.1 with TypeScript
- Konva/react-konva for canvas rendering
- Zustand for state management
- Tailwind CSS for styling

### Feature Dependencies
- NodeInfoPanel component (already exists, needs modification)
- NodeEditModal component (already exists, needs modification)
- Node type definition (needs extension)

---

## 9. Success Metrics

1. **Adoption**: 50%+ of user-created nodes in example projects contain images within 2 weeks
2. **Usability**: Users successfully upload and view images without errors 95% of attempts
3. **Performance**: Projects with 20+ images load in < 2 seconds
4. **Programmatic Success**: Claude successfully generates image-rich mind maps 90% of requests

---

## 10. Open Questions

1. **Image optimization**: Should we auto-compress images above certain size threshold?
2. **Image sources**: Should we integrate Unsplash/Pexels API for AI-assisted image search?
3. **Accessibility**: How do screen readers handle base64 images? Need alt text?
4. **Mobile support**: Touch gestures for fullscreen viewer (pinch-zoom, swipe)?

---

## 11. Timeline Estimate

### Phase 1: Core Infrastructure (4-6 hours)
- Update Node type definition
- Create ImageUpload component
- Modify NodeEditModal to include upload UI
- Test base64 conversion and storage

### Phase 2: Display Components (3-4 hours)
- Create ImageGallery component
- Modify NodeInfoPanel height calculation
- Test thumbnail rendering and hover states

### Phase 3: Fullscreen Viewer (3-4 hours)
- Create ImageViewer component
- Implement keyboard handlers (ESC, arrows)
- Add navigation controls and counter
- Test viewer interactions

### Phase 4: Testing & Polish (2-3 hours)
- Write unit tests for new components
- Test with large images and multiple images
- Verify JSON export/import with images
- Fix bugs and edge cases

### Phase 5: Programmatic Creation (2-3 hours)
- Document JSON schema for Claude
- Test AI-generated projects with images
- Create helper script for batch conversion (optional)

**Total Estimate**: 14-20 hours of development

---

## 12. Next Steps

1. **Review PRD** with stakeholder (user) for approval
2. **Generate task list** using Phase 2 workflow (breakdown into sub-tasks)
3. **Begin implementation** starting with Phase 1 (core infrastructure)

---

*Document created following AI Dev Tasks workflow best practices*
*Ready for Phase 2: Task List Generation*
