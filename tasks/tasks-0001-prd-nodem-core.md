# Task List: NODEM Core Implementation

Based on PRD: `0001-prd-nodem-core.md`

## Relevant Files

**To be created during implementation**

### Core Application
- `src/App.tsx` - Main application component with layout structure
- `src/main.tsx` - Application entry point with React rendering
- `src/types/project.ts` - TypeScript type definitions for project, nodes, and actions
- `src/types/node.ts` - Node-specific type definitions
- `src/types/action.ts` - Action type definitions for recording/playback

### State Management (Zustand)
- `src/stores/projectStore.ts` - Project state management (current project, nodes, actions)
- `src/stores/viewportStore.ts` - Viewport state (zoom, pan, camera position)
- `src/stores/presentationStore.ts` - Presentation mode state (recording, playback)
- `src/stores/uiStore.ts` - UI state (selected node, focus mode, detail panel visibility)

### Components - Layout
- `src/components/Layout/AppLayout.tsx` - Main app layout with sidebar and canvas
- `src/components/Layout/Sidebar.tsx` - Left sidebar with project list
- `src/components/Layout/Toolbar.tsx` - Top toolbar with action buttons

### Components - Canvas
- `src/components/Canvas/Canvas.tsx` - Main canvas container with zoom/pan controls
- `src/components/Canvas/Node.tsx` - Individual node component
- `src/components/Canvas/Connector.tsx` - Bezier curve connector between nodes
- `src/components/Canvas/NodeDetails.tsx` - Detail panel for node information
- `src/components/Canvas/ImageFullscreen.tsx` - Full-screen image viewer

### Components - Project Management
- `src/components/Project/ProjectList.tsx` - List of projects in sidebar
- `src/components/Project/ProjectCard.tsx` - Individual project card
- `src/components/Project/NewProjectModal.tsx` - Modal for creating new projects

### Components - Presentation
- `src/components/Presentation/RecordingControls.tsx` - Start/stop recording buttons
- `src/components/Presentation/PresentationControls.tsx` - Playback controls (prev/next/progress)
- `src/components/Presentation/PresentationMode.tsx` - Full presentation view

### Utilities
- `src/utils/layoutEngine.ts` - Force-directed layout algorithm for node positioning
- `src/utils/animationHelpers.ts` - Animation timing and easing functions
- `src/utils/cameraHelpers.ts` - Camera positioning and zoom calculations
- `src/utils/fileHelpers.ts` - JSON file loading/saving utilities
- `src/utils/validators.ts` - JSON schema validation with Zod
- `src/utils/collisionDetection.ts` - Node collision detection and avoidance

### Configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Dependencies and scripts
- `.gitignore` - Git ignore patterns

### Tests
- Tests will be created alongside implementation files following the pattern:
  - `[component].test.tsx` for components
  - `[utility].test.ts` for utilities
  - `[store].test.ts` for stores

### Notes
- Use `npm test` or `yarn test` to run all tests
- Use `npm run dev` to start development server
- Node positioning uses force-directed layout (D3.js or custom implementation)
- All animations target 60fps using Framer Motion
- Project files are JSON and should validate against Zod schemas

---

## Tasks

- [x] 1.0 Project Setup and Infrastructure
  - [x] 1.1 Initialize Vite + React + TypeScript project
  - [x] 1.2 Install core dependencies (Zustand, Framer Motion, Zod)
  - [x] 1.3 Install UI dependencies (Tailwind CSS, Lucide React icons)
  - [x] 1.4 Configure Tailwind CSS (tailwind.config.js, globals.css)
  - [x] 1.5 Configure TypeScript (tsconfig.json with strict mode)
  - [x] 1.6 Set up testing framework (Vitest + React Testing Library)
  - [x] 1.7 Create basic folder structure (components, stores, utils, types)
  - [x] 1.8 Configure Git ignore (.gitignore for node_modules, dist, .env)
  - [x] 1.9 Write initial README with setup instructions
  - [x] 1.10 Verify dev server runs successfully
  - [x] 1.11 Write tests for basic setup
  - [x] 1.12 Commit initial project setup

