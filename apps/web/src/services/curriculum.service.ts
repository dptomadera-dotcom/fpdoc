import { supabase } from '../lib/supabase';

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

export interface Programacion {
  id: string;
  year: string;
  status: string;
  departmentId: string;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnidadTrabajo {
  id: string;
  title: string;
  description?: string;
  order: number;
  estimatedHours: number;
  programacionId: string;
}

export const curriculumService = {
  // Módulos y Currículo Base
  getModules: async () => {
    const { data, error } = await supabase
      .from('Module')
      .select('*, cycle:Cycle(name)')
      .order('name');
    if (error) throw error;
    return data;
  },

  getLearningOutcomes: async (moduleId: string): Promise<LearningOutcome[]> => {
    const { data, error } = await supabase
      .from('LearningOutcome')
      .select('*, evaluationCriteria:EvaluationCriterion(*)')
      .eq('moduleId', moduleId);
    if (error) throw error;
    return data;
  },

  // Programación (Documento Vivo)
  getProgramaciones: async (departmentId?: string) => {
    let query = supabase
      .from('Programacion')
      .select('*, module:Module(name, code)');
    
    if (departmentId) {
      query = query.eq('departmentId', departmentId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  createProgramacion: async (programacion: Partial<Programacion>) => {
    const { data, error } = await supabase
      .from('Programacion')
      .insert(programacion)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Unidades de Trabajo
  getUnidadesTrabajo: async (programacionId: string) => {
    const { data, error } = await supabase
      .from('UnidadTrabajo')
      .select('*')
      .eq('programacionId', programacionId)
      .order('order', { ascending: true });
    if (error) throw error;
    return data;
  },

  updateUnidadTrabajo: async (id: string, updates: Partial<UnidadTrabajo>, justification: string, userId: string) => {
    // 1. Actualizar la UT
    const { data: utData, error: utError } = await supabase
      .from('UnidadTrabajo')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (utError) throw utError;

    // 2. Registrar la justificación del cambio (Trazabilidad)
    const { error: changeError } = await supabase
      .from('JustificacionCambio')
      .insert({
        utId: id,
        reason: justification,
        authorId: userId
      });

    if (changeError) throw changeError;

    return utData;
  }
};
