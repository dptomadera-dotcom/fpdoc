# Propuesta de actualización integral de `fpdoc` a partir del repositorio GitHub

Repositorio analizado: <https://github.com/dptomadera-dotcom/fpdoc>

## 1. Propósito de este documento

Este documento unifica en una sola pieza de trabajo la visión de actualización de `fpdoc` a partir del repositorio de GitHub compartido. Está pensado para servir como documento de referencia para un editor de código, un agente de desarrollo o un equipo técnico que deba continuar la evolución del proyecto.

La intención no es rehacer la idea original, sino ordenar, aterrizar y convertir en plan ejecutable lo que ya se intuye en el repositorio: una plataforma educativa modular para Formación Profesional con capacidad de evolucionar hacia una capa multiagente y de asistencia IA contextual.

---

## 2. Lectura general del proyecto actual

A partir del repositorio, la estructura observada incluye, entre otros, los siguientes elementos principales:

- `.claude`
- `.github`
- `NEW`
- `apps`
- `backend`
- `docs_especificacion_modular`
- `frontend`
- `packages`
- `prisma`
- `supabase`
- `especificacion_frontend_backend_fp_agentico.md`
- `instrucciones_supabase.md`
- `pnpm-workspace.yaml`
- `package.json`

Esto permite inferir varias cosas importantes:

1. El proyecto ya está concebido como una **base modular**, no como una aplicación improvisada.
2. Existe intención clara de separar:
   - frontend
   - backend
   - datos
   - documentación
   - paquetes compartidos
3. El proyecto ya contiene una **especificación funcional y técnica rica**, lo que facilita evolucionarlo con criterio.
4. La plataforma está pensada para un dominio educativo complejo, con foco en:
   - alumnado
   - profesorado
   - jefatura/coordinación
   - currículo
   - proyectos
   - evidencias
   - evaluación
   - seguimiento
   - asistencia IA

---

## 3. Visión funcional consolidada de `fpdoc`

`fpdoc` no debería evolucionar como una simple plataforma de tareas ni como un chatbot educativo genérico.

La lectura correcta del proyecto es esta:

> `fpdoc` debe consolidarse como una **plataforma de orquestación pedagógica para Formación Profesional**, capaz de integrar currículo, proyectos, planificación, evidencias, evaluación, seguimiento y asistencia contextual por rol.

### 3.1. Objetivos funcionales principales

La plataforma debe permitir:

- planificar proyectos transversales
- vincular tareas con Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE)
- coordinar profesorado por módulos y proyectos
- guiar al alumnado en tareas, fases y entregables
- registrar evidencias y observaciones
- realizar seguimiento del progreso individual y grupal
- controlar progresión técnica y requisitos de seguridad
- generar trazabilidad sobre currículo, tareas y evaluación
- incorporar progresivamente asistentes IA especializados

---

## 4. Diagnóstico estratégico del estado del proyecto

## 4.1. Lo que el proyecto ya tiene a favor

- una estructura modular razonable
- una especificación extensa y bien orientada
- separación técnica entre frontend, backend y datos
- intención clara de uso educativo real
- uso de tecnologías modernas y apropiadas para un proyecto escalable

## 4.2. Riesgo principal si se actualiza mal

El riesgo más grande no es técnico, sino conceptual:

- convertir `fpdoc` en un cajón de funcionalidades inconexas
- añadir IA de forma decorativa o descontrolada
- mezclar roles sin separación clara de permisos y contexto
- introducir asistentes sin trazabilidad ni límites

## 4.3. Criterio rector para la actualización

Toda nueva actualización debe respetar esta regla:

> La IA en `fpdoc` debe ser una **capa de asistencia contextual gobernada por backend, roles, permisos y trazabilidad**, nunca una sustitución ciega de los procesos pedagógicos o evaluativos.

---

## 5. Arquitectura funcional objetivo

La plataforma debe organizarse alrededor de cuatro grandes capas:

### 5.1. Capa académica

Responsable de:
- centros
- familias profesionales
- ciclos
- cursos
- grupos
- módulos
- asignación docente

