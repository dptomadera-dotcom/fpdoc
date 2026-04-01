# 06 — Planificación y calendario

## Objetivo

Gestionar el calendario académico, las sesiones de clase y la planificación temporal de los proyectos, respetando los periodos de evaluación y la formación dual.

## Endpoints

### Calendario
```
GET    /calendar                           → Días del rango solicitado (query: from, to, groupId)
POST   /calendar/days                      → Crear/actualizar días (batch)
POST   /calendar/non-teaching-days         → Marcar días no lectivos
GET    /calendar/periods                   → Periodos de evaluación configurados
POST   /calendar/periods                   → Crear periodo de evaluación
```

### Sesiones
```
GET    /sessions                           → Lista (filtrable por grupo, módulo, fecha)
POST   /sessions                           → Crear sesión
POST   /sessions/bulk                      → Crear sesiones semanales recurrentes
PATCH  /sessions/:id                       → Editar sesión
DELETE /sessions/:id                       → Eliminar sesión
```

## Calendario académico

El sistema necesita conocer:

- Qué días son lectivos y cuáles no (festivos, vacaciones, exámenes).
- En qué periodo de evaluación cae cada semana.
- Cuándo empiezan y terminan los periodos de formación dual.

### Estructura de `CalendarDay`

Cada día del curso académico tiene un registro:

| Campo | Descripción |
|---|---|
| `date` | Fecha (única) |
| `isTeaching` | Si es día lectivo |
| `label` | Descripción opcional (festivo, examen...) |
| `periodId` | Evaluación a la que pertenece (1ª, 2ª, 3ª) |

### Precarga del calendario

Al inicio del curso, se deben precargar todos los días del año académico (septiembre a junio) marcando como lectivos los de lunes a viernes y como no lectivos los festivos conocidos. El profesorado o jefatura puede ajustar después.

## Sesiones de clase

Una sesión representa un bloque horario real en el que un grupo tiene clase de un módulo con un profesor en un aula.

### Creación de sesiones recurrentes

`POST /sessions/bulk` permite crear sesiones semanales para todo un periodo:

```json
{
  "groupId": "...",
  "moduleId": "...",
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "09:00",
  "room": "Taller 1",
  "fromDate": "2025-09-15",
  "toDate": "2025-12-19"
}
```

El sistema debe crear una sesión por cada día lectivo que coincida con el `dayOfWeek` indicado, saltando los días no lectivos del calendario.

## Vinculación con proyectos

Las fechas de inicio y fin de un proyecto y sus fases deben ser coherentes con el calendario:

- No se deben planificar tareas en días no lectivos.
- Las fechas de un proyecto no deben exceder el periodo de evaluación asignado.
- El sistema debe alertar si una tarea tiene fecha límite en un día no lectivo.

## Periodos de evaluación de FP

| Periodo | Curso | Fechas aproximadas | Observaciones |
|---|---|---|---|
| 1ª Evaluación | 1º | Septiembre - Diciembre | Herramientas manuales |
| 2ª Evaluación | 1º | Enero - Abril | Manuales + portátiles |
| 3ª Evaluación | 1º | Mayo - Junio | Dual en empresa (160h) |
| 1ª Evaluación | 2º | Septiembre - Diciembre | Proyecto completo |
| 2ª Evaluación | 2º | Enero - Febrero | Proyecto completo |
| Dual | 2º | Marzo - Mayo | En empresa (340h) |

> **Dato pendiente:** Se necesitan las fechas exactas del calendario académico del centro para el curso que se implemente como piloto.

## Reglas de negocio

- Solo `ADMIN` y `JEFATURA` pueden gestionar el calendario y los periodos.
- `PROFESOR` puede consultar el calendario y las sesiones de sus módulos.
- `ALUMNO` puede consultar las sesiones de su grupo.
- Las sesiones no pueden solaparse para el mismo grupo en la misma franja horaria.
- El calendario es por centro, no global.
