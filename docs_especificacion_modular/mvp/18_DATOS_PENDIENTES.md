# 18 — Datos pendientes que el agente debe solicitar

## Instrucción para el agente

Si alguno de estos datos no está disponible cuando necesites implementar el módulo correspondiente, **detente y solicítalos usando el formato de `00_REGLAS_AGENTE.md`**. No inventes datos curriculares, institucionales ni de seguridad.

Para los datos marcados con ⚠️, puedes usar una suposición temporal razonable y continuar, siempre que la documentes como TODO en el código.

---

## Bloque 1: Datos académicos (necesarios para Fase 1)

| Dato | Estado | Módulo afectado |
|---|---|---|
| Ciclos exactos que se implementarán primero | ❌ Pendiente | Academic |
| Cursos y grupos iniciales (nº de alumnos) | ❌ Pendiente | Academic |
| Módulos concretos del ciclo piloto con códigos | ❌ Pendiente | Academic, Curriculum |
| RA y CE reales de cada módulo (del BOC) | ❌ Pendiente | Curriculum |
| Distribución de módulos por curso (1º y 2º) | ❌ Pendiente | Academic |
| Sistema de evaluación del centro (ponderaciones) | ❌ Pendiente | Evaluation |

---

## Bloque 2: Datos funcionales (necesarios para Fase 1)

| Dato | Estado | Módulo afectado |
|---|---|---|
| ¿El alumno puede ver las notas o solo el progreso? | ❌ Pendiente | Frontend dashboards |
| ¿El alumno puede ver las observaciones del profesor? | ❌ Pendiente | Frontend dashboards |
| ¿Quién puede crear proyectos? ¿Solo jefatura o también profesores? | ⚠️ Asumido: solo jefatura | Projects |
| Flujo real de revisión de evidencias (¿hay doble revisión?) | ⚠️ Asumido: revisión simple | Evidences |
| ¿Existen plantillas de proyectos reutilizables? | ❌ Pendiente | Projects |
| ¿Hay tutores además de profesores de módulo? | ❌ Pendiente | Users, Roles |

---

## Bloque 3: Datos de seguridad y taller (necesarios para Fase 2)

| Dato | Estado | Módulo afectado |
|---|---|---|
| Catálogo real de máquinas y herramientas del taller | ❌ Pendiente | Progression |
| EPIs requeridos por máquina | ❌ Pendiente | Progression |
| Reglas de habilitación (quién autoriza, qué formación previa) | ❌ Pendiente | Progression |
| Prerrequisitos de PRL por nivel | ❌ Pendiente | Progression |
| ¿Hay un documento de PRL del departamento? | ❌ Pendiente | Progression |

---

## Bloque 4: Datos técnicos (necesarios para despliegue)

| Dato | Estado | Módulo afectado |
|---|---|---|
| ¿SSO institucional (Google, Microsoft, LDAP)? | ⚠️ Asumido: email/contraseña | Auth |
| Proveedor de almacenamiento de archivos (local, S3, GCS) | ⚠️ Asumido: local con abstracción | Files |
| Hosting previsto (VPS, cloud, on-premise del centro) | ❌ Pendiente | Infraestructura |
| Dominio o subdominio | ❌ Pendiente | Infraestructura |
| ¿Hay wifi en el taller? | ❌ Pendiente | Decisiones mobile/offline |
| ¿Los alumnos usan dispositivos propios o del centro? | ❌ Pendiente | Decisiones responsive |
| ¿Hay alumnos menores de 18 años? ¿Cuántos? | ❌ Pendiente | RGPD |
| ¿Existe protocolo RGPD del centro? | ❌ Pendiente | RGPD |
| ¿Hay delegado de protección de datos (DPD)? | ❌ Pendiente | RGPD |

---

## Bloque 5: Datos visuales y de marca (necesarios para frontend)

| Dato | Estado | Módulo afectado |
|---|---|---|
| Nombre final del aplicativo | ❌ Pendiente | Frontend, branding |
| Logotipo | ❌ Pendiente | Frontend |
| Colores corporativos | ⚠️ Asumido: paleta neutra/profesional | Frontend |
| Iconografía deseada (línea, relleno, estilo) | ⚠️ Asumido: Lucide icons | Frontend |
| Idioma(s) del aplicativo | ⚠️ Asumido: español | Frontend |

---

## Bloque 6: Datos de IA (necesarios para Fase 3)

| Dato | Estado | Módulo afectado |
|---|---|---|
| Proveedor o modelo preferido (OpenAI, Anthropic, local) | ❌ Pendiente | AI |
| Presupuesto para API de IA | ❌ Pendiente | AI |
| ¿El alumnado usará la IA desde el inicio? | ❌ Pendiente | AI, Frontend |
| Políticas de registro de conversaciones con IA | ❌ Pendiente | AI |
| Límites de uso por rol (consultas/día) | ⚠️ Asumido: 20/día alumno, 50/día profesor | AI |

---

## Bloque 7: Datos de integración (no bloqueantes, fase posterior)

| Dato | Estado | Módulo afectado |
|---|---|---|
| ¿Se integra con EVAGD (Moodle canario)? | ❌ Pendiente | Integración |
| ¿Se integra con Pincel Ekade? | ❌ Pendiente | Integración |
| ¿Se usa Google Workspace o Microsoft 365? | ❌ Pendiente | Integración |
| ¿Hay API disponible de estas plataformas? | ❌ Pendiente | Integración |

---

## Cómo usar este fichero

1. Antes de implementar un módulo, consulta esta tabla para verificar si los datos que necesitas están disponibles.
2. Si están marcados como ❌, solicítalos al usuario.
3. Si están marcados como ⚠️, puedes avanzar con la suposición documentada, pero añade un `// TODO: confirmar con el centro` en el código.
4. Actualiza este fichero cuando se reciban datos nuevos.
