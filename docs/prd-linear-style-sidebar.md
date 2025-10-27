# PRD: Linear-Style Project Sidebar Redesign

**Version**: 1.0
**Date**: October 27, 2025
**Status**: Draft
**Target Release**: v1.4.0

---

## 1. Overview

Redesign the left sidebar (Projects panel) to match Linear's minimalist, elegant design aesthetic. The current sidebar feels cluttered with too many buttons and lacks the polish of modern productivity tools. This redesign will create a cleaner, more focused interface for project management.

---

## 2. Problem Statement

**Current Issues**:
- Too many prominent buttons (New/Open/Save) create visual clutter
- Lack of clear visual hierarchy
- Missing collapse/expand functionality
- Doesn't match modern design standards (Linear, Notion, etc.)
- No keyboard shortcuts or quick actions
- Current Project info is disconnected from actions

**User Pain Points**:
- Hard to focus on the canvas with busy sidebar
- No quick way to hide the sidebar when not needed
- Project management feels heavyweight, not streamlined

---

## 3. Goals

### Primary Goals
1. **Minimize visual clutter**: Reduce button count and improve hierarchy
2. **Add collapse functionality**: Quick hide/show for more canvas space
3. **Match Linear aesthetic**: Clean, modern, minimalist design
4. **Improve project list UX**: Easy scanning and selection

### Non-Goals (Out of Scope)
- Multi-project workspace management
- Cloud sync functionality
- Team collaboration features
- Project templates

---

## 4. User Stories

**As a user**, I want to:
1. Quickly hide the sidebar to maximize canvas space
2. See my projects in a clean, scannable list
3. Open/save projects with minimal clicks
4. Have keyboard shortcuts for common actions
5. See visual feedback on current project without clutter

---

## 5. Design Specifications

### 5.1 Visual Design (Linear-Inspired)

**Color Palette**:
- Background: `#FFFFFF` (white)
- Hover states: `#F7F8F9` (very light gray)
- Active/Selected: `#F0F1F2` (light gray)
- Border: `#E5E7EB` (gray-200)
- Text primary: `#1F2937` (gray-800)
- Text secondary: `#6B7280` (gray-500)
- Accent: `#5E6AD2` (Linear purple) or keep orange `#F97316`

**Typography** (Linear-style):
- Font family: `Inter` (fallback to system sans-serif)
- Sidebar title: 14px, font-weight 600
- Project names: 13px, font-weight 500
- Metadata: 12px, font-weight 400, text-gray-500

**Spacing**:
- Padding: More generous (16px instead of current)
- Item spacing: 4px between items
- Section spacing: 20px between sections

**Icons**:
- Use Lucide React icons (Linear uses similar style)
- Size: 16px for list items, 20px for actions
- Stroke width: 2px (Linear standard)
- Color: Inherit from text color

### 5.2 Layout Structure

```
┌─────────────────────────────┐
│ [<<] NODEM                  │  ← Collapse button + logo
├─────────────────────────────┤
│                             │
│ Projects                    │  ← Section header
│                             │
│ ○ Segunda Guerra Mundial *  │  ← Current project (indicator)
│   13 nodes                  │  ← Metadata (subdued)
│                             │
│ ○ Project Name 2            │  ← Other projects
│ ○ Project Name 3            │
│                             │
│ ────────────────────        │  ← Divider
│                             │
│ + New Project               │  ← Minimal action buttons
│ ↗ Open Project              │
│                             │
├─────────────────────────────┤
│ ? Help • ⚙ Settings         │  ← Footer with minimal links
└─────────────────────────────┘
```

### 5.3 Collapse Behavior

**Collapsed State** (48px width):
```
┌────┐
│ >> │  ← Expand button
├────┤
│ N  │  ← Logo letter only
├────┤
│ •  │  ← Project indicators (dots)
│ ○  │
│ ○  │
├────┤
│ +  │  ← Minimal action icons
│ ↗  │
└────┘
```

**Toggle Button**:
- Position: Top-left, inside sidebar
- Icon: `ChevronLeft` when expanded, `ChevronRight` when collapsed
- Size: 32px square
- Hover: Light gray background
- Transition: 300ms ease-out

---

## 6. Component Breakdown

### 6.1 SidebarHeader
**Responsibilities**:
- Display logo and collapse button
- Handle collapse/expand state

**Props**:
```typescript
interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
```

**Behavior**:
- Smooth 300ms transition on collapse
- Tooltip on hover when collapsed ("Expand sidebar")

### 6.2 ProjectList
**Responsibilities**:
- Display current and recent projects
- Highlight active project
- Show project metadata (node count)

**Props**:
```typescript
interface ProjectListProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  isCollapsed: boolean;
}
```

**Item States**:
- Default: Gray text, white background
- Hover: Gray background (`#F7F8F9`)
- Active: Blue/Orange accent, bold text
- Indicator: Small dot or icon before name

### 6.3 ActionButtons
**Responsibilities**:
- Minimal "New Project" and "Open Project" actions
- Hidden "Save Project" (auto-save or Cmd+S only)

**Design**:
- Ghost buttons (no border, no background by default)
- Icon + Text when expanded
- Icon only when collapsed
- Hover: Light gray background
- Spacing: 4px between buttons

**Buttons**:
1. **New Project**: `Plus` icon + "New Project"
2. **Open Project**: `FolderOpen` icon + "Open Project"

