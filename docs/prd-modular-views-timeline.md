# PRD: Modular Views System + Timeline View

**Version:** 1.0
**Date:** 2025-10-28
**Status:** In Development
**Author:** Claude Code

---

## 1. Overview

Implement a modular multi-view system for NODEM projects where each project can optionally enable different visualization modes (Timeline, Kanban, Matrix) through separate JSON files. The first implementation will be Timeline View for chronological data visualization.

### Goals

1. **Modularity**: Each view type has its own separate JSON file
2. **Independence**: Views can exist independently or reference mindmap nodes
3. **Opt-in**: Projects only include views they need
4. **Consistency**: Shared UI patterns and interactions across all views
5. **Timeline First**: Implement Timeline as the first additional view

---

## 2. Project Structure (Modular Format)

### 2.1 Folder-Based Projects

Projects transition from single JSON file to folder structure:

**Before (Current):**
```
sample-projects/
├── wwi-complete.json
└── ai-risks.json
```

**After (Modular):**
```
sample-projects/
├── wwi-complete/
│   ├── project.json          # Metadata + view config
│   ├── mindmap.json          # Mindmap nodes
│   ├── timeline.json         # Timeline events (optional)
│   └── assets/               # Images, etc.
│       └── verdun.jpg
│
└── ai-risks/
    ├── project.json          # Metadata
    └── mindmap.json          # Mindmap only (no timeline)
```

### 2.2 File Specifications

#### `project.json` - Project Metadata

```json
{
  "projectId": "wwi-complete",
  "version": "1.0.0",
  "metadata": {
    "title": "Primera Guerra Mundial 1914-1918",
    "description": "Análisis completo de la Primera Guerra Mundial",
    "createdAt": 1730116800000,
    "updatedAt": 1730116800000
  },
  "views": {
    "mindmap": {
      "enabled": true,
      "default": true,
      "file": "mindmap.json"
    },
    "timeline": {
      "enabled": true,
      "file": "timeline.json"
    }
  }
}
```

#### `mindmap.json` - Mindmap Data

```json
{
  "rootNodeId": "root",
  "nodes": {
    "root": {
      "id": "root",
      "title": "Primera Guerra Mundial",
      "description": "...",
      "children": ["causes", "battles", "consequences"],
      "level": 0,
      "parentId": null,
      "position": { "x": 100, "y": 300 },
      "isExpanded": true,
      "isVisible": true,
      "createdAt": 1730116800000,
      "updatedAt": 1730116800000
    }
  }
}
```

#### `timeline.json` - Timeline Events (Optional)

```json
{
  "config": {
    "startDate": "1914-01-01",
    "endDate": "1918-12-31",
    "granularity": "month",
    "tracks": [
      {
        "id": "political",
        "name": "Eventos Políticos",
        "color": "#3b82f6"
      },
      {
        "id": "military",
        "name": "Batallas",
        "color": "#ef4444"
      }
    ]
  },
  "events": [
    {
      "id": "assassination",
      "title": "Asesinato del Archiduque",
      "description": "Francisco Fernando asesinado en Sarajevo",
      "date": "1914-06-28",
      "track": "political",
      "linkedNodeId": "assassination",
      "images": [
        {
          "url": "assets/assassination.jpg",
          "caption": "Asesinato en Sarajevo"
        }
      ]
    }
  ]
}
```

---

## 3. TypeScript Interfaces

### 3.1 Project Structure Types

```typescript
// Project metadata
interface ProjectMetadata {
  projectId: string;
  version: string;
  metadata: {
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
  };
  views: {
    [viewType: string]: ViewConfig;
  };
}

interface ViewConfig {
  enabled: boolean;
  default?: boolean;
  file: string;
  config?: Record<string, any>;
}

// Complete project bundle
interface ProjectBundle {
  metadata: ProjectMetadata;
  mindmap?: MindmapData;
  timeline?: TimelineData;
  kanban?: KanbanData;
}

// Timeline specific types
interface TimelineData {
  config: TimelineConfig;
  events: TimelineEvent[];
}

interface TimelineConfig {
  startDate: string;
  endDate: string;
  granularity: 'year' | 'month' | 'day';
  tracks: TimelineTrack[];
}

interface TimelineTrack {
  id: string;
  name: string;
  color: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  track: string;
  linkedNodeId?: string;
  images?: Array<{
    url: string;
    caption: string;
  }>;
}
```

