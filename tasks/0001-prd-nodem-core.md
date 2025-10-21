# PRD #0001: NODEM - Interactive Mind Map Presentation Tool

## 1. Introduction/Overview

NODEM is a web-based mind map presentation tool designed to replace traditional PowerPoint presentations with interactive, node-based visual storytelling. Unlike static slides, NODEM allows presenters to create dynamic, zoomable hierarchical structures where information is revealed progressively through smooth transitions and focus controls.

The application centers around a node-based architecture where each node can contain:
- Title/name (always visible)
- Detailed information (expandable)
- Images (full-screen viewable)
- Child nodes (expandable trees)

Key differentiator: **Presentation mode is action-based**, not slide-based. Every interaction (expand tree, show info, display image) is recorded as an action that can be replayed as a presentation sequence.

**Target Users**: Presenters, educators, consultants, and anyone who needs to present complex hierarchical information in an engaging, non-linear format.

## 2. Goals

### Primary Goals
1. **Replace PowerPoint**: Provide a compelling alternative to linear slide-based presentations for hierarchical information
2. **Smooth User Experience**: Achieve buttery-smooth transitions (60fps) for all node expansions, collapses, and camera movements
3. **Action-based Presentations**: Enable users to record interaction sequences and replay them as presentations
4. **Project-centric Architecture**: Store all data in portable JSON project files that can be edited manually or via Claude Code
5. **Zero Data Lock-in**: No backend database - all project data stored locally in human-readable JSON format

### Success Metrics
- Smooth 60fps animations for all transitions
- < 100ms response time for node interactions
- Support for mind maps with 100+ nodes without performance degradation
- Project files can be created/edited manually with clear JSON schema
- Presentation playback feels natural with auto-camera positioning

## 3. User Stories

### Core Interaction
- As a **presenter**, I want to start with a single root node so my audience isn't overwhelmed
- As a **presenter**, I want to expand child nodes with smooth animations so transitions feel professional
- As a **presenter**, I want nodes to auto-reposition when expanding/collapsing so they never overlap
- As a **presenter**, I want to focus on a single node and blur others so I can emphasize specific content
- As a **presenter**, I want to zoom in/out freely so I can navigate large mind maps
- As a **presenter**, I want to view node details in an expandable panel so I can reveal additional information

### Content Management
- As a **content creator**, I want to add/delete nodes directly in the app so I can build my mind map interactively
- As a **content creator**, I want to upload images to nodes so I can include visual content
- As a **content creator**, I want to view images full-screen so I can showcase high-resolution visuals
- As a **content creator**, I want to edit node titles and descriptions so I can refine my content
- As a **content creator**, I want all changes to save to the project JSON so my work is never lost

### Project Management
- As a **user**, I want to create new projects so I can organize different presentations
- As a **user**, I want to see all my projects in a sidebar so I can switch between them
- As a **user**, I want to load existing project JSON files so I can use Claude-generated mind maps
- As a **user**, I want to export project files so I can share or backup my work

### Presentation Mode
- As a **presenter**, I want to record my interaction sequence so I can create a repeatable presentation
- As a **presenter**, I want to play back recorded actions so I can deliver consistent presentations
- As a **presenter**, I want to navigate forward/backward through actions so I can control presentation flow
- As a **presenter**, I want the camera to auto-focus on the current action so my audience sees the right content
- As a **presenter**, I want smart zoom adjustments (zoom out for long text, zoom in for focused nodes) so content is always readable

## 4. Functional Requirements

### FR1: Node System
**FR1.1** Each node must have:
- Unique ID (generated or specified in JSON)
- Title (displayed on node)
- Description (optional, shown in detail panel)
- Image URL or base64 data (optional)
- Child node IDs (array, can be empty)
- Position data (x, y coordinates)
- Level (depth in hierarchy: 0 = root, 1 = first level, etc.)

**FR1.2** Node Display Rules:
- Root node displays centered on initial load
- Child nodes display to the right of parent
- Nodes at same level maintain vertical spacing
- Node width adapts to title length (min: 120px, max: 300px)
- Node height is fixed (60px for standard nodes)

