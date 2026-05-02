'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { authService } from '@/services/auth.service';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Building2, Scale, CalendarDays, BookOpen,
  Users, Activity, BarChart3,
  ChevronDown, ChevronRight, CheckCircle,
  AlertTriangle, Clock, Edit3, Download,
  Eye, Zap, Flag, ArrowRight, Shield,
  Cpu, Globe, Target, Layers, FileText,
  GraduationCap, RefreshCw, Lock
} from 'lucide-react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────
type BlockStatus = 'completo' | 'en_proceso' | 'pendiente' | 'bloqueado';
type DataSource = 'auto' | 'onboarding' | 'manual' | 'mixto';

interface SubItem {
  label: string;
  value?: string;
  status?: 'ok' | 'warn' | 'empty';
  source?: DataSource;
}

interface Block {
  id: string;
  num: number;
  title: string;
  icon: any;
  color: string;
  bg: string;
  border: string;
  status: BlockStatus;
  source: DataSource;
  desc: string;
  items: SubItem[];
  roles: string[];
  locked?: boolean;
}

// ─── BLOQUES ──────────────────────────────────────────────────────────────────
const BLOCKS: Block[] = [
  {
    id: 'datos-generales',
    num: 1,
    title: 'Datos generales del curso',
    icon: Building2,
    color: '#0d6e6e',
    bg: '#E1F5EE',
    border: '#0d6e6e30',
    status: 'en_proceso',
    source: 'mixto',
    desc: 'Identificación institucional del ciclo, grupos y equipo docente para el curso 2026-2027.',
    roles: ['ALUMNO', 'PROFESOR', 'JEFATURA', 'ADMIN'],
    items: [
      { label: 'Centro', value: 'IES Politécnico Las Palmas', status: 'ok', source: 'manual' },
      { label: 'Departamento', value: 'Madera, Mueble y Corcho', status: 'ok', source: 'manual' },
      { label: 'Familia profesional', value: 'Madera, Mueble y Corcho', status: 'ok', source: 'auto' },
      { label: 'Ciclo', value: 'CFGS Diseño y Amueblamiento', status: 'ok', source: 'auto' },
      { label: 'Curso académico', value: '2026-2027', status: 'ok', source: 'auto' },
      { label: 'Grupos', value: '1º CFGS · 2º CFGS', status: 'ok', source: 'onboarding' },
      { label: 'Profesorado asignado', value: '3 docentes · pendiente validar', status: 'warn', source: 'onboarding' },
    ],
  },
  {
    id: 'marco-normativo',
    num: 2,
    title: 'Marco normativo',
    icon: Scale,
    color: '#7c3aed',
    bg: '#EEEDFE',
    border: '#7c3aed30',
    status: 'completo',
    source: 'auto',
    desc: 'Legislación estatal y autonómica de referencia. Generado automáticamente desde el perfil del ciclo.',
    roles: ['ALUMNO', 'PROFESOR', 'JEFATURA', 'ADMIN'],
    items: [
      { label: 'LOE / LOMLOE', value: 'Ley Orgánica 2/2006 modificada por LO 3/2020', status: 'ok', source: 'auto' },
      { label: 'LOOIFP', value: 'Ley Orgánica 3/2022 de Ordenación e Integración de la FP', status: 'ok', source: 'auto' },
      { label: 'Real Decreto del título', value: 'RD 1573/2011 · Diseño y Amueblamiento', status: 'ok', source: 'auto' },
      { label: 'Normativa autonómica', value: 'Orden Canaria de ordenación FP 2024', status: 'ok', source: 'onboarding' },
      { label: 'Acuerdos de centro', value: 'Pendiente introducir', status: 'empty', source: 'manual' },
      { label: 'Criterios departamentales', value: 'Pendiente introducir', status: 'empty', source: 'manual' },
    ],
  },
  {
    id: 'estructura-organizativa',
    num: 3,
    title: 'Estructura organizativa',
    icon: CalendarDays,
    color: '#b45309',
    bg: '#FAEEDA',
    border: '#b4530930',
    status: 'en_proceso',
    source: 'mixto',
    desc: 'Calendario del curso, evaluaciones, períodos FCT, horarios y proyectos aprobados.',
    roles: ['PROFESOR', 'JEFATURA', 'ADMIN'],
    items: [
      { label: 'Inicio del curso', value: 'Septiembre 2026', status: 'ok', source: 'onboarding' },
      { label: '1ª Evaluación', value: 'Diciembre 2026', status: 'ok', source: 'manual' },
      { label: '2ª Evaluación', value: 'Marzo 2027', status: 'ok', source: 'manual' },
      { label: '3ª Evaluación', value: 'Junio 2027', status: 'ok', source: 'manual' },
      { label: 'Períodos FCT', value: '2º trimestre (Feb-Abr 2027)', status: 'ok', source: 'onboarding' },
      { label: 'Aulas y talleres', value: 'Taller de madera · Aula CAD', status: 'warn', source: 'manual' },
      { label: 'Proyectos aprobados', value: '1 proyecto intermodular · en diseño', status: 'warn', source: 'onboarding' },
    ],
  },
  {
    id: 'configuracion-curricular',
    num: 4,
    title: 'Configuración curricular',
    icon: BookOpen,
    color: '#0369a1',
    bg: '#E6F1FB',
    border: '#0369a130',
    status: 'en_proceso',
    source: 'mixto',
    desc: 'Módulos, Resultados de Aprendizaje, Criterios de Evaluación, secuenciación e instrumentos.',
    roles: ['PROFESOR', 'JEFATURA', 'ADMIN'],
    items: [
      { label: 'Módulos configurados', value: '5 de 7 módulos', status: 'warn', source: 'onboarding' },
      { label: 'RA totales', value: '35 RA definidos', status: 'ok', source: 'auto' },
      { label: 'CE totales', value: '187 criterios · 164 asignados a UT', status: 'warn', source: 'auto' },
      { label: 'Unidades de trabajo', value: '28 UT planificadas · 412 h totales', status: 'ok', source: 'onboarding' },
      { label: 'Instrumentos de evaluación', value: 'Rúbricas · Pruebas · Proyectos · Portafolios', status: 'ok', source: 'onboarding' },
      { label: 'Tipos de evidencia', value: 'Proyectos técnicos · Memorias · Código', status: 'ok', source: 'onboarding' },
      { label: 'Coherencia transversal', value: '2 alertas activas (PRL · Igualdad)', status: 'warn', source: 'auto' },
    ],
  },
  {
    id: 'perfil-alumnado',
    num: 5,
    title: 'Perfil inicial del alumnado',
    icon: Users,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#05966930',
    status: 'en_proceso',
    source: 'onboarding',
    desc: 'Síntesis agregada de los cuestionarios iniciales del alumnado. Se actualiza automáticamente.',
    roles: ['PROFESOR', 'JEFATURA', 'ADMIN'],
    items: [
      { label: 'Alumnado matriculado', value: '42 alumnos/as (2 grupos)', status: 'ok', source: 'onboarding' },
      { label: 'Cuestionarios completados', value: '31 / 42 (74%)', status: 'warn', source: 'onboarding' },
      { label: 'Vía de acceso mayoritaria', value: 'Bachillerato (48%) · CFGM (31%)', status: 'ok', source: 'onboarding' },
      { label: 'Con experiencia laboral previa', value: '12 alumnos/as (39%)', status: 'ok', source: 'onboarding' },
      { label: 'Manejo digital (media)', value: '3,4 / 5', status: 'ok', source: 'onboarding' },
      { label: 'Necesidades de apoyo detectadas', value: '4 casos · pendiente revisión', status: 'warn', source: 'onboarding' },
      { label: 'Motivación principal', value: 'Salidas laborales (52%) · Vocación (31%)', status: 'ok', source: 'onboarding' },
    ],
  },
  {
    id: 'desarrollo-real',
    num: 6,
    title: 'Desarrollo real del curso',
    icon: Activity,
    color: '#dc2626',
    bg: '#FEF2F2',
    border: '#dc262630',
    status: 'pendiente',
    source: 'auto',
    desc: 'Registro en tiempo real: sesiones impartidas, tareas, incidencias, evidencias y seguimiento de RA.',
    roles: ['PROFESOR', 'JEFATURA', 'ADMIN'],
    locked: true,
    items: [
      { label: 'Sesiones registradas', value: '0 — curso no iniciado', status: 'empty', source: 'auto' },
      { label: 'Tareas activas', value: '—', status: 'empty', source: 'auto' },
      { label: 'Incidencias registradas', value: '—', status: 'empty', source: 'auto' },
      { label: 'Evidencias generadas', value: '—', status: 'empty', source: 'auto' },
      { label: 'Proyectos en marcha', value: '—', status: 'empty', source: 'auto' },
      { label: 'Seguimiento de RA', value: 'Se activará en septiembre 2026', status: 'empty', source: 'auto' },
    ],
  },
  {
    id: 'evaluacion-mejora',
    num: 7,
    title: 'Evaluación, coordinación y mejora',
    icon: BarChart3,
    color: '#7c3aed',
    bg: '#EEEDFE',
    border: '#7c3aed30',
    status: 'pendiente',
    source: 'auto',
    desc: 'Cobertura curricular, resultados de evaluación, alertas de coherencia y propuestas de mejora.',
    roles: ['JEFATURA', 'ADMIN'],
    locked: true,
    items: [
      { label: 'Cobertura RA completada', value: '0% — en espera del desarrollo del curso', status: 'empty', source: 'auto' },
      { label: 'Alertas de coherencia', value: '2 activas (transversalidad)', status: 'warn', source: 'auto' },
      { label: 'Coherencia entre grupos', value: 'Pendiente validar', status: 'empty', source: 'auto' },
      { label: 'Resultados de evaluación', value: 'Disponible tras 1ª evaluación', status: 'empty', source: 'auto' },
      { label: 'Propuestas de mejora', value: 'Pendiente introducir', status: 'empty', source: 'manual' },
    ],
  },
];