---

## 4. Timeline View Specification

### 4.1 Visual Design

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ NODEM | WWI 1914-1918              [👁️ Views ▼] [⚙️]  │
└─────────────────────────────────────────────────────────┘
│                                                           │
│ Sidebar  │ Timeline Canvas                               │
│          │ ┌────────────────────────────────────────┐    │
│          │ │ 1914    1915    1916    1917    1918  │    │
│          │ ├────────────────────────────────────────┤    │
│          │ │ Political │ ●────────●─────────●      │    │
│          │ │ Military  │     ●────────────●────●   │    │
│          │ │ Social    │         ●─────────●       │    │
│          │ └────────────────────────────────────────┘    │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### 4.2 Visual Elements

**Time Axis:**
- Horizontal axis with date labels
- Zoom levels: decade → year → month → day
- Pan with mouse drag or trackpad
- Scroll wheel to zoom in/out

**Tracks:**
- Horizontal lanes for different event categories
- Color-coded based on track configuration
- Fixed height per track (80px)
- Label on left side

**Events:**
- Point events: Circle marker (●)
- Duration events: Rounded rectangle spanning dates
- Hover: Tooltip with title and date
- Click: Opens NodeDetails panel (if linkedNodeId exists)

**Visual Style:**
- Colors: Use track.color from config
- Typography: Inter font (consistent with sidebar)
- Spacing: 16px between tracks
- Event markers: 12px diameter circles
- Duration bars: 6px height

### 4.3 Interactions

**Navigation:**
- Drag canvas: Pan timeline left/right
- Scroll wheel: Zoom in/out
- Double-click event: Open node details
- Pinch gesture (trackpad): Zoom

**Event Details:**
- Hover: Show tooltip with title, date, track
- Click: Open NodeDetails panel (right sidebar)
- If linkedNodeId exists: Show mindmap node details
- If no linkedNodeId: Show timeline event details only

**View Switching:**
- Dropdown in header: "Views"
- Options: 🗺️ Mindmap, 📅 Timeline
- Smooth transition between views
- Maintain zoom/pan state when returning

---

## 5. Component Architecture

### 5.1 New Components

```
src/
├── components/
│   ├── Canvas/
│   │   ├── MindmapCanvas.tsx      (rename from Canvas.tsx)
│   │   ├── TimelineCanvas.tsx     (NEW)
│   │   ├── ViewContainer.tsx      (NEW - renders active view)
│   │   └── NodeDetails.tsx        (existing - reuse)
│   │
│   ├── Timeline/
│   │   ├── TimelineAxis.tsx       (NEW - date axis)
│   │   ├── TimelineTrack.tsx      (NEW - single track)
│   │   ├── TimelineEvent.tsx      (NEW - event marker)
│   │   └── TimelineGrid.tsx       (NEW - background grid)
│   │
│   └── Layout/
│       ├── ViewSwitcher.tsx       (NEW - view dropdown)
│       └── Sidebar.tsx            (existing)
│
├── stores/
│   ├── projectStore.ts            (UPDATE - handle ProjectBundle)
│   ├── uiStore.ts                 (UPDATE - add currentView)
│   └── timelineStore.ts           (NEW - timeline state)
│
├── utils/
│   ├── projectLoader.ts           (NEW - load modular projects)
│   └── timelineLayout.ts          (NEW - timeline calculations)
│
└── types/
    ├── project.ts                 (UPDATE - modular types)
    └── timeline.ts                (NEW - timeline types)
```

### 5.2 Key Component Logic

**ViewContainer.tsx:**
```typescript
export default function ViewContainer() {
  const { currentView } = useUIStore();
  const { currentProject } = useProjectStore();

  if (!currentProject) return <div>No project loaded</div>;

  switch (currentView) {
    case 'mindmap':
      return <MindmapCanvas />;
    case 'timeline':
      return currentProject.timeline ? <TimelineCanvas /> : <NoTimelineView />;
    default:
      return <MindmapCanvas />;
  }
}
```