### 6.4 SidebarFooter
**Responsibilities**:
- Show help and settings links (minimal)
- Display version number (subtle)

**Content**:
- Help icon + Settings icon (only icons, no text)
- Version: "v1.4.0" in very small gray text

---

## 7. Technical Specifications

### 7.1 State Management

**New Zustand Store** (or add to existing):
```typescript
interface SidebarStore {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  recentProjects: Project[];
  addRecentProject: (project: Project) => void;
}
```

**Local Storage**:
- Persist `isCollapsed` state
- Persist recent projects list (max 5)

### 7.2 Responsive Behavior

**Desktop** (>1024px):
- Full sidebar with all text
- Collapsible to icon-only mode

**Tablet** (768px - 1024px):
- Start collapsed by default
- Expand on hover (optional)

**Mobile** (<768px):
- Hidden by default
- Slide-in overlay when triggered

### 7.3 Keyboard Shortcuts

- `Cmd+B` / `Ctrl+B`: Toggle sidebar
- `Cmd+N` / `Ctrl+N`: New project
- `Cmd+O` / `Ctrl+O`: Open project
- `Cmd+S` / `Ctrl+S`: Save project (auto-save preferred)

### 7.4 Animations

**Expand/Collapse**:
- Duration: 300ms
- Easing: `ease-out`
- Properties: `width`, `opacity` (for text)

**Hover States**:
- Duration: 150ms
- Easing: `ease-in-out`
- Property: `background-color`

---

## 8. Implementation Plan

### Phase 1: Foundation (Day 1)
- [ ] Install Inter font
- [ ] Set up new Zustand store for sidebar state
- [ ] Create base component structure
- [ ] Implement collapse/expand functionality

### Phase 2: Styling (Day 1-2)
- [ ] Apply Linear color palette
- [ ] Implement typography styles
- [ ] Add Lucide icons
- [ ] Create hover/active states

### Phase 3: Functionality (Day 2)
- [ ] Wire up project list
- [ ] Implement action buttons
- [ ] Add keyboard shortcuts
- [ ] Local storage persistence

### Phase 4: Polish (Day 2-3)
- [ ] Add smooth animations
- [ ] Test responsive behavior
- [ ] Accessibility improvements (ARIA labels)
- [ ] Documentation

---

## 9. Success Metrics

### Qualitative
- Sidebar feels "lightweight" and "out of the way"
- Users report easier focus on canvas
- Design matches modern productivity tools

### Quantitative
- Sidebar collapse rate: >30% of sessions
- Time to switch projects: <2 seconds
- User satisfaction score: >4/5

---

## 10. Design References

### Linear (Primary Reference)
- Clean, minimal sidebar with project list
- Ghost buttons for actions
- Subtle indicators for active items
- Smooth collapse animation

### Notion
- Collapsible sidebar with icon-only mode
- Clear visual hierarchy

### Figma
- Minimal chrome, focus on canvas
- Lightweight navigation

---

## 11. Open Questions

1. **Auto-save**: Should we remove "Save Project" button entirely?
   - **Recommendation**: Yes, implement auto-save on changes

2. **Project list limit**: How many recent projects to show?
   - **Recommendation**: Max 5 recent + current

3. **Color accent**: Keep orange (#F97316) or switch to Linear purple (#5E6AD2)?
   - **Recommendation**: Keep orange (brand consistency)

4. **Keyboard shortcuts**: Should they work globally or only when sidebar focused?
   - **Recommendation**: Global shortcuts

---

## 12. Dependencies

### External Libraries
- `@fontsource/inter`: Inter font
- `lucide-react`: Already installed (Linear-style icons)

### Existing Code
- `src/components/Layout/Sidebar.tsx`: Full rewrite
- `src/stores/projectStore.ts`: May need sidebar state additions

### Design Assets
- None (using Lucide icons + Tailwind)

---

## 13. Acceptance Criteria

**Must Have**:
- [ ] Sidebar can collapse to icon-only mode (48px width)
- [ ] Collapse button is visible and accessible
- [ ] Current project is clearly indicated in list
- [ ] Action buttons (New/Open) are present and functional
- [ ] Smooth 300ms collapse animation
- [ ] Inter font applied
- [ ] Hover states on all interactive elements

**Should Have**:
- [ ] Keyboard shortcut (Cmd+B) to toggle sidebar
- [ ] Local storage persistence of collapse state
- [ ] Recent projects list (max 5)
- [ ] Project metadata (node count) displayed

**Nice to Have**:
- [ ] Tooltips when collapsed
- [ ] Expand on hover when collapsed (optional)
- [ ] Drag to resize sidebar width

---

## 14. Risks & Mitigation

### Risk 1: Users lose "Save Project" button
**Mitigation**: Implement auto-save + keep Cmd+S shortcut

### Risk 2: Collapsed sidebar too narrow to be useful
**Mitigation**: Add tooltips, ensure icons are recognizable

### Risk 3: Animation performance on low-end devices
**Mitigation**: Use CSS transforms (hardware accelerated), test on older hardware

---

## 15. Future Enhancements (Post-MVP)

- Drag-and-drop project reordering
- Project favorites/pinning
- Project search/filter
- Project templates
- Cloud sync indicator
- Multi-workspace support

---

**Approved By**: Pending
**Implementation Start**: October 27, 2025
**Target Completion**: October 29, 2025
