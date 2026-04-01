# 17 — Fases del MVP

## Visión general

El desarrollo se divide en tres fases incrementales. Cada fase produce un entregable funcional que puede probarse con usuarios reales. No se avanza a la siguiente fase hasta que la anterior esté validada.

---

## MVP Fase 1 — Base funcional

### Objetivo
Demostrar que el sistema puede gestionar un proyecto transversal vinculado al currículo, con coordinación entre profesores y seguimiento básico del alumno.

### Alcance recomendado
- Un solo ciclo formativo (Grado Medio de Madera).
- Un solo curso (1º).
- Una sola evaluación (1ª Evaluación).
- Un proyecto (ej: cajón con herramientas manuales).
- 3-4 módulos implicados.

### Entregables

**Backend:**
1. Monorepo configurado (pnpm + workspaces).
2. Backend NestJS con configuración base, variables de entorno, health check.
3. Base de datos PostgreSQL con schema Prisma y migraciones iniciales.
4. Módulo Auth: login, refresh, guards por rol, contexto de usuario.
5. Módulo Academic: centros, familias, ciclos, cursos, grupos, módulos, asignación docente.
6. Módulo Curriculum: RA, CE, importación desde Markdown.
7. Módulo Projects: proyectos, fases, tareas, vinculación curricular, dependencias.
8. Módulo Planning: calendario académico, días lectivos, sesiones.
9. Módulo Evidences: subida de archivos, listado, revisión de estado, comentarios.
10. Módulo Evaluation: valoraciones básicas, progreso por RA.
11. Módulo Observations: crear y listar observaciones.
12. Seed de datos de ejemplo para el ciclo piloto.
13. Documentación Swagger.

**Frontend:**
1. Estructura de carpetas completa.
2. Sistema de layouts con sidebar y topbar.
3. Navegación por rol con guards de ruta.
4. Pantalla de login funcional.
5. Dashboard del alumno (proyecto activo, tareas pendientes, progreso).
6. Dashboard del profesor (estado del grupo, entregas pendientes, alertas).
7. Vista de proyecto con fases y tareas.
8. Formulario de creación de tarea con vinculación curricular.
9. Vista de evidencias (subida para alumno, revisión para profesor).
10. Vista básica de progreso por RA.
11. Cliente API centralizado con TanStack Query.
12. Componentes base: StatusBadge, DataTable, DashboardCard, EmptyState.

### Criterio de éxito
Un profesor puede crear un proyecto con fases, asignar tareas vinculadas a RA/CE, y un alumno puede ver sus tareas, subir una evidencia y ver su progreso. El profesor puede revisar la evidencia y registrar una valoración.

---

## MVP Fase 2 — Evaluación avanzada y seguridad

### Objetivo
Añadir las herramientas de evaluación profesional (rúbricas, matriz curricular) y el control de progresión técnica y seguridad de taller.

### Entregables

**Backend:**
1. Módulo Assessment Instruments: rúbricas, listas de cotejo.
2. Módulo Progression: requisitos de seguridad, autorizaciones de máquinas, bloqueo de tareas.
3. Endpoint de trazabilidad curricular completa (`/projects/:id/curriculum-trace`).
4. Módulo Alerts: generación automática de alertas (tarea vencida, evidencia pendiente, PRL).
5. Módulo Analytics: indicadores básicos (cobertura curricular, progreso agregado, tareas vencidas).

**Frontend:**
1. RubricViewer y AssessmentForm completos.
2. RAProgressTable: tabla de progreso alumnos × RA.
3. CECoveragePanel: panel de cobertura curricular.
4. Matriz curricular interactiva (profesor y jefatura).
5. StudentSafetyStatusPanel completo.
6. Formulario de autorización de máquinas.
7. Bloqueo visual de tareas por prerrequisitos de seguridad.
8. Vista Gantt del cronograma del proyecto.
9. Dashboard de jefatura con indicadores.
10. Sistema de alertas y notificaciones en la interfaz.

### Criterio de éxito
El profesor puede evaluar con rúbricas, ver la cobertura curricular completa de un proyecto, y el sistema bloquea automáticamente tareas para alumnos sin autorización de seguridad. La jefatura ve indicadores agregados del departamento.

---

## MVP Fase 3 — Capa de IA

### Objetivo
Añadir asistentes inteligentes contextualizados para alumno y profesor, manteniendo la IA como capa de apoyo, no como motor de decisiones.

### Entregables

**Backend:**
1. Módulo AI: servicio abstracto con implementación para al menos un proveedor.
2. Endpoint `/ai/student-assistant` con contexto del alumno (proyecto, tarea, progreso).
3. Endpoint `/ai/teacher-assistant` con contexto del grupo (progreso, alertas, cobertura).
4. Sistema de prompts con restricciones de seguridad.
5. Registro de todas las interacciones en `AIInteraction`.
6. Rate limiting por usuario y rol.
7. Configuración de límites desde admin.

**Frontend:**
1. Interfaz de chat para el alumno (`/alumno/asistente`).
2. Panel de consultas para el profesor (integrado en dashboard o sección propia).
3. Advertencia visible de que la IA no sustituye al profesorado.
4. Historial de interacciones del usuario.
5. Sugerencias automáticas de vinculación tarea-RA/CE (para el profesor al crear tareas).
6. Resúmenes automáticos de progreso de grupo.

### Criterio de éxito
Un alumno puede preguntar sobre su tarea actual y recibir orientación contextualizada. Un profesor puede pedir un resumen de progreso del grupo y recibir una respuesta basada en datos reales del sistema. Todas las interacciones quedan registradas.

---

## Cronograma estimado

| Fase | Duración estimada | Requisitos previos |
|---|---|---|
| Fase 1 | 3-4 meses | Datos curriculares del ciclo piloto, calendario académico |
| Fase 2 | 2-3 meses | Fase 1 validada, catálogo de herramientas y rúbricas |
| Fase 3 | 2 meses | Fase 2 estable, decisión de proveedor IA |

> Estas estimaciones asumen un equipo de 2-3 desarrolladores. Con un agente de código, los tiempos pueden reducirse significativamente en la generación de código base, pero la validación con usuarios reales mantiene su duración.

---

## Nota sobre testing

Cada fase debe incluir:

- Tests unitarios para servicios con lógica de negocio compleja.
- Tests de integración para los flujos principales (crear proyecto → crear tarea → vincular RA → subir evidencia → evaluar).
- Seed de datos actualizado para cada fase.
- Revisión manual con al menos un profesor y un alumno del departamento antes de cerrar la fase.
