# NODEM - Organic Mind Mapping Application

![Status](https://img.shields.io/badge/status-work--in--progress-yellow)
![Version](https://img.shields.io/badge/version-3.0.0--wip-orange)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)

## 🚀 Production

**Live App**: https://mymindmap-f77a5.web.app

---

## 📋 Overview

NODEM is a professional-grade interactive mind mapping application featuring **organic bidirectional layouts** with color-coded branches, multiple node styles, and image support. Built with React, TypeScript, Konva, and Firebase.

---

## ✨ v3.0.0 Features (Work in Progress)

### 🌳 Organic Bidirectional Layout
- Nodes automatically distribute to **left and right** of root
- **Color-coded branches** - each main branch gets a unique color
- Colors **propagate** through all descendant nodes
- Smooth animated transitions when expanding/collapsing

### 🎨 Multiple Node Styles
| Style | Description | Use Case |
|-------|-------------|----------|
| `boxed` | White card with border & shadow | Default, detailed nodes |
| `text` | Text only with colored underline | Minimal, clean look |
| `bubble` | Pill-shaped with branch color fill | Emphasis, categories |
| `minimal` | Light gray, subtle shadow | Secondary information |

### 🖼️ Image Support
- Attach images to any node
- **Thumbnail preview** in node (24x24px)
- Badge showing image count (if multiple)
- Base64 storage for portability

### 🔗 Organic Connectors
- **Bezier curves** between parent-child nodes
- Connector color matches branch color
- **Variable stroke width** (thicker near root, thinner at leaves)
- Smooth animation on position changes

### 📊 Branch Color Palette
```
Branch 0: #fb923c (Orange)
Branch 1: #22c55e (Green)
Branch 2: #3b82f6 (Blue)
Branch 3: #a855f7 (Purple)
Branch 4: #ef4444 (Red)
Branch 5: #14b8a6 (Teal)
Branch 6: #f59e0b (Amber)
Branch 7: #ec4899 (Pink)
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.6.2 | Type Safety |
| Vite | 6.4.1 | Build Tool |
| Konva | 9.3.18 | Canvas Rendering |
| react-konva | 18.2.10 | React Bindings |
| use-image | 1.1.1 | Image Loading Hook |
| Zustand | 4.5.2 | State Management |
| Firebase | 11.1.0 | Backend & Hosting |
| Tailwind CSS | 3.4.1 | Styling |

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/griederer/mindmap-web-firebase.git
cd mindmap-web-firebase

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Canvas/
│   │   ├── NodeComponent.tsx    # Renders nodes with 4 styles + images
│   │   ├── Connector.tsx        # Bezier curve connectors
│   │   └── MindmapCanvas.tsx    # Main canvas container
│   ├── Layout/
│   │   └── Sidebar.tsx          # Project management sidebar
│   └── RelationshipSidebar/     # Relationship management
├── stores/
│   ├── projectStore.ts          # Project & mindmap state
│   ├── uiStore.ts               # UI state (selection, focus)
│   ├── viewportStore.ts         # Zoom, pan, camera
│   └── saveStatusStore.ts       # Firebase sync status
├── types/
│   └── node.ts                  # Node, NodeStyle, colors, widths
├── utils/
│   └── layoutEngine.ts          # Bidirectional layout algorithm
├── services/
│   └── firebaseService.ts       # Firebase CRUD operations
└── lib/
    └── firebase.ts              # Firebase configuration
```

---

## 🔧 Key Files for v3.0.0

### `src/types/node.ts`
- `NodeStyle` type: `'boxed' | 'text' | 'bubble' | 'minimal'`
- `NodeImage` interface for image attachments
- `getBranchColor(index)` - returns branch color
- `getConnectorWidth(level)` - returns stroke width by depth

### `src/utils/layoutEngine.ts`
- `calculateLayout()` - bidirectional positioning algorithm
- Assigns nodes to left/right sides
- Propagates branch colors to descendants
- Calculates subtree heights for spacing

### `src/components/Canvas/NodeComponent.tsx`
- Renders 4 different visual styles
- Image thumbnail support with `use-image` hook
- Expand/collapse button
- Branch color indicator (left edge bar)

### `src/components/Canvas/Connector.tsx`
- Bezier curves with `bezier={true}`
- Dynamic stroke width based on node level
- Animated opacity on show/hide
- Position animation synced with nodes

---

## 🧪 Demo Project

Load the **WW2 Demo (41 nodes)** from the sidebar to see all v3.0.0 features in action:

- Mixed node styles throughout the mindmap
- 9 nodes with image thumbnails
- Color-coded branches (Allied Leaders = green, Axis = purple, etc.)
- Bidirectional layout with balanced left/right distribution

---

## 📚 Version History

| Version | Status | Description |
|---------|--------|-------------|
| v1.3 | Stable | Basic mindmap with relationships |
| v2.0 | Stable | Firebase persistence |
| **v3.0.0-wip** | **Current** | Organic layout, styles, images |

---

## 🚧 TODO (Future Improvements)

- [ ] Node drag & drop repositioning
- [ ] Style picker in node editor
- [ ] Image upload from device
- [ ] Export to PNG/SVG
- [ ] Keyboard navigation
- [ ] Search/filter nodes
- [ ] Undo/redo history
- [ ] Collaborative editing

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
npx firebase deploy --only hosting
```

---

## 📄 License

MIT

## 👤 Author

Gonzalo Riederer - [GitHub](https://github.com/griederer)
