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
  MoreVertical,
  Calendar,
  Users,
  BookOpen,
  Layers,
  Search,
  Filter,
  Check,
  FileIcon,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { projectsService, Project, Phase, TaskStatus } from '@/services/projects.service';
import { curriculumService, LearningOutcome, EvaluationCriterion } from '@/services/curriculum.service';
import { monitoringService } from '@/services/monitoring.service';
import { planningService, Session as ProjectSession } from '@/services/planning.service';
import { aiService } from '@/services/ai.service';
import { EvidenceModal } from '@/components/EvidenceModal';
import { GradingModal } from '@/components/GradingModal';
import ProjectStats from '@/components/ProjectStats';

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
      
      const data = await planningService.getSessions(
        'pilot-group-id', // Mock
        start.toISOString(),
        end.toISOString()
      );
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setSessionsLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'BORRADOR': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'COMPLETADO': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-900">Proyecto no encontrado</h2>
        <button 
          onClick={() => router.push('/projects')}
          className="mt-4 text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 w-full"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a proyectos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.push('/projects')}
          className="mb-4 text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver a proyectos
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <p className="text-slate-600 max-w-2xl">{project.description}</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Users className="w-4 h-4" /> Equipo
            </button>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md flex items-center gap-2">
              <Plus className="w-4 h-4" /> Nueva Tarea
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'overview' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Vista General
        </button>
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'tasks' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Planificación y Tareas
        </button>
        <button 
          onClick={() => setActiveTab('curriculum')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'curriculum' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Vinculación Curricular
        </button>
        <button 
          onClick={() => setActiveTab('monitoring')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'monitoring' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Seguimiento y Evidencias
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'calendar' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Calendario
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${activeTab === 'stats' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Rendimiento Académico
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Stats Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-slate-500" /> Progreso del Proyecto
                </h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                        En curso
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold inline-block text-emerald-600">
                        {project.progress || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-100">
                    <div style={{ width: `${project.progress || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-slate-900">
                      {project.phases?.reduce((acc, p) => acc + p.tasks.length, 0) || 0}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Tareas totales</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {project.phases?.flatMap(p => p.tasks).filter(t => t.status === 'VALIDADO').length || 0}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">Completadas</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <p className="text-2xl font-bold text-amber-600">
                      {project.phases?.flatMap(p => p.tasks).filter(t => t.status === 'EN_CURSO').length || 0}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">En curso</p>
                  </div>
                </div>
              </div>

              {/* Phases Preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-slate-500" /> Fases Actuales
                  </h3>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Ver todas
                  </button>
                </div>
                
                <div className="space-y-4">
                  {project.phases?.length ? (
                    project.phases.sort((a, b) => a.order - b.order).map((phase) => (
                      <div key={phase.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 font-bold text-slate-600">
                          {phase.order}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-slate-900">{phase.name}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1">{phase.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold text-slate-700">{phase.tasks.length} tareas</p>
                          <div className="flex gap-1 mt-1">
                            {phase.tasks.every(t => t.status === 'VALIDADO') && phase.tasks.length > 0 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-slate-500 italic">No hay fases definidas</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Context Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Detalles Contextuales</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-medium mb-1">
                      <BookOpen className="w-4 h-4 text-slate-400" /> Ciclo y Curso
                    </div>
                    <p className="text-sm text-slate-600 ml-6">
                      {project.course?.cycle.name} - {project.course?.year}º Año
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-medium mb-1">
                      <Layers className="w-4 h-4 text-slate-400" /> Módulos Implicados
                    </div>
                    <div className="ml-6 flex flex-wrap gap-2 mt-2">
                      {project.projectModules?.map((pm: any) => (
                        <span key={pm.id} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">
                          {pm.module.code}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-slate-900 font-medium mb-1">
                      <Calendar className="w-4 h-4 text-slate-400" /> Temporalización
                    </div>
                    <p className="text-sm text-slate-600 ml-6">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-slate-900 rounded-xl p-6 shadow-md text-white">
                <h3 className="text-lg font-semibold mb-2">Asistente IA</h3>
                <p className="text-slate-400 text-sm mb-6">¿Necesitas ayuda para desglosar esta fase en tareas curriculares?</p>
                <button className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2">
                  Generar propuestas de tareas
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (!project.phases || project.phases.length === 0) && (
          <div className="py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
            <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Proyecto sin estructura</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-8">
              Este proyecto aún no tiene fases ni tareas definidas. ¿Quieres que la IA te proponga una estructura basada en el currículo?
            </p>
            <button 
              onClick={async () => {
                try {
                  const suggested = await aiService.suggestStructure({
                    title: project.name,
                    description: project.description || '',
                    raIds: [],
                    ceIds: [],
                  });
                  
                  if (confirm(`La IA propone ${suggested.length} fases. ¿Generar estructura?`)) {
                    for (const phase of suggested) {
                      const newPhase = await projectsService.addPhase(projectId, { 
                        name: phase.title, 
                        description: phase.description,
                        order: suggested.indexOf(phase) + 1 
                      });
                      for (const task of phase.tasks) {
                        await projectsService.addTask(newPhase.id, { 
                          title: task.title,
                          description: task.description,
                          estimatedHours: task.estimatedHours
                        });
                      }
                    }
                    fetchProject();
                  }
                } catch (error) {
                  console.error('Error in AI suggest:', error);
                }
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> Generar con Asistente IA
            </button>
          </div>
        )}

        {activeTab === 'tasks' && project.phases && project.phases.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Hoja de Ruta del Proyecto</h2>
              <button 
                onClick={async () => {
                  const name = prompt('Nombre de la fase:');
                  if (name) {
                    await projectsService.addPhase(projectId, { 
                      name, 
                      order: (project.phases?.length || 0) + 1 
                    });
                    fetchProject();
                  }
                }}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Añadir Fase
              </button>
            </div>

            <div className="space-y-12">
              {project.phases?.sort((a, b) => a.order - b.order).map((phase) => (
                <div key={phase.id} className="relative pl-8 border-l-2 border-slate-200 last:border-l-0">
                  {/* Phase Marker */}
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    {phase.order}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">{phase.name}</h3>
                    <p className="text-sm text-slate-500">{phase.description}</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${
                            task.status === 'VALIDADO' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                            task.status === 'EN_CURSO' ? 'text-amber-600 bg-amber-50 border-amber-100' :
                            'text-slate-500 bg-slate-50 border-slate-200'
                          }`}>
                            {task.status}
                          </div>
                          <button className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-900 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2">{task.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 font-medium bg-slate-50 px-2 py-1 rounded">
                              <Clock className="w-3 h-3" /> {task.estimatedHours || 0}h
                            </div>
                            <div className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-600 px-2 py-1 rounded">
                              <BookOpen className="w-3 h-3" /> RA1
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTaskForEvidence({ id: task.id, title: task.title, curriculumLinks: task.curriculumLinks || [] });
                              setIsEvidenceModalOpen(true);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1"
                            title="Subir evidencia"
                          >
                            <FileIcon className="w-4 h-4" />
                            <span className="font-semibold text-[10px] uppercase">Evidencia</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={async () => {
                        const title = prompt('Título de la tarea:');
                        if (title) {
                          await projectsService.addTask(phase.id, { title });
                          fetchProject();
                        }
                      }}
                      className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all min-h-[160px]"
                    >
                      <Plus className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Nueva tarea</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">RA/CE</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción Curricular</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tareas Vinculadas</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.phases?.flatMap(p => p.tasks).flatMap(t => t.curriculumLinks || []).map((link: any, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{link.learningOutcome?.code}</span>
                        <span className="text-[10px] text-slate-400">{link.evaluationCriterion?.code || 'RA General'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 max-w-md line-clamp-2">
                        {link.learningOutcome?.description}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                          {project.phases?.flatMap(p => p.tasks).find(t => t.id === link.taskId)?.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">60%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!project.phases?.some(p => p.tasks.some(t => t.curriculumLinks?.length))) && (
              <div className="py-20 text-center">
                < BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">No hay vinculaciones curriculares establecidas aún.</p>
                <p className="text-xs text-slate-400 mt-1">Conecta tareas con Resultados de Aprendizaje para ver la trazabilidad.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Seguimiento de Evidencias</h2>
                <p className="text-sm text-slate-500">Revisa y valida las entregas de los alumnos vinculadas a este proyecto.</p>
              </div>
              <button 
                onClick={fetchProjectEvidences}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                title="Actualizar"
              >
                <Clock className={`w-5 h-5 ${evidencesLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {evidencesLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-500">Cargando evidencias...</p>
              </div>
            ) : evidences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {evidences.map((evidence) => (
                  <div key={evidence.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="p-4 border-b border-slate-50 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {evidence.student?.firstName?.[0]}{evidence.student?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                            {evidence.student?.firstName} {evidence.student?.lastName}
                          </p>
                          <p className="text-[10px] text-slate-400">{new Date(evidence.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        evidence.status === 'ACEPTADA' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        evidence.status === 'RECHAZADA' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {evidence.status}
                      </span>
                    </div>
                    
                    <div className="p-5">
                       <h4 className="text-sm font-bold text-slate-900 mb-4">{evidence.fileName}</h4>
                       <div className="flex items-center gap-2 pt-2">
                        <a 
                          href={evidence.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 text-center transition-all flex items-center justify-center gap-1"
                        >
                          Ver <ArrowUpRight className="w-3 h-3" />
                        </a>
                        <button 
                          onClick={() => {
                            const task = project.phases?.flatMap(p => p.tasks).find(t => t.id === evidence.taskId);
                            setSelectedEvidence(evidence);
                            setSelectedTaskForEvidence({
                              id: evidence.taskId,
                              title: task?.title || 'Tarea',
                              curriculumLinks: task?.curriculumLinks || []
                            });
                            setIsGradingModalOpen(true);
                          }}
                          className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                        >
                          Evaluar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <FileIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Sin entregas</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Aún no se han subido evidencias para este proyecto.
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Planificación de Sesiones</h2>
                <p className="text-sm text-slate-500">Horarios y ocupación del taller para este proyecto.</p>
              </div>
              <button 
                onClick={async () => {
                   const date = prompt('Fecha (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
                   if (date) {
                     await planningService.createSession({
                       groupId: 'pilot-group-id',
                       date: date,
                       startTime: '08:30',
                       endTime: '11:00',
                       room: 'Taller de Madera 1',
                     });
                     fetchSessions();
                   }
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Reservar Sesión
              </button>
            </div>

            {sessionsLoading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-500">Cargando horario...</p>
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3 text-slate-400">
                       <Calendar className="w-4 h-4" />
                       <span className="text-[10px] font-bold uppercase tracking-wider">{new Date(session.date).toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">
                      {new Date(session.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <Clock className="w-3 h-3" /> {session.startTime} - {session.endTime}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Ubicación</p>
                      <p className="text-xs font-semibold text-slate-700">{session.room || 'No asignado'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Sin sesiones planificadas</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Reserva horas de taller para que los alumnos sepan cuándo trabajar en este proyecto.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 line-clamp-1">Evaluación por Competencias</h2>
              <p className="text-sm text-slate-500">Visualiza el nivel de logro de los Resultados de Aprendizaje basados en las evidencias validadas.</p>
            </div>
            <ProjectStats projectId={projectId} />
          </div>
        )}
      </div>

      {selectedTaskForEvidence && (
        <EvidenceModal
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          taskId={selectedTaskForEvidence.id}
          taskTitle={selectedTaskForEvidence.title}
          onSubmitted={fetchProjectEvidences}
        />
      )}

      {selectedEvidence && selectedTaskForEvidence && (
        <GradingModal
          isOpen={isGradingModalOpen}
          onClose={() => setIsGradingModalOpen(false)}
          evidence={selectedEvidence}
          taskTitle={selectedTaskForEvidence.title}
          curriculumLinks={selectedTaskForEvidence.curriculumLinks}
          onGraded={fetchProjectEvidences}
        />
      )}
    </div>
  );
}
