# PRD: Timeline Keyboard Navigation & Performance Optimization

## 1. Introduction/Overview

The current timeline view lacks keyboard navigation capabilities and suffers from performance issues that result in choppy, non-fluid animations and transitions. Users expect smooth 60 FPS interactions similar to modern applications, but the current implementation shows visible stuttering during zoom, pan, and node expansion operations. Additionally, event labels overlap when multiple events occur close together on the same track.

**Problem Statement:**
- No keyboard navigation for timeline events (users must use mouse only)
- Animations are choppy and entrecortado (stuttering/janky)
- Performance issues affect user experience even on capable hardware (Mac)
- Event labels overlap in timeline view, making them unreadable
- ESC key doesn't close open panels/modals in timeline view

**Goal:**
Enhance timeline usability with keyboard navigation and optimize rendering performance to achieve smooth 60 FPS animations across all interactions (zoom, pan, node expansion, auto-focus).

## 2. Goals

1. **G1 - Keyboard Navigation:** Implement year-by-year navigation using arrow keys in timeline view
2. **G2 - Smooth Performance:** Achieve 60 FPS (16.67ms per frame) for all animations and transitions
3. **G3 - Text Collision Prevention:** Prevent event label overlap in timeline view
4. **G4 - Keyboard Shortcuts:** Implement ESC key to close any open panel/modal
5. **G5 - Auto-zoom Integration:** Ensure automatic zoom adjustment works seamlessly with keyboard navigation

## 3. User Stories

**US1:** As a user viewing the timeline, I want to use arrow keys to navigate year by year, so that I can quickly explore historical events without using the mouse.

**US2:** As a user, I want smooth 60 FPS animations when zooming, panning, or expanding nodes, so that the application feels professional and responsive.

**US3:** As a user viewing timeline events, I want event labels to never overlap, so that I can read all event titles without confusion.

**US4:** As a user, I want to press ESC to close any open panel (info panel, edit modal), so that I can quickly return to the main view using only the keyboard.

**US5:** As a user navigating with arrow keys, I want the camera to automatically zoom and pan to show the current year clearly, so that I don't lose context of where I am in the timeline.

## 4. Functional Requirements

### FR1 - Keyboard Navigation (Timeline View)

**FR1.1:** When timeline view is active and no modal is open, LEFT arrow key must navigate to the previous year
- Calculate current viewport center position
- Find the year marker immediately to the left
- Animate camera to center on that year
- Animation duration: 400ms with easeOutCubic easing

**FR1.2:** When timeline view is active and no modal is open, RIGHT arrow key must navigate to the next year
- Calculate current viewport center position
- Find the year marker immediately to the right
- Animate camera to center on that year
- Animation duration: 400ms with easeOutCubic easing

**FR1.3:** When navigating to a year, the system must automatically adjust zoom if needed
- Calculate optimal zoom to show full year width (all events in that year should be visible)
- Apply zoom adjustment during the same 400ms animation
- Respect MIN_ZOOM (0.25) and MAX_ZOOM (4) constraints

**FR1.4:** Year navigation must wrap around at boundaries
- If at the first year (2012) and user presses LEFT, go to last year (2026)
- If at the last year (2026) and user presses RIGHT, go to first year (2012)

**FR1.5:** Arrow key navigation must be disabled when:
- Edit modal is open
- Input fields are focused
- Text is being selected

### FR2 - ESC Key Handler

**FR2.1:** ESC key must close the currently open panel/modal in this priority order:
1. If Edit Modal is open → close edit modal
2. If Image Viewer is open → close image viewer
3. If Info Panel is open → close info panel
4. If Timeline Event Info Panel is open → close event panel
5. If Relationship Sidebar is open → close sidebar

**FR2.2:** ESC key must work in both mindmap and timeline views

**FR2.3:** ESC key must not interfere with browser default behavior when:
- Native browser dialogs are open
- Developer tools are focused
- Browser search is active

### FR3 - Text Collision Prevention (Timeline View)

**FR3.1:** Event labels must never overlap horizontally or vertically

**FR3.2:** Collision detection algorithm must:
- Group events by track
- Sort events chronologically within each track
- Calculate label bounding boxes (width based on character count × 7px, height = 20px)
- Detect overlaps using bounding box intersection
- Adjust label Y position when collision detected:
  - First attempt: move up by 25px
  - Second attempt: move down by 25px
  - Third attempt: move up by 50px
  - Continue alternating up/down with increasing offsets
- Store final positions in a Map for rendering

**FR3.3:** When labels are adjusted vertically, a connecting line must be drawn from the event circle to the label
- Line color: match track color
- Line width: 1px
- Line style: solid
- Line should be straight (no curves)

**FR3.4:** Collision detection must be optimized for performance:
- Run only once during component render
- Cache results until events or zoom changes
- Maximum computation time: < 10ms for 100 events

