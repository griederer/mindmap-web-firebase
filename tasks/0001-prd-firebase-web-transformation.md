# Product Requirements Document: MyMindmap - Firebase Web Application

**Version**: 1.0.0
**Date**: October 10, 2025
**Author**: Gonzalo Riederer
**Status**: Draft

---

## 1. Introduction

### 1.1 Overview

MyMindmap is a complete transformation of the existing macOS Electron application into a modern, cloud-based web application using Firebase as the backend platform. This transformation will enable real-time collaboration, cross-platform accessibility, and seamless data synchronization while preserving all existing features of the desktop application.

### 1.2 Current State Analysis

**Existing System** (v4.0.0 - macOS Electron):
- **Architecture**: Electron desktop app with file-based storage
- **Storage**: Local `.pmap` files in `~/Documents/PWC Mindmaps/`
- **Features**:
  - Canvas-based mindmap rendering
  - 17-tool MCP server for Claude Code integration
  - Node operations (CRUD, reorder, expand/collapse)
  - Image management via Unsplash API
  - Categories and relationships
  - Focus mode and presentation mode
  - Local file watching with chokidar
- **Performance**: 60fps canvas rendering, <100MB memory usage
- **Limitations**: Single-user, desktop-only, no cloud sync, no collaboration

### 1.3 Problem Statement

The current desktop application limits users to:
1. **Single device access** - Can't access mindmaps from other computers or mobile devices
2. **No collaboration** - Can't work on mindmaps with team members in real-time
3. **Platform lock-in** - macOS only, excludes Windows/Linux users
4. **No backup/sync** - Risk of data loss if device fails
5. **Manual sharing** - Must export and email files to share with others

---

## 2. Goals

### 2.1 Primary Goals

1. **Cross-Platform Accessibility**
   - Accessible from any browser (Chrome, Firefox, Safari, Edge)
   - Responsive design for desktop, tablet, and mobile
   - Progressive Web App (PWA) support for offline capabilities

2. **Real-Time Collaboration**
   - Multiple users can edit the same mindmap simultaneously
   - See other users' cursors and changes in real-time
   - Presence indicators showing who's online

3. **Cloud-Based Storage**
   - All mindmaps stored in Firebase Firestore
   - Automatic synchronization across devices
   - Version history and rollback capabilities

4. **Feature Parity**
   - Maintain 100% of desktop app features
   - Canvas-based rendering with same performance
   - MCP server integration (browser-based)

5. **Enhanced User Experience**
   - Faster onboarding (no installation required)
   - Instant access from any device
   - Shareable links for collaboration

### 2.2 Success Metrics

| Metric | Target | Measurement Period |
|--------|--------|-------------------|
| **User Adoption** | 1,000 active users | First 3 months |
| **Collaboration Sessions** | 500 concurrent editing sessions | First 6 months |
| **Performance** | 60fps canvas rendering | Ongoing |
| **Load Time** | < 3 seconds initial load | Ongoing |
| **Uptime** | 99.9% availability | Monthly |
| **User Satisfaction** | 4.5/5 stars | Quarterly survey |

---

## 3. User Stories

### 3.1 Core User Stories

**As a consultant**, I want to:
1. Access my mindmaps from any device so I can work from office, home, or client sites
2. Share mindmaps with colleagues via link so they can review and provide feedback
3. Collaborate in real-time with team members so we can brainstorm together remotely
4. See version history of my mindmaps so I can restore previous versions if needed
5. Export mindmaps to PDF/PNG so I can include them in client presentations

**As a project manager**, I want to:
1. Create project mindmaps that my team can contribute to simultaneously
2. Assign categories and relationships to nodes to organize complex project structures
3. Add images and detailed notes to nodes to provide comprehensive documentation
4. Use presentation mode to present the mindmap in client meetings
5. Control access permissions so only authorized team members can edit

**As a new user**, I want to:
1. Sign up quickly using Google or email so I can start immediately
2. See example mindmaps and tutorials so I can learn the features
3. Import existing mindmaps from the desktop app so I don't lose my work
4. Have an intuitive interface so I don't need extensive training
5. Get AI assistance via Claude integration to build mindmaps faster

---

## 4. Functional Requirements

### 4.1 Authentication & User Management

**REQ-AUTH-001**: Email/Password Authentication
- Users can register with email and password
- Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number
- Email verification required before full access
- Password reset via email link

**REQ-AUTH-002**: OAuth Social Login
- Support Google OAuth authentication
- Optional: GitHub, Microsoft OAuth
- Auto-create user profile on first login

**REQ-AUTH-003**: User Profile Management
- Users can update display name and avatar
- Profile shows: email, join date, total mindmaps, storage used
- Account deletion with data export option

