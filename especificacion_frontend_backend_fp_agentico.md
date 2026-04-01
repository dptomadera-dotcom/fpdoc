# Especificación Markdown para desarrollo del aplicativo
## Plataforma educativa inteligente para FP basada en proyectos transversales

> Documento de trabajo para un editor de código agéntico.
>
> Objetivo: generar una primera versión funcional del aplicativo con **frontend** y **backend** bien estructurados, siguiendo una arquitectura modular, escalable y orientada a Formación Profesional.
>
> **Instrucción obligatoria para el agente de desarrollo:** si en cualquier fase faltan datos funcionales, técnicos, curriculares, visuales o de despliegue que impidan construir correctamente una parte del sistema, **debes detener esa parte concreta y solicitar la información faltante con preguntas claras, agrupadas y priorizadas**, antes de continuar su implementación.

---

# 1. Objetivo general del aplicativo

Construir una plataforma web educativa para Formación Profesional que permita:

- planificar proyectos transversales;
- vincular tareas con Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE);
- coordinar al profesorado por módulos;
- guiar al alumnado en sus tareas, fases y entregas;
- registrar evidencias y observaciones;
- realizar seguimiento del progreso individual y grupal;
- controlar progresión técnica, seguridad y prerrequisitos de taller;
- incorporar posteriormente asistentes inteligentes e IA contextualizada.

---

# 2. Reglas de comportamiento para el editor de código agéntico

## 2.1. Regla principal
Antes de generar código, revisa esta especificación y construye el sistema de forma incremental, priorizando una base funcional sólida.

## 2.2. Si faltan datos
Si detectas que faltan datos para implementar correctamente una funcionalidad, no inventes decisiones críticas sin avisar.

Debes:

1. identificar exactamente qué dato falta;
2. explicar a qué módulo afecta;
3. proponer una suposición temporal razonable solo si permite avanzar sin comprometer la arquitectura;
4. solicitar al usuario los datos faltantes mediante preguntas concretas.

## 2.3. Preguntas obligatorias cuando falten datos
Cuando falte información, formula preguntas agrupadas por bloques como estos:

- identidad visual y branding;
- estructura académica real del centro;
- módulos y currículo;
- permisos por rol;
- flujos de evaluación;
- reglas de PRL y progresión técnica;
- proveedor de autenticación;
- almacenamiento de archivos;
- despliegue e infraestructura;
- integración con IA;
- integración con Moodle, Google o plataformas institucionales.

## 2.4. Prioridad de trabajo
Implementa en este orden:

1. arquitectura base del proyecto;
2. autenticación y roles;
3. estructura académica y curricular;
4. proyectos, fases y tareas;
5. calendario y planificación;
6. evidencias y observaciones;
7. evaluación y trazabilidad;
8. progresión técnica y seguridad;
9. analítica y paneles;
10. capa de IA.

---

# 3. Arquitectura general recomendada

## 3.1. Enfoque general
El aplicativo debe construirse como una plataforma de trabajo pedagógico, no como una simple app de tareas.

## 3.2. Arquitectura técnica recomendada

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Componentes reutilizables
- Formularios tipados
- Gestión de estado ligera y escalable
- Cliente API desacoplado

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis para colas y caché si fuese necesario
- Sistema de almacenamiento de ficheros desacoplado
- API REST modular

### Infraestructura
- Monorepo recomendado
- pnpm recomendado
- Docker opcional desde el inicio
- variables de entorno separadas por app
- CI/CD en fase posterior

---

# 4. Estructura recomendada del repositorio

```text
/app-fp-agentica
  /apps
    /web              -> Frontend Next.js
    /api              -> Backend NestJS
  /packages
    /ui               -> Componentes compartidos
    /config           -> Configuraciones compartidas
    /types            -> Tipos compartidos
    /eslint-config    -> Reglas compartidas
  /docs
    /frontend
    /backend
    /api
    /arquitectura
  package.json
  pnpm-workspace.yaml
  turbo.json (opcional)
```

