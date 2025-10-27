# Design System - NODEM

**Linear-Inspired Minimal Interface**

---

## Overview

This design system defines the visual language for NODEM, inspired by Linear's minimal and professional aesthetic. All components follow these principles for consistency and clarity.

## Design Principles

1. **Minimal & Spacious** - Generous whitespace, clean layouts
2. **Subtle Depth** - Refined shadows, 1px borders, no heavy effects
3. **Professional Typography** - Clear hierarchy, readable scales
4. **Muted Color Palette** - Soft backgrounds, single accent color (Orange)
5. **Consistent Icons** - Lucide React, stroke-based, uniform sizing
6. **Smooth Interactions** - 150-200ms transitions, subtle hover states

---

## Color Palette

### Background Colors

```css
bg-white: #FFFFFF          /* Main surfaces, cards, modals */
bg-gray-50: #F9FAFB        /* Canvas background, secondary surfaces */
bg-gray-100: #F3F4F6       /* Hover states, tertiary surfaces */
bg-gray-900: #111827       /* Modals, overlays (relationship sidebar) */
```

### Text Colors

```css
text-gray-900: #111827     /* Primary text (headings, titles) */
text-gray-700: #374151     /* Secondary text (body content) */
text-gray-500: #6B7280     /* Tertiary text (labels, hints) */
text-gray-400: #9CA3AF     /* Quaternary text (placeholders, disabled) */
```

### Border Colors

```css
border-gray-200: #E5E7EB   /* Default borders (most UI elements) */
border-gray-300: #D1D5DB   /* Emphasized borders (inputs, cards) */
border-gray-100: #F3F4F6   /* Subtle dividers */
```

### Accent Colors (Orange)

```css
orange-500: #F97316        /* Primary actions, links, focus states */
orange-600: #EA580C        /* Hover states on primary buttons */
orange-50: #FFF7ED         /* Subtle backgrounds for highlights */
```

---

## Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
```

### Type Scale

| Token         | Size    | Pixels | Usage                           |
| ------------- | ------- | ------ | ------------------------------- |
| `text-xs`     | 0.75rem | 12px   | Labels, badges, small text      |
| `text-sm`     | 0.875rem| 14px   | Body text, secondary content    |
| `text-base`   | 1rem    | 16px   | Default body text               |
| `text-lg`     | 1.125rem| 18px   | Subtitles, emphasized content   |
| `text-xl`     | 1.25rem | 20px   | Section headings                |
| `text-2xl`    | 1.5rem  | 24px   | Page titles, modal headings     |

### Font Weights

- **Normal (400)**: Body text, default content
- **Medium (500)**: Labels, emphasized text
- **Semibold (600)**: Headings, buttons, important text

### Line Heights

```css
leading-tight: 1.25        /* Headings, compact text */
leading-normal: 1.5        /* Body text, readable content */
leading-relaxed: 1.625     /* Long-form content */
```

---

## Spacing

**4px Grid System**

| Token        | Value   | Pixels | Common Usage            |
| ------------ | ------- | ------ | ----------------------- |
| `spacing-1`  | 0.25rem | 4px    | Icon gaps, tight spaces |
| `spacing-2`  | 0.5rem  | 8px    | Small padding, gaps     |
| `spacing-3`  | 0.75rem | 12px   | Medium padding          |
| `spacing-4`  | 1rem    | 16px   | Default padding         |
| `spacing-6`  | 1.5rem  | 24px   | Large padding, margins  |
| `spacing-8`  | 2rem    | 32px   | Section spacing         |

### Tailwind Utility Mapping

```css
p-2   /* 8px padding */
p-3   /* 12px padding */
p-4   /* 16px padding */
p-6   /* 24px padding */
gap-2 /* 8px gap */
gap-4 /* 16px gap */
```

---

## Border Radius

| Token       | Value     | Pixels | Usage                      |
| ----------- | --------- | ------ | -------------------------- |
| `rounded`   | 0.375rem  | 6px    | Buttons, small elements    |
| `rounded-md`| 0.5rem    | 8px    | Cards, medium elements     |
| `rounded-lg`| 0.75rem   | 12px   | Modals, large containers   |
| `rounded-xl`| 1rem      | 16px   | Full-screen overlays       |

---

## Shadows

**Subtle, layered shadow system**

```css
shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow:     0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### Usage Guidelines

