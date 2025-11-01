# Task List: Timeline Keyboard Navigation & Performance Optimization

Based on PRD: `0001-prd-timeline-keyboard-navigation-performance.md`

## Relevant Files

### New Files to Create
- `src/hooks/useKeyboardNavigation.ts` - Custom hook for timeline arrow key navigation
- `src/hooks/useKeyboardNavigation.test.ts` - Unit tests for keyboard navigation hook
- `src/hooks/useEscapeKey.ts` - Custom hook for ESC key handler across all modals/panels
- `src/hooks/useEscapeKey.test.ts` - Unit tests for ESC key hook
- `src/hooks/usePerformanceMonitor.ts` - FPS tracking and performance metrics
- `src/utils/timeline/yearNavigation.ts` - Year position calculation and navigation logic
- `src/utils/timeline/yearNavigation.test.ts` - Unit tests for year navigation utilities
- `src/utils/timeline/collisionDetection.ts` - Label collision detection algorithm
- `src/utils/timeline/collisionDetection.test.ts` - Unit tests for collision detection
- `src/utils/performance/canvasOptimizer.ts` - Konva optimization utilities (batchDraw, caching, etc.)
- `src/utils/performance/animationThrottle.ts` - Frame rate limiting and animation queue
- `src/components/Canvas/FPSCounter.tsx` - Debug FPS counter component (shows when ?debug=true)
- `src/components/Timeline/NavigationArrows.tsx` - Visual arrow hints for keyboard navigation

### Existing Files to Modify
- `src/components/Timeline/TimelineCanvas.tsx` - Add keyboard navigation integration
- `src/components/Canvas/Canvas.tsx` - Add ESC key handler and performance optimizations
- `src/components/Canvas/TimelineComponent.tsx` - Integrate collision detection for event labels
- `src/stores/viewportStore.ts` - Add animation queue, performance tracking methods
- `src/stores/uiStore.ts` - Add helper methods for ESC key priority handling
- `src/types/project.ts` - Add animation types (AnimationQueue, Performance metrics)

### Notes

- Unit tests should be placed alongside code files (same directory)
- Run tests: `npm test` or `npm test -- path/to/test/file.test.ts`
- Performance tests should use Chrome DevTools Performance tab for profiling
- All animations must target 60 FPS (≤18ms per frame)
- Use `?debug=true` query parameter to show FPS counter during development

## Tasks

- [x] 1.0 Setup Project Architecture & Utilities
  - [x] 1.1 Create directory structure for new utilities: `src/hooks/`, `src/utils/timeline/`, `src/utils/performance/`
  - [x] 1.2 Add animation types to `src/types/project.ts`: `Animation`, `AnimationQueue`, `PerformanceMetrics`
  - [x] 1.3 Install any missing dev dependencies if needed (verify Konva, Zustand versions)
  - [x] 1.4 Create placeholder test files with basic structure (empty describe blocks)
  - [x] 1.5 Verify test runner works: `npm test` should run without errors

- [ ] 2.0 Implement Timeline Year Navigation Utilities
  - [ ] 2.1 Create `src/utils/timeline/yearNavigation.ts` with function signatures:
    - `calculateYearPositions(startYear: number, endYear: number, spacing: number): Map<number, number>`
    - `findNearestYear(currentX: number, yearPositions: Map<number, number>): number`
    - `findNextYear(currentYear: number, yearPositions: Map<number, number>): number`
    - `findPreviousYear(currentYear: number, yearPositions: Map<number, number>): number`
    - `calculateOptimalZoomForYear(year: number, events: TimelineEvent[], viewportWidth: number): number`
  - [ ] 2.2 Implement `calculateYearPositions` - return Map of year → X position using EVENT_SPACING constant (150px)
  - [ ] 2.3 Implement `findNearestYear` - find closest year marker to given X coordinate
  - [ ] 2.4 Implement `findNextYear` with wrap-around (2026 → 2012)
  - [ ] 2.5 Implement `findPreviousYear` with wrap-around (2012 → 2026)
  - [ ] 2.6 Implement `calculateOptimalZoomForYear` - ensure all events in that year are visible
  - [ ] 2.7 Write unit tests in `yearNavigation.test.ts` - test all edge cases (first/last year, wrap-around)
  - [ ] 2.8 Run tests and verify 100% coverage: `npm test yearNavigation.test.ts`