### 4.2 Mindmap Operations

**REQ-MINDMAP-001**: Create Mindmap
- Users can create new blank mindmaps
- Option to create from templates (Business, Project, SWOT, etc.)
- Auto-save every 5 seconds
- Untitled mindmaps auto-named "Untitled Mindmap {timestamp}"

**REQ-MINDMAP-002**: Load/Save Mindmap
- Mindmaps auto-save to Firestore on every change
- Show save status indicator ("Saving...", "Saved", "Error")
- Offline changes queued and synced when connection restored
- Conflict resolution: last-write-wins with notification

**REQ-MINDMAP-003**: List/Search Mindmaps
- Users see list of all their mindmaps
- Sort by: name, last modified, created date, size
- Search by name, node content, tags
- Filter by: owner, shared with me, favorites

**REQ-MINDMAP-004**: Delete Mindmap
- Soft delete: moves to "Trash" folder
- Trash auto-empties after 30 days
- Restore from trash option
- Permanent delete requires confirmation

**REQ-MINDMAP-005**: Import/Export
- Import from: `.pmap` (desktop app), JSON, Markdown, FreeMind XML
- Export to: JSON, Markdown, PNG (high-res), SVG, PDF
- Batch export multiple mindmaps

### 4.3 Node Operations (Feature Parity with Desktop)

**REQ-NODE-001**: CRUD Operations
- Create node: click "+" button or keyboard shortcut (Tab)
- Update node: double-click to edit title, description, notes
- Delete node: delete key or context menu (with confirmation if has children)
- All operations sync in real-time to all connected clients

**REQ-NODE-002**: Node Hierarchy
- Support unlimited nesting depth
- Drag-and-drop to reorder nodes
- Drag-and-drop to change parent
- Expand/collapse branches
- Expand All / Collapse All operations

**REQ-NODE-003**: Node Information Panel
- Show/hide description and notes per node
- Upload multiple images per node (max 5MB each)
- Image lightbox on click
- Markdown support in notes field

**REQ-NODE-004**: Node Relationships
- Create custom relationship types (e.g., "depends on", "related to")
- Assign colors and dash patterns to relationships
- Draw relationship connections between non-parent nodes
- Toggle relationship visibility

**REQ-NODE-005**: Node Categories
- Create color-coded categories (e.g., "High Priority", "In Progress")
- Assign multiple categories per node
- Filter mindmap by active categories
- Category legend panel

### 4.4 Rendering & Visualization

**REQ-VIS-001**: Canvas Rendering
- Use HTML5 Canvas for connection lines (60fps target)
- Smooth Bezier curves between nodes
- Hardware-accelerated transforms
- Responsive canvas sizing

**REQ-VIS-002**: Zoom & Pan
- Mouse wheel zoom (0.5x to 3x)
- Keyboard shortcuts: Cmd/Ctrl + +/- for zoom, Cmd/Ctrl + 0 to reset
- Pan by dragging canvas background
- Touch gestures for mobile (pinch-zoom, two-finger pan)

**REQ-VIS-003**: Focus Mode
- Click "focus" button to isolate a branch
- Dims unrelated nodes
- Shows only selected node and descendants
- Exit focus mode to restore full view

**REQ-VIS-004**: Presentation Mode
- Full-screen mode for presentations
- Slide-based navigation through key nodes
- Hide edit controls, show only content
- Keyboard shortcuts for next/previous slide

### 4.5 Collaboration Features (NEW)

**REQ-COLLAB-001**: Real-Time Synchronization
- Changes from any user propagate to all connected clients within 100ms
- Use Firebase Realtime Database or Firestore onSnapshot
- Optimistic UI updates (show change immediately, rollback if conflict)

**REQ-COLLAB-002**: Presence Awareness
- Show avatars/initials of connected users in header
- Show user cursors on canvas (color-coded by user)
- Highlight node being edited by another user (temporary lock)

**REQ-COLLAB-003**: Sharing & Permissions
- Share via link with permission levels:
  - **View**: Can only see mindmap, no edits
  - **Comment**: Can add comments, no edits
  - **Edit**: Full editing permissions
  - **Owner**: Edit + delete + manage permissions
- Copy shareable link to clipboard
- Revoke access by removing user from permissions list

**REQ-COLLAB-004**: Comments (Optional Phase 2)
- Users with comment/edit permissions can add comments to nodes
- Comments show author, timestamp, text
- Resolve/unresolve comments
- Email notifications for new comments

### 4.6 MCP Server Integration

**REQ-MCP-001**: Browser-Based MCP Server
- Implement MCP server as web service (Node.js API on Firebase Functions)
- Expose same 17 tools as desktop app
- Claude Code connects via HTTP instead of stdio

