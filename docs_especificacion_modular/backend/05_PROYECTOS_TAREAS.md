# 05 — Proyectos, fases y tareas

## Objetivo

Gestionar el ciclo de vida completo de los proyectos transversales: desde su creación y diseño en fases hasta la asignación y seguimiento de tareas vinculadas al currículo.

## Modelo conceptual

```
Proyecto (ej: "Taburete de taller")
  ├── Módulos implicados (Mecanizado, Materiales, Control de almacén...)
  ├── Fase 1: Diseño
  │     ├── Tarea: Dibujar plano a escala → RA1 de Diseño
  │     └── Tarea: Calcular lista de materiales → RA2 de Materiales
  ├── Fase 2: Preparación
  │     ├── Tarea: Seleccionar madera → RA1 de Materiales
  │     └── Tarea: Preparar piezas con serrucho → RA2 de Mecanizado [MANUAL]
  └── Fase 3: Montaje
        ├── Tarea: Ensamblar estructura → RA3 de Mecanizado [PORTATIL]
        └── Tarea: Acabado superficial → RA4 de Acabados
```

## Endpoints — Proyectos

```
GET    /projects                       → Lista (filtrable por curso, estado, evaluación)
POST   /projects                       → Crear proyecto (JEFATURA, PROFESOR)
GET    /projects/:id                   → Detalle con fases, módulos y progreso
PATCH  /projects/:id                   → Editar proyecto
DELETE /projects/:id                   → Archivar proyecto (soft delete)
POST   /projects/:id/modules           → Vincular módulos al proyecto
DELETE /projects/:id/modules/:moduleId → Desvincular módulo
GET    /projects/:id/curriculum-trace  → Mapa completo RA/CE cubiertos por el proyecto
```

## Endpoints — Fases

```
GET    /projects/:id/phases            → Lista de fases ordenadas
POST   /projects/:id/phases            → Crear fase
PATCH  /phases/:id                     → Editar fase
DELETE /phases/:id                     → Eliminar fase (solo si no tiene tareas)
PATCH  /phases/reorder                 → Reordenar fases
```

## Endpoints — Tareas

```
GET    /tasks                          → Lista (filtrable por fase, módulo, profesor, estado)
POST   /tasks                          → Crear tarea
GET    /tasks/:id                      → Detalle con vínculos curriculares y dependencias
PATCH  /tasks/:id                      → Editar tarea
DELETE /tasks/:id                      → Eliminar tarea

POST   /tasks/:id/link-curriculum      → Vincular RA y CE a la tarea
DELETE /tasks/:id/link-curriculum/:linkId → Desvincular

POST   /tasks/:id/dependencies         → Añadir dependencia (prerrequisito)
DELETE /tasks/:id/dependencies/:depId   → Eliminar dependencia
```

## Reglas de negocio — Proyectos

- Un proyecto pertenece a un curso.
- Un proyecto puede involucrar varios módulos (a través de `ProjectModule`).
- El `toolLevel` del proyecto define el nivel máximo de herramientas permitido.
- El `evaluationPeriod` indica en qué evaluación se ejecuta el proyecto.
- Solo `JEFATURA` puede crear proyectos. `PROFESOR` puede editar tareas de los módulos que tiene asignados.
- Un proyecto en estado `ACTIVO` no puede eliminarse, solo archivarse.

## Reglas de negocio — Tareas

- Una tarea pertenece obligatoriamente a una fase.
- Una tarea puede vincularse a varios RA y CE (de los módulos del proyecto).
- No se puede vincular un RA que pertenezca a un módulo no asignado al proyecto.
- Una tarea puede tener dependencias (otras tareas que deben completarse antes).
- Si una tarea tiene dependencias no completadas, su estado debe ser `BLOQUEADO`.
- El `toolLevel` de una tarea no puede superar el del proyecto.
- Una tarea con `toolLevel: TALLER` debe tener al menos un `SafetyRequirement` asociado.
- Solo el profesor asignado al módulo correspondiente puede evaluar tareas de ese módulo.

## Estados de una tarea

```
PENDIENTE → EN_CURSO → REVISADO → VALIDADO
                ↓
         REQUIERE_CORRECCION → EN_CURSO
                
BLOQUEADO (si tiene dependencias sin completar)
VENCIDO (si pasa la fecha límite sin completarse)
```

## Trazabilidad curricular

El endpoint `GET /projects/:id/curriculum-trace` debe devolver:

```json
{
  "projectId": "...",
  "modules": [
    {
      "moduleId": "...",
      "moduleName": "Mecanizado de madera",
      "learningOutcomes": [
        {
          "id": "...",
          "code": "RA1",
          "covered": true,
          "tasks": ["Tarea X", "Tarea Y"],
          "criteria": [
            { "code": "CE1a", "covered": true, "taskCount": 2 },
            { "code": "CE1b", "covered": false, "taskCount": 0 }
          ]
        }
      ]
    }
  ],
  "coverage": {
    "totalRA": 12,
    "coveredRA": 9,
    "totalCE": 48,
    "coveredCE": 35,
    "percentage": 72.9
  }
}
```

Este endpoint es clave para que el profesorado detecte qué RA y CE no están cubiertos por el proyecto.
