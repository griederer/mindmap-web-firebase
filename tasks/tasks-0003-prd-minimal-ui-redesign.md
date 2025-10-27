# Task List: Minimal UI Redesign - Linear-Inspired Interface

**Source PRD:** `0003-prd-minimal-ui-redesign.md`

---

## Relevant Files

### Core Layout & Structure
- `src/components/Layout/Sidebar.tsx` - Left navigation sidebar
- `src/App.tsx` - Top header and main application layout
- `src/index.css` - Global CSS and design tokens

### Canvas & Visualization
- `src/components/Canvas/Canvas.tsx` - Main canvas container and background
- `src/components/Canvas/ZoomControls.tsx` - Zoom in/out controls
- `src/components/Canvas/NodeComponent.tsx` - Individual node rendering (Konva)
- `src/components/Canvas/NodeActionMenu.tsx` - Node action menu (Konva)
- `src/components/Canvas/NodeInfoPanel.tsx` - Node information panel (Konva)
- `src/components/Canvas/RelationshipLines.tsx` - Relationship connection lines (Konva)

### Modals & Overlays
- `src/components/Canvas/NodeEditModal.tsx` - Node editing modal
- `src/components/Canvas/RelationshipAssignMenu.tsx` - Relationship assignment submenu
- `src/components/Canvas/ImageViewer.tsx` - Full-screen image viewer
- `src/components/Canvas/ImageUpload.tsx` - Image upload component

### Relationship System
- `src/components/RelationshipSidebar/RelationshipSidebar.tsx` - Relationship management sidebar
- `src/components/RelationshipSidebar/RelationshipList.tsx` - List of relationships
- `src/components/RelationshipSidebar/RelationshipModal.tsx` - Create/edit relationship modal

### Configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Verify Lucide React is installed

### Documentation
- `docs/DESIGN_SYSTEM.md` - Design system reference (NEW)

### Notes
- All components already have `.tsx` files in the project
- Focus on visual transformation using Tailwind classes
- No test file changes needed (purely visual updates)
- Lucide React icons already installed - verify with `npm ls lucide-react`
- All changes should be non-breaking (maintain functionality)

---

## Tasks

- [x] 1.0 Design System Foundations
  - [x] 1.1 Verify Lucide React installation (`npm ls lucide-react`)
  - [x] 1.2 Update `tailwind.config.js` with refined color palette and shadow system
  - [x] 1.3 Update `src/index.css` with design tokens (typography, spacing, transitions)
  - [x] 1.4 Create `docs/DESIGN_SYSTEM.md` reference file with all design tokens
  - [x] 1.5 Test design system - verify Tailwind classes compile correctly

- [x] 2.0 Core Layout Transformation (Sidebar + Header)
  - [x] 2.1 Transform `Sidebar.tsx` - replace gradient with minimal white background
  - [x] 2.2 Update sidebar buttons with Lucide icons (replace emojis)
  - [x] 2.3 Refine sidebar hover states and spacing (use `hover:bg-gray-50`)
  - [x] 2.4 Update top header in `App.tsx` - white background with subtle border
  - [x] 2.5 Replace header icons with Lucide React components
  - [x] 2.6 Test sidebar and header - verify all buttons work correctly

- [ ] 3.0 Canvas & Controls Refinement
  - [ ] 3.1 Update `Canvas.tsx` background to light gray (`bg-gray-50`)
  - [ ] 3.2 Transform `ZoomControls.tsx` - white buttons with subtle borders
  - [ ] 3.3 Replace zoom icons with Lucide React components (ZoomIn, ZoomOut, Maximize2)
  - [ ] 3.4 Add subtle shadows and hover states to zoom controls
  - [ ] 3.5 Test canvas and controls - verify zoom, pan, and fit-to-screen work

- [ ] 4.0 Node Components Redesign (Konva)
  - [ ] 4.1 Update `NodeComponent.tsx` - white background with subtle border
  - [ ] 4.2 Refine node typography (use gray-900 for titles, gray-600 for descriptions)
  - [ ] 4.3 Improve node shadows (use subtle shadow system from design tokens)
  - [ ] 4.4 Transform `NodeActionMenu.tsx` - light theme with better unicode symbols
  - [ ] 4.5 Update `NodeInfoPanel.tsx` - white background, refined spacing
  - [ ] 4.6 Adjust `RelationshipLines.tsx` - ensure parent-child lines are subtle
  - [ ] 4.7 Test all node interactions - expand/collapse, action menu, info panel

- [ ] 5.0 Modal & Overlay Transformation
  - [ ] 5.1 Transform `NodeEditModal.tsx` - white modal with refined header
  - [ ] 5.2 Update modal form inputs - light borders, orange focus rings
  - [ ] 5.3 Replace modal icons with Lucide React components
  - [ ] 5.4 Transform `RelationshipAssignMenu.tsx` - white background, light theme
  - [ ] 5.5 Update `ImageViewer.tsx` - refined close button with Lucide X icon
  - [ ] 5.6 Update `ImageUpload.tsx` - minimal upload button with Lucide Upload icon
  - [ ] 5.7 Test all modals - verify open/close, form submission, image upload

- [ ] 6.0 Relationship System Redesign
  - [ ] 6.1 Transform `RelationshipSidebar.tsx` - keep dark theme but refine
  - [ ] 6.2 Update `RelationshipList.tsx` - improve spacing and hover states
  - [ ] 6.3 Transform `RelationshipModal.tsx` - white modal with light theme
  - [ ] 6.4 Replace relationship icons with Lucide React components (Link2, Edit2, Trash2)
  - [ ] 6.5 Test relationship system - create, edit, delete, assign nodes

- [ ] 7.0 Final Refinements & Documentation
  - [ ] 7.1 Visual audit - verify consistent spacing across all components
  - [ ] 7.2 Check all hover/focus states - ensure 150-200ms transitions
  - [ ] 7.3 Verify color consistency - orange accents, gray backgrounds
  - [ ] 7.4 Test complete user workflow - create project, add nodes, relationships
  - [ ] 7.5 Update README.md - add design system section and screenshot
  - [ ] 7.6 Final review - compare with Linear design principles
  - [ ] 7.7 Commit changes with descriptive message

---

**Status:** ✅ Task list complete - Ready for implementation