**REQ-MCP-002**: Natural Language Creation
- Tool: `create_mindmap_smart` - create mindmap from description
- Tool: `add_node` - add nodes via natural language
- Tool: `search_images` - integrate Unsplash API for images

**REQ-MCP-003**: MCP Authentication
- MCP requests include Firebase auth token
- Server validates token before executing operations
- Rate limiting: 100 requests per minute per user

**REQ-MCP-004**: Available MCP Servers for Development Context
The following MCP servers are available during development to optimize context and accelerate implementation:

| MCP Server | Purpose | Key Tools | Use Case |
|------------|---------|-----------|----------|
| **GitHub** | Repository operations | `create_repository`, `get_file_contents`, `create_or_update_file`, `create_pull_request` | Version control, code collaboration |
| **Firebase** | Firebase operations | `firebase_init`, `firebase_deploy`, `firestore_query_collection`, `firebase_create_app` | Backend setup, deployment, testing |
| **Obsidian** | Documentation | `obsidian_get_file_contents`, `obsidian_append_content`, `obsidian_simple_search` | Project documentation in vault |
| **Filesystem** | File operations | `read_file`, `write_file`, `edit_file`, `create_directory` | Local file management |
| **Puppeteer** | Browser automation | `puppeteer_navigate`, `puppeteer_screenshot`, `puppeteer_evaluate` | E2E testing, visual regression |
| **Sequential Thinking** | Problem solving | `sequentialthinking` | Complex architectural decisions |
| **PWC Mindmap** | Mindmap operations | All 17 desktop tools | Testing, validation, migration |

**REQ-MCP-005**: Sub-Agent Utilization
The following specialized sub-agents should be used proactively during development:

- **frontend-developer**: React/Next.js specialist for UI components, state management, performance optimization
- **testing-specialist**: Test automation expert for unit, integration, and E2E tests
- **security-auditor**: Security analysis for Firestore rules, authentication flows
- **api-designer**: REST/GraphQL expert for MCP API design
- **database-architect**: Firestore schema design and query optimization

---

## 5. Non-Functional Requirements

### 5.1 Performance

**REQ-PERF-001**: Load Time
- Initial page load: < 3 seconds on 3G connection
- Mindmap render: < 500ms for 100 nodes
- Operation response: < 100ms for node operations

**REQ-PERF-002**: Rendering
- Maintain 60fps during canvas animations
- No janky scrolling or interactions
- Lazy load images (thumbnails first, full-res on demand)

**REQ-PERF-003**: Scalability
- Support mindmaps with 10,000+ nodes
- Handle 100 concurrent users on same mindmap
- Firestore queries optimized with composite indexes

### 5.2 Security

**REQ-SEC-001**: Authentication Security
- Firebase Authentication handles auth tokens
- Tokens expire after 1 hour, refresh automatically
- Secure HTTP-only cookies for session management

**REQ-SEC-002**: Data Access Control
- Firestore Security Rules enforce permissions
- Users can only read/write mindmaps they own or have permission for
- MCP server validates user identity on every request

**REQ-SEC-003**: Input Validation
- Sanitize all user input (node titles, descriptions, notes)
- Prevent XSS attacks in node content
- Limit file upload sizes and types

**REQ-SEC-004**: API Security
- Rate limiting on MCP API (100 req/min)
- API keys for Unsplash stored securely in Firebase Functions environment
- No sensitive data in client-side code

### 5.3 Reliability

**REQ-REL-001**: Uptime
- Target 99.9% uptime (< 8.76 hours downtime/year)
- Firebase hosting provides global CDN
- Firestore provides automatic replication

**REQ-REL-002**: Data Backup
- Firestore daily automated backups
- Retain backups for 30 days
- Export mindmaps for local backup

**REQ-REL-003**: Error Handling
- Graceful degradation if Firebase unavailable
- Show user-friendly error messages
- Log errors to Firebase Crashlytics

### 5.4 Usability

**REQ-USE-001**: Responsive Design
- Desktop: optimized for 1920x1080, min 1280x800
- Tablet: optimized for iPad (1024x768)
- Mobile: optimized for iPhone (375x667+)

**REQ-USE-002**: Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation for all features
- Screen reader support
- High contrast mode

**REQ-USE-003**: Internationalization
- Support English (en-US) initially
- Architecture supports future localization
- Date/time formatting respects locale

---

## 6. Non-Goals (Out of Scope)

The following features are explicitly **NOT** included in v1.0:

1. **Native Mobile Apps** (iOS/Android)
   - Use responsive web app instead
   - PWA provides app-like experience

2. **Video/Audio Attachments**
   - Images only for v1.0
   - Future enhancement

