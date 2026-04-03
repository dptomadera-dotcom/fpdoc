'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Network, Link2, Search, Info, 
  Layers, Map, Maximize2, Share2, 
  Filter, AlertTriangle, CheckCircle2,
  Brain, Zap, Activity
} from 'lucide-react';

// Simulated Graph Data (Phase 3 Core)
const NODES = [
  { id: 'SI', x: 200, y: 150, label: 'Sist. Informáticos', color: 'teal', type: 'module' },
  { id: 'PR', x: 500, y: 100, label: 'Programación', color: 'amber', type: 'module' },
  { id: 'BD', x: 400, y: 350, label: 'Bases de Datos', color: 'red', type: 'module' },
  { id: 'ED', x: 150, y: 300, label: 'Entornos Des.', color: 'blue', type: 'module' },
  { id: 'FOL', x: 650, y: 250, label: 'FOL', color: 'gray', type: 'module' },
];

const LINKS = [
  { source: 'SI', target: 'PR', label: 'Gestión de Memoria', strength: 0.8 },
  { source: 'PR', target: 'BD', label: 'Estructuras de Datos', strength: 0.9 },
  { source: 'BD', target: 'SI', label: 'Configuración Servidor', strength: 0.5 },
  { source: 'ED', target: 'PR', label: 'Depuración Código', strength: 0.7 },
  { source: 'PR', target: 'FOL', label: 'Ética y Ley de Datos', strength: 0.3 },
];

