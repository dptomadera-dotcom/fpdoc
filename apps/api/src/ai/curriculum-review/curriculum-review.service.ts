import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ModelProviderAdapter } from '../shared/model-provider.interface';
import { AiInteractionLogService } from '../shared/ai-interaction-log.service';
import { buildCurriculumReviewContext } from '../shared/context/build-curriculum-review-context';

export interface CurriculumReviewResult {
  summary: string;
  coveredRAs: Array<{ code: string; description: string; tasksCount: number }>;
  uncoveredRAs: Array<{ code: string; description: string }>;
  gaps: string[];
  incoherencies: string[];
  suggestions: string[];
  coveragePercent: number;
}

const CURRICULUM_REVIEWER_SYSTEM = `Eres un revisor curricular especializado en Formación Profesional (FP) en España.
Tu función es analizar la coherencia entre los proyectos educativos y el currículo oficial (RA y CE).

Reglas:
- Responde SIEMPRE en español.
- Analiza únicamente con los datos del contexto. No inventes RA ni CE.
- Sé concreto: señala qué RA/CE específicos quedan sin cubrir y por qué es un problema.
- Distingue entre huecos reales (RA sin ninguna tarea) e incoherencias (tareas mal vinculadas).
- Las sugerencias deben ser accionables por un profesor de FP.
- No emitas juicios de valor sobre el profesorado.`;

@Injectable()
export class CurriculumReviewService {
  private readonly logger = new Logger(CurriculumReviewService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly anthropic: ModelProviderAdapter,
    private readonly log: AiInteractionLogService,
  ) {}

  async review(
    params: {
      moduleId?: string;
      projectId?: string;
      route?: string;
    },
    userId: string,
  ): Promise<CurriculumReviewResult> {
    const ctx = await buildCurriculumReviewContext(this.prisma, {
      moduleId: params.moduleId,
      projectId: params.projectId,
    });

    const coveragePercent =
      ctx.learningOutcomes.length > 0
        ? Math.round(
            ((ctx.learningOutcomes.length - ctx.uncoveredRaIds.length) /
              ctx.learningOutcomes.length) *
              100,
          )
        : 0;

    const prompt = `Analiza la cobertura curricular con los siguientes datos:

${ctx.project ? `PROYECTO: ${ctx.project.name}\n${ctx.project.description}\n` : ''}
${ctx.module ? `MÓDULO: ${ctx.module.code} — ${ctx.module.name}\n` : ''}

RESULTADOS DE APRENDIZAJE Y SU COBERTURA:
${JSON.stringify(
  ctx.learningOutcomes.map((ra) => ({
    codigo: ra.code,
    descripcion: ra.description,
    tareas_vinculadas: ra.coveredByTasks.length,
    criterios: ra.evaluationCriteria.map((ce) => ({
      codigo: ce.code,
      descripcion: ce.description,
      tareas_vinculadas: ce.coveredByTasks.length,
    })),
  })),
  null,
  2,
)}

ESTADÍSTICAS:
- Total tareas en el proyecto: ${ctx.totalTasks}
- Tareas con vínculos curriculares: ${ctx.tasksWithLinks}
- RA sin ninguna tarea: ${ctx.uncoveredRaIds.length} de ${ctx.learningOutcomes.length}
- Cobertura actual: ${coveragePercent}%

Responde ÚNICAMENTE con un JSON válido con este esquema exacto:
{
  "summary": "Resumen ejecutivo de 2-3 frases",
  "gaps": ["Descripción concreta del hueco 1", "..."],
  "incoherencies": ["Descripción de incoherencia 1", "..."],
  "suggestions": ["Sugerencia accionable 1", "..."]
}`;

    let model = 'claude-opus-4-6';

    try {
      const aiResponse = await this.anthropic.ask({
        system: CURRICULUM_REVIEWER_SYSTEM,
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 3000,
      });

      model = aiResponse.model;

      await this.log.log({
        userId,
        role: UserRole.PROFESOR,
        agentType: 'curriculum-review',
        prompt,
        response: aiResponse.text,
        model,
        route: params.route,
        entityType: params.projectId ? 'project' : 'module',
        entityId: params.projectId ?? params.moduleId,
        status: 'success',
        metadata: {
          inputTokens: aiResponse.inputTokens,
          outputTokens: aiResponse.outputTokens,
          coveragePercent,
          uncoveredRAs: ctx.uncoveredRaIds.length,
          totalRAs: ctx.learningOutcomes.length,
        },
      });

      const parsed = this.parseResponse(aiResponse.text);

      return {
        ...parsed,
        coveragePercent,
        coveredRAs: ctx.learningOutcomes
          .filter((ra) => ra.coveredByTasks.length > 0)
          .map((ra) => ({
            code: ra.code,
            description: ra.description,
            tasksCount: ra.coveredByTasks.length,
          })),
        uncoveredRAs: ctx.learningOutcomes
          .filter((ra) => ctx.uncoveredRaIds.includes(ra.id))
          .map((ra) => ({ code: ra.code, description: ra.description })),
      };
    } catch (err) {
      this.logger.error('Error in curriculum review:', err);
      await this.log.log({
        userId,
        role: UserRole.PROFESOR,
        agentType: 'curriculum-review',
        prompt,
        response: String(err),
        model,
        route: params.route,
        status: 'error',
      });
      throw err;
    }
  }

  private parseResponse(text: string): Pick<CurriculumReviewResult, 'summary' | 'gaps' | 'incoherencies' | 'suggestions'> {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found');
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      this.logger.warn('Failed to parse curriculum review JSON:', err);
      return {
        summary: text.slice(0, 300),
        gaps: [],
        incoherencies: [],
        suggestions: [],
      };
    }
  }
}