### FR4 - Performance Optimization

**FR4.1:** Canvas Rendering Optimization
- Use `Konva.Layer.batchDraw()` instead of `draw()` for all updates
- Implement frame throttling: maximum 60 updates per second (16.67ms intervals)
- Enable `pixelRatio: 1` for devices with high DPI when zoom < 1
- Disable shadows during animations (re-enable on animation end)

**FR4.2:** Animation Optimization
- Use `Konva.Tween` with `requestAnimationFrame` for all animations
- Set `Konva.dragDistance = 3` to prevent accidental drags during clicks
- Use `transform` property instead of individual `x`, `y`, `scaleX`, `scaleY` updates
- Cancel ongoing animations before starting new ones

**FR4.3:** Node Rendering Optimization
- Implement viewport culling: only render nodes within visible area + 500px buffer
- Use `listening: false` for decorative elements (connectors, background shapes)
- Cache node shapes using `cache()` for complex nodes (> 5 elements)
- Clear cache when node is edited

**FR4.4:** Auto-Focus Optimization
- Debounce auto-focus calls: 100ms delay, cancel previous pending calls
- Batch viewport state updates: use single `set()` call with all properties
- Skip auto-focus if change is < 50px and zoom change is < 0.1

**FR4.5:** Memory Management
- Destroy cached shapes when nodes become invisible
- Limit maximum cached nodes to 50 (LRU eviction)
- Clear event listeners on component unmount
- Use `stage.clear()` instead of removing individual shapes during view switches

**FR4.6:** Timeline-Specific Optimizations
- Pre-calculate all event X positions on timeline load
- Cache year marker positions
- Use single `Line` shape for each track instead of multiple segments
- Render track labels on separate layer (they never change)

### FR5 - Visual Feedback

**FR5.1:** Current Year Indicator
- Highlight current year marker with larger circle (radius: 8px instead of 5px)
- Add glow effect using shadow (shadowBlur: 8, shadowColor: track color)
- Animate transition between years (scale from 1.0 to 1.3 and back, 200ms)

**FR5.2:** Navigation Hints
- Show subtle arrow hints on left/right screen edges when timeline is active
- Arrows should be semi-transparent (opacity: 0.3)
- Arrows fade in on hover (transition: 200ms)
- Show keyboard shortcut tooltip on first timeline load: "Use ← → to navigate"

**FR5.3:** Performance Indicator (Debug Mode Only)
- Show FPS counter in top-right corner when `?debug=true` query param is present
- Counter updates every 500ms
- Color coding: green (≥55 FPS), yellow (45-54 FPS), red (<45 FPS)

## 5. Non-Goals (Out of Scope)

**NG1:** Event filtering by track (future feature)

**NG2:** Timeline zoom with keyboard (use mouse wheel/zoom controls)

**NG3:** Jump to specific year via keyboard input dialog (future feature)

**NG4:** Keyboard shortcuts for other views (mindmap navigation with arrows)

**NG5:** Touch gesture optimization (focus on keyboard + mouse for now)

**NG6:** Vertical timeline layout (current horizontal layout only)

**NG7:** Event search/highlighting (future feature)

**NG8:** Performance optimization for mobile devices (desktop Chrome only)

## 6. Design Considerations

### Visual Design

**Current Year Highlight:**
```
Normal year: ○ (5px radius, blue fill)
Current year: ⦿ (8px radius, blue fill, 8px shadow blur)
```

**Label Collision Resolution:**
```
Before:                After:
Event A ●──── Label A  Event A ●─╮
Event B ●──── Label B          │ Label A (moved up 25px)
                       Event B ●─┴─ Label B (stays)
```

**Navigation Arrows:**
- Position: 40px from left/right edge, vertically centered
- Size: 48×48px
- Icon: Material Icons `arrow_back` / `arrow_forward`
- Background: white with 50% opacity, blur backdrop
- Border radius: 24px

### Interaction Design

**Keyboard Focus States:**
1. Default: Timeline responsive to arrow keys
2. Modal Open: Arrow keys disabled, focus trapped in modal
3. Input Focused: Arrow keys type in input, navigation disabled

**Animation Easing:**
- Navigation: `easeOutCubic` (smooth deceleration)
- Zoom: `easeInOutQuad` (balanced acceleration/deceleration)
- Panel transitions: `easeOut` (quick start, slow end)

## 7. Technical Considerations

### Dependencies

**Existing:**
- Konva 9.3.18 (canvas rendering)
- Zustand (state management)
- React 18.3.1

**New:**
- No new dependencies required

### Architecture

**New Files:**
```
src/
  hooks/
    useKeyboardNavigation.ts      # Arrow key handler
    useEscapeKey.ts                # ESC key handler
    usePerformanceMonitor.ts       # FPS tracking
  utils/
    timeline/
      yearNavigation.ts            # Calculate year positions
      collisionDetection.ts        # Label collision algorithm
    performance/
      canvasOptimizer.ts           # Konva optimization utilities
      animationThrottle.ts         # Frame rate limiting
```

