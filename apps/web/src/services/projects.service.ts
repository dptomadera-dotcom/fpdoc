import { supabase } from '@/lib/supabase';

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
  client?: string;
  manager?: string;
  budget?: string;
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
    const { data, error } = await supabase
      .from('Project')
      .select(`
        *,
        course:Course(*, cycle:Cycle(*)),
        projectModules:ProjectModule(*, module:Module(*))
      `)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return data as any;
  },

  getProject: async (id: string): Promise<Project> => {
    const { data, error } = await supabase
      .from('Project')
      .select(`
        *,
        course:Course(*, cycle:Cycle(*)),
        projectModules:ProjectModule(*, module:Module(*)),
        phases:ProjectPhase(*, tasks:Task(*, curriculumLinks:TaskCurriculumLink(*, learningOutcome:LearningOutcome(*), evaluationCriterion:EvaluationCriterion(*))))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as any;
  },

  createProject: async (data: any): Promise<Project> => {
    const { data: project, error } = await supabase
      .from('Project')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return project as any;
  },

  addPhase: async (projectId: string, data: { name: string; description?: string; order: number }): Promise<Phase> => {
    const { data: phase, error } = await supabase
      .from('ProjectPhase')
      .insert({ ...data, projectId })
      .select()
      .single();

    if (error) throw error;
    return phase as any;
  },

  addTask: async (phaseId: string, data: any): Promise<Task> => {
    const { data: task, error } = await supabase
      .from('Task')
      .insert({ ...data, phaseId })
      .select()
      .single();

    if (error) throw error;
    return task as any;
  },
};
