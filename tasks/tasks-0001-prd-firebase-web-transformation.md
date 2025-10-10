# Task List: MyMindmap - Firebase Web Transformation

**PRD**: [0001-prd-firebase-web-transformation.md](0001-prd-firebase-web-transformation.md)
**Version**: 1.0.0
**Created**: October 10, 2025
**Status**: Ready for Implementation

---

## Relevant Files

This section will be updated as implementation progresses.

### Core Files (To Be Created)
- `src/App.tsx` - Main React application entry
- `src/stores/authStore.ts` - Authentication state management
- `src/stores/mindmapStore.ts` - Mindmap data and operations
- `src/stores/presenceStore.ts` - Real-time collaboration state
- `src/components/MindmapCanvas.tsx` - Konva.js canvas component
- `src/components/NodeComponent.tsx` - Individual node rendering
- `src/lib/firebase.ts` - Firebase SDK initialization
- `firestore.rules` - Firestore Security Rules
- `storage.rules` - Cloud Storage Security Rules
- `functions/src/index.ts` - Cloud Functions entry point

### Test Files (To Be Created)
- `src/__tests__/authStore.test.ts` - Authentication tests
- `src/__tests__/mindmapStore.test.ts` - Mindmap operations tests
- `tests/e2e/collaboration.spec.ts` - E2E collaboration tests
- `tests/e2e/mindmap-crud.spec.ts` - E2E CRUD tests

### Configuration Files
- `vite.config.ts` - Vite build configuration
- `firebase.json` - Firebase project configuration
- `.firebaserc` - Firebase project aliases
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration

---

## Parent Tasks

Below are the high-level tasks (1.0, 2.0, etc.) that will be broken down into sub-tasks:

### Phase 0: Setup & Foundation

- [x] 1.0 Initialize project and Firebase configuration
- [x] 2.0 Set up React + Vite + TypeScript boilerplate
- [ ] 3.0 Implement Firebase Authentication

### Phase 1: Core Mindmap Engine

- [ ] 4.0 Design and implement Firestore schema
- [ ] 5.0 Build mindmap CRUD operations
- [ ] 6.0 Implement Canvas rendering with Konva.js
- [ ] 7.0 Build node operations (create, edit, delete, drag)
- [ ] 8.0 Implement expand/collapse, zoom, and pan
- [ ] 9.0 Build state management with Zustand
- [ ] 10.0 Implement import from desktop .pmap format

### Phase 2: Real-Time Collaboration

- [ ] 11.0 Implement real-time sync with Firestore onSnapshot
- [ ] 12.0 Build presence system (online users, cursors)
- [ ] 13.0 Implement share modal and permissions
- [ ] 14.0 Handle conflict resolution

### Phase 3: Advanced Features

- [ ] 15.0 Implement categories system
- [ ] 16.0 Implement relationships system
- [ ] 17.0 Build focus mode and presentation mode
- [ ] 18.0 Implement image upload to Cloud Storage
- [ ] 19.0 Integrate Unsplash API for image search
- [ ] 20.0 Build export functionality (PDF, PNG, SVG)

### Phase 4: MCP Server

- [ ] 21.0 Set up Cloud Functions for MCP endpoints
- [ ] 22.0 Implement 17 MCP tools as HTTP APIs
- [ ] 23.0 Add authentication and rate limiting
- [ ] 24.0 Test Claude Code integration

### Phase 5: Polish & Testing

- [ ] 25.0 Implement responsive design (mobile/tablet)
- [ ] 26.0 Add accessibility improvements
- [ ] 27.0 Optimize performance
- [ ] 28.0 Write comprehensive tests
- [ ] 29.0 Conduct user acceptance testing

### Phase 6: Launch

- [ ] 30.0 Security audit and hardening
- [ ] 31.0 Write documentation
- [ ] 32.0 Set up monitoring and analytics
- [ ] 33.0 Deploy to production

---

## Notes

- **Testing approach**: Test-Driven Development (TDD) - write tests before marking tasks complete
- **Task execution**: One sub-task at a time with approval gates
- **Package manager**: Auto-detect (npm/yarn/pnpm)
- **Test framework**: Vitest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions for automated testing and deployment

---

## Sub-Tasks

### Phase 0: Setup & Foundation