- **Buttons**: `shadow-sm` default, `shadow` on hover
- **Cards/Nodes**: `shadow-md`
- **Modals**: `shadow-xl`
- **Overlays**: `shadow-2xl`

---

## Icons

### Library

**Lucide React** (v0.545.0)

- Stroke-based icons
- Consistent visual weight
- Modern, minimal aesthetic

### Sizing

| Size | Pixels | Usage                      |
| ---- | ------ | -------------------------- |
| 16px | `size={16}` | Small buttons, inline icons |
| 20px | `size={20}` | Default UI icons           |
| 24px | `size={24}` | Large buttons, headers     |

### Stroke Width

```jsx
strokeWidth={1.5}  // Default
strokeWidth={2}    // Emphasized
```

### Common Icons

```jsx
import {
  Menu,           // Sidebar toggle
  X,              // Close modals
  Plus,           // Add actions
  Edit2,          // Edit buttons
  Trash2,         // Delete actions
  ZoomIn,         // Zoom in
  ZoomOut,        // Zoom out
  Maximize2,      // Fit to screen
  Link2,          // Relationships
  Upload,         // File uploads
  Image,          // Image placeholders
} from 'lucide-react';
```

---

## Interactions

### Transitions

```css
transition-fast: 150ms ease   /* Hover, focus states */
transition-base: 200ms ease   /* Default interactions */
```

### Hover States

**Buttons:**
```css
bg-white hover:bg-gray-50         /* Light buttons */
bg-orange-500 hover:bg-orange-600 /* Primary buttons */
```

**Interactive Elements:**
```css
hover:bg-gray-50              /* Subtle background change */
hover:border-gray-300         /* Border emphasis */
hover:shadow-md               /* Elevation change */
```

### Focus States

```css
focus:outline-none
focus:ring-2
focus:ring-orange-500
focus:ring-offset-2
```

---

## Component Patterns

### Button Styles

**Primary Button:**
```jsx
<button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-150">
  Action
</button>
```

**Secondary Button:**
```jsx
<button className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-150">
  Cancel
</button>
```

### Input Styles

```jsx
<input className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
```

### Card Styles

```jsx
<div className="bg-white rounded-lg border border-gray-200 shadow-md p-4">
  {/* Content */}
</div>
```

### Modal Styles

```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 z-50">
  <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl">
    {/* Modal content */}
  </div>
</div>
```

---

## Usage Examples

### Node Component

```jsx
// Before
<rect fill="#2b2b2b" />

// After
<rect fill="#FFFFFF" stroke="#E5E7EB" strokeWidth={1} />
```

### Sidebar Button

```jsx
// Before
<button className="bg-gradient-to-r from-orange-500 to-orange-600">
  🏠 Home
</button>

// After
<button className="bg-white hover:bg-gray-50 text-gray-700 transition-colors duration-150">
  <Home size={20} strokeWidth={1.5} />
  Home
</button>
```

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- **Primary text (gray-900)**: 16.0:1 contrast on white
- **Secondary text (gray-700)**: 12.7:1 contrast on white
- **Tertiary text (gray-500)**: 7.0:1 contrast on white

### Focus Indicators

All interactive elements have visible focus states with 2px orange ring.

### Touch Targets

Minimum touch target size: 44x44px (iOS guidelines)

---

## Version History

### v1.4.0 (Current)
- Linear-inspired minimal interface
- Complete design system overhaul
- Lucide React icon integration
- Refined shadow and spacing systems

### v1.3.0
- Custom node relationships
- Curved Bézier connection lines

---

## Related Documentation

- [README.md](../README.md) - Project overview
- [PRD: Minimal UI Redesign](../tasks/0003-prd-minimal-ui-redesign.md)
- [Task List](../tasks/tasks-0003-prd-minimal-ui-redesign.md)
- [RELATIONSHIPS.md](./RELATIONSHIPS.md) - Relationship system docs
