# 12 — Rutas y navegación

## Rutas por rol

### Público (sin autenticación)
| Ruta | Página |
|---|---|
| `/` | Landing / redirect a login |
| `/login` | Formulario de login |
| `/recuperar-acceso` | Solicitar reset de contraseña |

### Alumno
| Ruta | Página |
|---|---|
| `/alumno` | Dashboard principal |
| `/alumno/proyectos` | Lista de proyectos asignados |
| `/alumno/proyectos/[id]` | Detalle del proyecto con fases y tareas |
| `/alumno/agenda` | Calendario personal con sesiones y entregas |
| `/alumno/evidencias` | Historial de evidencias subidas |
| `/alumno/progreso` | Progreso por RA y CE |
| `/alumno/perfil` | Datos personales |
| `/alumno/asistente` | Chat con asistente IA (fase 3) |

### Profesor
| Ruta | Página |
|---|---|
| `/profesor` | Dashboard principal |
| `/profesor/proyectos` | Lista de proyectos del departamento |
| `/profesor/proyectos/[id]` | Detalle de proyecto con gestión de fases |
| `/profesor/tareas` | Lista de tareas (filtrable por fase, módulo, estado) |
| `/profesor/calendario` | Calendario con sesiones, entregas y hitos |
| `/profesor/evidencias` | Evidencias pendientes de revisión |
| `/profesor/evaluacion` | Registro de valoraciones y rúbricas |
| `/profesor/alumnado` | Lista de alumnos con progreso y seguridad |
| `/profesor/coordinacion` | Vista de coordinación entre módulos |
| `/profesor/matriz-curricular` | Mapa de cobertura RA/CE por proyecto |

### Jefatura / Coordinación
| Ruta | Página |
|---|---|
| `/jefatura` | Dashboard con indicadores generales |
| `/jefatura/proyectos` | Gestión de proyectos (crear, editar, archivar) |
| `/jefatura/plantillas` | Plantillas de proyectos reutilizables |
| `/jefatura/indicadores` | Panel analítico: cobertura, progreso, alertas |
| `/jefatura/estructura-academica` | Gestión de ciclos, módulos, grupos |

### Administración
| Ruta | Página |
|---|---|
| `/admin` | Dashboard de administración |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/roles` | Configuración de roles y permisos |
| `/admin/configuracion` | Parámetros del sistema |
| `/admin/catalogos` | Catálogos de herramientas, EPIs, etc. |
| `/admin/logs` | Registro de auditoría |

## Guards de ruta

Implementar middleware en el layout de `/(dashboard)` que:

1. Verifica que el usuario tiene sesión activa.
2. Redirige a `/login` si no hay sesión.
3. Verifica que el rol del usuario tiene acceso a la subruta solicitada.
4. Redirige al dashboard del rol correspondiente si intenta acceder a una ruta no autorizada.

```typescript
// Ejemplo de mapeo rol → ruta base
const ROLE_HOME = {
  ADMIN: '/admin',
  JEFATURA: '/jefatura',
  PROFESOR: '/profesor',
  ALUMNO: '/alumno',
};
```

## Navegación por sidebar

La sidebar muestra ítems distintos según el rol:

### Sidebar del alumno
- Inicio (dashboard)
- Mi proyecto
- Agenda
- Evidencias
- Mi progreso
- Asistente IA

### Sidebar del profesor
- Inicio (dashboard)
- Proyectos
- Tareas
- Calendario
- Evidencias
- Evaluación
- Alumnado
- Coordinación
- Matriz curricular

### Sidebar de jefatura
- Inicio (dashboard)
- Proyectos
- Plantillas
- Indicadores
- Estructura académica

### Sidebar de admin
- Inicio
- Usuarios
- Roles
- Configuración
- Catálogos
- Logs

## Breadcrumbs

El sistema de breadcrumbs debe generarse automáticamente a partir de la ruta:

```
Profesor > Proyectos > Taburete de taller > Fase 2: Preparación > Tarea: Corte de piezas
```

Cada nivel del breadcrumb es clickeable y navega al nivel correspondiente.
