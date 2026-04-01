import api from '../lib/api-client';

export enum ProjectStatus {
  BORRADOR = 'BORRADOR',
  ACTIVO = 'ACTIVO',
  PAUSADO = 'PAUSADO',
  COMPLETADO = 'COMPLETADO',
  ARCHIVADO = 'ARCHIVADO',
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  estimatedHours?: number;
  curriculumLinks?: {
    taskId: string;
    learningOutcomeId: string;
    learningOutcome?: any;
    evaluationCriterionId?: string;
    evaluationCriterion?: any;
  }[];
}

export interface Phase {
  id: string;
  name: string;
  description?: string;
  order: number;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress?: number;
  startDate?: string;
  endDate?: string;
  course?: {
    year: number;
    cycle: {
       id: string;
       name: string;
    }
  };
  projectModules?: {
    id: string;
    moduleId: string;
    module: {
      id: string;
      name: string;
      code: string;
    }
  }[];
  phases?: Phase[];
}

export const projectsService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: any): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  addPhase: async (projectId: string, data: { name: string; description?: string; order: number }): Promise<Phase> => {
    const response = await api.post(`/projects/${projectId}/phases`, data);
    return response.data;
  },

  addTask: async (phaseId: string, data: any): Promise<Task> => {
    const response = await api.post(`/projects/phases/${phaseId}/tasks`, data);
    return response.data;
  },
};
