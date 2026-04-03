'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { FileText, Plus, ChevronRight, Search, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ProgramacionesPage() {
  const [programaciones, setProgramaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking initial data for exploration
    const mockData = [
      { 
        id: '1', 
        year: '2023-2024', 
        module: { name: 'Sistemas Informáticos', code: 'SI' }, 
        status: 'ACTIVO', 
        updatedAt: new Date().toISOString(),
        progress: 85
      },
      { 
        id: '2', 
        year: '2023-2024', 
        module: { name: 'Mantenimiento de Equipos', code: 'ME' }, 
        status: 'BORRADOR', 
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        progress: 40
      }
    ];
    
    setProgramaciones(mockData);
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="text-[10px] text-[var(--teal)] font-bold uppercase tracking-widest mb-1">Documentos Vivos</div>
            <h1 className="text-2xl font-bold font-serif text-[var(--ink)]">Programaciones Didácticas</h1>
          </div>
          
          <Link href="/dashboard/curriculum/import" className="fp-button h-11 px-6 flex items-center gap-2 shadow-lg shadow-[var(--teal2)] group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Nueva Programación
          </Link>
        </header>

        {/* Filtros rápidos */}
        <div className="flex gap-2 mb-6">
          {['Todas', 'Activas', 'Borradores', '2023-2024'].map((filter, i) => (
            <button 
              key={filter}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                i === 0 ? 'bg-[var(--ink)] text-white' : 'bg-white border border-[#e5e3dc] text-[var(--ink3)] hover:bg-[var(--bg2)]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="fp-card h-48 animate-pulse bg-white/50 border-none" />
            ))
          ) : (
            programaciones.map((prog) => (
              <motion.div
                key={prog.id}
                whileHover={{ y: -4 }}
                className="fp-card group cursor-pointer border-transparent hover:border-[var(--teal2)] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`fp-badge ${prog.status === 'ACTIVO' ? 'bg-[var(--teal2)] text-[var(--teal)]' : 'bg-[var(--bg2)] text-[var(--ink3)]'}`}>
                    {prog.status}
                  </div>
                  <button className="text-[var(--ink3)] hover:text-[var(--ink)]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-1 group-hover:text-[var(--teal)] transition-colors">
                    {prog.module.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--ink3)] font-medium">
                    <span className="uppercase tracking-wider">{prog.module.code}</span>
                    <span className="opacity-30">•</span>
                    <span>{prog.year}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-[11px] mb-1">
                    <span className="text-[var(--ink3)]">Progreso curricular</span>
                    <span className="font-bold text-[var(--ink)]">{prog.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prog.progress}%` }}
                      className={`h-full ${prog.status === 'ACTIVO' ? 'bg-[var(--teal)]' : 'bg-[var(--ink3)]'}`}
                    />
                  </div>
                </div>

                <Link 
                  href={`/dashboard/programaciones/${prog.id}`}
                  className="mt-6 flex items-center justify-center gap-2 p-2 rounded-lg bg-[var(--bg2)] text-[var(--ink)] text-[12px] font-bold group-hover:bg-[var(--ink)] group-hover:text-white transition-all"
                >
                  Continuar Planificación
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
