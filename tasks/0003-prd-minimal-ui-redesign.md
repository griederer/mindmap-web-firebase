# PRD: Minimal UI Redesign - Linear-Inspired Professional Interface

## 1. Overview

### 1.1 Introduction
Transform NODEM from its current functional design into a minimal, professional interface inspired by Linear's design system. The goal is to achieve a clean, spacious, and harmonious user experience while maintaining all existing functionality.

### 1.2 Goals
1. **Professional Aesthetic** - Create a polished, modern interface that feels premium
2. **Enhanced Visual Hierarchy** - Improve readability and content prioritization
3. **Consistent Design Language** - Establish unified spacing, typography, and color systems
4. **Improved Usability** - Subtle animations, better feedback, and intuitive interactions
5. **Maintain Performance** - No compromise on Konva canvas performance or functionality

### 1.3 Success Metrics
- Clean, professional appearance comparable to Linear
- Consistent spacing and alignment across all components
- Improved visual hierarchy and readability
- Positive user feedback on interface clarity
- Zero regression in functionality or performance

---

## 2. Design Research & Analysis

### 2.1 Linear Design Principles
Based on Linear's design system (linear.app), key principles include:

1. **Minimal & Spacious**
   - Generous whitespace and breathing room
   - Clean, uncluttered layouts
   - Content-first approach

