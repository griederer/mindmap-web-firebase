# 🚧 CURRENT VERSION STATE - UNSTABLE DEVELOPMENT BRANCH

⚠️ **WARNING: This branch (`developer`) is in active development and NOT STABLE for production use.**

---

## 📍 Project Location & Access

**Repository**: https://github.com/griederer/mindmap-web-firebase
**Branch**: `developer`
**Local Path**: `/Users/gonzaloriederer/nodem-clean`
**Dev Server**: http://localhost:5173/

### Starting the Development Server

```bash
cd ~/nodem-clean
npm run dev
```

The application will be available at: **http://localhost:5173/**

---

## 🎯 What This Version Contains

This is a **feature-complete but unstable** implementation of Timeline Navigation & Performance Optimization features.

### ✅ Recently Completed Features (Nov 2, 2025)

#### 1. **Timeline Keyboard Navigation (← → Arrow Keys)**
   - Navigate year-by-year through timeline
   - Smooth 4-second camera animations with easing
   - Auto-zoom to optimal level per year
   - Animation conflict prevention

#### 2. **Performance Optimization System**
   - **Viewport Culling**: Only renders visible nodes/events (500px buffer)
   - **Animation Throttling**: FPS-based throttling (60 FPS guarantee)
   - **Animation Queue**: Priority-based animation system
   - **Memory Management**: Proper cleanup on component unmount
   - **Debouncing Utilities**: Prevents excessive updates

#### 3. **Visual Feedback & Polish**
   - Animation progress indicator (blue "Animating..." badge)
   - Smooth transitions with visual cues
   - Professional UI polish

#### 4. **ESC Key Handler**
   - Priority-based panel/modal closing
   - Intelligent nested UI element handling

#### 5. **Text Collision Detection**
   - Prevents overlapping timeline labels
   - Smart vertical offset calculation

---

## 🧪 Test Coverage

**Status**: 223 Tests Passing
**Test Files**: 18
**Duration**: ~9 seconds average

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

### Test Breakdown
- ✅ Timeline navigation utilities (27 tests)
- ✅ Keyboard navigation (14 tests)
- ✅ ESC key handling (16 tests)
- ✅ Canvas optimization (18 tests)
- ✅ Animation throttle (16 tests)
- ✅ Animation indicator (6 tests)
- ✅ Integration tests (126+ tests)

---

## 📂 Key Files & Locations

### Core Timeline Features
- `src/utils/timeline/yearNavigation.ts` - Year navigation utilities
- `src/hooks/useKeyboardNavigation.ts` - Arrow key handlers
- `src/hooks/useEscapeKey.ts` - ESC key priority system

### Performance Optimization
- `src/utils/performance/canvasOptimizer.ts` - Viewport culling
- `src/utils/performance/animationThrottle.ts` - FPS throttling & queue
- `src/stores/viewportStore.ts` - Animation state management

### UI Components
- `src/components/Canvas/Canvas.tsx` - Main canvas with optimizations
- `src/components/Timeline/TimelineCanvas.tsx` - Timeline rendering
- `src/components/UI/AnimationIndicator.tsx` - Visual feedback

### Tests
- `src/utils/timeline/yearNavigation.test.ts`
- `src/hooks/useKeyboardNavigation.test.tsx`
- `src/hooks/useEscapeKey.test.tsx`
- `src/utils/performance/canvasOptimizer.test.ts`
- `src/utils/performance/animationThrottle.test.ts`
- `src/components/UI/AnimationIndicator.test.tsx`

---

## ⚠️ Known Issues & Limitations

### Stability Concerns

1. **Not Production Ready**
   - New features not fully stress-tested
   - Edge cases may exist in animation system
   - Performance on large datasets not validated

2. **Animation System**
   - AnimationQueue is new - watch for conflicts
   - FPS throttling may need tuning per device
   - Memory cleanup needs long-term validation

3. **Timeline Navigation**
   - Only tested with sample "IA Responsable" project
   - Large timeline datasets (100+ years) not tested
   - Multi-year jump animations need validation

4. **Browser Compatibility**
   - Only tested on latest Chrome/macOS
   - Safari/Firefox/mobile not validated
   - Konva.js performance varies per browser