#### Task 1.0: Initialize project and Firebase configuration

- [ ] 1.1 Create Firebase project in console (mymindmap)
  - Navigate to https://console.firebase.google.com
  - Click "Add project"
  - Name: "MyMindmap"
  - Enable Google Analytics: Yes
  - Select Analytics location: United States
  - Accept terms and create project

- [ ] 1.2 Install Firebase CLI and login
  - Run: `npm install -g firebase-tools`
  - Run: `firebase login`
  - Verify: `firebase projects:list` shows new project

- [ ] 1.3 Initialize Firebase in project directory
  - Run: `firebase init` in `/Users/gonzaloriederer/Documents/GitHub/mindmap-web-firebase`
  - Select: Hosting, Firestore, Storage, Functions
  - Use existing project: mymindmap
  - Firestore rules: `firestore.rules`
  - Storage rules: `storage.rules`
  - Functions language: TypeScript
  - Public directory: `dist`
  - Single-page app: Yes

- [ ] 1.4 Configure Firebase Authentication
  - In Firebase Console → Authentication → Sign-in method
  - Enable Email/Password provider
  - Enable Google OAuth provider
  - Add authorized domain: localhost (for development)

- [ ] 1.5 Create Firestore database
  - In Firebase Console → Firestore Database
  - Click "Create database"
  - Start in production mode (we'll add rules in 4.1)
  - Location: us-east1 (or closest to users)

- [ ] 1.6 Create Cloud Storage bucket
  - In Firebase Console → Storage
  - Click "Get started"
  - Start in production mode
  - Location: us-east1 (same as Firestore)

- [ ] 1.7 Save Firebase configuration
  - In Firebase Console → Project settings → Your apps
  - Click "Add app" → Web (</>)
  - Register app name: "MyMindmap"
  - Copy config object
  - Create `src/lib/firebase.ts` with config (will be created in 2.4)

- [ ] 1.8 Write tests for Firebase initialization
  - Create `src/__tests__/firebase.test.ts`
  - Test: Firebase app initializes successfully
  - Test: Auth instance is available
  - Test: Firestore instance is available
  - Test: Storage instance is available
  - Run: `npm test` (all tests pass)

**Files Created**: `firebase.json`, `.firebaserc`, `firestore.rules`, `storage.rules`, `functions/src/index.ts`

---

#### Task 2.0: Set up React + Vite + TypeScript boilerplate

- [ ] 2.1 Initialize Vite React TypeScript project
  - Run: `npm create vite@latest . -- --template react-ts`
  - Confirm: Overwrite existing files (if any)
  - Run: `npm install`
  - Verify: `npm run dev` starts dev server at http://localhost:5173

- [ ] 2.2 Install core dependencies
  - React ecosystem: `npm install react-router-dom zustand`
  - UI components: `npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu lucide-react`
  - Canvas: `npm install konva react-konva`
  - Firebase: `npm install firebase`
  - Utilities: `npm install clsx tailwind-merge date-fns`

- [ ] 2.3 Install dev dependencies
  - Testing: `npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
  - E2E testing: `npm install -D @playwright/test`
  - Linting: `npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`
  - Formatting: `npm install -D prettier eslint-config-prettier eslint-plugin-prettier`
  - Type checking: Verify TypeScript is installed

- [ ] 2.4 Configure Tailwind CSS
  - Install: `npm install -D tailwindcss postcss autoprefixer`
  - Run: `npx tailwindcss init -p`
  - Update `tailwind.config.js` content paths: `["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`
  - Create `src/index.css` with Tailwind directives

- [ ] 2.5 Set up project structure
  - Create directories:
    - `src/components/` - React components
    - `src/stores/` - Zustand stores
    - `src/lib/` - Utility functions and configs
    - `src/types/` - TypeScript type definitions
    - `src/pages/` - Page components
    - `src/__tests__/` - Test files
    - `tests/e2e/` - Playwright E2E tests

- [ ] 2.6 Configure Vitest
  - Create `vitest.config.ts`
  - Configure: jsdom environment, setupFiles, coverage
  - Create `src/__tests__/setup.ts` with Testing Library setup
  - Add scripts to `package.json`: `"test": "vitest"`, `"test:ui": "vitest --ui"`, `"test:coverage": "vitest --coverage"`

- [ ] 2.7 Configure ESLint and Prettier
  - Create `.eslintrc.json` with React + TypeScript rules
  - Create `.prettierrc.json` with formatting rules
  - Add scripts: `"lint": "eslint src --ext ts,tsx"`, `"format": "prettier --write \"src/**/*.{ts,tsx}\"`

- [ ] 2.8 Configure TypeScript
  - Update `tsconfig.json` with strict settings
  - Enable: strict, noImplicitAny, strictNullChecks, noUnusedLocals, noUnusedParameters
  - Add path aliases: `"@/*": ["./src/*"]`

- [ ] 2.9 Create initial Firebase configuration
  - Create `src/lib/firebase.ts`
  - Import Firebase SDK modules
  - Initialize Firebase app with config from 1.7
  - Export: auth, db (Firestore), storage instances
  - Add type definitions in `src/types/firebase.ts`

- [ ] 2.10 Write tests for project setup
  - Create `src/__tests__/app.test.tsx`
  - Test: App component renders without crashing
  - Test: Tailwind CSS is loaded (check for style attributes)
  - Test: TypeScript types are enforced
  - Run: `npm test` (all tests pass)

- [ ] 2.11 Set up Playwright for E2E tests
  - Run: `npx playwright install`
  - Create `playwright.config.ts`
  - Configure: base URL, browsers (chromium, firefox, webkit)
  - Create `tests/e2e/example.spec.ts` (basic smoke test)
  - Run: `npx playwright test` (verify setup works)

- [ ] 2.12 Verify development workflow
  - Run: `npm run dev` → Dev server starts
  - Run: `npm test` → Unit tests pass
  - Run: `npm run lint` → No linting errors
  - Run: `npm run format` → Code formatted
  - Run: `npx playwright test` → E2E tests pass
  - Commit changes with: `git add . && git commit -m "feat: set up React + Vite + TypeScript boilerplate"`

**Files Created**: `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `tailwind.config.js`, `postcss.config.js`, `.eslintrc.json`, `.prettierrc.json`, `src/lib/firebase.ts`, `src/types/firebase.ts`, `src/__tests__/setup.ts`, `tests/e2e/example.spec.ts`

---

#### Task 3.0: Implement Firebase Authentication

- [ ] 3.1 Create authentication types
  - Create `src/types/auth.ts`
  - Define: `User` interface (uid, email, displayName, photoURL)
  - Define: `AuthState` interface (user, loading, error)
  - Define: `AuthContextType` interface (login, logout, signup, etc.)

- [ ] 3.2 Create authentication service
  - Create `src/lib/auth.ts`
  - Implement: `signUpWithEmail(email, password)`
  - Implement: `loginWithEmail(email, password)`
  - Implement: `loginWithGoogle()`
  - Implement: `logout()`
  - Implement: `sendPasswordResetEmail(email)`
  - Implement: `updateUserProfile(displayName, photoURL)`
  - Add error handling for all methods

- [ ] 3.3 Create authentication store with Zustand
  - Create `src/stores/authStore.ts`
  - State: user, loading, error
  - Actions: login, logout, signup, resetPassword
  - Use Firebase `onAuthStateChanged` to sync state
  - Persist user to localStorage (optional)

- [ ] 3.4 Write tests for authentication service
  - Create `src/__tests__/auth.test.ts`
  - Mock Firebase Auth methods
  - Test: signUpWithEmail creates user
  - Test: loginWithEmail authenticates user
  - Test: loginWithGoogle opens OAuth popup
  - Test: logout clears session
  - Test: Error handling for invalid credentials
  - Run: `npm test` (all tests pass)

- [ ] 3.5 Create Login page component
  - Create `src/pages/Login.tsx`
  - Form fields: email, password
  - Button: "Sign in with Email"
  - Button: "Sign in with Google"
  - Link: "Forgot password?"
  - Link: "Don't have an account? Sign up"
  - Use authStore for login actions
  - Show loading state during authentication
  - Show error messages for failed login

- [ ] 3.6 Create Signup page component
  - Create `src/pages/Signup.tsx`
  - Form fields: email, password, confirm password
  - Password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 number
  - Button: "Sign up with Email"
  - Button: "Sign up with Google"
  - Link: "Already have an account? Log in"
  - Use authStore for signup actions

- [ ] 3.7 Create ForgotPassword page
  - Create `src/pages/ForgotPassword.tsx`
  - Form field: email
  - Button: "Send reset link"
  - Success message: "Check your email for reset instructions"
  - Use auth service `sendPasswordResetEmail`

- [ ] 3.8 Create ProtectedRoute component
  - Create `src/components/ProtectedRoute.tsx`
  - Check if user is authenticated (from authStore)
  - If not authenticated, redirect to /login
  - If authenticated, render children
  - Show loading spinner while checking auth state

- [ ] 3.9 Set up routing with React Router
  - Create `src/App.tsx` with router configuration
  - Routes:
    - `/` → Home (ProtectedRoute) → MindmapList page
    - `/login` → Login page
    - `/signup` → Signup page
    - `/forgot-password` → ForgotPassword page
    - `/mindmap/:id` → MindmapEditor page (ProtectedRoute)
  - Add `BrowserRouter` in `src/main.tsx`

- [ ] 3.10 Write component tests for auth pages
  - Create `src/__tests__/Login.test.tsx`
  - Test: Login form renders correctly
  - Test: Email/password submission calls authStore.login
  - Test: Google login button calls loginWithGoogle
  - Test: Error message displays on failed login
  - Create similar tests for Signup and ForgotPassword
  - Run: `npm test` (all tests pass)

- [ ] 3.11 Create user profile page
  - Create `src/pages/Profile.tsx`
  - Display: user email, display name, join date
  - Form: update display name and avatar
  - Button: "Save changes"
  - Button: "Log out"
  - Button: "Delete account" (with confirmation modal)

- [ ] 3.12 Write E2E tests for authentication flow
  - Create `tests/e2e/auth.spec.ts`
  - Test: User can sign up with email/password
  - Test: User can log in with email/password
  - Test: User can log out
  - Test: User cannot access protected routes when logged out
  - Test: Password reset email is sent
  - Run: `npx playwright test` (all E2E tests pass)

- [ ] 3.13 Verify authentication works end-to-end
  - Start dev server: `npm run dev`
  - Test signup flow manually
  - Test login flow manually
  - Test logout flow manually
  - Check Firebase Console → Authentication → Users (see created users)
  - Commit changes: `git add . && git commit -m "feat: implement Firebase Authentication"`

**Files Created**: `src/types/auth.ts`, `src/lib/auth.ts`, `src/stores/authStore.ts`, `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/pages/ForgotPassword.tsx`, `src/pages/Profile.tsx`, `src/components/ProtectedRoute.tsx`, `src/__tests__/auth.test.ts`, `src/__tests__/Login.test.tsx`, `tests/e2e/auth.spec.ts`

---

### Phase 1: Core Mindmap Engine

#### Task 4.0: Design and implement Firestore schema

- [ ] 4.1 Create Firestore Security Rules
  - Edit `firestore.rules`
  - Add rules for `/users/{userId}` collection (read/write own profile only)
  - Add rules for `/mindmaps/{mindmapId}` collection (owner + editors/viewers permissions)
  - Add rules for `/mindmaps/{mindmapId}/presence/{userId}` (read all, write own)
  - Add rules for `/mindmaps/{mindmapId}/comments/{commentId}` (authenticated users only)
  - Test rules with Firebase Emulator

- [ ] 4.2 Define TypeScript types for Firestore schema
  - Create `src/types/mindmap.ts`
  - Define: `Node` interface (id, title, description, notes, level, parentId, images, etc.)
  - Define: `Category` interface (id, name, color)
  - Define: `Relationship` interface (id, name, color, dashPattern)
  - Define: `Connection` interface (id, fromNodeId, toNodeId, relationshipId)
  - Define: `Mindmap` interface (matches PRD section 7.1)
  - Define: `Presence` interface
  - Define: `Comment` interface

- [ ] 4.3 Create Firestore utility functions
  - Create `src/lib/firestore.ts`
  - Function: `createDocument<T>(collection, data)` → returns document ID
  - Function: `getDocument<T>(collection, id)` → returns document data
  - Function: `updateDocument<T>(collection, id, data)` → void
  - Function: `deleteDocument(collection, id)` → void
  - Function: `queryCollection<T>(collection, ...queries)` → returns array
  - Function: `subscribeToDocument<T>(collection, id, callback)` → unsubscribe function
  - Add error handling and type safety

- [ ] 4.4 Write tests for Firestore Security Rules
  - Create `src/__tests__/firestore-rules.test.ts`
  - Use Firebase Emulator for testing
  - Test: Users can read/write their own profile
  - Test: Users cannot read other users' profiles
  - Test: Users can read mindmaps they own or have permission for
  - Test: Users cannot edit mindmaps without permission
  - Test: Public mindmaps are readable by anyone
  - Run: `npm test` (all tests pass)

- [ ] 4.5 Create Firestore indexes configuration
  - Create `firestore.indexes.json`
  - Add composite index: mindmaps collection (ownerId ASC, updatedAt DESC)
  - Add composite index: mindmaps collection (permissions.editors ARRAY, updatedAt DESC)
  - Deploy indexes: `firebase deploy --only firestore:indexes`

- [ ] 4.6 Create Cloud Storage Security Rules
  - Edit `storage.rules`
  - Rules: Users can upload images to their own mindmaps only
  - Rules: Image size limit: 5MB per file
  - Rules: Allowed file types: image/jpeg, image/png, image/webp
  - Rules: Users can read images from mindmaps they have access to

- [ ] 4.7 Write tests for Cloud Storage Rules
  - Create `src/__tests__/storage-rules.test.ts`
  - Test: Users can upload images to their mindmaps
  - Test: Users cannot upload images to others' mindmaps
  - Test: File size validation works
  - Test: File type validation works
  - Run: `npm test` (all tests pass)

- [ ] 4.8 Deploy Firestore and Storage rules
  - Run: `firebase deploy --only firestore:rules`
  - Run: `firebase deploy --only storage:rules`
  - Verify deployment in Firebase Console

- [ ] 4.9 Test schema with sample data
  - Create `src/__tests__/schema.test.ts`
  - Create sample mindmap document in Firestore Emulator
  - Verify all fields match TypeScript types
  - Test: Create, read, update, delete operations
  - Test: Permissions enforcement
  - Run: `npm test` (all tests pass)
  - Commit changes: `git add . && git commit -m "feat: implement Firestore schema and security rules"`

**Files Created**: `firestore.rules`, `storage.rules`, `firestore.indexes.json`, `src/types/mindmap.ts`, `src/lib/firestore.ts`, `src/__tests__/firestore-rules.test.ts`, `src/__tests__/storage-rules.test.ts`, `src/__tests__/schema.test.ts`

---

#### Task 5.0: Build mindmap CRUD operations

- [ ] 5.1 Create mindmap store with Zustand
  - Create `src/stores/mindmapStore.ts`
  - State: currentMindmap, mindmaps (list), loading, error
  - Actions: createMindmap, loadMindmap, updateMindmap, deleteMindmap, listMindmaps
  - Use Firestore subscriptions for real-time updates

- [ ] 5.2 Implement createMindmap operation
  - Function signature: `createMindmap(name: string, template?: string)`
  - Create Firestore document in `/mindmaps` collection
  - Set ownerId to current user UID
  - Initialize empty content structure
  - Set default permissions (owner only)
  - Return mindmap ID
  - Add to mindmapStore state

- [ ] 5.3 Implement loadMindmap operation
  - Function signature: `loadMindmap(id: string)`
  - Fetch document from `/mindmaps/{id}`
  - Check user has permission to access
  - Subscribe to real-time updates with `onSnapshot`
  - Update mindmapStore.currentMindmap
  - Handle errors (not found, permission denied)

- [ ] 5.4 Implement updateMindmap operation
  - Function signature: `updateMindmap(id: string, updates: Partial<Mindmap>)`
  - Use Firestore `updateDoc` to save changes
  - Optimistic update: update local state immediately
  - If Firestore update fails, rollback local state
  - Update `updatedAt` timestamp
  - Merge updates with existing document

- [ ] 5.5 Implement deleteMindmap operation
  - Function signature: `deleteMindmap(id: string, permanent?: boolean)`
  - Soft delete: set `deletedAt` timestamp (default)
  - Permanent delete: delete document from Firestore (if permanent=true)
  - Remove from mindmapStore.mindmaps list
  - Show confirmation modal before delete

- [ ] 5.6 Implement listMindmaps operation
  - Function signature: `listMindmaps(filter?: 'all' | 'owned' | 'shared')`
  - Query Firestore for mindmaps where user is owner or has permission
  - Sort by `updatedAt` DESC
  - Filter out soft-deleted mindmaps (deletedAt is null)
  - Store in mindmapStore.mindmaps
  - Support pagination (load 20 at a time)

- [ ] 5.7 Write tests for mindmap CRUD operations
  - Create `src/__tests__/mindmapStore.test.ts`
  - Mock Firestore methods
  - Test: createMindmap creates document and returns ID
  - Test: loadMindmap fetches and subscribes to document
  - Test: updateMindmap saves changes optimistically
  - Test: deleteMindmap soft-deletes document
  - Test: listMindmaps returns user's mindmaps
  - Test: Error handling for permission denied
  - Run: `npm test` (all tests pass)

- [ ] 5.8 Create MindmapList page component
  - Create `src/pages/MindmapList.tsx`
  - Display grid of mindmap cards
  - Each card shows: thumbnail, title, last modified date
  - Button: "+ New Mindmap"
  - Search bar for filtering mindmaps
  - Dropdown: Sort by (name, date modified, date created)
  - Use mindmapStore.listMindmaps on mount

- [ ] 5.9 Create MindmapCard component
  - Create `src/components/MindmapCard.tsx`
  - Props: mindmap (id, name, updatedAt, thumbnail)
  - Click on card → navigate to `/mindmap/:id`
  - Context menu: Edit, Duplicate, Delete, Share
  - Show owner avatar if shared mindmap
  - Show loading skeleton while mindmaps load

- [ ] 5.10 Create NewMindmapModal component
  - Create `src/components/NewMindmapModal.tsx`
  - Form field: Mindmap name (default: "Untitled Mindmap")
  - Template selector: Blank, Business, Project, SWOT
  - Button: "Create"
  - Button: "Cancel"
  - On create: call mindmapStore.createMindmap
  - Navigate to new mindmap on success

- [ ] 5.11 Write component tests for MindmapList and MindmapCard
  - Create `src/__tests__/MindmapList.test.tsx`
  - Test: MindmapList renders list of mindmaps
  - Test: Clicking card navigates to mindmap editor
  - Test: "New Mindmap" button opens modal
  - Test: Search filters mindmaps
  - Create `src/__tests__/MindmapCard.test.tsx`
  - Test: MindmapCard renders title and date
  - Test: Context menu shows actions
  - Run: `npm test` (all tests pass)

- [ ] 5.12 Write E2E tests for mindmap CRUD
  - Create `tests/e2e/mindmap-crud.spec.ts`
  - Test: User can create a new mindmap
  - Test: User can view list of mindmaps
  - Test: User can open an existing mindmap
  - Test: User can delete a mindmap
  - Test: Deleted mindmap is moved to trash
  - Run: `npx playwright test` (all E2E tests pass)

- [ ] 5.13 Verify CRUD operations work end-to-end
  - Start dev server: `npm run dev`
  - Log in as test user
  - Create new mindmap manually
  - Check Firestore console (see new document created)
  - Edit mindmap name
  - Check Firestore console (see updated document)
  - Delete mindmap
  - Check Firestore console (see deletedAt field set)
  - Commit changes: `git add . && git commit -m "feat: implement mindmap CRUD operations"`

**Files Created**: `src/stores/mindmapStore.ts`, `src/pages/MindmapList.tsx`, `src/components/MindmapCard.tsx`, `src/components/NewMindmapModal.tsx`, `src/__tests__/mindmapStore.test.ts`, `src/__tests__/MindmapList.test.tsx`, `src/__tests__/MindmapCard.test.tsx`, `tests/e2e/mindmap-crud.spec.ts`

---

*[Continuing with remaining 28 parent tasks... This response is getting long. Should I continue with all sub-tasks or would you like me to commit this first batch and then continue?]*

---

**Status**: Sub-task generation in progress. Currently showing Phase 0 (Tasks 1.0-3.0) and Phase 1 start (Tasks 4.0-5.0) with detailed sub-tasks.

**Next steps**:
1. Continue generating sub-tasks for Tasks 6.0-33.0
2. Commit task list to repository
3. Wait for user approval to begin implementation