3. **Advanced Permissions** (Folders, Teams, Organizations)
   - Individual mindmap sharing only
   - No workspace/team management

4. **Integrations** (Slack, Microsoft Teams, Jira, etc.)
   - Claude Code integration only
   - Future integrations in v2.0

5. **Offline-First Architecture**
   - Requires internet connection
   - PWA caching for static assets only

6. **AI-Generated Content** (beyond MCP)
   - No built-in AI features
   - Use Claude Code for AI assistance

7. **Advanced Analytics**
   - No usage analytics dashboard
   - Google Analytics for basic tracking

8. **Custom Themes**
   - PWC-branded theme only
   - No user-customizable themes

---

## 7. Data Model & Schema

### 7.1 Firestore Collections

#### Collection: `users`
```typescript
interface User {
  uid: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: {
    theme: 'light' | 'dark';
    defaultZoom: number;
    autoSave: boolean;
  };
  storageUsed: number;            // Bytes
  mindmapCount: number;
}
```

#### Collection: `mindmaps`
```typescript
interface Mindmap {
  id: string;                     // Auto-generated
  name: string;
  ownerId: string;                // User UID
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;    // Soft delete

  // Content (mirrors desktop .pmap format)
  content: {
    topic: string;
    nodes: Node[];
    categories: Category[];
    relationships: Relationship[];
    connections: Connection[];
    customOrders: Record<string, string[]>;
    nodePositions: Record<string, {x: number, y: number}>;
    focusedNodeId: string | null;

    // Presentation data
    presentation?: {
      slides: Slide[];
    };
  };

  // Metadata
  metadata: {
    version: string;              // e.g., "5.0.0"
    nodeCount: number;
    imageCount: number;
    sizeBytes: number;
  };

  // Permissions
  permissions: {
    public: boolean;              // If true, anyone with link can view
    editors: string[];            // User UIDs with edit permission
    viewers: string[];            // User UIDs with view permission
    commenters: string[];         // User UIDs with comment permission
  };
}
```

#### Subcollection: `mindmaps/{mindmapId}/presence`
```typescript
interface Presence {
  userId: string;
  displayName: string;
  photoURL: string | null;
  cursorPosition: {x: number, y: number} | null;
  editingNodeId: string | null;
  lastSeen: Timestamp;
  color: string;                  // Hex color for cursor
}
```

#### Subcollection: `mindmaps/{mindmapId}/comments` (Phase 2)
```typescript
interface Comment {
  id: string;
  nodeId: string;
  authorId: string;
  authorName: string;
  text: string;
  resolved: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 7.2 Firebase Storage Structure
```
/mindmaps/{mindmapId}/images/
  ├── {nodeId}/
  │   ├── {imageId}_thumb.jpg    # Thumbnail (200x200)
  │   └── {imageId}_full.jpg     # Full size (max 1920x1080)
  └── metadata.json
```

### 7.3 Firestore Security Rules (Simplified)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Mindmaps access control
    match /mindmaps/{mindmapId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.uid in resource.data.permissions.editors ||
        request.auth.uid in resource.data.permissions.viewers ||
        resource.data.permissions.public == true
      );

      allow create: if request.auth != null &&
        request.resource.data.ownerId == request.auth.uid;

      allow update, delete: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        request.auth.uid in resource.data.permissions.editors
      );

      // Presence subcollection
      match /presence/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == userId;
      }
    }
  }
}
```

---

## 8. Technical Architecture

### 8.1 Tech Stack

#### Frontend
| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| **Framework** | React | 18+ | Component-based, large ecosystem, familiar to developers |
| **State Management** | Zustand | 4+ | Lightweight, simpler than Redux, perfect for Firebase |
| **Routing** | React Router | 6+ | Standard for SPA routing |
| **UI Components** | Shadcn/ui | Latest | Accessible, customizable, Tailwind-based |
| **Styling** | Tailwind CSS | 3+ | Utility-first, rapid development, small bundle |
| **Canvas** | Konva.js | 9+ | High-performance canvas rendering, React integration |
| **Firebase SDK** | Firebase JS SDK | 10+ | Official Firebase client library |
| **Build Tool** | Vite | 5+ | Fast dev server, optimized builds |

#### Backend
| Component | Technology | Version | Justification |
|-----------|-----------|---------|---------------|
| **Backend Platform** | Firebase | Latest | Serverless, scalable, managed auth/db/storage |
| **Database** | Cloud Firestore | N/A | Real-time, NoSQL, scalable, offline support |
| **Authentication** | Firebase Auth | N/A | Secure, OAuth providers, session management |
| **Storage** | Cloud Storage | N/A | Scalable file storage for images |
| **Functions** | Cloud Functions | Node 18 | Serverless compute for MCP server, exports |
| **Hosting** | Firebase Hosting | N/A | Global CDN, HTTPS, custom domain support |

