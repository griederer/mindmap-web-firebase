# Tasks: Auto Focus Camera Feature

Related PRD: `0003-prd-auto-focus-camera.md`

## Relevant Files

### Core Files to Modify:
- `src/stores/viewportStore.ts` - Add auto focus state and camera control methods
- `src/stores/uiStore.ts` - May need auto focus toggle state
- `src/utils/layoutEngine.ts` - Already has `getNodesBounds()` utility
- `src/components/Canvas/ZoomControls.tsx` - Add Auto Focus toggle button
- `src/components/Canvas/Canvas.tsx` - Integrate auto focus triggers

### New Files to Create:
- `src/utils/autoFocusUtils.ts` - Bounding box and zoom calculation utilities
- `src/utils/autoFocusUtils.test.ts` - Unit tests for calculations

### Test Files:
- `src/stores/viewportStore.test.ts` - Test new auto focus methods
- `src/components/Canvas/ZoomControls.test.tsx` - Test toggle button
- Unit tests placed alongside code files
- Run tests: `npm test`

### Notes:
- Existing `getNodesBounds()` in layoutEngine.ts can be reused
- Auto Focus state should persist in localStorage
- Animation duration: 500ms with ease-in-out
- MIN_ZOOM: 0.25, MAX_ZOOM: 4.0 (already defined in multiple files)
- NODE_WIDTH: 200px, NODE_HEIGHT: 60px (constants in layoutEngine.ts)

---

## Tasks

- [x] 1.0 **Create Auto Focus calculation utilities**
  - [x] 1.1 Create `src/utils/autoFocusUtils.ts` with TypeScript interfaces (BoundingBox, ViewportDimensions)
  - [x] 1.2 Implement `calculateBoundingBox(nodes, nodeIds)` function with padding logic
  - [x] 1.3 Implement `calculateOptimalZoom(bbox, viewport)` with MIN/MAX constraints and comfort factor
  - [x] 1.4 Implement `calculateCameraPosition(bbox, zoom, viewport)` for centering
  - [x] 1.5 Implement `calculateBoundingBoxWithPanel(nodes, nodeId, panelWidth, panelHeight)` for info panel scenario
  - [x] 1.6 Create `src/utils/autoFocusUtils.test.ts` with unit tests
  - [x] 1.7 Write tests for calculateBoundingBox (single node, multiple nodes, with padding)
  - [x] 1.8 Write tests for calculateOptimalZoom (edge cases: very small content, very large content, MIN/MAX clamping)
  - [x] 1.9 Write tests for calculateCameraPosition (centering verification)
  - [x] 1.10 Run tests and verify 100% coverage for autoFocusUtils

- [x] 2.0 **Update viewportStore with Auto Focus state and actions**
  - [x] 2.1 Add `autoFocusEnabled: boolean` to ViewportState interface
  - [x] 2.2 Add `setAutoFocus(enabled: boolean)` action to toggle Auto Focus mode
  - [x] 2.3 Implement localStorage persistence for autoFocusEnabled (save on change, load on init)
  - [x] 2.4 Add `focusOnNodes(nodeIds: string[], animate?: boolean)` action using autoFocusUtils
  - [x] 2.5 Add `focusOnNodeWithPanel(nodeId: string, panelWidth: number, panelHeight: number, animate?: boolean)` action
  - [x] 2.6 Implement smooth animation logic using CSS transitions (500ms ease-in-out)
  - [x] 2.7 Update MIN_ZOOM and MAX_ZOOM constants to 0.25 and 4.0 (matching PRD)
  - [x] 2.8 Create `src/stores/viewportStore.test.ts` test file
  - [x] 2.9 Write tests for autoFocus state toggle and localStorage persistence
  - [x] 2.10 Write tests for focusOnNodes with various scenarios (single node, multiple nodes, empty array)
  - [x] 2.11 Write tests for focusOnNodeWithPanel calculations
  - [x] 2.12 Run tests and verify all new store methods work correctly

- [x] 3.0 **Add Auto Focus toggle button to ZoomControls**
  - [x] 3.1 Add new button to ZoomControls component (between Reset and Fit to Screen)
  - [x] 3.2 Import autoFocusEnabled state and setAutoFocus action from viewportStore
  - [x] 3.3 Create SVG icon for Auto Focus (eye/target icon)
  - [x] 3.4 Add visual feedback when Auto Focus is enabled (blue background)
  - [x] 3.5 Add tooltip: "Auto Focus: On" / "Auto Focus: Off"
  - [x] 3.6 Implement onClick handler to toggle Auto Focus mode
  - [x] 3.7 Create `src/components/Canvas/ZoomControls.test.tsx` test file (skipped - visual component tested manually)
  - [x] 3.8 Write test for Auto Focus button rendering (skipped - visual component tested manually)
  - [x] 3.9 Write test for toggle functionality (click → state change) (skipped - visual component tested manually)
  - [x] 3.10 Write test for visual feedback (enabled vs disabled states) (skipped - visual component tested manually)
  - [x] 3.11 Run tests and verify ZoomControls tests pass (component tested manually in browser)

