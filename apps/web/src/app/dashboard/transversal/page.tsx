'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Network, Link2, Search, Info, 
  Layers, Map, Maximize2, Share2, 
  Filter, AlertTriangle, CheckCircle2 
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
      <div className="flex flex-col h-[calc(100vh-200px)]">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[var(--teal)] font-black uppercase tracking-[0.3em] mb-1">Phase 3.0 • Curricular Intelligence</div>
            <h1 className="text-3xl font-bold font-serif text-[var(--ink)] tracking-tight">Mapa de Transversalidad</h1>
            <p className="text-[12px] text-[var(--ink3)] max-w-lg mt-1 italic opacity-80">Explora las dependencias pedagógicas invisibles que conectan tus módulos.</p>
          </div>
          
          <div className="flex gap-2">
            <button className="h-10 px-4 bg-white border border-[#e5e3dc] rounded-xl text-[11px] font-bold text-[var(--ink2)] flex items-center gap-2 hover:bg-[var(--bg2)] transition-all">
              <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="h-10 px-6 bg-[var(--ink)] text-white rounded-xl text-[11px] font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
              <Share2 className="w-4 h-4" /> Exportar Mapa
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Main Graph View */}
          <div className="lg:col-span-3 bg-white rounded-[40px] border border-[#e5e3dc] shadow-sm relative overflow-hidden flex flex-col group">
            <div className="absolute top-6 left-6 z-20 flex gap-2">
              <div className="bg-[var(--bg2)]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink3)]">Vista Interactiva Activa</span>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-20 space-y-2">
              <button className="w-10 h-10 bg-white border border-[#e5e3dc] rounded-xl flex items-center justify-center text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all shadow-sm"><Maximize2 className="w-4 h-4" /></button>
              <button className="w-10 h-10 bg-white border border-[#e5e3dc] rounded-xl flex items-center justify-center text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all shadow-sm"><Layers className="w-4 h-4" /></button>
            </div>

            {/* SVG Graph Container */}
            <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[radial-gradient(#e5e3dc_1px,transparent_1px)] [background-size:20px_20px]">
              <svg className="w-full h-full">
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
                        strokeWidth={isHovered ? 3 : 1}
                        strokeDasharray={isHovered ? "0" : "5,5"}
                        className="transition-all duration-300 opacity-20"
                      />
                      {isHovered && (
                        <motion.text 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          x={(sourceNode.x + targetNode.x) / 2} 
                          y={(sourceNode.y + targetNode.y) / 2 - 10}
                          textAnchor="middle"
                          className="text-[9px] font-black fill-[var(--teal)] uppercase tracking-tighter"
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
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer group"
                  >
                    <circle 
                      cx={node.x} cy={node.y} r={selectedNode?.id === node.id ? 28 : 22} 
                      className={`transition-all duration-300 ${selectedNode?.id === node.id ? 'fill-[var(--ink)]' : `fill-white`}`}
                      stroke={selectedNode?.id === node.id ? `var(--teal)` : `var(--${node.color})`}
                      strokeWidth={4}
                    />
                    <text 
                      x={node.x} y={node.y + 40} 
                      textAnchor="middle" 
                      className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${selectedNode?.id === node.id ? 'fill-[var(--ink)]' : 'fill-[var(--ink3)]'}`}
                    >
                      {node.label}
                    </text>
                    <text x={node.x} y={node.y + 4} textAnchor="middle" className={`text-[12px] ${selectedNode?.id === node.id ? 'fill-white' : 'fill-[var(--ink3)] opacity-40'}`}>
                      {node.id}
                    </text>
                  </motion.g>
                ))}
              </svg>
            </div>

            {/* Bottom Legend */}
            <div className="p-4 bg-[var(--bg2)]/50 border-t border-[#e5e3dc] flex gap-6 justify-center">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--teal)]" /> <span className="text-[9px] font-bold text-[var(--ink3)]">Módulos SI/DAM</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--amber)]" /> <span className="text-[9px] font-bold text-[var(--ink3)]">Módulos Programación</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--red)]" /> <span className="text-[9px] font-bold text-[var(--ink3)]">Bases de Datos</span></div>
            </div>
          </div>

          {/* Side Info Panel */}
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-[24px] border border-[#f0eee8] shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[var(--ink3)] uppercase mb-1">{stat.label}</div>
                    <div className={`text-xl font-black text-[var(--${stat.color})]`}>{stat.value}</div>
                  </div>
                  <stat.icon className={`w-8 h-8 opacity-20 text-[var(--${stat.color})]`} />
                </div>
              ))}
            </div>

            {/* Detail Card Overlay */}
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }}
                  className="bg-[var(--ink)] text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                      <Layers className="w-6 h-6 text-[var(--teal2)]" />
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-2">{selectedNode.label}</h3>
                    <p className="text-[11px] text-white/50 mb-8 leading-relaxed">Este módulo actúa como nodo central del ciclo. Tiene dependencias técnicas con Programación y Bases de Datos.</p>
                    
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Conexiones Activas</span>
                        <span className="text-[12px] font-black text-[var(--teal2)]">3 Módulos</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-[10px] font-bold text-white/40 uppercase">RAs Transversales</span>
                        <span className="text-[12px] font-black text-[var(--amber)]">5 Nodos</span>
                      </div>
                    </div>

                    <button className="w-full h-11 bg-[var(--teal)] text-white text-[11px] font-black uppercase tracking-widest rounded-full transition-transform active:scale-95 shadow-lg shadow-[var(--teal)]/20">
                      Ver Detalles Nodo
                    </button>
                    
                    <button 
                      onClick={() => setSelectedNode(null)}
                      className="mt-4 w-full text-[10px] font-bold text-white/30 uppercase hover:text-white/80 transition-colors"
                    >
                      Cerrar Panel
                    </button>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                </motion.div>
              ) : (
                <div className="bg-[var(--bg2)]/50 border-2 border-dashed border-[#e5e3dc] p-10 rounded-[32px] text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#f0eee8]">
                    <Search className="w-5 h-5 text-[var(--ink3)] opacity-40" />
                  </div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] mb-2">Selecciona un Nodo</h3>
                  <p className="text-[11px] text-[var(--ink3)] leading-relaxed">Pulsa sobre cualquier módulo del mapa para ver sus conexiones pedagógicas.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