#### Development & Testing
| Component | Technology | Version |
|-----------|-----------|---------|
| **Testing Framework** | Vitest | 1+ |
| **Component Testing** | React Testing Library | 14+ |
| **E2E Testing** | Playwright | 1+ |
| **Linter** | ESLint | 8+ |
| **Formatter** | Prettier | 3+ |
| **Type Checking** | TypeScript | 5+ |

### 8.2 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     PWC Mindmap Web v5.0                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         USERS / DEVICES                          │
│                                                                  │
│  Desktop (Chrome, Firefox, Safari, Edge)                        │
│  Tablet (iPad, Android)                                         │
│  Mobile (iPhone, Android)                                       │
│  Claude Code (via MCP)                                          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FIREBASE HOSTING (CDN)                        │
│                                                                  │
│  • React SPA bundle (Vite-built)                                │
│  • Static assets (CSS, fonts, icons)                            │
│  • Service worker (PWA)                                         │
│  • Global CDN distribution                                      │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                    REACT APPLICATION                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  UI Layer (React Components)                               │ │
│  │                                                            │ │
│  │  • MindmapCanvas (Konva.js)                               │ │
│  │  • NodeEditor                                             │ │
│  │  • Toolbar, Sidebar                                       │ │
│  │  • CollaborationPanel                                     │ │
│  │  • ShareModal                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  State Management (Zustand)                                │ │
│  │                                                            │ │
│  │  • authStore (user, login, logout)                        │ │
│  │  • mindmapStore (nodes, operations, sync)                 │ │
│  │  • presenceStore (online users, cursors)                  │ │
│  │  • uiStore (zoom, pan, modals)                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Firebase SDK Integration                                  │ │
│  │                                                            │ │
│  │  • firebase-auth (onAuthStateChanged)                     │ │
│  │  • firebase-firestore (onSnapshot, real-time)             │ │
│  │  • firebase-storage (uploadBytes, getDownloadURL)         │ │
│  │  • firebase-functions (httpsCallable)                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ WebSocket (Firestore onSnapshot)
                             │ HTTPS (Functions API)
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                         FIREBASE BACKEND                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Firebase Authentication                                    │ │
│  │  • Email/Password                                          │ │
│  │  • Google OAuth                                            │ │
│  │  • JWT token management                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cloud Firestore (NoSQL Database)                         │ │
│  │                                                            │ │
│  │  Collections:                                              │ │
│  │  • /users/{userId}                                        │ │
│  │  • /mindmaps/{mindmapId}                                  │ │
│  │  • /mindmaps/{mindmapId}/presence/{userId}                │ │
│  │  • /mindmaps/{mindmapId}/comments/{commentId}             │ │
│  │                                                            │ │
│  │  Features:                                                 │ │
│  │  • Real-time listeners (onSnapshot)                       │ │
│  │  • Composite indexes for queries                          │ │
│  │  • Security Rules enforcement                             │ │
│  │  • Automatic backups                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cloud Storage (File Storage)                             │ │
│  │                                                            │ │
│  │  /mindmaps/{mindmapId}/images/                            │ │
│  │    ├── {nodeId}/{imageId}_thumb.jpg                       │ │
│  │    └── {nodeId}/{imageId}_full.jpg                        │ │
│  │                                                            │ │
│  │  Features:                                                 │ │
│  │  • Automatic image optimization                           │ │
│  │  • CDN distribution                                       │ │
│  │  • Security Rules                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                            │                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Cloud Functions (Serverless Compute)                     │ │
│  │                                                            │ │
│  │  Functions:                                                │ │
│  │  • onMindmapCreate (trigger: onCreate)                    │ │
│  │    └─ Initialize permissions, metadata                     │ │
│  │  • onImageUpload (trigger: onFinalize)                    │ │
│  │    └─ Generate thumbnails, optimize                        │ │
│  │  • mcpCreateMindmap (HTTP callable)                       │ │
│  │    └─ MCP server endpoint                                  │ │
│  │  • mcpAddNode (HTTP callable)                             │ │
│  │  • exportMindmap (HTTP callable)                          │ │
│  │    └─ Generate PDF/PNG export                              │ │
│  │  • cleanupPresence (scheduled: every 5min)                │ │
│  │    └─ Remove stale presence records                        │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                             │
                             │ External API calls
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
│                                                                  │
│  • Unsplash API (image search)                                  │
│  • Firebase Crashlytics (error reporting)                       │
│  • Google Analytics (usage tracking)                            │
└──────────────────────────────────────────────────────────────────┘
```

### 8.3 Real-Time Sync Architecture

```
User A's Browser                    Firestore                   User B's Browser
─────────────────                   ─────────                   ─────────────────