---

# 5. Frontend

# 5.1. Objetivo del frontend

El frontend debe funcionar como un entorno de trabajo real para tres perfiles principales:

- alumnado;
- profesorado;
- administración / jefatura / coordinación.

Debe ser:

- claro;
- rápido;
- visual;
- modular;
- responsive;
- fácil de mantener;
- preparado para crecimiento posterior.

---

# 5.2. Stack del frontend

## Tecnologías obligatorias
- Next.js
- TypeScript
- Tailwind CSS
- React Hook Form o equivalente
- Zod para validación
- TanStack Query o equivalente para consumo de API
- tabla avanzada reutilizable
- sistema de notificaciones

## Tecnologías opcionales
- Zustand para estado local compartido
- FullCalendar o equivalente para calendario
- librería Gantt para cronograma
- shadcn/ui o sistema propio de componentes

---

# 5.3. Estructura del frontend

```text
/apps/web
  /src
    /app
      /(public)
      /(auth)
      /(dashboard)
        /alumno
        /profesor
        /jefatura
        /admin
      /api-docs (opcional)
    /components
      /layout
      /navigation
      /dashboard
      /projects
      /tasks
      /calendar
      /evidence
      /evaluation
      /security
      /forms
      /shared
    /features
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
      /api
      /auth
      /utils
      /constants
      /schemas
    /hooks
    /types
    /styles
```

---

# 5.4. Layout general del frontend

## Estructura visual recomendada

- barra lateral izquierda con navegación principal;
- cabecera superior con contexto de curso, proyecto y usuario;
- contenido central con vista principal;
- panel lateral contextual opcional para detalle rápido;
- sistema de breadcrumbs para navegación contextual.

## Estados visuales clave
Todos los elementos de trabajo deben mostrar estados visibles y comprensibles.

### Estados mínimos
- pendiente;
- en curso;
- revisado;
- validado;
- bloqueado por prerrequisito;
- requiere corrección;
- vencido.

---

# 5.5. Rutas principales del frontend

## Público
- `/`
- `/login`
- `/recuperar-acceso`

## Alumno
- `/alumno`
- `/alumno/proyectos`
- `/alumno/proyectos/[id]`
- `/alumno/agenda`
- `/alumno/evidencias`
- `/alumno/progreso`
- `/alumno/perfil`
- `/alumno/asistente`

## Profesor
- `/profesor`
- `/profesor/proyectos`
- `/profesor/proyectos/[id]`
- `/profesor/tareas`
- `/profesor/calendario`
- `/profesor/evidencias`
- `/profesor/evaluacion`
- `/profesor/alumnado`
- `/profesor/coordination`
- `/profesor/matriz-curricular`

## Jefatura / Coordinación
- `/jefatura`
- `/jefatura/proyectos`
- `/jefatura/plantillas`
- `/jefatura/indicadores`
- `/jefatura/estructura-academica`

## Administración
- `/admin`
- `/admin/usuarios`
- `/admin/roles`
- `/admin/configuracion`
- `/admin/catalogos`
- `/admin/logs`

---

# 5.6. Módulos funcionales del frontend

## 5.6.1. Autenticación y acceso
### Debe incluir
- formulario de login;
- recuperación de acceso;
- persistencia de sesión;
- redirección por rol;
- control de acceso por rutas.

## 5.6.2. Dashboard del alumno
### Debe mostrar
- proyecto activo;
- tareas pendientes;
- próximas sesiones;
- evidencias requeridas;
- observaciones recientes;
- indicador general de progreso.

## 5.6.3. Dashboard del profesor
### Debe mostrar
- estado general del grupo;
- entregas pendientes de revisión;
- tareas activas;
- incidencias;
- cronograma resumido;
- alertas curriculares y pedagógicas.

## 5.6.4. Gestión de proyectos
### Debe permitir
- crear proyecto;
- editar proyecto;
- visualizar fases;
- asignar módulos;
- asociar tareas;
- consultar progreso por proyecto.

