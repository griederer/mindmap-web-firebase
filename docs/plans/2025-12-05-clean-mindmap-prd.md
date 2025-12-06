# PRD: MyMindmap Clean v2.0

## Executive Summary

Refactorización del proyecto `mindmap-web-firebase` para crear una aplicación de mindmapping pura, eliminando todas las funcionalidades no esenciales (timeline, canvas elements extras) y optimizando las transiciones/animaciones para una experiencia fluida.

**Versión actual**: 1.3 (con timeline y elementos de canvas integrados)
**Versión objetivo**: 2.0 (mindmap puro, optimizado)

---

## 1. Objetivos

### 1.1 Objetivos Principales
- [ ] Eliminar toda funcionalidad de Timeline
- [ ] Eliminar elementos de canvas extras (shapes, stickies, frames, text blocks)
- [ ] Mantener SOLO funcionalidad de mindmap puro
- [ ] Optimizar animaciones y transiciones
- [ ] Reducir complejidad del código base

### 1.2 Métricas de Éxito
| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Archivos en src/components | 25+ | ~15 |
| Bundle size (JS) | 514 KB | < 400 KB |
| Debounce animación | 50ms | 20ms |
| Animación zoom manual | 0ms | 300ms |
| Tipos TypeScript (líneas) | ~500 | ~200 |

---

## 2. Funcionalidades a MANTENER

### 2.1 Core Mindmap
| Feature | Descripción | Componente |
|---------|-------------|------------|
| **Nodos jerárquicos** | Árbol padre-hijo con expand/collapse | NodeComponent.tsx |
| **Conectores Bezier** | Líneas curvas entre nodos | Connector.tsx |
| **Layout horizontal** | Algoritmo de árbol izquierda-derecha | layoutEngine.ts |
| **Auto-focus camera** | Cámara sigue al nodo seleccionado | viewportStore.ts |
| **Zoom/Pan** | Control de cámara con rueda y drag | Canvas.tsx, ZoomControls.tsx |
| **Selección de nodos** | Click para seleccionar, highlight naranja | uiStore.ts |
| **Focus mode** | Blur nodos no relacionados | NodeComponent.tsx |

### 2.2 Edición de Nodos
| Feature | Descripción | Componente |
|---------|-------------|------------|
| **Editar título/descripción** | Modal de edición | NodeEditModal.tsx |
| **Panel de información** | Vista detallada inline | NodeInfoPanel.tsx |
| **Panel de detalles** | Overlay con info completa | NodeDetails.tsx |
| **Menú contextual** | Acciones: agregar hijo, editar, eliminar | NodeActionMenu.tsx |
| **Agregar nodos hijos** | Crear nodo hijo con un click | projectStore.ts |
| **Eliminar nodos** | Eliminar con confirmación | projectStore.ts |

### 2.3 Imágenes
| Feature | Descripción | Componente |
|---------|-------------|------------|
| **Galería de imágenes** | Thumbnails en nodo | ImageGallery.tsx |
| **Visor fullscreen** | Ver imagen completa | ImageViewer.tsx |
| **Subir imágenes** | Upload a nodo | ImageUpload.tsx |

### 2.4 Relaciones Personalizadas
| Feature | Descripción | Componente |
|---------|-------------|------------|
| **Líneas mesh** | Conexiones entre cualquier par de nodos | RelationshipLines.tsx |
| **Sidebar de relaciones** | Gestión de relaciones | RelationshipSidebar/ |
| **Toggle visibilidad** | Mostrar/ocultar relaciones | relationshipStore.ts |
| **Estilos de línea** | Solid, dashed, dotted, colores | RelationshipModal.tsx |

### 2.5 UI General
| Feature | Descripción | Componente |
|---------|-------------|------------|
| **Sidebar izquierda** | Acciones y proyectos | Sidebar.tsx |
| **Controles de zoom** | Botones +/- y reset | ZoomControls.tsx |
| **Cargar proyecto** | Import .pmap/.json | projectLoader.ts |
| **Crear proyecto** | Nuevo mindmap vacío | projectStore.ts |

---

## 3. Funcionalidades a ELIMINAR

### 3.1 Timeline (Eliminar completamente)
| Archivo | Razón |
|---------|-------|
| `components/Timeline/TimelineCanvas.tsx` | Vista standalone no usada |
| `components/Timeline/TimelineRibbon.tsx` | Toggle button timeline |
| `components/Canvas/TimelineComponent.tsx` | Renderizado de tracks |
| `components/Canvas/TimelineEventInfoPanel.tsx` | Panel de eventos |

### 3.2 Tipos Timeline (Eliminar de types/)
```typescript
// ELIMINAR de node.ts:
nodeType?: 'default' | 'timeline' | 'year' | 'event';
timelineConfig?: { startYear, endYear, layout };
year?: number;
eventDate?: string;
eventCategory?: string;

// ELIMINAR de project.ts:
TimelineData, TimelineConfig, TimelineTrack, TimelineEvent
KanbanData, MatrixData (futures features no implementadas)
ProjectBundle.timeline, .kanban, .matrix
ModularProjectMetadata.views
ViewConfig, ViewType, AVAILABLE_VIEWS
```