### 5.2. Capa curricular

Responsable de:
- RA
- CE
- relaciones módulo ↔ currículo
- cobertura curricular
- trazabilidad curricular por proyecto y tarea

### 5.3. Capa operativa

Responsable de:
- proyectos
- fases
- tareas
- calendario
- evidencias
- observaciones
- evaluación
- progreso
- indicadores

### 5.4. Capa IA

Responsable de:
- asistencia contextual por rol
- revisión curricular
- ayuda operativa a profesorado
- apoyo al alumnado
- resúmenes y detección de huecos
- orquestación multiagente controlada

---

## 6. Propuesta de actualización de arquitectura técnica

## 6.1. Principio general

La actualización debe mantener el enfoque modular ya insinuado en el repositorio y reforzarlo.

### Frontend recomendado
- Next.js
- TypeScript estricto
- Tailwind CSS
- App Router
- componentes reutilizables
- separación por features y dominio

### Backend recomendado
- NestJS
- TypeScript
- PostgreSQL
- Prisma
- API REST modular
- capa IA gobernada desde módulos independientes

### Infraestructura recomendada
- monorepo con `pnpm`
- separación de apps y paquetes
- configuración por entorno
- conexión estructurada con Supabase/PostgreSQL

---

## 7. Mapa funcional de roles del producto

## 7.1. Alumnado

Debe poder:
- ver proyectos
- consultar tareas
- revisar entregables
- subir evidencias
- consultar progreso
- recibir ayuda contextual

## 7.2. Profesorado

Debe poder:
- planificar proyectos
- vincular tareas al currículo
- revisar evidencias
- hacer seguimiento del alumnado
- consultar progreso del grupo
- recibir asistencia pedagógica y operativa

## 7.3. Jefatura / coordinación

Debe poder:
- revisar programaciones
- supervisar cobertura curricular
- detectar incoherencias
- consultar indicadores
- obtener visión global por departamento, grupo o ciclo

## 7.4. Administración

Debe poder:
- gestionar usuarios
- roles
- configuraciones del sistema
- catálogos
- acceso a auditoría y trazabilidad

---

## 8. Propuesta de evolución multiagente

## 8.1. Idea central

La capa IA de `fpdoc` no debe construirse como un único chatbot universal.

La recomendación es evolucionar hacia una arquitectura con:

- un **agente coordinador/orquestador**
- varios **agentes funcionales especializados**
- una **capa de contexto y permisos** que limite lo que cada agente puede ver y responder

## 8.2. Principio de diseño

Cada agente debe representar una **función real del sistema educativo**, no solo una división técnica arbitraria.

---

## 9. Mapa de agentes recomendados para `fpdoc`

## 9.1. Agente coordinador general

### Función
- recibir la petición
- identificar rol, contexto, pantalla y entidad activa
- decidir qué agente debe intervenir
- combinar respuestas si es necesario

### Valor
Evita caos, duplicidad y mezcla incorrecta de responsabilidades.

---

## 9.2. Agente del alumnado

### Función
- explicar tareas
- resumir pasos
- recordar entregables
- orientar sobre próximos pasos
- responder dudas contextuales del proyecto

### Límites
- no califica
- no decide evaluaciones
- no ve datos reservados del profesorado

---

## 9.3. Agente del profesorado

### Función
- ayudar a planificar
- resumir el estado del grupo
- apoyar seguimiento
- sugerir acciones
- ayudar a interpretar tareas y proyectos

### Límites
- no debe cerrar decisiones finales automáticamente

---

## 9.4. Revisor curricular

### Función
- revisar relación entre tareas, proyectos, RA y CE
- detectar huecos de cobertura curricular
- identificar incoherencias
- proponer mejoras en el vínculo curricular

### Valor
Es uno de los agentes más diferenciales del producto.

---

## 9.5. Agente de jefatura / coordinación

### Función
- revisar programaciones
- generar visión global
- detectar incoherencias
- supervisar estado general

### Recomendación
No entra en el primer MVP, pero sí en una segunda fase.

---

## 9.6. Agente de evaluación y evidencias