export default function TransversalPage() {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [hoveredLink, setHoveredLink] = useState<any>(null);

  const stats = [
    { label: 'Densidad Red', value: '78%', icon: Network, color: 'teal' },
    { label: 'RAs Vinculados', value: '24', icon: Link2, color: 'amber' },
    { label: 'Huecos Detect.', value: '2', icon: AlertTriangle, color: 'red' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen pb-20">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--teal2)] rounded-full mb-3">
               <Zap className="w-3 h-3 text-[var(--teal)]" />
               <span className="text-[10px] text-[var(--teal)] font-black uppercase tracking-wider">Módulo de Inteligencia Curricular</span>
            </div>
            <h1 className="text-3xl font-bold font-serif text-[var(--ink)] tracking-tight">Ecosistema Transversal</h1>
            <p className="text-[12px] text-[var(--ink3)] max-w-lg mt-1 italic opacity-80">Visualización avanzada de competencias compartidas y brechas pedagógicas.</p>
          </div>
          
          <div className="flex gap-3">
            <button className="h-11 px-5 bg-white border border-[#e5e3dc] rounded-2xl text-[11px] font-bold text-[var(--ink2)] flex items-center gap-2 hover:bg-[var(--bg2)] transition-all shadow-sm">
              <Filter className="w-4 h-4" /> Filtros de Nodo
            </button>
            <button className="h-11 px-6 bg-[var(--ink)] text-white rounded-2xl text-[11px] font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-[var(--ink)]/20">
              <Share2 className="w-4 h-4 text-[var(--teal2)]" /> Exportar Reporte
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
          {/* Main Visualizer Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] border border-[#e5e3dc] shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
              {/* Toolbar */}
              <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white/80 backdrop-blur-md border border-[#e5e3dc] rounded-xl flex items-center justify-center text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all shadow-sm"><Maximize2 className="w-4 h-4" /></button>
                <button className="w-10 h-10 bg-white/80 backdrop-blur-md border border-[#e5e3dc] rounded-xl flex items-center justify-center text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all shadow-sm"><Layers className="w-4 h-4" /></button>
              </div>

              {/* Graph Canvas Overlay */}
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-[var(--bg2)]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                  <Activity className="w-3 h-3 text-[var(--teal)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink3)]">Simulación RA/CE en Tiempo Real</span>
                </div>
              </div>

              {/* SVG Graph Container */}
              <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[radial-gradient(#e5e3dc_0.5px,transparent_0.5px)] [background-size:24px_24px]">
                <svg className="w-full h-full" viewBox="0 0 800 500">
                  <defs>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                      <feOffset dx="0" dy="4" result="offsetblur" />
                      <feComponentTransfer><feFuncA type="linear" slope="0.1"/></feComponentTransfer>
                      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>

                  {/* Links */}
                  {LINKS.map((link, i) => {
                    const sourceNode = NODES.find(n => n.id === link.source)!;
                    const targetNode = NODES.find(n => n.id === link.target)!;
                    const isHovered = hoveredLink === link;

                    return (
                      <g key={i} onMouseEnter={() => setHoveredLink(link)} onMouseLeave={() => setHoveredLink(null)}>
                        <line 
                          x1={sourceNode.x} y1={sourceNode.y} 
                          x2={targetNode.x} y2={targetNode.y} 
                          stroke={isHovered ? `var(--teal)` : `var(--ink3)`} 
                          strokeWidth={isHovered ? 4 : 2}
                          strokeDasharray={isHovered ? "0" : "6,4"}
                          className="transition-all duration-300 opacity-20"
                        />
                        {isHovered && (
                          <motion.text 
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            x={(sourceNode.x + targetNode.x) / 2} 
                            y={(sourceNode.y + targetNode.y) / 2 - 15}
                            textAnchor="middle"
                            className="text-[10px] font-black fill-[var(--teal)] uppercase tracking-tight"
                          >
                            {link.label}
                          </motion.text>
                        )}
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {NODES.map((node) => (
                    <motion.g 
                      key={node.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer"
                    >
                      <circle 
                        cx={node.x} cy={node.y} r={selectedNode?.id === node.id ? 32 : 28} 
                        filter="url(#shadow)"
                        className={`transition-all duration-500 ${selectedNode?.id === node.id ? 'fill-[var(--ink)]' : 'fill-white'}`}
                        stroke={selectedNode?.id === node.id ? 'var(--teal)' : 'var(--bg2)'}
                        strokeWidth={selectedNode?.id === node.id ? 6 : 2}
                      />
                      <text 
                        x={node.x} y={node.y + 4} 
                        textAnchor="middle" 
                        className={`text-[12px] font-black pointer-events-none transition-colors ${selectedNode?.id === node.id ? 'fill-white' : 'fill-[var(--ink)]'}`}
                      >
                        {node.id}
                      </text>
                      <text 
                        x={node.x} y={node.y + 50} 
                        textAnchor="middle" 
                        className={`text-[9px] font-bold uppercase tracking-widest pointer-events-none transition-opacity ${selectedNode?.id === node.id ? 'opacity-100' : 'opacity-40'}`}
                        fill="var(--ink)"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>

              {/* Bottom Legend */}
              <div className="p-5 bg-[var(--bg1)]/50 border-t border-[#e5e3dc] flex flex-wrap gap-6 justify-center items-center">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--teal)] shadow-sm" /> <span className="text-[10px] font-bold text-[var(--ink3)]">Alta Transversalidad</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--amber)] shadow-sm" /> <span className="text-[10px] font-bold text-[var(--ink3)]">Media Cobertura</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[var(--red)] shadow-sm" /> <span className="text-[10px] font-bold text-[var(--ink3)]">Brecha Crítica</span></div>
                <div className="h-4 w-[1px] bg-[var(--bg2)] mx-2" />
                <div className="text-[10px] font-black text-[var(--teal)] cursor-help border-b border-dotted border-[var(--teal)]">¿Cómo se calcula?</div>
              </div>
            </div>

            {/* Gap Alert Card (Premium UI) */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="fp-card border-none bg-gradient-to-br from-[var(--red)] to-[#7f1d1d] text-white overflow-hidden relative"
            >
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-[24px] flex items-center justify-center shrink-0 border border-white/20">
                  <AlertTriangle className="w-8 h-8 text-[var(--amber)]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-1">Detección de Brechas Curriculares</h3>
                  <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                    El sistema ha identificado que los criterios <strong>CE 4.b</strong> y <strong>CE 2.d</strong> de <em>Sistemas</em> no tienen correspondencia práctica este trimestre. 
                    Recomendamos integrar estos contenidos en el próximo <strong>Proyecto ABP</strong>.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button className="h-11 px-6 bg-white text-[var(--red)] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">GENERAR SOLUCIÓN</button>
                  <button className="h-11 px-6 bg-transparent border border-white/30 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all">POSTPONER REVISIÓN</button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] border border-[#f0eee8] shadow-sm flex items-center justify-between group hover:border-[var(--teal)] transition-all duration-500">
                  <div>
                    <div className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-wider mb-2">{stat.label}</div>
                    <div className="text-3xl font-black font-serif text-[var(--ink)]">{stat.value}</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg1)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <stat.icon 
                      className="w-6 h-6" 
                      style={{ color: stat.color === 'red' ? 'var(--red)' : stat.color === 'amber' ? 'var(--amber)' : 'var(--teal)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Insights Panel */}
            <div className="bg-[var(--ink)] rounded-[40px] p-8 text-white relative overflow-hidden flex-1 shadow-2xl">
               <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-[var(--teal)]/20 rounded-xl flex items-center justify-center border border-[var(--teal)]/30">
                        <Brain className="w-5 h-5 text-[var(--teal2)]" />
                     </div>
                     <h2 className="text-lg font-bold">FP-Insight GPT</h2>
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedNode ? (
                      <motion.div 
                        key={selectedNode.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1"
                      >
                         <h3 className="text-[var(--teal2)] font-black text-[10px] uppercase tracking-widest mb-3">Análisis Módulo: {selectedNode.id}</h3>
                         <div className="space-y-6">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                               <p className="text-sm opacity-90 italic leading-relaxed">
                                  "Este módulo es el núcleo de la red. Presenta un 92% de afinidad con <strong>Programación</strong>. Los CEs vinculados a 'Lógica de Control' están sobre-cubiertos, podrías liberar 4 horas lectivas."
                               </p>
                            </div>
                            
                            <div className="space-y-4">
                               <div className="flex items-center justify-between text-xs">
                                  <span className="opacity-50">Impacto Transversal</span>
                                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                     <div className="w-[85%] h-full bg-[var(--teal)]" />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="opacity-50">Consistencia RA</span>
                                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                     <div className="w-[60%] h-full bg-[var(--amber)]" />
                                  </div>
                                </div>
                            </div>

                            <button 
                               onClick={() => setSelectedNode(null)}
                               className="w-full mt-6 py-3 text-[10px] font-black uppercase text-white/50 hover:text-white transition-colors"
                            >
                               Volver al Mapa General
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col justify-center text-center opacity-60"
                      >
                         <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                         <p className="text-sm font-medium">Pulsa en un nodo del mapa para ver el análisis de inteligencia curricular.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 pt-6 border-t border-white/5">
                     <button className="flex items-center gap-2 text-[var(--teal2)] text-[10px] font-black uppercase group">
                        Configurar Umbrales de Alerta
                        <Map className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>
               
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)]/10 rounded-full blur-[80px] -mr-32 -mt-32" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--amber)]/5 rounded-full blur-[80px] -ml-32 -mb-32" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