1. User A edits node
   ↓
2. Optimistic UI update
   (show change immediately)
   ↓
3. Write to Firestore
   mindmap.content.nodes[0].title = "New Title"
                                    ↓
                              4. Firestore persists
                              5. Triggers onSnapshot listeners
                                    ↓                                  ↓
                              6. User B's listener fires
                                                                       ↓
                                                                7. User B's UI updates
                                                                   (sees "New Title")

Conflict Resolution:
─────────────────────
If User A and User B edit same node simultaneously:
1. Both write to Firestore
2. Last write wins (Firestore timestamp)
3. Loser's client receives updated value via onSnapshot
4. Show notification: "Another user edited this node"
```

---

## 9. Migration Strategy

### 9.1 Desktop App → Web App Migration Path

**Phase 1: Export from Desktop**
1. Add "Export for Web" button to desktop app (v4.1 update)
2. Generates `.pmapweb` file (JSON with embedded images as Base64)
3. File includes all content, categories, relationships, presentation data

**Phase 2: Import to Web**
1. Web app has "Import from Desktop" feature on signup/onboarding
2. Drag-and-drop `.pmapweb` file or select from file picker
3. Parse JSON and create Firestore documents
4. Upload images to Cloud Storage
5. Show progress indicator during import

**Phase 3: Two-Way Sync (Optional v2.0)**
1. Desktop app can connect to Firebase (requires Firebase SDK integration)
2. User logs in with same account
3. Mindmaps sync bidirectionally
4. Desktop becomes "thick client" for offline use

---

## 10. User Interface Design

### 10.1 Page Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  Header                                                          │
│  [PWC Logo]  My Mindmaps  [+ New]  [Search]  [Avatar▼]         │
└──────────────────────────────────────────────────────────────────┘
│                                                                  │
│  Mindmap List (Home Page)                                       │
│  ┌────────────┬────────────┬────────────┬────────────┐         │
│  │ Card 1     │ Card 2     │ Card 3     │ Card 4     │         │
│  │ [Thumb]    │ [Thumb]    │ [Thumb]    │ [Thumb]    │         │
│  │ Title      │ Title      │ Title      │ Title      │         │
│  │ Modified   │ Modified   │ Modified   │ Modified   │         │
│  └────────────┴────────────┴────────────┴────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  Mindmap Editor                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │ Toolbar [←Back] [Title] [Zoom -/+] [Share] [Collab👥] [⋯]  ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │                   Mindmap Canvas                           │ │
│  │                   (Konva.js)                               │ │
│  │                                                            │ │
│  │         ┌──────┐                                           │ │
│  │         │ Root │                                           │ │
│  │         └───┬──┘                                           │ │
│  │      ┌──────┴────────┐                                     │ │
│  │   ┌──▼──┐        ┌───▼──┐                                 │ │
│  │   │Node1│        │Node2 │                                 │ │
│  │   └─────┘        └──────┘                                 │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Right Panel (Collapsible)                                   ││
│  │ • Categories                                                ││
│  │ • Relationships                                             ││
│  │ • Collaborators (👤 User A, 👤 User B)                     ││
│  └─────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

### 10.2 Key UI Components

**Component List**:
1. **Header** - Logo, navigation, user menu
2. **MindmapList** - Grid of mindmap cards
3. **MindmapCard** - Thumbnail, title, metadata, actions
4. **MindmapEditor** - Main editor page
5. **Toolbar** - Top bar with title, zoom, share, etc.
6. **Canvas** - Konva.js canvas for nodes and connections
7. **NodeComponent** - Individual node (title, actions, info panel)
8. **NodeModal** - Edit modal for node details
9. **ShareModal** - Share settings and permissions
10. **CollaborationPanel** - Online users, presence indicators
11. **Sidebar** - Categories, relationships, settings

---

## 11. Development Phases

### Phase 0: Setup & Foundation (2 weeks)
- Initialize Firebase project
- Set up React + Vite + TypeScript boilerplate
- Configure Firebase SDKs
- Implement authentication (email/password + Google OAuth)
- Deploy basic "Hello World" to Firebase Hosting

### Phase 1: Core Mindmap Engine (4 weeks)
- Implement Firestore schema
- Build mindmap CRUD operations
- Canvas rendering with Konva.js
- Node operations (create, edit, delete, drag)
- Expand/collapse, zoom, pan
- Local state management with Zustand
- Import from desktop `.pmap` format

### Phase 2: Real-Time Collaboration (3 weeks)
- Real-time sync with Firestore onSnapshot
- Presence indicators (online users)
- Cursor tracking
- Conflict resolution
- Share modal and permissions

### Phase 3: Advanced Features (3 weeks)
- Categories and relationships
- Focus mode and presentation mode
- Image upload to Cloud Storage
- Image search (Unsplash API)
- Export to PDF/PNG/SVG

### Phase 4: MCP Server (2 weeks)
- Cloud Functions for MCP endpoints
- Implement 17 MCP tools as HTTP APIs
- Claude Code integration testing
- Rate limiting and security

### Phase 5: Polish & Testing (2 weeks)
- Responsive design (mobile/tablet)
- Accessibility improvements
- Performance optimization
- End-to-end testing
- User acceptance testing

### Phase 6: Launch (1 week)
- Final security audit
- Documentation
- Deploy to production
- Monitor with Firebase Crashlytics & Analytics

**Total Estimated Time**: 17 weeks (~4 months)

---

## 12. Testing Strategy

### 12.1 Unit Tests
- Test all Zustand stores (auth, mindmap, presence)
- Test utility functions (node operations, canvas calculations)
- Test Firestore security rules with emulator
- Target: 80% code coverage

### 12.2 Component Tests
- Test all React components with React Testing Library
- Test user interactions (click, drag, input)
- Test edge cases (empty mindmap, 10,000 nodes)
- Mock Firebase SDK calls

### 12.3 Integration Tests
- Test Firebase integration (Firestore, Auth, Storage)
- Test real-time sync between two clients
- Test MCP server endpoints
- Use Firebase Emulator Suite

### 12.4 End-to-End Tests
- Test complete user flows with Playwright
- Scenarios:
  - Sign up → Create mindmap → Add nodes → Share → Collaborate
  - Import from desktop → Edit → Export
  - Mobile responsive testing
- Run on CI/CD pipeline

### 12.5 Performance Tests
- Load test with 100 concurrent users
- Stress test with 10,000-node mindmap
- Canvas rendering benchmarks (FPS)
- Firestore query performance

### 12.6 Security Tests
- Penetration testing (OWASP Top 10)
- Test Firestore Security Rules
- Test authentication flows
- XSS/CSRF prevention

---

## 13. Deployment & Operations

### 13.1 CI/CD Pipeline

**GitHub Actions Workflow**:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
```

