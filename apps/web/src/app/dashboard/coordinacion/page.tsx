'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  Users, Calendar, CheckCircle2, Clock,
  BookOpen, AlertCircle, ChevronRight,
  Plus, MessageSquare, ClipboardList,
  GraduationCap, TrendingUp
} from 'lucide-react';

// ─── Mock data ────────────────────────────────────────────────────────────────
const DOCENTES = [
  { nombre: 'María López',    modulos: ['Sistemas Informáticos', 'Redes Locales'],              estado: 'ok',      pendientes: 0 },
  { nombre: 'Carlos Ruiz',    modulos: ['Bases de Datos', 'Lenguajes de Marcas'],                estado: 'alerta',  pendientes: 2 },
  { nombre: 'Ana Fernández',  modulos: ['Programación', 'Entornos de Desarrollo'],              estado: 'ok',      pendientes: 1 },
  { nombre: 'Pedro Martín',   modulos: ['FOL', 'Empresa e Iniciativa Emprendedora'],            estado: 'revision', pendientes: 3 },
];

const REUNIONES = [
  { titulo: 'Revisión T2 — Estado programaciones', fecha: '10 Abr 2026', hora: '12:00', tipo: 'ordinaria', acta: false },
  { titulo: 'Coordinación proyecto intermodular',  fecha: '17 Abr 2026', hora: '11:00', tipo: 'extraordinaria', acta: false },
  { titulo: 'Cierre T1 — Validación memorias',     fecha: '20 Feb 2026', hora: '10:00', tipo: 'ordinaria', acta: true },
  { titulo: 'Inicio de curso — Planificación',     fecha: '12 Sep 2025', hora: '09:00', tipo: 'ordinaria', acta: true },
];

const TAREAS = [
  { texto: 'Validar programación de Carlos Ruiz — Bases de Datos',   prioridad: 'alta',   hecha: false },
  { texto: 'Convocar reunión extraordinaria antes del 15 de abril',   prioridad: 'alta',   hecha: false },
  { texto: 'Revisar acta T1 y subir al gestor documental',           prioridad: 'media',  hecha: true  },
  { texto: 'Asignar módulo FCT a Ana Fernández para el 3er trim.',   prioridad: 'media',  hecha: false },
  { texto: 'Actualizar tabla de distribución horaria del dpto.',     prioridad: 'baja',   hecha: true  },
];

