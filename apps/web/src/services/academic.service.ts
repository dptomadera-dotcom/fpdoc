import api from '../lib/api-client';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  cycleId: string;
  groupId: string;
}

export interface Module {
  id: string;
  name: string;
  code: string;
}

export interface Cycle {
  id: string;
  name: string;
  code: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
}

export const academicService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/academic/projects');
    return response.data;
  },
  getModules: async (): Promise<Module[]> => {
    const response = await api.get('/academic/modules');
    return response.data;
  },
  getCycles: async (): Promise<Cycle[]> => {
    const response = await api.get('/academic/cycles');
    return response.data;
  },
  getGroups: async (): Promise<Group[]> => {
    const response = await api.get('/academic/groups');
    return response.data;
  },
  createProject: async (data: any): Promise<Project> => {
    const response = await api.post('/academic/projects', data);
    return response.data;
  }
};
