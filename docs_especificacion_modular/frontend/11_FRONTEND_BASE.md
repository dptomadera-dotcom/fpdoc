# 11 — Frontend: base, stack y estructura

## Stack obligatorio

- Next.js (App Router)
- TypeScript estricto
- Tailwind CSS
- React Hook Form + Zod para formularios y validación
- TanStack Query para consumo de API
- shadcn/ui como sistema de componentes base

## Stack opcional

- Zustand para estado local compartido (filtros, modales, contexto de UI)
- FullCalendar o equivalente para calendario
- Librería Gantt para cronograma de proyectos (ej: frappe-gantt, dhtmlxGantt)

## Estructura de carpetas

```text
/apps/web/src
  /app
    /(public)              → Landing y páginas públicas
      /page.tsx
      /login/page.tsx
      /recuperar-acceso/page.tsx
    /(dashboard)           → Área autenticada (layout con sidebar)
      /layout.tsx          → Layout compartido: sidebar + topbar
      /alumno/
        /page.tsx          → Dashboard alumno
        /proyectos/
        /agenda/
        /evidencias/
        /progreso/
        /asistente/
      /profesor/
        /page.tsx          → Dashboard profesor
        /proyectos/
        /tareas/
        /calendario/
        /evidencias/
        /evaluacion/
        /alumnado/
        /matriz-curricular/
      /jefatura/
        /page.tsx          → Dashboard jefatura
        /proyectos/
        /plantillas/
        /indicadores/
        /estructura-academica/
      /admin/
        /page.tsx
        /usuarios/
        /roles/
        /configuracion/
        /logs/
  /components
    /layout                → AppSidebar, Topbar, Breadcrumbs
    /shared                → StatusBadge, DataTable, EmptyState, ConfirmationDialog, FileUploader
    /dashboard             → DashboardCard, ProgressRing, TimelineView
    /projects              → ProjectCard, ProjectForm, ProjectOverview, ProjectPhaseList
    /tasks                 → TaskCard, TaskForm, TaskBoard, TaskDependenciesPanel
    /calendar              → CalendarView, SessionCard
    /evidence              → EvidenceCard, EvidenceUploadForm, EvidenceList, EvidenceReviewPanel
    /evaluation            → RubricViewer, AssessmentForm, RAProgressTable, CECoveragePanel
    /security              → SafetyBlockAlert, MachineAuthorizationBadge, StudentSafetyStatusPanel
    /forms                 → Campos reutilizables de formulario
  /features                → Lógica de cada dominio (hooks + API calls + schemas)
    /auth
    /users
    /academic
    /curriculum
    /projects
    /planning
    /tasks
    /evidences
    /evaluation
    /progression
    /analytics
    /ai
  /lib
    /api                   → Cliente API centralizado (fetch wrapper + interceptors)
    /auth                  → Helpers de sesión, token, guards de ruta
    /utils                 → Funciones utilitarias
    /constants             → Estados, roles, colores de estado
    /schemas               → Schemas Zod compartidos
  /hooks                   → Hooks globales reutilizables
  /types                   → Tipos TypeScript del frontend
  /styles                  → Estilos globales, variables CSS
```

## Layout general

```
┌─────────────────────────────────────────────────┐
│                    TOPBAR                        │
│  [Logo] [Contexto: Ciclo > Curso > Proyecto]  [User Menu]  │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ SIDEBAR  │          CONTENIDO PRINCIPAL         │
│          │                                      │
│ - Inicio │                                      │
│ - Proyec │                                      │
│ - Tareas │                                      │
│ - Calend │                                      │
│ - Eviden │                                      │
│ - Progre │                                      │
│          │                                      │
├──────────┴──────────────────────────────────────┤
│              BREADCRUMBS (contextual)            │
└─────────────────────────────────────────────────┘
```

- La sidebar cambia según el rol del usuario (distintos ítems de menú).
- La topbar muestra el contexto activo: ciclo, curso, proyecto seleccionado.
- El contenido principal ocupa el espacio restante.
- Panel lateral contextual opcional (se abre al hacer clic en un elemento para ver detalle rápido).

## Estados visuales

Todos los elementos de trabajo (tareas, evidencias, proyectos) deben mostrar su estado con badges de color:

| Estado | Color sugerido | Uso |
|---|---|---|
| `PENDIENTE` | Gris | Aún no iniciado |
| `EN_CURSO` | Azul | En progreso |
| `REVISADO` | Amarillo | Entregado, pendiente de validación |
| `VALIDADO` | Verde | Completado y aceptado |
| `BLOQUEADO` | Rojo oscuro | Dependencia o prerrequisito no cumplido |
| `REQUIERE_CORRECCION` | Naranja | Devuelto por el profesor |
| `VENCIDO` | Rojo | Pasó la fecha límite |

## Gestión de estado

- **Estado del servidor:** TanStack Query (datos remotos, caché, invalidación).
- **Estado de interfaz:** Estado local de React o Zustand (filtros, modales, tabs activos).
- **Estado de formularios:** React Hook Form (estado transitorio de inputs).
- **Sesión y contexto:** Context API de React (usuario autenticado, rol, centro).

Regla: no duplicar innecesariamente el estado remoto en estado local.

## Validaciones en frontend

Todas las entradas críticas se validan con Zod tanto en frontend como en backend:

- Nombre de proyecto obligatorio.
- Fechas coherentes (fin > inicio).
- Relación válida entre módulo y RA/CE al vincular.
- Formatos permitidos para evidencias (jpg, png, pdf, docx, mp4).
- Campos obligatorios por tipo de formulario.

## Criterios de calidad

- TypeScript estricto (no `any`).
- Componentes reutilizables y composables.
- Accesibilidad básica (labels, ARIA, navegación por teclado).
- Loaders y estados vacíos en todas las vistas.
- Manejo claro de errores (mensajes de usuario, no errores técnicos).
- Responsive (mobile-first, especialmente para uso en taller desde móvil).
