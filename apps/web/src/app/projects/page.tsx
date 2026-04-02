'use client';

import React, { useEffect, useState } from 'react';
import { projectsService, Project } from '@/services/projects.service';
import { authService } from '@/services/auth.service';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, Plus, Clock, Search, Filter, ChevronRight } from 'lucide-react';
import { CreateProjectModal } from '@/components/CreateProjectModal';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  ACTIVO:    { label: 'Activo',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  BORRADOR:  { label: 'Borrador',  color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  PAUSADO:   { label: 'Pausado',   color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  COMPLETADO:{ label: 'Completado',color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  ARCHIVADO: { label: 'Archivado', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' },
};

export default function ProjectsPage() {
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
    if (!currentUser) { router.push('/login'); return; }
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">
            <span className="text-blue-500">PROYECTOS</span> TRANSVERSALES
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 text-xs uppercase tracking-widest active:scale-95"
          >
            <Plus className="w-4 h-4" /> Nuevo Proyecto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111] border border-white/10 rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
          >
            <option value="ALL">Todos los estados</option>
            {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-16 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Sin proyectos</h3>
          <p className="text-gray-500 text-sm mb-6">
            {search || statusFilter !== 'ALL'
              ? 'No se encontraron proyectos con ese filtro.'
              : 'Aún no hay proyectos creados.'}
          </p>
          {canCreate && !search && statusFilter === 'ALL' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all text-xs uppercase tracking-widest"
            >
              Crear Primer Proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => {
            const st = STATUS_LABELS[project.status] || { label: project.status, color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' };
            return (
              <div
                key={project.id}
                className="group bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-blue-500/40 transition-all cursor-pointer"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2 uppercase">
                    {project.name}
                  </h3>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                {project.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString('es-ES')
                      : 'Sin fecha'}
                  </div>
                  <div className="flex items-center gap-1 text-blue-500 font-bold group-hover:gap-2 transition-all">
                    Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
                {/* Barra de progreso */}
                <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreated={(newProject) => {
            setProjects((prev) => [newProject, ...prev]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
