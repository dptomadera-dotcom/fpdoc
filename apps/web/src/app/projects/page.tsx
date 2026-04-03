'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { projectsService, Project } from '@/services/projects.service';
import { authService } from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Plus, Clock, Search, Filter, ChevronRight, Sparkles } from 'lucide-react';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import Navbar from '@/components/Navbar';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVO:    { label: 'Activo',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  BORRADOR:  { label: 'Borrador',  color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  PAUSADO:   { label: 'Pausado',   color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  COMPLETADO:{ label: 'Completado',color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  ARCHIVADO: { label: 'Archivado', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
};

function ProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const createMode = searchParams.get('create') === 'true';

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    if (!currentUser) { router.push(isProd ? '/fpdoc/login' : '/login'); return; }
    setUser(currentUser);

    projectsService.getProjects()
      .then((data) => { setProjects(data); setFiltered(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (createMode && user && ['ADMIN', 'JEFATURA', 'PROFESOR'].includes(user.role)) {
      setShowModal(true);
    }
  }, [createMode, user]);

  useEffect(() => {
    let result = projects;
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter(p => p.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, projects]);

  const canCreate = user && ['ADMIN', 'JEFATURA', 'PROFESOR'].includes(user.role);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] p-6 md:p-12 pt-32 md:pt-40">
        <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--ink3)]">Repositorio Central • Proyectos</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter">
              Mis <span className="text-[var(--teal)] italic">Proyectos</span>
            </h1>
            <p className="text-[var(--ink3)] mt-4 max-w-xl text-sm leading-relaxed">
              Gestiona y supervisa todas las programaciones transversales activas en tu centro.
            </p>
          </div>
          
          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="h-14 px-8 bg-[var(--ink)] text-white rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[var(--ink)]/20"
            >
              Nuevo Proyecto <Plus className="w-4 h-4 text-[var(--teal2)]" />
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink3)] group-focus-within:text-[var(--teal)] transition-colors" />
            <input
              type="text"
              placeholder="Buscar proyecto por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 bg-white border border-[#f0eee8] rounded-2xl pl-12 pr-4 text-sm font-bold text-[var(--ink)] placeholder-[var(--ink3)]/50 focus:border-[var(--teal)] transition-all outline-none"
            />
          </div>
          <div className="relative flex-shrink-0">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink3)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-14 bg-white border border-[#f0eee8] rounded-2xl pl-12 pr-10 text-sm font-bold text-[var(--ink)] focus:border-[var(--teal)] transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="ALL">Todos los estados</option>
              {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-white/50 border border-[#f0eee8] rounded-[40px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-[#f0eee8] rounded-[40px] p-24 text-center">
            <div className="w-20 h-20 bg-[var(--bg1)] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[var(--teal)]">
              <Briefcase className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">No se encontraron proyectos</h3>
            <p className="text-xs text-[var(--ink3)] max-w-xs mx-auto mb-8">
              {search || statusFilter !== 'ALL'
                ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas.'
                : 'Aún no se han creado proyectos en este repositorio.'}
            </p>
            {canCreate && !search && statusFilter === 'ALL' && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex h-12 px-8 bg-[var(--teal)] text-white font-black rounded-xl items-center gap-2 hover:scale-105 transition-all text-[10px] uppercase tracking-widest"
              >
                CREAR PRIMER PROYECTO <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((project) => {
              const st = STATUS_LABELS[project.status] || { label: project.status, color: 'text-gray-400 bg-gray-500/10' };
              return (
                <div
                  key={project.id}
                  onClick={() => {
                    const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
                    router.push(isProd ? `/fpdoc/projects/${project.id}` : `/projects/${project.id}`);
                  }}
                  className="group bg-white border border-[#f0eee8] rounded-[40px] p-8 hover:shadow-2xl hover:shadow-[var(--bg2)]/50 transition-all duration-500 cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                         <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-transparent ${st.color}`}>
                           {st.label}
                         </span>
                         <span className="text-[10px] font-bold text-[var(--ink3)]">{project.progress || 0}% Completado</span>
                      </div>
                      <h3 className="text-2xl font-bold font-serif text-[var(--ink)] group-hover:text-[var(--teal)] transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-[var(--bg1)] rounded-2xl flex items-center justify-center text-[var(--teal)] group-hover:scale-110 transition-transform">
                       <Sparkles className="w-6 h-6" />
                    </div>
                  </div>

                  {project.description && (
                    <p className="text-[var(--ink3)] text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#f0eee8]">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-[var(--bg1)] flex items-center justify-center text-[8px] font-bold">
                               {i}
                            </div>
                          ))}
                       </div>
                       <div className="flex items-center gap-1.5 text-[var(--ink3)] text-[10px] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {project.startDate ? new Date(project.startDate).toLocaleDateString('es-ES') : '--/--/--'}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[var(--teal)] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                       Gestionar <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Progress Bar background hint */}
                  <div className="absolute bottom-0 left-0 h-1.5 bg-[var(--teal)] transition-all duration-1000 ease-out opacity-20" style={{ width: `${project.progress || 0}%` }} />
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg1)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-2xl border-4 border-[var(--teal)] border-t-transparent animate-spin" />
           <span className="text-[10px] font-black uppercase tracking-widest text-[var(--ink3)]">Cargando Universos...</span>
        </div>
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  );
}
