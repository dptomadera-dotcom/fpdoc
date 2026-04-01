# 10 — Validación, seguridad y reglas funcionales

## Reglas funcionales obligatorias

Estas reglas deben implementarse como validaciones en el servicio (no solo en el controlador) para garantizar la integridad del sistema:

1. **No permitir acceso sin autenticación** a rutas protegidas.
2. **No permitir crear tareas sin fase.** Toda tarea debe pertenecer a una fase de un proyecto.
3. **No permitir fechas incoherentes.** La fecha de fin no puede ser anterior a la de inicio, en ninguna entidad.
4. **No permitir asociar RA o CE incompatibles con el módulo.** Si un RA no pertenece a un módulo del proyecto, no se puede vincular a una tarea de ese proyecto.
5. **No permitir subir evidencias sin contexto válido.** La evidencia debe estar vinculada a una tarea existente, y el alumno debe pertenecer al grupo del proyecto.
6. **No permitir marcar como habilitado a un alumno sin registro.** La autorización de seguridad debe existir como registro en `MachineAuthorization`.
7. **No permitir respuestas IA sin contexto y trazabilidad.** Toda interacción con la IA debe registrar prompt, respuesta, usuario y contexto.
8. **No permitir que un alumno acceda a tareas de otro grupo.**
9. **No permitir que un profesor evalúe RA de módulos que no tiene asignados.**
10. **No permitir eliminar entidades con dependencias activas** (ej: no borrar una fase con tareas, no borrar un módulo con RA).

## Validación de DTOs

Cada endpoint debe validar los datos de entrada con DTOs tipados (class-validator en NestJS):

```typescript
// Ejemplo: CreateTaskDto
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  phaseId: string;

  @IsEnum(ToolLevel)
  @IsOptional()
  toolLevel?: ToolLevel;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  estimatedHours?: number;
}
```

## Seguridad técnica

| Requisito | Implementación |
|---|---|
| Autenticación | JWT con access/refresh tokens |
| Hashing de contraseñas | bcrypt, salt rounds >= 10 |
| Guards por rol | `@Roles()` decorador + `RolesGuard` |
| Validación DTO | class-validator + class-transformer |
| Rate limiting | Throttler en endpoints sensibles (login, forgot-password, IA) |
| Logs de acciones críticas | `AuditLog` para: crear/editar proyecto, evaluaciones, autorizaciones PRL |
| Manejo de ficheros | Validación de tipo MIME, límite de tamaño, almacenamiento fuera del server |
| Datos sensibles por rol | El alumno no ve notas de otros alumnos. El profesor solo ve datos de sus módulos. |
| CORS | Configurar orígenes permitidos |
| Helmet | Headers de seguridad en producción |

## Manejo de errores centralizado

Implementar un `ExceptionFilter` global que capture errores y devuelva respuestas consistentes:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "No se puede crear una tarea sin fase asignada",
  "timestamp": "2025-10-15T10:30:00Z",
  "path": "/api/v1/tasks"
}
```

## RGPD y protección de datos

- El sistema gestiona datos de menores (Grado Básico, alumnos < 18 años).
- Se requiere consentimiento del tutor legal para menores.
- Los datos personales deben poder exportarse y eliminarse bajo solicitud.
- Las contraseñas nunca se almacenan en texto plano.
- Los logs de auditoría no deben contener datos personales innecesarios.
- El almacenamiento de ficheros (evidencias) debe cumplir con la política del centro.

> **Dato pendiente:** ¿El centro tiene un delegado de protección de datos (DPD)? ¿Existe un protocolo RGPD vigente? ¿Qué proveedor de almacenamiento de ficheros se usará (local, S3, Google Cloud Storage)?

## Documentación del backend

El backend debe generar automáticamente:

- Documentación Swagger (`/api/docs`) con Nest Swagger.
- README con guía de arranque local.
- `.env.example` con todas las variables de entorno documentadas.
- Ejemplos de requests y responses para cada endpoint.
