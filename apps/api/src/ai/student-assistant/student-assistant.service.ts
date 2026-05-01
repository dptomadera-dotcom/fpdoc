import { Injectable, Logger } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ModelProviderAdapter } from '../shared/model-provider.interface';
import { AiInteractionLogService } from '../shared/ai-interaction-log.service';
import { buildStudentContext } from '../shared/context/build-student-context';
import { AI_MAX_TOKENS } from '../shared/ai.constants';

const STUDENT_SYSTEM_PROMPT = `Eres un asistente de apoyo para estudiantes de Formación Profesional (FP) en España.
Tu función es ayudar al alumnado a entender sus tareas, organizar su trabajo y orientar sus entregas.

Reglas estrictas:
- Responde SIEMPRE en español, con lenguaje claro y cercano al alumnado.
- NO calificas ni decides evaluaciones — eso es competencia exclusiva del profesorado.
- NO inventes información sobre tareas o proyectos que no aparezcan en el contexto.
- NO compartas datos de otros alumnos ni información reservada del profesorado.
- Orienta, resume y motiva. No hagas el trabajo por el alumno.
- Si no tienes información suficiente, dilo claramente y pide más detalle.`;

@Injectable()
export class StudentAssistantService {
  private readonly logger = new Logger(StudentAssistantService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly anthropic: ModelProviderAdapter,
    private readonly log: AiInteractionLogService,
  ) {}

  async ask(
    params: {
      message: string;
      route?: string;
      entityType?: string;
      entityId?: string;
    },
    userId: string,
  ): Promise<string> {
    const ctx = await buildStudentContext(this.prisma, userId);

    const contextBlock = this.buildContextBlock(ctx);
    let model = 'claude-opus-4-6';

    try {
      const aiResponse = await this.anthropic.ask({
        system: `${STUDENT_SYSTEM_PROMPT}\n\n${contextBlock}`,
        messages: [{ role: 'user', content: params.message }],
        maxTokens: AI_MAX_TOKENS.STUDENT_CHAT,
      });

      model = aiResponse.model;

      await this.log.log({
        userId,
        role: UserRole.ALUMNO,
        agentType: 'student-assistant',
        prompt: params.message,
        response: aiResponse.text,
        model,
        route: params.route,
        entityType: params.entityType,
        entityId: params.entityId,
        status: 'success',
        metadata: {
          inputTokens: aiResponse.inputTokens,
          outputTokens: aiResponse.outputTokens,
          pendingTasksCount: ctx.pendingTasks.length,
        },
      });

      return aiResponse.text;
    } catch (err) {
      this.logger.error('Error in student assistant:', err);
      await this.log.log({
        userId,
        role: UserRole.ALUMNO,
        agentType: 'student-assistant',
        prompt: params.message,
        response: String(err),
        model,
        route: params.route,
        status: 'error',
      });
      throw err;
    }
  }

  private buildContextBlock(ctx: Awaited<ReturnType<typeof buildStudentContext>>): string {
    if (!ctx.pendingTasks.length && !ctx.progress.length) {
      return 'CONTEXTO DEL ALUMNO: Sin tareas o proyectos asignados aún.';
    }

    const progressLines = ctx.progress
      .map((p) => `- ${p.projectName}: ${p.completedTasks}/${p.totalTasks} tareas completadas`)
      .join('\n');

    const taskLines = ctx.pendingTasks
      .map(
        (t) =>
          `- [${t.status}] "${t.title}" (Fase: ${t.phase}, Proyecto: ${t.project}${t.dueDate ? `, entrega: ${t.dueDate}` : ''})`,
      )
      .join('\n');

    return `CONTEXTO DEL ALUMNO:
Progreso por proyecto:
${progressLines}

Tareas pendientes más próximas:
${taskLines}`;
  }
}