2. **Subtle Depth**
   - Refined shadow system (minimal, layered)
   - Borders: 1px hairline borders (#E5E7EB, #D1D5DB)
   - No heavy drop shadows

3. **Professional Typography**
   - Sans-serif system fonts (Inter/San Francisco)
   - Clear hierarchy: 24px/20px/16px/14px/12px
   - Medium weight (500) for emphasis
   - Generous line-height (1.5-1.6)

4. **Muted Color Palette**
   - Backgrounds: #FAFAFA, #FFFFFF
   - Surfaces: #F8F9FA, #F3F4F6
   - Borders: #E5E7EB, #D1D5DB
   - Text: #111827 (primary), #6B7280 (secondary), #9CA3AF (tertiary)
   - Accent: Single brand color (NODEM: Orange #F97316)

5. **Modern Icons**
   - 16px/20px/24px consistent sizing
   - Stroke-based (not filled)
   - 1.5-2px stroke width
   - Library: Lucide React (already installed!)

6. **Subtle Interactions**
   - Hover: Slight background change (#F3F4F6)
   - Focus: Ring (2px accent color with offset)
   - Transitions: 150-200ms ease curves
   - No jarring animations

---

## 3. Design System Specification

### 3.1 Color Palette

#### Background Colors
```typescript
// Primary backgrounds
bg-white: #FFFFFF           // Main surfaces, cards, modals
bg-gray-50: #F9FAFB         // Canvas background, secondary surfaces
bg-gray-100: #F3F4F6        // Hover states, tertiary surfaces

// Dark surfaces (for contrast)
bg-gray-900: #111827        // Modals, overlays (keep for relationship sidebar)
```

#### Text Colors
```typescript
// Text hierarchy
text-gray-900: #111827      // Primary text (headings, titles)
text-gray-700: #374151      // Secondary text (body content)
text-gray-500: #6B7280      // Tertiary text (labels, hints)
text-gray-400: #9CA3AF      // Quaternary text (placeholders, disabled)
```

#### Border Colors
```typescript
// Subtle borders
border-gray-200: #E5E7EB    // Default borders (most UI elements)
border-gray-300: #D1D5DB    // Emphasized borders (inputs, cards)
border-gray-100: #F3F4F6    // Subtle dividers
```

#### Accent Colors (Orange - Keep existing)
```typescript
// Primary accent
bg-orange-500: #F97316      // Primary buttons, active states
bg-orange-600: #EA580C      // Hover states for orange buttons
bg-orange-50: #FFF7ED       // Subtle orange backgrounds
text-orange-600: #EA580C    // Orange text links
```

#### Special States
```typescript
// Focus rings
ring-orange-500             // Focus state (2px ring, 2px offset)
ring-offset-2

// Error states
bg-red-50: #FEF2F2
border-red-200: #FECACA
text-red-600: #DC2626

// Success states
bg-green-50: #F0FDF4
border-green-200: #BBF7D0
text-green-600: #16A34A
```

### 3.2 Typography Scale

#### Font Families
```css
/* Primary font stack (system fonts) */
font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif

/* Monospace (for code, IDs) */
font-mono: ui-monospace, 'SF Mono', 'Courier New', monospace
```

#### Size Scale
```typescript
text-2xl: 24px  // Page titles, modal headers
text-xl: 20px   // Section headers
text-lg: 18px   // Subsection headers
text-base: 16px // Body text, large buttons
text-sm: 14px   // Default UI text, small buttons
text-xs: 12px   // Labels, hints, metadata
```

#### Font Weights
```typescript
font-normal: 400    // Default body text
font-medium: 500    // Emphasized text, labels
font-semibold: 600  // Headings, important text
font-bold: 700      // Rare, only for major headings
```

#### Line Heights
```typescript
leading-tight: 1.25     // Headings
leading-snug: 1.375     // Subheadings
leading-normal: 1.5     // Body text (default)
leading-relaxed: 1.625  // Long-form content
```

### 3.3 Spacing System

#### Base Unit: 4px (Tailwind's default)
```typescript
// Spacing scale (use consistently)
0.5: 2px    // Micro spacing
1: 4px      // Minimal spacing
1.5: 6px    // Small spacing
2: 8px      // Compact spacing
3: 12px     // Default spacing
4: 16px     // Medium spacing
5: 20px     // Large spacing
6: 24px     // Extra large spacing
8: 32px     // Major spacing
10: 40px    // Section spacing
12: 48px    // Page-level spacing
```

#### Component Padding Standards
```typescript
// Buttons
px-3 py-1.5     // Small button (12px x 6px)
px-4 py-2       // Default button (16px x 8px)
px-5 py-2.5     // Large button (20px x 10px)

// Cards/Panels
p-4             // Compact card (16px all sides)
p-6             // Default card (24px all sides)
p-8             // Spacious card (32px all sides)

// Modals
px-6 py-4       // Modal header (24px x 16px)
px-6 py-6       // Modal body (24px all sides)
px-6 py-4       // Modal footer (24px x 16px)
```

#### Gap Standards (flex/grid)
```typescript
gap-1: 4px      // Tight groups (icon + text)
gap-2: 8px      // Default groups (buttons, inputs)
gap-3: 12px     // Spacious groups
gap-4: 16px     // Section elements
gap-6: 24px     // Major sections
```

### 3.4 Border Radius System

```typescript
rounded-none: 0px       // Sharp corners (rare)
rounded-sm: 2px         // Subtle radius
rounded: 4px            // Small elements (badges)
rounded-md: 6px         // Buttons, small inputs
rounded-lg: 8px         // Cards, panels, inputs
rounded-xl: 12px        // Modals, large surfaces
rounded-2xl: 16px       // Special emphasis
rounded-full: 9999px    // Circular buttons, avatars
```

**Standard Usage:**
- **Buttons:** `rounded-md` (6px)
- **Inputs:** `rounded-lg` (8px)
- **Cards/Panels:** `rounded-lg` (8px)
- **Modals:** `rounded-xl` (12px)
- **Icon Buttons:** `rounded-md` (6px) or `rounded-lg` (8px)

### 3.5 Shadow System

```typescript
// Subtle elevation system (Linear-style)

// Level 1: Barely visible (hover states)
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)

// Level 2: Default (cards, dropdowns)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)

// Level 3: Elevated (modals, popovers)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)

// Level 4: Prominent (dialogs, important overlays)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)

// Level 5: Maximum elevation (fullscreen overlays)
shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

**Usage Guidelines:**
- **Default state:** No shadow or `shadow-sm`
- **Hover state:** Upgrade one level (none → sm, sm → default)
- **Active elements:** `shadow` or `shadow-md`
- **Floating UI:** `shadow-lg` (modals, tooltips)
- **Avoid:** Heavy shadows, colored shadows (except focus rings)

### 3.6 Icon System - Lucide React

**Already installed:** `lucide-react@0.545.0` ✅

#### Icon Sizes
```typescript
// Consistent sizing
w-4 h-4: 16px       // Small icons (inline with text)
w-5 h-5: 20px       // Default icons (buttons, menus)
w-6 h-6: 24px       // Large icons (headers, emphasis)
w-8 h-8: 32px       // Extra large (empty states)
```

#### Stroke Width
```typescript
strokeWidth={1.5}   // Default (subtle)
strokeWidth={2}     // Emphasized (selected states)
```

#### Icon Color Classes
```typescript
text-gray-400       // Tertiary icons (subtle)
text-gray-500       // Secondary icons (default)
text-gray-700       // Primary icons (emphasized)
text-orange-600     // Accent icons (active, important)
```

#### Current Icons Mapping (Replace inline SVGs)

| Current | Component | Replace With | Lucide Icon | Size |
|---------|-----------|--------------|-------------|------|
| Menu/Sidebar toggle | Sidebar.tsx | `PanelLeftClose`, `PanelLeft` | 20px |
| Plus (Add) | Sidebar, NodeActionMenu | `Plus` | 20px |
| Info | NodeActionMenu | `Info` | 20px |
| Edit/Pencil | NodeActionMenu | `Edit3` or `Pencil` | 20px |
| Focus/Target | NodeActionMenu, ZoomControls | `Target` | 20px |
| Link/Chain | Canvas, NodeActionMenu | `Link2` | 20px |
| Delete/X | NodeActionMenu, Modals | `Trash2` | 20px |
| Close X | Modals | `X` | 20px |
| Zoom In | ZoomControls | `ZoomIn` | 20px |
| Zoom Out | ZoomControls | `ZoomOut` | 20px |
| Reset | ZoomControls | `RotateCcw` | 20px |
| Fit Screen | ZoomControls | `Maximize2` | 20px |
| Eye (Auto Focus) | ZoomControls | `Eye`, `EyeOff` | 20px |
| Image | ImageUpload | `Image` | 20px |
| Upload | ImageUpload | `Upload` | 20px |
| Chevron Left | ImageViewer | `ChevronLeft` ✅ | 24px |
| Chevron Right | ImageViewer | `ChevronRight` ✅ | 24px |

**Implementation:**
```typescript
// Example: Replace inline SVG with Lucide
import { Plus, Edit3, Trash2, Info, Target, Link2 } from 'lucide-react';

// Usage
<Plus className="w-5 h-5" strokeWidth={1.5} />
```

---

## 4. Component Transformation Specifications

### 4.1 Left Sidebar (Sidebar.tsx)

#### Current State Issues
- ❌ Heavy border (`border-gray-200`)
- ❌ Large padding inconsistent
- ❌ Orange button too prominent
- ❌ Border buttons lack hierarchy
- ❌ Footer feels cramped
- ❌ Toggle button has heavy shadow

#### Target State Design

**Container:**
```tsx
// Replace:
className="bg-white border-r border-gray-200 flex flex-col"

// With:
className="bg-white border-r border-gray-200 flex flex-col"
// (Keep same, border is correct)
```

**Header:**
```tsx
// Replace:
className="p-4 border-b border-gray-200"
className="text-lg font-semibold text-gray-900"

// With:
className="px-6 py-4 border-b border-gray-100"  // More padding, subtle border
className="text-base font-semibold text-gray-900"  // Smaller, cleaner
```

**Action Buttons Section:**
```tsx
// Container
className="p-4 space-y-2 border-b border-gray-200"
// Replace with:
className="p-4 space-y-2 border-b border-gray-100"  // Subtle border

// Primary Button (New Project)
// Replace:
className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"

// With:
className="w-full px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors shadow-sm"
// Changes: Darker orange, smaller radius, sm text, shadow-sm

// Secondary Buttons (Open/Save)
// Replace:
className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"

// With:
className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
// Changes: Smaller radius, sm text
```

**Error Display:**
```tsx
// Replace:
className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
className="text-sm text-red-800"

// With:
className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
className="text-sm text-red-700 font-medium"  // Darker, medium weight
```

**Current Project Info:**
```tsx
// Replace:
className="p-4"
className="bg-gray-50 rounded-lg p-3"
className="text-sm font-medium text-gray-900 mb-1"
className="text-sm text-gray-600"
className="text-xs text-gray-500 mt-1"

// With:
className="p-4"
className="bg-gray-50 rounded-md p-4"  // More padding, smaller radius
className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"  // Label style
className="text-sm text-gray-900 font-medium"  // Swap: larger, darker
className="text-xs text-gray-500 mt-1"  // Keep
```

**Footer:**
```tsx
// Replace:
className="p-4 border-t border-gray-200"
className="text-xs text-gray-500 text-center"

// With:
className="px-6 py-4 border-t border-gray-100"  // More padding, subtle border
className="text-xs text-gray-400 text-center font-medium"  // Lighter, medium
```

**Toggle Button:**
```tsx
// Replace:
className="absolute top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50"

// With:
className="absolute top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 hover:shadow transition-all"
// Changes: Smaller radius, subtle shadow, smooth transition

// Replace inline SVG with Lucide
import { PanelLeftClose, PanelLeft } from 'lucide-react';

{isOpen ? (
  <PanelLeftClose className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
) : (
  <PanelLeft className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
)}
```

#### Before/After Visual Comparison
**Before:** Functional but cluttered, heavy borders, inconsistent spacing
**After:** Clean, spacious, subtle borders, consistent hierarchy

---

### 4.2 Top Header (App.tsx)

#### Current State Issues
- ❌ Generic appearance
- ❌ Plain divider
- ❌ Could be more polished

#### Target State Design

```tsx
// Replace:
<header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

// With:
<header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
// Changes: Subtle border, compact padding

// Title
className="text-2xl font-bold text-gray-900"
// Replace with:
className="text-xl font-bold text-gray-900"  // Slightly smaller

// Divider
className="h-6 w-px bg-gray-300"
// Replace with:
className="h-4 w-px bg-gray-200"  // Shorter, lighter

// Project name
className="text-sm text-gray-600"
// Replace with:
className="text-sm text-gray-500 font-medium"  // Lighter, medium weight

// Hostname
className="flex items-center space-x-2 text-xs text-gray-500"
className="font-mono"
// Replace with:
className="flex items-center gap-2 text-xs text-gray-400"
className="font-mono"  // Keep mono, lighter color
```

---

### 4.3 Canvas Background (Canvas.tsx)

#### Current State Issues
- ❌ `bg-gray-50` is correct but could be lighter

#### Target State Design

```tsx
// Replace:
className="w-full h-full bg-gray-50"

// With:
className="w-full h-full bg-gray-50"  // Keep same (correct choice)
// Alternative if want lighter: bg-white or bg-gray-25 (custom)
```

**Empty State:**
```tsx
// Replace:
className="text-center text-gray-400"
className="text-lg mb-2"
className="text-sm"

// With:
className="text-center text-gray-400"
className="text-base font-medium text-gray-500 mb-2"  // Darker, medium
className="text-sm text-gray-400"  // Lighter for secondary
```

---

### 4.4 Zoom Controls (ZoomControls.tsx)

#### Current State Issues
- ❌ Shadow too heavy (`shadow-lg`)
- ❌ Auto focus active state too bright (blue)
- ❌ Borders inconsistent

#### Target State Design

**Zoom Percentage Display:**
```tsx
// Replace:
className="bg-white rounded-lg shadow-lg px-3 py-2 text-center"
className="text-sm font-medium text-gray-700"

// With:
className="bg-white rounded-md border border-gray-200 shadow-sm px-3 py-1.5 text-center"
className="text-xs font-semibold text-gray-600 tabular-nums"  // Tabular nums for alignment
```

**Control Container:**
```tsx
// Replace:
className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-1"

// With:
className="bg-white rounded-md border border-gray-200 shadow-sm p-1.5 flex flex-col gap-0.5"
// Changes: Border added, subtle shadow, tighter gaps
```

**Buttons:**
```tsx
// Replace:
className="w-10 h-10 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30"

// With:
className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 transition-colors"
// Changes: Smaller (36px), defined radius, active state

// Icon colors
className="w-5 h-5"
// Replace with:
className="w-5 h-5 text-gray-600"  // Explicit color

// Replace inline SVGs with Lucide
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Eye, EyeOff } from 'lucide-react';
```

**Dividers:**
```tsx
// Replace:
className="h-px bg-gray-200 my-1"

// With:
className="h-px bg-gray-100 my-1"  // Lighter divider
```

**Auto Focus Button (Active State):**
```tsx
// Replace:
className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
  autoFocusEnabled
    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    : 'hover:bg-gray-100'
}`}

// With:
className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${
  autoFocusEnabled
    ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
    : 'text-gray-600 hover:bg-gray-100'
}`}
// Changes: Orange accent (brand), smaller size, explicit default color
```

---

### 4.5 Node Component (NodeComponent.tsx - Konva)

#### Current State Issues
- ❌ Shadow acceptable but could be more subtle
- ❌ Border colors good
- ❌ Level indicator useful but could be refined

#### Target State Design

**Note:** Konva uses different styling (not Tailwind classes)

```typescript
// Shadow (default state)
// Replace:
shadowColor: 'rgba(0, 0, 0, 0.1)'
shadowBlur: 10
shadowOffsetY: 2