**Modified Files:**
```
src/components/Timeline/TimelineCanvas.tsx    # Add keyboard navigation
src/components/Canvas/Canvas.tsx              # Add ESC handler
src/components/Canvas/TimelineComponent.tsx   # Collision detection
src/stores/viewportStore.ts                   # Add animation queue
```

### Performance Targets

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Animation FPS | ~30-40 | ≥55 | Chrome DevTools Performance tab |
| Frame time | ~25-35ms | ≤18ms | `requestAnimationFrame` delta |
| Zoom latency | ~150ms | ≤50ms | Time from wheel event to visual update |
| Node expansion | ~300ms | ≤200ms | Time from click to full expansion |
| Memory usage | Unknown | <100MB | Chrome Task Manager |

### Konva Performance Best Practices

**DO:**
- Use `batchDraw()` for multiple updates
- Cache complex shapes with `node.cache()`
- Set `listening: false` for non-interactive elements
- Use `transformsEnabled: 'position'` when only moving
- Destroy unused nodes with `node.destroy()`

**DON'T:**
- Don't call `draw()` inside loops
- Don't animate individual properties separately
- Don't use shadows during animations
- Don't create new shapes on every render
- Don't forget to clear caches when updating

### State Management

**New Zustand Store Slices:**

```typescript
// viewportStore.ts additions
interface ViewportState {
  // ... existing properties ...

  // Animation queue
  animationQueue: Animation[];
  currentAnimation: Animation | null;

  // Performance
  lastFrameTime: number;
  frameDeltas: number[];

  // New methods
  queueAnimation: (animation: Animation) => void;
  cancelAnimations: () => void;
  navigateToYear: (year: number) => void;
  measurePerformance: () => { fps: number; avgFrameTime: number };
}
```

### Testing Considerations

**Manual Testing:**
1. Load IA Responsable project in timeline view
2. Press LEFT/RIGHT arrows repeatedly
3. Verify smooth 60 FPS transitions
4. Check year wrapping (2012 ↔ 2026)
5. Open edit modal, verify arrows disabled
6. Close modal with ESC
7. Verify event labels don't overlap
8. Monitor FPS counter with `?debug=true`

**Performance Testing:**
1. Record 10-second interaction with Chrome DevTools
2. Verify no frames >18ms
3. Check no memory leaks (heap size stable)
4. Verify no forced layout recalculations

**Edge Cases:**
1. Timeline with 1 year (2012-2012) → arrows should do nothing
2. Timeline with 100+ events → collision detection < 10ms
3. Rapid arrow key presses → animations queue properly
4. Zoom during arrow navigation → animations blend smoothly

## 8. Success Metrics

**SM1 - Performance:**
- 95% of animation frames are ≤18ms (target: 60 FPS)
- Zero frames >33ms (no visible stuttering)
- Measured via Chrome DevTools Performance profiling (10-second recording)

**SM2 - Usability:**
- Users can navigate full timeline (2012→2026) in <5 seconds using arrows
- ESC key closes panels with <50ms latency
- Zero user reports of overlapping text

**SM3 - Code Quality:**
- All new functions have TypeScript types
- Performance utilities are reusable across components
- Animation queue prevents race conditions (0 visual glitches)

**SM4 - User Satisfaction:**
- Subjective feel: animations are "smooth" and "fluid"
- No reports of "choppy" or "laggy" experience
- Timeline navigation feels "natural" with keyboard

## 9. Open Questions

**Q1:** Should we show a visual indicator of which year is "current" when navigating?
- **Proposed:** Yes, use larger circle + glow effect (see FR5.1)

**Q2:** Should arrow navigation work in mindmap view too?
- **Decision:** No (out of scope for this PRD). Mindmap uses arrows for different purpose (node selection). Future PRD.

**Q3:** What happens if user holds down arrow key (auto-repeat)?
- **Proposed:** Throttle to max 3 navigations per second (333ms between jumps)

**Q4:** Should we limit collision detection iterations to prevent infinite loops?
- **Proposed:** Yes, max 10 position adjustments per label, then render anyway (see FR3.2)

**Q5:** How do we handle timeline events that have no date (malformed data)?
- **Proposed:** Filter out during render, log warning to console

**Q6:** Should performance optimizations apply to mindmap view too?
- **Decision:** YES, most optimizations (FR4.1-FR4.5) should apply globally, not just timeline

**Q7:** What if browser doesn't support `requestAnimationFrame`?
- **Decision:** Fall back to `setTimeout(fn, 16)` (acceptable for modern Chrome)

## 10. Implementation Notes

