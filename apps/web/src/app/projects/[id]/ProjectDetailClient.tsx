'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Plus, 
  Layout, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar,
  Users,
  BookOpen,
  FileIcon,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  Activity,
  ClipboardList,
  Target,
  Database
} from 'lucide-react';
import { projectsService, Project, Phase, TaskStatus } from '@/services/projects.service';
import { curriculumService, LearningOutcome, EvaluationCriterion } from '@/services/curriculum.service';
import { monitoringService } from '@/services/monitoring.service';
import { planningService, Session as ProjectSession } from '@/services/planning.service';
import { aiService } from '@/services/ai.service';
import { EvidenceModal } from '@/components/EvidenceModal';
import { GradingModal } from '@/components/GradingModal';
import ProjectStats from '@/components/ProjectStats';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'curriculum' | 'monitoring' | 'calendar' | 'stats'>('overview');
  
  // Session/Planning State
  const [sessions, setSessions] = useState<ProjectSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  
  // Evidence Upload Modal State
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState<{id: string, title: string, curriculumLinks: any[]} | null>(null);

  // Evidence review state
  const [evidences, setEvidences] = useState<any[]>([]);
  const [evidencesLoading, setEvidencesLoading] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'monitoring') {
      fetchProjectEvidences();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'calendar') {
      fetchSessions();
    }
  }, [activeTab]);

  const fetchSessions = async () => {
    try {
      setSessionsLoading(true);
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const end = new Date();
      end.setMonth(end.getMonth() + 2);
      
      const data = await planningService.getSessions(projectId);
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (!project) return;
    try {
      const newSession = await planningService.createSession({
        projectId,
        title: 'Sesión de Trabajo Presencial',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '11:00'
      });
      setSessions([...sessions, newSession]);
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  const fetchProjectEvidences = async () => {
    try {
      setEvidencesLoading(true);
      const allTasks = project?.phases?.flatMap(p => p.tasks) || [];
      const evidencePromises = allTasks.map(t => monitoringService.getTaskEvidences(t.id));
      const results = await Promise.all(evidencePromises);
      setEvidences(results.flat());
    } catch (error) {
      console.error('Error fetching evidences:', error);
    } finally {
      setEvidencesLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectsService.getProject(projectId);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTasks = project?.phases?.flatMap(p => p.tasks) || [];
  const team = (project as any)?.team || [
    { name: 'Prof. Garcia', role: 'Coordinador Técnico', avatar: 'https://i.pravatar.cc/150?u=ga' },
    { name: 'Ana Belén', role: 'Especialista Sectorial', avatar: 'https://i.pravatar.cc/150?u=ab' },
    { name: 'Marcos R.', role: 'Tutor de Empresa', avatar: 'https://i.pravatar.cc/150?u=mr' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'BORRADOR': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'COMPLETADO': return 'bg-[var(--teal2)] text-[var(--teal)] border-[var(--teal)]/20';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl border-4 border-[var(--teal2)] border-t-[var(--teal)] animate-spin" />
          <Layout className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[var(--teal)] animate-pulse" />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ink3)]">Accediendo a la Workspace de Proyecto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-24 bg-white rounded-[40px] border border-[#f0eee8] max-w-2xl mx-auto mt-12 shadow-sm">
        <div className="w-20 h-20 bg-[var(--red2)] rounded-[32px] flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-[var(--red)]" />
        </div>
        <h2 className="text-2xl font-black text-[var(--ink)] tracking-tight">Proyecto no localizado</h2>
        <p className="text-[var(--ink3)] mt-2 font-medium">El identificador de proyecto no coincide con ninguna entrada activa.</p>
        <button 
          onClick={() => router.push('/projects')}
          className="mt-8 h-12 px-8 bg-[var(--ink)] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[var(--ink)]/20 flex items-center justify-center gap-2 mx-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a Proyectos
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
      {/* Header Premium */}
      <div className="mb-12">
        <button 
          onClick={() => router.push('/projects')}
          className="mb-6 text-[var(--ink3)] hover:text-[var(--teal)] flex items-center gap-2 transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al Ecosistema
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-4xl font-black text-[var(--ink)] tracking-tight">{project.name}</h1>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(project.status)}`}>
                {project.status === 'ACTIVO' ? '● En Ejecución' : project.status}
              </span>
            </div>
            <p className="text-[var(--ink2)] max-w-3xl font-medium leading-relaxed">{project.description}</p>
          </div>
          
          <div className="flex gap-4">
            <button className="h-14 px-6 bg-white border border-[#f0eee8] rounded-2xl text-[var(--ink)] font-black text-[10px] uppercase tracking-widest hover:border-[var(--teal)] transition-all shadow-sm flex items-center gap-3 group">
              <Users className="w-4 h-4 text-[var(--ink3)] group-hover:text-[var(--teal)] transition-colors" /> Gestión de Equipo
            </button>
            <button className="h-14 px-8 bg-[var(--teal)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-[var(--teal)]/20 flex items-center gap-3">
              <Plus className="w-5 h-5 border-2 border-white/20 rounded-lg" /> Nueva Tarea Transversal
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Layout Premium */}
      <div className="flex border-b border-[#f0eee8] mb-12 overflow-x-auto no-scrollbar gap-8 relative">
        {[
          { id: 'overview', label: 'Estructura' },
          { id: 'tasks', label: 'Planificación' },
          { id: 'curriculum', label: 'Matriz Curricular' },
          { id: 'monitoring', label: 'Seguimiento' },
          { id: 'calendar', label: 'Cronograma' },
          { id: 'stats', label: 'Certificación' },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative border-b-2 ${
              activeTab === tab.id 
                ? 'border-[var(--teal)] text-[var(--ink)]' 
                : 'border-transparent text-[var(--ink3)] hover:text-[var(--ink)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-8">
              {/* Main Progress Logic */}
              <div className="bg-white rounded-[40px] p-10 border border-[#f0eee8] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)]/5 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
                <h3 className="text-xl font-black text-[var(--ink)] mb-8 tracking-tight flex items-center gap-3">
                  <Activity className="w-6 h-6 text-[var(--teal)]" />
                  Métrica de Avance Estratégico
                </h3>
                
                <div className="space-y-12">
                  <div className="relative p-8 bg-[var(--bg1)]/40 rounded-[32px] border border-[#f0eee8]">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ink3)] mb-6">
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-[var(--teal)]" />
                        Capacidad de Entrega Global
                      </span>
                      <span className="text-[var(--teal)] text-sm">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-5 overflow-hidden border border-[#f0eee8] p-[3px] shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="bg-gradient-to-r from-[var(--teal)] to-[var(--teal2)] h-full rounded-full shadow-[0_0_20px_rgba(45,178,168,0.3)] relative overflow-hidden"
                      >
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[progress-shimmer_2s_linear_infinite]" />
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                       <div className="p-4 bg-white/60 rounded-2xl border border-white">
                          <p className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-widest mb-1">Tareas OK</p>
                          <p className="text-xl font-black text-[var(--teal)]">{allTasks.filter(t => t.status === TaskStatus.VALIDADO).length}</p>
                       </div>
                       <div className="p-4 bg-white/60 rounded-2xl border border-white">
                          <p className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-widest mb-1">En Curso</p>
                          <p className="text-xl font-black text-[var(--ink)]">{allTasks.filter(t => t.status === TaskStatus.EN_CURSO).length}</p>
                       </div>
                       <div className="p-4 bg-white/60 rounded-2xl border border-white">
                          <p className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-widest mb-1">Efectividad</p>
                          <p className="text-xl font-black text-[var(--amber)]">{((project.progress || 0) * 0.95).toFixed(1)}%</p>
                       </div>
                    </div>
                  </div>

                  {/* Phase Analysis Grid */}
                  <div className="pt-4">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--ink2)] mb-8 flex items-center gap-3">
                       <Layout className="w-5 h-5 text-[var(--ink3)]" />
                       Análisis por Fase Operativa
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {project.phases?.map((phase, idx) => {
                         const phaseTasks = phase.tasks || [];
                         const completed = phaseTasks.filter(t => t.status === TaskStatus.VALIDADO).length;
                         const progress = phaseTasks.length > 0 ? Math.round((completed / phaseTasks.length) * 100) : 0;
                         return (
                           <div key={idx} className="p-6 bg-[var(--bg1)]/30 rounded-[28px] border border-transparent hover:border-[var(--teal)]/20 hover:bg-white hover:shadow-xl transition-all group">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <span className="text-[9px] font-black text-[var(--ink3)] uppercase tracking-widest">Fase {phase.order}</span>
                                    <h5 className="text-xs font-black text-[var(--ink)] uppercase mt-1 tracking-tight group-hover:text-[var(--teal)] transition-colors">{phase.name}</h5>
                                 </div>
                                 <span className="text-[10px] font-black text-[var(--teal)] bg-[var(--teal)]/5 px-3 py-1 rounded-full border border-[var(--teal)]/10">{progress}%</span>
                              </div>
                              <div className="w-full bg-white rounded-full h-1.5 overflow-hidden border border-[#f0eee8]">
                                 <div 
                                    className="h-full bg-[var(--teal)] transition-all duration-700"
                                    style={{ width: `${progress}%` }}
                                 />
                              </div>
                              <p className="text-[9px] font-bold text-[var(--ink3)] mt-3 uppercase tracking-widest">{completed} / {phaseTasks.length} Tareas Consolidadas</p>
                           </div>
                         );
                       })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table / structural */}
              <div className="bg-white rounded-[40px] p-10 border border-[#f0eee8] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--teal)] via-[var(--teal2)] to-[var(--teal)] opacity-40"></div>
                <h3 className="text-xl font-black text-[var(--ink)] mb-8 tracking-tight flex items-center gap-3">
                  <Database className="w-6 h-6 text-[var(--teal)]" />
                  Gobernanza del Proyecto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="group">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ink3)] block mb-3 group-hover:text-[var(--teal)] transition-colors">Entidad / Partner</label>
                      <div className="flex items-center gap-4 bg-[var(--bg1)] p-5 rounded-[20px] border border-[#f0eee8] hover:border-[var(--teal)]/40 hover:bg-white transition-all shadow-sm">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#f0eee8] shadow-inner font-black text-xs text-[var(--ink)]">CS</div>
                         <p className="text-[var(--ink)] font-black text-sm uppercase tracking-tight">{project.client || 'General Dynamics'}</p>
                      </div>
                    </div>
                    <div className="group">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ink3)] block mb-3 group-hover:text-[var(--teal)] transition-colors">Supervisor de Nodo</label>
                      <div className="flex items-center gap-4 bg-[var(--bg1)] p-5 rounded-[20px] border border-[#f0eee8] hover:border-[var(--teal)]/40 hover:bg-white transition-all shadow-sm">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#f0eee8] shadow-inner font-black text-xs text-[var(--teal)]">TG</div>
                         <p className="text-[var(--ink)] font-black text-sm uppercase tracking-tight">{project.manager || 'Dr. Torres G.'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="group">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ink3)] block mb-3 group-hover:text-[var(--teal)] transition-colors">Apertura del Expediente</label>
                      <div className="flex items-center gap-4 bg-[var(--bg1)] p-5 rounded-[20px] border border-[#f0eee8]">
                         <Calendar className="w-5 h-5 text-[var(--ink3)]" />
                         <p className="text-[var(--ink)] font-black text-xs uppercase tracking-widest">{project.startDate ? new Date(project.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'ASIGNANDO...'}</p>
                      </div>
                    </div>
                    <div className="group">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--ink3)] block mb-3 group-hover:text-[var(--teal)] transition-colors">Inversión Táctica</label>
                      <div className="flex items-center gap-4 bg-[var(--bg1)] p-5 rounded-[20px] border border-[#f0eee8]">
                         <Target className="w-5 h-5 text-[var(--amber)]" />
                         <p className="text-[var(--ink)] font-black text-sm uppercase tracking-widest">{project.budget || '145.000,00 €'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[var(--ink)] rounded-[40px] p-8 text-white shadow-2xl shadow-[var(--ink)]/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all"></div>
                <h3 className="text-lg font-black mb-6 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--teal)]" />
                  Equipo de Trabajo
                </h3>
                <div className="space-y-4">
                  {team.map((member: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs border border-white/10">{member.name[0]}</div>
                      <div>
                        <p className="text-sm font-black">{member.name}</p>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{member.role}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-4 h-12 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                    Gestionar Colaboradores
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-[40px] p-8 border border-[#f0eee8] shadow-sm">
                <h3 className="text-lg font-black text-[var(--ink)] mb-6 tracking-tight">Etiquetas Globales</h3>
                 <div className="flex flex-wrap gap-2">
                  {(project as any).tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-[var(--bg1)] text-[var(--ink)] text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#f0eee8]">
                      #{tag}
                    </span>
                  )) || (
                    <span className="text-[10px] font-bold text-[var(--ink3)]">Sin etiquetas asociadas.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-2xl font-black text-[var(--ink)] tracking-tight">Planificación Maestra</h3>
                <p className="text-[var(--ink3)] text-sm font-medium">Control táctico de entregables y cronograma de hitos.</p>
              </div>
              <button 
                onClick={async () => {
                  const firstPhaseId = project.phases?.[0]?.id;
                  if (!firstPhaseId) {
                    alert('Debe existir al menos una fase de proyecto.');
                    return;
                  }
                  const title = prompt('Título de la nueva tarea transsectorial:');
                  if (title) {
                    await projectsService.addTask(firstPhaseId, { title });
                    fetchProject();
                  }
                }}
                className="h-14 px-8 bg-[var(--teal)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-[var(--teal)]/20 flex items-center gap-3 animate-in fade-in zoom-in duration-300"
              >
                <Plus className="w-5 h-5 border-2 border-white/20 rounded-lg shadow-sm" /> Añadir Tarea Operativa
              </button>
            </div>

            <div className="space-y-12">
              {project.phases?.map((phase: any) => (
                <div key={phase.id}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-[var(--ink)] text-white rounded-xl flex items-center justify-center font-black text-xs">
                      {phase.order}
                    </div>
                    <h3 className="text-xl font-black text-[var(--ink)] tracking-tight uppercase">{phase.name}</h3>
                    <div className="h-px flex-1 bg-[#f0eee8]"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {phase.tasks?.map((task: any) => (
                      <div key={task.id} className="group bg-white rounded-[40px] p-8 border border-[#f0eee8] hover:border-[var(--teal)]/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            task.status === 'COMPLETADA' ? 'bg-[var(--teal2)] text-[var(--teal)]' : 
                            task.status === 'EN_PROGRESO' || task.status === 'EN_CURSO' ? 'bg-[var(--bg1)] text-[var(--ink)]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {task.status}
                          </span>
                          <button className="text-[var(--ink3)] hover:text-[var(--teal)] transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <h4 className="text-lg font-black text-[var(--ink)] mb-3 group-hover:text-[var(--teal)] transition-colors tracking-tight">{task.title}</h4>
                        <p className="text-[var(--ink3)] text-sm font-medium mb-8 leading-relaxed line-clamp-2">{task.description || 'Sin descripción detallada.'}</p>
                        
                        <div className="space-y-5 pt-6 border-t border-[#f0eee8]">
                          <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-[var(--ink3)]">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Vence: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Pendiente'}
                            </div>
                            <button 
                               onClick={() => {
                                 setSelectedTaskForEvidence({ id: task.id, title: task.title, curriculumLinks: task.curriculumLinks || [] });
                                 setIsEvidenceModalOpen(true);
                               }}
                               className="flex items-center gap-2 text-[var(--teal)] hover:bg-[var(--teal)]/5 px-3 py-1.5 rounded-lg transition-all"
                            >
                              <FileIcon className="w-4 h-4" /> Evidencia
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-[40px] border border-[#f0eee8] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-[#f0eee8] bg-[var(--bg1)]/50">
              <h3 className="text-xl font-black text-[var(--ink)] tracking-tight">Matriz de Trazabilidad Curricular</h3>
              <p className="text-[var(--ink3)] text-sm font-medium">Vinculación directa de tareas con Resultados de Aprendizaje y Criterios de Evaluación.</p>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg1)]/30 border-b border-[#f0eee8]">
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest">Descriptor RA/CE</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest">Capacidad Terminal</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest">Tareas Tácticas</th>
                  <th className="px-8 py-5 text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest">Nivel de Logro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0eee8]">
                {allTasks.flatMap(t => t.curriculumLinks || []).map((link: any, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg1)]/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-[var(--ink)] text-sm">{link.learningOutcome?.code}</span>
                        <span className="text-[10px] text-[var(--teal)] font-black uppercase tracking-wider">{link.evaluationCriterion?.code || 'Core RA'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-[var(--ink2)] font-medium max-w-sm leading-relaxed">
                        {link.learningOutcome?.description}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-2 bg-[var(--bg1)] text-[var(--ink)] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#f0eee8]">
                        {allTasks.find(t => t.id === link.taskId)?.title || 'Tarea Vinculada'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="w-20 h-2 bg-[var(--bg1)] rounded-full overflow-hidden border border-[#f0eee8]">
                          <div className="h-full bg-[var(--teal)] rounded-full shadow-[0_0_8px_rgba(45,178,168,0.2)]" style={{ width: '65%' }}></div>
                        </div>
                        <span className="text-[11px] font-black text-[var(--ink)]">65%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!allTasks.some(t => t.curriculumLinks?.length)) && (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-[var(--bg1)] rounded-[32px] flex items-center justify-center mx-auto mb-6">
                   <BookOpen className="w-10 h-10 text-[var(--bg2)]" />
                </div>
                <p className="text-[var(--ink)] font-black text-lg">Sin trazabilidad establecida</p>
                <p className="text-[var(--ink3)] text-sm mt-1 font-medium">Vincula tareas con el currículo oficial para activar el seguimiento.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[var(--ink)] tracking-tight">Centro de Validación</h2>
                <p className="text-[var(--ink3)] text-sm font-medium">Auditoría de evidencias y certificación de competencias.</p>
              </div>
              <button 
                onClick={fetchProjectEvidences}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] border border-[#f0eee8] transition-all"
              >
                <Clock className={`w-5 h-5 ${evidencesLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {evidencesLoading ? (
              <div className="py-32 text-center">
                <div className="w-16 h-16 rounded-3xl border-4 border-[var(--teal2)] border-t-[var(--teal)] animate-spin mx-auto mb-6" />
                <p className="text-[var(--ink3)] font-black text-[11px] uppercase tracking-widest">Sincronizando evidencias...</p>
              </div>
            ) : evidences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {evidences.map((evidence) => (
                  <div key={evidence.id} className="bg-white rounded-[40px] border border-[#f0eee8] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                    <div className="p-6 border-b border-[#f0eee8] bg-gradient-to-br from-[var(--bg1)]/40 to-white flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[var(--bg1)] flex items-center justify-center text-xs font-black text-[var(--ink)] shadow-md group-hover:border-[var(--teal)] transition-colors overflow-hidden">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${evidence.student?.firstName}+${evidence.student?.lastName}&background=f8f7f2&color=1a1a1a`} 
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-[var(--ink)] uppercase truncate max-w-[140px]">
                            {evidence.student?.firstName} {evidence.student?.lastName}
                          </p>
                          <p className="text-[9px] text-[var(--ink3)] font-black mt-0.5 tracking-tighter">
                            {evidence.submittedAt ? new Date(evidence.submittedAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border-2 transition-all ${
                        evidence.status === 'ACEPTADA' ? 'bg-[var(--teal2)] text-[var(--teal)] border-[var(--teal)]/10' :
                        evidence.status === 'RECHAZADA' ? 'bg-[var(--red2)] text-[var(--red)] border-[var(--red)]/10 shadow-lg shadow-[var(--red)]/10' :
                        'bg-white text-[var(--ink)] border-[#f0eee8]'
                      }`}>
                        {evidence.status}
                      </span>
                    </div>
                    
                    <div className="p-10">
                       <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 bg-[var(--bg1)] rounded-lg flex items-center justify-center text-[var(--teal)] border border-[#f0eee8]">
                            <FileIcon className="w-4 h-4" />
                         </div>
                         <h4 className="text-sm font-black text-[var(--ink)] truncate max-w-[200px]">{evidence.fileName}</h4>
                       </div>
                       <div className="flex items-center gap-3">
                        <a 
                          href={evidence.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 h-14 bg-white text-[var(--ink)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[var(--bg1)] transition-all flex items-center justify-center gap-2 border-2 border-[#f0eee8]"
                        >
                          Ver <ArrowUpRight className="w-4 h-4 text-[var(--teal)]" />
                        </a>
                        <button 
                          onClick={() => {
                            const task = allTasks.find(t => t.id === evidence.taskId);
                            setSelectedEvidence(evidence);
                            setSelectedTaskForEvidence({
                              id: evidence.taskId,
                              title: task?.title || 'Tarea',
                              curriculumLinks: (task as any)?.curriculumLinks || []
                            });
                            setIsGradingModalOpen(true);
                          }}
                          className="h-14 px-8 bg-[var(--ink)] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-[var(--ink)]/20"
                        >
                          Calificar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[40px] border border-[#f0eee8] shadow-sm">
                <div className="w-20 h-20 bg-[var(--bg1)] rounded-[32px] flex items-center justify-center mx-auto mb-6">
                   <FileIcon className="w-10 h-10 text-[var(--bg2)]" />
                </div>
                <h3 className="text-xl font-black text-[var(--ink)] tracking-tight">Sin entregas por validar</h3>
                <p className="text-[var(--ink3)] text-sm mt-2 font-medium">Los alumnos aún no han subido registros de ejecución para este proyecto.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[var(--ink)] tracking-tight">Planificación de Sesiones</h2>
                <p className="text-[var(--ink3)] text-sm font-medium">Horarios y ocupación del taller para este ecosistema.</p>
              </div>
              <button 
                onClick={handleAddSession}
                className="h-14 px-8 bg-[var(--ink)] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[var(--ink)]/20 flex items-center gap-3"
              >
                <Calendar className="w-5 h-5 text-[var(--teal)]" /> Reservar Espacio de Trabajo
              </button>
            </div>

            {sessionsLoading ? (
              <div className="py-32 text-center">
                 <div className="w-16 h-16 rounded-3xl border-4 border-[var(--teal2)] border-t-[var(--teal)] animate-spin mx-auto mb-6" />
                 <p className="text-[var(--ink3)] font-black text-[11px] uppercase tracking-widest">Cargando cronograma...</p>
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-[32px] border border-[#f0eee8] p-6 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--teal)]/5 rounded-full -mr-10 -mt-10 group-hover:bg-[var(--teal)]/10 transition-colors" />
                    <div className="flex items-center justify-between mb-6">
                       <div className="w-16 h-16 bg-[var(--bg1)] rounded-2xl flex flex-col items-center justify-center border border-[#f0eee8] group-hover:border-[var(--teal)]/40 transition-all">
                       <span className="text-[9px] font-black uppercase tracking-widest text-[var(--ink3)]">
                        {session.date ? new Date(session.date).toLocaleDateString('es-ES', { weekday: 'short' }) : '---'}
                       </span>
                       <span className="text-lg font-black text-[var(--ink)] tracking-tighter">
                        {session.date ? new Date(session.date).getDate() : '--'}
                       </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-black text-[var(--ink)] uppercase tracking-tight group-hover:text-[var(--teal)] transition-colors">{session.title}</h4>
                      <p className="text-[10px] text-[var(--ink3)] font-bold mt-1 uppercase tracking-widest">
                        {session.startTime} — {session.endTime} • {session.location || 'Aula Principal'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[var(--ink)] uppercase tracking-widest">
                        {session.date ? new Date(session.date).toLocaleDateString('es-ES', { month: 'short' }) : ''}
                      </p>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[40px] border border-[#f0eee8] shadow-sm">
                <div className="w-20 h-20 bg-[var(--bg1)] rounded-[32px] flex items-center justify-center mx-auto mb-6">
                   <Calendar className="w-10 h-10 text-[var(--bg2)]" />
                </div>
                <h3 className="text-xl font-black text-[var(--ink)] tracking-tight">Cronograma en blanco</h3>
                <p className="text-[var(--ink3)] text-sm mt-2 font-medium">Asigna franjas horarias para coordinar la ejecución del proyecto.</p>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ProjectStats projectId={projectId} />
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTaskForEvidence && (
        <EvidenceModal
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          taskId={selectedTaskForEvidence.id}
          taskTitle={selectedTaskForEvidence.title}
          onSubmitted={() => {
            fetchProjectEvidences();
            fetchProject();
          }}
        />
      )}

      {selectedEvidence && selectedTaskForEvidence && (
        <GradingModal
          isOpen={isGradingModalOpen}
          onClose={() => setIsGradingModalOpen(false)}
          evidence={selectedEvidence}
          taskTitle={selectedTaskForEvidence.title}
          curriculumLinks={selectedTaskForEvidence.curriculumLinks}
          onGraded={() => {
            fetchProjectEvidences();
            fetchProject();
          }}
        />
      )}
      </div>
    </>
  );
}
