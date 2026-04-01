# 02 — Modelo de datos

## Entidades del sistema

El modelo de datos se organiza en cinco dominios:

1. **Institucional:** Center, Department, Family, Cycle, Course, Group, Module
2. **Curricular:** LearningOutcome, EvaluationCriterion
3. **Proyectos:** Project, ProjectPhase, Task, TaskDependency, TaskCurriculumLink
4. **Seguimiento:** Evidence, EvidenceComment, AssessmentInstrument, AssessmentRecord, Observation, StudentProgress, CalendarDay, Session
5. **Seguridad y taller:** SafetyRequirement, ToolCategory, MachineAuthorization
6. **Sistema:** User, Role, Alert, AIInteraction, AuditLog

## Relaciones críticas

- Un proyecto pertenece a un curso y puede estar vinculado a varios módulos (N:M a través de `ProjectModule`).
- Una fase pertenece a un proyecto.
- Una tarea pertenece a una fase.
- Una tarea puede vincularse a varios RA y CE (N:M a través de `TaskCurriculumLink`).
- Un alumno puede subir varias evidencias por tarea.
- Una valoración (AssessmentRecord) se vincula a tarea, alumno, RA y CE.
- Una tarea puede requerir un prerrequisito técnico (SafetyRequirement).
- Una autorización de seguridad (MachineAuthorization) pertenece a un alumno y a una herramienta/máquina.

## Schema Prisma recomendado

> Este schema es un punto de partida. El agente debe adaptarlo según los datos reales del centro cuando estén disponibles.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── SISTEMA ────────────────────────────────────────────

enum UserRole {
  ADMIN
  JEFATURA
  PROFESOR
  ALUMNO
}

enum TaskStatus {
  PENDIENTE
  EN_CURSO
  REVISADO
  VALIDADO
  BLOQUEADO
  REQUIERE_CORRECCION
  VENCIDO
}

enum EvidenceStatus {
  PENDIENTE
  REVISADA
  ACEPTADA
  RECHAZADA
}

enum ProjectStatus {
  BORRADOR
  ACTIVO
  PAUSADO
  COMPLETADO
  ARCHIVADO
}

enum ToolLevel {
  MANUAL
  PORTATIL
  TALLER
}

enum EvaluationPeriod {
  PRIMERA
  SEGUNDA
  TERCERA
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  firstName     String
  lastName      String
  role          UserRole
  isActive      Boolean  @default(true)
  centerId      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  center                Center?                @relation(fields: [centerId], references: [id])
  teacherModules        ModuleTeacher[]
  studentGroup          StudentGroup[]
  evidences             Evidence[]
  assessmentRecords     AssessmentRecord[]
  observations          Observation[]
  machineAuthorizations MachineAuthorization[]
  aiInteractions        AIInteraction[]
  studentProgress       StudentProgress[]
  alerts                Alert[]
}

// ─── INSTITUCIONAL ──────────────────────────────────────

model Center {
  id          String   @id @default(cuid())
  name        String
  code        String   @unique
  createdAt   DateTime @default(now())

  departments Department[]
  users       User[]
}

model Department {
  id        String @id @default(cuid())
  name      String
  centerId  String

  center    Center   @relation(fields: [centerId], references: [id])
  families  Family[]
}

model Family {
  id           String @id @default(cuid())
  name         String
  code         String @unique
  departmentId String

  department Department @relation(fields: [departmentId], references: [id])
  cycles     Cycle[]
}

model Cycle {
  id        String @id @default(cuid())
  name      String
  code      String @unique
  grade     String   // BASICO, MEDIO, SUPERIOR
  hours     Int
  familyId  String
  bocRef    String?  // Referencia al BOC/BOE

  family  Family   @relation(fields: [familyId], references: [id])
  courses Course[]
  modules Module[]
}

model Course {
  id       String @id @default(cuid())
  year     Int      // 1 o 2
  cycleId  String

  cycle    Cycle    @relation(fields: [cycleId], references: [id])
  groups   Group[]
  projects Project[]
}

model Group {
  id       String @id @default(cuid())
  name     String
  courseId String

  course   Course         @relation(fields: [courseId], references: [id])
  students StudentGroup[]
  sessions Session[]
}

model StudentGroup {
  id        String @id @default(cuid())
  userId    String
  groupId   String
  enrolledAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  group Group @relation(fields: [groupId], references: [id])

  @@unique([userId, groupId])
}

model Module {
  id       String @id @default(cuid())
  name     String
  code     String @unique
  hours    Int
  year     Int      // 1 o 2
  cycleId  String

  cycle            Cycle              @relation(fields: [cycleId], references: [id])
  learningOutcomes LearningOutcome[]
  teachers         ModuleTeacher[]
  projectModules   ProjectModule[]
}