### Función
- resumir evidencias
- agrupar comentarios
- preparar borradores de observación
- ayudar a revisar entregables

### Límites
- no emitir evaluación final automática

---

## 9.7. Agente de seguimiento y progreso

### Función
- detectar retrasos
- identificar bloqueos
- resumir progreso por alumno, grupo o proyecto
- priorizar focos de atención

---

## 9.8. Agente de seguridad y progresión técnica

### Función
- controlar prerrequisitos técnicos
- revisar habilitaciones
- advertir bloqueos por seguridad

### Nota
Debe ser especialmente conservador.

---

## 9.9. Agente documental / redacción

### Función
- ayudar con informes
- observaciones
- resúmenes
- documentación y redacción estructurada

---

## 9.10. Agente técnico interno del sistema

### Función
- auditar prompts
- revisar calidad de respuestas
- ayudar a mantener la capa IA
- servir como herramienta interna de administración

---

## 10. MVP multiagente recomendado

El MVP no debe intentar abarcar todo. Debe demostrar valor real pronto.

## 10.1. Piezas incluidas en el MVP

### 1. Orquestador básico
Responsable de:
- routing simple por rol y contexto

### 2. Agente del alumnado
Responsable de:
- ayuda contextual al alumno

### 3. Agente del profesorado
Responsable de:
- ayuda operativa y pedagógica al docente

### 4. Revisor curricular
Responsable de:
- análisis de coherencia entre tareas/proyectos y RA/CE

## 10.2. Piezas que deben quedar fuera del MVP inicial

- jefatura completa
- evaluación avanzada automatizada
- seguridad técnica avanzada
- documental complejo
- automatización crítica sobre datos sensibles
- multiagente paralelo sofisticado

---

## 11. Arquitectura técnica recomendada para la capa IA

## 11.1. Principio técnico

La IA debe vivir como una capa backend modular y auditada.

No debe depender del frontend para lógica de permisos ni para selección de contexto.

## 11.2. Estructura propuesta en backend

```text
backend/src/modules/ai
  /orchestrator
  /student-assistant
  /teacher-assistant
  /curriculum-review
  /coordination-assistant
  /evidence-review
  /progression-assistant
  /document-assistant
  /shared
    /dto
    /prompts
    /context
    /policies
    /adapters
    /logging
```

## 11.3. Estructura propuesta en frontend

```text
frontend/src/features/ai
  /components
    AssistantPanel.tsx
    AssistantComposer.tsx
    AssistantMessageList.tsx
    CurriculumReviewPanel.tsx
  /api
  /hooks
  /types
```

---

## 12. Endpoints recomendados para la capa IA

## 12.1. Genérico
- `POST /ai/ask`

## 12.2. Específicos
- `POST /ai/student-assistant`
- `POST /ai/teacher-assistant`
- `POST /ai/curriculum-review`
- `POST /ai/coordination-assistant`
- `POST /ai/evidence-review`
- `POST /ai/progression-assistant`
- `POST /ai/document-assistant`

## 12.3. Auditoría y trazabilidad
- `GET /ai/interactions`
- `GET /ai/interactions/:id`

---

## 13. Construcción de contexto

La actualización debe incluir una capa de construcción de contexto controlado.

## 13.1. Objetivo

Cada agente debe recibir solo el contexto que realmente puede usar según:
- el rol del usuario
- la entidad activa
- la pantalla activa
- los permisos del sistema

## 13.2. Estructura recomendada

```text
/shared/context
  build-student-context.ts
  build-teacher-context.ts
  build-curriculum-context.ts
  build-project-context.ts
  build-evidence-context.ts
```

## 13.3. Regla crítica

Nunca entregar al modelo más contexto del necesario.

---

## 14. Seguridad, permisos y trazabilidad

Esto es obligatorio en `fpdoc`.

## 14.1. Reglas mínimas

- validar rol antes de cada interacción IA
- limitar entidades accesibles por usuario
- separar contexto visible y contexto interno
- registrar interacciones críticas
- impedir respuestas fuera del ámbito autorizado

