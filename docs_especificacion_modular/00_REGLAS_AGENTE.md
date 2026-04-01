# 00 — Reglas de comportamiento para el editor de código agéntico

## Regla principal

Antes de generar código, revisa la especificación del módulo que vas a construir. Construye de forma incremental, priorizando una base funcional sólida sobre funcionalidades completas pero frágiles.

## Si faltan datos

Si detectas que faltan datos para implementar correctamente una funcionalidad, **no inventes decisiones críticas sin avisar**.

Debes:

1. Identificar exactamente qué dato falta.
2. Explicar a qué módulo afecta.
3. Proponer una suposición temporal razonable **solo** si permite avanzar sin comprometer la arquitectura.
4. Solicitar al usuario los datos faltantes mediante preguntas concretas.

## Bloques de preguntas obligatorias

Cuando falte información, agrupa las preguntas por estos bloques:

- Identidad visual y branding
- Estructura académica real del centro
- Módulos y currículo
- Permisos por rol
- Flujos de evaluación
- Reglas de PRL y progresión técnica
- Proveedor de autenticación
- Almacenamiento de archivos
- Despliegue e infraestructura
- Integración con IA
- Integración con Moodle, Google o plataformas institucionales

## Formato de solicitud de datos faltantes

```md
## Información necesaria para continuar

### Bloque afectado
[Nombre del módulo o funcionalidad]

### Qué falta
- ...

### Por qué es necesario
- ...

### Preguntas
1. ...
2. ...
```

## Prioridad de implementación

Implementa siempre en este orden:

1. Arquitectura base del proyecto (monorepo, configuración)
2. Autenticación y roles
3. Estructura académica y curricular
4. Proyectos, fases y tareas
5. Calendario y planificación
6. Evidencias y observaciones
7. Evaluación y trazabilidad
8. Progresión técnica y seguridad
9. Analítica y paneles
10. Capa de IA

## Principio estratégico

Este aplicativo no es una simple plataforma de tareas ni un chatbot educativo. Es una **plataforma de orquestación pedagógica para Formación Profesional**, con capacidad de integrar currículo, proyectos, coordinación docente, progresión técnica y evaluación basada en evidencias.

## Testing

Cada módulo debe incluir al menos:

- Tests unitarios para la lógica de servicio (especialmente validaciones curriculares y reglas de negocio).
- Tests de integración para los endpoints principales.
- Seeds de datos de prueba que permitan verificar los flujos completos.