// With:
shadowColor: 'rgba(0, 0, 0, 0.08)'  // Lighter
shadowBlur: 8  // Tighter
shadowOffsetY: 1  // Subtle

// Shadow (focused state)
shadowColor: 'rgba(251, 146, 60, 0.3)'
shadowBlur: 20
// Replace with:
shadowColor: 'rgba(249, 115, 22, 0.15)'  // More subtle
shadowBlur: 16  // Tighter

// Border (default)
stroke: '#e5e7eb'
strokeWidth: 1
// Keep same (correct)

// Border (selected/focused)
stroke: '#fb923c'
strokeWidth: 2
// Replace with:
stroke: '#EA580C'  // Slightly darker orange
strokeWidth: 2  // Keep

// Title text color
fill: '#1f2937'
// Replace with:
fill: '#111827'  // Darker, clearer

// Font
fontFamily: 'system-ui, -apple-system, sans-serif'
fontSize: 14
// Keep same

// Expand button (collapsed state)
fill: '#f3f4f6'  // Background
stroke: '#d1d5db'  // Border
// Keep same

// Expand button (expanded state)
fill: '#fb923c'
stroke: '#ea580c'
// Replace with:
fill: '#EA580C'  // Darker, more solid
stroke: '#C2410C'  // Even darker border

