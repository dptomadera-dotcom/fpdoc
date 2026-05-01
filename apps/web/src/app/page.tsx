'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { projectsService, Project } from '@/services/projects.service';
import {
  LayoutDashboard, FileText, Cpu, ExternalLink,
  ChevronRight, Briefcase, Plus, Clock,
  AlertCircle, Zap, Shield, Sparkles,
  ArrowRight, Globe, Layers, BarChart3,
  BookOpen, Target, Users, GraduationCap,
  CheckCircle, Award, Workflow, FileSearch,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PWAInstallButton from '@/components/PWAInstallButton';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<number | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      projectsService.getProjects()
        .then(data => { setProjects(data); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // ─── VISTA AUTENTICADA ───────────────────────────────────────────────────
  if (user) {
    const roleName = user.role === 'JEFATURA' ? 'Jefe de Dpto.' : user.role === 'PROFESOR' ? 'Docente' : 'Alumno/a';
    return (
      <div className="min-h-screen bg-[var(--bg1)] text-[var(--ink)]">
        <Navbar />
        <motion.div
          initial="hidden" animate="visible" variants={containerVariants}
          className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 pt-32 md:pt-40"
        >
          <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--ink3)]">Workspace Activo • FPdoc 3.0</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tighter text-[var(--ink)]">
                Hola, <span className="text-[var(--teal)] underline decoration-wavy decoration-1 underline-offset-8 italic">{user.email?.split('@')[0]}</span>
              </h1>
              <p className="text-[var(--ink3)] mt-4 max-w-xl text-sm leading-relaxed">
                Tu centro neurálgico para la coordinación curricular y seguimiento de competencias transversales.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="h-14 px-8 bg-[var(--ink)] text-white rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[var(--ink)]/20">
                Ir al Dashboard <LayoutDashboard className="w-4 h-4 text-[var(--teal2)]" />
              </Link>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-[var(--ink2)]">
                  <Briefcase className="w-4 h-4 text-[var(--teal)]" />Actividad Reciente
                </h2>
                <Link href="/projects" className="text-[10px] font-bold text-[var(--teal)] hover:underline flex items-center gap-1">Ver todos <ChevronRight className="w-3 h-3" /></Link>
              </motion.div>

              {loading ? (
                <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-28 bg-[var(--bg2)] border border-[var(--border)] rounded-3xl animate-pulse" />)}</div>
              ) : projects.length > 0 ? (
                <motion.div variants={itemVariants} className="space-y-4">
                  {projects.slice(0, 3).map(project => (
                    <div key={project.id} className="group bg-[var(--bg2)] border border-[var(--border)] rounded-[32px] p-6 hover:shadow-xl transition-all duration-500 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[var(--bg1)] rounded-2xl flex items-center justify-center text-[var(--teal)] group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold font-serif text-[var(--ink)]">{project.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[10px] font-black uppercase text-[var(--ink3)]">{project.status}</span>
                            <span className="w-1 h-1 rounded-full bg-[var(--bg2)]" />
                            <span className="text-[10px] font-bold text-[var(--ink3)]">{project.progress}% Completado</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/projects/${project.id}`} className="w-10 h-10 bg-[var(--bg1)] rounded-full flex items-center justify-center group-hover:bg-[var(--teal)] group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} className="bg-[var(--bg2)] border-2 border-dashed border-[var(--border)] rounded-[40px] p-16 text-center">
                  <div className="w-20 h-20 bg-[var(--bg1)] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[var(--teal)]">
                    <Layers className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-2">No hay proyectos activos</h3>
                  <p className="text-xs text-[var(--ink3)] mb-8 max-w-xs mx-auto">Comienza importando un PDF curricular para activar tu primer módulo.</p>
                  <Link href="/projects?create=true" className="inline-flex h-12 px-8 bg-[var(--teal)] text-white font-black rounded-xl items-center gap-2 hover:scale-105 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-[var(--teal)]/20">
                    NUEVO PROYECTO <Plus className="w-4 h-4" />
                  </Link>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="fp-card bg-[var(--ink)] text-white border-none shadow-2xl">
                  <Zap className="w-8 h-8 text-[var(--amber)] mb-4" />
                  <h3 className="font-bold mb-1">Módulos Inteligentes</h3>
                  <p className="text-[10px] text-white/50 leading-relaxed">Tu currículo está siendo analizado por nuestro motor de IA para detectar brechas.</p>
                </div>
                <div className="fp-card bg-[var(--bg2)] border border-[var(--border)]">
                  <BarChart3 className="w-8 h-8 text-[var(--teal)] mb-4" />
                  <h3 className="font-bold mb-1">Impacto Transversal</h3>
                  <p className="text-[10px] text-[var(--ink3)] leading-relaxed">Progreso medio de vinculación de competencias: 0% detectado en el ciclo.</p>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <motion.div variants={itemVariants} className="bg-[var(--bg2)] backdrop-blur-xl border border-[var(--border)] rounded-[40px] p-8">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--teal)]" />Estado de Cuenta
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--bg1)] rounded-2xl shadow-sm flex items-center justify-center font-bold text-[var(--ink)]">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold truncate max-w-[150px]">{user.email}</div>
                      <div className="text-[9px] font-black uppercase text-[var(--teal)] tracking-tighter">{roleName}</div>
                    </div>
                  </div>
                  <div className="h-[1px] bg-[var(--border)]" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--ink3)]">Espacio Cloud</span>
                      <span className="font-bold">12 / 100 MB</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg2)] rounded-full overflow-hidden">
                      <div className="w-[12%] h-full bg-[var(--ink)]" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-[var(--teal)] to-[var(--ink)] rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                  <Globe className="w-10 h-10 text-[var(--teal2)] mb-4 group-hover:rotate-12 transition-transform" />
                  <h3 className="text-xl font-bold font-serif mb-2">Soporte Multicentro</h3>
                  <p className="text-[11px] text-white/60 leading-relaxed mb-6">¿Gestionas varios ciclos o centros? Activa la vista de Red Global en Ajustes.</p>
                  <Link href="/dashboard/settings" className="text-[10px] font-black uppercase tracking-widest text-[var(--teal2)] hover:text-white transition-colors flex items-center gap-1">
                    Configurar <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
              </motion.div>

              <motion.div variants={itemVariants} className="text-center px-4">
                <PWAInstallButton />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── PORTADA PARA USUARIOS NO AUTENTICADOS ──────────────────────────────
  const roles = [
    {
      key: 'alumno',
      icon: GraduationCap,
      color: '#0d6e6e',
      bg: 'from-teal-600 to-teal-800',
      label: 'Alumnado',
      sub: 'Acceso al itinerario formativo',
      desc: 'Consulta tus programaciones, seguimiento de prácticas FCT, rúbricas de evaluación y calendarios de módulos.',
      features: ['Consulta de programaciones y actividades', 'Itinerario personal para la empleabilidad', 'Registro y seguimiento de prácticas FCT', 'Acceso a rúbricas y criterios de evaluación'],
    },
    {
      key: 'docente',
      icon: BookOpen,
      color: '#7c3aed',
      bg: 'from-violet-600 to-purple-800',
      label: 'Profesorado',
      sub: 'Gestión curricular y RA',
      desc: 'Diseña y registra tus programaciones: RA, criterios de evaluación, unidades de trabajo y metodología.',
      features: ['RA y criterios de evaluación del módulo', 'Diseño de unidades de trabajo (UT)', 'Instrumentos de evaluación y rúbricas', 'IA Docente para análisis curricular'],
    },
    {
      key: 'jefe',
      icon: ShieldCheck,
      color: '#b45309',
      bg: 'from-amber-600 to-orange-700',
      label: 'Jefe de Dpto.',
      sub: 'Coordinación y validación',
      desc: 'Supervisa y valida todas las programaciones, gestiona proyectos intermodulares y publica la Programación Didáctica oficial.',
      features: ['Panel de supervisión del ciclo completo', 'Validación y aprobación de programaciones', 'Mapa de transversalidad (PRL, digitalización…)', 'Publicación de la Programación Didáctica PDF'],
    },
  ];

  const modules = [
    { icon: BookOpen, label: 'Gestión Curricular', desc: 'RA · criterios · unidades de trabajo · temporalización', color: '#E6F1FB', border: '#378ADD', text: '#0C447C' },
    { icon: Target, label: 'Transversalidad', desc: 'PRL · digitalización · sostenibilidad · igualdad', color: '#EAF3DE', border: '#639922', text: '#27500A' },
    { icon: Workflow, label: 'Coordinación Dpto.', desc: 'Panel supervisor · validación · proyectos intermod.', color: '#FAEEDA', border: '#d97706', text: '#412402' },
    { icon: FileSearch, label: 'Programación Didáctica', desc: 'Documento vivo · 17 secciones · PDF exportable', color: '#EEEDFE', border: '#7F77DD', text: '#3C3489' },
  ];

  return (
    <div className="min-h-screen bg-[var(--ink)] text-white overflow-x-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-[var(--teal)]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-violet-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--bg2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-5xl w-full"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
            <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">Ecosistema Educativo Inteligente · FP España</span>
          </div>

          {/* Título */}
          <h1 className="text-7xl md:text-[130px] font-bold font-serif text-white tracking-tighter leading-[0.85] mb-8">
            FP<span className="text-[var(--teal)] italic">doc</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/50 mb-4 font-medium leading-relaxed">
            La plataforma integral para la <span className="text-white font-bold">gestión de programaciones didácticas</span>, transversalidad curricular y evaluación por competencias en Formación Profesional.
          </p>
          <p className="text-sm text-white/30 mb-12">
            Diseñada para el ciclo completo: alumnado · profesorado · jefatura de departamento.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/register" className="h-16 px-12 bg-[var(--teal)] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-[var(--teal)]/30 active:scale-95 flex items-center justify-center gap-2">
              COMENZAR GRATIS <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="h-16 px-12 bg-white/5 backdrop-blur-md text-white border border-white/10 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-2">
              Iniciar Sesión <ExternalLink className="w-4 h-4 text-[var(--teal)] opacity-60" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            {[
              { label: 'Despliegue', val: 'CLOUD' },
              { label: 'Inteligencia', val: 'IA-Ready' },
              { label: 'Seguridad', val: 'SB-Auth' },
              { label: 'Formato', val: 'PWA' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="flex flex-col gap-1">
                <span className="text-2xl font-bold font-serif text-white">{s.val}</span>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-white/20"
        >
          <span className="text-[9px] font-black uppercase tracking-widest">Explorar</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── PERFILES / ROLES ── */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--teal)] mb-4 block">Perfiles de usuario</span>
            <h2 className="text-4xl md:text-6xl font-bold font-serif tracking-tighter text-white">Diseñado para<br /><span className="text-white/40">cada rol del ciclo</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, i) => {
              const Icon = role.icon;
              const isActive = activeRole === i;
              return (
                <motion.div
                  key={role.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  onClick={() => setActiveRole(isActive ? null : i)}
                  className="group cursor-pointer"
                >
                  <div className={`relative overflow-hidden rounded-[32px] border transition-all duration-500 ${isActive ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10'}`}>
                    {/* Header */}
                    <div className={`p-8 pb-6 bg-gradient-to-br ${role.bg} relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-white">{role.label}</h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mt-1">{role.sub}</p>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-8 pt-6">
                      <p className="text-sm text-white/50 leading-relaxed mb-6">{role.desc}</p>
                      <ul className="space-y-3">
                        {role.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-3 text-[12px] text-white/60">
                            <CheckCircle className="w-4 h-4 text-[var(--teal)] mt-0.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Link
                          href="/login"
                          onClick={e => e.stopPropagation()}
                          className="w-full h-11 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"
                        >
                          Acceder como {role.label} <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MÓDULOS FUNCIONALES ── */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400 mb-4 block">Módulos del sistema</span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter">Todo integrado en<br /><span className="text-white/40">un solo ecosistema</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: mod.color, border: `1.5px solid ${mod.border}` }}>
                    <Icon className="w-6 h-6" style={{ color: mod.text }} />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mb-2">{mod.label}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{mod.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Bloque de programación didáctica */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-5 bg-gradient-to-r from-[var(--teal)]/20 to-violet-900/20 border border-[var(--teal)]/20 rounded-3xl p-8 flex flex-col md:flex-row md:items-center gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-[var(--teal)]" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--teal)]">Salida del sistema</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-white">Programación Didáctica 2026-2027</h3>
              <p className="text-sm text-white/40 mt-2 max-w-xl">Documento vivo con las 17 secciones normativas. Actualización continua con trazabilidad de cambios · exportación a PDF para inspección educativa.</p>
            </div>
            <div className="flex flex-col gap-3 text-xs text-white/50 min-w-[180px]">
              {['10 secciones autogeneradas', '2 secciones mixtas', '5 secciones manuales', 'Memoria fin de curso auto'].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--teal)] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold font-serif tracking-tighter mb-6 text-white">
              ¿Listo para<br /><span className="text-[var(--teal)] italic">empezar?</span>
            </h2>
            <p className="text-white/40 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Únete a los departamentos de FP que ya gestionan su documentación curricular con inteligencia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="h-16 px-14 bg-[var(--teal)] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-[var(--teal)]/30 flex items-center gap-2">
                CREAR CUENTA GRATIS <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="h-16 px-12 text-white/60 hover:text-white font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-colors">
                Ya tengo cuenta <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--teal)] to-[var(--teal3)] rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold font-serif text-white">FP<span className="text-[var(--teal)] italic">doc</span></span>
            <span className="text-xs text-white/20">v3.0</span>
          </div>
          <p className="text-[11px] text-white/20 text-center">
            Plataforma de gestión curricular para Formación Profesional · España · LOMLOE/LOOIFP
          </p>
          <div className="flex items-center gap-4 text-[11px] text-white/30 font-bold uppercase tracking-widest">
            <Link href="/login" className="hover:text-white transition-colors">Acceso</Link>
            <Link href="/register" className="hover:text-white transition-colors">Registro</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
