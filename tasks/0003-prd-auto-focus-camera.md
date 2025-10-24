# PRD 0003: Auto Focus Camera with Dynamic Zoom

**Feature**: Automatic Camera Focus and Dynamic Zoom for Mind Map Navigation
**Version**: 1.0
**Created**: 2025-01-23
**Status**: Draft → Ready for Implementation

---

## 1. Introduction

### Problem Statement
Users navigating large mind maps with many nodes lose context when expanding nodes or viewing information panels. The current static camera requires manual panning and zooming to see newly revealed content, creating friction in the exploration experience. Users must constantly adjust zoom levels to read node details, especially when information panels with images appear.

### Goal
Implement an intelligent camera system that automatically focuses and zooms to show relevant content at optimal viewing scales. When users expand nodes, the camera should frame all visible children. When viewing info panels, the camera should ensure all content (descriptions, images) is readable without manual adjustment.

---

## 2. User Stories

### Epic: Auto Focus Camera System

**As a** mind map user exploring complex hierarchies
**I want** the camera to automatically center on content I'm viewing
**So that** I don't have to manually pan and zoom constantly

**As a** user expanding nodes with many children
**I want** the zoom level to adjust automatically
**So that** I can see all children at once without scrolling

**As a** user viewing node information panels
**I want** the camera to frame the node and panel together
**So that** I can read all content comfortably

**As a** power user who prefers manual control
**I want** to toggle Auto Focus on/off
**So that** I can choose my preferred navigation style

---

## 3. Functional Requirements

### 3.1 Auto Focus Toggle

**FR-001**: Add "Auto Focus" toggle button in ZoomControls component
- Icon: Target/crosshair icon from lucide-react
- State persisted in localStorage
- Default: ON for new users
- Visual indicator when active (highlighted button)

**FR-002**: Display tooltip explaining feature
- "Auto Focus: Camera centers on expanded nodes and info panels"

### 3.2 Dynamic Zoom on Node Expansion

**FR-003**: Calculate bounding box when node is expanded
- Include: parent node + all newly visible children
- Add padding: 100px on all sides
- Consider node dimensions: 200px width × 60px height

**FR-004**: Compute optimal zoom level
- Formula: `zoom = min(viewportWidth / contentWidth, viewportHeight / contentHeight)`
- Constraints: MIN_ZOOM (0.25) ≤ zoom ≤ MAX_ZOOM (4)
- Apply 0.9 multiplier for breathing room

**FR-005**: Center camera on bounding box center
- Calculate center point: `((minX + maxX) / 2, (minY + minY) / 2)`
- Account for current zoom level in position calculation

**FR-006**: Animate transition smoothly
- Duration: 500ms
- Easing: ease-in-out
- Update both zoom and position simultaneously

### 3.3 Dynamic Zoom for Info Panel

**FR-007**: Calculate bounding box when info panel opens
- Include: selected node + info panel width (240px) + offset (20px)
- Account for panel height (dynamic based on description + images)

**FR-008**: Adjust zoom to show full content
- Ensure description text is readable (min 13px font size visible)
- Ensure image thumbnails are visible (80px × 80px)
- Apply same zoom constraints as FR-004

**FR-009**: Center camera on node + panel combination
- Position node on left side of viewport
- Position panel on right side with comfortable margins

### 3.4 Auto Focus Behavior

**FR-010**: Auto Focus triggers on these actions (when enabled):
1. Clicking node toggle button (expand/collapse)
2. Clicking "Show Info" button (info panel opens)
3. Selecting a node (optional enhancement)

**FR-011**: Auto Focus does NOT trigger when:
- User manually pans/zooms (respects manual override)
- Auto Focus toggle is OFF
- Node is already in viewport with comfortable margins

**FR-012**: Manual override behavior
- User can pan/zoom at any time
- Auto Focus remains enabled
- Next trigger action will re-center camera

### 3.5 Edge Cases

**FR-013**: Handle nodes near canvas edges
- If content would go off-screen, adjust position
- Maintain minimum margins from viewport edges

**FR-014**: Handle extreme zoom requirements
- If content requires zoom < MIN_ZOOM, use MIN_ZOOM and allow scrolling
- If content requires zoom > MAX_ZOOM, use MAX_ZOOM and allow content to exceed viewport

**FR-015**: Handle rapid successive actions
- Cancel ongoing animation if new action triggers
- Immediately start new animation to latest target

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-001**: Animation must maintain 60 FPS
- Use CSS transforms for smooth rendering
- Leverage GPU acceleration (will-change property)