// Level indicator
fill: '#9ca3af'
fontSize: 10
fontFamily: 'monospace'
// Replace with:
fill: '#D1D5DB'  // Lighter, less distracting
fontSize: 9  // Smaller
```

---

### 4.6 Node Action Menu (NodeActionMenu.tsx - Konva)

#### Current State Issues
- ❌ Dark background too heavy (`#2b2b2b`)
- ❌ Symbols unclear (unicode characters)
- ❌ Could use proper icons

#### Target State Design

**Colors:**
```typescript
// Replace:
const BUTTON_BG_COLOR = '#2b2b2b';
const BUTTON_HOVER_COLOR = '#444444';
const ICON_COLOR = '#ffffff';

// With (Option 1: Keep dark, refine):
const BUTTON_BG_COLOR = '#374151';  // Lighter gray
const BUTTON_HOVER_COLOR = '#4B5563';  // Lighter hover
const ICON_COLOR = '#FFFFFF';

// OR (Option 2: Light theme - RECOMMENDED):
const BUTTON_BG_COLOR = '#FFFFFF';  // White background
const BUTTON_BORDER_COLOR = '#E5E7EB';  // Border
const BUTTON_HOVER_COLOR = '#F3F4F6';  // Hover
const ICON_COLOR = '#6B7280';  // Gray icons
const ICON_HOVER_COLOR = '#111827';  // Dark on hover
```

**Icon Replacement:**
Since Konva Text doesn't support React components, we need to:
1. Use better unicode symbols
2. OR render as HTML overlay (more complex)
3. OR use Konva Image with SVG paths

**Recommended: Better Unicode Symbols**
```typescript
const buttons = [
  { symbol: '✎', onClick: onEdit, label: 'Edit' },          // Pencil
  { symbol: 'ⓘ', onClick: onShowInfo, label: 'Info' },       // Circle i
  { symbol: '◎', onClick: onFocus, label: 'Focus' },         // Target
  { symbol: '⚯', onClick: onManageRelationships, label: 'Relationships' }, // Link
  { symbol: '+', onClick: onAddChild, label: 'Add' },        // Plus
  { symbol: '×', onClick: onDelete, label: 'Delete' },       // X
];

// Better alternative symbols:
{ symbol: '✏', onClick: onEdit, label: 'Edit' },           // Better pencil
{ symbol: 'ⓘ', onClick: onShowInfo, label: 'Info' },       // Circled i
{ symbol: '⊙', onClick: onFocus, label: 'Focus' },         // Circle with dot
{ symbol: '⚯', onClick: onManageRelationships, label: 'Relationships' },
{ symbol: '＋', onClick: onAddChild, label: 'Add' },        // Full-width plus
{ symbol: '⨯', onClick: onDelete, label: 'Delete' },       // Multiplication sign
```

**Button styling (if going light theme):**
```typescript
// Add Rect border
<Circle
  radius={ICON_SIZE / 2}
  fill={BUTTON_BG_COLOR}
  stroke={BUTTON_BORDER_COLOR}
  strokeWidth={1}
  onClick={button.onClick}
  // ... handlers
/>
```

**Size refinement:**
```typescript
// Replace:
const ICON_SIZE = 32;
const ICON_SPACING = 6;

// With:
const ICON_SIZE = 30;  // Slightly smaller
const ICON_SPACING = 8;  // More breathing room
```

---

### 4.7 Node Info Panel (NodeInfoPanel.tsx - Konva)

#### Current State Issues
- ❌ Orange stroke too bright (`#FB923C`)
- ❌ Dash pattern could be more subtle
- ❌ Shadow heavy

#### Target State Design

```typescript
// Connector line
// Replace:
stroke: '#FB923C'
strokeWidth: 2
dash: [5, 5]

// With:
stroke: '#FED7AA'  // Much lighter orange
strokeWidth: 1.5  // Thinner
dash: [4, 4]  // Tighter dash

// Panel background
// Replace:
fill: 'white'
stroke: '#FB923C'
strokeWidth: 2
shadowColor: 'rgba(0, 0, 0, 0.3)'
shadowBlur: 20
shadowOffsetY: 4

// With:
fill: 'white'
stroke: '#E5E7EB'  // Neutral border (not orange)
strokeWidth: 1  // Hairline
shadowColor: 'rgba(0, 0, 0, 0.08)'  // Subtle shadow
shadowBlur: 12  // Tighter
shadowOffsetY: 2  // Closer

// Description text
// Replace:
fill: '#374151'
fontSize: 13
lineHeight: 1.4

// With:
fill: '#6B7280'  // Lighter (secondary text)
fontSize: 13  // Keep
lineHeight: 1.5  // More breathing room
```

---

### 4.8 Node Edit Modal (NodeEditModal.tsx)

#### Current State Issues
- ❌ Orange gradient header too bold
- ❌ Large rounded corners (`rounded-2xl`)
- ❌ Excessive padding
- ❌ Gradient buttons feel heavy

#### Target State Design

**Modal Container:**
```tsx
// Replace:
className="bg-white rounded-2xl shadow-2xl w-[800px] max-h-[90vh] min-h-[500px]"

// With:
className="bg-white rounded-xl shadow-lg border border-gray-200 w-[640px] max-h-[90vh]"
// Changes: Smaller radius, border, narrower (640px), no min-height, lighter shadow
```

**Header:**
```tsx
// Replace:
className="bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-6"
className="text-2xl font-semibold text-white tracking-tight"

// With:
className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between"
className="text-lg font-semibold text-gray-900"
// Changes: White header (not orange), smaller padding/text, subtle border

// Close button
// Replace:
className="text-white hover:text-gray-200 transition-colors text-3xl"

// With:
import { X } from 'lucide-react';
<button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
  <X className="w-5 h-5" strokeWidth={1.5} />
</button>
```

