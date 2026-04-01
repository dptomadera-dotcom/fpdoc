# 03 — Autenticación y roles

## Objetivo

Implementar un sistema de autenticación seguro con control de acceso por rol que proteja todos los endpoints de la API y permita redirección por rol en el frontend.

## Roles del sistema

| Rol | Descripción | Acceso principal |
|---|---|---|
| `ADMIN` | Administrador técnico del sistema | Gestión de usuarios, roles, configuración global, logs |
| `JEFATURA` | Jefe de departamento o coordinador | Gestión de proyectos, plantillas, indicadores, estructura académica |
| `PROFESOR` | Docente asignado a módulos | Gestión de tareas, evaluación, evidencias, seguimiento de alumnado |
| `ALUMNO` | Estudiante matriculado en un grupo | Visualización de proyecto, tareas, subida de evidencias, progreso |

## Endpoints de autenticación

```
POST   /auth/login              → { email, password } → { accessToken, refreshToken, user }
POST   /auth/refresh            → { refreshToken } → { accessToken }
POST   /auth/forgot-password    → { email } → 204
POST   /auth/reset-password     → { token, newPassword } → 204
GET    /auth/me                 → Datos del usuario autenticado
```

## Implementación técnica

### JWT
- Access token con expiración corta (15-30 min).
- Refresh token con expiración larga (7 días), almacenado en httpOnly cookie o base de datos.
- Payload del access token: `{ sub: userId, role: UserRole, centerId: string }`.

### Hashing
- bcrypt con salt rounds >= 10.

### Guards (NestJS)
- `JwtAuthGuard`: valida el token en cada request protegido.
- `RolesGuard`: valida que el rol del usuario tiene acceso al endpoint.
- Decorador `@Roles(UserRole.PROFESOR, UserRole.JEFATURA)` para proteger controladores o métodos.
- Decorador `@Public()` para marcar endpoints sin autenticación.

### Contexto de usuario
- Decorador `@CurrentUser()` para inyectar el usuario autenticado en el controlador.
- El usuario autenticado debe incluir: `id`, `role`, `centerId`, `email`.

## Permisos por rol (resumen)

| Recurso | ADMIN | JEFATURA | PROFESOR | ALUMNO |
|---|---|---|---|---|
| Usuarios | CRUD | Lectura | Solo propio | Solo propio |
| Estructura académica | CRUD | CRUD | Lectura | Lectura |
| Currículo | CRUD | CRUD | Lectura | Lectura |
| Proyectos | CRUD | CRUD | Lectura + edición parcial | Lectura |
| Tareas | CRUD | CRUD | CRUD (de su módulo) | Lectura |
| Evidencias | Todo | Todo | Revisión | Subida + lectura propia |
| Evaluación | Todo | Todo | Crear + editar | Lectura propia |
| Progresión / PRL | Todo | CRUD | Lectura + autorizar | Lectura propia |
| IA | Configuración | Uso | Uso | Uso limitado |
| Logs | Lectura | No | No | No |

## Gestión de usuarios

```
GET    /users                  → Lista paginada (ADMIN, JEFATURA)
GET    /users/:id              → Detalle
POST   /users                  → Crear usuario (ADMIN)
PATCH  /users/:id              → Editar usuario
DELETE /users/:id              → Desactivar usuario (soft delete, solo ADMIN)
```

## Reglas de negocio

- Un usuario solo puede pertenecer a un centro.
- Un profesor puede estar asignado a varios módulos (a través de `ModuleTeacher`).
- Un alumno puede estar en un solo grupo activo a la vez.
- La creación de usuarios puede ser manual (ADMIN) o por importación batch (fase posterior).
- Las contraseñas iniciales se generan automáticamente y se envían por email (o se fuerza cambio en primer login).

## Dato pendiente

> ¿El centro usa algún SSO institucional (Google Workspace, Microsoft 365, LDAP)? Si es así, la autenticación debe adaptarse para federar identidades. Por defecto se asume login con email y contraseña.
