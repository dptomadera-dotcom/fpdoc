import api from '../lib/api-client';

export interface LearningOutcome {
  id: string;
  code: string;
  description: string;
  moduleId: string;
  evaluationCriteria?: EvaluationCriterion[];
}

export interface EvaluationCriterion {
  id: string;
  code: string;
  description: string;
  learningOutcomeId: string;
}

export const curriculumService = {
  getModules: async () => {
    const response = await api.get('/academic/modules');
    return response.data;
  },

  getLearningOutcomes: async (moduleId: string): Promise<LearningOutcome[]> => {
    const response = await api.get(`/curriculum/modules/${moduleId}/ra`);
    return response.data;
  },

  getEvaluationCriteria: async (raId: string): Promise<EvaluationCriterion[]> => {
    const response = await api.get(`/curriculum/ra/${raId}/ce`);
    return response.data;
  },
};
