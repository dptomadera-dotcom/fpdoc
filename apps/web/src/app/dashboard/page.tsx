'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { academicService, Project } from '@/services/academic.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase, BookOpen, Users, LayoutDashboard,
  ChevronRight, Plus, TrendingUp, CheckCircle,
  Clock, AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) { router.push('/login'); return; }
    setUser(currentUser);

    academicService.getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const activeProjects = projects.filter(p => p.status === 'ACTIVO');
  const completedProjects = projects.filter(p => p.status === 'COMPLETADO');

  const stats = [
    {
      label: 'Proyectos Totales',
      value: loading ? '—' : projects.length,
      icon: Briefcase,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Proyectos Activos',
      value: loading ? '—' : activeProjects.length,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Completados',
      value: loading ? '—' : completedProjects.length,
      icon: CheckCircle,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      label: 'Pendientes',
      value: loading ? '—' : projects.filter(p => p.status === 'BORRADOR').length,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
          <LayoutDashboard className="w-3.5 h-3.5" />
          Panel de Control
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
          Hola, <span className="text-blue-500">{user?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-gray-400 mt-1 font-medium">
          Resumen de tu actividad académica · Rol: <span className="text-blue-400 font-bold">{user?.role}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`bg-[#111] border ${border} rounded-2xl p-4 sm:p-5`}>
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{value}</div>
            <div className="text-xs text-gray-500 font-bold mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proyectos recientes */}
        <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" /> Proyectos Recientes
            </h2>
            <Link href="/projects" className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : activeProjects.length > 0 ? (
            <div className="space-y-2">
              {activeProjects.slice(0, 5).map(project => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-blue-500/20 transition-all group"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors truncate uppercase">{project.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {project.startDate ? new Date(project.startDate).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white w-8 text-right">{project.progress || 0}%</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No hay proyectos activos</p>
              {['ADMIN', 'JEFATURA', 'PROFESOR'].includes(user?.role) && (
                <Link href="/projects" className="mt-3 inline-flex items-center gap-1 text-blue-500 text-xs font-bold hover:text-blue-400">
                  <Plus className="w-3.5 h-3.5" /> Crear proyecto
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="space-y-4">
          {/* Acceso rápido */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-5">
            <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">Acceso Rápido</h2>
            <div className="space-y-2">
              <Link href="/projects" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-blue-500/20 transition-all text-sm font-bold text-white">
                <Briefcase className="w-4 h-4 text-blue-400" /> Todos los proyectos
              </Link>
              {['ADMIN', 'JEFATURA'].includes(user?.role) && (
                <>
                  <Link href="/groups" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-purple-500/20 transition-all text-sm font-bold text-white">
                    <Users className="w-4 h-4 text-purple-400" /> Grupos
                  </Link>
                  <Link href="/modules" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-emerald-500/20 transition-all text-sm font-bold text-white">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> Módulos
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Info del rol */}
          <div className="bg-gradient-to-br from-blue-600/15 to-purple-600/15 border border-white/10 rounded-2xl p-5">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
              <LayoutDashboard className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-1">Tu rol</p>
            <p className="text-xl font-black text-white">{user?.role}</p>
            <p className="text-xs text-gray-400 mt-1">
              {user?.role === 'ALUMNO' && 'Accede a tus proyectos y evidencias.'}
              {user?.role === 'PROFESOR' && 'Gestiona proyectos y evalúa alumnos.'}
              {user?.role === 'JEFATURA' && 'Supervisa todos los ciclos y proyectos.'}
              {user?.role === 'ADMIN' && 'Control total del sistema.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
