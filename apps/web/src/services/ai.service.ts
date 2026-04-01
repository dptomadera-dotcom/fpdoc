import api from '../lib/api-client';

export interface GeneratedTask {
  title: string;
  description: string;
  estimatedHours: number;
  ceIds: string[];
}

export interface GeneratedPhase {
  title: string;
  description: string;
  tasks: GeneratedTask[];
}

export const aiService = {
  suggestStructure: async (data: {
    title: string;
    description: string;
    raIds: string[];
    ceIds: string[];
  }): Promise<GeneratedPhase[]> => {
    const response = await api.post('/ai/suggest', data);
    return response.data;
  }
};
