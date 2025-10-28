# PRD: Timeline con Layout Horizontal de Tracks

## 1. Introduction/Overview

Este PRD define la reimplementación completa del componente Timeline dentro de la aplicación de mindmaps. El objetivo es transformar el timeline de un sistema de visualización vertical basado en años a un sistema de **tracks horizontales** que muestra eventos como círculos posicionados en carriles paralelos (Europa, Pacífico, Diplomacia).

**Contexto actual:**
- El timeline existe como una vista separada (botón "Timeline" en header)
- Los eventos se muestran verticalmente debajo de cada año
- El diseño no cumple con las expectativas visuales del usuario

**Objetivo:**
- Eliminar la vista Timeline del header
- Crear un tipo especial de nodo mindmap (`nodeType: 'timeline'`) que al expandirse muestra el timeline
- Implementar layout horizontal con tracks paralelos
- Mostrar eventos como círculos coloreados en sus tracks correspondientes
- Permitir clic en eventos para abrir InfoPanel con detalles

**Audiencia objetivo:**
Desarrollador junior que implementará esta feature desde cero, sin asumir conocimiento previo del codebase.

---

## 2. Goals (Measurable Objectives)

1. **Eliminar view switcher del header**
   - Métrica: ViewSwitcher component removido completamente
   - Verificación: No existe botón "Timeline" en el header

2. **Implementar timeline como nodo expandible**
   - Métrica: Nodo con `nodeType: 'timeline'` renderiza timeline al expandir
   - Verificación: Botón +/- funciona correctamente

3. **Layout horizontal de tracks**
   - Métrica: 3 tracks horizontales visibles (Europa, Pacífico, Diplomacia)
   - Verificación: Tracks paralelos con labels y colores correctos

4. **Eventos posicionados correctamente**
   - Métrica: Eventos aparecen en su año correcto sobre el track apropiado
   - Verificación: Fecha del evento coincide con posición horizontal

5. **Interacción con eventos**
   - Métrica: Clic en evento abre InfoPanel con título, fecha y descripción
   - Verificación: InfoPanel se posiciona correctamente y muestra datos del evento

6. **Nombres de eventos visibles**
   - Métrica: Cada evento muestra su título cerca del círculo
   - Verificación: Texto legible sin solapamiento

---

## 3. User Stories

**US1: Como usuario, quiero expandir un nodo timeline para ver eventos históricos**
- **Given:** Estoy viendo un mindmap con un nodo de tipo timeline
- **When:** Hago clic en el botón "+" del nodo timeline
- **Then:** El timeline se expande mostrando tracks horizontales con eventos

**US2: Como usuario, quiero ver eventos organizados por categoría en tracks**
- **Given:** El timeline está expandido
- **When:** Observo la visualización
- **Then:** Veo 3 tracks paralelos (Europa azul, Pacífico rojo, Diplomacia verde)
- **And:** Los eventos están posicionados en su track correspondiente

**US3: Como usuario, quiero saber qué evento representa cada círculo**
- **Given:** El timeline está expandido
- **When:** Miro los círculos en los tracks
- **Then:** Veo el nombre del evento junto a cada círculo

**US4: Como usuario, quiero leer detalles de un evento específico**
- **Given:** El timeline está expandido
- **When:** Hago clic en un círculo de evento
- **Then:** Se abre un InfoPanel mostrando título, fecha completa y descripción del evento

**US5: Como usuario, quiero cerrar el timeline para enfocarme en otros nodos**
- **Given:** El timeline está expandido
- **When:** Hago clic en el botón "-" del nodo timeline
- **Then:** El timeline se colapsa mostrando solo el nodo principal

**US6: Como usuario, quiero que el timeline no interfiera con la navegación del mindmap**
- **Given:** Estoy navegando el mindmap (zoom, pan)
- **When:** Interactúo con el canvas
- **Then:** El timeline se comporta como cualquier otro nodo (se mueve, escala, etc.)

---

## 4. Functional Requirements

### FR1: Node Type Extension
- **FR1.1:** Extender el tipo `Node` para incluir `nodeType: 'timeline' | 'default'`
- **FR1.2:** Agregar propiedad `timelineConfig` opcional al Node:
  ```typescript
  timelineConfig?: {
    startYear: number;
    endYear: number;
    layout: 'horizontal-with-tracks';
  }
  ```
- **FR1.3:** El nodo timeline debe tener comportamiento estándar de expansión/colapso

