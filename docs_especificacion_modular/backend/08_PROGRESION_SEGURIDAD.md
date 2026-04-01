# 08 — Progresión técnica y seguridad

## Objetivo

Controlar que el alumnado solo acceda a tareas y herramientas para las que está habilitado, respetando la progresión técnica del ciclo y los requisitos de prevención de riesgos laborales (PRL).

## Modelo de progresión

```
1ª Evaluación (1º) → Solo herramientas MANUAL
   formón, serrucho, martillo, escuadra, metro...

2ª Evaluación (1º) → MANUAL + PORTATIL
   caladora, sierra circular portátil, cepillo eléctrico, lijadora orbital...

3ª Evaluación (1º) → MANUAL + PORTATIL + TALLER
   sierra escuadradora, cepillo regruesadora, sierra de cinta, tupí...

2º Curso → Todas las herramientas. Enfoque en proyecto completo.
```

## Endpoints

```
GET    /safety/requirements                → Lista de requisitos de seguridad
POST   /safety/requirements                → Crear requisito
GET    /safety/requirements/:id            → Detalle

POST   /safety/authorizations              → Autorizar a un alumno para una máquina
GET    /safety/authorizations              → Lista (filtrable por alumno, nivel)
DELETE /safety/authorizations/:id          → Revocar autorización

GET    /students/:id/safety-status         → Estado de seguridad completo del alumno
```

## Requisitos de seguridad (SafetyRequirement)

Cada requisito describe qué condiciones debe cumplir un alumno para usar una herramienta o realizar una operación.

| Campo | Descripción |
|---|---|
| `name` | Nombre de la herramienta o proceso |
| `toolLevel` | MANUAL / PORTATIL / TALLER |
| `epiRequired` | EPIs necesarios (gafas, guantes, protector auditivo...) |
| `trainingReq` | Formación previa (ej: "Completar módulo PRL básico") |

## Autorizaciones (MachineAuthorization)

Una autorización registra que un alumno concreto ha sido habilitado para usar una máquina o herramienta.

| Campo | Descripción |
|---|---|
| `studentId` | Alumno autorizado |
| `machineName` | Nombre de la máquina/herramienta |
| `toolLevel` | Nivel de la herramienta |
| `authorizedAt` | Fecha de autorización |
| `authorizedBy` | Profesor que autoriza |
| `expiresAt` | Fecha de expiración (opcional, para revisiones periódicas) |
| `notes` | Observaciones |

## Vinculación con tareas

Las tareas que requieren herramientas específicas se vinculan a requisitos de seguridad a través de `TaskSafetyLink`.

### Lógica de bloqueo

Cuando una tarea tiene requisitos de seguridad asociados:

1. El sistema verifica si el alumno tiene autorizaciones activas para todos los requisitos.
2. Si le falta alguna autorización, la tarea aparece como `BLOQUEADO` para ese alumno.
3. El dashboard muestra un mensaje claro: "Esta tarea requiere autorización para: [lista de máquinas]".

```
GET /students/:id/safety-status →
{
  "studentId": "...",
  "currentLevel": "PORTATIL",
  "authorizations": [
    {
      "machineName": "Sierra circular portátil",
      "toolLevel": "PORTATIL",
      "authorizedAt": "2025-11-15",
      "authorizedBy": "Prof. García",
      "active": true
    }
  ],
  "pendingRequirements": [
    {
      "machineName": "Caladora",
      "toolLevel": "PORTATIL",
      "epiRequired": "Gafas de protección, guantes",
      "blockingTasks": ["Corte de piezas curvas"]
    }
  ]
}
```

## Reglas de negocio

- Solo `PROFESOR` y `JEFATURA` pueden crear autorizaciones.
- Un alumno no puede auto-autorizarse.
- El `toolLevel` de una tarea no puede superar el nivel máximo del periodo de evaluación en el que se ejecuta el proyecto.
- Si se revoca una autorización, las tareas que dependían de ella pasan a estado `BLOQUEADO`.
- Las autorizaciones se conservan entre evaluaciones (un alumno autorizado para sierra circular en la 2ª evaluación mantiene esa autorización en la 3ª).
- Las observaciones de tipo `PRL` quedan vinculadas al historial de seguridad del alumno.

## Dato pendiente

> Se necesita el catálogo real de máquinas y herramientas del taller del departamento, con sus requisitos de seguridad específicos (EPIs, formación previa). Este dato se recoge en el Bloque 3 de la Plantilla de Recogida de Datos.