## 14.2. Entidad recomendada: `AIInteraction`

Campos mínimos sugeridos:

- `id`
- `userId`
- `role`
- `agentType`
- `message`
- `response`
- `route`
- `entityType`
- `entityId`
- `createdAt`
- `status`
- `model`
- `metadata`

## 14.3. Principio rector

En un entorno educativo, la IA debe ser **auditable**.

---

## 15. Integración recomendada en frontend

La IA no debe aparecer como un zoo de bots distintos. La interfaz debe ser limpia.

## 15.1. Modelo recomendado

Un único **asistente contextual visible**, con comportamiento adaptado según:
- el rol
- la ruta
- la entidad activa

## 15.2. Ubicaciones iniciales recomendadas

### Alumno
- dashboard
- detalle de proyecto
- detalle de tarea

### Profesor
- dashboard
- detalle de proyecto
- detalle de tarea
- matriz curricular

### Revisión curricular
- panel específico de coherencia curricular

---

## 16. Orden recomendado de implementación

## Fase 1 — diagnóstico del código real

Revisar:
- backend
- frontend
- auth
- roles
- prisma
- supabase
- estado de entidades curriculares y operativas

## Fase 2 — columna vertebral IA

Construir:
- `ai/shared`
- adapter de modelo
- DTOs
- políticas
- builders de contexto
- registro de interacciones

## Fase 3 — primer asistente

Implementar:
- `student-assistant`

## Fase 4 — segundo asistente

Implementar:
- `teacher-assistant`

## Fase 5 — UI mínima

Integrar:
- panel contextual de asistencia
- input
- historial básico

## Fase 6 — revisor curricular

Implementar:
- `curriculum-review`
- panel de revisión curricular

## Fase 7 — orquestador básico

Implementar:
- routing por rol y contexto

---

## 17. Roadmap sugerido por sprints

## Sprint 1
- revisión del código real
- mapeo de módulos existentes
- confirmación de entidades
- diseño de `ai/shared`

## Sprint 2
- adapter de modelo
- builders de contexto
- tabla `AIInteraction`
- DTOs y contratos

## Sprint 3
- `student-assistant`
- integración backend básica

## Sprint 4
- `teacher-assistant`
- integración frontend mínima

## Sprint 5
- `curriculum-review`
- panel de revisión curricular

## Sprint 6
- orquestador básico
- afinado de permisos y trazabilidad

---

## 18. Qué no debería hacerse todavía

No conviene, en esta actualización inicial:

- meter muchos agentes a la vez
- automatizar evaluación final
- conceder permisos amplios sin filtros
- exponer muchos “bots” distintos al usuario final
- permitir escritura automática de datos sensibles por IA
- construir experiencias demasiado grandes antes de validar el MVP

---

## 19. Recomendación estratégica final

La actualización ideal de `fpdoc` no debe orientarse a construir “un chatbot educativo”, sino a consolidar una **plataforma de apoyo pedagógico contextual y orquestado**.

La mejor estrategia es esta:

1. fortalecer la base técnica y funcional ya definida
2. añadir una capa IA modular y gobernada por backend
3. arrancar con un MVP multiagente pequeño pero útil
4. crecer por fases, manteniendo control, permisos y trazabilidad

---

## 20. Conclusión

A partir del repositorio GitHub de `fpdoc`, la actualización más sensata y con mayor potencial es:

- conservar la estructura modular del proyecto
- reforzar la separación por dominios
- introducir una capa IA especializada por rol y función
- comenzar con un MVP centrado en:
  - orquestador básico
  - agente del alumnado
  - agente del profesorado
  - revisor curricular
- dejar las funciones más complejas para una segunda fase

La arquitectura correcta para `fpdoc` es la de una **plataforma educativa con agentes funcionales coordinados**, no la de una app con un único chat genérico.

Si este documento se toma como base de actualización, el siguiente paso natural sería convertirlo en:

- plan técnico detallado por carpetas y módulos
- checklist de implementación por sprint
- especificación de endpoints y DTOs
- tareas concretas para desarrollo
