# Diagnóstico técnico del código real de `fpdoc`

Repositorio analizado:
- <https://github.com/dptomadera-dotcom/fpdoc>

Documentos relacionados:
- `fpdoc_actualizacion_multiagente.md`
- `fpdoc_checklist_actualizacion.md`

## 1. Propósito de este documento

Este documento aterriza la propuesta de actualización de `fpdoc` sobre la base del **código real observado en el repositorio GitHub**, no solo sobre la documentación funcional o estratégica.

Su objetivo es responder con precisión práctica a estas preguntas:

1. ¿Cuál es la base viva del proyecto?
2. ¿Qué partes están realmente implementadas?
3. ¿Qué partes parecen duplicadas, legacy o paralelas?
4. ¿Dónde encaja mejor la capa IA y el futuro MVP multiagente?
5. ¿Qué conviene reutilizar y qué conviene refactorizar?

---

## 2. Conclusión ejecutiva

La conclusión principal del análisis es esta:

> `fpdoc` no está en fase de idea pura. Ya existe una base funcional real, y el punto correcto para continuar parece estar en **`apps/api`** y **`apps/web`**, no en las carpetas `backend` y `frontend` aisladas.

Además:

- ya existe una implementación inicial de **módulo IA**
- ya existen pantallas reales relacionadas con IA y dashboard
- ya existe separación razonable por dominios funcionales
- el proyecto parece haber evolucionado desde una fase documental y/o paralela hacia una estructura tipo monorepo con `apps/*`

Esto implica una decisión técnica importante:

> La nueva actualización no debería construir otra capa separada desde cero en otro árbol, sino **auditar, reutilizar y evolucionar la base existente en `apps/api` y `apps/web`**.

---

## 3. Estructura observada del repositorio

A grandes rasgos, el repositorio contiene:

- `apps/api`
- `apps/web`
- `backend`
- `frontend`
- `packages/types`
- `prisma`
- `supabase`
- `docs_especificacion_modular`
- `especificacion_frontend_backend_fp_agentico.md`
- `instrucciones_supabase.md`
- `NEW/` con material adicional de arquitectura y UI

---

## 4. Diagnóstico de la estructura general

## 4.1. Dos líneas de proyecto coexistiendo

Se observan claramente dos líneas arquitectónicas dentro del repositorio:

### Línea A — estructura aparentemente vigente o más madura
- `apps/api`
- `apps/web`
- `packages`

### Línea B — estructura paralela, anterior o menos integrada
- `backend`
- `frontend`

## 4.2. Interpretación técnica

La línea A (`apps/*`) tiene señales más fuertes de ser la base activa actual porque:

- contiene más módulos funcionales ya organizados
- contiene más pantallas y rutas reales
- integra servicios, API y funcionalidades visibles
- incluye módulo IA ya presente
- encaja mejor con la idea de monorepo documentada

La línea B (`backend` y `frontend`) parece más cercana a un estado base, anterior, secundario o de transición.

## 4.3. Recomendación

Antes de cualquier desarrollo nuevo, conviene **asumir explícitamente y documentar** que la base viva del proyecto es:

- `apps/api`
- `apps/web`

Y tratar:
- `backend`
- `frontend`

como estructuras paralelas a evaluar, congelar o absorber, pero no como punto de entrada principal para la nueva capa IA.

---

## 5. Diagnóstico del backend real

## 5.1. Punto de entrada recomendado

El backend real a analizar y evolucionar está en:

- `apps/api/src`

## 5.2. Módulos observados

Dentro de `apps/api/src` aparecen ya módulos y piezas relevantes:

- `academic`
- `ai`
- `auth`
- `curriculum`
- `monitoring`
- `planning`
- `projects`
- `reports`
- `prisma`
- `common/supabase.service.ts`
- `app.module.ts`
- `main.ts`

## 5.3. Lectura del estado del backend

Esto indica que la aplicación ya tiene una base modular funcional organizada por dominio, lo que es buena noticia para la evolución del proyecto.

### Módulos especialmente relevantes para la futura capa IA

#### `auth`
Es crítico porque toda la IA futura dependerá de:
- usuario autenticado
- rol
- permisos
- límites de acceso al contexto