### 13.2 Environments

| Environment | Purpose | URL | Database |
|-------------|---------|-----|----------|
| **Development** | Local testing | localhost:5173 | Emulator |
| **Staging** | Pre-production testing | staging.pwcmindmap.com | Firestore (staging) |
| **Production** | Live users | app.pwcmindmap.com | Firestore (prod) |

### 13.3 Monitoring

**Firebase Crashlytics**:
- Track JavaScript errors
- Monitor crash-free users %
- Alert on critical issues

**Google Analytics**:
- Track page views, user engagement
- Monitor key metrics (mindmap creation, collaboration sessions)
- Funnel analysis (signup → first mindmap → collaboration)

**Firebase Performance Monitoring**:
- Track page load times
- Monitor API response times
- Identify slow queries

---

## 14. Maintenance & Support

### 14.1 Support Channels
- **Email**: support@pwcmindmap.com
- **Documentation**: docs.pwcmindmap.com
- **GitHub Issues**: github.com/griederer/mindmap-web-firebase/issues

### 14.2 Update Strategy
- **Patch releases** (bug fixes): Weekly as needed
- **Minor releases** (new features): Monthly
- **Major releases** (breaking changes): Quarterly

### 14.3 Backup & Recovery
- Firestore automated daily backups (30-day retention)
- User-initiated export to JSON/PDF
- Disaster recovery: restore from backup within 24 hours

---

## 15. Success Criteria

### 15.1 Launch Readiness Checklist

**Functionality**:
- [ ] All core features implemented (node CRUD, canvas, collaboration)
- [ ] Import from desktop app works
- [ ] Export to PDF/PNG/SVG works
- [ ] MCP server integration functional
- [ ] Real-time sync < 100ms latency

**Performance**:
- [ ] Initial load < 3 seconds
- [ ] Canvas 60fps on 100-node mindmap
- [ ] Handles 100 concurrent users per mindmap
- [ ] Mobile responsive (tested on iOS/Android)

**Security**:
- [ ] Firestore Security Rules enforced
- [ ] Authentication working (email + Google OAuth)
- [ ] API rate limiting active
- [ ] XSS/CSRF protections in place

**Testing**:
- [ ] 80% unit test coverage
- [ ] All E2E scenarios passing
- [ ] Security audit completed
- [ ] Load testing completed