**NFR-002**: Bounding box calculation must complete < 50ms
- Optimize for large hierarchies (100+ visible nodes)

**NFR-003**: No jank or stuttering during animation
- Test with various content loads (0 images, 5 images, etc.)

### 4.2 Accessibility

**NFR-004**: Keyboard users can toggle Auto Focus
- Add keyboard shortcut (optional: "F" key)

**NFR-005**: Screen readers announce Auto Focus state changes
- aria-label updates on toggle

### 4.3 Compatibility

**NFR-006**: Works across all supported browsers
- Chrome, Firefox, Safari, Edge (latest 2 versions)

**NFR-007**: Works at all viewport sizes
- Desktop: 1920×1080 down to 1280×720
- Test zoom calculations at various resolutions

---

## 5. Non-Goals (Out of Scope)

**NG-001**: Animated camera paths following node relationships
- Future enhancement: smooth path interpolation

**NG-002**: Multiple focus modes (e.g., "fit to screen", "fill viewport")
- Current version: single "smart focus" algorithm

**NG-003**: Cinematic camera movements with bezier curves
- Current version: linear easing is sufficient

**NG-004**: Remember camera positions per project
- Future enhancement: save/restore viewport state

**NG-005**: Auto Focus on search results
- Will be addressed in separate search feature PRD

---

## 6. Design Considerations

### 6.1 Visual Design

