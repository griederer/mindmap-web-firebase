# Changelog

All notable changes to NODEM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.0-wip] - 2024-12-07

### Added

#### Organic Bidirectional Layout
- Nodes now distribute automatically to left and right of root node
- Auto-balance algorithm for even distribution
- Smooth animated transitions (1.2s fade-in, 0.6s position changes)
- Subtree height calculations for proper vertical spacing

#### Multiple Node Styles
- **boxed**: White card with border, shadow, and branch color indicator
- **text**: Text-only with colored underline accent
- **bubble**: Pill-shaped with branch color fill (great for categories)
- **minimal**: Light gray background with subtle shadow

#### Branch Color System
- 8-color palette for branch differentiation
- Colors automatically assigned to first-level children
- Colors propagate to all descendants
- Connector lines match branch colors

#### Image Support
- `NodeImage` interface for attaching images to nodes
- Thumbnail preview (24x24px) in node component
- Badge indicator for multiple images
- Base64 storage for JSON portability

#### Variable Connector Width
- Stroke width based on node level (depth)
- Level 1: 4px, Level 2: 3px, Level 3: 2px, Level 4+: 1.5px
- Creates organic "trunk to branches" visual effect

### Changed

#### Node Component (`NodeComponent.tsx`)
- Complete rewrite to support 4 visual styles
- Added `use-image` hook for image loading
- Memoization includes new props (style, branchColor, images)
- Branch color indicator bar on left edge

#### Connector Component (`Connector.tsx`)
- Bezier curves with `bezier={true}` for organic look
- Dynamic stroke width from `getConnectorWidth(level)`
- Shadow effect on connectors for depth
- Bidirectional support (left/right connection points)

#### Layout Engine (`layoutEngine.ts`)
- `calculateLayout()` now handles bidirectional positioning
- `assignBranchColors()` assigns palette colors to branches
- `propagateBranchColor()` cascades colors to descendants
- `determineLayoutSide()` for auto-balance logic

#### Type Definitions (`node.ts`)
- Added `NodeStyle` type union
- Added `NodeImage` interface
- Added `layoutSide`, `branchIndex`, `branchColor` to Node
- Added `getBranchColor()` and `getConnectorWidth()` helpers

### Demo
- Updated `ww2-mindmap.json` to showcase all v3.0.0 features
- 41 nodes with mixed styles (text, bubble, minimal, boxed)
- 9 nodes with embedded SVG images
- Version bumped to 3.0.0

---

## [2.0.0] - 2024-11-XX

### Added
- Firebase Firestore persistence
- Real-time save status indicator
- Project listing from cloud
- Auto-save with debounce

### Changed
- Migrated from localStorage to Firebase
- Sidebar shows cloud projects

---

## [1.3.0] - 2024-10-XX

### Added
- Custom relationships (many-to-many)
- Relationship sidebar for management
- Curved connector lines for relationships

### Changed
- Dual relationship system (hierarchical + custom)

---

## [1.0.0] - 2024-09-XX

### Added
- Initial release
- Infinite canvas with zoom/pan
- Hierarchical node structure
- Expand/collapse functionality
- Node editing (title, notes)
- Auto-focus camera
- Project management

---

## Future Roadmap

### v3.1.0 (Planned)
- [ ] Node drag & drop repositioning
- [ ] Style picker in node edit panel
- [ ] Image upload from device
- [ ] Export to PNG/SVG

### v3.2.0 (Planned)
- [ ] Keyboard navigation (arrows, enter, tab)
- [ ] Search/filter nodes
- [ ] Undo/redo history

### v4.0.0 (Planned)
- [ ] Collaborative real-time editing
- [ ] User authentication
- [ ] Sharing & permissions
