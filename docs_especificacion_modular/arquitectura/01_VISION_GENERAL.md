# 01 — Visión general y arquitectura

## Objetivo del aplicativo

Construir una plataforma web educativa para Formación Profesional que permita:

- Planificar proyectos transversales que involucren varios módulos profesionales.
- Vincular tareas con Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE).
- Coordinar al profesorado por módulos dentro de un proyecto compartido.
- Guiar al alumnado en sus tareas, fases y entregas.
- Registrar evidencias y observaciones.
- Realizar seguimiento del progreso individual y grupal.
- Controlar progresión técnica, seguridad y prerrequisitos de taller.
- Incorporar posteriormente asistentes inteligentes e IA contextualizada.

## Enfoque general

El aplicativo debe construirse como una plataforma de trabajo pedagógico, no como una simple app de tareas. La coordinación transversal entre módulos y la trazabilidad currículo → proyecto → tarea → evidencia → evaluación es el eje central.

## Stack técnico

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod para formularios y validación
- TanStack Query para consumo de API
- Zustand para estado local compartido (opcional)
- shadcn/ui o sistema propio de componentes

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT para autenticación
- Redis para colas y caché (cuando sea necesario)
- API REST modular

### Infraestructura
- Monorepo con pnpm
- Docker opcional desde el inicio
- Variables de entorno separadas por app
- CI/CD en fase posterior

## Estructura del repositorio

```text
/app-fp-agentica
  /apps
    /web                  → Frontend Next.js
    /api                  → Backend NestJS
  /packages
    /ui                   → Componentes compartidos
    /config               → Configuraciones compartidas (ESLint, TS, etc.)
    /types                → Tipos TypeScript compartidos entre frontend y backend
  /docs
    /arquitectura
    /frontend
    /backend
    /datos
    /ia
    /mvp
  /prisma
    schema.prisma         → Schema centralizado
    /migrations
    /seed
  package.json
  pnpm-workspace.yaml
  turbo.json              → (opcional, para orquestar builds)
  docker-compose.yml      → (opcional, PostgreSQL + Redis local)
  .env.example
```

## Decisiones arquitectónicas clave

**Monolito modular:** la primera versión se construye como monolito modular en NestJS. Cada dominio (auth, academic, projects, tasks...) es un módulo NestJS independiente con su propio controlador, servicio, DTOs y tests. Esto permite extraer módulos a microservicios en el futuro si es necesario, sin reescribir.

**Schema Prisma centralizado:** un único schema.prisma en la raíz del monorepo. Todos los modelos están en un solo fichero para mantener las relaciones visibles. Las migraciones se ejecutan desde el workspace raíz.

**Tipos compartidos:** el paquete `@fp/types` contiene las interfaces TypeScript que comparten frontend y backend (DTOs de respuesta, enums de estado, tipos de rol). Esto evita duplicación y desincronización.

**API REST, no GraphQL:** para la primera versión, REST es más predecible para el equipo y más fácil de documentar con Swagger. GraphQL puede evaluarse en fases posteriores si la complejidad de las consultas lo justifica.
