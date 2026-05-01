import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ModelProviderAdapter } from './shared/model-provider.interface';
import { AnthropicAdapter } from './shared/anthropic.adapter';
import { OpenAiAdapter } from './shared/openai.adapter';
import { GlmAdapter } from './shared/glm.adapter';
import { MinimaxAdapter } from './shared/minimax.adapter';
import { OllamaAdapter } from './shared/ollama.adapter';
import { OllamaCloudAdapter } from './shared/ollama-cloud.adapter';
import { AiInteractionLogService } from './shared/ai-interaction-log.service';
import { buildCurriculumContext } from './shared/context/build-curriculum-context';
import { buildTeacherContext } from './shared/context/build-teacher-context';
import { DEFAULT_MODELS, getModel } from '@fpdoc/ai-models';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  provider: 'anthropic' | 'openai' | 'glm' | 'minimax' | 'local' | 'groq' | 'ollama-cloud';
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

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

const SYSTEM_PROMPT = `Eres el asistente de inteligencia artificial de FPdoc, una plataforma educativa para Formación Profesional en España.
Tu función es ayudar al profesorado a:
- Diseñar proyectos transversales y programaciones didácticas
- Vincular actividades con Resultados de Aprendizaje (RA) y Criterios de Evaluación (CE)
- Redactar criterios de evaluación e instrumentos de calificación
- Proponer actividades y tareas para el alumnado
- Analizar y mejorar la temporalización del currículo

Responde siempre en español, de forma concisa y práctica.
Cuando propongas actividades, ten en cuenta el contexto de taller y la familia profesional de Madera, Mueble y Corcho.`;