**FR1.3** Node Interactions:
- Click node to select/focus
- Double-click to expand/collapse children
- Right-click for context menu (edit, delete, add child)
- Hover shows interaction buttons (info, focus, expand)

### FR2: Tree Expansion/Collapse
**FR2.1** Expansion Behavior:
- When expanding: child nodes fade in and slide from parent position to final position
- Animation duration: 600ms with ease-out curve
- Connector lines animate in sync with nodes
- All affected nodes reposition to avoid overlap

**FR2.2** Collapse Behavior:
- When collapsing: child nodes and their children slide back to parent and fade out
- All associated connectors fade out
- Any open detail panels for collapsed nodes close
- Duration: 400ms with ease-in curve

**FR2.3** Collision Avoidance:
- Use force-directed layout algorithm for auto-positioning
- Maintain minimum 40px vertical spacing between nodes
- Maintain minimum 100px horizontal spacing between levels
- Recalculate positions on every expand/collapse
- Animate position changes smoothly over 400ms

### FR3: Node Details Panel
**FR3.1** Panel Display:
- Appears as overlay card near selected node
- Contains: title, full description, image (if present), edit controls
- Max width: 400px
- Max height: 80vh (scrollable if content exceeds)

**FR3.2** Panel Interactions:
- Click "Info" button on node to open
- Click outside panel or close button to dismiss
- Panel follows node during animations (sticky positioning)
- Image thumbnails click to full-screen view

**FR3.3** Image Full-Screen:
- Click image to expand to full viewport
- Semi-transparent dark overlay (80% opacity)
- Click anywhere to close
- ESC key to close

### FR4: Focus Mode
**FR4.1** When focusing on a node:
- Selected node remains at 100% opacity
- All other nodes fade to 30% opacity
- Apply 4px blur to non-focused nodes
- Maintain interactive state (can still click blurred nodes to switch focus)

**FR4.2** Focus Exit:
- Click "Unfocus" button or click canvas background
- All nodes animate back to 100% opacity
- Blur effect fades out over 300ms

### FR5: Zoom & Pan
**FR5.1** Zoom Controls:
- Mouse wheel to zoom in/out
- Zoom range: 25% to 400%
- Zoom center: mouse cursor position
- Pinch gesture support on touch devices

**FR5.2** Pan Controls:
- Click and drag canvas background to pan
- No drag on nodes (reserved for selection)
- Momentum scrolling (continues briefly after release)

**FR5.3** Camera Auto-positioning:
- "Fit to Screen" button centers and scales to show all visible nodes
- Smart bounds calculation (includes all expanded nodes)

### FR6: Project System
**FR6.1** Project Structure (JSON):
```json
{
  "projectId": "unique-id",
  "name": "Project Name",
  "createdAt": "2025-01-20T12:00:00Z",
  "updatedAt": "2025-01-20T14:30:00Z",
  "nodes": [
    {
      "id": "node-1",
      "title": "Root Node",
      "description": "Detailed information here...",
      "image": "data:image/png;base64,..." or "https://...",
      "children": ["node-2", "node-3"],
      "level": 0,
      "position": { "x": 0, "y": 0 }
    }
  ],
  "rootNodeId": "node-1",
  "actions": []
}
```

**FR6.2** Project Operations:
- Create new project (generates empty JSON with root node)
- Load project from JSON file
- Save project to JSON file (auto-save every 30 seconds)
- Export project as JSON download

**FR6.3** Project List Sidebar:
- Left sidebar (300px wide, collapsible)
- Shows all projects in localStorage or loaded directory
- Click to switch projects
- "+ New Project" button at bottom
- Project cards show: name, node count, last modified date

### FR7: Node Editing
**FR7.1** In-App Editing:
- All edits update project JSON immediately
- Add node: right-click parent → "Add Child Node"
- Delete node: right-click → "Delete" (prompts for confirmation)
- Edit node: double-click title to edit inline, or use detail panel
- Changes trigger auto-save

**FR7.2** Manual JSON Editing:
- Users can edit project JSON files directly
- App validates JSON on load
- Shows clear error messages for invalid schemas
- Schema documentation available in docs

