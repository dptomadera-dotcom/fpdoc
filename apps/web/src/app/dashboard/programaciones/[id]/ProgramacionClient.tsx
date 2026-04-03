'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  ChevronLeft, Clock, CheckCircle, 
  PlusCircle, Edit3, ArrowRight, ShieldCheck, 
  Activity 
} from 'lucide-react';
import Link from 'next/link';

export default function ProgramacionClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState('UT');

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
            <div className="text-[10px] font-bold text-[var(--teal)] uppercase tracking-widest">Documento ID #{id}</div>
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

        <div className="flex border-b border-[#e5e3dc] gap-8 mb-8 sticky top-12 bg-[var(--bg)] z-10 pt-2 px-2">
          <button onClick={() => setActiveTab('UT')} className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all ${activeTab === 'UT' ? 'text-[var(--teal)] border-b-2 border-[var(--teal)]' : 'text-[var(--ink3)]'}`}>Unidades</button>
          <button onClick={() => setActiveTab('RA')} className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all ${activeTab === 'RA' ? 'text-[var(--teal)] border-b-2 border-[var(--teal)]' : 'text-[var(--ink3)]'}`}>Cobertura</button>
          <button onClick={() => setActiveTab('TRAZABILIDAD')} className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-all ${activeTab === 'TRAZABILIDAD' ? 'text-[var(--teal)] border-b-2 border-[var(--teal)]' : 'text-[var(--ink3)]'}`}>Trazabilidad</button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'UT' && (
            <motion.div key="ut" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid gap-4">
                {mockUTs.map((ut, i) => (
                  <div key={i} className="fp-card flex gap-6">
                    <div className="flex-1">
                      <h4 className="font-bold">{ut.title}</h4>
                      <p className="text-sm">{ut.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
