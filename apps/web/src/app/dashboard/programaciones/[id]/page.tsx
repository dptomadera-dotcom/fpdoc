'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  ChevronLeft, LayoutDashboard, Clock, CheckCircle, 
  PlusCircle, Edit3, ArrowRight, ShieldCheck, 
  Activity, ListFilter 
} from 'lucide-react';
import Link from 'next/link';

export default function ProgramacionDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'UT' | 'RA' | 'TRAZABILIDAD'>('UT');

  // Mock data for initial exploration
  const mockUTs = [
    { 
      title: 'UT 01: Conceptos Fundamentales de SI', 
      desc: 'Introducción a los sistemas de información corporativos.', 
      hours: 12, 
      status: 'completado',
      raCount: 2,
      ceCount: 5 
    },
    { 
      title: 'UT 02: Hardware y Virtualización', 
      desc: 'Configuración física y sistemas virtuales base.', 
      hours: 24, 
      status: 'activo',
      raCount: 1,
      ceCount: 8 
    },
    { 
      title: 'UT 03: Sistemas Operativos Multiusuario', 
      desc: 'Administración de Unix/Linux y Windows Server.', 
      hours: 30, 
      status: 'bloqueado',
      raCount: 2,
      ceCount: 6 
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 p-6 bg-white border border-[#f0eee8] rounded-2xl shadow-sm border-b-4 border-b-[var(--teal)]">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard/programaciones" className="text-[var(--ink3)] hover:text-[var(--ink)]">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="text-[10px] font-bold text-[var(--teal)] uppercase tracking-widest">Documento ID #{params.id}</div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-serif text-[var(--ink)]">Sistemas Informáticos</h1>
              <div className="flex items-center gap-3 text-[13px] text-[var(--ink3)] mt-2 font-medium">
                <span className="uppercase tracking-widest">2023-2024</span>
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 192 Horas Totales</span>
                <span className="opacity-30">•</span>
                <span className="flex items-center gap-1 text-[var(--teal)]"><ShieldCheck className="w-3.5 h-3.5" /> Validado por Jefatura</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="fp-button-secondary h-10 px-4 text-xs">Descargar PDF</button>
              <button className="fp-button-secondary h-10 px-4 text-xs">Ajustes</button>
              <button className="fp-button h-10 px-6 text-xs flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Añadir UT
              </button>
            </div>
          </div>
        </header>

        {/* Tab Selector */}
        <div className="flex border-b border-[#e5e3dc] gap-8 mb-8 sticky top-12 bg-[var(--bg)] z-10 pt-2 px-2">
          {['UT', 'RA', 'TRAZABILIDAD'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'text-[var(--teal)] border-b-2 border-[var(--teal)]' 
                  : 'text-[var(--ink3)] hover:text-[var(--ink2)]'
              }`}
            >
              {tab === 'UT' ? 'Unidades de Trabajo' : tab === 'RA' ? 'Cobertura Curricular' : 'Trazabilidad de Cambios'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'UT' && (
            <motion.div 
              key="ut-list"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-4">
                {mockUTs.map((ut, i) => (
                  <div key={i} className="fp-card hover:border-[var(--bg2)] transition-all flex flex-col md:flex-row gap-6">
                    <div className="md:w-16 flex flex-col items-center justify-center border-r border-[#f0eee8] pr-6">
                      <div className="text-[24px] font-black font-serif text-[var(--ink3)] opacity-40">0{i+1}</div>
                      <div className="text-[9px] font-bold text-[var(--ink3)] uppercase tracking-tighter">Orden</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-[var(--ink)]">{ut.title}</h4>
                        <span className={`fp-badge ${
                          ut.status === 'completado' ? 'bg-[var(--teal2)] text-[var(--teal)]' :
                          ut.status === 'activo' ? 'bg-[var(--amber2)] text-[var(--amber)]' :
                          'bg-[var(--red2)] text-[var(--red)]'
                        }`}>
                          {ut.status}
                        </span>
                      </div>
                      <p className="text-[13px] text-[var(--ink3)] mb-4">{ut.desc}</p>
                      
                      <div className="flex flex-wrap gap-4 text-[11px] font-medium text-[var(--ink3)]">
                        <span className="bg-[var(--bg2)] px-2 py-1 rounded-md">⏳ {ut.hours} Horas</span>
                        <span className="bg-[var(--bg2)] px-2 py-1 rounded-md">🔗 {ut.raCount} RAs Asociados</span>
                        <span className="bg-[var(--bg2)] px-2 py-1 rounded-md">✅ {ut.ceCount} CEs Cubiertos</span>
                      </div>
                    </div>

                    <div className="md:w-48 flex items-center justify-end gap-2">
                      <button className="w-10 h-10 rounded-full bg-[var(--bg2)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[var(--bg2)] flex items-center justify-center hover:bg-[var(--ink)] hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'RA' && (
            <motion.div 
              key="ra-coverage"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-[#f0eee8] p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-[var(--teal)]" />
                <h3 className="text-xl font-bold font-serif">Grado de Cobertura de Criterios (CE)</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(ra => (
                  <div key={ra} className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[var(--ink)] uppercase tracking-widest">Resultado RA 0{ra}</span>
                      <span className="text-[11px] font-bold text-[var(--teal)]">75%</span>
                    </div>
                    <div className="flex gap-1 h-3">
                      {[1, 2, 3, 4].map(ce => (
                        <div key={ce} className={`flex-1 rounded-sm ${ce < 4 ? 'bg-[var(--teal)]' : 'bg-[var(--bg2)]'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'TRAZABILIDAD' && (
            <motion.div 
              key="trazar"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between p-4 bg-[var(--teal2)] border border-[var(--teal)] rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[var(--teal)]" />
                  <div>
                    <div className="text-[12px] font-bold text-[var(--ink)]">Panel de Validación Pedagógica</div>
                    <div className="text-[11px] text-[var(--ink3)]">Como Jefe de Departamento, puedes validar los cambios propuestos por el equipo docente.</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-white text-[10px] font-bold text-[var(--teal)] rounded-md border border-[var(--teal)] hover:bg-[var(--teal)] hover:text-white transition-all">Validar Todo</button>
                </div>
              </div>

              {[
                { id: 'c1', author: 'J. Pérez', date: 'Hace 2 días', reason: 'Ajuste de UT 02 por falta de hardware técnico.', impact: 'Media alta en evaluación.', status: 'PENDIENTE', unit: 'UT 02' },
                { id: 'c2', author: 'A. García', date: 'Hace 1 semana', reason: 'Actualización de criterios RA 03 para adaptarse al BOE.', impact: 'Actualización normativa obligatoria.', status: 'APROBADO', unit: 'RA 03' },
              ].map((change, i) => (
                <div key={i} className="flex gap-4 p-5 border-l-4 border-[var(--teal)] bg-white rounded-r-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <Activity className="w-5 h-5 text-[var(--teal)] shrink-0 mt-1" />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[var(--ink)]">{change.author}</span>
                        <span className="text-[11px] text-[var(--ink3)] font-medium">•</span>
                        <span className="text-[10px] text-[var(--ink3)] uppercase tracking-tight">{change.date}</span>
                        <span className="px-1.5 py-0.5 bg-[var(--bg2)] text-[var(--ink3)] rounded text-[9px] font-bold border border-[#e5e3dc]">{change.unit}</span>
                      </div>
                      <span className={`fp-badge ${
                        change.status === 'APROBADO' ? 'bg-[var(--teal2)] text-[var(--teal)]' : 'bg-[var(--amber2)] text-[var(--amber)]'
                      }`}>
                        {change.status}
                      </span>
                    </div>
                    
                    <p className="text-[14px] text-[var(--ink)] font-medium leading-relaxed mb-3">
                       {change.reason}
                    </p>
                    
                    <div className="p-3 bg-[var(--bg2)] rounded-lg italic text-[11px] text-[var(--ink2)] border-l-2 border-[#e5e3dc]">
                      Impacto curricular: {change.impact}
                    </div>

                    {change.status === 'PENDIENTE' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-[#f0eee8]">
                        <button className="flex-1 sm:flex-none h-8 px-4 bg-[var(--teal)] text-white text-[11px] font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5" /> Aprobar Cambio
                        </button>
                        <button className="flex-1 sm:flex-none h-8 px-4 bg-white text-[var(--red)] border border-[var(--red)] text-[11px] font-bold rounded-lg hover:bg-[var(--red)] hover:text-white transition-all flex items-center justify-center gap-2">
                          Pedir Ajustes
                        </button>
                        <button className="flex-1 sm:flex-none h-8 px-4 bg-white text-[var(--ink3)] border border-[#e5e3dc] text-[11px] font-bold rounded-lg hover:bg-[var(--bg2)] transition-all">
                          Comentar
                        </button>
                      </div>
                    )}
                  </div>

                  {change.status === 'APROBADO' && (
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none opacity-[0.03] rotate-12">
                      <ShieldCheck className="w-full h-full text-[var(--teal)]" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

