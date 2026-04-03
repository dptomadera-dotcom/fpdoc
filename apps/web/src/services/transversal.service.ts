import { planningService } from './planning.service';

/**
 * FPdoc Transversal Service
 * Manages connections and links between different modules' RAs/CEs.
 */
export const transversalService = {
  /**
   * Fetches the entire curriculum map for a specific year
   */
  getTransversalMap: async (year: string = '2023-2024') => {
    // In a real scenario, this would aggregate multiple programaciones
    // For now, we simulate a global curriculum connection state
    return {
      nodes: [
        { id: 'SI', label: 'Sistemas Inf.', type: 'module', color: 'teal' },
        { id: 'PR', label: 'Programación', type: 'module', color: 'amber' },
        { id: 'BD', label: 'Bases de Datos', type: 'module', color: 'red' },
        { id: 'SI_RA1', label: 'RA 1: Hardware', type: 'ra', parent: 'SI' },
        { id: 'PR_RA2', label: 'RA 2: Objetos', type: 'ra', parent: 'PR' },
        { id: 'BD_RA3', label: 'RA 3: SQL', type: 'ra', parent: 'BD' },
      ],
      links: [
        { source: 'SI_RA1', target: 'PR_RA2', strength: 0.8, type: 'Technical' },
        { source: 'PR_RA2', target: 'BD_RA3', strength: 0.9, type: 'Data Flow' },
        { source: 'BD_RA3', target: 'SI_RA1', strength: 0.5, type: 'Infrastructure' },
      ]
    };
  },

  /**
   * Identifies "Hotspots" (RAs with many cross-links)
   */
  getHotspots: async (map: any) => {
    const counts: Record<string, number> = {};
    map.links.forEach((link: any) => {
      counts[link.source] = (counts[link.source] || 0) + 1;
      counts[link.target] = (counts[link.target] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }
};
