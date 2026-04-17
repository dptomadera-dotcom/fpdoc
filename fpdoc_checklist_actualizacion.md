# Checklist técnica ejecutable para la actualización de `fpdoc`

Documento base relacionado:
- `fpdoc_actualizacion_multiagente.md`

Repositorio de referencia:
- <https://github.com/dptomadera-dotcom/fpdoc>

## Objetivo

Convertir la propuesta estratégica de actualización de `fpdoc` en un plan de trabajo ejecutable, ordenado por fases, con tareas claras, dependencias, prioridad y criterio de finalización.

---

# Convenciones de trabajo

## Prioridades
- **P0** → imprescindible para avanzar
- **P1** → muy importante
- **P2** → deseable
- **P3** → posterior / mejora

## Estados sugeridos
- `[ ]` pendiente
- `[-]` en curso
- `[x]` hecho
- `[!]` bloqueado

## Criterio de hecho
Una tarea solo se considera completada si:
- está implementada
- está conectada con el resto del sistema
- está validada funcionalmente
- y está documentada mínimamente

---

# FASE 0 — Diagnóstico del código real

## Objetivo
Entender el estado real del proyecto antes de implementar la capa IA.

### Tareas
- [ ] **P0** Revisar la estructura real del `backend`
  - Objetivo: identificar módulos existentes, patrones, estado real y estilo arquitectónico.
  - Dependencias: ninguna.
  - Criterio de hecho: mapa simple de módulos actuales y su grado de madurez.

- [ ] **P0** Revisar la estructura real del `frontend`
  - Objetivo: localizar dashboards, rutas y componentes donde encajará la capa IA.
  - Dependencias: ninguna.
  - Criterio de hecho: listado de pantallas clave para alumno, profesor y revisión curricular.

- [ ] **P0** Revisar `prisma` y/o `supabase`
  - Objetivo: confirmar entidades reales ya implementadas.
  - Revisar especialmente:
    - usuarios
    - roles
    - proyectos
    - tareas
    - evidencias
    - progreso
    - RA
    - CE
  - Criterio de hecho: inventario de entidades disponibles y huecos de datos.

- [ ] **P0** Confirmar el sistema actual de autenticación y autorización
  - Objetivo: saber cómo se validan sesiones, roles y acceso a recursos.
  - Criterio de hecho: esquema claro de auth/roles/permisos actual.

- [ ] **P0** Evaluar si existen ya módulos funcionales para:
  - proyectos
  - tareas
  - currículo
  - evidencias
  - progreso
  - evaluación
  - Criterio de hecho: tabla `módulo → existe / parcial / no existe`.

- [ ] **P1** Revisar documentación modular (`docs_especificacion_modular`)
  - Objetivo: cruzar especificación y realidad del código.
  - Criterio de hecho: diferencias detectadas entre diseño y estado actual.

### Entregable de fase
- [ ] Documento breve `fpdoc_diagnostico_codigo_actual.md`

---

# FASE 1 — Alineación de arquitectura para IA

## Objetivo
Preparar la columna vertebral de la capa IA antes de crear asistentes concretos.

### Tareas
- [ ] **P0** Crear módulo base `ai/shared`
  - Ubicación sugerida:
    - `backend/src/modules/ai/shared`
  - Criterio de hecho: estructura creada y conectada al backend.

- [ ] **P0** Definir DTOs comunes de IA
  - Ejemplos:
    - `AskAiDto`
    - `StudentAssistantDto`
    - `TeacherAssistantDto`
    - `CurriculumReviewDto`
  - Criterio de hecho: DTOs tipados y validados.

- [ ] **P0** Definir contrato del proveedor de modelo
  - Objetivo: no acoplar toda la capa IA a un único proveedor.
  - Archivos sugeridos:
    - `model-provider.adapter.ts`
    - `openai.adapter.ts`
  - Criterio de hecho: interfaz estable + primera implementación funcional.

- [ ] **P0** Diseñar capa de construcción de contexto
  - Archivos sugeridos:
    - `build-student-context.ts`
    - `build-teacher-context.ts`
    - `build-curriculum-context.ts`
  - Criterio de hecho: builders capaces de devolver contexto controlado por rol.

- [ ] **P0** Diseñar políticas de acceso IA
  - Objetivo: impedir que agentes lean o usen contexto no autorizado.
  - Archivos sugeridos:
    - `canUseStudentAssistant`
    - `canUseTeacherAssistant`
    - `canUseCurriculumReview`
  - Criterio de hecho: capa de políticas aplicada antes de llamar al modelo.

- [ ] **P0** Crear entidad/tabla `AIInteraction`
  - Campos mínimos sugeridos:
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
  - Criterio de hecho: entidad persistente lista para auditoría básica.

