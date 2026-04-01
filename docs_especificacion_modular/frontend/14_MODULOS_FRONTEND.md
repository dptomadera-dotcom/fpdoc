# 14 — Módulos funcionales del frontend

## 14.1. Autenticación y acceso

### Debe incluir
- Formulario de login (email + contraseña).
- Pantalla de recuperación de acceso.
- Persistencia de sesión (token en memoria + refresh automático).
- Redirección automática por rol tras login.
- Control de acceso por rutas (middleware en layout).

### Flujo
1. Usuario introduce credenciales.
2. Si válidas → almacenar token, redirigir al dashboard del rol.
3. Si inválidas → mensaje de error claro.
4. En cada navegación → verificar token. Si expirado → intentar refresh. Si falla → redirect a login.

---

## 14.2. Gestión de proyectos

### Debe permitir
- Crear proyecto (formulario: nombre, descripción, curso, evaluación, nivel de herramientas, módulos).
- Editar proyecto.
- Visualizar fases con lista de tareas por fase.
- Asignar/desasignar módulos al proyecto.
- Consultar progreso general del proyecto.
- Ver mapa de cobertura curricular (qué RA/CE cubre el proyecto).

### Vistas
- **Lista de proyectos:** tarjetas con nombre, estado, evaluación, progreso. Filtrable por curso y estado.
- **Detalle de proyecto:** cabecera con datos generales + tabs o secciones para fases, módulos, cobertura curricular.

---

## 14.3. Gestión de tareas

### Debe permitir
- Crear tarea dentro de una fase (formulario: título, descripción, módulo responsable, fechas, nivel herramienta).
- Editar tarea.
- Vincular RA y CE a la tarea (selector desplegable filtrado por módulos del proyecto).
- Establecer dependencias entre tareas.
- Visualizar tareas en modo lista o tablero (kanban por estado).

### Vista tablero (TaskBoard)
```
| PENDIENTE | EN CURSO | REVISADO | VALIDADO |
|   Tarea A |  Tarea C |  Tarea E |  Tarea G |
|   Tarea B |  Tarea D |          |          |
```

Cada tarjeta de tarea muestra: título, módulo (con color), fecha límite, badge de estado, icono de candado si bloqueada.

---

## 14.4. Calendario y cronograma

### Debe permitir
- Vista semanal: sesiones de clase del grupo.
- Vista mensual: sesiones + entregas + hitos.
- Vista por evaluación: todas las tareas del periodo con fechas.
- Vista Gantt del proyecto: fases y tareas en timeline horizontal.
- Marcar días lectivos y no lectivos (solo jefatura/admin).

### Implementación recomendada
- Usar FullCalendar para las vistas semanal y mensual.
- Usar una librería Gantt ligera para la vista de cronograma.
- Integrar eventos de distintos tipos con colores diferenciados: sesiones (azul), entregas (naranja), hitos (verde), no lectivos (gris).

---

## 14.5. Evidencias

### Debe permitir
- **Alumno:** subir archivo vinculado a una tarea. Seleccionar tarea → arrastrar archivo o seleccionar → confirmar.
- **Alumno:** ver historial de evidencias propias con estado.
- **Profesor:** ver lista de evidencias pendientes de revisión.
- **Profesor:** abrir evidencia, añadir comentario, cambiar estado (aceptar/rechazar).

### Flujo visual
```
[Alumno sube] → Estado: PENDIENTE (gris)
[Profesor revisa] → ACEPTADA (verde) o RECHAZADA (naranja) + comentario
[Alumno corrige] → Nueva evidencia PENDIENTE, la anterior queda como histórico
```

---

## 14.6. Evaluación

### Debe permitir
- Ver rúbricas asociadas a tareas o proyectos.
- Registrar valoración: seleccionar alumno, tarea, RA, CE, puntuación o nivel de logro.
- Consultar progreso acumulado de un alumno por RA.
- Visualizar tabla de cobertura de CE por proyecto.

### Vistas clave
- **RAProgressTable:** tabla con filas = RA, columnas = alumnos, celdas = nivel de logro con color.
- **CECoveragePanel:** panel que muestra qué CE están cubiertos por tareas y cuáles quedan sin cubrir.
- **AssessmentForm:** formulario para que el profesor registre una valoración rápida.

---

## 14.7. Progresión técnica y seguridad

### Debe permitir
- Visualizar prerrequisitos de una tarea (qué autorizaciones necesita el alumno).
- Registrar habilitación (profesor selecciona alumno + máquina → autoriza).
- Bloquear visualmente el acceso a tareas no autorizadas (candado + mensaje).
- Ver estado de seguridad por alumno (qué tiene autorizado, qué le falta).

### Vista `StudentSafetyStatusPanel`
Panel que muestra para un alumno:
- Nivel actual (MANUAL / PORTATIL / TALLER).
- Lista de máquinas autorizadas con fecha.
- Lista de máquinas pendientes de autorización con las tareas que bloquean.

---

## 14.8. Asistente IA (fase 3)

### Primera versión
- Interfaz tipo chat contextual.
- El alumno puede preguntar sobre su tarea actual, su proyecto, sus plazos.
- El profesor puede pedir resumen de progreso, sugerencias de vinculación curricular.
- Advertencia visible: "Este asistente es una herramienta de apoyo. Las decisiones de evaluación corresponden al profesorado."
- Acceso restringido por rol.
- Historial de interacciones visible para el usuario.
