# Especificación Modular — Plataforma Educativa Agéntica para FP

## Qué es este directorio

Este directorio contiene la especificación técnica completa de la plataforma, dividida en ficheros modulares para que un editor de código agéntico (Cursor, Windsurf, Claude Code u otro) pueda consumir cada parte por separado sin perder contexto.

## Regla fundamental para el agente

> **Antes de implementar cualquier módulo, lee primero `00_REGLAS_AGENTE.md` y el fichero específico del módulo que vas a construir.**
>
> **Si faltan datos para implementar correctamente una funcionalidad, detente y solicita la información faltante con preguntas claras antes de continuar.**

## Mapa de ficheros

Lee los ficheros en este orden según la fase de trabajo:

### Fase 0 — Contexto obligatorio (leer siempre primero)
| Fichero | Contenido |
|---|---|
| `00_REGLAS_AGENTE.md` | Reglas de comportamiento, prioridad de trabajo, protocolo ante datos faltantes |
| `arquitectura/01_VISION_GENERAL.md` | Objetivo del aplicativo, stack, monorepo, estructura del repositorio |

### Fase 1 — Backend (leer en orden)
| Fichero | Contenido |
|---|---|
| `datos/02_MODELO_DATOS.md` | Entidades, relaciones, schema Prisma recomendado |
| `backend/03_AUTH_ROLES.md` | Autenticación, JWT, guards, permisos por rol |
| `backend/04_ACADEMICO_CURRICULO.md` | Centros, familias, ciclos, módulos, RA, CE, importación |
| `backend/05_PROYECTOS_TAREAS.md` | Proyectos, fases, tareas, dependencias, vinculación curricular |
| `backend/06_PLANIFICACION_CALENDARIO.md` | Calendario académico, sesiones, días lectivos, cronograma |
| `backend/07_EVIDENCIAS_EVALUACION.md` | Evidencias, comentarios, rúbricas, valoraciones, trazabilidad |
| `backend/08_PROGRESION_SEGURIDAD.md` | Progresión técnica, herramientas, habilitaciones, PRL |
| `backend/09_API_ENDPOINTS.md` | Catálogo completo de endpoints REST con ejemplos |
| `backend/10_VALIDACION_SEGURIDAD.md` | Reglas funcionales, validación DTO, rate limiting, logs |

### Fase 2 — Frontend (leer en orden)
| Fichero | Contenido |
|---|---|
| `frontend/11_FRONTEND_BASE.md` | Stack, estructura de carpetas, layout, estados visuales |
| `frontend/12_RUTAS_NAVEGACION.md` | Rutas por rol, guards de ruta, breadcrumbs |
| `frontend/13_DASHBOARDS.md` | Panel alumno, panel profesor, panel jefatura |
| `frontend/14_MODULOS_FRONTEND.md` | Módulos funcionales: proyectos, tareas, calendario, evidencias, evaluación |
| `frontend/15_COMPONENTES.md` | Catálogo de componentes base y de dominio |

### Fase 3 — IA y evolución
| Fichero | Contenido |
|---|---|
| `ia/16_IA_CONTEXTUALIZADA.md` | Agentes IA alumno/profesor, límites, requisitos técnicos |
| `mvp/17_FASES_MVP.md` | Definición de MVP fase 1, 2 y 3 con entregables concretos |
| `mvp/18_DATOS_PENDIENTES.md` | Checklist de datos que el agente debe solicitar si no están definidos |

## Cómo usar estos ficheros

1. **Para implementar un módulo backend:** lee `00`, `01`, `02` (modelo de datos) y el fichero específico del módulo.
2. **Para implementar una pantalla frontend:** lee `00`, `01`, `11` (base frontend) y el fichero específico de la pantalla.
3. **Para integrar IA:** lee `00`, `01`, `16` y asegúrate de que los módulos de backend que alimentan el contexto ya están implementados.
4. **Si te piden el MVP completo:** lee `17` y sigue el orden de fases indicado.