- [ ] **P1** Definir estrategia de logging IA
  - Qué se guarda
  - Qué no se guarda
  - Cómo se resumen prompts y respuestas
  - Criterio de hecho: política mínima de trazabilidad documentada.

### Entregable de fase
- [ ] Infraestructura base de IA lista en backend

---

# FASE 2 — Implementación del `student-assistant`

## Objetivo
Crear el primer asistente útil para alumnado.

### Tareas
- [ ] **P0** Crear módulo `student-assistant`
  - Controller
  - Service
  - Module
  - Criterio de hecho: módulo funcional integrado en backend.

- [ ] **P0** Definir prompt del agente del alumnado
  - Debe:
    - explicar tareas
    - resumir pasos
    - orientar entregables
    - no inventar estados ni evaluar
  - Criterio de hecho: prompt versionado y separado.

- [ ] **P0** Construir contexto del alumnado
  - proyecto actual
  - tarea actual
  - calendario
  - progreso propio
  - evidencias pendientes
  - Criterio de hecho: respuesta basada en datos reales del alumno.

- [ ] **P0** Crear endpoint
  - `POST /ai/student-assistant`
  - Criterio de hecho: endpoint responde con contexto controlado.

- [ ] **P1** Registrar interacción en `AIInteraction`
  - Criterio de hecho: cada interacción queda trazada.

- [ ] **P1** Manejar errores y respuestas vacías
  - Criterio de hecho: no rompe UX ni expone errores crudos.

### Entregable de fase
- [ ] Asistente del alumnado operativo en backend

---

# FASE 3 — Implementación del `teacher-assistant`

## Objetivo
Crear el asistente operativo para profesorado.

### Tareas
- [ ] **P0** Crear módulo `teacher-assistant`
  - Controller
  - Service
  - Module
  - Criterio de hecho: módulo integrado y funcional.

- [ ] **P0** Definir prompt del agente del profesorado
  - Debe:
    - resumir estado del grupo
    - sugerir acciones
    - apoyar planificación
    - no emitir decisiones finales automáticas
  - Criterio de hecho: prompt separado y revisado.

- [ ] **P0** Construir contexto del profesorado
  - grupo
  - proyecto
  - tareas
  - calendario
  - evidencias
  - progreso agregado
  - Criterio de hecho: contexto útil y restringido por permisos.

- [ ] **P0** Crear endpoint
  - `POST /ai/teacher-assistant`
  - Criterio de hecho: endpoint usable desde frontend.

- [ ] **P1** Registrar interacción en `AIInteraction`

### Entregable de fase
- [ ] Asistente del profesorado operativo en backend

---

# FASE 4 — Implementación del `curriculum-review`

## Objetivo
Crear el agente de revisión curricular, uno de los más valiosos de `fpdoc`.

### Tareas
- [ ] **P0** Crear módulo `curriculum-review`
  - Controller
  - Service
  - Module

- [ ] **P0** Definir prompt del revisor curricular
  - Debe:
    - detectar incoherencias
    - señalar huecos
    - proponer mejoras
    - no inventar relaciones oficiales si faltan datos
  - Criterio de hecho: prompt claro, estructurado y técnico.

- [ ] **P0** Construir contexto curricular
  - tarea
  - proyecto
  - fase
  - módulo
  - RA
  - CE
  - relaciones existentes
  - Criterio de hecho: análisis basado en datos curriculares reales.

- [ ] **P0** Crear endpoint
  - `POST /ai/curriculum-review`

- [ ] **P1** Diseñar formato estructurado de respuesta
  - por ejemplo:
    - vínculos detectados
    - huecos
    - incoherencias
    - sugerencias
  - Criterio de hecho: respuesta fácilmente renderizable en frontend.

### Entregable de fase
- [ ] Revisor curricular operativo en backend

---

# FASE 5 — Frontend mínimo para asistentes

## Objetivo
Hacer visible el valor de la capa IA con una integración sobria y útil.

### Tareas
- [ ] **P0** Crear feature `frontend/src/features/ai`

- [ ] **P0** Crear componentes base
  - `AssistantPanel`
  - `AssistantComposer`
  - `AssistantMessageList`
  - `CurriculumReviewPanel`
  - Criterio de hecho: componentes reutilizables y limpios.

- [ ] **P0** Crear cliente API de IA
  - `askStudentAssistant.ts`
  - `askTeacherAssistant.ts`
  - `askCurriculumReview.ts`
  - Criterio de hecho: consumo estable de endpoints.

- [ ] **P0** Integrar asistente en dashboard de alumno
  - Criterio de hecho: alumno puede hacer consultas contextuales.