**Content Area:**
```tsx
// Replace:
className="px-10 py-8 space-y-8"

// With:
className="px-6 py-6 space-y-6"  // Less padding, tighter spacing
```

**Labels:**
```tsx
// Replace:
className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide"

// With:
className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
// Changes: Smaller (xs), lighter color, better hierarchy
```

**Title Input:**
```tsx
// Replace:
className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"

// With:
className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
// Changes: Smaller padding, single border, smaller text, added border focus
```

**Textarea:**
```tsx
// Replace:
className="w-full px-4 py-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
rows={12}

// With:
className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors leading-relaxed"
rows={8}
// Changes: Smaller, single border, fewer rows (less imposing)
```

**Footer:**
```tsx
// Replace:
className="flex justify-end gap-3 px-10 py-6 bg-gray-50 border-t border-gray-200"

// With:
className="flex justify-end gap-2 px-6 py-4 bg-white border-t border-gray-100"
// Changes: White background (not gray), smaller padding/gap, subtle border
```

**Cancel Button:**
```tsx
// Replace:
className="px-6 py-2.5 text-base text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50"

// With:
className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
// Changes: Smaller, single border, smaller radius, explicit font
```

**Save Button:**
```tsx
// Replace:
className="px-6 py-2.5 text-base text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-md"

// With:
className="px-4 py-2 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors font-medium shadow-sm"
// Changes: Solid color (no gradient), smaller, subtle shadow
```

**Keyboard Shortcuts Hint:**
```tsx
// Replace:
className="text-xs text-gray-500 pt-2 border-t border-gray-200"
className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono"

// With:
className="text-xs text-gray-400 pt-4"  // Remove border
className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono"
// Changes: Smaller padding, lighter border
```

#### Before/After Visual Comparison
**Before:** Bold, colorful, large - feels like a takeover
**After:** Clean, subtle, focused - feels like a natural extension

---

### 4.9 Relationship Sidebar (RelationshipSidebar.tsx)

#### Current State Issues
- ❌ Dark theme inconsistent with rest of app (but could be kept for contrast)
- ❌ Opacity (`bg-opacity-95`) makes it feel heavy
- ❌ Could be refined

#### Target State Design

**Option 1: Keep Dark Theme (Recommended for Contrast)**
```tsx
// Replace:
className="fixed right-0 top-0 h-full w-80 bg-gray-900 bg-opacity-95 shadow-2xl"

// With:
className="fixed right-0 top-0 h-full w-80 bg-gray-900 shadow-xl border-l border-gray-800"
// Changes: Remove opacity (solid), border, lighter shadow
```

**Option 2: Light Theme (Consistency)**
```tsx
className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200"
// Need to update all child text colors from white to gray
```

**Assuming we keep dark theme (Option 1):**

**Header:**
```tsx
// Replace:
className="flex items-center justify-between p-4 border-b border-gray-700"
className="text-lg font-semibold text-white"

// With:
className="flex items-center justify-between px-6 py-4 border-b border-gray-800"
className="text-base font-semibold text-white"
// Changes: More horizontal padding, darker border, smaller text
```

**New Relationship Button:**
```tsx
// Replace:
className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg"

// With:
className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
// Changes: Darker orange, smaller radius, sm text
```

**Empty State:**
```tsx
// Icon size
className="w-16 h-16 mx-auto mb-4 opacity-50"
// Replace with:
className="w-12 h-12 mx-auto mb-3 opacity-40"  // Smaller, lighter

// Text
className="text-sm mb-2"
className="text-xs text-gray-500"
// Replace with:
className="text-sm text-gray-300 font-medium mb-2"
className="text-xs text-gray-400"  // Lighter
```

---

### 4.10 Relationship Modal (RelationshipModal.tsx)

#### Current State Issues
- ❌ Dark modal on dark sidebar can be confusing
- ❌ Heavy backdrop
- ❌ Scale animation abrupt

#### Target State Design

**Backdrop:**
```tsx
// Replace:
className="fixed inset-0 bg-black bg-opacity-50 z-[60]"

// With:
className="fixed inset-0 bg-black bg-opacity-60 z-[60] backdrop-blur-sm"
// Changes: Darker, add blur effect
```

**Modal Container:**
```tsx
// Replace:
className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md border border-gray-700"

// With:
className="bg-white rounded-xl shadow-xl w-full max-w-md border border-gray-200"
// Changes: WHITE background (not dark), larger radius, lighter shadow/border

// NOTE: If switching to white, update all text colors:
// text-white → text-gray-900
// text-gray-300 → text-gray-700
// text-gray-400 → text-gray-500
// bg-gray-800 → bg-white
// border-gray-700 → border-gray-200
```

**Header:**
```tsx
// With white modal:
className="flex items-center justify-between px-6 py-4 border-b border-gray-100"
className="text-lg font-semibold text-gray-900"
```

**Form Inputs:**
```tsx
// Title input
// Replace:
className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2"

// With:
className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
```

**Color Swatches:**
```tsx
// Keep same, works with either theme
className={`w-8 h-8 rounded-full transition-transform ${
  color === c ? 'ring-2 ring-orange-500 ring-offset-2 ring-offset-white scale-110' : ''
}`}
// Update ring-offset to match modal background
```

**Line Type Buttons:**
```tsx
// Replace:
className={`px-3 py-2 rounded-lg border ${
  lineType === lt.value
    ? 'bg-orange-500 border-orange-500 text-white'
    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
}`}

// With:
className={`px-3 py-2 rounded-md border transition-colors ${
  lineType === lt.value
    ? 'bg-orange-600 border-orange-600 text-white'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
}`}
// Changes: White theme, smaller radius
```

**Action Buttons:**
```tsx
// Cancel
className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"

// Submit
className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
```

---

### 4.11 Image Viewer (ImageViewer.tsx)

#### Current State Issues
- ✅ Already uses Lucide icons (ChevronLeft, ChevronRight, X)
- ❌ Could refine button styling slightly

#### Target State Design

**Backdrop:**
```tsx
// Keep:
className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center animate-fade-in"
```

**Close Button:**
```tsx
// Replace:
className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"

// With:
className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
// Changes: Subtle hover, smaller radius, explicit transition
```

