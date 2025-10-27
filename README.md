# MyMindmap - Interactive Mind Mapping Application

![Status](https://img.shields.io/badge/status-stable-success)
![Version](https://img.shields.io/badge/version-1.3-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)

## 🚀 Production

**Live App**: https://mymindmap-f77a5.web.app

## 📋 Overview

MyMindmap is a professional-grade interactive mind mapping application built with React, TypeScript, and Konva. It features an infinite canvas, hierarchical and custom node relationships, smooth animations, and a powerful camera system.

## ✨ Key Features

- **Infinite Canvas**: Zoom (0.25x-4x) and pan with smooth animations
- **Node Management**: Create, edit, delete, expand/collapse nodes
- **Dual Relationship System**:
  - Hierarchical (parent-child tree structure)
  - Custom (many-to-many mesh connections with curved lines)
- **Auto-Focus Camera**: Smooth 4-second transitions to selected nodes
- **Image Attachments**: Upload and view images on any node
- **Project Management**: Create and switch between multiple mind maps
- **Professional UI**: Modern design with Tailwind CSS

## 🛠️ Tech Stack

- **React** 18.3.1 with TypeScript
- **Vite** 6.4.1 (build tool)
- **Konva** 9.3.18 (canvas rendering)
- **Zustand** 4.5.2 (state management)
- **Firebase** 11.1.0 (backend & hosting)
- **Tailwind CSS** 3.4.1

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/griederer/mindmap-web-firebase.git
cd nodem-clean

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
npx firebase deploy --only hosting
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Canvas/              # Main canvas components
│   ├── Layout/              # App layout
│   └── RelationshipSidebar/ # Relationship management
├── stores/                  # Zustand state stores
├── types/                   # TypeScript definitions
└── lib/                     # Firebase & utilities
```

## 🔄 Stable Version

This repository is currently on the **stable v1.3** release.

- **Branch**: `release/v1.3`
- **Commit**: `86f0a8e`
- **Tag**: `v1.3-stable`

See [STABLE-VERSION.md](./STABLE-VERSION.md) for complete documentation.

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Build
npm run build

# Preview production build
npm run preview
```

## 📚 Documentation

- [STABLE-VERSION.md](./STABLE-VERSION.md) - Complete stable version documentation
- [Firebase Console](https://console.firebase.google.com/project/mymindmap-f77a5/overview)

## 🤝 Contributing

When creating new features:

1. Always branch from `release/v1.3`
2. Test locally before deploying
3. Build and verify before pushing
4. Document significant changes

## 📄 License

MIT

## 👤 Author

Gonzalo Riederer - [GitHub](https://github.com/griederer)
