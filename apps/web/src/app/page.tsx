'use client';

import React, { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import { academicService, Project } from '@/services/academic.service';
import { LayoutDashboard, FileText, Cpu, ExternalLink, ChevronRight, Briefcase, Plus, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import PWAInstallButton from '@/components/PWAInstallButton';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      academicService.getProjects()
        .then(data => {
          setProjects(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching projects:', err);
          setLoading(false);
        });
    }
  }, []);

  if (user) {
    return (
      <div className="flex flex-col gap-8 p-6 md:p-10 animate-in fade-in duration-700">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tighter sm:text-5xl">
                PANEL DE <span className="text-blue-500">CONTROL</span>
              </h1>
              <p className="text-gray-400 max-w-2xl text-lg font-medium mt-2">
                Bienvenido, <span className="text-blue-400 font-bold">{user.email}</span>. Gestiona tu actividad académica.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 uppercase font-bold">Estado del Sistema</span>
                <span className="text-sm text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Operativo
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-500" />
                Mis Proyectos Recientes
              </h2>
              <Link href="/dashboard" className="text-sm font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="group bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition-all hover:translate-x-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                          {project.name}
                        </h4>
                        <p className="text-gray-500 text-sm line-clamp-1 mt-1 font-medium">{project.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${project.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          project.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(project.startDate).toLocaleDateString()}
                        </span>
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress || 0}%` }} />
                        </div>
                        <span className="text-white font-bold">{project.progress || 0}%</span>
                      </div>
                      <Link href={`/projects/${project.id}`} className="text-white/40 hover:text-white transition-colors">
                        Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-mono tracking-tighter">SIN PROYECTOS ACTIVOS</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">Comienza tu viaje académico creando tu primer proyecto transversal hoy mismo.</p>
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all active:scale-95 text-xs tracking-widest uppercase shadow-lg shadow-blue-600/20">
                  CREAR MI PRIMER PROYECTO
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-purple-500" />
              Herramientas
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="group bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-purple-500/50 transition-all cursor-not-allowed opacity-80">
                <FileText className="w-6 h-6 text-purple-500 mb-3" />
                <h4 className="text-lg font-bold text-white">Actas de Reunión</h4>
                <p className="text-gray-500 text-xs mt-1">Automatización de coordinación</p>
                <span className="mt-4 inline-block text-[10px] font-bold text-purple-400 uppercase tracking-widest">Próximamente</span>
              </div>
              <div className="group bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 transition-all cursor-not-allowed opacity-80">
                <Cpu className="w-6 h-6 text-emerald-500 mb-3" />
                <h4 className="text-lg font-bold text-white">Asistente IA de FP</h4>
                <p className="text-gray-500 text-xs mt-1">Soporte experto 24/7</p>
                <span className="mt-4 inline-block text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Próximamente</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <AlertCircle className="w-10 h-10 text-white mb-4 group-hover:rotate-12 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">Soporte Transversal</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">¿Necesitas ayuda con la configuración de tu ciclo o grupo? Contacta con administración.</p>
                <button className="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                  Abrir Ticket <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <section className="mt-12 bg-blue-600/5 border border-blue-500/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">Eficiencia Industrial</h2>
            <p className="text-blue-300/80 max-w-lg font-medium">Todo tu flujo de trabajo centralizado en una sola interfaz industrial potente. Tu productividad, nuestra prioridad.</p>
          </div>
          <button className="relative z-10 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95 group tracking-widest uppercase text-xs">
            Nueva COORDINACIÓN
            <LayoutDashboard className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full animate-pulse" />
        </section>
      </div>
    );
  }

  // Landing Page for non-authenticated users
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-1000">
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Plataforma Académica Industrial</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
        TRANSVERSAL <br />
        <span className="text-blue-600 italic">FP</span> ONLINE
      </h1>

      <p className="max-w-2xl text-xl text-gray-400 mb-12 font-medium leading-relaxed">
        El centro neurálgico para la coordinación de proyectos, seguimiento de empresas y automatización académica. <br />
        <span className="text-white">Diseñado por y para la Formación Profesional.</span>
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Link
          href="/register"
          className="px-10 py-4 bg-white text-black font-black text-lg rounded-2xl hover:scale-105 transition-all shadow-xl hover:shadow-white/5 active:scale-95"
        >
          COMENZAR AHORA
        </Link>
        <Link
          href="/login"
          className="px-10 py-4 bg-blue-600/10 border border-blue-600/30 text-blue-400 font-bold text-lg rounded-2xl hover:bg-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
        >
          Iniciar Sesión
          <ExternalLink className="w-5 h-5" />
        </Link>
      </div>

      <div className="mt-8 max-w-sm mx-auto">
        <PWAInstallButton />
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50">
        {/* Placeholder for center logos or stats */}
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black text-white">100%</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Optimizado</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black text-white">AI</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Power Assist</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black text-white">FCT/DUAL</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Seguimiento</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black text-white">VUE</span>
          <span className="text-xs text-gray-500 uppercase tracking-widest">Tecnología</span>
        </div>
      </div>
    </div>
  );
}