- [x] 2.0 Core Data Layer (Types, Stores, Validation)
  - [x] 2.1 Define Node type interface (id, title, description, image, children, level, position)
  - [x] 2.2 Define Action type union (expand, collapse, showInfo, hideInfo, focus, unfocus, etc.)
  - [x] 2.3 Define Project type interface (projectId, name, nodes, rootNodeId, actions, metadata)
  - [x] 2.4 Create Zod schemas for Node validation
  - [x] 2.5 Create Zod schemas for Action validation
  - [x] 2.6 Create Zod schemas for Project validation
  - [x] 2.7 Implement projectStore with Zustand (nodes, currentProject, actions)
  - [x] 2.8 Implement viewportStore (zoom, pan, camera position)
  - [x] 2.9 Implement uiStore (selectedNode, focusMode, detailPanelOpen)
  - [x] 2.10 Implement presentationStore (isRecording, isPresenting, currentActionIndex)
  - [x] 2.11 Write unit tests for all type validators
  - [x] 2.12 Write unit tests for all stores
  - [x] 2.13 Verify all tests pass

- [ ] 3.0 Node Rendering and Basic Layout
  - [ ] 3.1 Create Canvas component with SVG container
  - [ ] 3.2 Create Node component with title display
  - [ ] 3.3 Add node styling (white background, shadow, rounded corners)
  - [ ] 3.4 Implement Connector component with Bezier curves
  - [ ] 3.5 Calculate connector path between parent and child nodes
  - [ ] 3.6 Style connectors (orange #E89B4E, 2px stroke)
  - [ ] 3.7 Implement basic horizontal layout (children to right of parent)
  - [ ] 3.8 Add vertical spacing between sibling nodes (40px minimum)
  - [ ] 3.9 Render example project (segunda-guerra-mundial.json)
  - [ ] 3.10 Write tests for Node component
  - [ ] 3.11 Write tests for Connector component
  - [ ] 3.12 Verify rendering in browser

- [ ] 4.0 Node Interactions (Expand/Collapse with Animations)
  - [ ] 4.1 Add expand/collapse button to nodes with children
  - [ ] 4.2 Implement expand logic (show children, update state)
  - [ ] 4.3 Implement collapse logic (hide children and descendants, update state)
  - [ ] 4.4 Create expand animation with Framer Motion (600ms ease-out)
  - [ ] 4.5 Create collapse animation with Framer Motion (400ms ease-in)
  - [ ] 4.6 Animate connectors in sync with node animations
  - [ ] 4.7 Implement collision detection utility
  - [ ] 4.8 Implement force-directed layout algorithm for repositioning
  - [ ] 4.9 Animate node repositioning on expand/collapse (400ms)
  - [ ] 4.10 Ensure no nodes overlap after animations
  - [ ] 4.11 Write tests for expand/collapse logic
  - [ ] 4.12 Write tests for collision detection
  - [ ] 4.13 Verify smooth 60fps animations in browser

- [ ] 5.0 Advanced Features (Focus, Details, Images)
  - [ ] 5.1 Create NodeDetails component (overlay card)
  - [ ] 5.2 Add "Info" button to nodes
  - [ ] 5.3 Implement showInfo action (open detail panel)
  - [ ] 5.4 Display node title, description, and image in panel
  - [ ] 5.5 Add close button to detail panel
  - [ ] 5.6 Implement hideInfo action (close detail panel)
  - [ ] 5.7 Create ImageFullscreen component
  - [ ] 5.8 Implement click-to-expand image functionality
  - [ ] 5.9 Add dark overlay (80% opacity) for fullscreen images
  - [ ] 5.10 Implement focus mode (blur non-focused nodes to 30% opacity, 4px blur)
  - [ ] 5.11 Add "Focus" button to nodes
  - [ ] 5.12 Implement unfocus action (restore all nodes to 100% opacity)
  - [ ] 5.13 Animate focus transitions (300ms)
  - [ ] 5.14 Write tests for detail panel
  - [ ] 5.15 Write tests for focus mode
  - [ ] 5.16 Verify all features work in browser

- [ ] 6.0 Viewport Controls (Zoom, Pan, Camera)
  - [ ] 6.1 Implement mouse wheel zoom (zoom center at cursor position)
  - [ ] 6.2 Add zoom controls UI (+/- buttons)
  - [ ] 6.3 Set zoom limits (25% to 400%)
  - [ ] 6.4 Implement smooth zoom animations
  - [ ] 6.5 Implement click-and-drag pan on canvas background
  - [ ] 6.6 Prevent pan when dragging nodes
  - [ ] 6.7 Add momentum scrolling to pan
  - [ ] 6.8 Create cameraHelpers utility for auto-positioning
  - [ ] 6.9 Implement "Fit to Screen" button
  - [ ] 6.10 Calculate bounds to fit all visible nodes
  - [ ] 6.11 Implement smart camera for expand (pan to show parent + children)
  - [ ] 6.12 Implement smart camera for showInfo (zoom to fit panel)
  - [ ] 6.13 Implement smart camera for focus (center on node)
  - [ ] 6.14 Add smooth camera transitions (500ms ease-in-out)
  - [ ] 6.15 Write tests for zoom logic
  - [ ] 6.16 Write tests for pan logic
  - [ ] 6.17 Write tests for camera helpers
  - [ ] 6.18 Verify smooth viewport controls in browser

- [ ] 7.0 Project Management (Load, Save, Sidebar)
  - [ ] 7.1 Create Sidebar component (300px width, collapsible)
  - [ ] 7.2 Create ProjectList component
  - [ ] 7.3 Create ProjectCard component (name, node count, last modified)
  - [ ] 7.4 Implement load project from JSON file (File System Access API)
  - [ ] 7.5 Validate loaded JSON with Zod schemas
  - [ ] 7.6 Display clear error messages for invalid JSON
  - [ ] 7.7 Implement save project to JSON file
  - [ ] 7.8 Implement auto-save to localStorage (every 30 seconds)
  - [ ] 7.9 Store recent projects list in localStorage
  - [ ] 7.10 Create NewProjectModal component
  - [ ] 7.11 Implement create new project (generates root node)
  - [ ] 7.12 Implement project switching (load different project)
  - [ ] 7.13 Add "+ New Project" button in sidebar
  - [ ] 7.14 Implement project deletion with confirmation
  - [ ] 7.15 Add right-click context menu for nodes (add child, delete, edit)
  - [ ] 7.16 Implement add child node functionality
  - [ ] 7.17 Implement delete node functionality (removes node and children)
  - [ ] 7.18 Implement edit node inline (double-click title)
  - [ ] 7.19 Update project JSON immediately on changes
  - [ ] 7.20 Write tests for file helpers
  - [ ] 7.21 Write tests for project operations
  - [ ] 7.22 Verify load/save/edit workflow in browser

- [ ] 8.0 Action Recording and Presentation Mode
  - [ ] 8.1 Create RecordingControls component (Record/Stop buttons)
  - [ ] 8.2 Implement recording state management
  - [ ] 8.3 Add visual recording indicator (red dot icon)
  - [ ] 8.4 Capture expand action with nodeId and timestamp
  - [ ] 8.5 Capture collapse action with nodeId
  - [ ] 8.6 Capture showInfo action with nodeId
  - [ ] 8.7 Capture hideInfo action with nodeId
  - [ ] 8.8 Capture focus action with nodeId
  - [ ] 8.9 Capture unfocus action
  - [ ] 8.10 Capture showImageFullscreen action with nodeId
  - [ ] 8.11 Capture hideImageFullscreen action
  - [ ] 8.12 Save actions array to project JSON on stop recording
  - [ ] 8.13 Create PresentationControls component (Play/Pause, Prev/Next)
  - [ ] 8.14 Create PresentationMode component
  - [ ] 8.15 Implement presentation playback (iterate through actions)
  - [ ] 8.16 Execute each action type correctly during playback
  - [ ] 8.17 Implement Previous action navigation
  - [ ] 8.18 Implement Next action navigation
  - [ ] 8.19 Add progress bar showing current action index
  - [ ] 8.20 Trigger smart camera positioning for each action
  - [ ] 8.21 Add presentation mode toggle (Enter/Exit)
  - [ ] 8.22 Write tests for action recording
  - [ ] 8.23 Write tests for action playback
  - [ ] 8.24 Verify complete recording/playback workflow in browser

---

**Status**: ✅ All sub-tasks generated

**Total Tasks**: 8 parent tasks, 136 sub-tasks

**Estimated Time**: 80-150 hours (MVP)

**Next Step**: Review task breakdown and respond with **"yes"** or **"y"** to begin Task 1.1
