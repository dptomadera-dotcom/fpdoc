import { supabase } from '@/lib/supabase';

export interface ExtractedOutcome {
  id?: string;
  code: string;
  content: string;
  criteria: ExtractedCriterion[];
}

export interface ExtractedCriterion {
  id?: string;
  code: string;
  content: string;
}

export interface ExtractionResult {
  moduleName?: string;
  outcomes: ExtractedOutcome[];
  rawText?: string;
}

export const extractionService = {
  /**
   * Uploads and parses a PDF to extract curriculum data
   */
  processPDF: async (file: File): Promise<ExtractionResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/curriculum/extract', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al procesar el documento PDF.');
    }

    const { text } = await response.json();
    return extractionService.parseCurriculumText(text);
  },

  /**
   * Parses raw curriculum text into structured RA/CE objects
   */
  parseCurriculumText: (text: string): ExtractionResult => {
    const outcomes: ExtractedOutcome[] = [];
    
    // Pattern: RA X followed by text until another RA or end
    const raRegex = /RA\s*(\d+)[:.]?\s*([^]*?)(?=RA\s*\d+|$)/gi;
    
    // Pattern: CE X.Y within RA text
    const ceRegex = /CE\s*(\d+\.[a-z\d]+)[:.]?\s*([^]*?)(?=CE\s*\d+\.[a-z\d]+|RA\s*\d+|$)/gi;

    let match;
    while ((match = raRegex.exec(text)) !== null) {
      const raCode = match[1];
      const raContent = match[2].trim();
      
      const currentRA: ExtractedOutcome = {
        code: raCode,
        content: raContent,
        criteria: []
      };

      // Create a temporary regex for this block to avoid index issues
      const localCeRegex = new RegExp(ceRegex);
      let ceMatch;
      while ((ceMatch = localCeRegex.exec(raContent)) !== null) {
        currentRA.criteria.push({
          code: ceMatch[1],
          content: ceMatch[2].trim()
        });
      }
      
      outcomes.push(currentRA);
    }

    return {
      outcomes,
      rawText: text
    };
  },

  /**
   * Saves the extracted data to the database
   */
  saveExtractedCurriculum: async (data: ExtractionResult, moduleId: string): Promise<void> => {
    for (const ra of data.outcomes) {
      const { data: raData, error: raError } = await supabase
        .from('LearningOutcome')
        .insert({
          moduleId,
          code: ra.code,
          content: ra.content,
        })
        .select()
        .single();

      if (raError) throw raError;

      if (ra.criteria.length > 0) {
        const ceToInsert = ra.criteria.map(ce => ({
          learningOutcomeId: raData.id,
          code: ce.code,
          content: ce.content,
        }));

        const { error: ceError } = await supabase
          .from('EvaluationCriterion')
          .insert(ceToInsert);

        if (ceError) throw ceError;
      }
    }
  }
};