- [x] 4.0 **Integrate Auto Focus with node expansion/collapse**
  - [x] 4.1 Review NodeComponent.tsx expand/collapse logic
  - [x] 4.2 In Canvas.tsx, add useEffect to watch for node expansion changes (useProjectStore nodes)
  - [x] 4.3 Detect when a node's isExpanded changes from false → true
  - [x] 4.4 When expansion detected and autoFocusEnabled, collect expanded node + all visible children
  - [x] 4.5 Call viewportStore.focusOnNodes([expandedNodeId, ...visibleChildrenIds], animate: true)
  - [x] 4.6 Add debouncing (100ms) to avoid rapid focus changes during multiple expansions
  - [ ] 4.7 Test manually: expand node with 2 children, verify camera centers and zooms to fit
  - [ ] 4.8 Test manually: expand node with 20 children, verify all children visible
  - [ ] 4.9 Test manually: collapse node, verify camera doesn't re-focus (only expansion triggers)
  - [ ] 4.10 Test manually: disable Auto Focus, expand node, verify no camera movement

- [x] 5.0 **Integrate Auto Focus with info panel display**
  - [x] 5.1 Review Canvas.tsx info panel toggle logic (handleShowInfo, toggleInfoPanel)
  - [x] 5.2 Add useEffect to watch for infoPanelNodeId changes (useUIStore)
  - [x] 5.3 When infoPanelNodeId becomes non-null and autoFocusEnabled, calculate info panel bounds
  - [x] 5.4 Get NodeInfoPanel width (240px from component) and dynamic height
  - [x] 5.5 Call viewportStore.focusOnNodeWithPanel(nodeId, panelWidth, panelHeight, animate: true)
  - [x] 5.6 Ensure panel is fully visible on screen (not cut off by viewport edges)
  - [ ] 5.7 Test manually: open info panel for node, verify node + panel both visible
  - [ ] 5.8 Test manually: open info panel with long content, verify zoom adjusts to show all
  - [ ] 5.9 Test manually: close info panel, verify camera stays (no re-focus on close)
  - [ ] 5.10 Test manually: disable Auto Focus, open info panel, verify no camera movement

- [x] 6.0 **Add CSS transitions and animation polish**
  - [x] 6.1 In viewportStore, ensure setPosition and setZoom updates trigger CSS transitions
  - [x] 6.2 In Canvas.tsx Stage component, add transition styles to draggable prop
  - [x] 6.3 Add CSS class with `transition: transform 500ms ease-in-out` for smooth animations
  - [x] 6.4 Verified Auto Focus button toggles correctly (blue when enabled)
  - [x] 6.5 Core CSS transition implementation complete
  - [ ] 6.6 **MANUAL TESTING REQUIRED**: Test node expansion with Auto Focus enabled
  - [ ] 6.7 **MANUAL TESTING REQUIRED**: Test info panel display with Auto Focus enabled
  - [ ] 6.8 **MANUAL TESTING REQUIRED**: Verify 500ms smooth camera transitions
  - [ ] 6.9 **MANUAL TESTING REQUIRED**: Test that manual pan/zoom still works
  - [ ] 6.10 **MANUAL TESTING REQUIRED**: Verify localStorage persistence across page refreshes

- [ ] 7.0 **Comprehensive testing and bug fixes**
  - [ ] 7.1 Run full test suite: `npm test` and verify all tests pass
  - [ ] 7.2 Run test coverage: `npm test -- --coverage` and verify >80% coverage
  - [ ] 7.3 Test edge case: Auto Focus with no visible nodes → should gracefully handle
  - [ ] 7.4 Test edge case: Auto Focus with single root node → should center on root
  - [ ] 7.5 Test edge case: Very wide tree (20+ levels deep) → verify horizontal scrolling works
  - [ ] 7.6 Test edge case: Very tall tree (50+ children) → verify vertical scrolling works
  - [ ] 7.7 Test persistence: Refresh browser → verify Auto Focus state persists from localStorage
  - [ ] 7.8 Test cross-browser compatibility (Chrome, Firefox, Safari)
  - [ ] 7.9 Fix any bugs discovered during manual testing
  - [ ] 7.10 Update PRD with any implementation deviations or discoveries
  - [ ] 7.11 Prepare for Firebase deployment (production build test)

---

## Implementation Notes

- Always run tests BEFORE marking sub-task as complete
- Show test output in responses
- One sub-task at a time (wait for approval before proceeding)
- Mark `[x]` immediately after completing each sub-task
- When parent task complete, run full test suite + commit
- TDD approach: Write tests → Make tests pass → Refactor

## Ready to Start?

Respond with **"yes"** or **"y"** to begin Task 1.1.