- [ ] 3.0 Implement Keyboard Navigation Hook
  - [ ] 3.1 Create `src/hooks/useKeyboardNavigation.ts` with interface:
    - Input: `enabled: boolean`, `currentView: ViewType`, `timelineConfig: TimelineConfig | undefined`
    - Output: `{ currentYear: number | null, navigateToYear: (year: number) => void }`
  - [ ] 3.2 Add `useEffect` to listen for ArrowLeft/ArrowRight keydown events
  - [ ] 3.3 Implement logic to disable navigation when modals are open (check `document.activeElement`)
  - [ ] 3.4 Integrate `yearNavigation` utilities to calculate next/previous year
  - [ ] 3.5 Call `viewportStore.navigateToYear(year)` when arrow pressed (implement this method in task 3.7)
  - [ ] 3.6 Add keyboard event cleanup in `useEffect` return function
  - [ ] 3.7 Add `navigateToYear` method to `viewportStore.ts`:
    - Calculate target X/Y position for year center
    - Calculate optimal zoom using `calculateOptimalZoomForYear`
    - Queue animation with 400ms duration, easeOutCubic easing
  - [ ] 3.8 Write unit tests in `useKeyboardNavigation.test.ts` - mock viewport store, test arrow keys
  - [ ] 3.9 Integrate hook into `TimelineCanvas.tsx`: call `useKeyboardNavigation` at component top
  - [ ] 3.10 Test manually: load timeline, press LEFT/RIGHT, verify smooth navigation

- [ ] 4.0 Implement ESC Key Handler
  - [ ] 4.1 Create `src/hooks/useEscapeKey.ts` with callback interface:
    - Input: `onEscape: () => void`, `enabled: boolean`
    - Registers Escape keydown listener when enabled
  - [ ] 4.2 Implement keydown listener that calls `onEscape` callback
  - [ ] 4.3 Add logic to prevent triggering when input fields are focused
  - [ ] 4.4 Add cleanup in `useEffect` return to remove listener
  - [ ] 4.5 Write unit tests in `useEscapeKey.test.ts` - verify callback called on ESC, not called when disabled
  - [ ] 4.6 Add helper method to `uiStore.ts`: `closeTopPanel()` - closes panels in priority order:
    - If `editModalOpen` (tracked locally in Canvas) → close edit modal
    - Else if `fullscreenImageUrl` → call `closeFullscreenImage()`
    - Else if `infoPanelNodeId` → call `toggleInfoPanel(null)`
    - Else if `selectedTimelineEvent` → call `selectTimelineEvent(null)`
    - Else if `sidebarOpen` → call `setSidebarOpen(false)`
  - [ ] 4.7 Integrate `useEscapeKey` in `Canvas.tsx`:
    - Call hook with `onEscape: () => { closeTopPanel(); setEditModalOpen(false); }`
    - Enable only when at least one panel is open
  - [ ] 4.8 Test manually: open each panel/modal, press ESC, verify it closes

- [ ] 5.0 Implement Text Collision Detection (Timeline)
  - [ ] 5.1 Create `src/utils/timeline/collisionDetection.ts` with main function:
    - `calculateLabelPositions(events: TimelineEvent[], tracks: Track[], getEventX: (date: string) => number, getEventY: (trackId: string) => number): Map<string, LabelPosition>`
    - `LabelPosition` type: `{ x: number; y: number; needsConnector: boolean }`
  - [ ] 5.2 Implement collision detection algorithm:
    - Group events by track
    - Sort events chronologically within each track
    - For each event, calculate bounding box: `{ x, y, width: title.length * 7, height: 20 }`
    - Check for overlaps with previously placed labels using `hasCollision(box1, box2)`
    - If collision, adjust Y position alternating up/down with 25px increments
    - Mark `needsConnector: true` if label moved more than 5px from base position
    - Max 10 adjustment attempts per label
  - [ ] 5.3 Implement helper function `hasCollision(box1: BoundingBox, box2: BoundingBox): boolean`
  - [ ] 5.4 Write unit tests in `collisionDetection.test.ts`:
    - Test with 0 events (empty Map)
    - Test with 2 overlapping events (should adjust one)
    - Test with 10 events close together (verify all adjusted correctly)
    - Performance test: 100 events should complete in <10ms
  - [ ] 5.5 Integrate into `TimelineComponent.tsx`:
    - Call `calculateLabelPositions` once in component body (not in render loop)
    - Use `useMemo` to cache results, dependencies: `[events, tracks, zoom]`
    - Update label rendering to use positions from Map
    - Render connecting lines when `needsConnector === true` (Line from circle to label)
  - [ ] 5.6 Test manually with IA Responsable timeline:
    - Verify no overlapping labels at zoom 1x
    - Zoom to 0.5x and 2x, verify labels still don't overlap
    - Check that connector lines appear for adjusted labels

