import { planningService } from './planning.service';

/**
 * FPdoc Reporting Service
 * Handles data aggregation for academic reports.
 */
export const reportingService = {
  /**
   * Generates a structural summary for the Final Memoir
   */
  getFinalMemoirData: async (programacionId: string) => {
    const prog = await planningService.getProgramacion(programacionId);
    
    // Calculate stats
    const totalHours = prog.unidades.reduce((acc: number, ut: any) => acc + ut.estimatedHours, 0);
    const completedUTs = prog.unidades.filter((ut: any) => ut.status === 'completado').length;
    
    // Aggregate all changes for the changes section
    const changes = prog.unidades.flatMap((ut: any) => 
      ut.justificaciones?.map((j: any) => ({
        unit: ut.title,
        reason: j.razon,
        impact: j.impacto,
        date: j.createdAt,
        approved: !!j.fechaAprobacion
      })) || []
    );

    return {
      metadata: {
        title: `Memoria de Final de Curso: ${prog.year}`,
        module: prog.moduleId,
        generatedAt: new Date().toISOString()
      },
      metrics: {
        executionPercent: (completedUTs / prog.unidades.length) * 100,
        totalHours,
        totalChanges: changes.length
      },
      changes: changes.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  }
};
