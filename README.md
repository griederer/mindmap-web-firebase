# NODEM - Interactive Mind Map Presentation Tool

**Replace PowerPoint with interactive, node-based presentations**

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Firebase](https://img.shields.io/badge/Firebase-mymindmap--f77a5-orange)

---

## 🎯 Overview

NODEM is a web-based interactive mind map presentation tool designed to replace traditional PowerPoint presentations with dynamic, node-based visual storytelling.

### Key Features

- **Node-Based Presentations** - Hierarchical mind maps with expandable nodes
- **Smooth Animations** - 60fps transitions using Framer Motion
- **Action Recording** - Record interaction sequences and replay as presentations
- **Smart Camera** - Auto-positioning and zoom for optimal content viewing
- **Focus Mode** - Blur non-relevant nodes to emphasize key content
- **Firebase Backend** - Cloud storage with real-time sync
- **Multi-Environment** - Independent dev/staging/prod deployments

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

---

## 📁 Project Structure

```
nodem-clean/
├── src/
│   ├── components/       # React components
│   ├── stores/          # Zustand state management
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper functions
│   └── lib/
│       └── firebase.ts  # Firebase configuration
├── tasks/               # PRDs and task lists
├── projects/            # Example mind map projects
├── functions/           # Cloud Functions
└── firebase.json        # Firebase configuration
```

---

## 📚 Documentation

- **[Product Requirements Document](tasks/0001-prd-nodem-core.md)** - Complete feature specifications
- **[Task List](tasks/tasks-0001-prd-nodem-core.md)** - 136 implementation tasks
- **[Firebase Analysis](FIREBASE-ANALYSIS.md)** - Infrastructure documentation
- **[Migration Plan](CLEAN-MIGRATION-PLAN.md)** - Setup and deployment guide

---

## 🔧 Technology Stack

**Frontend**:
- React 18 + TypeScript
- Zustand (state management)
- Framer Motion (animations)
- Konva (canvas rendering)
- Tailwind CSS (styling)

**Backend**:
- Firebase Authentication
- Cloud Firestore (database)
- Cloud Storage (file hosting)
- Firebase Hosting (deployment)

**Development**:
- Vite (build tool)
- Vitest (testing)
- ESLint + Prettier (code quality)

---

## 🌐 Deployment

### Environments

```
Production  → https://mymindmap-f77a5.web.app
Staging     → https://mymindmap-f77a5--staging-[hash].web.app
Development → https://mymindmap-f77a5--dev-[hash].web.app
```

### Deploy Commands

```bash
# Deploy to development
npm run deploy:dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

---

## 🎨 Features Roadmap

### Phase 1: MVP (Current)
- [ ] Core node rendering with Konva
- [ ] Expand/collapse with smooth animations
- [ ] Node collision avoidance
- [ ] Detail panels and image display
- [ ] Focus mode
- [ ] Zoom and pan controls
- [ ] Project management (Firestore)
- [ ] Action recording and playback
- [ ] Presentation mode with smart camera

### Phase 2: Enhancement
- [ ] Real-time collaboration
- [ ] Cloud sync across devices
- [ ] Custom node styling
- [ ] Keyboard shortcuts
- [ ] Undo/Redo

### Phase 3: Advanced
- [ ] Export to PDF/image
- [ ] Mobile app
- [ ] AI-powered content generation
- [ ] Presentation analytics

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

**Test Coverage Goal**: 80%+

---

## 🔗 Links

- **Repository**: https://github.com/griederer/mindmap-web-firebase
- **Firebase Console**: https://console.firebase.google.com/project/mymindmap-f77a5
- **Issues**: https://github.com/griederer/mindmap-web-firebase/issues

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details

---

## 👤 Author

**Gonzalo Riederer**
- GitHub: [@griederer](https://github.com/griederer)
- Email: gonzaloriederer@gmail.com

---

**Built with** ❤️ **to replace PowerPoint with something better**

**Status**: 🟢 Active Development
**Last Updated**: 2025-01-21