- [ ] **P0** Integrar asistente en dashboard de profesor
  - Criterio de hecho: profesor recibe ayuda contextual.

- [ ] **P1** Integrar asistente en detalle de proyecto
  - Criterio de hecho: IA con contexto de proyecto activo.

- [ ] **P1** Integrar asistente en detalle de tarea
  - Criterio de hecho: IA con contexto de tarea activa.

- [ ] **P1** Integrar panel de revisión curricular
  - ubicación recomendada: proyecto/tarea/matriz curricular
  - Criterio de hecho: análisis visualmente usable.

### Entregable de fase
- [ ] Capa IA visible en frontend en puntos clave

---

# FASE 6 — Orquestador básico

## Objetivo
Evitar que el frontend o el usuario tenga que “elegir bot” manualmente en muchos casos.

### Tareas
- [ ] **P1** Crear módulo `orchestrator`
  - Controller
  - Service
  - Module

- [ ] **P1** Definir reglas básicas de routing
  - por rol
  - por ruta
  - por entidad activa
  - por intención simple
  - Criterio de hecho: routing estable y comprensible.

- [ ] **P1** Crear endpoint
  - `POST /ai/ask`

- [ ] **P1** Resolver estrategia de delegación
  - `student-assistant`
  - `teacher-assistant`
  - `curriculum-review`
  - Criterio de hecho: el orquestador delega bien sin mezclar permisos.

### Entregable de fase
- [ ] Orquestador básico funcional

---

# FASE 7 — Calidad, permisos y endurecimiento

## Objetivo
Asegurar que el MVP no solo funciona, sino que es seguro, mantenible y coherente.

### Tareas
- [ ] **P0** Validar permisos por rol en todos los endpoints IA
  - Criterio de hecho: no hay fugas de datos por rol.

- [ ] **P0** Revisar contexto expuesto al modelo
  - Criterio de hecho: el modelo no recibe datos excesivos o sensibles innecesariamente.

- [ ] **P1** Probar casos borde
  - usuario sin contexto
  - proyecto inexistente
  - rol no permitido
  - entidad no accesible
  - respuesta vacía del proveedor
  - Criterio de hecho: el sistema degrada bien.

- [ ] **P1** Definir límites de uso
  - longitud de contexto
  - límites de frecuencia
  - límites por rol si aplica
  - Criterio de hecho: reglas mínimas documentadas y aplicadas.

- [ ] **P1** Revisar trazabilidad
  - qué se guarda
  - qué se anonimiza
  - qué se resume
  - Criterio de hecho: política de auditoría usable.

- [ ] **P2** Documentar la capa IA
  - README interno
  - módulos
  - endpoints
  - flujos
  - límites
  - Criterio de hecho: otro desarrollador puede continuar el trabajo.

### Entregable de fase
- [ ] MVP multiagente estable y gobernado

---

# FASE 8 — Segunda fase recomendada (posterior al MVP)

## Objetivo
Escalar la capa IA una vez demostrado el valor del MVP.

### Tareas sugeridas
- [ ] **P2** Implementar `coordination-assistant`
- [ ] **P2** Implementar `evidence-review`
- [ ] **P2** Implementar `progression-assistant`
- [ ] **P2** Añadir analítica de uso de la IA
- [ ] **P2** Añadir revisión interna de calidad de respuestas
- [ ] **P3** Añadir `document-assistant`
- [ ] **P3** Añadir agente técnico interno para mantenimiento IA

---

# Checklist resumida de entregables clave

## Imprescindibles
- [ ] Diagnóstico del código actual
- [ ] `ai/shared`
- [ ] Adaptador de modelo
- [ ] Builders de contexto
- [ ] Políticas de acceso
- [ ] Entidad `AIInteraction`
- [ ] `student-assistant`
- [ ] `teacher-assistant`
- [ ] `curriculum-review`
- [ ] UI mínima de asistente
- [ ] Orquestador básico
- [ ] Pruebas de permisos y trazabilidad

---

# Orden recomendado de ejecución real

1. Diagnóstico del código actual
2. Base IA compartida
3. `student-assistant`
4. `teacher-assistant`
5. Frontend mínimo
6. `curriculum-review`
7. Orquestador básico
8. Endurecimiento
9. Segunda fase

---

# Conclusión operativa

Si esta checklist se sigue con disciplina, `fpdoc` podrá evolucionar desde su estado actual hacia una plataforma educativa con una capa IA modular, útil y segura, sin perder control funcional ni coherencia pedagógica.

La prioridad no es “meter muchos agentes”, sino construir primero una base que:
- respete roles
- use contexto real
- sea trazable
- aporte valor inmediato a alumnado y profesorado
