# 09 — Catálogo de endpoints API REST

## Convenciones

- Base URL: `/api/v1`
- Autenticación: Bearer token (JWT) en header `Authorization`
- Formato: JSON
- Paginación: `?page=1&limit=20` en endpoints de lista
- Filtros: query params específicos por recurso
- Respuestas de error: `{ error: string, statusCode: number, message: string }`

## Auth
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/auth/login` | Público | Login con email y contraseña |
| POST | `/auth/refresh` | Público | Renovar access token |
| POST | `/auth/forgot-password` | Público | Solicitar reset de contraseña |
| POST | `/auth/reset-password` | Público | Cambiar contraseña con token |
| GET | `/auth/me` | Autenticado | Datos del usuario actual |

## Users
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/users` | ADMIN, JEFATURA | Lista paginada de usuarios |
| GET | `/users/:id` | Autenticado | Detalle de usuario |
| POST | `/users` | ADMIN | Crear usuario |
| PATCH | `/users/:id` | ADMIN, propio | Editar usuario |
| DELETE | `/users/:id` | ADMIN | Desactivar usuario |

## Academic
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/centers` | Autenticado | Lista de centros |
| GET | `/centers/:id` | Autenticado | Detalle con departamentos |
| POST | `/centers` | ADMIN | Crear centro |
| GET | `/families` | Autenticado | Familias profesionales |
| GET | `/cycles` | Autenticado | Ciclos formativos |
| GET | `/cycles/:id` | Autenticado | Detalle con módulos y cursos |
| POST | `/cycles` | ADMIN, JEFATURA | Crear ciclo |
| GET | `/modules` | Autenticado | Módulos (filtro: cycleId, year) |
| GET | `/modules/:id` | Autenticado | Detalle con RA y CE |
| POST | `/modules` | ADMIN, JEFATURA | Crear módulo |
| POST | `/modules/:id/teachers` | ADMIN, JEFATURA | Asignar profesor |
| GET | `/courses` | Autenticado | Cursos |
| GET | `/groups` | Autenticado | Grupos |
| POST | `/groups` | ADMIN, JEFATURA | Crear grupo |
| POST | `/groups/:id/students` | ADMIN, JEFATURA | Matricular alumnos |
| GET | `/groups/:id/students` | Autenticado | Alumnos del grupo |

## Curriculum
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/learning-outcomes` | Autenticado | RA (filtro: moduleId) |
| POST | `/learning-outcomes` | ADMIN, JEFATURA | Crear RA |
| GET | `/learning-outcomes/:id` | Autenticado | Detalle con CE |
| GET | `/evaluation-criteria` | Autenticado | CE (filtro: learningOutcomeId) |
| POST | `/evaluation-criteria` | ADMIN, JEFATURA | Crear CE |
| POST | `/curriculum/import` | ADMIN, JEFATURA | Importar currículo desde fichero |

## Projects
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/projects` | Autenticado | Lista (filtro: courseId, status, period) |
| POST | `/projects` | JEFATURA | Crear proyecto |
| GET | `/projects/:id` | Autenticado | Detalle completo |
| PATCH | `/projects/:id` | JEFATURA, PROFESOR | Editar proyecto |
| DELETE | `/projects/:id` | JEFATURA | Archivar |
| POST | `/projects/:id/modules` | JEFATURA | Vincular módulos |
| GET | `/projects/:id/curriculum-trace` | PROFESOR, JEFATURA | Cobertura curricular |
| GET | `/projects/:id/phases` | Autenticado | Fases del proyecto |
| POST | `/projects/:id/phases` | JEFATURA, PROFESOR | Crear fase |
| PATCH | `/phases/:id` | JEFATURA, PROFESOR | Editar fase |
| DELETE | `/phases/:id` | JEFATURA | Eliminar fase |

## Tasks
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/tasks` | Autenticado | Lista (filtro: phaseId, moduleId, status) |
| POST | `/tasks` | PROFESOR, JEFATURA | Crear tarea |
| GET | `/tasks/:id` | Autenticado | Detalle |
| PATCH | `/tasks/:id` | PROFESOR, JEFATURA | Editar tarea |
| DELETE | `/tasks/:id` | JEFATURA | Eliminar tarea |
| POST | `/tasks/:id/link-curriculum` | PROFESOR, JEFATURA | Vincular RA/CE |
| POST | `/tasks/:id/dependencies` | PROFESOR, JEFATURA | Añadir dependencia |

## Planning
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/calendar` | Autenticado | Días (query: from, to) |
| POST | `/calendar/days` | ADMIN, JEFATURA | Crear/actualizar días |
| POST | `/calendar/non-teaching-days` | ADMIN, JEFATURA | Marcar no lectivos |
| GET | `/calendar/periods` | Autenticado | Periodos de evaluación |
| POST | `/calendar/periods` | ADMIN, JEFATURA | Crear periodo |
| GET | `/sessions` | Autenticado | Sesiones (filtro: groupId, date) |
| POST | `/sessions` | ADMIN, JEFATURA | Crear sesión |
| POST | `/sessions/bulk` | ADMIN, JEFATURA | Crear sesiones recurrentes |

## Evidences
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/evidences/upload` | ALUMNO | Subir evidencia |
| GET | `/evidences` | Autenticado | Lista (filtro: taskId, studentId, status) |
| GET | `/evidences/:id` | Autenticado | Detalle con comentarios |
| PATCH | `/evidences/:id/review` | PROFESOR | Cambiar estado |
| POST | `/evidences/:id/comments` | PROFESOR, ALUMNO | Añadir comentario |

## Evaluation
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/assessment-instruments` | Autenticado | Instrumentos |
| POST | `/assessment-instruments` | PROFESOR, JEFATURA | Crear instrumento |
| POST | `/assessments` | PROFESOR | Registrar valoración |
| GET | `/assessments` | Autenticado | Lista de valoraciones |
| PATCH | `/assessments/:id` | PROFESOR | Editar valoración |
| GET | `/students/:id/progress` | Autenticado | Progreso por RA |
| POST | `/observations` | PROFESOR | Crear observación |
| GET | `/observations` | Autenticado | Lista de observaciones |

## Progression / Safety
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/safety/requirements` | Autenticado | Requisitos de seguridad |
| POST | `/safety/requirements` | PROFESOR, JEFATURA | Crear requisito |
| POST | `/safety/authorizations` | PROFESOR, JEFATURA | Autorizar alumno |
| GET | `/safety/authorizations` | Autenticado | Lista de autorizaciones |
| DELETE | `/safety/authorizations/:id` | PROFESOR, JEFATURA | Revocar |
| GET | `/students/:id/safety-status` | Autenticado | Estado de seguridad |

## AI (fase 3)
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/ai/student-assistant` | ALUMNO | Consulta del alumno |
| POST | `/ai/teacher-assistant` | PROFESOR | Consulta del profesor |
| GET | `/ai/interactions` | ADMIN | Historial de interacciones |

## Alerts
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/alerts` | Autenticado | Alertas del usuario |
| PATCH | `/alerts/:id/read` | Autenticado | Marcar como leída |

## Health
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado del servidor |