- [ ] 6.0 Performance Optimization - Canvas Rendering
  - [ ] 6.1 Create `src/utils/performance/canvasOptimizer.ts` with utilities:
    - `enableBatchDrawing(layer: Konva.Layer): void` - replaces `draw()` calls with `batchDraw()`
    - `setupViewportCulling(stage: Konva.Stage, nodes: Node[]): Node[]` - returns only visible nodes
    - `cacheComplexNode(nodeShape: Konva.Group): void` - applies Konva cache() to node
    - `clearNodeCache(nodeShape: Konva.Group): void` - clears cache when node edited
    - `disableShadowsDuringAnimation(layer: Konva.Layer): void` - removes shadows temporarily
    - `enableShadowsAfterAnimation(layer: Konva.Layer): void` - restores shadows
  - [ ] 6.2 Implement `setupViewportCulling`:
    - Calculate visible bounds: `{ minX, maxX, minY, maxY }` from viewport position + 500px buffer
    - Filter nodes: only include if `node.x` and `node.y` are within bounds
    - Return filtered array
  - [ ] 6.3 Implement node caching logic:
    - Cache only if node has >5 child elements
    - Set cache size: `node.cache({ pixelRatio: 1 })` for performance
    - Store cached node IDs in a Set to track
  - [ ] 6.4 Integrate into `Canvas.tsx`:
    - Add `useRef` to track cached node IDs
    - In render loop, call `setupViewportCulling` to filter nodes before rendering
    - Apply caching to complex nodes (check child count)
    - Clear cache when node is edited (listen to projectStore updates)
  - [ ] 6.5 Integrate into `TimelineCanvas.tsx`:
    - Replace any `layer.draw()` calls with `layer.batchDraw()`
    - Call `disableShadowsDuringAnimation` before starting navigation animation
    - Call `enableShadowsAfterAnimation` in animation `onFinish` callback
  - [ ] 6.6 Test performance with Chrome DevTools:
    - Record 5-second interaction (zoom, pan, expand nodes)
    - Verify no frames >18ms in Performance tab
    - Check "Rendering" metrics - should show reduced paint operations

- [ ] 7.0 Performance Optimization - Animations & Memory
  - [ ] 7.1 Create `src/utils/performance/animationThrottle.ts` with:
    - `AnimationQueue` class with methods: `add(animation)`, `cancel()`, `getCurrentAnimation()`
    - `createThrottledAnimator(maxFPS: number)` - returns function that throttles animation updates
    - `debounceAutoFocus(callback: Function, delay: number)` - debounces auto-focus calls
  - [ ] 7.2 Implement `AnimationQueue`:
    - Store animations in array with priority
    - When adding new animation, cancel currently running one if exists
    - Use `Konva.Tween` for all animations
    - Return Promise that resolves when animation completes
  - [ ] 7.3 Add animation queue to `viewportStore.ts`:
    - New state: `animationQueue: AnimationQueue`
    - Initialize in store creation: `animationQueue: new AnimationQueue()`
    - Update `navigateToYear`, `focusOnNodes`, `focusOnNodeWithPanel` to use queue:
      ```typescript
      const animation = animationQueue.add({
        stage,
        target: { x, y, scaleX: zoom, scaleY: zoom },
        duration: 0.4,
        easing: Konva.Easings.EaseOut
      });
      await animation;
      set({ x, y, zoom });
      ```
  - [ ] 7.4 Implement debounced auto-focus:
    - Wrap `focusOnNodes` calls in debounce with 100ms delay
    - Cancel pending calls when new call arrives
    - Apply in `Canvas.tsx` auto-focus `useEffect`
  - [ ] 7.5 Add memory management to `Canvas.tsx`:
    - Track cached node count with `useRef`
    - When count exceeds 50, implement LRU eviction:
      - Keep Set of recently used node IDs
      - Remove oldest cached nodes using `clearNodeCache`
    - Clear all caches on component unmount
  - [ ] 7.6 Add cleanup in `TimelineCanvas.tsx`:
    - Cancel all animations on unmount
    - Clear event listeners
    - Call `stage.clear()` instead of removing individual shapes
  - [ ] 7.7 Test memory stability:
    - Open Chrome Task Manager
    - Interact with app for 2 minutes (zoom, pan, expand nodes)
    - Memory should stay <100MB and not grow continuously
    - Check for memory leaks: take heap snapshot before/after, compare

