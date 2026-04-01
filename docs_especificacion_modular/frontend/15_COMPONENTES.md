# 15 — Catálogo de componentes

## Componentes base (reutilizables en toda la app)

| Componente | Descripción | Props principales |
|---|---|---|
| `AppSidebar` | Barra lateral con navegación por rol | `role`, `currentPath` |
| `Topbar` | Cabecera con contexto (ciclo, proyecto, usuario) | `user`, `context` |
| `Breadcrumbs` | Navegación contextual por niveles | `segments[]` |
| `DashboardCard` | Tarjeta de sección del dashboard | `title`, `children`, `loading` |
| `StatusBadge` | Badge de color según estado | `status: TaskStatus \| EvidenceStatus` |
| `DataTable` | Tabla avanzada con ordenación, filtros, paginación | `columns`, `data`, `onSort`, `onFilter` |
| `EntityHeader` | Cabecera de detalle de entidad (proyecto, tarea) | `title`, `status`, `metadata`, `actions` |
| `EmptyState` | Vista cuando no hay datos | `icon`, `message`, `action` |
| `ConfirmationDialog` | Modal de confirmación para acciones destructivas | `title`, `message`, `onConfirm`, `onCancel` |
| `FileUploader` | Componente de subida de archivos (drag & drop) | `accept`, `maxSize`, `onUpload` |
| `TimelineView` | Vista de timeline vertical con eventos | `events[]` |
| `ProgressRing` | Anillo circular de progreso | `percentage`, `label`, `color` |
| `RoleGuard` | Wrapper que oculta contenido si el rol no coincide | `allowedRoles[]`, `children` |
| `CurriculumTag` | Chip/tag con código de RA o CE | `code`, `type: 'ra' \| 'ce'` |
| `LoadingSkeleton` | Skeleton de carga por tipo de contenido | `type: 'card' \| 'table' \| 'list'` |

## Componentes de dominio

### Proyectos
| Componente | Descripción |
|---|---|
| `ProjectCard` | Tarjeta resumen de un proyecto (lista) |
| `ProjectForm` | Formulario de creación/edición de proyecto |
| `ProjectOverview` | Vista general del proyecto con progreso y módulos |
| `ProjectModulesPanel` | Panel de módulos vinculados al proyecto |
| `ProjectPhaseList` | Lista ordenada de fases con tareas |
| `ProjectPhaseStepper` | Indicador visual de progreso por fases |

### Tareas
| Componente | Descripción |
|---|---|
| `TaskCard` | Tarjeta de tarea (para lista o tablero) |
| `TaskForm` | Formulario de creación/edición de tarea |
| `TaskBoard` | Tablero kanban de tareas por estado |
| `TaskDependenciesPanel` | Panel visual de dependencias entre tareas |
| `TaskCurriculumMap` | Mapa de RA y CE vinculados a la tarea |

### Evaluación
| Componente | Descripción |
|---|---|
| `RubricViewer` | Visualización de una rúbrica con niveles |
| `AssessmentForm` | Formulario para registrar una valoración |
| `RAProgressTable` | Tabla de progreso por RA (filas) y alumnos (columnas) |
| `CECoveragePanel` | Panel de cobertura de CE por proyecto |

### Evidencias
| Componente | Descripción |
|---|---|
| `EvidenceCard` | Tarjeta de evidencia con estado y acciones |
| `EvidenceUploadForm` | Formulario de subida de evidencia |
| `EvidenceList` | Lista de evidencias (filtrable) |
| `EvidenceReviewPanel` | Panel de revisión para el profesor |

### Seguridad
| Componente | Descripción |
|---|---|
| `SafetyBlockAlert` | Alerta visual de tarea bloqueada por PRL |
| `MachineAuthorizationBadge` | Badge de autorización de máquina |
| `StudentSafetyStatusPanel` | Panel completo de estado de seguridad del alumno |
| `SafetyRequirementList` | Lista de requisitos de una tarea |

### Observaciones
| Componente | Descripción |
|---|---|
| `ObservationPanel` | Panel de observaciones de un alumno |
| `ObservationForm` | Formulario para crear observación |

## Convenciones de componentes

- Cada componente en su propio fichero dentro de `/components/[dominio]/`.
- Exportar desde un `index.ts` por carpeta.
- Props tipadas con interfaces TypeScript (no `any`).
- Usar `forwardRef` cuando sea necesario para composición.
- Separar lógica de datos (en `/features`) de la presentación (en `/components`).
- Cada componente maneja sus estados de carga y error internamente cuando consume datos.
