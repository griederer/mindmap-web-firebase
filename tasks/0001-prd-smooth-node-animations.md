# PRD: Smooth Node and Info Panel Animations

## 1. Introduction/Overview

Currently, the mind map has smooth camera animations (4 seconds) but node appearance/disappearance and info panel display animations are too fast (0.4 seconds for nodes, instant for info panels). This creates a visual inconsistency and abrupt user experience.

**Goal**: Synchronize all visual transitions to feel cohesive and smooth, matching the quality of the camera animations.

## 2. Goals

1. **Smooth node transitions**: Nodes should fade in/out gradually when expanding/collapsing
2. **Smooth info panel transitions**: Info panels should animate in/out smoothly (not instantly)
3. **Consistent timing**: All animations should feel coordinated and professional
4. **Performance**: Animations should not cause lag or jank
5. **Visual polish**: Transitions should feel natural and pleasant

## 3. User Stories

1. **As a user**, when I expand a node, I want to see child nodes fade in smoothly over ~1.2 seconds so the appearance feels gradual and natural
2. **As a user**, when I collapse a node, I want to see child nodes fade out smoothly over ~1.0 seconds so the disappearance doesn't feel jarring
3. **As a user**, when I open an info panel, I want to see it fade in and slide into position over ~0.8 seconds so it feels like it's "appearing" rather than "popping"
4. **As a user**, when I close an info panel, I want to see it fade out smoothly over ~0.6 seconds so the transition feels complete
5. **As a user**, I want all animations to feel coordinated with the camera movement so the overall experience feels cohesive

## 4. Functional Requirements

### 4.1 Node Appearance Animation
- **FR-1.1**: When a node becomes visible (isVisible: false → true), it should:
  - Start at opacity 0
  - Fade in to opacity 1 over 1.2 seconds
  - Use EaseOut easing for a natural appearance
  - Optionally: Scale from 0.8 to 1.0 for a "zoom in" effect

### 4.2 Node Disappearance Animation
- **FR-2.1**: When a node becomes invisible (isVisible: true → false), it should:
  - Start at opacity 1
  - Fade out to opacity 0 over 1.0 seconds
  - Use EaseIn easing for a smooth exit
  - Optionally: Scale from 1.0 to 0.8 for a "zoom out" effect
  - Remain in DOM during animation (remove after completion)

### 4.3 Info Panel Appearance Animation
- **FR-3.1**: When an info panel opens, it should:
  - Start at opacity 0 and slightly offset to the right (+20px)
  - Fade in to opacity 1 over 0.8 seconds
  - Slide to final position (offset 0) over 0.8 seconds
  - Use EaseOut easing
  - Animation should coordinate with camera movement

### 4.4 Info Panel Disappearance Animation
- **FR-4.1**: When an info panel closes, it should:
  - Start at opacity 1 and position 0
  - Fade out to opacity 0 over 0.6 seconds
  - Slide slightly to the right (+10px) over 0.6 seconds
  - Use EaseIn easing

### 4.5 Position Animation (Existing - Enhancement)
- **FR-5.1**: Node position changes should remain at 0.6 seconds (current implementation)
- **FR-5.2**: Position animation should use EaseInOut (current implementation)

## 5. Non-Goals (Out of Scope)

- **NG-1**: Animating connector lines separately (they follow node positions automatically)
- **NG-2**: Customizable animation speeds per user (fixed timings for consistency)
- **NG-3**: Animation presets or themes
- **NG-4**: Parallax or advanced animation effects
- **NG-5**: Animating the expand/collapse button itself

## 6. Technical Considerations

### 6.1 Current Implementation
- **NodeComponent.tsx** (lines 62-81):
  - Has fade animations: 0.4s in, 0.35s out
  - **Issue**: Too fast, feels abrupt
- **NodeInfoPanel.tsx**:
  - **Issue**: No animations, appears instantly

### 6.2 Konva Animation System
- Uses `groupRef.to()` for smooth transitions
- Supports opacity, position (x, y), scale
- Easing functions: EaseIn, EaseOut, EaseInOut
- Can chain or coordinate multiple animations

### 6.3 Performance Considerations
- Konva handles canvas rendering efficiently
- Fade animations are GPU-accelerated
- Multiple concurrent node animations should not cause performance issues
- Max ~20 nodes animating simultaneously (typical expansion scenario)

### 6.4 Timing Coordination
- Camera animation: 4.0 seconds (just adjusted)
- Proposed node fade in: 1.2 seconds
- Proposed node fade out: 1.0 seconds
- Proposed info panel fade in: 0.8 seconds
- Proposed info panel fade out: 0.6 seconds

**Rationale**:
- Node animations should be noticeable but not compete with camera
- Info panels are secondary, so faster transitions
- Fade out faster than fade in (common UX pattern)

## 7. Design Considerations

### 7.1 Animation Easing
- **Fade In**: EaseOut (starts fast, ends slow - feels natural)
- **Fade Out**: EaseIn (starts slow, ends fast - feels deliberate)
- **Position**: EaseInOut (smooth throughout - current implementation)

### 7.2 Optional Scale Effect
Consider adding scale animation for extra polish:
- Fade in: Scale 0.95 → 1.0 (subtle zoom in)
- Fade out: Scale 1.0 → 0.95 (subtle zoom out)

### 7.3 Info Panel Slide Direction
- Slide in from right (+20px offset initially)
- Slide out to right (+10px offset)
- Matches natural reading direction

## 8. Success Metrics

1. **Visual consistency**: All animations feel coordinated (subjective evaluation)
2. **No jank**: Animations run at 60fps on typical hardware
3. **User feedback**: Transitions feel smooth and professional
4. **Implementation time**: < 2 hours to implement and test

## 9. Open Questions

1. **Q1**: Should we add scale animation to nodes? (See 7.2)
   - **Decision needed**: Test with/without, get user feedback

2. **Q2**: Should info panel animation start immediately or delay slightly (100ms) to coordinate with camera?
   - **Decision needed**: Test both approaches

3. **Q3**: Should connectors fade in/out with nodes?
   - **Current**: Connectors follow node opacity automatically
   - **Decision**: Keep current behavior (automatic)

## 10. Implementation Notes

### Files to modify:
1. **src/components/Canvas/NodeComponent.tsx**:
   - Update lines 62-81 (visibility animations)
   - Change durations: 0.4s → 1.2s (fade in), 0.35s → 1.0s (fade out)
   - Consider adding scale animation

2. **src/components/Canvas/NodeInfoPanel.tsx**:
   - Add useRef for Group
   - Add useEffect for mount animation (fade in + slide)
   - Add useEffect for unmount animation (fade out + slide)
   - Handle cleanup to prevent memory leaks

### Testing checklist:
- [ ] Node expansion: Smooth 1.2s fade in
- [ ] Node collapse: Smooth 1.0s fade out
- [ ] Info panel open: Smooth 0.8s fade in + slide
- [ ] Info panel close: Smooth 0.6s fade out + slide
- [ ] No performance issues with 10+ nodes animating
- [ ] Camera animation coordinates well with node/panel animations

---

**Status**: Draft - Ready for implementation
**Priority**: High (affects core user experience)
**Estimated effort**: 1.5-2 hours