## 5.6.5. Gestión de tareas
### Debe permitir
- crear tareas;
- editar tareas;
- asignar responsables;
- establecer fechas;
- relacionar tareas con fase, RA y CE;
- visualizar dependencias;
- bloquear tareas por prerrequisito.

## 5.6.6. Calendario y cronograma
### Debe permitir
- vista semanal;
- vista mensual;
- vista por evaluación;
- vista por módulo;
- vista Gantt del proyecto;
- marcar días lectivos y no lectivos.

## 5.6.7. Evidencias
### Debe permitir
- subir archivo;
- listar evidencias;
- revisar estado;
- añadir comentario;
- marcar revisión;
- asociar evidencia a tarea y alumno.

## 5.6.8. Evaluación
### Debe permitir
- ver rúbricas;
- registrar valoración;
- consultar trazabilidad por RA y CE;
- emitir observaciones;
- visualizar progreso acumulado.

## 5.6.9. Progresión técnica y seguridad
### Debe permitir
- visualizar prerrequisitos;
- registrar habilitación;
- bloquear acceso a tareas no autorizadas;
- ver estado de seguridad por alumno.

## 5.6.10. Asistente IA
### Primera versión
- interfaz de consulta contextual;
- acceso restringido por rol;
- historial de interacciones;
- advertencia visible de que no sustituye al profesorado.

---

# 5.7. Componentes clave del frontend

## Componentes base
- `AppSidebar`
- `Topbar`
- `DashboardCard`
- `StatusBadge`
- `DataTable`
- `EntityHeader`
- `EmptyState`
- `ConfirmationDialog`
- `FileUploader`
- `TimelineView`
- `ProgressRing`
- `RoleGuard`
- `CurriculumTag`
- `EvidenceCard`
- `TaskBoard`
- `ProjectPhaseStepper`
- `ObservationPanel`
- `SafetyBlockAlert`

## Componentes por dominio

### Proyectos
- `ProjectCard`
- `ProjectForm`
- `ProjectOverview`
- `ProjectModulesPanel`
- `ProjectPhaseList`

### Tareas
- `TaskCard`
- `TaskForm`
- `TaskDependenciesPanel`
- `TaskCurriculumMap`

### Evaluación
- `RubricViewer`
- `AssessmentForm`
- `RAProgressTable`
- `CECoveragePanel`

### Evidencias
- `EvidenceUploadForm`
- `EvidenceList`
- `EvidenceReviewPanel`

### Seguridad
- `SafetyRequirementList`
- `MachineAuthorizationBadge`
- `StudentSafetyStatusPanel`

---

# 5.8. Gestión de estado del frontend

## Recomendación
Separar claramente:

- estado del servidor;
- estado de interfaz;
- estado transitorio de formularios;
- sesión y contexto de usuario.

## Reglas
- usar TanStack Query para datos remotos;
- usar estado local o Zustand para filtros, modales y UI;
- no duplicar innecesariamente el estado remoto.

---

# 5.9. Validaciones del frontend

Todas las entradas críticas deben validarse en frontend y backend.

## Ejemplos
- nombre de proyecto obligatorio;
- fechas coherentes;
- relación válida entre módulo y RA/CE;
- formatos permitidos para evidencias;
- campos obligatorios por rol;
- restricciones de acceso por prerrequisitos.

---

# 5.10. Criterios de calidad del frontend

## Obligatorios
- código en TypeScript estricto;
- componentes reutilizables;
- accesibilidad básica;
- diseño consistente;
- manejo claro de errores;
- loaders y estados vacíos;
- control de permisos visual y funcional.

---

# 5.11. Entregables esperados del frontend

1. estructura completa de carpetas;
2. sistema de layouts;
3. navegación por rol;
4. pantallas base funcionales;
5. componentes reutilizables;
6. cliente API;
7. modelos y esquemas;
8. documentación interna del frontend.

---

# 6. Backend