- [ ] 8.0 Visual Feedback & Polish
  - [ ] 8.1 Create `src/components/Timeline/NavigationArrows.tsx`:
    - Render left/right arrow buttons at screen edges (40px from edge)
    - Style: 48×48px, white background, 50% opacity, border-radius 24px
    - Use Material Icons: `arrow_back` and `arrow_forward`
    - Show only when timeline view active
    - Add hover effect: increase opacity to 80%, transition 200ms
    - Click handlers: call `navigateToYear` with previous/next year
  - [ ] 8.2 Add current year highlight to `TimelineCanvas.tsx`:
    - Track current year in component state: `const [currentYear, setCurrentYear] = useState<number | null>(null)`
    - Calculate current year from viewport center X position
    - Render year markers with conditional styling:
      - Normal: radius 5px, blue fill
      - Current: radius 8px, blue fill, shadowBlur 8, shadowColor blue
    - Add scale animation when year changes: `Konva.Tween` from scale 1.0 to 1.3 and back (200ms)
  - [ ] 8.3 Create `src/components/Canvas/FPSCounter.tsx`:
    - Check for `?debug=true` query parameter in URL
    - Only render if debug enabled
    - Use `usePerformanceMonitor` hook to get FPS
    - Display in top-right corner: fixed position, 100×40px
    - Color coding: green (≥55 FPS), yellow (45-54 FPS), red (<45 FPS)
    - Update every 500ms
  - [ ] 8.4 Create `src/hooks/usePerformanceMonitor.ts`:
    - Track frame deltas using `requestAnimationFrame`
    - Calculate FPS: `frames / (elapsed time in seconds)`
    - Calculate average frame time from last 60 frames
    - Return: `{ fps: number, avgFrameTime: number }`
  - [ ] 8.5 Integrate FPSCounter into `Canvas.tsx`:
    - Import and render at top level: `<FPSCounter />`
    - Should appear in top-right corner when `?debug=true` in URL
  - [ ] 8.6 Add keyboard shortcut tooltip to `TimelineCanvas.tsx`:
    - Check localStorage for `timeline-nav-hint-shown` flag
    - If not shown, display tooltip: "Use ← → to navigate years"
    - Position: bottom-center of screen, 300×60px
    - Auto-dismiss after 3 seconds
    - Set localStorage flag after dismissal
    - Style: white background, drop shadow, rounded corners
  - [ ] 8.7 Test all visual feedback:
    - Load timeline, verify navigation arrows appear
    - Hover over arrows, verify opacity change
    - Navigate with arrows, verify current year highlights
    - Add `?debug=true` to URL, verify FPS counter appears
    - First timeline load should show tooltip

