# PRD: Elegant Mindmap Redesign v2.0

**Date:** 2025-12-07
**Status:** In Progress
**Author:** Claude Code

---

## Executive Summary

Redesign the mindmap application to provide a more elegant, professional visual appearance while maintaining all existing functionality. The key change is moving away from the "chalkboard" theme to a clean, modern interface with enhanced node customization options.

---

## Problem Statement

The current chalkboard theme:
- Has a dark green background that feels dated
- Uses cursive fonts that reduce readability
- Has "sketchy" hand-drawn lines that look unprofessional
- Does not match the elegant, colorful mindmap aesthetic the user desires

**Target aesthetic:** Clean, professional mindmaps with:
- Organic curved connections in vibrant colors
- Multiple node types (text, image, text+image)
- White/light background for clarity
- Modern typography

---

## Goals

1. **Restore elegant UI** - Switch from chalkboard to light/modern theme
2. **Enhance node flexibility** - Full support for text-only, image-only, text+image nodes
3. **Maintain existing features** - Bidirectional layout, camera system, relationships
4. **Improve visual polish** - Smooth connections, professional colors, readable fonts

---

## Current State Analysis

### What Already Works Well
| Feature | Status | Notes |
|---------|--------|-------|
| Bidirectional layout | ✅ Complete | Left/right branches from root |
| Camera/viewport | ✅ Complete | Auto-focus, zoom, pan |
| Node images | ✅ Complete | Upload, gallery, display modes |
| Node display modes | ✅ Complete | 'text', 'image', 'both' |
| Custom relationships | ✅ Complete | Many-to-many connections |
| Node info panel | ✅ Complete | Description, notes, images |
| Theme system | ✅ Complete | Light, Dark, Chalkboard |

### What Needs Improvement
| Issue | Current State | Target State |
|-------|--------------|--------------|
| Default theme | Chalkboard (dark, sketchy) | Light (clean, modern) |
| Connection style | Sketchy lines | Smooth curved Bezier |
| Node appearance | Transparent/no shape | Rounded rectangles with shadow |
| Font | Cursive (Caveat) | Modern sans-serif (Inter) |
| Branch colors | Chalk-like muted | Vibrant, professional |

---

## Technical Specification

### 1. Theme Configuration Changes

**File:** `src/types/theme.ts`

```typescript
// Change default theme
export const DEFAULT_THEME = THEME_LIGHT;  // Was: THEME_CHALKBOARD
```

**File:** `src/stores/themeStore.ts`

```typescript
// Ensure light theme is default
const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: THEME_LIGHT,  // Was: THEME_CHALKBOARD
  // ...
}));
```

### 2. Enhanced THEME_LIGHT Definition

```typescript
export const THEME_LIGHT: Theme = {
  id: 'light',
  name: 'Modern Light',
  description: 'Clean, elegant professional theme',
  colors: {
    background: '#fafbfc',
    backgroundPattern: 'dots',
    nodeBackground: '#ffffff',
    nodeBorder: '#e1e4e8',
    nodeText: '#24292e',
    nodeTextSecondary: '#586069',
    branchColors: [
      '#0366d6',  // Blue (root)
      '#28a745',  // Green
      '#fd7e14',  // Orange
      '#6f42c1',  // Purple
      '#e83e8c',  // Pink
      '#17a2b8',  // Teal
      '#ffc107',  // Yellow
      '#dc3545',  // Red
    ],
    connectionDefault: '#959da5',
    connectionHighlight: '#0366d6',
    selectionRing: '#0366d6',
    hoverHighlight: 'rgba(3, 102, 214, 0.08)',
  },
  fonts: {
    title: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'SF Mono', 'Fira Code', monospace",
  },
  effects: {
    nodeShape: 'rounded',
    nodeShadow: true,
    nodeOpacity: 1,
    connectionStyle: 'curved',
    connectionWidth: 2.5,
    handDrawn: false,
    glowEffect: false,
  },
};
```

