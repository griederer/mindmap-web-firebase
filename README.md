# MyMindmap - Firebase Web Application

**Version**: 1.0.0 (In Development)
**Repository**: https://github.com/griederer/mindmap-web-firebase
**Desktop App**: https://github.com/griederer/mindmap-macos-app

---

## 📋 Project Overview

MyMindmap is a complete transformation of the existing macOS Electron application into a modern, cloud-based web application using Firebase as the backend platform.

### Key Objectives

1. **Cross-Platform Accessibility** - Access from any browser on desktop, tablet, or mobile
2. **Real-Time Collaboration** - Multiple users editing simultaneously with presence awareness
3. **Cloud Storage** - Automatic sync across devices with Firebase Firestore
4. **Feature Parity** - Maintain 100% of desktop app functionality
5. **Enhanced UX** - Instant access, no installation required

---

## 📚 Documentation

### Product Requirements

- **[PRD: Firebase Web Transformation](tasks/0001-prd-firebase-web-transformation.md)** - Complete product requirements document

### Key Documents (To Be Created)

- **Task List** - Detailed implementation tasks (generated from PRD)
- **Technical Specification** - Detailed architecture and API design
- **Testing Strategy** - Unit, integration, and E2E test plans
- **Deployment Guide** - CI/CD pipeline and production deployment

---

## 🏗️ Architecture

### Tech Stack

**Frontend**:
- React 18+ with TypeScript
- Zustand for state management
- Tailwind CSS + Shadcn/ui components
- Konva.js for canvas rendering
- Vite for build tooling

**Backend**:
- Firebase Authentication (email/password + Google OAuth)
- Cloud Firestore (NoSQL database)
- Cloud Storage (image hosting)
- Cloud Functions (MCP server, exports)
- Firebase Hosting (static site hosting)

**Development Tools**:
- Vitest + React Testing Library (testing)
- Playwright (E2E testing)
- ESLint + Prettier (code quality)
- GitHub Actions (CI/CD)

---

## 🚀 Current Status

**Phase**: Planning & Design
**Progress**: PRD Complete ✅

### Roadmap

- [x] **Phase 0**: Repository setup, PRD creation
- [ ] **Phase 1**: Core mindmap engine (4 weeks)
- [ ] **Phase 2**: Real-time collaboration (3 weeks)
- [ ] **Phase 3**: Advanced features (3 weeks)
- [ ] **Phase 4**: MCP server integration (2 weeks)
- [ ] **Phase 5**: Polish & testing (2 weeks)
- [ ] **Phase 6**: Launch (1 week)

**Estimated Completion**: ~17 weeks (4 months)

---

## 🎯 Feature Comparison

### Desktop App v4.0 Features
- ✅ Canvas-based mindmap rendering
- ✅ Node operations (CRUD, reorder, expand/collapse)
- ✅ Image management (Unsplash integration)
- ✅ Categories and relationships
- ✅ Focus mode and presentation mode
- ✅ 17-tool MCP server for Claude Code
- ❌ Real-time collaboration (desktop-only)
- ❌ Cross-platform support (macOS only)
- ❌ Cloud sync (file-based only)

### Web App v5.0 Features
- ✅ All desktop features maintained
- ✅ Real-time collaboration with multiple users
- ✅ Cross-platform (any browser)
- ✅ Cloud storage with automatic sync
- ✅ Mobile responsive design
- ✅ Shareable links with permissions
- ✅ Version history and rollback
- ✅ PWA support for offline mode

---

## 🔧 Development Setup (Coming Soon)

Prerequisites:
- Node.js 18+
- npm or yarn
- Firebase CLI
- Git

Installation steps will be added once development begins.

---

## 🧪 Testing Strategy

### Test Coverage Goals
- **Unit Tests**: 80% coverage
- **Integration Tests**: All Firebase interactions
- **E2E Tests**: Complete user flows
- **Performance Tests**: 60fps canvas, <3s load time

### Testing Tools
- Vitest (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests)
- Firebase Emulator Suite (backend testing)

---

## 📊 Success Metrics (First 3 Months)

| Metric | Target |
|--------|--------|
| Active users | 1,000 |
| Mindmaps created | 5,000 |
| Collaboration sessions | 500 |
| User retention (Week 1) | 40% |
| Crash-free users | 99.5% |
| Average load time | < 3 seconds |
| Customer satisfaction | 4.5/5 stars |

---

## 🤝 Contributing

This project follows the **ai-dev-tasks workflow** for structured development:

1. **PRD** → Product Requirements Document (this repo)
2. **Task List** → Detailed implementation tasks
3. **Implementation** → One task at a time with approval gates
4. **Testing** → TDD approach, all tests must pass
5. **Deployment** → CI/CD automated deployment

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines (to be created).

---

## 🔗 Related Links

- **Desktop App Repository**: https://github.com/griederer/mindmap-macos-app
- **MCP Documentation**: https://spec.modelcontextprotocol.io/
- **Firebase Documentation**: https://firebase.google.com/docs
- **Obsidian Vault**: `/Users/gonzaloriederer/Documents/Obsidian/griederer/Proyectos/MyMindmap Web App/`

---

## 📝 License

MIT License

Copyright (c) 2025 Gonzalo Riederer

---

## 📧 Contact

- **Author**: Gonzalo Riederer
- **Email**: gonzaloriederer@gmail.com
- **GitHub**: [@griederer](https://github.com/griederer)
- **Project Issues**: https://github.com/griederer/mindmap-web-firebase/issues

---

**Status**: 🟢 Active Development
**Last Updated**: October 10, 2025