#### `academic`
Parece ser el núcleo de la estructura académica del sistema.
Será importante para construir contexto por:
- centro
- curso
- grupo
- módulo
- profesorado

#### `curriculum`
Es uno de los puntos más importantes del producto.
Aquí encaja de forma natural el futuro **revisor curricular**.

#### `planning`
Clave para asistentes que ayuden con:
- planificación
- tareas
- calendario
- hitos
- seguimiento

#### `projects`
Será esencial para:
- contexto de proyecto
- tareas
- fases
- coordinación transversal
- apoyo al profesorado y alumnado

#### `reports`
Es un módulo ideal para alimentar futuros agentes de:
- jefatura/coordinación
- seguimiento
- resúmenes ejecutivos

#### `ai`
Es el hallazgo más importante del análisis del backend.
Ya existe una capa IA inicial, lo que cambia la estrategia:

> no hay que imaginar dónde poner la IA: ya hay un sitio donde empezar a auditar y evolucionar.

---

## 6. Diagnóstico de la capa IA actual en backend

## 6.1. Qué existe ya

En `apps/api/src/ai` se observan:

- `ai.controller.ts`
- `ai.module.ts`
- `ai.service.ts`

## 6.2. Qué significa esto

La existencia de este módulo implica que:

- ya se contempló integrar IA en la aplicación
- probablemente ya hay una ruta o servicio inicial funcional o prototípico
- ya existe un sitio natural para evolucionar hacia arquitectura multiagente

## 6.3. Implicación técnica

La nueva actualización no debería empezar creando otro árbol IA aislado en otra parte del repositorio.

La estrategia correcta es:

1. auditar `apps/api/src/ai`
2. entender qué hace hoy
3. detectar si es:
   - prototipo simple
   - módulo genérico reaprovechable
   - implementación que necesita refactor profundo
4. convertir esa base en una estructura más robusta, por ejemplo:

```text
apps/api/src/ai
  /orchestrator
  /student-assistant
  /teacher-assistant
  /curriculum-review
  /shared
```

## 6.4. Recomendación fuerte

No eliminar de entrada el módulo `ai` actual.

Primero hay que responder:
- qué rutas expone
- qué dependencias usa
- si tiene ya contrato frontend
- si se puede reutilizar controller/service o si conviene partirlo

---

## 7. Diagnóstico del frontend real

## 7.1. Punto de entrada recomendado

El frontend real a analizar y evolucionar está en:

- `apps/web/src`

## 7.2. Rutas y pantallas observadas

En `apps/web/src/app` se han detectado ya varias rutas importantes:

### Autenticación
- `(auth)/login`
- `(auth)/register`
- `(auth)/forgot-password`

### Dashboard y vistas funcionales
- `dashboard`
- `dashboard/ai`
- `dashboard/coordinacion`
- `dashboard/curriculum`
- `dashboard/modules`
- `dashboard/programacion-viva`
- `dashboard/programaciones`
- `dashboard/reports`
- `dashboard/settings`
- `dashboard/transversal`

### Proyectos
- `projects`
- `projects/[id]`

### Otras
- `onboarding`

## 7.3. Qué implica esto

El frontend ya tiene una estructura funcional bastante avanzada y alineada con el dominio educativo.

La IA no tendría que integrarse en un vacío, sino en pantallas ya existentes.

---

## 8. Diagnóstico del frontend de IA actual

## 8.1. Qué existe ya

Se observan al menos:

- `apps/web/src/app/dashboard/ai/page.tsx`
- `apps/web/src/services/ai.service.ts`

## 8.2. Qué significa esto

Ya existe una intención clara de experiencia IA en el frontend.

Por tanto, el trabajo correcto no sería “inventar una nueva pantalla IA desde cero”, sino:

1. revisar la pantalla actual
2. revisar cómo consume servicios
3. ver si funciona como sandbox, panel simple o integración real
4. decidir si:
   - se mantiene y se evoluciona
   - se reutiliza parcialmente
   - o se sustituye manteniendo la ruta

## 8.3. Conclusión práctica