model ModuleTeacher {
  id       String @id @default(cuid())
  userId   String
  moduleId String

  user   User   @relation(fields: [userId], references: [id])
  module Module @relation(fields: [moduleId], references: [id])

  @@unique([userId, moduleId])
}

// ─── CURRICULAR ─────────────────────────────────────────

model LearningOutcome {
  id          String @id @default(cuid())
  code        String   // Ej: RA1, RA2...
  description String
  moduleId    String

  module              Module               @relation(fields: [moduleId], references: [id])
  evaluationCriteria  EvaluationCriterion[]
  taskLinks           TaskCurriculumLink[]
  assessmentRecords   AssessmentRecord[]
  studentProgress     StudentProgress[]
}

model EvaluationCriterion {
  id                String @id @default(cuid())
  code              String   // Ej: CE1a, CE1b...
  description       String
  learningOutcomeId String

  learningOutcome  LearningOutcome      @relation(fields: [learningOutcomeId], references: [id])
  taskLinks        TaskCurriculumLink[]
  assessmentRecords AssessmentRecord[]
}

// ─── PROYECTOS ──────────────────────────────────────────

model Project {
  id              String        @id @default(cuid())
  name            String
  description     String?
  status          ProjectStatus @default(BORRADOR)
  courseId        String
  evaluationPeriod EvaluationPeriod?
  toolLevel       ToolLevel?
  estimatedHours  Int?
  startDate       DateTime?
  endDate         DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  course         Course          @relation(fields: [courseId], references: [id])
  phases         ProjectPhase[]
  projectModules ProjectModule[]
}

model ProjectModule {
  id        String @id @default(cuid())
  projectId String
  moduleId  String

  project Project @relation(fields: [projectId], references: [id])
  module  Module  @relation(fields: [moduleId], references: [id])

  @@unique([projectId, moduleId])
}

model ProjectPhase {
  id          String @id @default(cuid())
  name        String
  description String?
  order       Int
  projectId   String
  startDate   DateTime?
  endDate     DateTime?

  project Project @relation(fields: [projectId], references: [id])
  tasks   Task[]
}

model Task {
  id              String     @id @default(cuid())
  title           String
  description     String?
  status          TaskStatus @default(PENDIENTE)
  phaseId         String
  assignedToId    String?    // Profesor responsable
  toolLevel       ToolLevel?
  startDate       DateTime?
  dueDate         DateTime?
  estimatedHours  Int?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  phase              ProjectPhase         @relation(fields: [phaseId], references: [id])
  curriculumLinks    TaskCurriculumLink[]
  evidences          Evidence[]
  assessmentRecords  AssessmentRecord[]
  observations       Observation[]
  dependsOn          TaskDependency[]     @relation("dependent")
  requiredBy         TaskDependency[]     @relation("prerequisite")
  safetyRequirements TaskSafetyLink[]
}

model TaskCurriculumLink {
  id                    String  @id @default(cuid())
  taskId                String
  learningOutcomeId     String
  evaluationCriterionId String?

  task                Task                 @relation(fields: [taskId], references: [id])
  learningOutcome     LearningOutcome      @relation(fields: [learningOutcomeId], references: [id])
  evaluationCriterion EvaluationCriterion? @relation(fields: [evaluationCriterionId], references: [id])

  @@unique([taskId, learningOutcomeId, evaluationCriterionId])
}

model TaskDependency {
  id               String @id @default(cuid())
  dependentTaskId  String
  prerequisiteTaskId String

  dependentTask    Task @relation("dependent", fields: [dependentTaskId], references: [id])
  prerequisiteTask Task @relation("prerequisite", fields: [prerequisiteTaskId], references: [id])

  @@unique([dependentTaskId, prerequisiteTaskId])
}

// ─── SEGUIMIENTO ────────────────────────────────────────

model Evidence {
  id          String         @id @default(cuid())
  taskId      String
  studentId   String
  fileName    String
  fileUrl     String
  mimeType    String
  status      EvidenceStatus @default(PENDIENTE)
  submittedAt DateTime       @default(now())
  reviewedAt  DateTime?

  task     Task              @relation(fields: [taskId], references: [id])
  student  User              @relation(fields: [studentId], references: [id])
  comments EvidenceComment[]
}

model EvidenceComment {
  id         String   @id @default(cuid())
  evidenceId String
  authorId   String
  content    String
  createdAt  DateTime @default(now())

  evidence Evidence @relation(fields: [evidenceId], references: [id])
}