**Toggle Button Design**:
- Icon: `Target` from lucide-react
- Active state: Orange background (#FB923C)
- Inactive state: Gray background (#9CA3AF)
- Tooltip: Always visible on hover

**Animation Design**:
- Smooth ease-in-out curve
- 500ms duration
- Both zoom and pan animate together (not sequentially)

### 6.2 Interaction Design

**User Flow - Expand Node**:
1. User clicks node toggle button
2. Children nodes become visible (fade-in animation)
3. [Auto Focus ON] Camera zooms out and centers on parent + children
4. Animation completes in 500ms
5. User can immediately interact (no forced wait)

**User Flow - Show Info Panel**:
1. User clicks "Show Info" button (i icon)
2. Info panel slides in from right
3. [Auto Focus ON] Camera pans to show node + panel
4. Camera adjusts zoom if needed
5. User can read all content comfortably

**User Flow - Toggle Auto Focus**:
1. User clicks Auto Focus button in ZoomControls
2. Button state changes (orange ↔ gray)
3. Preference saved to localStorage
4. Toast notification (optional): "Auto Focus enabled/disabled"

### 6.3 Algorithm Design

**Bounding Box Calculation**:
```typescript
function calculateBoundingBox(nodes: Node[]): BoundingBox {
  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 60;
  const PADDING = 100;

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  nodes.forEach(node => {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + NODE_WIDTH);
    maxY = Math.max(maxY, node.position.y + NODE_HEIGHT);
  });

  return {
    x: minX - PADDING,
    y: minY - PADDING,
    width: (maxX - minX) + PADDING * 2,
    height: (maxY - minY) + PADDING * 2,
  };
}
```

**Zoom Calculation**:
```typescript
function calculateOptimalZoom(bbox: BoundingBox, viewport: Viewport): number {
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 4;
  const COMFORT_FACTOR = 0.9; // Leave 10% breathing room

  const zoomX = (viewport.width / bbox.width) * COMFORT_FACTOR;
  const zoomY = (viewport.height / bbox.height) * COMFORT_FACTOR;

  const optimalZoom = Math.min(zoomX, zoomY);

  return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, optimalZoom));
}
```

**Camera Position Calculation**:
```typescript
function calculateCameraPosition(bbox: BoundingBox, zoom: number, viewport: Viewport) {
  const centerX = bbox.x + bbox.width / 2;
  const centerY = bbox.y + bbox.height / 2;

  return {
    x: viewport.width / 2 - centerX * zoom,
    y: viewport.height / 2 - centerY * zoom,
  };
}
```

---

## 7. Technical Implementation

### 7.1 Store Updates

**viewportStore.ts** - Add new actions:
- `autoFocusEnabled: boolean` (persisted)
- `setAutoFocus(enabled: boolean): void`
- `focusOnNodes(nodeIds: string[]): void`
- `focusOnNodeWithPanel(nodeId: string, panelWidth: number, panelHeight: number): void`

### 7.2 Animation System

**Approach**: Use `react-spring` or native React animation
- Pros: Smooth, interruptible, GPU-accelerated
- Cons: Additional dependency (17KB gzipped)

**Alternative**: CSS transitions with React state
- Pros: No dependencies, simple
- Cons: Less control over easing curves

**Decision**: Use CSS transitions for simplicity (v1.0)

### 7.3 Component Modifications

**Canvas.tsx**:
- Import `focusOnNodes` and `focusOnNodeWithPanel` from store
- Call on node expand/collapse
- Call on info panel open

**ZoomControls.tsx**:
- Add Auto Focus toggle button
- Connect to `autoFocusEnabled` state
- Show active/inactive state

**NodeComponent.tsx**:
- Trigger focus on expand/collapse (if Auto Focus enabled)

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Test File**: `src/stores/viewportStore.test.ts`

```typescript
describe('Auto Focus', () => {
  it('calculates bounding box for single node', () => {});
  it('calculates bounding box for parent + children', () => {});
  it('calculates optimal zoom within constraints', () => {});
  it('calculates camera position for centering', () => {});
  it('respects MIN_ZOOM constraint', () => {});
  it('respects MAX_ZOOM constraint', () => {});
});
```

**Test File**: `src/components/Canvas/ZoomControls.test.tsx`

```typescript
describe('Auto Focus Toggle', () => {
  it('renders toggle button', () => {});
  it('shows active state when enabled', () => {});
  it('shows inactive state when disabled', () => {});
  it('persists state to localStorage', () => {});
  it('restores state from localStorage', () => {});
});
```

### 8.2 Integration Tests

**Test File**: `src/components/Canvas/Canvas.integration.test.tsx`

```typescript
describe('Auto Focus Integration', () => {
  it('focuses on node when expanded', () => {});
  it('focuses on node + panel when info shown', () => {});
  it('does not focus when toggle is OFF', () => {});
  it('cancels ongoing animation on new trigger', () => {});
  it('handles rapid expand/collapse', () => {});
});
```

### 8.3 Manual Testing Checklist

**Scenario 1: Expand node with few children (2-3)**
- [ ] Camera centers on parent + children
- [ ] Zoom level allows comfortable reading
- [ ] Animation is smooth (60 FPS)
- [ ] All nodes visible with padding

**Scenario 2: Expand node with many children (10+)**
- [ ] Camera zooms out to show all children
- [ ] No children cut off at edges
- [ ] Zoom respects MIN_ZOOM limit
- [ ] Animation completes in ~500ms

**Scenario 3: Show info panel with images**
- [ ] Camera shows node + full panel
- [ ] Description text is readable
- [ ] Image thumbnails are visible
- [ ] No content cut off

**Scenario 4: Toggle Auto Focus OFF**
- [ ] Button shows inactive state
- [ ] Expanding nodes does NOT trigger focus
- [ ] Showing info does NOT trigger focus
- [ ] Preference persists after reload

**Scenario 5: Manual override**
- [ ] User can pan/zoom during Auto Focus
- [ ] Next action re-centers camera
- [ ] No conflicts or jitter

**Scenario 6: Edge cases**
- [ ] Node near top-left corner
- [ ] Node near bottom-right corner
- [ ] Single root node (no children)
- [ ] Rapid successive expansions

---

## 9. Success Metrics

### 9.1 Quantitative Metrics

**Adoption Rate**:
- Target: 80% of users keep Auto Focus enabled
- Measure: localStorage analytics (anonymized)

**Performance**:
- Animation FPS: ≥ 60 FPS (95th percentile)
- Calculation time: < 50ms (99th percentile)

**Engagement**:
- Nodes expanded per session: +20% increase
- Info panels viewed: +30% increase

### 9.2 Qualitative Metrics

**User Feedback**:
- "Much easier to explore large maps"
- "Love not having to zoom manually"
- "Wish I could turn it off" → Provide toggle!

**Usability Testing**:
- 5/5 users can find and use toggle
- 4/5 users prefer Auto Focus ON
- 0 reports of motion sickness (important!)

---

## 10. Rollout Plan

### 10.1 Development Phases

**Phase 1: Core Algorithm (Week 1)**
- Implement bounding box calculation
- Implement zoom calculation
- Implement camera positioning
- Unit tests for all calculations

**Phase 2: Integration (Week 1)**
- Add focusOnNodes to viewportStore
- Integrate with node expand/collapse
- Add CSS transitions
- Integration tests

**Phase 3: UI (Week 1)**
- Add toggle button to ZoomControls
- Add localStorage persistence
- Add tooltip
- Manual testing

**Phase 4: Polish (Week 1)**
- Handle edge cases
- Optimize performance
- Fix bugs from testing
- Documentation

### 10.2 Deployment Strategy

**Step 1**: Deploy to dev environment
**Step 2**: Internal testing (1-2 days)
**Step 3**: Deploy to Firebase production
**Step 4**: Monitor analytics and user feedback
**Step 5**: Iterate based on feedback

### 10.3 Rollback Plan

**Rollback Trigger**:
- Animation performance < 30 FPS on average devices
- User complaints > 5% of active users
- Critical bugs affecting core functionality

**Rollback Process**:
1. Revert to previous Git tag (v1.4.0)
2. Redeploy to Firebase
3. Announce rollback to users
4. Fix issues in dev branch
5. Redeploy when stable

---

## 11. Dependencies

### 11.1 Technical Dependencies

**Existing Code**:
- `viewportStore.ts` - Viewport state management
- `Canvas.tsx` - Main canvas component
- `ZoomControls.tsx` - Zoom control UI
- `NodeComponent.tsx` - Node rendering

**External Libraries**:
- `zustand` - Already in use for state
- `lucide-react` - Already in use for icons
- NO new dependencies required

### 11.2 Design Dependencies

**Icons**:
- Target icon (lucide-react) - For toggle button

**Colors**:
- Orange (#FB923C) - Active state
- Gray (#9CA3AF) - Inactive state

### 11.3 Documentation Dependencies

- Update user guide with Auto Focus feature
- Add keyboard shortcuts reference (if implemented)

---

## 12. Open Questions

**Q1**: Should we add a "center on root node" quick action button?
**A**: Out of scope for v1.0 - Can add in future

**Q2**: Should we animate camera path (arc) instead of straight line?
**A**: No - Linear is simpler and sufficient for v1.0

**Q3**: Should we add zoom limits per-project (e.g., max zoom for large maps)?
**A**: No - Global limits are sufficient

**Q4**: Should we add a "focus on selection" keyboard shortcut (F key)?
**A**: Optional enhancement - Implement if time allows

**Q5**: Should we disable Auto Focus during rapid interactions (< 100ms between actions)?
**A**: Yes - Add debouncing to prevent janky animations

---

## 13. Appendix

### 13.1 Algorithm Walkthrough Example

**Scenario**: User expands "WWII Allies" node with 3 children (USA, UK, USSR)

**Step 1 - Gather Nodes**:
```
Parent: { x: 400, y: 200 }
Child1: { x: 300, y: 350 }
Child2: { x: 400, y: 350 }
Child3: { x: 500, y: 350 }
```

**Step 2 - Calculate Bounding Box**:
```
minX: 300, minY: 200
maxX: 700 (500 + 200), maxY: 410 (350 + 60)
With padding (100px):
bbox = { x: 200, y: 100, width: 600, height: 410 }
```

**Step 3 - Calculate Zoom**:
```
Viewport: 1920×1080
zoomX: (1920 / 600) * 0.9 = 2.88
zoomY: (1080 / 410) * 0.9 = 2.37
optimalZoom: min(2.88, 2.37) = 2.37
Clamped: min(4, max(0.25, 2.37)) = 2.37
```

**Step 4 - Calculate Position**:
```
centerX: 200 + 600/2 = 500
centerY: 100 + 410/2 = 305
posX: 1920/2 - 500*2.37 = 960 - 1185 = -225
posY: 1080/2 - 305*2.37 = 540 - 723 = -183
```

**Step 5 - Animate**:
```
From: current zoom/position
To: zoom=2.37, x=-225, y=-183
Duration: 500ms
Easing: ease-in-out
```

### 13.2 Performance Considerations

**Optimization Techniques**:
1. Memoize bounding box calculations (React.useMemo)
2. Debounce rapid triggers (100ms threshold)
3. Use CSS transforms (GPU accelerated)
4. Cancel ongoing animations before starting new ones
5. Only calculate visible nodes (not collapsed children)

**Worst Case Scenario**:
- 100 visible nodes
- Calculation: ~10ms (acceptable)
- Animation: 500ms (fixed)
- Total: < 550ms (good UX)

---

## Approval

**Author**: AI Assistant (Claude Code)
**Reviewer**: User (Gonzalo Riederer)
**Status**: ✅ Approved for Implementation
**Target Version**: v1.5.0
**Estimated Effort**: 1-2 days (8-16 hours)

---

**Next Steps**:
1. Generate parent tasks (Phase 2A)
2. Generate detailed sub-tasks (Phase 2B)
3. Begin implementation
4. Test thoroughly
5. Deploy to Firebase

**Ready to proceed? Type "Go" to continue to task generation.**