**Navigation Buttons:**
```tsx
// Replace:
className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"

// With:
className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 text-white hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
// Changes: Smaller padding, subtle hover, smaller radius
```

**Counter:**
```tsx
// Replace:
className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black bg-opacity-70 text-white rounded-lg"

// With:
className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black bg-opacity-80 text-white text-sm font-medium rounded-md backdrop-blur-sm"
// Changes: Smaller, darker backdrop, blur, explicit text styling
```

---

### 4.12 Image Upload Component (ImageUpload.tsx)

**Note:** File not read yet, but should follow modal patterns

#### Expected Target State
- Small, compact thumbnails
- Subtle borders
- Minimal shadows
- Clear upload button with icon
- Consistent spacing

---

### 4.13 Relationship Assignment Menu (RelationshipAssignMenu.tsx)

#### Current State Issues
- ❌ Dark theme (`bg-gray-900`) - inconsistent with new light modals
- ❌ Heavy border (`border-gray-700`)
- ❌ Could use better spacing and typography

#### Target State Design

**Container & Backdrop:**
```typescript
// Replace:
className="fixed bg-gray-900 rounded-lg shadow-2xl p-3 z-[70] border border-gray-700"

// With:
className="fixed bg-white rounded-xl shadow-xl p-4 z-[70] border border-gray-200"
```

**Header:**
```typescript
// Replace:
<h3 className="text-white font-medium text-sm mb-3">

// With:
<h3 className="text-gray-900 font-semibold text-sm mb-3">
```

**Checkbox Items:**
```typescript
// Replace:
<label className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 cursor-pointer transition-colors">
  <input className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-gray-900 cursor-pointer" />
  <span className="text-white text-sm flex-1 truncate">
  <span className="text-xs text-gray-500">

// With:
<label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
  <input className="w-4 h-4 rounded border-gray-300 bg-white text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer" />
  <span className="text-gray-900 text-sm flex-1 truncate font-medium">
  <span className="text-xs text-gray-500 font-medium">
```

**Empty State:**
```typescript
// Replace:
<div className="fixed bg-gray-900 text-white rounded-lg shadow-2xl p-4 z-[70] border border-gray-700">
  <p className="text-sm text-gray-400">

// With:
<div className="fixed bg-white rounded-xl shadow-xl p-4 z-[70] border border-gray-200">
  <p className="text-sm text-gray-600">
```

**Visual Improvements:**
- Lighter, cleaner appearance
- Better contrast with white background
- Consistent with other modals
- Subtle hover states (`bg-gray-50`)
- More refined shadows (`shadow-xl`)
- Better checkbox styling (native accent color)

---

### 4.14 Relationship Lines (Canvas - Konva)

#### Current State Issues
- Lines are functional but could be more refined

#### Target State Design
```typescript
// Custom relationship lines
// Ensure consistent stroke widths and colors per relationship type
// Already handled by relationship color system

// Connection lines (parent-child)
// Should be very subtle to not compete with relationship lines
strokeWidth: 1.5  // Thin
stroke: '#E5E7EB'  // Very light gray
opacity: 0.6  // Transparent
```

---

## 5. Implementation Plan

### Phase 1: Design System Foundations (Day 1)
**Goal:** Establish core design tokens

**Tasks:**
1. Update Tailwind config with refined color palette
2. Add custom shadow utilities if needed
3. Update index.css with design tokens
4. Install/verify Lucide React icons
5. Create design system reference file (DESIGN_SYSTEM.md)

**Files:**
- `/Users/gonzaloriederer/nodem-clean/tailwind.config.js`
- `/Users/gonzaloriederer/nodem-clean/src/index.css`
- `/Users/gonzaloriederer/nodem-clean/docs/DESIGN_SYSTEM.md` (new)

**Testing:**
- Visual check that colors compile
- No breaking changes to existing styles

---

### Phase 2: Icon Library Integration (Day 1-2)
**Goal:** Replace all inline SVGs with Lucide icons

**Tasks:**
1. Map all current icons to Lucide equivalents
2. Create icon size/color constants
3. Replace icons in:
   - Sidebar.tsx
   - ZoomControls.tsx
   - NodeEditModal.tsx
   - RelationshipSidebar.tsx
   - RelationshipModal.tsx
   - NodeActionMenu.tsx (unicode or HTML overlay)
   - ImageUpload.tsx

**Files:**
- All component files listed above

**Testing:**
- Visual check all icons render correctly
- Check icon sizes are consistent
- Verify hover/active states work

---

### Phase 3: Component Transformation - Layout (Day 2-3)
**Goal:** Transform layout and container components

**Tasks:**
1. **Sidebar.tsx**
   - Update spacing, borders, button styles
   - Replace toggle icon
   - Refine current project card

2. **App.tsx**
   - Update header styling
   - Refine divider and text

3. **Canvas.tsx**
   - Verify background color
   - Update empty state

**Files:**
- `/Users/gonzaloriederer/nodem-clean/src/components/Layout/Sidebar.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/App.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/Canvas.tsx`

**Testing:**
- Load project works
- Sidebar toggle works
- Empty state displays correctly

---

### Phase 4: Component Transformation - Controls (Day 3-4)
**Goal:** Transform control components

**Tasks:**
1. **ZoomControls.tsx**
   - Update container styling
   - Replace icons
   - Refine auto-focus active state

2. **NodeActionMenu.tsx**
   - Consider light theme vs dark
   - Update colors and sizing
   - Better icons/symbols

**Files:**
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/ZoomControls.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/NodeActionMenu.tsx`

**Testing:**
- Zoom in/out works
- Reset/fit screen works
- Auto focus toggle works
- Action menu displays and functions

---

### Phase 5: Component Transformation - Modals & Overlays (Day 4-5)
**Goal:** Transform modal components

**Tasks:**
1. **NodeEditModal.tsx**
   - Complete redesign (white header, smaller)
   - Update form inputs
   - Refine buttons

2. **RelationshipModal.tsx**
   - Switch to white theme
   - Update all styling

3. **RelationshipSidebar.tsx**
   - Keep or lighten dark theme
   - Refine spacing

4. **ImageViewer.tsx**
   - Minor refinements
   - Already good with Lucide

**Files:**
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/NodeEditModal.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/RelationshipSidebar/RelationshipModal.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/RelationshipSidebar/RelationshipSidebar.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/ImageViewer.tsx`