// ─── META ─────────────────────────────────────────────────────────────────────
const STATUS_META: Record<BlockStatus, { label: string; color: string; bg: string; Icon: any }> = {
  completo:   { label: 'Completo',    color: '#27500A', bg: '#EAF3DE', Icon: CheckCircle },
  en_proceso: { label: 'En proceso',  color: '#0C447C', bg: '#E6F1FB', Icon: Clock },
  pendiente:  { label: 'Pendiente',   color: '#412402', bg: '#FAEEDA', Icon: AlertTriangle },
  bloqueado:  { label: 'Bloqueado',   color: '#501313', bg: '#FCEBEB', Icon: Lock },
};

const SOURCE_META: Record<DataSource, { label: string; color: string }> = {
  auto:      { label: 'Autogenerado', color: '#27500A' },
  onboarding:{ label: 'Del cuestionario inicial', color: '#0d6e6e' },
  manual:    { label: 'Introducción manual', color: '#b45309' },
  mixto:     { label: 'Mixto', color: '#0C447C' },
};

const ITEM_STATUS: Record<string, { dot: string }> = {
  ok:    { dot: '#22c55e' },
  warn:  { dot: '#f59e0b' },
  empty: { dot: '#d1d5db' },
};

// ─── COMPONENTE BLOQUE ────────────────────────────────────────────────────────
function ProgramacionBlock({
  block,
  isOpen,
  onToggle,
  userRole,
}: {
  block: Block;
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
}) {
  const Icon = block.icon;
  const statusMeta = STATUS_META[block.status];
  const StatusIcon = statusMeta.Icon;
  const sourceMeta = SOURCE_META[block.source];

  const canAccess = block.roles.includes(userRole);

  const warnCount = block.items.filter(i => i.status === 'warn').length;
  const emptyCount = block.items.filter(i => i.status === 'empty').length;
  const okCount = block.items.filter(i => i.status === 'ok').length;
  const pct = Math.round((okCount / block.items.length) * 100);

  return (
    <div className={`bg-white border rounded-3xl overflow-hidden transition-all duration-300 ${
      isOpen ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
    } ${!canAccess ? 'opacity-60' : ''}`}
      style={{ borderColor: isOpen ? block.color + '40' : '#f0eee8' }}
    >
      {/* ── Cabecera ── */}
      <button
        onClick={onToggle}
        disabled={!canAccess}
        className="w-full flex items-center gap-4 p-5 text-left group"
      >
        {/* Número + icono */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
            style={{ background: block.bg, color: block.color, border: `1.5px solid ${block.color}30` }}>
            {block.num}
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: block.bg }}>
            <Icon className="w-4 h-4" style={{ color: block.color }} />
          </div>
        </div>

        {/* Título y desc */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-[var(--ink)]">{block.title}</h3>
            {block.locked && <Lock className="w-3 h-3 text-[var(--ink3)]" />}
          </div>
          <p className="text-[11px] text-[var(--ink3)] mt-0.5 hidden md:block truncate">{block.desc}</p>
        </div>

        {/* Barra de progreso mini */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 w-28">
          <div className="flex-1 h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: block.color }} />
          </div>
          <span className="text-[10px] font-black text-[var(--ink3)] w-7 text-right">{pct}%</span>
        </div>

        {/* Estado */}
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black flex-shrink-0"
          style={{ background: statusMeta.bg, color: statusMeta.color }}>
          <StatusIcon className="w-3 h-3" />
          <span className="hidden sm:inline">{statusMeta.label}</span>
        </span>

        <ChevronDown className={`w-4 h-4 text-[var(--ink3)] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ── Cuerpo desplegable ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 border-t border-[#f0eee8]">
              {/* Metadatos */}
              <div className="flex flex-wrap gap-3 mb-5 pt-4">
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ background: block.bg, color: block.color }}>
                  <Zap className="w-3 h-3" />
                  {sourceMeta.label}
                </span>
                {warnCount > 0 && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
                    <AlertTriangle className="w-3 h-3" />
                    {warnCount} campos incompletos
                  </span>
                )}
                {emptyCount > 0 && (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full bg-gray-50 text-gray-500">
                    <Clock className="w-3 h-3" />
                    {emptyCount} pendientes
                  </span>
                )}
              </div>

              {/* Items */}
              <div className="space-y-0 border border-[#f0eee8] rounded-2xl overflow-hidden mb-5">
                {block.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-[#f0eee8] last:border-none hover:bg-[var(--bg1)] transition-colors">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: ITEM_STATUS[item.status || 'empty'].dot }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-[var(--ink3)] uppercase tracking-wider">{item.label}</span>
                      <p className="text-sm text-[var(--ink)] mt-0.5">{item.value || '—'}</p>
                    </div>
                    {item.source && (
                      <span className="text-[9px] font-bold uppercase tracking-wider flex-shrink-0 mt-1"
                        style={{ color: SOURCE_META[item.source].color }}>
                        {item.source === 'auto' ? '⚡ auto' : item.source === 'onboarding' ? '📋 onboarding' : item.source === 'manual' ? '✏️ manual' : '🔀 mixto'}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2">
                {!block.locked && (
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                    style={{ background: block.color }}>
                    <Edit3 className="w-3 h-3" /> Editar bloque
                  </button>
                )}
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg2)] text-[var(--ink3)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg1)] transition-all">
                  <Eye className="w-3 h-3" /> Vista previa
                </button>
                {block.locked && (
                  <span className="flex items-center gap-1.5 text-[10px] text-[var(--ink3)] px-3 py-2">
                    <Lock className="w-3 h-3" />
                    Se activa al inicio del curso
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ProgramacionVivaPage() {
  useAuthGuard(['PROFESOR', 'ADMIN', 'JEFATURA']);
  const [user, setUser] = useState<any>(null);
  const [openBlock, setOpenBlock] = useState<string | null>('datos-generales');

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const role = user?.role || 'PROFESOR';

  // Métricas globales
  const bloques = BLOCKS.filter(b => b.roles.includes(role));
  const completos = bloques.filter(b => b.status === 'completo').length;
  const enProceso = bloques.filter(b => b.status === 'en_proceso').length;
  const pendientes = bloques.filter(b => b.status === 'pendiente').length;
  const totalItems = bloques.reduce((a, b) => a + b.items.length, 0);
  const okItems = bloques.reduce((a, b) => a + b.items.filter(i => i.status === 'ok').length, 0);
  const globalPct = Math.round((okItems / totalItems) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Cabecera ── */}
        <div className="bg-[var(--ink)] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)]/10 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Documento vivo · 7 bloques</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-serif tracking-tight mb-2">
                  Programación<br /><span className="text-[var(--teal)] italic">Curso 2026-2027</span>
                </h1>
                <p className="text-sm text-white/50 leading-relaxed max-w-md">
                  Documento institucional generado desde los datos del sistema. Se actualiza en tiempo real a lo largo del curso.
                </p>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { val: `${globalPct}%`, label: 'Completado', color: 'var(--teal)' },
                  { val: completos, label: 'Bloques OK', color: '#22c55e' },
                  { val: enProceso, label: 'En proceso', color: '#60a5fa' },
                  { val: pendientes, label: 'Pendientes', color: '#f59e0b' },
                ].map((k, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-3 text-center border border-white/10">
                    <div className="text-2xl font-bold font-serif" style={{ color: k.color }}>{k.val}</div>
                    <div className="text-[9px] font-black uppercase tracking-wider text-white/30 mt-0.5">{k.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barra de progreso global */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Progreso global del documento</span>
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="text-green-400">{okItems} completados</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/40">{totalItems} total</span>
                </div>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${globalPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-[var(--teal)] rounded-full"
                />
              </div>
            </div>

            {/* Acciones globales */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 h-10 px-5 bg-[var(--teal)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-[var(--teal)]/20">
                <Download className="w-3.5 h-3.5" /> Exportar PDF
              </button>
              {role === 'JEFATURA' && (
                <button className="flex items-center gap-2 h-10 px-5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                  <Flag className="w-3.5 h-3.5" /> Publicar programación
                </button>
              )}
              <button className="flex items-center gap-2 h-10 px-5 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar datos
              </button>
            </div>
          </div>
        </div>

        {/* ── Leyenda de fuentes ── */}
        <div className="flex flex-wrap gap-3 px-1">
          {Object.entries(SOURCE_META).map(([key, m]) => (
            <div key={key} className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--ink3)]">
              <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              {m.label}
            </div>
          ))}
        </div>

        {/* ── Bloques ── */}
        <div className="space-y-3">
          {bloques.map(block => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: block.num * 0.06 }}
            >
              <ProgramacionBlock
                block={block}
                isOpen={openBlock === block.id}
                onToggle={() => setOpenBlock(openBlock === block.id ? null : block.id)}
                userRole={role}
              />
            </motion.div>
          ))}
        </div>

        {/* ── Panel de alertas activas ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-widest">Alertas de coherencia activas</h3>
            <span className="ml-auto px-2 py-0.5 bg-amber-200 text-amber-800 text-[9px] font-black rounded-full">2</span>
          </div>
          <div className="space-y-3">
            {[
              {
                sev: 'Alta',
                title: 'Igualdad sin cobertura en módulos ATZ y DDR',
                desc: 'La normativa exige tratamiento transversal de igualdad en todos los módulos. Ninguna UT lo recoge en 2 módulos.',
                link: '/dashboard/transversal',
              },
              {
                sev: 'Media',
                title: 'PRL sin cobertura en módulo DJK',
                desc: 'El módulo de Digitalización aplicada no ha registrado actividad de PRL. La normativa lo exige.',
                link: '/dashboard/transversal',
              },
            ].map((a, i) => (
              <div key={i} className="bg-white rounded-2xl border border-amber-100 p-4 flex items-start gap-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex-shrink-0 mt-0.5 ${
                  a.sev === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>{a.sev}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--ink)]">{a.title}</p>
                  <p className="text-xs text-[var(--ink3)] mt-0.5 leading-relaxed">{a.desc}</p>
                </div>
                <Link href={a.link} className="flex items-center gap-1 text-[10px] font-black text-[var(--teal)] hover:underline flex-shrink-0">
                  Ver <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Gemelo pedagógico (teaser) ── */}
        <div className="bg-gradient-to-br from-violet-900/90 to-[var(--ink)] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400">Próximamente</span>
            </div>
            <h3 className="text-2xl font-bold font-serif mb-2">Gemelo Pedagógico<br /><span className="text-violet-400 italic">del curso</span></h3>
            <p className="text-sm text-white/50 leading-relaxed max-w-xl mb-5">
              Representación en tiempo real del estado del ciclo: quiénes son los alumnos, qué currículo está activo, qué sesiones se han impartido, qué evidencias se han generado y qué dificultades aparecen.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Vista en tiempo real', 'Detección de desequilibrios', 'Seguimiento por alumno', 'Alertas automáticas'].map((f, i) => (
                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] text-white/60 font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