- [ ] 9.0 Integration Testing & Performance Validation
  - [ ] 9.1 Manual test keyboard navigation:
    - Load IA Responsable timeline
    - Press LEFT repeatedly from 2020 → 2012
    - Verify smooth animations, no stuttering
    - Press LEFT at 2012 → should wrap to 2026
    - Press RIGHT repeatedly from 2012 → 2026
    - Press RIGHT at 2026 → should wrap to 2012
  - [ ] 9.2 Manual test ESC key:
    - Open edit modal → press ESC → verify closes
    - Open image viewer → press ESC → verify closes
    - Open node info panel → press ESC → verify closes
    - Open timeline event panel → press ESC → verify closes
    - Test in both mindmap and timeline views
  - [ ] 9.3 Manual test collision detection:
    - Load IA Responsable timeline (22 events)
    - Zoom to 0.25x, 0.5x, 1x, 2x, 4x
    - Verify no overlapping labels at any zoom level
    - Check that connector lines appear for adjusted labels
    - Verify labels are readable (not cut off)
  - [ ] 9.4 Performance profiling with Chrome DevTools:
    - Open DevTools Performance tab
    - Start recording
    - Perform test sequence:
      1. Zoom in/out 5 times
      2. Pan canvas around
      3. Navigate timeline years with arrows (5 jumps)
      4. Expand/collapse 5 nodes in mindmap
    - Stop recording (total: ~30 seconds)
  - [ ] 9.5 Analyze performance recording:
    - Check "Main" thread timeline: verify no long tasks (yellow/red blocks)
    - Verify 95% of frames are ≤18ms (green blocks)
    - Verify 0 frames are >33ms (no red blocks)
    - Check "Summary" tab: "Scripting" time should be <30% of total
    - Check "Bottom-Up" tab: no single function >50ms
  - [ ] 9.6 Memory leak check:
    - Open Chrome Task Manager (Shift+Esc)
    - Note initial memory: ~XX MB
    - Interact for 2 minutes (zoom, pan, navigate, expand nodes)
    - Note final memory: should be <100MB and not growing
    - Take heap snapshot in DevTools Memory tab
    - Look for "Detached DOM nodes" - should be 0 or very low (<10)
  - [ ] 9.7 Cross-browser verification (if time permits):
    - Test on Safari (Mac): verify animations work
    - Test on Firefox (optional): verify animations work
    - Note: Chrome is primary target per PRD
  - [ ] 9.8 Edge case testing:
    - Timeline with 1 year (create test project): arrows should do nothing gracefully
    - Timeline with 100 events (stress test): collision detection should complete in <10ms
    - Rapid arrow key presses (hold down): should queue animations smoothly, no visual glitches
    - Zoom during arrow navigation: animations should blend smoothly (no jumps)
  - [ ] 9.9 Document findings:
    - Create `/tasks/performance-report.md` with:
      - FPS measurements (min, max, avg)
      - Frame time distribution (% of frames in each range)
      - Memory usage (before, after, peak)
      - Any issues found and how resolved
      - Screenshots of Chrome DevTools Performance tab
  - [ ] 9.10 Fix any remaining performance issues:
    - If any frames >18ms found, profile specific operation
    - Add targeted optimizations (more caching, simplify rendering)
    - Re-test until 95% of frames ≤18ms achieved

- [ ] 10.0 Final Polish & Deployment
  - [ ] 10.1 Code review checklist:
    - All functions have TypeScript types (no `any` types)
    - All new utilities have unit tests with >80% coverage
    - ESLint passes: `npm run lint` (fix any warnings)
    - No console.log statements in production code (use debug flag)
  - [ ] 10.2 Update documentation:
    - Add keyboard shortcuts to README: "← → navigate timeline years, ESC close panels"
    - Document new hooks in code comments (JSDoc format)
    - Add performance best practices to developer docs
  - [ ] 10.3 Build and test production bundle:
    - Run `npm run build`
    - Verify no build errors or warnings
    - Check bundle size: should not increase >50KB from optimizations
    - Test production build locally: `npm run preview`
  - [ ] 10.4 Deploy to Firebase:
    - Run `firebase deploy --only hosting`
    - Test deployed version at production URL
    - Verify all features work (keyboard nav, ESC, collision detection)
    - Check performance with Lighthouse: should score >90 for Performance
  - [ ] 10.5 Create commit:
    - Stage all changes: `git add .`
    - Commit with descriptive message:
      ```
      feat: timeline keyboard navigation and 60 FPS performance optimization

      - Add LEFT/RIGHT arrow navigation for timeline years
      - Implement ESC key to close any open panel/modal
      - Add text collision detection to prevent label overlap
      - Optimize canvas rendering for 60 FPS animations
      - Add animation queue to prevent race conditions
      - Implement viewport culling and node caching
      - Add FPS counter for debugging (/?debug=true)
      - Add visual feedback (current year highlight, nav arrows)

      Performance improvements:
      - 95% of frames now ≤18ms (target 60 FPS achieved)
      - Memory usage stable at <100MB
      - Smooth animations for zoom, pan, expand/collapse

      🤖 Generated with [Claude Code](https://claude.com/claude-code)
      Co-Authored-By: Claude <noreply@anthropic.com>
      ```
  - [ ] 10.6 Push to GitHub:
    - Verify remote: `git remote -v`
    - Push: `git push origin developer`
  - [ ] 10.7 Final manual verification:
    - Load production URL in clean browser (incognito)
    - Test keyboard navigation: ← → arrows
    - Test ESC key on all panels
    - Verify smooth 60 FPS feel
    - Check FPS counter with `?debug=true`
    - Confirm no overlapping text in timeline