El dashboard de IA actual es el primer candidato natural para:
- pruebas del MVP IA
- validación del contrato backend/frontend
- integración progresiva del orquestador y asistentes especializados

---

## 9. Diagnóstico de servicios frontend

En `apps/web/src/services` ya existen varios servicios:

- `academic.service.ts`
- `ai.service.ts`
- `auth.service.ts`
- `curriculum.service.ts`
- `planning.service.ts`
- `projects.service.ts`
- `reporting.service.ts`
- `student.service.ts`
- `transversal.service.ts`
- `monitoring.service.ts`
- `curriculum-extraction.service.ts`

## 9.1. Lectura técnica

Esto indica que el frontend no está construido solo con fetchs improvisados desde las páginas, sino con una capa de servicios ya separada.

Eso favorece mucho la integración de la nueva capa IA, porque permite:
- mantener contratos limpios
- versionar endpoints IA
- reutilizar servicios en varias pantallas

## 9.2. Recomendación

La futura integración multiagente debería respetar esta estructura y ampliar `ai.service.ts` en lugar de romperla o duplicarla.

---

## 10. Diagnóstico del dominio y madurez funcional

## 10.1. Qué parece ya relativamente maduro por estructura

A nivel de organización del código, estas áreas parecen las mejor posicionadas para alimentar un MVP IA:

### Profesorado / coordinación
Por existencia de rutas y módulos como:
- `dashboard/coordinacion`
- `dashboard/programaciones`
- `reports`
- `planning`
- `projects`

### Currículo
Por existencia de:
- módulo `curriculum` en backend
- rutas `dashboard/curriculum`
- extracción curricular en frontend (`curriculum-extraction.service.ts`)

### Proyectos
Por existencia de:
- `projects`
- `projects/[id]`
- `projects.service.ts`
- módulo backend `projects`

## 10.2. Donde hay que comprobar más a fondo

### Alumnado
No aparece con tanta claridad una ruta explícita tipo `/student` o `/alumno` en la implementación `apps/web`, al menos en la revisión estructural rápida.

Eso no significa que no exista soporte funcional para alumno, pero sí indica que hay que revisar si:
- el rol de alumno está ya reflejado en la UI
- se reusa el dashboard genérico
- o está aún menos desarrollado que la parte docente/coordinación

### Evaluación y evidencias
No aparecen como módulos backend explícitos por nombre en `apps/api/src`, aunque sí hay modales y referencias en frontend (`EvidenceModal`, `GradingModal`).

Eso sugiere una de dos:
- o están implementados bajo otros módulos
- o están más verdes de lo que la especificación plantea

### Progresión y seguridad técnica
No aparece aún como módulo backend explícito en `apps/api/src`, por lo que probablemente esto aún no esté consolidado en código real.

---

## 11. Riesgos técnicos identificados

## 11.1. Riesgo de duplicidad y confusión

La coexistencia de:
- `apps/api` y `backend`
- `apps/web` y `frontend`

puede hacer que futuros desarrolladores o agentes trabajen en la carpeta incorrecta.

### Acción recomendada
Añadir una decisión arquitectónica explícita en documentación interna:
- cuál es la base oficial viva
- qué carpetas son legado, transición o referencia

## 11.2. Riesgo de IA genérica poco gobernada

El hecho de que ya exista un módulo `ai` puede ser positivo o peligroso:

- positivo, si está bien encapsulado
- peligroso, si es una implementación genérica sin control de contexto, permisos ni trazabilidad

### Acción recomendada
Auditar antes de extender.

## 11.3. Riesgo de desfase entre documentación y código

La documentación es rica y ambiciosa.
Es posible que el código aún no cubra varias piezas de esa visión.

### Acción recomendada
No diseñar la capa IA solo desde el documento funcional. Diseñarla desde el cruce entre:
- visión funcional
- entidades reales
- módulos reales
- pantallas reales

---

## 12. Punto exacto donde encaja el MVP multiagente

## 12.1. Backend

El MVP multiagente debe construirse encima de:

- `apps/api/src/ai`

Y apoyarse especialmente en:
- `auth`
- `curriculum`
- `projects`
- `planning`
- `reports`
- `academic`

## 12.2. Frontend

