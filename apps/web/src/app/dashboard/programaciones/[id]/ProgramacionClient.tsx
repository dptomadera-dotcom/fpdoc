'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import {
  ChevronLeft, CheckCircle, Clock, AlertCircle,
  Edit3, Download, Eye, ChevronRight, ChevronDown,
  BookOpen, FileText, Target, Users, Wrench,
  BarChart3, Heart, Layers, Calendar, Library,
  Shield, Globe, Lightbulb, Cpu, Flag, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// ─── TIPOS ───────────────────────────────────────────────────────────────────
type SectionStatus = 'auto' | 'mixto' | 'manual' | 'pendiente';

interface Section {
  num: number;
  title: string;
  subtitle?: string;
  status: SectionStatus;
  icon: any;
  items: string[];
  content?: string;
}

// ─── DATOS ÍNDICE 17 SECCIONES ───────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    num: 0,
    title: 'Portada',
    status: 'auto',
    icon: FileText,
    items: ['Datos del docente', 'Ciclo formativo y módulo profesional', 'Curso académico'],
    content: 'Generada automáticamente con los datos del sistema.',
  },
  {
    num: 1,
    title: 'Introducción',
    status: 'manual',
    icon: BookOpen,
    items: ['Justificación de la programación', 'Contextualización del centro', 'Características del alumnado', 'Entorno socioeconómico y profesional'],
    content: '',
  },
  {
    num: 2,
    title: 'Marco normativo',
    status: 'auto',
    icon: Shield,
    items: ['Legislación estatal y autonómica', 'Referencia al título y currículo', 'Relación con el Sistema de FP'],
    content: 'RD 1579/2011 · LOMLOE · LOOIFP · Orden autonómica vigente',
  },
  {
    num: 3,
    title: 'Perfil profesional del título',
    status: 'auto',
    icon: Users,
    items: ['Competencia general', 'Competencias profesionales, personales y sociales', 'Cualificaciones profesionales y unidades de competencia'],
    content: 'Extraído automáticamente del perfil del ciclo formativo.',
  },
  {
    num: 4,
    title: 'Objetivos',
    status: 'auto',
    icon: Target,
    items: ['Objetivos generales del ciclo', 'Objetivos del módulo', 'Resultados de aprendizaje (RA)'],
    content: '5 RA definidos · 35 criterios de evaluación · 4/5 asignados a UT.',
  },
  {
    num: 5,
    title: 'Competencias',
    status: 'auto',
    icon: Lightbulb,
    items: ['Competencia general del título', 'Relación con competencias clave (si procede)', 'Conexión RA ↔ competencias'],
    content: '',
  },
  {
    num: 6,
    title: 'Contenidos',
    status: 'mixto',
    icon: Layers,
    items: ['Bloques de contenidos', 'Secuenciación', 'Elementos transversales (digitalización, sostenibilidad, PRL…)'],
    content: '6 bloques de contenidos definidos · transversalidad parcialmente cubierta.',
  },
  {
    num: 7,
    title: 'Metodología',
    status: 'manual',
    icon: Wrench,
    items: ['Principios metodológicos (ABP, aprendizaje basado en retos…)', 'Estrategias didácticas', 'Organización (espacios, tiempos, agrupamientos)', 'Actividades de enseñanza-aprendizaje', 'Recursos y materiales'],
    content: '',
  },
  {
    num: 8,
    title: 'Evaluación',
    status: 'auto',
    icon: BarChart3,
    items: ['RA y criterios de evaluación', 'Instrumentos (rúbricas, pruebas, proyectos…)', 'Criterios de calificación', 'Recuperación', 'Evaluación continua', 'Evaluación de la práctica docente'],
    content: '5 RA · pesos definidos · suma = 100% ✓',
  },
  {
    num: 9,
    title: 'Atención a la diversidad',
    status: 'mixto',
    icon: Heart,
    items: ['Medidas ordinarias', 'Adaptaciones curriculares', 'Inclusión y atención al ACNEAE'],
    content: '',
  },
  {
    num: 10,
    title: 'Unidades de trabajo (UT)',
    status: 'auto',
    icon: Calendar,
    items: ['Temporalización', 'Secuencia de unidades', 'Desarrollo de cada UT: objetivos, actividades, evaluación'],
    content: '6 UT planificadas · 122 h · temporalización completa.',
  },
  {
    num: 11,
    title: 'Elementos transversales',
    status: 'auto',
    icon: Globe,
    items: ['Igualdad', 'Prevención de riesgos laborales (PRL)', 'Sostenibilidad', 'Competencia digital'],
    content: '⚠ Igualdad sin cobertura en 2 módulos · PRL: 4/5 módulos.',
  },
  {
    num: 12,
    title: 'Actividades complementarias y extraescolares',
    status: 'manual',
    icon: Flag,
    items: ['Visitas didácticas', 'Charlas de profesionales', 'Participación en proyectos externos'],
    content: '',
  },
  {
    num: 13,
    title: 'Acción tutorial',
    status: 'manual',
    icon: Users,
    items: ['Seguimiento del alumnado', 'Coordinación con equipo docente y familias'],
    content: '',
  },
  {
    num: 14,
    title: 'Recursos didácticos',
    status: 'auto',
    icon: Cpu,
    items: ['Materiales', 'Herramientas digitales', 'Talleres/equipamiento'],
    content: 'Generado desde el equipamiento registrado en el sistema.',
  },
  {
    num: 15,
    title: 'Temporalización general',
    status: 'auto',
    icon: Calendar,
    items: ['Distribución trimestral', 'Calendario de evaluaciones', 'Períodos FCT'],
    content: '122 h totales · 3 trimestres · FCT: 2º trimestre.',
  },
  {
    num: 16,
    title: 'Conclusión',
    status: 'manual',
    icon: FileText,
    items: ['Reflexión sobre la programación', 'Previsiones de mejora'],
    content: '',
  },
  {
    num: 17,
    title: 'Bibliografía y webgrafía',
    status: 'manual',
    icon: Library,
    items: ['Referencias normativas', 'Bibliografía técnica', 'Recursos web y digitales'],
    content: '',
  },
];

