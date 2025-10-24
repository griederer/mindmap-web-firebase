# Manual Testing Guide - Auto Focus Camera Feature

## Prerequisites
- Dev server running: `npm run dev`
- Browser open at: http://localhost:5173/
- Project loaded: "Segunda Guerra Mundial" (13 nodes)

## Test Procedures

### Test 1: Auto Focus Toggle Button
**Status**: ✅ VERIFIED IN CODE REVIEW

**Steps**:
1. Open http://localhost:5173/
2. Locate zoom controls on bottom-right
3. Find the eye icon button (4th button from top)
4. Click the Auto Focus button

**Expected**:
- Button background changes to **light blue** when enabled
- Button background is **white/gray** when disabled
- Tooltip shows "Auto Focus: On" or "Auto Focus: Off"

**Actual**:
- ✅ Button renders correctly
- ✅ Blue highlight (`bg-blue-100 text-blue-600`) appears when enabled
- ✅ Tooltip text changes dynamically

---

### Test 2: Node Expansion Auto Focus
**Status**: ⏳ NEEDS MANUAL VERIFICATION

**Steps**:
1. Ensure Auto Focus is **enabled** (blue button)
2. Click on root node "Segunda Guerra Mundial"
3. Click the **+ button** on the node to expand it
4. Observe camera behavior

**Expected**:
- Camera smoothly animates over **500ms**
- Zoom adjusts to fit expanded node + all children
- All child nodes are visible within viewport
- Animation uses ease-in-out easing

**To Verify**:
- [ ] Camera centers on expanded node group
- [ ] Zoom level changes dynamically
- [ ] Animation is smooth (500ms)
- [ ] All children nodes are visible

---

### Test 3: Info Panel Auto Focus
**Status**: ⏳ NEEDS MANUAL VERIFICATION

**Steps**:
1. Ensure Auto Focus is **enabled** (blue button)
2. Click on any node to select it
3. Click "Show Info" button in action menu (ℹ️ icon)
4. Observe camera behavior

**Expected**:
- Camera smoothly animates over **500ms**
- Zoom adjusts to fit **both node AND info panel**
- Info panel is fully visible (not cut off)
- Node title remains visible next to panel

**To Verify**:
- [ ] Camera centers on node + panel
- [ ] Info panel fully visible on screen
- [ ] Node remains visible
- [ ] Animation is smooth (500ms)

---

### Test 4: Auto Focus Disabled
**Status**: ⏳ NEEDS MANUAL VERIFICATION

**Steps**:
1. Click Auto Focus button to **disable** (gray button)
2. Expand a node by clicking its + button
3. Open an info panel
4. Observe camera behavior

**Expected**:
- Camera does **NOT move** when expanding nodes
- Camera does **NOT move** when opening info panel
- User can manually pan/zoom normally

**To Verify**:
- [ ] No camera movement on node expansion
- [ ] No camera movement on info panel open
- [ ] Manual controls still work (wheel zoom, drag pan)

---

### Test 5: localStorage Persistence
**Status**: ⏳ NEEDS MANUAL VERIFICATION

**Steps**:
1. Enable Auto Focus (blue button)
2. Refresh the browser page (Cmd+R / Ctrl+R)
3. Check Auto Focus button state

**Expected**:
- Auto Focus remains **enabled** after refresh
- Button is still blue
- localStorage key `mindmap-auto-focus-enabled` = `"true"`

**To Verify**:
- [ ] Auto Focus state persists after refresh
- [ ] Button remains blue
- [ ] Check localStorage in DevTools Console:
  ```javascript
  localStorage.getItem('mindmap-auto-focus-enabled')
  // Should return: "true" or "false"
  ```

---

### Test 6: Animation Smoothness
**Status**: ⏳ NEEDS MANUAL VERIFICATION

**Steps**:
1. Enable Auto Focus
2. Expand several nodes in sequence
3. Open and close info panels
4. Observe animation quality

**Expected**:
- Transitions are smooth (no jank)
- 60 FPS performance
- Ease-in-out easing curve
- 500ms duration feels natural

**To Verify**:
- [ ] Animations are smooth and fluid
- [ ] No stuttering or lag
- [ ] Easing curve feels natural
- [ ] Duration (500ms) is appropriate

---

### Test 7: Manual Controls Still Work
**Status**: ⏳ NEEDS MANUAL VERIFICATION

**Steps**:
1. Enable Auto Focus
2. After an Auto Focus animation completes:
   - Try mouse wheel zoom
   - Try drag-to-pan
   - Try zoom in/out buttons
   - Try reset and fit-to-screen

**Expected**:
- All manual controls work normally
- User can override Auto Focus at any time
- No conflicts between Auto Focus and manual control

**To Verify**:
- [ ] Mouse wheel zoom works
- [ ] Drag-to-pan works
- [ ] Zoom buttons work
- [ ] Reset view works
- [ ] Fit to screen works

---

## Automated Test Results

**Test Suite**: ✅ PASSING
```
✓ src/utils/autoFocusUtils.test.ts (18 tests)
✓ src/stores/viewportStore.test.ts (11 tests)
```

**Total Auto Focus Tests**: 29/29 passing

---

## Implementation Summary

### Files Created:
- `src/utils/autoFocusUtils.ts` - Core calculation algorithms
- `src/utils/autoFocusUtils.test.ts` - 18 unit tests

### Files Modified:
- `src/stores/viewportStore.ts` - Added Auto Focus state and actions
- `src/stores/viewportStore.test.ts` - Added 11 store tests
- `src/components/Canvas/ZoomControls.tsx` - Added toggle button
- `src/components/Canvas/Canvas.tsx` - Integrated Auto Focus triggers + CSS transitions

### Key Features:
✅ Dynamic zoom calculation (adapts to 2 children vs 20 children)
✅ Smooth 500ms CSS transitions with ease-in-out
✅ localStorage persistence
✅ Toggle button with visual feedback
✅ Node expansion trigger
✅ Info panel trigger
✅ Bounding box calculations with 100px padding
✅ MIN_ZOOM (0.25) and MAX_ZOOM (4.0) constraints
✅ Comfort factor (0.9) for 10% breathing room

### Next Steps:
1. **Complete manual testing** using this guide
2. Mark tasks 6.6-6.10 in `tasks-0003-prd-auto-focus-camera.md`
3. Run full test suite: `npm test`
4. Fix any discovered bugs
5. Deploy to Firebase

---

## Notes for Next Session

If continuing this work in a new session:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser**: http://localhost:5173/

3. **Follow test procedures** above in order

4. **Document results** in task file:
   - Mark `[x]` for passing tests
   - Add `FAILED:` notes for any issues
   - Create bug fix tasks if needed

5. **When all manual tests pass**:
   ```bash
   npm test  # Verify automated tests still pass
   git add .
   git commit -m "feat: add Auto Focus camera feature"
   ```

6. **Deploy to Firebase**:
   ```bash
   npm run build
   firebase deploy
   ```

---

## Dev Server URL
http://localhost:5173/

**Status**: ✅ Running (as of test file creation)
