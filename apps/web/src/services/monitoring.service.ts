import api from '../lib/api-client';

export enum EvidenceStatus {
  PENDIENTE = 'PENDIENTE',
  REVISADA = 'REVISADA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
}

export interface Evidence {
  id: string;
  taskId: string;
  studentId: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string; // Enhanced metadata for preview
  status: EvidenceStatus;
  submittedAt: string;
  student?: {
    firstName: string;
    lastName: string;
  };
  comments?: any[];
}

export const monitoringService = {
  uploadFile: async (file: File, taskId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);

    const response = await api.post('/monitoring/upload-evidence', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { url, fileName, mimeType }
  },

  submitEvidence: async (taskId: string, fileName: string, fileUrl: string, mimeType: string) => {
    const response = await api.post('/monitoring/evidence', {
      taskId,
      fileName,
      fileUrl,
      mimeType,
    });
    return response.data;
  },

  getTaskEvidences: async (taskId: string): Promise<Evidence[]> => {
    const response = await api.get(`/monitoring/tasks/${taskId}/evidences`);
    return response.data;
  },

  updateEvidenceStatus: async (evidenceId: string, status: EvidenceStatus) => {
    const response = await api.patch(`/monitoring/evidence/${evidenceId}/status`, { status });
    return response.data;
  },

  checkEvidence: async (data: { 
    evidenceId: string; 
    status: EvidenceStatus; 
    scores: { curriculumLinkId: string; score: number }[]; 
    comment?: string;
  }) => {
    const response = await api.post('/monitoring/check-evidence', data);
    return response.data;
  },

  addComment: async (evidenceId: string, content: string) => {
    const response = await api.post(`/monitoring/evidence/${evidenceId}/comment`, { content });
    return response.data;
  },

  getProjectStats: async (projectId: string) => {
    const response = await api.get(`/monitoring/project/${projectId}/stats`);
    return response.data;
  },
};
