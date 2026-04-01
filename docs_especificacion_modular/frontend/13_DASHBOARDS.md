# 13 — Dashboards por rol

## Dashboard del alumno (`/alumno`)

### Objetivo
Vista rápida del estado actual del alumno: qué tiene que hacer, qué ha entregado, cómo va su progreso.

### Secciones

**Proyecto activo**
- Nombre del proyecto, fase actual, porcentaje de avance.
- Link directo al detalle del proyecto.

**Tareas pendientes**
- Lista de las 5 tareas más próximas por fecha.
- Cada tarea muestra: título, módulo, fecha límite, estado (badge de color).
- Las tareas bloqueadas muestran icono de candado con tooltip explicativo.

**Próximas sesiones**
- Las 3-5 próximas sesiones de clase.
- Cada sesión muestra: módulo, hora, aula/taller, profesor.

**Evidencias requeridas**
- Contador de evidencias pendientes de entrega.
- Contador de evidencias devueltas para corrección.

**Observaciones recientes**
- Últimas 3 observaciones del profesorado (si el alumno tiene permiso de verlas).

**Progreso general**
- Barra o anillo de progreso con porcentaje de RA completados.
- Mini-gráfico de progreso por módulo.

---

## Dashboard del profesor (`/profesor`)

### Objetivo
Vista de control: estado del grupo, entregas pendientes, alertas y cronograma.

### Secciones

**Estado general del grupo**
- Indicadores rápidos: nº alumnos, nº tareas activas, nº evidencias pendientes de revisión.
- Semáforo visual: verde (todo en orden), amarillo (hay retrasos), rojo (hay incidencias críticas).

**Entregas pendientes de revisión**
- Lista de evidencias subidas por alumnos que aún no han sido revisadas.
- Cada evidencia muestra: alumno, tarea, fecha de entrega, tipo de archivo.
- Acción rápida: abrir para revisar.

**Tareas activas**
- Tareas de los módulos del profesor que están en curso.
- Filtrable por proyecto y fase.

**Incidencias**
- Alumnos con tareas vencidas.
- Alumnos con evidencias rechazadas sin nueva entrega.
- Alertas de seguridad/PRL.

**Cronograma resumido**
- Vista compacta del timeline del proyecto activo.
- Resalta la semana actual y las fases próximas.

**Alertas curriculares**
- RA sin cobertura en el proyecto activo.
- CE que no tienen tareas asociadas.

---

## Dashboard de jefatura (`/jefatura`)

### Objetivo
Vista estratégica: cómo van los proyectos del departamento, cobertura curricular, indicadores generales.

### Secciones

**Proyectos activos**
- Lista de todos los proyectos en curso con: nombre, ciclo, evaluación, progreso, estado.

**Cobertura curricular global**
- Porcentaje de RA y CE cubiertos por los proyectos activos, agregado por ciclo.
- Alerta si hay RA sin cobertura.

**Indicadores de progreso**
- Media de progreso por grupo.
- Distribución de alumnos por nivel de progreso (gráfico).

**Alertas del departamento**
- Proyectos retrasados.
- Módulos sin profesor asignado.
- Tareas vencidas acumuladas.

**Accesos rápidos**
- Crear nuevo proyecto.
- Ver estructura académica.
- Gestionar plantillas.

---

## Dashboard de admin (`/admin`)

### Objetivo
Vista técnica: estado del sistema, usuarios, actividad.

### Secciones

- Total de usuarios por rol.
- Usuarios activos en los últimos 7 días.
- Últimas acciones del log de auditoría.
- Estado del sistema (health check).
- Accesos rápidos a gestión de usuarios y configuración.

---

## Notas de implementación

- Todos los dashboards deben cargar datos con TanStack Query y mostrar skeletons durante la carga.
- Los datos se refrescan al volver a la pestaña (refetchOnWindowFocus).
- Cada sección del dashboard es un componente independiente (`DashboardCard`) que encapsula su propia query.
- Responsive: en móvil, las secciones se apilan verticalmente. El dashboard del alumno es especialmente importante en móvil (uso en taller).