const STATUS_META: Record<SectionStatus, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  auto: { label: 'Autogenerado', color: '#27500A', bg: '#EAF3DE', border: '#C0DD97', Icon: CheckCircle },
  mixto: { label: 'Mixto', color: '#0C447C', bg: '#E6F1FB', border: '#B5D4F4', Icon: Edit3 },
  manual: { label: 'Manual', color: '#412402', bg: '#FAEEDA', border: '#FAC775', Icon: AlertCircle },
  pendiente: { label: 'Pendiente', color: '#501313', bg: '#FCEBEB', border: '#F09595', Icon: Clock },
};

// ─── COMPONENTE SECCIÓN ───────────────────────────────────────────────────────
function SectionRow({ section, isOpen, onToggle }: { section: Section; isOpen: boolean; onToggle: () => void }) {
  const Icon = section.icon;
  const meta = STATUS_META[section.status];
  const StatusIcon = meta.Icon;

  return (
    <div className={`border rounded-2xl transition-all overflow-hidden ${isOpen ? 'border-[var(--teal)]/30 shadow-sm' : 'border-[#f0eee8]'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--bg1)] transition-colors"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[var(--bg2)] text-[var(--ink3)] text-xs font-black flex-shrink-0">
          {section.num}
        </div>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon className="w-4 h-4 text-[var(--ink3)] flex-shrink-0" />
          <span className="text-sm font-bold text-[var(--ink)] truncate">{section.title}</span>
        </div>
        <span
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black flex-shrink-0"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
        >
          <StatusIcon className="w-3 h-3" />
          {meta.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--ink3)] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-[#f0eee8]">
              {section.content && (
                <div className="mb-4 p-3 bg-[var(--bg1)] rounded-xl border border-[#f0eee8]">
                  <p className="text-xs text-[var(--ink3)] leading-relaxed">{section.content}</p>
                </div>
              )}
              <div className="space-y-1.5 mb-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[var(--ink3)]">
                    <div className="w-1 h-1 rounded-full bg-[var(--ink3)] mt-1.5 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              {section.status === 'manual' || section.status === 'mixto' ? (
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--ink)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                  <Edit3 className="w-3 h-3" /> Editar sección
                </button>
              ) : (
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg2)] text-[var(--ink3)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg1)] transition-all">
                  <Eye className="w-3 h-3" /> Ver contenido generado
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function ProgramacionClient({ id }: { id: string }) {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'indice' | 'ut' | 'ra'>('indice');

  const autoCount = SECTIONS.filter(s => s.status === 'auto').length;
  const mixtoCount = SECTIONS.filter(s => s.status === 'mixto').length;
  const manualCount = SECTIONS.filter(s => s.status === 'manual').length;
  const totalSections = SECTIONS.length;
  const donePct = Math.round(((autoCount + mixtoCount * 0.5) / totalSections) * 100);

  // Mock UTs
  const mockUTs = [
    { num: 1, title: 'Conceptos Fundamentales', hours: 12, trim: 1, status: 'completado', ra: 'RA 1a, 1b' },
    { num: 2, title: 'Hardware y Virtualización', hours: 24, trim: 1, status: 'activo', ra: 'RA 1c, 1d' },
    { num: 3, title: 'Sistemas Operativos Multiusuario', hours: 30, trim: 2, status: 'pendiente', ra: 'RA 2a–2d' },
    { num: 4, title: 'Redes y conectividad', hours: 20, trim: 2, status: 'pendiente', ra: 'RA 3a–3c' },
    { num: 5, title: 'Seguridad y PRL', hours: 18, trim: 3, status: 'pendiente', ra: 'RA 4a, 4b' },
    { num: 6, title: 'Mantenimiento preventivo', hours: 18, trim: 3, status: 'pendiente', ra: 'RA 5a–5c' },
  ];

  // Mock RA
  const mockRA = [
    { num: 1, desc: 'Organiza líneas de producción automatizada', ce: 6, cubiertos: 4, pct: 67 },
    { num: 2, desc: 'Programación CNC', ce: 8, cubiertos: 2, pct: 25 },
    { num: 3, desc: 'Fabricación asistida CAM', ce: 7, cubiertos: 0, pct: 0 },
    { num: 4, desc: 'Gestión de fabricación automatizada', ce: 8, cubiertos: 0, pct: 0 },
    { num: 5, desc: 'Mantenimiento de equipos', ce: 6, cubiertos: 0, pct: 0 },
  ];

  const STATUS_UT: Record<string, { color: string; bg: string }> = {
    completado: { color: '#27500A', bg: '#EAF3DE' },
    activo: { color: '#0C447C', bg: '#E6F1FB' },
    pendiente: { color: '#412402', bg: '#FAEEDA' },
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* ── Cabecera ── */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard/programaciones" className="text-[var(--ink3)] hover:text-[var(--ink)] transition-colors flex items-center gap-1 text-sm">
              <ChevronLeft className="w-4 h-4" /> Programaciones
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--ink3)]" />
            <span className="text-sm font-bold text-[var(--ink)]">Sistemas Informáticos 2026-2027</span>
          </div>

          <div className="bg-white border border-[#f0eee8] rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--teal)]">SMIX · 2026-2027</span>
                <span className="px-2 py-0.5 bg-[var(--teal2)] text-[var(--teal)] text-[9px] font-black rounded-full uppercase">En revisión</span>
              </div>
              <h1 className="text-2xl font-bold font-serif text-[var(--ink)]">Sistemas Informáticos</h1>
              <p className="text-sm text-[var(--ink3)] mt-1">1º CFGM Informática · J. García · 122 h</p>
            </div>

            <div className="flex items-center gap-6">
              {/* Progreso global */}
              <div className="text-center">
                <div className="text-3xl font-bold font-serif text-[var(--teal)]">{donePct}%</div>
                <div className="text-[9px] font-black uppercase text-[var(--ink3)] tracking-widest">Completado</div>
              </div>

              {/* Estadísticas secciones */}
              <div className="space-y-1 hidden md:block text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                  <span className="text-[var(--ink3)]">{autoCount} secciones autogeneradas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[var(--ink3)]">{mixtoCount} mixtas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[var(--ink3)]">{manualCount} requieren redacción</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                <button className="h-10 px-5 bg-[var(--ink)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all">
                  <Download className="w-3.5 h-3.5" /> Exportar PDF
                </button>
                <button className="h-10 px-5 bg-[var(--bg2)] text-[var(--ink)] rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[var(--bg1)] transition-all">
                  Enviar a revisión <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* ── Tabs de vista ── */}
        <div className="flex gap-2 mb-6 border-b border-[#f0eee8] pb-4">
          {[
            { key: 'indice', label: '📘 Índice 17 secciones' },
            { key: 'ut', label: '📅 Unidades de trabajo' },
            { key: 'ra', label: '🎯 RA y criterios' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key as any)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === tab.key
                  ? 'bg-[var(--ink)] text-white'
                  : 'bg-white border border-[#f0eee8] text-[var(--ink3)] hover:bg-[var(--bg1)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── VISTA: ÍNDICE 17 SECCIONES ── */}
        {activeView === 'indice' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[var(--ink3)]">
                Haz clic en cada sección para ver su contenido o editarla. Las secciones <span className="font-bold text-green-700">autogeneradas</span> se construyen desde los datos introducidos.
              </p>
              <div className="flex items-center gap-2 text-[10px]">
                {Object.entries(STATUS_META).map(([key, m]) => key !== 'pendiente' && (
                  <span key={key} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: m.bg, color: m.color }}>
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
            {SECTIONS.map(section => (
              <SectionRow
                key={section.num}
                section={section}
                isOpen={openSection === section.num}
                onToggle={() => setOpenSection(openSection === section.num ? null : section.num)}
              />
            ))}
          </div>
        )}

        {/* ── VISTA: UNIDADES DE TRABAJO ── */}
        {activeView === 'ut' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-[var(--ink3)]">6 UT planificadas · 122 h totales · Distribución por trimestres</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--teal)] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                + Nueva UT
              </button>
            </div>

            {[1, 2, 3].map(trim => {
              const uts = mockUTs.filter(ut => ut.trim === trim);
              return (
                <div key={trim}>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ink3)] mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[var(--bg2)] flex items-center justify-center text-[8px] font-black">{trim}</div>
                    Trimestre {trim}
                  </h3>
                  <div className="space-y-2">
                    {uts.map(ut => {
                      const s = STATUS_UT[ut.status];
                      return (
                        <div key={ut.num} className="bg-white border border-[#f0eee8] rounded-2xl p-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-[var(--bg2)] rounded-xl flex items-center justify-center text-sm font-black text-[var(--ink3)] flex-shrink-0">
                            {ut.num < 10 ? `0${ut.num}` : ut.num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[var(--ink)] truncate">UT {ut.num}: {ut.title}</p>
                            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[var(--ink3)]">
                              <span>{ut.hours} h</span>
                              <span className="opacity-40">•</span>
                              <span>{ut.ra}</span>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black flex-shrink-0 capitalize" style={{ background: s.bg, color: s.color }}>
                            {ut.status}
                          </span>
                          <button className="w-8 h-8 bg-[var(--bg1)] rounded-xl flex items-center justify-center hover:bg-[var(--bg2)] transition-colors flex-shrink-0">
                            <Edit3 className="w-3.5 h-3.5 text-[var(--ink3)]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VISTA: RA Y CRITERIOS ── */}
        {activeView === 'ra' && (
          <div className="space-y-4">
            <p className="text-xs text-[var(--ink3)] mb-4">
              Estado de cobertura de los Resultados de Aprendizaje. Los criterios no asignados a ninguna UT bloquean el envío a revisión.
            </p>
            {mockRA.map(ra => (
              <div key={ra.num} className="bg-white border border-[#f0eee8] rounded-2xl p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-[var(--bg2)] rounded-xl flex items-center justify-center text-sm font-black text-[var(--ink3)] flex-shrink-0">
                    RA{ra.num}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[var(--ink)]">{ra.desc}</p>
                    <p className="text-[11px] text-[var(--ink3)] mt-0.5">{ra.ce} criterios de evaluación</p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-black flex-shrink-0"
                    style={{
                      background: ra.pct >= 80 ? '#EAF3DE' : ra.pct >= 40 ? '#FAEEDA' : '#FCEBEB',
                      color: ra.pct >= 80 ? '#27500A' : ra.pct >= 40 ? '#412402' : '#501313',
                    }}
                  >
                    {ra.cubiertos}/{ra.ce} CE
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--bg2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${ra.pct}%`,
                        background: ra.pct >= 80 ? '#639922' : ra.pct >= 40 ? '#d97706' : '#dc2626',
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[var(--ink3)] min-w-[36px] text-right">{ra.pct}%</span>
                </div>
                {ra.pct < 100 && (
                  <p className="text-[10px] text-[var(--ink3)] mt-2">
                    {ra.ce - ra.cubiertos} criterio{ra.ce - ra.cubiertos !== 1 ? 's' : ''} sin asignar a ninguna UT.
                  </p>
                )}
              </div>
            ))}

            <div className="bg-[var(--bg1)] border border-[#f0eee8] rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-[var(--amber)] flex-shrink-0" />
              <p className="text-xs text-[var(--ink3)]">
                <span className="font-bold text-[var(--ink)]">Atención:</span> Los criterios sin UT asignada impiden enviar la programación a revisión. Asígnalos desde la vista de Unidades de trabajo.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