### FR8: Action Recording & Presentation Mode
**FR8.1** Action Types:
```json
{
  "type": "expand",
  "nodeId": "node-2",
  "timestamp": 1234567890
}
{
  "type": "collapse",
  "nodeId": "node-2"
}
{
  "type": "showInfo",
  "nodeId": "node-3"
}
{
  "type": "hideInfo",
  "nodeId": "node-3"
}
{
  "type": "focus",
  "nodeId": "node-4"
}
{
  "type": "unfocus"
}
{
  "type": "showImageFullscreen",
  "nodeId": "node-5"
}
{
  "type": "hideImageFullscreen"
}
{
  "type": "zoom",
  "level": 1.5
}
{
  "type": "pan",
  "position": { "x": 100, "y": 200 }
}
```

**FR8.2** Recording Mode:
- Toggle "Record" button in top toolbar
- While recording, all user interactions append to `actions` array
- Visual indicator shows recording state (red dot icon)
- "Stop Recording" saves action sequence to project JSON

**FR8.3** Presentation Playback:
- "Present" button enters presentation mode
- Full-screen mode (optional)
- Navigation controls: Previous/Next action, Progress bar
- Each action plays with same timing and animations as original interaction
- Auto-camera positioning for each action

**FR8.4** Smart Camera in Presentation:
- On `expand`: camera pans to show parent + newly visible children
- On `showInfo`: camera zooms/pans to fit detail panel in view
- On `focus`: camera centers on focused node
- On `showImageFullscreen`: no camera movement (image fills screen)
- Smooth camera transitions: 500ms ease-in-out

### FR9: Connectors
**FR9.1** Visual Style:
- Bezier curves connecting parent to children
- Color: #E89B4E (orange, matching screenshot)
- Stroke width: 2px
- Smooth curves (not straight lines)

**FR9.2** Animation:
- Connectors animate in/out with nodes
- Path morphs smoothly when nodes reposition
- Connectors hidden when parent collapsed

## 5. Non-Goals (Out of Scope for MVP)

**NG1:** Real-time collaboration (multi-user editing)
- Rationale: Adds significant complexity; can be added in v2

**NG2:** Cloud storage/sync
- Rationale: MVP is local-first; cloud can be added later

**NG3:** Advanced styling (custom colors, fonts per node)
- Rationale: Consistent visual style for MVP; customization in future

**NG4:** Import from PowerPoint/other formats
- Rationale: Nice-to-have but not core to value proposition

**NG5:** Audio/video in nodes
- Rationale: Images are sufficient for MVP; multimedia later

**NG6:** Mobile app (native iOS/Android)
- Rationale: Web-first approach; mobile web should work reasonably well

**NG7:** Presentation analytics (which nodes viewed, for how long)
- Rationale: Interesting for enterprise but not MVP

## 6. Design Considerations

### Visual Design
- Clean, minimal interface (reference: provided screenshots)
- Color scheme:
  - Primary: #E89B4E (orange for connectors, accents)
  - Background: #FAFAFA (light gray)
  - Nodes: White with subtle shadow
  - Text: #333333 (dark gray)
- Typography:
  - Node titles: 16px, semi-bold
  - Descriptions: 14px, regular
- Shadows: Subtle elevation (0 2px 8px rgba(0,0,0,0.1))

### UX Patterns
- Right-to-left information flow (root on left, children to right)
- Expandable sections follow standard patterns (chevron icons)
- Button placement: Top-right of nodes for actions
- Keyboard shortcuts:
  - Space: Expand/collapse selected node
  - E: Toggle info panel
  - F: Toggle focus mode
  - Esc: Close panels, exit modes
  - Arrow keys: Navigate between nodes

### Responsive Design
- Desktop-first (1920x1080 baseline)
- Minimum supported: 1280x720
- Tablet landscape mode supported
- Phone support nice-to-have but not priority

## 7. Technical Considerations

### Technology Stack Recommendations
**Frontend Framework:**
- React 18+ with TypeScript (type safety for complex state)
- Vite for fast dev builds

**Canvas Rendering:**
- Option A: React Flow (pre-built node graphs, customizable)
- Option B: D3.js for custom force-directed layout
- Option C: HTML Canvas with manual rendering (max performance)
- **Recommendation**: Start with React Flow for speed, custom D3 if performance issues