### 3. Node Display Modes

Already implemented in `src/types/node.ts`:

```typescript
export type NodeDisplayMode = 'text' | 'image' | 'both';

export interface Node {
  // ...
  displayMode?: NodeDisplayMode;
  primaryImageId?: string;
  images?: NodeImage[];
}
```

**Enhancement:** Ensure all three modes render correctly with the new theme.

### 4. Connection Rendering

**File:** `src/components/Canvas/Connector.tsx`

For non-handDrawn themes, use smooth Bezier curves:

```typescript
// Smooth curved connection (not sketchy)
const controlPointOffset = Math.abs(toX - fromX) * 0.4;

const pathData = `
  M ${fromX} ${fromY}
  C ${fromX + controlPointOffset} ${fromY}
    ${toX - controlPointOffset} ${toY}
    ${toX} ${toY}
`;
```

### 5. Node Component Styling

**File:** `src/components/Canvas/NodeComponent.tsx`

For `nodeShape: 'rounded'`:
- Border radius: 8px
- Box shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Background: solid white
- Border: 1px solid with branch color

---

## UI/UX Specifications

### Node Visual Hierarchy

| Level | Width | Font Size | Font Weight | Shadow |
|-------|-------|-----------|-------------|--------|
| Root (0) | 220px | 18px | 600 | Strong |
| Level 1 | 200px | 16px | 500 | Medium |
| Level 2 | 180px | 14px | 500 | Light |
| Level 3+ | 160px | 13px | 400 | Subtle |

### Color Assignment

- **Root node:** First branch color (blue)
- **Level 1 nodes:** Rotating through branchColors array
- **Descendants:** Inherit ancestor's branch color

### Image Node Dimensions

| Mode | Width | Height | Title Area |
|------|-------|--------|------------|
| text | 200px | 60px | Full node |
| image | 150px | 100px | 24px below |
| both | 150px | 124px | 24px below |

---

## Implementation Checklist

### Phase 1: Theme Switch (Immediate)
- [ ] Change DEFAULT_THEME to THEME_LIGHT
- [ ] Update themeStore default state
- [ ] Verify theme loads correctly on app start

### Phase 2: Visual Polish
- [ ] Review NodeComponent rendering with light theme
- [ ] Ensure Connector uses smooth curves (not sketchy)
- [ ] Test all three display modes (text/image/both)
- [ ] Verify branch colors apply correctly

### Phase 3: Testing
- [ ] Create test project with mixed node types
- [ ] Test bidirectional layout (left/right branches)
- [ ] Verify camera auto-focus works
- [ ] Check node info panel appearance
- [ ] Test node editing modal

### Phase 4: Documentation
- [ ] Update README with new default theme
- [ ] Screenshot new appearance
- [ ] Tag new version

---

## Success Criteria

1. App loads with clean, light theme by default
2. Nodes display with rounded corners and subtle shadows
3. Connections are smooth Bezier curves (not sketchy)
4. All three node display modes work correctly
5. Branch colors are vibrant and professional
6. Typography is readable (Inter font)
7. Existing features (camera, relationships, etc.) still work

---

## Rollback Plan

If issues arise:
```bash
# Revert to chalkboard theme
git checkout HEAD -- src/types/theme.ts src/stores/themeStore.ts
```

---

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Theme Switch | 15 min | Pending |
| Phase 2: Visual Polish | 30 min | Pending |
| Phase 3: Testing | 15 min | Pending |
| Phase 4: Documentation | 10 min | Pending |

**Total estimated time:** ~1 hour

---

## Appendix: Reference Image Analysis

The reference image (Quality Management mindmap) shows:
- White/light background
- Organic curved colored branches
- Text nodes with rounded appearance
- Image nodes integrated naturally
- Professional, corporate aesthetic
- Multi-directional layout (center-out)

This PRD aligns the implementation with these visual characteristics.