## Implementation Notes

### Testing Strategy

**Unit Tests:**
- Run after each major task completion
- Command: `npm test [file-path]`
- Target: >80% coverage for all new utilities

**Performance Tests:**
- Use Chrome DevTools Performance tab
- Record 10-30 second interactions
- Focus on "Main" thread timeline and frame rate

**Manual Tests:**
- Test keyboard navigation in both Chrome and Safari
- Verify ESC works across all modals/panels
- Check collision detection at multiple zoom levels

### Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Animation FPS | ≥55 | Chrome DevTools Performance tab |
| Frame Time | ≤18ms (95% of frames) | Performance recording, "Summary" view |
| Memory Usage | <100MB stable | Chrome Task Manager |
| Collision Detection | <10ms for 100 events | `console.time()` in dev mode |
| Bundle Size | +50KB max | `npm run build`, check dist/ size |

### Common Issues & Solutions

**Issue: Animations still choppy after optimizations**
- Solution: Check "Rendering" tab in DevTools, look for excessive paint operations
- Try: Reduce shadow count, simplify shapes, increase cache usage

**Issue: Memory growing over time**
- Solution: Check for event listener leaks (not removing on unmount)
- Try: Add cleanup in useEffect returns, clear Konva caches

**Issue: Text still overlaps at certain zoom levels**
- Solution: Collision detection bounding boxes may be inaccurate
- Try: Add debug mode to visualize bounding boxes, adjust MIN_SPACING

**Issue: Keyboard navigation not working**
- Solution: Check if event listener is properly attached
- Try: Verify enabled flag, check document.activeElement for input focus

### Debugging Tips

**Enable Debug Mode:**
Add `?debug=true` to URL to show:
- FPS counter in top-right
- Performance metrics in console
- Animation queue status

**Chrome DevTools Shortcuts:**
- `Cmd+Shift+P` → "Show Rendering" → Enable "Paint flashing"
- `Cmd+Shift+P` → "Show Performance Monitor" → Real-time FPS
- Performance tab → Record → Look for long tasks (yellow/red bars)

**Konva Debugging:**
```typescript
// Log current layer state
console.log(layer.getChildren().length); // How many shapes

// Check cache status
node.cache(); // Apply cache
node.isCached(); // Returns true/false

// Monitor draw calls
layer.draw = () => {
  console.log('Drawing layer');
  Konva.Layer.prototype.draw.call(layer);
};
```

### Estimated Timeline

- **Day 1:** Tasks 1.0 - 2.0 (Setup + Year Navigation) → ~4 hours
- **Day 2:** Tasks 3.0 - 4.0 (Keyboard Hook + ESC Handler) → ~5 hours
- **Day 3:** Task 5.0 (Collision Detection) → ~6 hours
- **Day 4:** Task 6.0 (Canvas Optimization) → ~6 hours
- **Day 5:** Task 7.0 (Animation & Memory) → ~6 hours
- **Day 6:** Task 8.0 (Visual Feedback) → ~4 hours
- **Day 7:** Task 9.0 (Testing & Validation) → ~6 hours
- **Day 8:** Task 10.0 (Final Polish & Deploy) → ~3 hours

**Total: ~40 hours (5 days for senior, 8-10 days for junior developer)**

---

## Acceptance Criteria Summary

✅ User can press LEFT/RIGHT arrows to navigate timeline years
✅ Year navigation wraps around (2012 ↔ 2026)
✅ ESC key closes any open panel/modal
✅ Event labels never overlap at any zoom level
✅ Animations run at ≥55 FPS (95% of frames ≤18ms)
✅ Memory usage stays <100MB and stable
✅ FPS counter shows when `?debug=true` in URL
✅ Current year highlighted with glow effect
✅ Navigation arrows visible on timeline view
✅ All existing features continue to work correctly
