# 07 — Evidencias y evaluación

## Objetivo

Gestionar la entrega de evidencias por parte del alumnado, su revisión por el profesorado, y el registro de valoraciones vinculadas a RA y CE con trazabilidad completa.

## Endpoints — Evidencias

```
POST   /evidences/upload             → Subir evidencia (ALUMNO)
GET    /evidences                    → Lista (filtrable por tarea, alumno, estado)
GET    /evidences/:id                → Detalle con comentarios
PATCH  /evidences/:id/review         → Cambiar estado de revisión (PROFESOR)
POST   /evidences/:id/comments       → Añadir comentario
```

## Endpoints — Evaluación

```
GET    /assessment-instruments          → Lista de instrumentos (rúbricas, listas de cotejo)
POST   /assessment-instruments          → Crear instrumento
GET    /assessment-instruments/:id      → Detalle

POST   /assessments                     → Registrar valoración
GET    /assessments                     → Lista (filtrable por alumno, tarea, RA, CE)
PATCH  /assessments/:id                 → Editar valoración

GET    /students/:id/progress           → Progreso del alumno por RA
GET    /projects/:id/curriculum-trace   → Cobertura curricular del proyecto (ver doc 05)
```

## Endpoints — Observaciones

```
POST   /observations                    → Crear observación
GET    /observations                    → Lista (filtrable por alumno, tarea, tipo)
```

## Flujo de evidencias

```
1. ALUMNO sube evidencia vinculada a una tarea
   → Estado: PENDIENTE
   
2. PROFESOR revisa la evidencia
   → Si es correcta: Estado → ACEPTADA
   → Si necesita corrección: Estado → RECHAZADA + comentario
   
3. Si RECHAZADA, el ALUMNO puede subir nueva evidencia
   → La evidencia anterior queda como histórico
   
4. PROFESOR registra valoración (AssessmentRecord)
   → Vinculada a: alumno + tarea + RA + CE + instrumento
```

## Evidencias — Reglas de negocio

- Una evidencia siempre está vinculada a una tarea y un alumno.
- Solo el alumno asignado a esa tarea (a través de su grupo y el proyecto) puede subir evidencias.
- El profesor del módulo al que pertenece la tarea es quien revisa la evidencia.
- Los tipos de archivo permitidos deben validarse: imágenes (jpg, png), documentos (pdf, docx), vídeos (mp4, hasta un límite configurable de tamaño).
- Las evidencias no se eliminan; se marcan como sustituidas si el alumno sube una versión corregida.

## Evaluación — Instrumentos

Un instrumento de evaluación puede ser:

| Tipo | Descripción |
|---|---|
| `RUBRICA` | Tabla con criterios y niveles de logro (insuficiente, suficiente, notable, sobresaliente) |
| `LISTA_COTEJO` | Lista de ítems observables con sí/no |
| `OBSERVACION_DIRECTA` | Registro narrativo del profesor |

### Estructura de una rúbrica (campo `criteria` en JSON)

```json
{
  "levels": [
    { "name": "Insuficiente", "range": [1, 4] },
    { "name": "Suficiente", "range": [5, 6] },
    { "name": "Notable", "range": [7, 8] },
    { "name": "Sobresaliente", "range": [9, 10] }
  ],
  "items": [
    {
      "criterion": "Precisión del corte",
      "descriptions": {
        "Insuficiente": "Cortes irregulares, fuera de medida",
        "Suficiente": "Cortes aceptables con desviaciones menores",
        "Notable": "Cortes precisos con buen acabado",
        "Sobresaliente": "Cortes exactos, acabado profesional"
      }
    }
  ]
}
```

## Evaluación — Valoraciones (AssessmentRecord)

Cada valoración vincula:

- Un **alumno** concreto.
- Una **tarea** concreta.
- Un **RA** y opcionalmente un **CE** específico.
- Un **instrumento** de evaluación (opcional).
- Una **puntuación** numérica (0-10) y/o nota cualitativa.

### Reglas de negocio

- Solo el profesor del módulo al que pertenece el RA puede registrar valoraciones sobre ese RA.
- No se pueden registrar valoraciones sobre RA que no estén vinculados a la tarea (`TaskCurriculumLink`).
- Una valoración es editable mientras la evaluación del periodo esté abierta.
- El progreso del alumno (`StudentProgress`) se recalcula automáticamente al crear o editar una valoración.

## Progreso del alumno

`StudentProgress` almacena el nivel de logro acumulado de cada alumno por RA. Se recalcula como la media ponderada de las valoraciones de ese RA.

```
GET /students/:id/progress → 
{
  "studentId": "...",
  "outcomes": [
    {
      "learningOutcomeId": "...",
      "code": "RA1",
      "moduleName": "Mecanizado",
      "achievementLevel": 7.5,
      "assessmentCount": 3,
      "criteria": [
        { "code": "CE1a", "latestScore": 8.0 },
        { "code": "CE1b", "latestScore": 7.0 }
      ]
    }
  ],
  "overallAverage": 6.8
}
```

## Observaciones

Las observaciones son notas del profesorado sobre un alumno, vinculadas opcionalmente a una tarea. Tipos:

| Tipo | Uso |
|---|---|
| `SEGUIMIENTO` | Nota de progreso ordinaria |
| `INCIDENCIA` | Problema o alerta |
| `REFUERZO` | Nota positiva o de refuerzo |
| `PRL` | Incidencia de prevención de riesgos laborales |

> **Dato pendiente:** ¿El alumno puede ver las observaciones que el profesor registra sobre él, o solo ve su progreso numérico? Esto afecta a la visibilidad en el dashboard del alumno.