### Phase 1: Keyboard Navigation (Day 1-2)
- Create `useKeyboardNavigation` hook
- Implement year calculation logic
- Wire up arrow key handlers in TimelineCanvas

### Phase 2: ESC Handler (Day 1)
- Create `useEscapeKey` hook
- Wire up to all modal/panel components

### Phase 3: Text Collision (Day 2-3)
- Implement collision detection algorithm
- Add connecting lines for offset labels
- Test with IA Responsable timeline (22 events)

### Phase 4: Performance Optimization (Day 3-5)
- Implement canvas optimizations (FR4.1)
- Add animation queue system (FR4.2)
- Implement viewport culling (FR4.3)
- Add performance monitoring (FR4.5)

### Phase 5: Testing & Polish (Day 1-2)
- Chrome DevTools performance profiling
- Fix any remaining frame drops
- Add navigation hints (FR5.2)
- Documentation

**Total Estimated Time:** 8-10 days for junior developer

## 11. Acceptance Criteria

**AC1:** User can press LEFT arrow to move to previous year in timeline view
- Year 2016 visible → press LEFT → year 2015 centered
- Animation duration: 400ms ± 50ms
- Zoom adjusts if needed to show all 2015 events

**AC2:** User can press RIGHT arrow to move to next year in timeline view
- Year 2016 visible → press RIGHT → year 2017 centered
- Animation duration: 400ms ± 50ms
- Year wraps to 2012 when at 2026

**AC3:** User can press ESC to close any open panel/modal
- Info panel open → ESC → panel closes
- Edit modal open → ESC → modal closes
- Timeline event panel open → ESC → panel closes

**AC4:** Event labels never overlap in timeline view
- Load IA Responsable timeline
- Zoom to various levels (0.25x to 4x)
- Verify all 22 event labels are readable
- No overlapping text at any zoom level

**AC5:** Animations run at 60 FPS (or very close)
- Record 10s Chrome DevTools performance profile
- 95% of frames are ≤18ms
- 0 frames are >33ms
- Average FPS: ≥55

**AC6:** Arrow keys disabled when modal open
- Open edit modal → press LEFT/RIGHT → nothing happens
- Close modal → press LEFT/RIGHT → navigation works

**AC7:** Performance improvements apply to mindmap view
- Load large mindmap (50+ nodes)
- Expand/collapse nodes → smooth animations
- Pan/zoom → no stuttering
- FPS ≥55 during all interactions

---

## Appendix A: Konva Animation Example

```typescript
// GOOD: Efficient animation
const tween = new Konva.Tween({
  node: stage,
  duration: 0.4,
  x: targetX,
  y: targetY,
  scaleX: targetZoom,
  scaleY: targetZoom,
  easing: Konva.Easings.EaseInOut,
  onFinish: () => {
    setPosition(targetX, targetY);
    setZoom(targetZoom);
  }
});
tween.play();

// BAD: Multiple separate updates
stage.to({ x: targetX, duration: 0.4 });
stage.to({ y: targetY, duration: 0.4 });
stage.to({ scaleX: targetZoom, duration: 0.4 });
```

## Appendix B: Collision Detection Pseudocode

```typescript
function calculateLabelPositions(events: Event[], tracks: Track[]): Map<string, Position> {
  const positions = new Map();
  const MIN_SPACING = 25; // px
  const LABEL_HEIGHT = 20; // px

  // Group by track
  const byTrack = groupByTrack(events);

  for (const trackEvents of byTrack) {
    const used: BoundingBox[] = [];

    for (const event of trackEvents) {
      const baseY = getTrackCenterY(event.track);
      let labelY = baseY;
      let attempt = 0;

      while (attempt < 10) {
        const box = {
          x: event.x,
          y: labelY,
          width: event.title.length * 7,
          height: LABEL_HEIGHT
        };

        if (!hasCollision(box, used)) {
          used.push(box);
          positions.set(event.id, { x: event.x, y: labelY });
          break;
        }

        // Alternate up/down
        labelY = attempt % 2 === 0
          ? baseY - ((attempt / 2 + 1) * MIN_SPACING)
          : baseY + ((attempt / 2 + 1) * MIN_SPACING);

        attempt++;
      }
    }
  }

  return positions;
}
```

## Appendix C: Performance Monitoring

```typescript
// FPS Counter component (debug mode only)
function FPSCounter() {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();

    const measure = () => {
      frames++;
      const now = performance.now();

      if (now >= lastTime + 500) {
        const currentFps = Math.round((frames * 1000) / (now - lastTime));
        setFps(currentFps);
        frames = 0;
        lastTime = now;
      }

      requestAnimationFrame(measure);
    };

    measure();
  }, []);

  const color = fps >= 55 ? 'green' : fps >= 45 ? 'yellow' : 'red';

  return <div style={{ color }}>{fps} FPS</div>;
}
```