**TimelineCanvas.tsx:**
```typescript
export default function TimelineCanvas() {
  const { timeline } = useProjectStore();
  const { zoom, pan, setZoom, setPan } = useTimelineStore();

  // Handle zoom/pan
  // Render TimelineAxis
  // Render TimelineTracks
  // Render TimelineEvents

  return (
    <div className="w-full h-full bg-gray-50 overflow-hidden">
      <Stage width={width} height={height}>
        <Layer>
          <TimelineAxis config={timeline.config} zoom={zoom} pan={pan} />
          {timeline.config.tracks.map(track => (
            <TimelineTrack key={track.id} track={track} events={eventsForTrack} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
```

---

## 6. Project Loader Implementation

### 6.1 Folder Picker Integration

```typescript
// src/utils/projectLoader.ts

export async function loadModularProject(): Promise<ProjectBundle> {
  // Use File System Access API to pick folder
  const dirHandle = await window.showDirectoryPicker();

  // Load project.json first
  const metadataFile = await dirHandle.getFileHandle('project.json');
  const metadataContent = await metadataFile.getFile();
  const metadata: ProjectMetadata = JSON.parse(await metadataContent.text());

  const bundle: ProjectBundle = { metadata };

  // Load enabled views
  for (const [viewType, viewConfig] of Object.entries(metadata.views)) {
    if (!viewConfig.enabled) continue;

    try {
      const viewFile = await dirHandle.getFileHandle(viewConfig.file);
      const viewContent = await viewFile.getFile();
      const viewData = JSON.parse(await viewContent.text());

      bundle[viewType as keyof ProjectBundle] = viewData;
    } catch (err) {
      console.warn(`View file ${viewConfig.file} not found, skipping`);
    }
  }

  return bundle;
}
```

### 6.2 Backward Compatibility

Support loading old single-file JSON projects:

```typescript
export async function loadLegacyProject(file: File): Promise<ProjectBundle> {
  const content = await file.text();
  const legacyProject = JSON.parse(content);

  // Convert to modular format
  return {
    metadata: {
      projectId: legacyProject.projectId,
      version: '1.0.0',
      metadata: legacyProject.metadata,
      views: {
        mindmap: { enabled: true, default: true, file: 'mindmap.json' }
      }
    },
    mindmap: {
      rootNodeId: legacyProject.rootNodeId,
      nodes: legacyProject.nodes
    }
  };
}
```

---

## 7. Timeline Layout Engine

### 7.1 Date Calculations

```typescript
// src/utils/timelineLayout.ts

export function calculateTimelineLayout(
  config: TimelineConfig,
  events: TimelineEvent[],
  canvasWidth: number
): LayoutResult {
  const { startDate, endDate } = config;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const totalDuration = end - start;

  // Calculate x position for each event
  const layoutedEvents = events.map(event => {
    const eventTime = new Date(event.date).getTime();
    const progress = (eventTime - start) / totalDuration;
    const x = progress * canvasWidth;

    return {
      ...event,
      x,
      y: getYForTrack(event.track, config.tracks)
    };
  });

  return { events: layoutedEvents };
}
```

---

## 8. UI Updates

### 8.1 ViewSwitcher Component

Location: Header, right side before settings icon

```typescript
<header className="...">
  <div className="flex items-center space-x-6">
    <h1>NODEM</h1>
    <div className="h-6 w-px bg-gray-300"></div>
    <p>{currentProject?.metadata.title}</p>
  </div>

  <div className="flex items-center space-x-2">
    <ViewSwitcher />  {/* NEW */}
    <button>⚙️</button>
  </div>
</header>
```

### 8.2 ViewSwitcher Dropdown