const ESTADO_META: Record<string, { label: string; color: string; bg: string }> = {
  ok:      { label: 'Al día',       color: '#0d9488', bg: 'rgba(13,148,136,0.1)'  },
  alerta:  { label: 'Con alertas',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  revision:{ label: 'En revisión',  color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
};

const PRIORIDAD_META: Record<string, { color: string }> = {
  alta:  { color: '#ef4444' },
  media: { color: '#f59e0b' },
  baja:  { color: '#6b7280' },
};

// ─── Componente ───────────────────────────────────────────────────────────────
export default function CoordinacionPage() {
  const [tareas, setTareas] = useState(TAREAS);
  const [tabReuniones, setTabReuniones] = useState<'proximas' | 'pasadas'>('proximas');

  const toggleTarea = (i: number) => {
    setTareas(prev => prev.map((t, idx) => idx === i ? { ...t, hecha: !t.hecha } : t));
  };

  const proximas = REUNIONES.filter(r => !r.acta);
  const pasadas  = REUNIONES.filter(r => r.acta);
  const reunionesMostradas = tabReuniones === 'proximas' ? proximas : pasadas;

  const pendientesTotal = tareas.filter(t => !t.hecha).length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <header className="p-6 bg-gradient-to-br from-[var(--ink)] to-[#1a1a1a] rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-[var(--ink)]/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--teal)] mb-1">Jefatura de Departamento</p>
              <h1 className="text-3xl font-bold font-serif tracking-tight">Coordinación del Equipo</h1>
              <p className="text-sm text-white/50 mt-1">Seguimiento del equipo docente, reuniones y tareas de coordinación.</p>
            </div>
            <div className="flex gap-3">
              <div className="text-center bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
                <div className="text-2xl font-bold font-serif text-[var(--teal)]">{DOCENTES.length}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Docentes</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
                <div className="text-2xl font-bold font-serif text-amber-400">{pendientesTotal}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Pendientes</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
                <div className="text-2xl font-bold font-serif text-violet-400">{proximas.length}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-white/40">Reuniones</div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)] opacity-[0.05] rounded-full -mr-32 -mt-32 blur-3xl" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Col izq: Equipo + Reuniones ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Equipo docente */}
            <div className="bg-white rounded-3xl border border-[#f0eee8] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold font-serif text-[var(--ink)] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--ink3)]" /> Equipo Docente
                </h2>
                <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--teal)] hover:opacity-70 transition-opacity">
                  <Plus className="w-3 h-3" /> Añadir
                </button>
              </div>
              <div className="space-y-3">
                {DOCENTES.map((d, i) => {
                  const meta = ESTADO_META[d.estado];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg2)]/40 border border-[#f0eee8] hover:border-[#e0ddd5] hover:bg-white transition-all group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[var(--ink)] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                        {d.nombre.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--ink)] truncate">{d.nombre}</p>
                        <p className="text-[10px] text-[var(--ink3)] truncate">{d.modulos.join(' · ')}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {d.pendientes > 0 && (
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-[9px] font-black flex items-center justify-center">
                            {d.pendientes}
                          </span>
                        )}
                        <span
                          className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
                          style={{ color: meta.color, background: meta.bg }}
                        >
                          {meta.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--ink3)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Reuniones */}
            <div className="bg-white rounded-3xl border border-[#f0eee8] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold font-serif text-[var(--ink)] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--ink3)]" /> Reuniones
                </h2>
                <div className="flex gap-1 bg-[var(--bg2)] rounded-xl p-1">
                  {(['proximas', 'pasadas'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setTabReuniones(tab)}
                      className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                      style={tabReuniones === tab
                        ? { background: 'var(--ink)', color: 'white' }
                        : { color: 'var(--ink3)' }}
                    >
                      {tab === 'proximas' ? 'Próximas' : 'Actas'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {reunionesMostradas.map((r, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-[#f0eee8] hover:border-[var(--teal)] hover:bg-[var(--teal)]/5 transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg2)] flex flex-col items-center justify-center flex-shrink-0 text-[var(--ink)] group-hover:bg-[var(--teal)] group-hover:text-white transition-all">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--ink)]">{r.titulo}</p>
                      <p className="text-[10px] text-[var(--ink3)] mt-0.5">
                        {r.fecha} · {r.hora}
                        <span className="ml-2 uppercase tracking-wider font-black"
                          style={{ color: r.tipo === 'extraordinaria' ? '#7c3aed' : 'var(--teal)' }}>
                          · {r.tipo}
                        </span>
                      </p>
                    </div>
                    <button className="flex-shrink-0 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[#f0eee8] text-[var(--ink3)] group-hover:border-[var(--teal)] group-hover:text-[var(--teal)] transition-all">
                      {r.acta ? <><BookOpen className="w-3 h-3" /> Acta</> : <><MessageSquare className="w-3 h-3" /> Convocar</>}
                    </button>
                  </div>
                ))}
                {reunionesMostradas.length === 0 && (
                  <p className="text-center text-sm text-[var(--ink3)] py-6">No hay reuniones en este apartado.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── Col der: Tareas pendientes ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#f0eee8] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold font-serif text-[var(--ink)] flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[var(--ink3)]" /> Tareas
                </h2>
                <span className="text-[9px] font-black text-[var(--ink3)]">
                  {tareas.filter(t => t.hecha).length}/{tareas.length} hechas
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="h-1.5 bg-[var(--bg2)] rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-[var(--teal)] rounded-full transition-all duration-500"
                  style={{ width: `${(tareas.filter(t => t.hecha).length / tareas.length) * 100}%` }}
                />
              </div>

              <div className="space-y-2">
                {tareas.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTarea(i)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg2)]/60 transition-all text-left group"
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${t.hecha ? 'bg-[var(--teal)] border-[var(--teal)]' : 'border-[#d1cfc9]'}`}>
                      {t.hecha && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-medium leading-snug ${t.hecha ? 'line-through text-[var(--ink3)]' : 'text-[var(--ink)]'}`}>
                        {t.texto}
                      </p>
                    </div>
                    <span
                      className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                      style={{ background: PRIORIDAD_META[t.prioridad].color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Indicadores rápidos */}
            <div className="bg-white rounded-3xl border border-[#f0eee8] p-6 shadow-sm space-y-4">
              <h2 className="font-bold font-serif text-[var(--ink)] flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[var(--ink3)]" /> Estado Global
              </h2>
              {[
                { label: 'Programaciones validadas', value: 2, total: 4, color: 'var(--teal)' },
                { label: 'Módulos con RA cubiertos',  value: 6, total: 8, color: '#7c3aed' },
                { label: 'Horas coordinación (T2)',   value: 3, total: 5, color: '#f59e0b' },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-[var(--ink2)]">{kpi.label}</span>
                    <span style={{ color: kpi.color }}>{kpi.value}/{kpi.total}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(kpi.value / kpi.total) * 100}%`, background: kpi.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
