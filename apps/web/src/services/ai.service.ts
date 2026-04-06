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

export interface CurriculumReviewResult {
  summary: string;
  coveragePercent: number;
  coveredRAs: Array<{ code: string; description: string; tasksCount: number }>;
  uncoveredRAs: Array<{ code: string; description: string }>;
  gaps: string[];
  incoherencies: string[];
  suggestions: string[];
}

export const aiService = {
  suggestStructure: async (data: {
    title: string;
    description: string;
    raIds: string[];
    ceIds: string[];
    route?: string;
  }): Promise<GeneratedPhase[]> => {
    const response = await api.post('/ai/suggest', data);
    return response.data;
  },

  askTeacherAssistant: async (data: {
    message: string;
    route?: string;
    entityType?: string;
    entityId?: string;
  }): Promise<string> => {
    const response = await api.post('/ai/teacher-assistant', data);
    return response.data.response;
  },

  askStudentAssistant: async (data: {
    message: string;
    route?: string;
    entityType?: string;
    entityId?: string;
  }): Promise<string> => {
    const response = await api.post('/ai/student-assistant', data);
    return response.data.response;
  },

  reviewCurriculum: async (data: {
    moduleId?: string;
    projectId?: string;
    route?: string;
  }): Promise<CurriculumReviewResult> => {
    const response = await api.post('/ai/curriculum-review', data);
    return response.data;
  },
};
