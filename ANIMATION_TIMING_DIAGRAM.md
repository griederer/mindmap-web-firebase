# Animation Timing Diagram

## The Problem (Before Fix)

```
Timeline of Events:
═══════════════════════════════════════════════════════════════════════════════

User Action: Expand Node
│
├─ T+0ms: Click node to expand
│
├─ T+200ms: Auto Focus triggers
│           focusOnNodes() called
│           State updates: x=100, y=200, zoom=1.5
│
├─ T+202ms: Animation useEffect fires
│           Checks: hasChanged = true (prev.x=0 vs x=100)
│           Starts 50ms debounce
│
├─ T+252ms: Debounce expires
│           stage.to() starts animation
│           ❌ PROBLEM: previousValuesRef = {x:100, y:200, zoom:1.5}
│           (Updated IMMEDIATELY, not when animation finishes!)
│
├─ T+500ms: Animation still running (1/4 complete)...
│
├─ T+750ms: User clicks "Show Info" button
│           Info panel opens
│
├─ T+1000ms: Animation still running (1/2 complete)...
│           Auto Focus triggers for info panel
│           focusOnNodeWithPanel() called
│           State updates: x=150, y=250, zoom=1.2
│
├─ T+1002ms: Animation useEffect fires
│            Checks: hasChanged?
│            prev.x=100 (set at T+252ms)
│            current x=150
│            hasChanged = true ✅
│            But wait...
│
├─ T+1052ms: Debounce expires
│            stage.to() called
│            ⚠️ ISSUE: Konva stage is mid-animation!
│            Stage position is actually x=75 (halfway between 0 and 150)
│            New animation starts from x=75 to x=150
│            Results in: Jerky, incomplete animation
│
├─ T+2252ms: First animation would have completed (but was interrupted)
│
├─ T+3052ms: Second animation completes
│
Result: 🔴 Inconsistent, sometimes abrupt animations
```

---

## The Solution (After Fix)

```
Timeline of Events:
═══════════════════════════════════════════════════════════════════════════════

User Action: Expand Node
│
├─ T+0ms: Click node to expand
│
├─ T+200ms: Auto Focus triggers
│           focusOnNodes() called
│           State updates: x=100, y=200, zoom=1.5
│
├─ T+202ms: Animation useEffect fires
│           Checks: hasChanged = true (prev.x=0 vs x=100)
│           Starts 50ms debounce
│
├─ T+252ms: Debounce expires
│           Validates: hasSignificantChange = true
│           stage.to() starts animation
│           ✅ FIX: previousValuesRef NOT updated yet!
│           Still has old values: {x:0, y:0, zoom:1.0}
│
├─ T+500ms: Animation progressing smoothly (1/4 complete)...
│
├─ T+750ms: User clicks "Show Info" button
│           Info panel opens
│
├─ T+1000ms: Animation progressing smoothly (1/2 complete)...
│           Auto Focus triggers for info panel
│           focusOnNodeWithPanel() called
│           State updates: x=150, y=250, zoom=1.2
│
├─ T+1002ms: Animation useEffect fires
│            Checks: hasChanged?
│            prev.x=0 (STILL old value! Not updated yet!)
│            current x=150
│            hasChanged = true ✅
│            Starts 50ms debounce
│
├─ T+1052ms: Previous timeout cleared
│            New 50ms debounce starts
│
├─ T+2252ms: FIRST animation completes!
│            onFinish() callback fires
│            ✅ NOW previousValuesRef updates: {x:100, y:200, zoom:1.5}
│
├─ T+2260ms: (Animation already in progress for info panel)
│
├─ T+4260ms: SECOND animation completes smoothly!
│            onFinish() callback fires
│            previousValuesRef updates: {x:150, y:250, zoom:1.2}
│
Result: 🟢 Smooth, consistent 2-second animations for ALL Auto Focus actions!
```

---

## Key Difference

### Before Fix:
```
Start Animation → Update previousValuesRef → Continue Animation
                  ⚠️ WRONG! Next Auto Focus sees "no change"
```

### After Fix:
```
Start Animation → Animation Runs → Animation Completes → Update previousValuesRef
                                                         ✅ CORRECT! Prevents race conditions
```

---

## Code Comparison

### Before (Broken):
```typescript
stage.to({
  x, y,
  scaleX: zoom,
  scaleY: zoom,
  duration: 2.0,
  easing: Konva.Easings.EaseInOut,
});
previousValuesRef.current = { x, y, zoom }; // ❌ Immediate update
```

### After (Fixed):
```typescript
stage.to({
  x, y,
  scaleX: zoom,
  scaleY: zoom,
  duration: 2.0,
  easing: Konva.Easings.EaseInOut,
  onFinish: () => {
    previousValuesRef.current = { x, y, zoom }; // ✅ Update after completion
  }
});
```

---

## Why This Matters

**previousValuesRef Purpose**: Track what values have been animated to, so we can detect when new animations are needed.

**The Race Condition**:
1. If we update it BEFORE animation completes
2. And a new Auto Focus triggers DURING the animation
3. The new Auto Focus might see "prev === current"
4. Skip the animation (thinks it's already there)
5. Result: Instant jump instead of smooth animation

**The Fix**:
1. Only update AFTER animation completes
2. Any new Auto Focus during animation sees "prev !== current"
3. Starts new animation correctly
4. Result: Always smooth transitions

---

## Visual Representation

```
BEFORE FIX (Race Condition):
═══════════════════════════════════════════════════════════════

Animation 1:  [===========>                    ]  (interrupted)
                          ↑
                          previousValuesRef updated here
                          Animation 2 sees "no change"
                          Instant jump! ❌

═══════════════════════════════════════════════════════════════

AFTER FIX (Proper Sequencing):
═══════════════════════════════════════════════════════════════

Animation 1:  [================================>] Complete!
                                                 ↑
                                    previousValuesRef updated here

Animation 2:                          [================================>]
                                      Smooth animation! ✅

═══════════════════════════════════════════════════════════════
```

---

## Testing Verification

Run the app and check console logs:

### Smooth Animation (Expected):
```
[Auto Focus] Node expansion detected: {...}
[ViewportStore] focusOnNodes called: {...}
[Animation] {type: "AUTO_FOCUS", ...}
[Animation] Starting smooth animation from {...} to {...}
... wait 2 seconds ...
[Animation] Animation completed  ← previousValuesRef updated HERE
```

### Abrupt Jump (Bug, should NOT happen):
```
[Auto Focus] Info panel detected: {...}
[ViewportStore] focusOnNodeWithPanel called: {...}
[Animation] {type: "AUTO_FOCUS", ...}
[Animation] No significant change, skipping animation  ← This should NOT happen!
```

If you see "skipping animation" when expanding nodes or showing info panels, the bug still exists.

---

## Conclusion

The fix ensures that `previousValuesRef` acts as a true "history" of completed animations, not a "plan" of what will be animated. This prevents the race condition where rapid Auto Focus calls would be incorrectly skipped, resulting in abrupt camera jumps instead of smooth transitions.
