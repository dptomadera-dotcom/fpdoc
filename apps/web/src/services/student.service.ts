import { planningService } from './planning.service';

/**
 * FPdoc Student Progress Service
 * Tracks individual student achievement across the curriculum.
 */
export const studentService = {
  /**
   * Mock data for student progress
   */
  getStudentProgress: async (studentId: string = 'demo-student') => {
    return {
      overallProgress: 45.5,
      modules: [
        { id: 'SI', name: 'Sistemas Inf.', progress: 60, achievedRAs: 3, totalRAs: 6 },
        { id: 'PR', name: 'Programación', progress: 30, achievedRAs: 2, totalRAs: 8 },
        { id: 'BD', name: 'Bases de Datos', progress: 85, achievedRAs: 5, totalRAs: 6 },
        { id: 'ED', name: 'Entornos Des.', progress: 10, achievedRAs: 0, totalRAs: 4 },
      ],
      recentAchievements: [
        { title: 'Experto en SQL', module: 'BD', date: 'Ayer' },
        { title: 'Configurador Redes', module: 'SI', date: 'Hace 3 días' },
      ]
    };
  }
};