**Testing:**
- Edit modal opens/closes
- Form inputs work
- Save/cancel work
- Relationship CRUD works
- Image viewer navigation works

---

### Phase 6: Component Transformation - Konva Elements (Day 5-6)
**Goal:** Transform canvas-rendered components

**Tasks:**
1. **NodeComponent.tsx**
   - Update shadow values
   - Refine colors
   - Lighter level indicator

2. **NodeInfoPanel.tsx**
   - Subtle connector line
   - Neutral border (not orange)
   - Refined shadow

3. **Connector.tsx** (if not already optimal)
   - Very subtle parent-child lines

**Files:**
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/NodeComponent.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/NodeInfoPanel.tsx`
- `/Users/gonzaloriederer/nodem-clean/src/components/Canvas/Connector.tsx`

**Testing:**
- Nodes render correctly
- Shadows look good
- Selection/focus states work
- Info panel displays
- Connectors draw correctly

---

### Phase 7: Polish & Refinement (Day 6-7)
**Goal:** Final touches and consistency checks

**Tasks:**
1. Review all components for consistency
2. Check spacing alignment
3. Verify color usage
4. Test all interactions
5. Refine animations/transitions
6. Accessibility check (focus rings, labels)
7. Performance check (no regressions)

**Testing:**
- Full user flow testing
- Load/save projects
- Create/edit nodes
- Expand/collapse
- Zoom/pan
- Relationships
- Images

---

## 6. Technical Considerations

### 6.1 Konva Integration
- **No Breaking Changes:** All Konva functionality remains intact
- **Performance:** No additional layers or complexity
- **Coordinate System:** No changes to layout engine
- **Events:** All click/hover handlers remain same

### 6.2 Accessibility

**Ensure all components maintain:**
- Proper ARIA labels
- Focus indicators (2px ring, orange)
- Keyboard navigation
- Sufficient color contrast (WCAG AA minimum)
- Screen reader support

**Focus Ring Standard:**
```tsx
focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
```

### 6.3 Browser Compatibility
- Tailwind classes are widely supported
- Lucide icons work in all modern browsers
- Konva already tested
- Backdrop-blur may need fallback (graceful degradation)

### 6.4 Performance
- **No New Dependencies:** Lucide already installed
- **Bundle Size:** No increase (replacing inline SVGs)
- **Rendering:** Same performance (Tailwind is atomic CSS)
- **Animations:** CSS transitions (GPU-accelerated)

---

## 7. Code Examples

### 7.1 Button Component Pattern

```tsx
// Primary Button
<button
  className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
>
  Primary Action
</button>

// Secondary Button
<button
  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
  Secondary Action
</button>

// Ghost Button
<button
  className="px-3 py-1.5 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
>
  Ghost Action
</button>

// Icon Button
<button
  className="p-2 text-gray-600 rounded-md hover:bg-gray-100 active:bg-gray-200 transition-colors"
>
  <Icon className="w-5 h-5" strokeWidth={1.5} />
</button>
```

### 7.2 Input Component Pattern

```tsx
// Text Input
<div>
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
    Field Label
  </label>
  <input
    type="text"
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors placeholder:text-gray-400"
    placeholder="Enter value..."
  />
</div>

// Textarea
<textarea
  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-colors leading-relaxed placeholder:text-gray-400"
  rows={6}
  placeholder="Enter description..."
/>
```

### 7.3 Card Component Pattern

```tsx
// Basic Card
<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
  <h3 className="text-sm font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-sm text-gray-600">Card content goes here.</p>
</div>

// Interactive Card (hover)
<div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow transition-shadow cursor-pointer">
  {/* content */}
</div>
```

### 7.4 Modal Pattern

```tsx
// Backdrop
<div className="fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm" />

// Modal Container
<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Modal Title</h2>
      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
        <X className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>

    {/* Body */}
    <div className="px-6 py-6">
      {/* Content */}
    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
      <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium">
        Cancel
      </button>
      <button className="px-4 py-2 text-sm text-white bg-orange-600 rounded-md hover:bg-orange-700 transition-colors font-medium shadow-sm">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### 7.5 Icon Usage Pattern

```tsx
import { Plus, Edit3, Trash2, Info, Target, X } from 'lucide-react';

// In button
<button className="...">
  <Plus className="w-5 h-5" strokeWidth={1.5} />
  <span className="ml-2">Add Item</span>
</button>

// Standalone
<Info className="w-5 h-5 text-gray-500" strokeWidth={1.5} />

// In text
<div className="flex items-center gap-2 text-sm text-gray-600">
  <Target className="w-4 h-4" strokeWidth={1.5} />
  <span>Focused</span>
</div>
```

---

## 8. Visual Design Cheat Sheet

### Quick Reference for Developers

#### Spacing (Padding/Margin/Gap)
```
Micro:      p-1    (4px)
Small:      p-2    (8px)
Default:    p-4    (16px)
Medium:     p-6    (24px)
Large:      p-8    (32px)
```

#### Text Sizes
```
Tiny:       text-xs   (12px)
Small:      text-sm   (14px)
Base:       text-base (16px)
Medium:     text-lg   (18px)
Large:      text-xl   (20px)
XLarge:     text-2xl  (24px)
```

#### Colors
```
Background:   bg-white, bg-gray-50, bg-gray-100
Text:         text-gray-900 (primary), text-gray-700 (secondary), text-gray-500 (tertiary)
Border:       border-gray-200 (default), border-gray-300 (emphasis)
Accent:       bg-orange-600, text-orange-600
```

#### Border Radius
```
Small:        rounded-md  (6px)  - Buttons
Default:      rounded-lg  (8px)  - Cards, inputs
Large:        rounded-xl  (12px) - Modals
```

#### Shadows
```
Subtle:       shadow-sm   - Buttons, small elements
Default:      shadow      - Cards, dropdowns
Elevated:     shadow-md   - Tooltips
Prominent:    shadow-lg   - Modals
```

