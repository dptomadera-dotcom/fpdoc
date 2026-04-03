'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { authService } from '@/services/auth.service';
import {
  FileText, Plus, ChevronRight, Clock, CheckCircle,
  AlertTriangle, BookOpen, Activity, BarChart3,
  ArrowRight, Lock, Edit3, Eye, Filter,
  GraduationCap, Users, Workflow, Layers, Zap
} from 'lucide-react';

// ─── TIPOS ─────────────────────────────────────────────────────────────────────
type ProgStatus = 'ACTIVO' | 'BORRADOR' | 'PUBLICADO' | 'REVISION';

interface Programacion {
  id: string;
  year: string;
  modulo: string;
  codigo: string;
  docente?: string;
  status: ProgStatus;
  updatedAt: string;
  raTotal: number;
  raCubiertos: number;
  utsTotal: number;
  horas: number;
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK: Programacion[] = [
  {
    id: 'demo-123',
    year: '2026-2027',
    modulo: 'Diseño de Interiores y Amueblamiento',
    codigo: 'DIA',
    docente: 'J. Pérez Molina',
    status: 'ACTIVO',
    updatedAt: new Date().toISOString(),
    raTotal: 6, raCubiertos: 5, utsTotal: 9, horas: 128,
  },
  {
    id: 'prog-2',
    year: '2026-2027',
    modulo: 'Fabricación e Instalación de Carpintería',
    codigo: 'FIC',
    docente: 'L. Mosa García',
    status: 'REVISION',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    raTotal: 7, raCubiertos: 7, utsTotal: 11, horas: 192,
  },
  {
    id: 'prog-3',
    year: '2026-2027',
    modulo: 'Gestión y Organización del Taller',
    codigo: 'GOT',
    docente: 'R. Velasco Torres',
    status: 'BORRADOR',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    raTotal: 5, raCubiertos: 2, utsTotal: 7, horas: 96,
  },
  {
    id: 'prog-4',
    year: '2026-2027',
    modulo: 'Digitalización aplicada al sector',
    codigo: 'DIG',
    docente: 'A. Ruiz Sánchez',
    status: 'PUBLICADO',
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
    raTotal: 5, raCubiertos: 5, utsTotal: 8, horas: 64,
  },
  {
    id: 'sample-project',
    year: '2025-2026',
    modulo: 'Proyecto Final de Ciclo',
    codigo: 'PFC',
    docente: 'J. Pérez Molina',
    status: 'PUBLICADO',
    updatedAt: new Date(Date.now() - 2592000000).toISOString(),
    raTotal: 4, raCubiertos: 4, utsTotal: 6, horas: 80,
  },
];

// ─── META ──────────────────────────────────────────────────────────────────────
const STATUS_META: Record<ProgStatus, { label: string; color: string; bg: string; Icon: any }> = {
  ACTIVO:    { label: 'Activa',      color: '#0d6e6e', bg: '#E1F5EE', Icon: Activity },
  BORRADOR:  { label: 'Borrador',    color: '#b45309', bg: '#FAEEDA', Icon: Edit3 },
  REVISION:  { label: 'En revisión', color: '#0369a1', bg: '#E6F1FB', Icon: Eye },
  PUBLICADO: { label: 'Publicada',   color: '#27500A', bg: '#EAF3DE', Icon: CheckCircle },
};

const YEARS = ['2026-2027', '2025-2026'];
const FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'ACTIVO', label: 'Activas' },
  { key: 'BORRADOR', label: 'Borradores' },
  { key: 'REVISION', label: 'En revisión' },
  { key: 'PUBLICADO', label: 'Publicadas' },
];