### 3.3 Estado Timeline (Eliminar de stores/)
```typescript
// ELIMINAR de uiStore.ts:
selectedTimelineEvent: TimelineEvent | null
timelineRibbonOpen: boolean
currentView: ViewType
selectTimelineEvent()
toggleTimelineRibbon()
setTimelineRibbonOpen()
setView()
```

### 3.4 Canvas Elements Extras (Eliminar)
| Archivo | Tipo |
|---------|------|
| `ShapeElement.tsx` | Formas geométricas |
| `StickyNoteElement.tsx` | Notas adhesivas |
| `TextBlockElement.tsx` | Bloques de texto |
| `FrameElement.tsx` | Contenedores |
| `ElementActionMenu.tsx` | Menú de elementos |
| `ElementEditModal.tsx` | Editor de elementos |
| `elementStore.ts` | Store de elementos |
| `types/element.ts` | Tipos de elementos |

### 3.5 Otros
| Archivo/Código | Razón |
|----------------|-------|
| `ViewSwitcher.tsx` | Ya no hay vistas alternativas |
| `presentationStore.ts` | No usado activamente |
| Referencias en Canvas.tsx | Código de timeline |

---

## 4. Optimizaciones de Animación

### 4.1 Mejoras Propuestas

| Animación | Actual | Propuesto | Beneficio |
|-----------|--------|-----------|-----------|
| **Debounce auto-focus** | 50ms | 20ms | Respuesta más rápida |
| **Zoom manual** | Instant | 300ms EaseOut | Más suave |
| **Relationship lines** | Instant | 400ms fade | Menos jarring |
| **Node appear** | 1.2s | 0.8s | Más ágil |
| **Node disappear** | 1.0s | 0.6s | Más ágil |
| **Auto-focus duration** | 4.0s | 2.5s | Menos espera |

### 4.2 Nuevas Animaciones
- **Zoom con rueda**: Añadir transición suave (300ms)
- **Relationship lines**: Fade-in al crear (400ms)
- **Context menu**: Slide-in sutil (200ms)
- **Info panel**: Spring physics opcional

### 4.3 Configuración de Animaciones (Nuevo)
```typescript
// src/config/animations.ts
export const ANIMATION_CONFIG = {
  node: {
    appear: { duration: 0.8, easing: 'easeOut' },
    disappear: { duration: 0.6, easing: 'easeIn' },
    position: { duration: 0.5, easing: 'easeInOut' },
    focusBlur: { duration: 0.4, easing: 'easeInOut' },
  },
  camera: {
    autoFocus: { duration: 2.5, easing: 'easeInOut' },
    manualZoom: { duration: 0.3, easing: 'easeOut' },
    debounce: 20,
  },
  connector: {
    fadeIn: { duration: 0.35, easing: 'easeOut' },
    fadeOut: { duration: 0.3, easing: 'easeIn' },
  },
  relationship: {
    appear: { duration: 0.4, easing: 'easeOut' },
  },
  ui: {
    panel: { duration: 0.3, easing: 'easeOut' },
    menu: { duration: 0.2, easing: 'easeOut' },
  },
};
```

---

## 5. Estructura Final

### 5.1 Árbol de Archivos Objetivo
```
src/
├── App.tsx
├── main.tsx
├── index.css
│
├── config/
│   └── animations.ts              [NUEVO]
│
├── components/
│   ├── Canvas/
│   │   ├── Canvas.tsx             [SIMPLIFICADO]
│   │   ├── Connector.tsx
│   │   ├── NodeComponent.tsx
│   │   ├── NodeInfoPanel.tsx
│   │   ├── NodeDetails.tsx
│   │   ├── NodeEditModal.tsx
│   │   ├── NodeActionMenu.tsx
│   │   ├── RelationshipLines.tsx
│   │   ├── RelationshipAssignMenu.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ImageViewer.tsx
│   │   ├── ImageUpload.tsx
│   │   └── ZoomControls.tsx
│   │
│   ├── Layout/
│   │   └── Sidebar.tsx            [SIMPLIFICADO]
│   │
│   └── RelationshipSidebar/
│       ├── RelationshipSidebar.tsx
│       ├── RelationshipList.tsx
│       └── RelationshipModal.tsx
│
├── stores/
│   ├── projectStore.ts
│   ├── uiStore.ts                 [SIMPLIFICADO]
│   ├── viewportStore.ts           [OPTIMIZADO]
│   ├── relationshipStore.ts
│   └── sidebarStore.ts
│
├── types/
│   ├── node.ts                    [SIMPLIFICADO]
│   ├── project.ts                 [SIMPLIFICADO]
│   ├── relationship.ts
│   ├── action.ts
│   └── schemas.ts
│
├── utils/
│   ├── layoutEngine.ts
│   ├── autoFocusUtils.ts
│   └── projectLoader.ts           [SIMPLIFICADO]
│
├── lib/
│   └── firebase.ts
│
└── __tests__/
    └── ... (tests actualizados)
```