**State Management:**
- Zustand (lightweight, simple API)
- Store: current project, nodes, viewport state, recording state

**Animation:**
- Framer Motion for React component animations
- D3 transitions for SVG connector animations

**File Handling:**
- File System Access API for project save/load
- LocalStorage for recent projects list
- JSON schema validation with Zod

**Deployment:**
- Vercel or Netlify (static hosting)
- GitHub Pages alternative

### Performance Requirements
- 60fps animations on modern browsers (Chrome 90+, Safari 14+, Firefox 88+)
- Handle 100 nodes without lag
- Max 500ms for layout recalculation on expand/collapse
- < 50ms for action recording (shouldn't block UI)

### Data Persistence
- Auto-save every 30 seconds to localStorage (backup)
- Primary save: user-triggered export to JSON file
- No backend required for MVP

### Browser Compatibility
- Chrome 90+ (primary)
- Safari 14+ (macOS)
- Firefox 88+
- Edge 90+
- No IE11 support

## 8. Success Metrics

### User Engagement
- Average presentation playback completion rate > 80%
- Average nodes per project > 10 (indicates real usage vs. testing)

### Performance
- Animation frame rate maintained at 60fps for 95% of interactions
- Zero crashes during 30-minute presentation sessions

### Adoption
- 100 active users within first month (post-launch)
- 10 projects created per active user (indicates retention)

### Quality
- < 5 critical bugs reported in first week
- 4.0+ user satisfaction rating (1-5 scale)

## 9. Open Questions

**Q1:** Should we support multiple root nodes in a single project?
- Current design: single root node
- Alternative: forest of trees
- Decision needed by: Start of implementation

**Q2:** What's the maximum recommended nodes per project?
- Need to define limits for UX guidance
- Test performance with 500, 1000 nodes

**Q3:** Should actions include timing information?
- Current: actions are sequential
- Alternative: include delays between actions for more natural playback
- Impact: more complex recording/playback logic

**Q4:** How to handle very long node descriptions?
- Truncate in detail panel?
- Auto-scroll?
- Split into multiple nodes?

**Q5:** Offline PWA support?
- Service workers for offline access?
- Not critical for MVP but could be quick win

**Q6:** Undo/Redo for editing?
- Highly desirable but adds complexity
- Priority: medium (can add after MVP)

---

## Appendix: JSON Schema Example

**Complete Project Example:**
```json
{
  "projectId": "segunda-guerra-mundial",
  "name": "Segunda Guerra Mundial",
  "createdAt": "2025-01-20T10:00:00Z",
  "updatedAt": "2025-01-20T15:30:00Z",
  "rootNodeId": "node-root",
  "nodes": [
    {
      "id": "node-root",
      "title": "Segunda Guerra Mundial",
      "description": null,
      "image": null,
      "children": ["node-potencias", "node-consecuencias", "node-aliados", "node-causas"],
      "level": 0,
      "position": { "x": 0, "y": 0 }
    },
    {
      "id": "node-potencias",
      "title": "Potencias del Eje",
      "description": null,
      "image": null,
      "children": ["node-italia", "node-japon", "node-alemania"],
      "level": 1,
      "position": { "x": 400, "y": -200 }
    },
    {
      "id": "node-italia",
      "title": "Italia Fascista",
      "description": "Bajo el gobierno de Benito Mussolini",
      "image": null,
      "children": ["node-imperio-colonial", "node-camisas-negras"],
      "level": 2,
      "position": { "x": 800, "y": -300 }
    }
  ],
  "actions": [
    {
      "type": "expand",
      "nodeId": "node-root",
      "timestamp": 1705753200000
    },
    {
      "type": "expand",
      "nodeId": "node-potencias",
      "timestamp": 1705753205000
    },
    {
      "type": "showInfo",
      "nodeId": "node-italia",
      "timestamp": 1705753210000
    }
  ],
  "metadata": {
    "version": "1.0.0",
    "schema": "https://nodem.app/schema/v1"
  }
}
```

---

**Prepared for**: Development Team
**Date**: 2025-01-20
**Version**: 1.0
**Status**: Ready for Task Generation
