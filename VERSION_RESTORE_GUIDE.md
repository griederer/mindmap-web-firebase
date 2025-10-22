# Version Restore Guide

## Current Saved Version: v1.1.0-smooth-animations

This version includes all the smooth animation improvements with dynamic layout.

### To restore this version later:

#### Option 1: Checkout the tag
```bash
# View all available tags
git tag -l

# Checkout this specific version
git checkout v1.1.0-smooth-animations

# Create a new branch from this version if you want to work on it
git checkout -b restore-smooth-animations v1.1.0-smooth-animations
```

#### Option 2: View the commit
```bash
# See details of this version
git show v1.1.0-smooth-animations

# See the commit hash
git rev-parse v1.1.0-smooth-animations
```

#### Option 3: Create a new branch from this tag
```bash
# Create and switch to new branch from this version
git checkout -b my-new-feature v1.1.0-smooth-animations
```

#### Option 4: Compare with current version
```bash
# See what changed since this version
git diff v1.1.0-smooth-animations..HEAD

# See commits since this version
git log v1.1.0-smooth-animations..HEAD
```

### What's included in this version:

**Features:**
- ✅ Dynamic layout engine preventing node overlaps
- ✅ Smooth expand animations (0.4s fade in)
- ✅ Smooth collapse animations (0.35s fade out)
- ✅ Synchronized connector animations
- ✅ Position changes animate smoothly (0.6s)
- ✅ No jarring scale or fly-in effects

**Changed Files:**
- src/utils/layoutEngine.ts - Subtree height calculation
- src/stores/projectStore.ts - Dynamic layout updates
- src/components/Canvas/NodeComponent.tsx - Node animations
- src/components/Canvas/Connector.tsx - Connector sync
- src/components/Canvas/Canvas.tsx - Render all nodes for fade-out

**Deployed Version:**
https://mymindmap-f77a5.web.app

**GitHub Repository:**
https://github.com/griederer/mindmap-web-firebase

**Commit:** 325cddb
**Tag:** v1.1.0-smooth-animations
**Date:** October 21, 2025