### FR2: TimelineComponent Redesign
- **FR2.1:** Renderizar eje horizontal con años desde `startYear` hasta `endYear`
- **FR2.2:** Renderizar 3 tracks horizontales paralelos:
  - Europa: color `#3B82F6` (azul)
  - Pacífico: color `#EF4444` (rojo)
  - Diplomacia: color `#10B981` (verde)
- **FR2.3:** Cada track debe tener:
  - Label visible en el lado izquierdo
  - Línea horizontal de longitud completa
  - Altura suficiente para eventos sin solapamiento
- **FR2.4:** Años deben estar espaciados uniformemente en el eje superior
- **FR2.5:** Líneas verticales punteadas desde cada año hasta el fondo del timeline

### FR3: Event Rendering
- **FR3.1:** Cada evento se renderiza como un círculo (`<Circle />`) con:
  - Radio: 8-12 pixels
  - Color: color del track al que pertenece
  - Posición X: basada en fecha del evento (interpolación entre años)
  - Posición Y: en el centro del track correspondiente
- **FR3.2:** Título del evento debe mostrarse:
  - Como `<Text />` junto al círculo
  - Sin solapamiento con otros títulos
  - Tamaño de fuente legible (12-14px)
  - Color oscuro para contraste (#1F2937)
- **FR3.3:** Hover sobre evento debe mostrar cursor pointer
- **FR3.4:** Clic en evento debe llamar a `selectTimelineEvent(event)`

### FR4: Canvas Integration
- **FR4.1:** Canvas.tsx debe detectar nodos con `nodeType === 'timeline'`
- **FR4.2:** Si nodo timeline tiene `isExpanded === true`, renderizar TimelineComponent
- **FR4.3:** Posición del timeline debe ser relativa a la posición del nodo timeline
- **FR4.4:** Timeline debe estar dentro del mismo Layer que los nodos

### FR5: ViewSwitcher Removal
- **FR5.1:** Eliminar componente ViewSwitcher de Header
- **FR5.2:** Eliminar lógica de cambio de vista en uiStore
- **FR5.3:** Eliminar propiedad `currentView` de uiStore (o dejar solo 'mindmap')
- **FR5.4:** Eliminar imports y referencias a ViewSwitcher en toda la app

### FR6: Timeline Event InfoPanel
- **FR6.1:** Ya implementado: TimelineEventInfoPanel component
- **FR6.2:** Debe renderizarse cuando `selectedTimelineEvent !== null`
- **FR6.3:** Posición del panel:
  - A la derecha del evento clickeado
  - Offset de 20px para separación visual
  - Alineado verticalmente con el centro del evento
- **FR6.4:** Panel debe mostrar:
  - Título del evento (font-weight: 600)
  - Fecha formateada en español (ej: "7 de diciembre de 1941")
  - Descripción completa (wrap: word, lineHeight: 1.4)
- **FR6.5:** Clic fuera del panel debe cerrarlo (llamar `selectTimelineEvent(null)`)

### FR7: Data Structure
- **FR7.1:** ProjectBundle debe incluir sección `timeline`:
  ```typescript
  timeline?: {
    config: {
      startDate: string; // ISO format
      endDate: string;
      tracks: {
        id: string;
        name: string;
        color: string;
      }[];
    };
    events: {
      id: string;
      title: string;
      description: string;
      date: string; // ISO format
      track: string; // track id
    }[];
  }
  ```
- **FR7.2:** Validar que cada evento tenga un track válido
- **FR7.3:** Eventos sin track o con track inválido no se renderizan

### FR8: Layout Calculations
- **FR8.1:** Constantes de diseño:
  ```typescript
  YEAR_SPACING = 280px  // Espacio horizontal entre años
  TRACK_HEIGHT = 100px  // Altura de cada track
  TRACK_SPACING = 20px  // Espacio entre tracks
  TIMELINE_Y_OFFSET = 80px  // Offset desde el nodo al inicio del timeline
  EVENT_CIRCLE_RADIUS = 10px
  EVENT_LABEL_OFFSET_X = 15px
  ```
- **FR8.2:** Posición X de evento:
  ```
  eventX = nodePosition.x + (yearsSinceStart * YEAR_SPACING) + dayOffset
  dayOffset = (dayOfYear / 365) * YEAR_SPACING
  ```
- **FR8.3:** Posición Y de evento:
  ```
  trackIndex = tracks.findIndex(t => t.id === event.track)
  eventY = nodePosition.y + TIMELINE_Y_OFFSET + (trackIndex * (TRACK_HEIGHT + TRACK_SPACING)) + TRACK_HEIGHT/2
  ```

---

## 5. Non-Goals (Out of Scope)

### NG1: Editing de eventos
- No se permite agregar, editar o eliminar eventos desde el timeline
- Los eventos solo se modifican desde el archivo JSON del proyecto

### NG2: Timeline vertical o alternativo
- Solo se implementa layout horizontal con tracks
- No hay opción de cambiar entre layouts

### NG3: Filtrado de eventos
- No hay filtros por fecha, track o keyword
- Todos los eventos del rango se muestran siempre

### NG4: Múltiples timelines
- Solo hay un nodo timeline por proyecto
- No se soportan timelines anidados

### NG5: Zoom independiente del timeline
- El timeline escala con el zoom del canvas
- No hay controles de zoom específicos para el timeline

### NG6: Animaciones de transición entre eventos
- Los eventos no se animan al aparecer/desaparecer
- Solo hay animación de slide para el InfoPanel

### NG7: Drag & drop de eventos
- Los eventos no se pueden arrastrar para cambiar fecha o track
- Posiciones son calculadas automáticamente

### NG8: Timeline responsive
- El diseño está optimizado para desktop
- No hay adaptación específica para mobile/tablet

---

## 6. Design Considerations

### Visual Design
1. **Color Palette:**
   - Europa: `#3B82F6` (blue-500)
   - Pacífico: `#EF4444` (red-500)
   - Diplomacia: `#10B981` (green-500)
   - Texto: `#1F2937` (gray-800)
   - Fondo panel: `white`
   - Sombras: `rgba(0, 0, 0, 0.3)`

2. **Typography:**
   - Track labels: 14px, font-weight 600
   - Años: 16px, font-weight 700
   - Event titles: 13px, font-weight 500
   - Panel title: 15px, font-weight 600
   - Panel description: 13px, font-weight 400

3. **Spacing:**
   - Años espaciados 280px
   - Tracks altura 100px, separación 20px
   - Círculos radio 10px
   - Panel padding 16px

4. **Layout Reference:**
   - Eje horizontal superior con años (1939, 1940, 1941...)
   - Líneas verticales punteadas desde años hasta abajo
   - 3 líneas horizontales (tracks) con labels a la izquierda
   - Círculos posicionados en intersección de fecha y track
   - Títulos de eventos junto a círculos

### Interaction Design
1. **Hover States:**
   - Eventos: cambiar cursor a pointer
   - Opcional: aumentar radius del círculo ligeramente

2. **Click Behavior:**
   - Evento: abrir InfoPanel
   - Canvas vacío: cerrar InfoPanel
   - Botón +/-: expandir/colapsar timeline

3. **Animations:**
   - InfoPanel: slide from right + fade in (0.3s ease-out)
   - Expansión/colapso: usar animación estándar de nodos

### Accessibility
- Los círculos deben tener buen contraste con el fondo
- Los títulos deben ser legibles (min 13px)
- El panel InfoPanel debe tener buena jerarquía visual

---

## 7. Technical Considerations

### Component Structure
```
Canvas.tsx
  ├─ Layer (Nodes)
  │   ├─ NodeGroup (normal nodes)
  │   └─ TimelineNodeGroup (special handling)
  │       ├─ NodeShape (collapsed state)
  │       └─ TimelineComponent (expanded state)
  │           ├─ YearAxis
  │           ├─ TrackLine (x3)
  │           ├─ TrackLabel (x3)
  │           └─ EventCircle (multiple)
  │               └─ EventLabel
  ├─ Layer (Connections)
  └─ Layer (UI Overlays)
      └─ TimelineEventInfoPanel
```

### State Management
- `projectStore`: contiene timeline data (events, config)
- `uiStore`: contiene `selectedTimelineEvent`
- `viewportStore`: maneja zoom/pan (afecta timeline indirectamente)

### Performance Considerations
- Eventos son renderizados solo cuando timeline está expandido
- Use React.memo() para TimelineComponent si hay re-renders frecuentes
- Calcular posiciones una vez, no en cada render
- Limitar número de eventos mostrados si hay problemas de performance (100+ eventos)

### Testing Strategy
- Unit tests para cálculos de posición (eventX, eventY)
- Integration test: expandir nodo → ver timeline → clic evento → ver InfoPanel
- Visual regression test: screenshot del timeline expandido
- Data validation: verificar que todos los eventos tienen track válido

### Migration Path
1. Crear TimelineComponent v2 con nuevo diseño
2. Mantener v1 temporalmente
3. Feature flag para probar v2
4. Eliminar v1 y ViewSwitcher una vez v2 funciona
5. Actualizar ejemplos y documentación

---

## 8. Success Metrics

### Functionality Metrics
- [ ] ViewSwitcher completamente removido del header
- [ ] Nodo timeline se expande/colapsa correctamente
- [ ] Timeline muestra 3 tracks horizontales con colores correctos
- [ ] Eventos renderizados en posiciones correctas (±5px de precisión)
- [ ] Títulos de eventos visibles sin solapamiento
- [ ] Clic en evento abre InfoPanel
- [ ] InfoPanel muestra datos correctos del evento
- [ ] Clic fuera cierra InfoPanel

### Quality Metrics
- [ ] Cero errores de TypeScript
- [ ] Cero warnings en console
- [ ] Layout estable en diferentes resoluciones (1920x1080, 1440x900)
- [ ] Zoom del canvas no rompe el timeline
- [ ] Pan del canvas mueve timeline correctamente

### User Experience Metrics
- [ ] Timeline se carga en <500ms
- [ ] Hover sobre eventos es responsive (<100ms)
- [ ] InfoPanel aparece en <300ms tras clic
- [ ] Expansión de nodo es smooth (no lag)

### Visual Quality Metrics
- [ ] Círculos tienen tamaño uniforme
- [ ] Colores de tracks son distinguibles
- [ ] Textos son legibles en zoom 100%
- [ ] InfoPanel no se sale del viewport
- [ ] Líneas punteadas tienen spacing consistente

---

## 9. Open Questions

### Q1: ¿Qué hacer si dos eventos ocurren el mismo día en el mismo track?
**Propuesta:** Apilar los círculos verticalmente con offset de 20px
**Alternativa:** Mostrar solo el primero, agregar indicador "+X más"

### Q2: ¿Cómo manejar eventos fuera del rango startYear-endYear?
**Propuesta:** No renderizar eventos fuera del rango
**Alternativa:** Extender el rango automáticamente

### Q3: ¿Qué hacer si el título del evento es muy largo?
**Propuesta:** Truncar con ellipsis después de 30 caracteres
**Alternativa:** Wrap a múltiples líneas (puede causar solapamiento)

### Q4: ¿El InfoPanel debe moverse con el pan del canvas?
**Respuesta:** Sí, debe estar posicionado relativamente al evento (parte del canvas)

### Q5: ¿Deberíamos mantener compatibilidad con el old timeline view?
**Respuesta:** No, eliminar completamente el old view. Breaking change aceptable.

### Q6: ¿Qué hacer si el track de un evento no existe en la config?
**Propuesta:** Ignorar el evento (no renderizar) + console.warn()
**Alternativa:** Crear track "Otros" automáticamente

### Q7: ¿Deberíamos permitir múltiples nodos timeline en un proyecto?
**Respuesta:** Fase 1: No. Fase 2: Considerar si hay demanda de usuarios.

---

## 10. Acceptance Criteria

### Story: Timeline como nodo expandible
- [ ] Al cargar proyecto con nodo timeline, veo nodo colapsado
- [ ] Al hacer clic en "+", timeline se expande
- [ ] Timeline muestra eje horizontal con años correctos (1939-1945 para WWII)
- [ ] Timeline muestra 3 tracks: Europa (azul), Pacífico (rojo), Diplomacia (verde)
- [ ] Cada track tiene label visible a la izquierda
- [ ] Eventos aparecen como círculos en sus tracks correspondientes
- [ ] Eventos están posicionados en su año correcto
- [ ] Cada evento muestra su título cerca del círculo
- [ ] Al hacer clic en "-", timeline se colapsa

### Story: Interacción con eventos
- [ ] Al hacer hover sobre evento, cursor cambia a pointer
- [ ] Al hacer clic en evento, se abre InfoPanel a la derecha
- [ ] InfoPanel muestra: título del evento, fecha formateada, descripción completa
- [ ] InfoPanel tiene animación de slide + fade
- [ ] Al hacer clic fuera del panel, se cierra
- [ ] Al hacer clic en otro evento, InfoPanel cambia al nuevo evento

### Story: Eliminación de ViewSwitcher
- [ ] No existe botón "Timeline" en el header
- [ ] No existe botón "Mindmap" en el header
- [ ] Header solo muestra título del proyecto + botón menú
- [ ] No hay errores en console relacionados con ViewSwitcher

### Story: Integración con canvas
- [ ] Timeline se mueve cuando hago pan del canvas
- [ ] Timeline escala cuando hago zoom del canvas
- [ ] Timeline no se superpone con otros nodos
- [ ] Timeline respeta límites del viewport
- [ ] Auto-layout recalcula posiciones al expandir timeline

---

## 11. Implementation Notes

### Phase 1: Preparación (2-3 horas)
1. Crear branch `feature/timeline-horizontal-tracks`
2. Backup de TimelineComponent.tsx actual
3. Crear archivo de constantes: `src/constants/timelineLayout.ts`
4. Actualizar tipos en `src/types/node.ts` y `src/types/project.ts`

### Phase 2: TimelineComponent Redesign (4-6 horas)
1. Implementar cálculos de posición (eventX, eventY)
2. Renderizar eje horizontal con años
3. Renderizar tracks horizontales
4. Renderizar eventos como círculos
5. Renderizar títulos de eventos
6. Implementar hover states
7. Conectar onClick handler

### Phase 3: Canvas Integration (2-3 horas)
1. Detectar nodeType === 'timeline' en Canvas.tsx
2. Renderizar TimelineComponent cuando isExpanded
3. Posicionar timeline relativamente al nodo
4. Verificar comportamiento con zoom/pan

### Phase 4: ViewSwitcher Removal (1-2 horas)
1. Eliminar ViewSwitcher.tsx
2. Limpiar imports en Header.tsx
3. Eliminar lógica de currentView en uiStore
4. Verificar no hay referencias rotas

### Phase 5: Testing & Refinement (2-3 horas)
1. Probar con proyecto WWII
2. Verificar posiciones de eventos
3. Probar InfoPanel con diferentes eventos
4. Verificar responsive behavior
5. Ajustar constantes de diseño según sea necesario

### Phase 6: Deployment (1 hora)
1. Build de producción
2. Deploy a Firebase
3. Verificar en producción
4. Documentar cambios en CHANGELOG

---

## 12. Dependencies & Risks

### Dependencies
- React Konva (already installed)
- Zustand (already installed)
- TypeScript (already configured)
- Existing TimelineEventInfoPanel component (already implemented)

### Technical Risks
- **Risk 1:** Solapamiento de títulos si hay muchos eventos cercanos
  - **Mitigation:** Implementar algoritmo de collision detection para labels
  - **Fallback:** Truncar títulos o mostrar solo en hover

- **Risk 2:** Performance con 50+ eventos
  - **Mitigation:** Usar React.memo() y virtualización si es necesario
  - **Fallback:** Limitar a 100 eventos máximo

- **Risk 3:** Timeline muy ancho se sale del viewport
  - **Mitigation:** Implementar auto-scroll o zoom-to-fit al expandir
  - **Fallback:** Usuario debe hacer pan manual

- **Risk 4:** Breaking changes en proyectos existentes
  - **Mitigation:** Migration script para convertir old timeline a nuevo formato
  - **Fallback:** Documentar que es breaking change, usuarios deben actualizar JSONs

### User Experience Risks
- **Risk 1:** Usuario no entiende que timeline es un nodo expandible
  - **Mitigation:** Documentación + tooltip en primer uso
  - **Fallback:** Agregar hint visual (icono de reloj en nodo)

- **Risk 2:** Usuario intenta editar eventos desde timeline
  - **Mitigation:** Documentar que edición es desde JSON
  - **Fallback:** Agregar botón "Edit in JSON" en InfoPanel

---

## 13. Rollout Plan

### Phase 1: Development (Semana 1)
- Implementar nuevo TimelineComponent
- Testing local con proyecto WWII
- Code review

### Phase 2: Internal Testing (Semana 2)
- Deploy a staging environment
- Testing con proyectos adicionales
- Bug fixes

### Phase 3: Production Deployment (Semana 2)
- Deploy a Firebase production
- Monitorear errores
- Hotfixes si es necesario

### Phase 4: Documentation (Semana 3)
- Actualizar README
- Crear guía de uso de timelines
- Agregar ejemplos adicionales

---

## 14. Related Documents

- [wwii-with-timeline.json](/Users/gonzaloriederer/nodem-clean/public/examples/wwii-with-timeline.json) - Ejemplo de datos
- [TimelineEventInfoPanel.tsx](/Users/gonzaloriederer/nodem-clean/src/components/Canvas/TimelineEventInfoPanel.tsx) - InfoPanel implementado
- [uiStore.ts](/Users/gonzaloriederer/nodem-clean/src/stores/uiStore.ts) - State management
- [Canvas.tsx](/Users/gonzaloriederer/nodem-clean/src/components/Canvas/Canvas.tsx) - Componente principal

---

**End of PRD**

_Last updated: 2025-10-28_
_Version: 1.0_
_Author: Claude (AI Dev Agent)_
_Approved by: [Pending user approval]_