const TEACHER_SYSTEM_PROMPT = `Eres un asistente pedagógico especializado en Formación Profesional (FP) en España.
Ayudas al profesorado a planificar proyectos educativos transversales vinculados al currículo oficial.

Reglas:
- Responde siempre en español.
- No inventes Resultados de Aprendizaje (RA) ni Criterios de Evaluación (CE) que no aparezcan en el contexto.
- Proporciona propuestas concretas, prácticas y realizables en un taller/aula de FP.
- No emitas calificaciones finales automáticas.
- Usa el contexto curricular proporcionado para anclar tus sugerencias.`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly anthropic: ModelProviderAdapter,
    private readonly log: AiInteractionLogService,
  ) {}

  async chat(
    messages: ChatMessage[],
    userId?: string,
    clientConfig?: LlmConfig,
  ): Promise<{ content: string; model: string; provider: string }> {
    const provider = clientConfig?.provider ?? 'anthropic';
    const modelId = clientConfig?.model;

    if (modelId) {
      const modelMeta = getModel(modelId);
      if (!modelMeta) {
        throw new BadRequestException(`Modelo desconocido: ${modelId}`);
      }
      if (modelMeta.maxTokens < 1024) {
        this.logger.warn(`${modelId} soporta solo ${modelMeta.maxTokens} tokens max; reduciendo request`);
      }
    }

    const adapter = this.resolveAdapter(provider, clientConfig);

    const aiResponse = await adapter.ask({
      system: SYSTEM_PROMPT,
      messages,
      maxTokens: 1024,
    });

    return { content: aiResponse.text, model: aiResponse.model, provider };
  }

  private validateApiKeyFormat(provider: string, apiKey: string): void {
    const patterns: Record<string, RegExp> = {
      openai: /^sk-/,
      anthropic: /^sk-ant-/,
      glm: /^zhipuai-/i,
      minimax: /^mm-/i,
    };
    const pattern = patterns[provider];
    if (pattern && !pattern.test(apiKey)) {
      this.logger.warn(`Formato de API Key sospechoso para ${provider}`);
    }
  }

  private resolveAdapter(provider: string, config?: LlmConfig): ModelProviderAdapter {
    const selectedProvider = provider || 'anthropic';

    switch (selectedProvider) {
      case 'openai': {
        const apiKey = config?.apiKey ?? process.env.OPENAI_API_KEY;
        const model = config?.model ?? DEFAULT_MODELS.openai;
        const baseURL = config?.endpoint ?? process.env.OPENAI_BASE_URL;
        if (!apiKey) throw new BadRequestException('Se requiere API Key para OpenAI.');
        this.validateApiKeyFormat('openai', apiKey);
        return new OpenAiAdapter(apiKey, model, baseURL);
      }

      case 'glm': {
        const apiKey = config?.apiKey ?? process.env.GLM_API_KEY;
        const model = config?.model ?? DEFAULT_MODELS.glm;
        if (!apiKey) throw new BadRequestException('Se requiere API Key para GLM (Zhipu).');
        this.validateApiKeyFormat('glm', apiKey);
        return new GlmAdapter(apiKey, model);
      }

      case 'minimax': {
        const apiKey = config?.apiKey ?? process.env.MINIMAX_API_KEY;
        const model = config?.model ?? DEFAULT_MODELS.minimax;
        if (!apiKey) throw new BadRequestException('Se requiere API Key para MiniMax.');
        this.validateApiKeyFormat('minimax', apiKey);
        return new MinimaxAdapter(apiKey, model);
      }

      case 'local': {
        const baseUrl = config?.endpoint ?? process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
        const model = config?.model ?? DEFAULT_MODELS.ollama;
        return new OllamaAdapter(baseUrl, model);
      }

      case 'ollama-cloud': {
        const apiKey = config?.apiKey ?? process.env.OLLAMA_CLOUD_API_KEY;
        const model = config?.model ?? DEFAULT_MODELS['ollama-cloud'];
        if (!apiKey) throw new BadRequestException('Se requiere API Key para Ollama Cloud.');
        const adapter = new OllamaCloudAdapter(apiKey, model);
        return adapter;
      }

      case 'anthropic':
      default: {
        const apiKey = config?.apiKey ?? process.env.ANTHROPIC_API_KEY;
        const model = config?.model ?? DEFAULT_MODELS.anthropic;
        if (apiKey) this.validateApiKeyFormat('anthropic', apiKey);
        return new AnthropicAdapter(apiKey, model);
      }
    }
  }

  async suggestProjectStructure(
    params: {
      title: string;
      description: string;
      raIds: string[];
      ceIds: string[];
      route?: string;
    },
    userId: string,
  ): Promise<GeneratedPhase[]> {
    const curriculumCtx = await buildCurriculumContext(
      this.prisma,
      params.raIds,
      params.ceIds,
    );

    const contextBlock = curriculumCtx.learningOutcomes.length
      ? `\n\nCONTEXTO CURRICULAR:\n${JSON.stringify(curriculumCtx, null, 2)}`
      : '';

    const prompt = `Propón una estructura de fases y tareas para el siguiente proyecto de FP:

Título: ${params.title}
Descripción: ${params.description}${contextBlock}

Responde ÚNICAMENTE con un JSON válido (sin texto adicional) con este esquema:
[
  {
    "title": "Nombre de la fase",
    "description": "Descripción breve",
    "tasks": [
      {
        "title": "Nombre de la tarea",
        "description": "Descripción detallada",
        "estimatedHours": 2,
        "ceIds": ["id-del-ce"]
      }
    ]
  }
]

Usa los ceIds del contexto curricular cuando corresponda. Si no hay contexto, usa arrays vacíos para ceIds.`;

    let model = 'claude-opus-4-6';

    try {
      const aiResponse = await this.anthropic.ask({
        system: TEACHER_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 4096,
      });

      model = aiResponse.model;

      await this.log.log({
        userId,
        role: UserRole.PROFESOR,
        agentType: 'teacher-assistant',
        prompt,
        response: aiResponse.text,
        model,
        route: params.route,
        entityType: 'project-structure',
        status: 'success',
        metadata: {
          inputTokens: aiResponse.inputTokens,
          outputTokens: aiResponse.outputTokens,
          raIds: params.raIds,
          ceIds: params.ceIds,
        },
      });

      return this.parsePhases(aiResponse.text);
    } catch (err) {
      this.logger.error('Error calling AI for project structure:', err);
      await this.log.log({
        userId,
        role: UserRole.PROFESOR,
        agentType: 'teacher-assistant',
        prompt,
        response: String(err),
        model,
        route: params.route,
        status: 'error',
      });
      throw err;
    }
  }

  async askTeacherAssistant(
    params: {
      message: string;
      route?: string;
      entityType?: string;
      entityId?: string;
    },
    userId: string,
  ): Promise<string> {
    const teacherCtx = await buildTeacherContext(this.prisma, userId);

    const contextBlock = `CONTEXTO DEL PROFESOR:
Proyectos activos: ${teacherCtx.projects.length}
${teacherCtx.projects
  .map(
    (p) =>
      `- ${p.name} (${p.status}, ${p.progress}% completado, ${p.phases.length} fases)`,
  )
  .join('\n')}
Grupos: ${teacherCtx.groups.length} grupos`;

    let model = 'claude-opus-4-6';

    try {
      const aiResponse = await this.anthropic.ask({
        system: `${TEACHER_SYSTEM_PROMPT}\n\n${contextBlock}`,
        messages: [{ role: 'user', content: params.message }],
        maxTokens: 2048,
      });

      model = aiResponse.model;

      await this.log.log({
        userId,
        role: UserRole.PROFESOR,
        agentType: 'teacher-assistant',
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
        },
      });

      return aiResponse.text;
    } catch (err) {
      this.logger.error('Error in teacher assistant:', err);
      await this.log.log({
        userId,
        role: UserRole.PROFESOR,
        agentType: 'teacher-assistant',
        prompt: params.message,
        response: String(err),
        model,
        route: params.route,
        status: 'error',
      });
      throw err;
    }
  }

  private parsePhases(text: string): GeneratedPhase[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON array found in response');
      return JSON.parse(jsonMatch[0]) as GeneratedPhase[];
    } catch (err) {
      this.logger.warn('Failed to parse AI response as JSON, returning empty:', err);
      return [];
    }
  }
}
