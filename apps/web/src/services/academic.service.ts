import api from '../lib/api-client';


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
};