# 6.1. Objetivo del backend

Construir un backend modular, seguro y escalable que centralice la lógica de negocio del aplicativo.

Debe resolver:

- autenticación y permisos;
- estructura académica;
- currículo;
- proyectos y fases;
- planificación temporal;
- tareas y dependencias;
- evidencias;
- evaluación;
- progresión técnica;
- analítica;
- IA contextualizada.

---

# 6.2. Stack del backend

## Tecnologías obligatorias
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- REST API
- validación DTO
- control de errores centralizado
- configuración por variables de entorno

## Opcionales
- Redis
- BullMQ
- almacenamiento S3 compatible
- Swagger
- eventos internos

---

# 6.3. Estructura del backend

```text
/apps/api
  /src
    /main.ts
    /app.module.ts
    /common
      /decorators
      /filters
      /guards
      /interceptors
      /pipes
      /utils
      /constants
    /config
    /modules
      /auth
      /users
      /roles
      /centers
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
      /files
      /notifications
      /health
    /prisma
```

---

# 6.4. Principios del backend

## 6.4.1. Monolito modular
La primera versión debe desarrollarse como monolito modular bien organizado.

## 6.4.2. Lógica de dominio clara
Cada módulo debe encapsular su propia lógica, DTOs, servicios, controladores y validaciones.

## 6.4.3. Seguridad desde el inicio
El control de roles y permisos no debe dejarse para el final.

## 6.4.4. Trazabilidad
Las operaciones críticas deben poder auditarse.

---

# 6.5. Módulos funcionales del backend

## 6.5.1. Auth
### Debe gestionar
- login;
- refresh token si se usa;
- sesión;
- recuperación de contraseña;
- guards por rol;
- contexto de usuario autenticado.

## 6.5.2. Users y Roles
### Debe gestionar
- usuarios;
- roles globales;
- permisos específicos;
- relación con centro, grupo y módulo.

## 6.5.3. Academic
### Debe gestionar
- centros;
- familias profesionales;
- ciclos;
- cursos;
- grupos;
- módulos;
- asignación docente.

## 6.5.4. Curriculum
### Debe gestionar
- resultados de aprendizaje;
- criterios de evaluación;
- relación con módulos;
- importación de currículo;
- validación manual posterior.

## 6.5.5. Projects
### Debe gestionar
- proyectos;
- fases;
- módulos implicados;
- plantillas de proyecto;
- objetivos;
- estados del proyecto.

## 6.5.6. Planning
### Debe gestionar
- calendario académico;
- días lectivos y no lectivos;
- sesiones semanales;
- hitos;
- cronograma del proyecto.

## 6.5.7. Tasks
### Debe gestionar
- tareas;
- responsables;
- dependencias;
- fechas;
- estado;
- relación con fase;
- relación con RA y CE;
- bloqueo por prerrequisitos.

## 6.5.8. Evidences
### Debe gestionar
- metadatos de archivos;
- entregas;
- revisión;
- comentarios;
- asociación a tarea, proyecto y alumno.

## 6.5.9. Evaluation
### Debe gestionar
- instrumentos de evaluación;
- rúbricas;
- valoraciones;
- observaciones;
- estado de logro;
- informes;
- trazabilidad por RA y CE.

## 6.5.10. Progression
### Debe gestionar
- requisitos previos;
- niveles de progresión técnica;
- habilitaciones;
- control de seguridad;
- restricciones por máquina, herramienta o proceso.

## 6.5.11. Analytics
### Debe gestionar
- indicadores básicos;
- tareas vencidas;
- alumnos con incidencias;
- cobertura curricular;
- estado general del proyecto.

## 6.5.12. AI
### Debe gestionar
- prompts;
- contexto por rol;
- historial de interacciones;
- filtros de seguridad;
- sugerencias al profesorado;
- asistente contextual al alumnado.

## 6.5.13. Files
### Debe gestionar
- subida;
- validación de tipo;
- almacenamiento;
- generación de URLs seguras;
- borrado controlado.