### 5.2 Archivos a Eliminar
```bash
# Timeline
rm -rf src/components/Timeline/
rm src/components/Canvas/TimelineComponent.tsx
rm src/components/Canvas/TimelineEventInfoPanel.tsx

# Canvas Elements
rm src/components/Canvas/ShapeElement.tsx
rm src/components/Canvas/StickyNoteElement.tsx
rm src/components/Canvas/TextBlockElement.tsx
rm src/components/Canvas/FrameElement.tsx
rm src/components/Canvas/ElementActionMenu.tsx
rm src/components/Canvas/ElementEditModal.tsx
rm src/stores/elementStore.ts
rm src/types/element.ts

# Otros
rm src/components/Layout/ViewSwitcher.tsx
rm src/stores/presentationStore.ts
```

---

## 6. Plan de Implementación

### Fase 1: Limpieza de Timeline (Prioridad Alta)
1. [ ] Eliminar directorio `components/Timeline/`
2. [ ] Eliminar `TimelineComponent.tsx` y `TimelineEventInfoPanel.tsx`
3. [ ] Limpiar imports y referencias en `Canvas.tsx`
4. [ ] Eliminar tipos timeline de `types/node.ts`
5. [ ] Eliminar tipos timeline de `types/project.ts`
6. [ ] Limpiar `uiStore.ts` de estado timeline
7. [ ] Eliminar `ViewSwitcher.tsx`
8. [ ] Actualizar `projectLoader.ts`

### Fase 2: Limpieza de Canvas Elements
1. [ ] Eliminar archivos de elementos (Shape, Sticky, Text, Frame)
2. [ ] Eliminar `elementStore.ts`
3. [ ] Eliminar `types/element.ts`
4. [ ] Limpiar referencias en `Canvas.tsx`
5. [ ] Limpiar `Sidebar.tsx` de botones de elementos

### Fase 3: Limpieza General
1. [ ] Eliminar `presentationStore.ts` si no se usa
2. [ ] Auditar imports no usados en todos los archivos
3. [ ] Ejecutar TypeScript check
4. [ ] Ejecutar tests

### Fase 4: Optimización de Animaciones
1. [ ] Crear `src/config/animations.ts`
2. [ ] Reducir debounce de 50ms a 20ms
3. [ ] Añadir animación a zoom manual (300ms)
4. [ ] Reducir duración de auto-focus (4s → 2.5s)
5. [ ] Acelerar animaciones de nodos (appear/disappear)
6. [ ] Añadir fade a relationship lines

### Fase 5: Testing y Deploy
1. [ ] Build sin errores
2. [ ] Test manual de todas las funcionalidades
3. [ ] Verificar animaciones suaves
4. [ ] Deploy a Firebase
5. [ ] Commit y push a GitHub

---

## 7. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Romper funcionalidad existente | Media | Alto | Tests antes/después |
| Imports huérfanos | Alta | Bajo | TSC check estricto |
| Animaciones stuttering | Baja | Medio | Test en dispositivos lentos |
| Pérdida de datos de proyecto | Baja | Alto | Backup antes de cambios |

---

## 8. Criterios de Aceptación

### Funcionalidad
- [ ] Crear mindmap nuevo funciona
- [ ] Cargar proyecto .pmap funciona
- [ ] Agregar/editar/eliminar nodos funciona
- [ ] Expand/collapse funciona con animación
- [ ] Auto-focus camera funciona
- [ ] Zoom/pan funciona
- [ ] Relaciones personalizadas funcionan
- [ ] Imágenes en nodos funcionan

### Performance
- [ ] Build sin warnings de TypeScript
- [ ] Bundle < 400KB
- [ ] Animaciones a 60fps
- [ ] Sin memory leaks

### Código
- [ ] No hay archivos de timeline
- [ ] No hay archivos de canvas elements
- [ ] No hay tipos no usados
- [ ] No hay imports huérfanos

---

## 9. Siguientes Pasos (Post v2.0)

Una vez completada la versión limpia, considerar:

1. **Drag & drop de nodos** - Reposicionamiento manual
2. **Undo/Redo** - Historial de acciones
3. **Colaboración real-time** - Firebase Firestore sync
4. **Export** - PNG, SVG, PDF
5. **Temas** - Dark mode, custom colors
6. **Keyboard shortcuts** - Navegación rápida
7. **Search** - Buscar nodos por texto
8. **Templates** - Plantillas predefinidas

---

*Documento creado: 2025-12-05*
*Versión: 1.0*