```typescript
export default function ViewSwitcher() {
  const { currentView, setView } = useUIStore();
  const { currentProject } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);

  const availableViews = useMemo(() => {
    if (!currentProject?.metadata.views) return ['mindmap'];
    return Object.entries(currentProject.metadata.views)
      .filter(([_, config]) => config.enabled)
      .map(([view, _]) => view);
  }, [currentProject]);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        <Eye className="w-4 h-4" />
        <span>Views</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
          {availableViews.map(view => (
            <button
              key={view}
              onClick={() => {
                setView(view);
                setIsOpen(false);
              }}
              className={currentView === view ? 'bg-orange-50' : ''}
            >
              {VIEW_ICONS[view]} {VIEW_NAMES[view]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 9. Sample Projects Update

### 9.1 WWI Complete - Add Timeline

Create `sample-projects/wwi-complete/timeline.json` with 15-20 key events:

**Events to include:**
- June 28, 1914: Assassination of Archduke Franz Ferdinand
- July 28, 1914: Austria-Hungary declares war on Serbia
- August 1914: Germany invades Belgium
- September 1914: First Battle of the Marne
- April 1915: Second Battle of Ypres (gas attack)
- February 1916: Battle of Verdun begins
- July 1916: Battle of the Somme begins
- April 1917: USA enters the war
- November 1917: Russian Revolution
- November 11, 1918: Armistice signed

**Tracks:**
- Political: Declarations, treaties, revolutions
- Military: Major battles and campaigns
- Technological: New weapons, tactics

### 9.2 AI Risks - No Timeline

Keep as mindmap-only project (no timeline.json) to demonstrate optional nature of views.

---

## 10. Success Metrics

### 10.1 Functional Requirements

- ✅ Load modular projects from folders
- ✅ Display timeline view with correct chronology
- ✅ Switch between mindmap and timeline smoothly
- ✅ Click timeline event → open node details
- ✅ Zoom and pan timeline
- ✅ Support projects without timeline (graceful degradation)

### 10.2 Performance Requirements

- Timeline renders 50+ events at 60fps
- View switching < 200ms
- Project loading < 1s for typical project

### 10.3 UX Requirements

- Intuitive view switching
- Consistent visual language across views
- Clear indication of available views
- Keyboard shortcuts: M (mindmap), T (timeline)

---

## 11. Implementation Phases

### Phase 1: Modular Project Structure
1. Create TypeScript types for modular projects
2. Implement projectLoader with folder picker
3. Update projectStore to handle ProjectBundle
4. Add backward compatibility for single-file projects

### Phase 2: View System Infrastructure
1. Create ViewContainer component
2. Implement ViewSwitcher dropdown
3. Update UIStore with currentView state
4. Rename Canvas.tsx → MindmapCanvas.tsx

### Phase 3: Timeline Implementation
1. Create timeline TypeScript types
2. Implement TimelineCanvas component
3. Build timeline layout engine
4. Create TimelineAxis, TimelineTrack, TimelineEvent components
5. Add zoom/pan controls

### Phase 4: Integration & Polish
1. Integrate timeline with NodeDetails
2. Update sample projects to modular format
3. Add WWI timeline with 20 events
4. Test view switching
5. Add keyboard shortcuts

### Phase 5: Testing & Deployment
1. Test with both modular and legacy projects
2. Build and deploy to Firebase
3. Update documentation
4. Tag as v1.5.0

---

## 12. Future Enhancements

**Phase 6+ (Post-MVP):**
- Kanban view with drag & drop
- Matrix view for analysis
- Export timeline as image/PDF
- Timeline collaboration (multi-user editing)
- Timeline templates for common use cases
- Custom track colors and icons
- Timeline filtering and search

---

## 13. Technical Considerations

### 13.1 File System Access API

- Requires HTTPS or localhost
- User must grant folder access permission
- Not supported in all browsers (graceful degradation)

### 13.2 Performance

- Virtualize timeline events for large datasets (100+ events)
- Lazy load images in timeline events
- Memoize timeline layout calculations

### 13.3 Data Integrity

- Validate JSON structure on load
- Handle missing files gracefully
- Provide clear error messages for malformed data

---

## 14. Open Questions

1. ~~Should timeline support nested/grouped events?~~ → No, keep simple for MVP
2. ~~Allow creating timeline events directly in UI?~~ → No, JSON-only for MVP
3. ~~Support multiple timelines per project?~~ → No, one timeline per project
4. ~~Timeline export formats?~~ → Future enhancement

---

**End of PRD**