La primera integración visible debería hacerse en:

- `apps/web/src/app/dashboard/ai/page.tsx`

Y luego extenderse hacia:
- `dashboard`
- `projects/[id]`
- `dashboard/programaciones/[id]`
- `dashboard/curriculum`

## 12.3. MVP recomendado sobre base real

A partir de lo observado en código, el MVP multiagente con más sentido sigue siendo:

1. `student-assistant` *(si se confirma soporte de contexto de alumno)*
2. `teacher-assistant`
3. `curriculum-review`
4. `orchestrator` básico

Pero tácticamente, con lo visto hoy, el mejor orden podría ser incluso este:

1. `teacher-assistant`
2. `curriculum-review`
3. `orchestrator`
4. `student-assistant`

### Motivo
Las áreas de profesorado, coordinación, currículo y proyectos parecen hoy más claramente visibles y maduras en la implementación que la parte explícita de alumno.

---

## 13. Recomendación de procedimiento técnico real

## Paso 1 — Auditoría dirigida

Revisar archivo por archivo, al menos:

### Backend
- `apps/api/src/ai/ai.controller.ts`
- `apps/api/src/ai/ai.service.ts`
- `apps/api/src/ai/ai.module.ts`
- `apps/api/src/app.module.ts`
- `apps/api/src/auth/*`
- `apps/api/src/curriculum/*`
- `apps/api/src/projects/*`
- `apps/api/src/planning/*`
- `apps/api/src/reports/*`

### Frontend
- `apps/web/src/app/dashboard/ai/page.tsx`
- `apps/web/src/services/ai.service.ts`
- `apps/web/src/app/dashboard/page.tsx`
- `apps/web/src/app/projects/[id]/ProjectDetailClient.tsx`
- `apps/web/src/app/dashboard/programaciones/[id]/ProgramacionClient.tsx`

## Paso 2 — Decisión de base viva

Formalizar en documentación que el desarrollo nuevo debe hacerse sobre:
- `apps/api`
- `apps/web`

## Paso 3 — Refactor IA controlado

Convertir `apps/api/src/ai` desde su estado actual a una estructura más fuerte:

```text
apps/api/src/ai
  /orchestrator
  /teacher-assistant
  /curriculum-review
  /student-assistant
  /shared
```

## Paso 4 — Integración gradual en frontend

No exponer varios bots. Empezar por:
- un panel IA en `dashboard/ai`
- una integración contextual en proyectos
- una integración contextual en currículo/programaciones

---

## 14. Recomendación estratégica final basada en el código real

La mejor decisión técnica ahora mismo es esta:

> `fpdoc` debe evolucionarse desde su implementación viva en `apps/api` y `apps/web`, reutilizando y refactorizando la capa IA ya existente, en lugar de volver a diseñar una solución paralela desde cero.

### Qué significa en la práctica
- no crear otra arquitectura IA aislada fuera de `apps/api/src/ai`
- no desarrollar nuevas piezas en `backend` o `frontend` salvo que se decida migrarlas explícitamente
- usar la base real ya construida para acelerar el MVP multiagente
- empezar por los dominios más maduros visibles en código: profesorado, currículo, proyectos y coordinación

---

## 15. Próximo entregable ideal después de este documento

El siguiente paso ya no debería ser otro documento conceptual amplio, sino una auditoría de detalle sobre archivos concretos que produzca algo como:

- qué hace hoy el módulo `ai`
- qué contratos expone
- qué partes se pueden conservar
- qué partes conviene romper y rehacer
- y un plan de refactor módulo por módulo

Ese siguiente nivel sería el documento ideal de:

- `fpdoc_auditoria_modulo_ai_actual.md`

---

## 16. Cierre

Este diagnóstico técnico confirma que:

- el proyecto tiene base real
- la capa IA ya existe en alguna forma
- el trabajo correcto ya no es teorizar solo, sino operar sobre código real
- la ruta más sensata es evolucionar el módulo IA actual y conectarlo con los dominios ya implementados

La actualización multiagente de `fpdoc` es viable, pero debe hacerse **sobre la estructura viva del proyecto**, no sobre una arquitectura imaginada al margen del repositorio real.
