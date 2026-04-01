'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  ShieldCheck, 
  Settings, 
  LogOut,
  Hammer,
  GraduationCap,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { academicService, Project } from '@/services/academic.service';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Currículo', href: '/curriculo', icon: BookOpen },
  { name: 'Evaluación', href: '/evaluacion', icon: ClipboardList },
  { name: 'Seguridad', href: '/seguridad', icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await academicService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <aside className="w-64 flex flex-col bg-brand-walnut text-brand-maple border-r border-brand-oak/20 h-screen sticky top-0 overflow-hidden">
      {/* Brand Section */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-maple rounded-xl flex items-center justify-center shadow-premium transform transition-transform hover:rotate-3">
          <Hammer className="text-brand-walnut w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-none italic">
            TRANSVERSAL
          </h1>
          <span className="text-[0.65rem] uppercase tracking-widest text-brand-oak font-semibold">
            FP · Madera & Mueble
          </span>
        </div>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 py-8 space-y-4 overflow-y-auto scrollbar-hide">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3",
                  isActive 
                    ? "bg-brand-maple/10 text-brand-maple shadow-inner-soft" 
                    : "text-brand-oak/70 hover:text-brand-maple hover:bg-brand-maple/5"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-6 bg-brand-maple rounded-r-full"
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-brand-maple" : "text-brand-oak/50 group-hover:text-brand-oak"
                )} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Projects Section (Collapsible) */}
        <div className="space-y-2">
          <button 
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-[0.65rem] uppercase tracking-widest text-brand-oak font-bold hover:text-brand-maple transition-colors group"
          >
            <span className="flex items-center gap-2">
              <Hammer className="w-3 h-3" />
              Proyectos Activos
            </span>
            <ChevronDown className={cn(
              "w-3 h-3 transition-transform duration-300",
              !isProjectsOpen && "-rotate-90"
            )} />
          </button>

          <AnimatePresence>
            {isProjectsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden space-y-1"
              >
                {loading ? (
                  <div className="px-8 py-2 text-[0.6rem] text-brand-oak/40 italic">Cargando...</div>
                ) : projects.length > 0 ? (
                  projects.map((project) => {
                    const isActive = pathname.includes(`/proyectos/${project.id}`);
                    return (
                      <Link
                        key={project.id}
                        href={`/proyectos/${project.id}`}
                        className={cn(
                          "group py-2 px-8 rounded-lg text-xs transition-all duration-300 flex items-center gap-2",
                          isActive 
                            ? "text-brand-maple font-semibold bg-brand-maple/5" 
                            : "text-brand-oak/60 hover:text-brand-maple hover:bg-brand-maple/5"
                        )}
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          project.status === 'ACTIVO' ? "bg-green-500/50" : "bg-brand-oak/30"
                        )} />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-8 py-2 text-[0.6rem] text-brand-oak/40">Sin proyectos activos</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Sections */}
        <div className="pt-4">
          <Link
            href="/progreso"
            className={cn(
              "group py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3",
              pathname === '/progreso' ? "bg-brand-maple/10 text-brand-maple" : "text-brand-oak/70 hover:text-brand-maple"
            )}
          >
            <GraduationCap className="w-5 h-5" />
            Mi Progreso
          </Link>
        </div>
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-4 border-t border-brand-oak/10 m-2 rounded-2xl bg-brand-mahogany/30">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-oak/20 flex items-center justify-center border border-brand-oak/30 uppercase font-bold text-brand-maple">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate">Juan Del Olmo</p>
            <p className="text-[0.6rem] text-brand-oak uppercase tracking-wider">Profesor Madera</p>
          </div>
        </div>
        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-walnut/50 hover:bg-brand-blood/20 text-brand-oak hover:text-brand-blood transition-colors">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