---

## 🔄 Recent Commits

```
feat: visual feedback & polish - animation progress indicator
feat: performance optimization - animations & memory management
feat: canvas optimization - viewport culling system
feat: keyboard navigation - arrow keys for timeline
feat: timeline navigation utilities
```

All commits follow [Conventional Commits](https://www.conventionalcommits.org/) format and relate to tasks in:
- `tasks/tasks-0001-prd-timeline-navigation.md`

---

## 🚀 How to Test

### 1. Start Development Server
```bash
cd ~/nodem-clean
npm run dev
```

### 2. Open Browser
Navigate to: http://localhost:5173/

### 3. Test Timeline Navigation
1. Click "Timeline" button (top-left ribbon)
2. Press **Arrow Right (→)** - Navigate to next year
3. Press **Arrow Left (←)** - Navigate to previous year
4. Watch for blue "Animating..." indicator
5. Observe smooth 4-second camera pan

### 4. Test Performance
- Scroll far from events - verify culling (DevTools Performance tab)
- Expand/collapse many nodes - verify 60 FPS maintained
- Switch between views - verify no memory leaks

### 5. Test ESC Key
- Open panels (node info, timeline event)
- Press ESC repeatedly - closes in priority order

---

## 📝 Documentation for Claude Code

**READ THIS FILE WHEN RESUMING WORK:**
`/Users/gonzaloriederer/nodem-clean/CURRENT_VERSION_STATE.md`

### Context for New Claude Code Session

When starting a new session on this project:

1. **Read this file first** to understand current state
2. **Check test status**: `npm test`
3. **Review recent commits**: `git log --oneline -10`
4. **Check task list**: `tasks/tasks-0001-prd-timeline-navigation.md`

### Current Working Branch
```bash
git branch
# Should show: * developer
```

### Key Context
- All 10 timeline tasks completed (Tasks 1.0 - 10.0)
- 223 tests passing
- New animation system in place
- Performance optimizations active

---

## 📊 Performance Metrics

**Target Performance** (as per implementation):
- **FPS**: 60 FPS constant during animations
- **Render Time**: < 16ms per frame (60 FPS threshold)
- **Viewport Culling**: 500px buffer around viewport
- **Animation Duration**: 4 seconds (smooth easing)
- **Memory**: No leaks on component unmount

**Actual Performance** (needs validation):
- ✅ 60 FPS in development (small datasets)
- ⚠️ Large datasets not tested
- ⚠️ Mobile performance not tested

---

## 🔧 Next Steps (If Continuing Development)

1. **Validate on Large Datasets**
   - Test with 100+ nodes
   - Test with 50+ year timelines
   - Stress test animation queue

2. **Browser Compatibility**
   - Test on Safari/Firefox
   - Test on mobile devices
   - Validate touch gestures

3. **Edge Case Testing**
   - Rapid arrow key presses
   - Timeline with no events
   - Very zoomed in/out states

4. **Performance Profiling**
   - Chrome DevTools Performance recording
   - Memory leak detection
   - Long-session stability test

5. **User Testing**
   - Real-world usage patterns
   - Accessibility validation
   - UI/UX feedback

---

## 🛑 CRITICAL REMINDER

**DO NOT MERGE TO MAIN UNTIL:**
- [ ] All edge cases tested
- [ ] Browser compatibility validated
- [ ] Long-session stability confirmed
- [ ] Performance profiled with large datasets
- [ ] User acceptance testing complete

This branch is for **development and testing only**.

---

## 📚 Related Documentation

- `README.md` - Project overview and setup
- `STABLE-VERSION.md` - Last known stable version
- `tasks/tasks-0001-prd-timeline-navigation.md` - Task list
- `docs/` - Additional documentation

---

## 💬 Questions or Issues?

If Claude Code is resuming work on this project:

1. **Check git status**: `git status`
2. **Check test status**: `npm test`
3. **Review this file**: You're reading it! ✅
4. **Check running processes**: `lsof -ti:5173`

**Last Updated**: November 2, 2025
**Status**: Active Development 🚧
**Test Status**: 223 Passing ✅
**Stability**: Unstable ⚠️