// ─── TARJETA MÓDULO ─────────────────────────────────────────────────────────────
function ProgCard({ prog, canEdit }: { prog: Programacion; canEdit: boolean }) {
  const meta = STATUS_META[prog.status];
  const Icon = meta.Icon;
  const raPct = Math.round((prog.raCubiertos / prog.raTotal) * 100);
  const daysAgo = Math.round((Date.now() - new Date(prog.updatedAt).getTime()) / 86400000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-white border border-[#f0eee8] rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[var(--teal)]/30 transition-all group flex flex-col"
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between mb-4">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black"
          style={{ background: meta.bg, color: meta.color }}>
          <Icon className="w-3 h-3" />
          {meta.label}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-[var(--bg2)] text-[var(--ink3)] rounded-full">
            {prog.codigo}
          </span>
          <span className="text-[9px] text-[var(--ink3)]">{prog.year}</span>
        </div>
      </div>

      {/* Módulo */}
      <h3 className="text-[15px] font-bold text-[var(--ink)] mb-1 leading-snug group-hover:text-[var(--teal)] transition-colors flex-1">
        {prog.modulo}
      </h3>
      {prog.docente && (
        <p className="text-[11px] text-[var(--ink3)] mb-4">
          <span className="font-bold">Docente:</span> {prog.docente}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { val: `${prog.raCubiertos}/${prog.raTotal}`, label: 'RA' },
          { val: prog.utsTotal, label: 'UT' },
          { val: `${prog.horas}h`, label: 'Horas' },
        ].map((s, i) => (
          <div key={i} className="text-center bg-[var(--bg1)] rounded-xl py-2">
            <div className="text-sm font-bold text-[var(--ink)]">{s.val}</div>
            <div className="text-[9px] font-black uppercase tracking-widest text-[var(--ink3)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progreso RA */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-[var(--ink3)]">Cobertura de RA</span>
          <span className="text-[10px] font-black" style={{ color: raPct >= 80 ? '#0d6e6e' : raPct >= 50 ? '#b45309' : '#dc2626' }}>
            {raPct}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${raPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: raPct >= 80 ? '#0d6e6e' : raPct >= 50 ? '#f59e0b' : '#dc2626' }}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/dashboard/programaciones/${prog.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-[var(--ink)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[var(--teal)] transition-colors"
        >
          <Eye className="w-3 h-3" /> Ver
        </Link>
        {canEdit && (
          <Link
            href={`/dashboard/programaciones/${prog.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-[var(--teal)]/30 text-[var(--teal)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--teal)]/5 transition-colors"
          >
            <Edit3 className="w-3 h-3" /> Editar
          </Link>
        )}
      </div>

      <p className="text-[9px] text-[var(--ink3)] text-right mt-3">
        {daysAgo === 0 ? 'Hoy' : daysAgo === 1 ? 'Ayer' : `Hace ${daysAgo} días`}
      </p>
    </motion.div>
  );
}

// ─── PÁGINA PRINCIPAL ──────────────────────────────────────────────────────────
export default function ProgramacionesPage() {
  const [user, setUser] = useState<any>(null);
  const [programaciones] = useState<Programacion[]>(MOCK);
  const [selectedYear, setSelectedYear] = useState('2026-2027');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const role = user?.role || 'PROFESOR';
  const canEdit = role === 'PROFESOR' || role === 'JEFATURA' || role === 'ADMIN';

  const filtered = programaciones.filter(p => {
    const matchYear = p.year === selectedYear;
    const matchStatus = selectedFilter === 'all' || p.status === selectedFilter;
    return matchYear && matchStatus;
  });

  // KPIs del año seleccionado
  const yearProgs = programaciones.filter(p => p.year === selectedYear);
  const totalRA = yearProgs.reduce((a, b) => a + b.raTotal, 0);
  const cubRA = yearProgs.reduce((a, b) => a + b.raCubiertos, 0);
  const globalRAPct = totalRA > 0 ? Math.round((cubRA / totalRA) * 100) : 0;
  const publicadas = yearProgs.filter(p => p.status === 'PUBLICADO').length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Banner Programación Viva ─────────────────────────────────────────── */}
        {canEdit && (
          <Link href="/dashboard/programacion-viva" className="block group">
            <div className="relative bg-[var(--ink)] rounded-3xl p-6 md:p-8 overflow-hidden cursor-pointer hover:shadow-2xl transition-all">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--teal)]/10 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/40">Documento institucional vivo</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">
                    Programación <span className="text-[var(--teal)] italic">Viva</span>
                    <span className="text-white/40 text-xl"> · {selectedYear}</span>
                  </h2>
                  <p className="text-sm text-white/50 max-w-md leading-relaxed">
                    Documento unificado del ciclo: datos generales, currículo, perfil del alumnado y seguimiento en tiempo real de los 7 bloques.
                  </p>
                </div>

                {/* Mini KPIs */}
                <div className="flex gap-3 flex-wrap">
                  {[
                    { val: `${globalRAPct}%`, label: 'RA cubiertos', color: 'var(--teal)' },
                    { val: yearProgs.length, label: 'Módulos', color: '#60a5fa' },
                    { val: publicadas, label: 'Publicados', color: '#4ade80' },
                  ].map((k, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl px-4 py-3 text-center border border-white/10 min-w-[80px]">
                      <div className="text-xl font-bold font-serif" style={{ color: k.color }}>{k.val}</div>
                      <div className="text-[9px] font-black uppercase tracking-wider text-white/30 mt-0.5">{k.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-[var(--teal)] text-white rounded-2xl px-5 py-3 text-[11px] font-black uppercase tracking-widest group-hover:scale-105 transition-transform shadow-lg shadow-[var(--teal)]/20 flex-shrink-0">
                  <Workflow className="w-4 h-4" />
                  Abrir documento
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* ── Cabecera módulos ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-serif text-white">
              {role === 'ALUMNO' ? 'Mis módulos' : 'Programaciones didácticas'}
            </h1>
            <p className="text-[11px] text-white/40 mt-0.5">
              {filtered.length} {filtered.length === 1 ? 'módulo' : 'módulos'} · {selectedYear}
            </p>
          </div>
          {canEdit && (
            <Link
              href="/dashboard/curriculum/import"
              className="inline-flex items-center gap-2 h-10 px-5 bg-[var(--teal)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-[var(--teal)]/20"
            >
              <Plus className="w-4 h-4" /> Nueva programación
            </Link>
          )}
        </div>

        {/* ── Filtros ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Año */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedYear === y
                    ? 'bg-white text-[var(--ink)]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Estado */}
          <div className="flex flex-wrap gap-1">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  selectedFilter === f.key
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid de programaciones ────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <BookOpen className="w-7 h-7 text-white/20" />
              </div>
              <h3 className="text-lg font-bold text-white/40 mb-2">Sin programaciones</h3>
              <p className="text-sm text-white/20 mb-6">No hay módulos que coincidan con los filtros seleccionados.</p>
              {canEdit && (
                <Link
                  href="/dashboard/curriculum/import"
                  className="inline-flex items-center gap-2 h-10 px-6 bg-[var(--teal)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                >
                  <Plus className="w-4 h-4" /> Crear primera programación
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.map((prog, i) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ProgCard prog={prog} canEdit={canEdit} />
                </motion.div>
              ))}

              {/* Tarjeta "Nueva programación" */}
              {canEdit && (
                <Link href="/dashboard/curriculum/import">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: filtered.length * 0.07 }}
                    className="border-2 border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 h-full min-h-[240px] hover:border-[var(--teal)]/40 hover:bg-white/[0.02] transition-all group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[var(--teal)]/10 flex items-center justify-center transition-all border border-white/10 group-hover:border-[var(--teal)]/30">
                      <Plus className="w-5 h-5 text-white/30 group-hover:text-[var(--teal)] transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                        Nueva programación
                      </p>
                      <p className="text-[10px] text-white/20 mt-1">Importar currículo o crear desde cero</p>
                    </div>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Acceso rápido IA ─────────────────────────────────────────────────── */}
        {canEdit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
            <Link href="/dashboard/ai" className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--teal)]/20">
                <Zap className="w-4 h-4 text-[var(--teal)]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">IA Docente</p>
                <p className="text-[10px] text-white/40">Detecta brechas y genera actividades transversales</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 ml-auto transition-colors" />
            </Link>
            <Link href="/dashboard/transversal" className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                <Layers className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Transversalidad</p>
                <p className="text-[10px] text-white/40">PRL · Igualdad · Digitalización · Sostenibilidad</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 ml-auto transition-colors" />
            </Link>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
