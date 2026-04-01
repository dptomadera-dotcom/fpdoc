import { Injectable } from '@nestjs/common';
import { CurriculumService } from '../curriculum/curriculum.service';

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

@Injectable()
export class AiService {
  constructor(private curriculum: CurriculumService) {}

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
          {
            title: 'Croquis a mano alzada',
            description: 'Dibujar la vista explosionada del mueble.',
            estimatedHours: 2,
            ceIds: params.ceIds.slice(0, 2),
          },
          {
            title: 'Listado de materiales y herrajes',
            description: 'Generar el despiece para el pedido.',
            estimatedHours: 1,
            ceIds: params.ceIds.slice(0, 1),
          }
        ]
      },
      {
        title: 'Preparación de Material',
        description: 'Corte y mecanizado de las piezas en el taller.',
        tasks: [
          {
            title: 'Corte de tableros',
            description: 'Uso de la escuadrilla de corte.',
            estimatedHours: 4,
            ceIds: params.ceIds.slice(2, 4),
          },
          {
            title: 'Lijado y acabado base',
            description: 'Preparación superficial antes de montar.',
            estimatedHours: 2,
            ceIds: params.ceIds.slice(4, 6),
          }
        ]
      },
      {
        title: 'Montaje y Acabado',
        description: 'Ensamble de piezas y aplicación de barniz/pintura.',
        tasks: [
          {
            title: 'Ensamble de la estructura',
            description: 'Encolado y prensado de las partes principales.',
            estimatedHours: 6,
            ceIds: params.ceIds.slice(6, 8),
          },
          {
            title: 'Aplicación de recubrimiento',
            description: 'Barnizado o lacado del producto final.',
            estimatedHours: 3,
            ceIds: params.ceIds.slice(8, 10),
          }
        ]
      }
    ];
  }
}