#### Icons (Lucide)
```
Small:        w-4 h-4   (16px)
Default:      w-5 h-5   (20px)
Large:        w-6 h-6   (24px)
Stroke:       strokeWidth={1.5}
```

---

## 9. Acceptance Criteria

### Visual Quality
- [ ] Consistent spacing throughout (4px grid)
- [ ] Unified typography scale
- [ ] Subtle, professional shadows
- [ ] Clean borders (1px hairline)
- [ ] All icons from Lucide React
- [ ] No visual regressions

### Functional Requirements
- [ ] All existing features work
- [ ] No performance degradation
- [ ] Smooth transitions (150-200ms)
- [ ] Proper focus states
- [ ] Keyboard navigation works

### Accessibility
- [ ] WCAG AA contrast ratios
- [ ] Focus rings visible
- [ ] ARIA labels present
- [ ] Screen reader compatible

### Browser Support
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## 10. Success Metrics

### Quantitative
- Design system tokens: 100% usage
- Icon consistency: 100% Lucide
- Spacing violations: 0
- Color violations: 0
- Contrast ratio: >4.5:1 (AA)

### Qualitative
- Professional appearance comparable to Linear
- Clean, uncluttered interface
- Obvious visual hierarchy
- Harmonious color usage
- Consistent interaction patterns

---

## 11. Risks & Mitigation

### Risk 1: Breaking Konva Functionality
**Mitigation:**
- Test each Konva component change thoroughly
- Keep changes purely cosmetic (colors, sizes)
- No structural changes to canvas rendering

### Risk 2: Accessibility Regression
**Mitigation:**
- Maintain all ARIA labels
- Test focus rings on all interactive elements
- Verify keyboard navigation paths
- Use contrast checker for all text

### Risk 3: Icon Library Issues
**Mitigation:**
- Lucide already installed and working (ImageViewer)
- All icons available in library
- Fallback to unicode if needed (NodeActionMenu)

### Risk 4: Inconsistent Application
**Mitigation:**
- Create component checklist
- Use design system reference doc
- Code review for consistency
- Visual regression testing

---

## 12. References

### Design Inspiration
- **Linear:** https://linear.app
- **Figma:** https://figma.com (subtle UI)
- **Notion:** https://notion.so (clean modals)
- **GitHub:** https://github.com (refined controls)

### Icon Library
- **Lucide React:** https://lucide.dev
- **Already installed:** `lucide-react@0.545.0`

### Tailwind Documentation
- **Colors:** https://tailwindcss.com/docs/customizing-colors
- **Spacing:** https://tailwindcss.com/docs/customizing-spacing
- **Shadows:** https://tailwindcss.com/docs/box-shadow

---

## Appendix A: Component Transformation Checklist

Use this checklist during implementation to ensure consistency:

### Per Component:
- [ ] Replace inline SVGs with Lucide icons
- [ ] Update spacing to match design system
- [ ] Apply correct border radius
- [ ] Use subtle shadows (shadow-sm, shadow, shadow-md)
- [ ] Update text sizes and weights
- [ ] Apply proper color palette
- [ ] Add smooth transitions (150-200ms)
- [ ] Verify focus states
- [ ] Test all interactions
- [ ] Check accessibility

### Global Checks:
- [ ] No use of `border-2` (use `border` only)
- [ ] No use of `rounded-2xl` (use `rounded-xl` max)
- [ ] No use of `shadow-2xl` (use `shadow-lg` max)
- [ ] No gradients except where specified
- [ ] Consistent button sizing (`px-4 py-2` default)
- [ ] Consistent input styling
- [ ] All icons 16px/20px/24px
- [ ] All font weights: 400, 500, 600 only

---

## Appendix B: Color Palette Reference Card

### Backgrounds
```css
#FFFFFF    bg-white           Main surfaces
#F9FAFB    bg-gray-50         Canvas, secondary
#F3F4F6    bg-gray-100        Hover states
#111827    bg-gray-900        Dark surfaces
```

### Text
```css
#111827    text-gray-900      Primary text
#374151    text-gray-700      Secondary text
#6B7280    text-gray-500      Tertiary text
#9CA3AF    text-gray-400      Disabled text
```

### Borders
```css
#E5E7EB    border-gray-200    Default border
#D1D5DB    border-gray-300    Emphasized border
#F3F4F6    border-gray-100    Subtle divider
```

### Accent (Orange)
```css
#F97316    bg-orange-500      Lighter accent
#EA580C    bg-orange-600      Primary accent (main)
#C2410C    bg-orange-700      Hover/active
#FFF7ED    bg-orange-50       Subtle background
#FED7AA    border-orange-200  Subtle border
```

---

## Appendix C: Typography Reference Card

### Sizes
```
text-xs:    12px / 16px line-height
text-sm:    14px / 20px line-height
text-base:  16px / 24px line-height
text-lg:    18px / 28px line-height
text-xl:    20px / 28px line-height
text-2xl:   24px / 32px line-height
```

### Weights
```
font-normal:    400
font-medium:    500
font-semibold:  600
font-bold:      700 (rare)
```

### Common Patterns
```tsx
// Page title
className="text-xl font-bold text-gray-900"

// Section header
className="text-base font-semibold text-gray-900"

// Label (uppercase)
className="text-xs font-semibold text-gray-500 uppercase tracking-wide"

// Body text
className="text-sm text-gray-700"

// Hint text
className="text-xs text-gray-500"

// Button text
className="text-sm font-medium"
```

---

**End of PRD**

---

**Document Metadata:**
- **Project:** NODEM Mind Map Application
- **Feature:** Minimal UI Redesign (Linear-inspired)
- **PRD Number:** 0003
- **Author:** Claude (Frontend Developer Agent)
- **Date:** 2025-10-26
- **Version:** 1.0
- **Status:** Draft → Ready for Implementation

**Related Documents:**
- `0001-prd-nodem-core.md` - Core functionality
- `0002-prd-custom-node-relationships.md` - Relationship system
- `0003-prd-auto-focus-camera.md` - Auto focus feature

**Implementation Tracking:**
- Will be tracked in: `tasks-0003-prd-minimal-ui-redesign.md`
- Estimated Duration: 6-7 days
- Complexity: Medium (cosmetic changes only)
- Risk Level: Low (no structural changes)
