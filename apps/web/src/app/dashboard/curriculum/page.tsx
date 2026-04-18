'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, BrainCircuit, CheckCircle2, XCircle,
  AlertTriangle, ChevronDown, ChevronUp, Loader2,
  Lightbulb, BarChart3, ArrowRight, Upload,
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { aiService, CurriculumReviewResult } from '@/services/ai.service';
import { cn } from '@/lib/utils';

function CurriculumReviewPanel() {
  const [moduleId, setModuleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CurriculumReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<'gaps' | 'suggestions' | null>('gaps');

  const handleReview = async () => {
    if (!moduleId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await aiService.reviewCurriculum({ moduleId, route: '/dashboard/curriculum' });
      setResult(data);
    } catch {
      setError('No se pudo conectar con el revisor curricular. Comprueba la conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#f0eee8] rounded-[40px] p-8 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-[var(--ink)] rounded-2xl flex items-center justify-center shadow-lg">
          <BrainCircuit className="w-5 h-5 text-[var(--teal)]" />
        </div>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">
            Revisor Curricular IA
          </h3>
          <p className="text-[10px] text-[var(--ink3)] mt-0.5">
            Analiza la cobertura de RA/CE en los proyectos del módulo
          </p>
        </div>
      </div>

      {!result && (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest mb-2">
              ID del Módulo
            </label>
            <input
              type="text"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              placeholder="ej. cm7abc123..."
              className="w-full bg-[var(--bg1)] border border-transparent rounded-2xl px-5 py-3.5 text-[13px] font-medium text-[var(--ink)] placeholder-[var(--ink3)]/40 focus:bg-white focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/5 outline-none transition-all"
            />
          </div>
          <button
            onClick={handleReview}
            disabled={!moduleId.trim() || loading}
            className="w-full h-12 bg-[var(--ink)] text-white rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando con Claude Opus...
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                Revisar cobertura curricular
              </>
            )}
          </button>
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-xs font-bold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Summary + coverage */}
            <div className="p-5 bg-[var(--bg1)] rounded-2xl border border-[#f0eee8]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest">
                  Cobertura global
                </span>
                <span
                  className={cn(
                    'text-lg font-black',
                    result.coveragePercent >= 80
                      ? 'text-[var(--teal)]'
                      : result.coveragePercent >= 50
                      ? 'text-[var(--amber)]'
                      : 'text-red-500',
                  )}
                >
                  {result.coveragePercent}%
                </span>
              </div>
              <div className="h-2 bg-[#f0eee8] rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.coveragePercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full',
                    result.coveragePercent >= 80
                      ? 'bg-[var(--teal)]'
                      : result.coveragePercent >= 50
                      ? 'bg-[var(--amber)]'
                      : 'bg-red-400',
                  )}
                />
              </div>
              <p className="text-[11px] text-[var(--ink2)] leading-relaxed">{result.summary}</p>
            </div>

            {/* Covered / uncovered RAs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-[var(--teal)]/5 border border-[var(--teal)]/15 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[var(--teal)]" />
                  <span className="text-[9px] font-black text-[var(--teal)] uppercase tracking-widest">
                    Cubiertos ({result.coveredRAs.length})
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {result.coveredRAs.map((ra) => (
                    <li key={ra.code} className="text-[10px] font-bold text-[var(--ink2)] flex items-start gap-1.5">
                      <span className="text-[var(--teal)] shrink-0">{ra.code}</span>
                      <span className="line-clamp-1 opacity-70">{ra.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">
                    Sin cubrir ({result.uncoveredRAs.length})
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {result.uncoveredRAs.map((ra) => (
                    <li key={ra.code} className="text-[10px] font-bold text-[var(--ink2)] flex items-start gap-1.5">
                      <span className="text-red-400 shrink-0">{ra.code}</span>
                      <span className="line-clamp-1 opacity-70">{ra.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <div className="border border-[#f0eee8] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === 'gaps' ? null : 'gaps')}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--bg1)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[var(--amber)]" />
                    <span className="text-[10px] font-black text-[var(--ink)] uppercase tracking-widest">
                      Brechas detectadas ({result.gaps.length})
                    </span>
                  </div>
                  {expanded === 'gaps' ? (
                    <ChevronUp className="w-4 h-4 text-[var(--ink3)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ink3)]" />
                  )}
                </button>
                <AnimatePresence>
                  {expanded === 'gaps' && (
                    <motion.ul
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      {result.gaps.map((gap, i) => (
                        <li
                          key={i}
                          className="px-5 py-3 text-[11px] text-[var(--ink2)] border-t border-[#f0eee8] leading-relaxed"
                        >
                          {gap}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="border border-[#f0eee8] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === 'suggestions' ? null : 'suggestions')}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--bg1)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--teal)]" />
                    <span className="text-[10px] font-black text-[var(--ink)] uppercase tracking-widest">
                      Sugerencias IA ({result.suggestions.length})
                    </span>
                  </div>
                  {expanded === 'suggestions' ? (
                    <ChevronUp className="w-4 h-4 text-[var(--ink3)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ink3)]" />
                  )}
                </button>
                <AnimatePresence>
                  {expanded === 'suggestions' && (
                    <motion.ul
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      {result.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="px-5 py-3 text-[11px] text-[var(--ink2)] border-t border-[#f0eee8] leading-relaxed flex gap-3"
                        >
                          <span className="text-[var(--teal)] font-black shrink-0">{i + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={() => { setResult(null); setModuleId(''); }}
              className="w-full h-10 border border-dashed border-[#f0eee8] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all"
            >
              Nuevo análisis
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CurriculumPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 lg:p-0">
        <header>
          <div className="text-[10px] text-[var(--teal)] font-bold uppercase tracking-widest mb-1">
            Gestión Curricular
          </div>
          <h1 className="text-2xl font-bold font-serif text-[var(--ink)]">Currículo del Módulo</h1>
          <p className="text-sm text-[var(--ink3)] mt-1">
            Importa y revisa la cobertura de Resultados de Aprendizaje y Criterios de Evaluación.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="lg:col-span-1 space-y-4">
            <Link
              href="/dashboard/curriculum/import"
              className="flex items-center gap-4 bg-white border border-[#f0eee8] rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 bg-[var(--bg1)] rounded-2xl flex items-center justify-center group-hover:bg-[var(--teal)] transition-colors">
                <Upload className="w-5 h-5 text-[var(--ink3)] group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--teal)] transition-colors">
                  Importar programación
                </p>
                <p className="text-[10px] text-[var(--ink3)]">Desde PDF del BOE o guía departamental</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--ink3)] group-hover:text-[var(--teal)] transition-colors" />
            </Link>

            <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--ink)] text-white rounded-[28px] p-6 shadow-xl">
              <BarChart3 className="w-8 h-8 text-[var(--teal2)] mb-3" />
              <h4 className="text-base font-bold font-serif mb-1">Cobertura en tiempo real</h4>
              <p className="text-[10px] text-white/50 leading-relaxed">
                El revisor IA analiza qué RA y CE están cubiertos por los proyectos activos del módulo.
              </p>
            </div>
          </div>

          {/* Review panel */}
          <div className="lg:col-span-2">
            <CurriculumReviewPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