model AssessmentInstrument {
  id          String @id @default(cuid())
  name        String
  description String?
  type        String   // RUBRICA, LISTA_COTEJO, OBSERVACION_DIRECTA
  criteria    Json?    // Estructura flexible para rúbricas

  records AssessmentRecord[]
}

model AssessmentRecord {
  id                    String   @id @default(cuid())
  studentId             String
  taskId                String
  learningOutcomeId     String
  evaluationCriterionId String?
  instrumentId          String?
  score                 Float?
  qualitativeNote       String?
  assessedAt            DateTime @default(now())
  assessedById          String

  student             User                  @relation(fields: [studentId], references: [id])
  task                Task                  @relation(fields: [taskId], references: [id])
  learningOutcome     LearningOutcome       @relation(fields: [learningOutcomeId], references: [id])
  evaluationCriterion EvaluationCriterion?  @relation(fields: [evaluationCriterionId], references: [id])
  instrument          AssessmentInstrument? @relation(fields: [instrumentId], references: [id])
}

model Observation {
  id        String   @id @default(cuid())
  taskId    String?
  studentId String?
  authorId  String
  content   String
  type      String     // SEGUIMIENTO, INCIDENCIA, REFUERZO, PRL
  createdAt DateTime @default(now())

  task    Task? @relation(fields: [taskId], references: [id])
  author  User  @relation(fields: [authorId], references: [id])
}

model StudentProgress {
  id                String @id @default(cuid())
  studentId         String
  learningOutcomeId String
  achievementLevel  Float?   // 0-10
  lastUpdated       DateTime @updatedAt

  student         User            @relation(fields: [studentId], references: [id])
  learningOutcome LearningOutcome @relation(fields: [learningOutcomeId], references: [id])

  @@unique([studentId, learningOutcomeId])
}

model CalendarDay {
  id        String   @id @default(cuid())
  date      DateTime @unique
  isTeaching Boolean @default(true)
  label     String?  // Ej: "Festivo local", "Exámenes"
  periodId  String?  // Evaluación a la que pertenece
}

model Session {
  id        String   @id @default(cuid())
  groupId   String
  moduleId  String?
  date      DateTime
  startTime String
  endTime   String
  room      String?
  notes     String?

  group Group @relation(fields: [groupId], references: [id])
}

// ─── SEGURIDAD Y TALLER ────────────────────────────────

model SafetyRequirement {
  id          String    @id @default(cuid())
  name        String
  description String?
  toolLevel   ToolLevel
  epiRequired String?   // EPIs necesarios
  trainingReq String?   // Formación previa requerida

  taskLinks TaskSafetyLink[]
}

model TaskSafetyLink {
  id                  String @id @default(cuid())
  taskId              String
  safetyRequirementId String

  task              Task              @relation(fields: [taskId], references: [id])
  safetyRequirement SafetyRequirement @relation(fields: [safetyRequirementId], references: [id])

  @@unique([taskId, safetyRequirementId])
}

model MachineAuthorization {
  id           String   @id @default(cuid())
  studentId    String
  machineName  String
  toolLevel    ToolLevel
  authorizedAt DateTime @default(now())
  authorizedBy String
  expiresAt    DateTime?
  notes        String?

  student User @relation(fields: [studentId], references: [id])
}

// ─── SISTEMA ────────────────────────────────────────────

model Alert {
  id        String   @id @default(cuid())
  userId    String
  type      String   // TAREA_VENCIDA, EVIDENCIA_PENDIENTE, SEGURIDAD, CURRICULO
  title     String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}

model AIInteraction {
  id        String   @id @default(cuid())
  userId    String
  role      UserRole
  prompt    String
  response  String
  context   Json?     // Contexto enviado al modelo
  model     String?   // Proveedor/modelo usado
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
}

model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String
  entity    String
  entityId  String?
  details   Json?
  createdAt DateTime @default(now())
}
```

## Notas sobre el schema

- **`cuid()`** se usa como generador de IDs por legibilidad y compatibilidad con URLs.
- **`TaskCurriculumLink`** es la tabla pivote clave: conecta tareas con RA y CE. Sin ella no hay trazabilidad curricular.
- **`ProjectModule`** permite que un proyecto involucre múltiples módulos (cruce transversal).
- **`StudentProgress`** se recalcula a partir de los `AssessmentRecord`. No se edita directamente.
- **`CalendarDay`** es la tabla que define qué días son lectivos. Se precarga al inicio del curso.
- **Los campos `Json`** (en `AssessmentInstrument.criteria` y `AIInteraction.context`) son flexibles intencionadamente para la fase inicial. En fases posteriores pueden normalizarse.
