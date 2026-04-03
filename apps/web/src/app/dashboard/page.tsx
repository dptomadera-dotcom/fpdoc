'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, BookOpen, Target, BarChart3, Users,
  GraduationCap, Cpu, FileSearch, CheckCircle,
  AlertTriangle, Clock, ArrowRight, Plus, Zap, FileText,
  Workflow, Activity
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { motion } from 'framer-motion';

// ─── Vista ALUMNO ────────────────────────────────────────────────────────────
function DashboardAlumno({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { val: '5', label: 'Módulos matriculados', color: 'var(--teal)' },
          { val: '72%', label: 'Progreso medio', color: 'var(--teal)' },
          { val: '2', label: 'Tareas pendientes', color: 'var(--amber)' },
        ].map((s, i) => (
          <div key={i} className="fp-card">
            <div className="text-[28px] font-bold leading-none mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink3)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis módulos */}
        <div className="fp-card">
          <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--teal)]" /> Mis Módulos
          </h2>
          <div className="space-y-3">
            {[
              { name: 'Sistemas Informáticos', progress: 80, ra: '4/5 RA' },
              { name: 'Bases de Datos', progress: 60, ra: '3/5 RA' },
              { name: 'Programación', progress: 45, ra: '2/5 RA' },
            ].map((mod, i) => (
              <div key={i} className="py-2 border-b border-white/5 last:border-none">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-white">{mod.name}</span>
                  <span className="text-[10px] font-bold text-white/40">{mod.ra}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--teal)] rounded-full transition-all" style={{ width: `${mod.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Itinerario FCT */}
        <div className="fp-card bg-[var(--ink)] text-white border-none">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-[var(--teal)]" />
            <h2 className="font-bold text-sm uppercase tracking-widest">Itinerario FCT</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Empresa asignada', val: 'Pendiente', alert: true },
              { label: 'Horas completadas', val: '0 / 400', alert: false },
              { label: 'Próxima revisión', val: 'Sin fecha', alert: false },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-none text-sm">
                <span className="text-white/50">{item.label}</span>
                <span className={`font-bold text-xs ${item.alert ? 'text-[var(--amber)]' : 'text-white'}`}>{item.val}</span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/programaciones" className="mt-4 block text-center text-[10px] font-black uppercase tracking-widest text-[var(--teal2)] hover:text-white transition-colors">
            Ver programaciones →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Vista PROFESOR ───────────────────────────────────────────────────────────
function DashboardDocente({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { val: '3', label: 'Módulos asignados', color: '#7c3aed' },
          { val: '84%', label: 'Progreso medio RA', color: 'var(--teal)' },
          { val: '2', label: 'En revisión', color: 'var(--amber)' },
        ].map((s, i) => (
          <div key={i} className="fp-card">
            <div className="text-[28px] font-bold leading-none mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink3)]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado de programaciones */}
        <div className="fp-card">
          <h2 className="font-bold text-sm mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#7c3aed]" />Mis Programaciones</span>
            <Link href="/dashboard/programaciones" className="text-[10px] font-bold text-[var(--teal)] hover:underline">Ver todas</Link>
          </h2>
          <div className="space-y-3">
            {[
              { mod: 'Sistemas Informáticos', estado: 'Borrador', color: 'amber', ra: '4/5' },
              { mod: 'Bases de Datos', estado: 'En revisión', color: 'blue', ra: '5/5' },
              { mod: 'Redes Locales', estado: 'Publicado', color: 'teal', ra: '5/5' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-none">
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{item.mod}</div>
                  <div className="text-[10px] text-white/40 mt-0.5">RA cubiertos: {item.ra}</div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  item.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : 
                  item.color === 'teal' ? 'bg-teal-500/10 text-teal-500' : 
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {item.estado}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/curriculum/import" className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[var(--teal)] hover:underline">
            <Plus className="w-3 h-3" /> Nueva programación
          </Link>
        </div>

        {/* Programación Viva */}
        <Link href="/dashboard/programacion-viva" className="group">
          <div className="fp-card bg-[var(--ink)] text-white border-none cursor-pointer hover:shadow-xl transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--teal)]/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-[var(--teal)]" />
                  <h2 className="font-bold text-sm uppercase tracking-widest">Programación Viva</h2>
                </div>
                <span className="px-2 py-0.5 bg-[var(--teal)]/20 rounded-full text-[9px] font-black text-[var(--teal)] uppercase flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5" /> En curso
                </span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-5">
                Documento institucional vivo del ciclo 2026-2027. 7 bloques: datos generales, currículo, perfil del alumnado, desarrollo real y evaluación.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { val: '62%', label: 'Completado' },
                  { val: '1/7', label: 'Completos' },
                  { val: '2', label: 'Alertas' },
                ].map((k, i) => (
                  <div key={i} className="bg-white/5 rounded-xl py-2 text-center border border-white/10">
                    <div className="text-base font-bold text-[var(--teal)]">{k.val}</div>
                    <div className="text-[8px] font-black uppercase tracking-wider text-white/30">{k.label}</div>
                  </div>
                ))}
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-[var(--teal)] rounded-full" style={{ width: '62%' }} />
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[var(--teal2)] group-hover:text-white transition-colors">
                Abrir documento completo
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── Vista JEFATURA ──────────────────────────────────────────────────────────────
function DashboardJefe({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { val: '8', label: 'Módulos del ciclo', color: 'var(--teal)' },
          { val: '6/8', label: 'Programaciones OK', color: 'var(--teal)' },
          { val: '4', label: 'Pendientes validar', color: 'var(--amber)' },
          { val: '2', label: 'Alertas transvers.', color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="fp-card">
            <div className="text-[28px] font-bold leading-none mb-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cola de validación */}
        <div className="fp-card bg-[var(--ink)] text-white border-none shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-[var(--teal)]" /> Cola de Validación
            </h2>
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] font-black">4 PENDIENTES</span>
          </div>
          <div className="space-y-3">
            {[
              { author: 'J. Pérez', type: 'Cambio UT', doc: 'Sistemas Inf.', time: '2h', link: '/dashboard/programaciones' },
              { author: 'L. Mosa', type: 'Nuevo RA', doc: 'Bases de Datos', time: '5h', link: '/dashboard/programaciones' },
              { author: 'R. Velasco', type: 'Ajuste CE', doc: 'Programación', time: '1d', link: '/dashboard/settings' },
            ].map((task, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[12px] font-bold">{task.type}</div>
                  <div className="text-[10px] opacity-40 uppercase font-black">{task.time}</div>
                </div>
                <div className="text-[11px] opacity-60 mb-3">{task.author} en {task.doc}</div>
                <div className="flex gap-2">
                  <Link href={task.link} className="flex-1 py-1.5 text-center text-white text-[10px] font-bold rounded-lg bg-[var(--teal)] hover:scale-[1.02] transition-transform">Revisar</Link>
                  <button className="px-3 py-1.5 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20 transition-colors">Aprobar</button>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/programaciones" className="mt-5 block text-center text-[10px] font-black uppercase tracking-widest text-[var(--teal2)] hover:text-white transition-colors">
            Ver todas las programaciones →
          </Link>
        </div>

        {/* Transversalidad + estado ciclo */}
        <div className="space-y-4">
          <div className="fp-card">
            <h2 className="font-bold text-sm mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Target className="w-4 h-4 text-[#b45309]" />Transversalidad</span>
              <Link href="/dashboard/transversal" className="text-[10px] font-bold text-[var(--teal)] hover:underline">Ver mapa</Link>
            </h2>
            <div className="space-y-2.5">
              {[
                { label: 'PRL', pct: 80, alert: true },
                { label: 'Digitalización', pct: 100, alert: false },
                { label: 'Sostenibilidad', pct: 60, alert: true },
                { label: 'Igualdad', pct: 40, alert: true },
                { label: 'Emprendimiento', pct: 80, alert: false },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-[11px] text-[var(--ink3)] min-w-[90px]">{t.label}</span>
                  <div className="flex-1 h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.pct >= 80 ? 'var(--teal)' : t.pct >= 60 ? 'var(--amber)' : '#dc2626' }} />
                  </div>
                  <span className="text-[10px] font-bold min-w-[30px] text-right" style={{ color: t.pct >= 80 ? 'var(--teal)' : t.pct >= 60 ? 'var(--amber)' : '#dc2626' }}>{t.pct}%</span>
                  {t.alert && t.pct < 80 && <AlertTriangle className="w-3.5 h-3.5 text-[var(--amber)] flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard/programacion-viva" className="group">
            <div className="fp-card bg-[var(--ink)] text-white border-none cursor-pointer hover:shadow-xl transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-violet-500/10 blur-[50px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-sm flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-violet-400" /> Programación Viva
                  </h2>
                  <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full text-[9px] font-black">7 bloques</span>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Marco normativo', estado: 'Completo', ok: true },
                    { label: 'Configuración curricular', estado: 'En proceso', ok: false },
                    { label: 'Desarrollo real', estado: 'Se activa en sept.', ok: null },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-white/40">{s.label}</span>
                      <span className="flex items-center gap-1 font-bold text-[10px]" style={{ color: s.ok === true ? '#4ade80' : s.ok === false ? '#f59e0b' : '#6b7280' }}>
                        {s.ok === true ? <CheckCircle className="w-3 h-3" /> : s.ok === false ? <Clock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {s.estado}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-violet-400 group-hover:text-white transition-colors">
                  Abrir documento vivo
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // REFUERZO: Si el email es el de departamento, forzar JEFATURA
  const isDeptEmail = user?.email?.toLowerCase() === 'departamento.madera@gmail.com';
  const role = isDeptEmail ? 'JEFATURA' : (user?.role || 'PROFESOR');

  const ROLE_HEADERS: Record<string, { title: string; sub: string; color: string }> = {
    ALUMNO: { title: 'Mi espacio formativo', sub: 'Consulta tus módulos, actividades y seguimiento FCT.', color: '#0d6e6e' },
    PROFESOR: { title: 'Panel del docente', sub: 'Gestiona tus programaciones, RA y unidades de trabajo.', color: '#7c3aed' },
    JEFATURA: { title: 'Panel de Departamento', sub: 'Supervisa el ciclo completo y valida las programaciones.', color: '#b45309' },
  };

  const header = ROLE_HEADERS[role] || ROLE_HEADERS['PROFESOR'];

  return (
    <DashboardLayout>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white border border-[#f0eee8] rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Header de bienvenida */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold font-serif text-white">{header.title}</h1>
              <p className="text-sm text-white/40 mt-1">{header.sub}</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/5">
              {user?.email?.split('@')[0] || 'Usuario'}
            </div>
          </div>

          {/* Dashboard por rol */}
          {role === 'ALUMNO' && <DashboardAlumno user={user} />}
          {role === 'PROFESOR' && <DashboardDocente user={user} />}
          {role === 'JEFATURA' && <DashboardJefe user={user} />}
          {!['ALUMNO', 'PROFESOR', 'JEFATURA'].includes(role) && <DashboardDocente user={user} />}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
