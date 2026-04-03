import { supabase } from '@/lib/supabase';

export interface UnitOfWork {
  id?: string;
  title: string;
  description?: string;
  order: number;
  estimatedHours: number;
  programacionId: string;
  raIds: string[];
  ceIds: string[];
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  projectId: string;
}

export const planningService = {
  /**
   * Creates a new Programacion (Root document)
   */
  createProgramacion: async (data: {
    year: string;
    moduleId: string;
    departmentId: string;
  }) => {
    const { data: programacion, error } = await supabase
      .from('Programacion')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return programacion;
  },

  /**
   * Creates a Unit of Work (UT) and links its RA/CE
   */
  createUnitOfWork: async (unit: UnitOfWork) => {
    // 1. Create the UT entry
    const { data: utData, error: utError } = await supabase
      .from('UnidadTrabajo')
      .insert({
        title: unit.title,
        description: unit.description,
        order: unit.order,
        estimatedHours: unit.estimatedHours,
        programacionId: unit.programacionId
      })
      .select()
      .single();

    if (utError) throw utError;

    // 2. Link Learning Outcomes (RA)
    if (unit.raIds.length > 0) {
      const raLinks = unit.raIds.map(raId => ({
        utId: utData.id,
        raId: raId
      }));
      const { error: raLinkError } = await supabase.from('UTLearningOutcome').insert(raLinks);
      if (raLinkError) throw raLinkError;
    }

    // 3. Link Evaluation Criteria (CE)
    if (unit.ceIds.length > 0) {
      const ceLinks = unit.ceIds.map(ceId => ({
        utId: utData.id,
        ceId: ceId
      }));
      const { error: ceLinkError } = await supabase.from('UTEvaluationCriterion').insert(ceLinks);
      if (ceLinkError) throw ceLinkError;
    }

    return utData;
  },

  /**
   * Gets the full Programacion structure
   */
  getProgramacion: async (id: string) => {
    const { data, error } = await supabase
      .from('Programacion')
      .select(`
        *,
        unidades:UnidadTrabajo(
          *,
          learningOutcomes:UTLearningOutcome(ra:LearningOutcome(*)),
          criteria:UTEvaluationCriterion(ce:EvaluationCriterion(*))
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Sessions management
   */
  getSessions: async (projectId: string): Promise<Session[]> => {
    const { data, error } = await supabase
      .from('Session')
      .select('*')
      .eq('projectId', projectId);
    
    if (error) {
      console.warn('Error fetching sessions, returning mock data:', error);
      return [];
    }
    return data || [];
  },

  createSession: async (session: Omit<Session, 'id'>): Promise<Session> => {
    const { data, error } = await supabase
      .from('Session')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