---

# 6.6. API REST recomendada

## Ejemplos de endpoints

### Auth
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/forgot-password`

### Users
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`

### Academic
- `GET /cycles`
- `GET /modules`
- `POST /modules`

### Curriculum
- `GET /learning-outcomes`
- `POST /learning-outcomes`
- `GET /evaluation-criteria`
- `POST /curriculum/import`

### Projects
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `POST /projects/:id/phases`

### Tasks
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `POST /tasks/:id/link-curriculum`

### Planning
- `GET /calendar`
- `POST /calendar/non-teaching-days`
- `POST /planning/sessions`

### Evidences
- `POST /evidences/upload`
- `GET /evidences`
- `PATCH /evidences/:id/review`

### Evaluation
- `POST /assessments`
- `GET /students/:id/progress`
- `GET /projects/:id/curriculum-trace`

### Progression
- `POST /progression/requirements`
- `POST /progression/authorizations`
- `GET /students/:id/safety-status`

### AI
- `POST /ai/student-assistant`
- `POST /ai/teacher-assistant`

---

# 6.7. Base de datos recomendada

## Entidades mínimas
- User
- Role
- Center
- Department
- Family
- Cycle
- Course
- Group
- Module
- LearningOutcome
- EvaluationCriterion
- Project
- ProjectPhase
- Task
- TaskDependency
- CalendarDay
- Session
- Evidence
- EvidenceComment
- AssessmentInstrument
- AssessmentRecord
- Observation
- StudentProgress
- SafetyRequirement
- MachineAuthorization
- Alert
- AIInteraction

## Relaciones críticas
- un proyecto puede pertenecer a un curso y estar vinculado a varios módulos;
- una fase pertenece a un proyecto;
- una tarea pertenece a una fase;
- una tarea puede vincularse a varios RA y CE;
- un alumno puede subir varias evidencias por tarea;
- una valoración puede vincularse a tarea, alumno, RA y CE;
- una tarea puede requerir un prerrequisito técnico;
- una autorización de seguridad pertenece a un alumno y a una máquina, herramienta o proceso.

---

# 6.8. Reglas funcionales del backend

## Reglas obligatorias
- no permitir acceso a rutas sin autenticación donde proceda;
- no permitir crear tareas sin fase;
- no permitir fechas incoherentes;
- no permitir asociar RA o CE incompatibles con el módulo;
- no permitir subir evidencias sin contexto válido;
- no permitir marcar como habilitado a un alumno sin registro correspondiente;
- no permitir respuestas IA sin contexto y trazabilidad.

---

# 6.9. Validación y seguridad

## Requisitos mínimos
- JWT o sistema equivalente;
- hashing seguro de contraseñas;
- guards por rol;
- validación DTO;
- rate limiting en endpoints sensibles;
- logs de acciones críticas;
- manejo seguro de ficheros;
- separación entre dato sensible y dato visible por rol.

---

# 6.10. Documentación del backend

Debe generarse:

- documentación Swagger o equivalente;
- README del backend;
- guía de variables de entorno;
- guía de arranque local;
- ejemplos de requests y responses;
- decisiones de arquitectura.

---

# 6.11. Entregables esperados del backend

1. estructura modular completa;
2. configuración inicial del servidor;
3. conexión a base de datos;
4. modelos Prisma;
5. migraciones iniciales;
6. auth y roles;
7. endpoints base funcionales;
8. validaciones;
9. documentación API;
10. semilla inicial opcional.

---

# 7. IA contextualizada

# 7.1. Principio general
La IA no debe ser la base del sistema, sino una capa posterior de apoyo.

# 7.2. IA para alumnado
## Debe poder
- explicar una tarea;
- resumir pasos;
- recordar entregables;
- orientar sobre documentación asociada;
- dar apoyo teórico contextual.

## No debe
- sustituir la evaluación docente;
- dar instrucciones inseguras de uso de maquinaria;
- inventar estados académicos.

