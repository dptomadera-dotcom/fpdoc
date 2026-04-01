# 04 — Estructura académica y currículo

## Objetivo

Modelar la estructura organizativa del centro educativo y la información curricular oficial (RA, CE) de cada módulo profesional, permitiendo su carga, consulta y vinculación con proyectos y tareas.

## Jerarquía académica

```
Centro
  └── Departamento
        └── Familia Profesional
              └── Ciclo Formativo (Básico / Medio / Superior)
                    ├── Módulo Profesional (con RA y CE)
                    └── Curso (1º / 2º)
                          └── Grupo (alumnado matriculado)
```

## Endpoints

### Centros y departamentos
```
GET    /centers                    → Lista de centros
GET    /centers/:id                → Detalle con departamentos
POST   /centers                    → Crear centro (ADMIN)
```

### Familias y ciclos
```
GET    /families                   → Lista de familias profesionales
GET    /cycles                     → Lista de ciclos (filtrable por familia)
GET    /cycles/:id                 → Detalle con módulos y cursos
POST   /cycles                     → Crear ciclo (ADMIN, JEFATURA)
```

### Módulos
```
GET    /modules                    → Lista (filtrable por ciclo, curso)
GET    /modules/:id                → Detalle con RA y CE
POST   /modules                    → Crear módulo
PATCH  /modules/:id                → Editar módulo
GET    /modules/:id/teachers       → Profesores asignados
POST   /modules/:id/teachers       → Asignar profesor
```

### Cursos y grupos
```
GET    /courses                    → Lista (filtrable por ciclo)
GET    /groups                     → Lista (filtrable por curso)
POST   /groups                     → Crear grupo
POST   /groups/:id/students        → Matricular alumnos
GET    /groups/:id/students        → Lista de alumnos del grupo
```

### Currículo (RA y CE)
```
GET    /learning-outcomes                → Lista (filtrable por módulo)
POST   /learning-outcomes                → Crear RA
GET    /learning-outcomes/:id            → Detalle con CE asociados
GET    /evaluation-criteria              → Lista (filtrable por RA)
POST   /evaluation-criteria              → Crear CE
POST   /curriculum/import                → Importación de currículo
```

## Importación de currículo

El endpoint `POST /curriculum/import` debe aceptar un fichero (Markdown o JSON) con la estructura curricular de un módulo y extraer automáticamente los RA y CE.

### Formato de entrada esperado (Markdown)

```markdown
# Módulo: Mecanizado de madera y derivados
Código: 0778
Horas: 230
Curso: 1º

## RA1: Prepara materiales de madera y derivados
- CE1a: Identifica los tipos de madera maciza según su origen.
- CE1b: Clasifica los tableros derivados por composición y uso.
- CE1c: Selecciona materiales según ficha técnica del proyecto.

## RA2: Opera con herramientas manuales de corte
- CE2a: Selecciona la herramienta adecuada para cada operación.
- CE2b: Aplica las técnicas de afilado y mantenimiento.
```

### Lógica de importación

1. Parsear el fichero e identificar módulo, código, horas y curso.
2. Para cada `## RA...`, crear un `LearningOutcome`.
3. Para cada `- CE...`, crear un `EvaluationCriterion` vinculado al RA.
4. Validar que no existen duplicados por código.
5. Devolver un resumen de lo importado para validación manual.

> **Dato pendiente:** Se necesitan los currículos reales del BOC para los módulos del ciclo piloto. Por ahora, el agente puede usar datos de ejemplo para construir la funcionalidad de importación.

## Reglas de negocio

- Un módulo pertenece a un solo ciclo.
- Un RA pertenece a un solo módulo.
- Un CE pertenece a un solo RA.
- Los códigos de módulo, RA y CE deben ser únicos dentro de su ámbito.
- La asignación de profesor a módulo (`ModuleTeacher`) debe ser única por par usuario-módulo.
- Un alumno matriculado en un grupo hereda acceso a todos los módulos del curso asociado.

## Estructura de FP relevante para el aplicativo

### Evaluaciones por curso
- **1º Curso:** Tres evaluaciones. La tercera (mayo-junio) incluye 160h de formación dual.
- **2º Curso:** Dos evaluaciones en centro. La tercera (marzo-mayo) es íntegramente dual (340h).

### Progresión técnica vinculada a evaluaciones
- **1ª Evaluación (1º):** Solo herramientas manuales (`MANUAL`).
- **2ª Evaluación (1º):** Manuales + portátiles (`PORTATIL`).
- **3ª Evaluación (1º):** Manuales + portátiles + taller (`TALLER`).
- **2º Curso:** Todas las herramientas disponibles. Enfoque en gestión de proyectos completos.

Esta progresión se refleja en el campo `toolLevel` de `Project` y `Task`, y se valida contra las autorizaciones del alumno (`MachineAuthorization`).