**Operations**:
- [ ] CI/CD pipeline deployed
- [ ] Monitoring active (Crashlytics, Analytics)
- [ ] Backup strategy verified
- [ ] Documentation published

### 15.2 Post-Launch Metrics (First 3 Months)

| Metric | Target | Status |
|--------|--------|--------|
| Active users | 1,000 | TBD |
| Mindmaps created | 5,000 | TBD |
| Collaboration sessions | 500 | TBD |
| Average session duration | 15 minutes | TBD |
| User retention (Week 1) | 40% | TBD |
| Crash-free users | 99.5% | TBD |
| Average load time | < 3 seconds | TBD |
| Customer satisfaction | 4.5/5 stars | TBD |

---

## 16. Open Questions & Decisions Needed

### 16.1 Technical Decisions

**Q1**: Should we use Firestore or Realtime Database for presence?
- **Option A**: Firestore (more features, easier queries, but slightly slower for real-time)
- **Option B**: Realtime Database (faster real-time updates, but limited queries)
- **Recommendation**: Start with Firestore, migrate presence to Realtime DB if latency becomes an issue

**Q2**: How to handle very large mindmaps (10,000+ nodes)?
- **Option A**: Pagination/lazy loading (load visible nodes only)
- **Option B**: Virtualization (render only visible portion of canvas)
- **Recommendation**: Implement both (lazy load from Firestore + virtualize canvas)

**Q3**: Pricing model for web app?
- **Option A**: Free for all (funded by PWC)
- **Option B**: Freemium (free for 5 mindmaps, paid for unlimited)
- **Option C**: Per-user licensing (enterprise model)
- **Decision**: TBD by product owner

**Q4**: Should we support offline mode?
- **Tradeoff**: Complex implementation vs. user benefit
- **Recommendation**: Phase 2 feature (use Firestore offline persistence)

### 16.2 Design Decisions

**Q5**: Should mobile have a simplified UI or full desktop features?
- **Recommendation**: Simplified UI for mobile (view/comment only, edit on tablet/desktop)

**Q6**: How many collaborators per mindmap?
- **Recommendation**: Start with 10, monitor performance, scale to 50 if needed

---

## 17. Risks & Mitigation

### 17.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Firestore scaling issues** | Medium | High | Load test early, implement pagination, use composite indexes |
| **Real-time latency problems** | Low | High | Use Firestore onSnapshot optimizations, consider Realtime DB for presence |
| **Canvas performance on mobile** | Medium | Medium | Implement virtualization, reduce node complexity on mobile |
| **Security vulnerabilities** | Low | Critical | Security audit, penetration testing, use Firebase Security Rules |
| **Firebase cost overruns** | Medium | Medium | Monitor usage, implement quota limits per user |

### 17.2 Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Low user adoption** | Medium | High | Marketing campaign, user onboarding, free trial |
| **Users prefer desktop app** | Low | Medium | Offer both options, highlight web benefits (collaboration) |
| **Competition from Miro/Mural** | High | Medium | Focus on PWC-specific features, AI integration, simplicity |
| **Data privacy concerns** | Low | High | GDPR compliance, data encryption, clear privacy policy |

---

## 18. Dependencies & Assumptions

### 18.1 Dependencies
- Firebase project created and configured
- Unsplash API key for image search
- PWC branding assets (logo, colors, fonts)
- Domain name registered (app.pwcmindmap.com)
- SSL certificate configured

### 18.2 Assumptions
- Users have modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Users have stable internet connection (not offline-first)
- Average mindmap size: 50-200 nodes
- Average concurrent collaborators: 2-5 per mindmap
- Firebase free tier sufficient for initial testing

---

## 19. Appendix

### 19.1 Glossary

| Term | Definition |
|------|------------|
| **Node** | A single element in the mindmap (e.g., "Cloud Security") |
| **Canvas** | The HTML5 Canvas element used for rendering connections |
| **MCP** | Model Context Protocol - enables Claude Code integration |
| **Presence** | Real-time indicators showing online users and their cursors |
| **Firestore** | Firebase's NoSQL cloud database |
| **Konva.js** | JavaScript library for canvas-based rendering |
| **Zustand** | Lightweight state management library for React |

### 19.2 References

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Konva.js Documentation](https://konvajs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [PWC Mindmap Desktop App README](https://github.com/griederer/mindmap-macos-app/blob/main/README.md)

### 19.3 Contact Information

- **Product Owner**: Gonzalo Riederer (gonzaloriederer@gmail.com)
- **Technical Lead**: TBD
- **Designer**: TBD
- **QA Lead**: TBD

---

**Document Version**: 1.0.0
**Last Updated**: October 10, 2025
**Next Review**: November 10, 2025
**Status**: Ready for Task Generation