# 7.3. IA para profesorado
## Debe poder
- resumir progreso;
- sugerir vínculo tarea-RA-CE;
- proponer comentarios de seguimiento;
- detectar huecos o retrasos.

## No debe
- emitir decisiones automáticas finales de evaluación sin validación humana.

# 7.4. Requisitos técnicos de IA
- registro de prompt y respuesta;
- identificación de usuario y rol;
- contexto controlado;
- filtros de seguridad;
- posibilidad de cambiar proveedor de modelo.

---

# 8. MVP recomendado

# 8.1. MVP fase 1
Implementar primero:

- auth;
- roles;
- estructura académica;
- currículo básico;
- proyectos;
- fases;
- tareas;
- calendario;
- panel alumno;
- panel profesor;
- evidencias;
- observaciones;
- progreso básico.

# 8.2. MVP fase 2
Añadir:

- rúbricas;
- matriz curricular;
- cronograma visual;
- progresión técnica;
- alertas;
- informes.

# 8.3. MVP fase 3
Añadir:

- asistente IA para alumno;
- asistente IA para profesorado;
- sugerencias curriculares;
- resúmenes automáticos.

---

# 9. Datos que el agente debe solicitar si no están definidos

## 9.1. Datos académicos
- ciclos exactos que se implementarán primero;
- cursos y grupos iniciales;
- módulos concretos implicados;
- relación real de RA y CE;
- sistema de evaluación del centro.

## 9.2. Datos funcionales
- flujos reales de revisión de evidencias;
- si el alumno puede ver notas o solo progreso;
- quién puede crear o editar proyectos;
- nivel de acceso de tutoría y jefatura;
- plantillas de proyectos existentes.

## 9.3. Datos de seguridad y taller
- catálogo de máquinas y herramientas;
- reglas de habilitación;
- prerrequisitos de PRL;
- condiciones de bloqueo de tareas.

## 9.4. Datos técnicos
- proveedor de autenticación;
- proveedor de almacenamiento de archivos;
- hosting previsto;
- dominio o subdominio;
- si habrá SSO institucional;
- entorno de despliegue.

## 9.5. Datos visuales
- nombre final del aplicativo;
- logotipo;
- colores corporativos;
- iconografía deseada;
- idioma o idiomas.

## 9.6. Datos de IA
- modelo o proveedor preferido;
- si habrá uso por alumnado desde el inicio;
- políticas de registro de conversaciones;
- límites de uso.

---

# 10. Instrucción final para el editor agéntico

## Debes hacer lo siguiente
1. crear la estructura completa del monorepo;
2. preparar frontend y backend con configuración base;
3. implementar primero el MVP fase 1;
4. documentar cada módulo;
5. no asumir decisiones curriculares o institucionales críticas sin avisar;
6. si falta información, solicitarla de manera estructurada antes de avanzar en la parte afectada;
7. mantener el código limpio, tipado, modular y listo para evolución posterior.

## Formato esperado de solicitud de datos faltantes
Cuando falte información, usa este formato:

```md
## Información necesaria para continuar
### Bloque afectado
[Nombre del módulo o funcionalidad]

### Qué falta
- ...
- ...

### Por qué es necesario
- ...

### Preguntas
1. ...
2. ...
3. ...
```

---

# 11. Resultado esperado del trabajo del editor agéntico

Al finalizar la primera fase, debe existir una base funcional del aplicativo con:

- frontend operativo por roles;
- backend modular con API funcional;
- base de datos estructurada;
- autenticación;
- proyectos, fases y tareas;
- gestión de evidencias;
- seguimiento básico;
- documentación técnica suficiente para continuar iterando.

---

# 12. Nota estratégica final

Este aplicativo no debe desarrollarse como una simple plataforma de tareas ni como un chatbot educativo. Debe construirse como una **plataforma de orquestación pedagógica para Formación Profesional**, con capacidad de integrar currículo, proyectos, coordinación docente, progresión técnica y evaluación basada en evidencias.

