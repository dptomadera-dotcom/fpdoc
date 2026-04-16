import { Injectable, BadRequestException } from '@nestjs/common';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  provider: 'anthropic' | 'local';
  endpoint?: string;  // solo para local, ej: http://servidor:11434/v1
  model?: string;     // solo para local, ej: llama3.2
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

@Injectable()
export class AiService {
  async chat(messages: ChatMessage[], config?: LlmConfig): Promise<{ content: string; model: string; provider: string }> {
    const provider = config?.provider ?? 'anthropic';

    if (provider === 'anthropic') {
      return this.chatWithAnthropic(messages);
    } else {
      return this.chatWithLocal(messages, config!);
    }
  }

  private async chatWithAnthropic(messages: ChatMessage[]) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new BadRequestException('ANTHROPIC_API_KEY no configurada en el servidor');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new BadRequestException(`Error de Anthropic: ${err}`);
    }

    const data: any = await response.json();
    return {
      content: data.content[0].text,
      model: data.model,
      provider: 'anthropic',
    };
  }

  private async chatWithLocal(messages: ChatMessage[], config: LlmConfig) {
    const endpoint = config.endpoint?.replace(/\/$/, '') ?? 'http://localhost:11434/v1';
    const model = config.model ?? 'llama3.2';

    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ollama' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(m => ({ role: m.role, content: m.content })),
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new BadRequestException(`Error del modelo local: ${err}`);
    }

    const data: any = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model ?? model,
      provider: 'local',
    };
  }

  async suggestProjectStructure(params: {
    title: string;
    description: string;
    raIds: string[];
    ceIds: string[];
  }): Promise<GeneratedPhase[]> {
    return [
      {
        title: 'Diseño y Planificación',
        description: 'Fase inicial de croquizado y despiece.',
        tasks: [
          { title: 'Croquis a mano alzada', description: 'Dibujar la vista explosionada del mueble.', estimatedHours: 2, ceIds: params.ceIds.slice(0, 2) },
          { title: 'Listado de materiales y herrajes', description: 'Generar el despiece para el pedido.', estimatedHours: 1, ceIds: params.ceIds.slice(0, 1) },
        ],
      },
      {
        title: 'Preparación de Material',
        description: 'Corte y mecanizado de las piezas en el taller.',
        tasks: [
          { title: 'Corte de tableros', description: 'Uso de la escuadrilla de corte.', estimatedHours: 4, ceIds: params.ceIds.slice(2, 4) },
          { title: 'Lijado y acabado base', description: 'Preparación superficial antes de montar.', estimatedHours: 2, ceIds: params.ceIds.slice(4, 6) },
        ],
      },
      {
        title: 'Montaje y Acabado',
        description: 'Ensamble de piezas y aplicación de barniz/pintura.',
        tasks: [
          { title: 'Ensamble de la estructura', description: 'Encolado y prensado de las partes principales.', estimatedHours: 6, ceIds: params.ceIds.slice(6, 8) },
          { title: 'Aplicación de recubrimiento', description: 'Barnizado o lacado del producto final.', estimatedHours: 3, ceIds: params.ceIds.slice(8, 10) },
        ],
      },
    ];
  }
}
