/**
 * Shared Types for TRANSVERSAL FP
 * These enums and interfaces are shared between Frontend and Backend
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  JEFATURA = 'JEFATURA',
  PROFESOR = 'PROFESOR',
  ALUMNO = 'ALUMNO',
}

export enum TaskStatus {
  PENDIENTE = 'PENDIENTE',
  EN_CURSO = 'EN_CURSO',
  REVISADO = 'REVISADO',
  VALIDADO = 'VALIDADO',
  BLOQUEADO = 'BLOQUEADO',
  REQUIERE_CORRECCION = 'REQUIERE_CORRECCION',
  VENCIDO = 'VENCIDO',
}

export enum EvidenceStatus {
  PENDIENTE = 'PENDIENTE',
  REVISADA = 'REVISADA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
}

export enum ProjectStatus {
  BORRADOR = 'BORRADOR',
  ACTIVO = 'ACTIVO',
  PAUSADO = 'PAUSADO',
  COMPLETADO = 'COMPLETADO',
  ARCHIVADO = 'ARCHIVADO',
}

export enum ToolLevel {
  MANUAL = 'MANUAL',
  PORTATIL = 'PORTATIL',
  TALLER = 'TALLER',
}

export enum EvaluationPeriod {
  PRIMERA = 'PRIMERA',
  SEGUNDA = 'SEGUNDA',
  TERCERA = 'TERCERA',
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  centerId?: string;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  courseId: string;
  evaluationPeriod?: EvaluationPeriod;
  startDate?: Date;
  endDate?: Date;
}