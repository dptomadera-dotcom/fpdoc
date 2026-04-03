'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileUp, FileText } from 'lucide-react';

type Role = 'JEFE' | 'DOCENTE' | 'ALUMNO';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
  badge?: { text: string; color: 'red' | 'amber' | 'teal' | 'gray' };
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/dashboard', icon: '🏠', roles: ['JEFE', 'DOCENTE', 'ALUMNO'] },
  { label: 'Programaciones', href: '/dashboard/programaciones', icon: '📖', roles: ['JEFE', 'DOCENTE'], badge: { text: '2 Activas', color: 'teal' } },
  { label: 'Importar PDF', href: '/dashboard/curriculum/import', icon: '⚡', roles: ['JEFE', 'DOCENTE'] },
  { label: 'Informes', href: '/dashboard/reports', icon: '📊', roles: ['JEFE', 'DOCENTE'], badge: { text: 'Nuevo', color: 'teal' } },
  { label: 'Transversalidad', href: '/dashboard/transversal', icon: '🗺️', roles: ['JEFE'], badge: { text: 'Alerta', color: 'red' } },
  { label: 'Mis Módulos', href: '/dashboard/modules', icon: '📚', roles: ['DOCENTE', 'ALUMNO'] },
  { label: 'Ajustes', href: '/dashboard/settings', icon: '⚙️', roles: ['JEFE', 'DOCENTE', 'ALUMNO'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('JEFE'); // Default for development
  const pathname = usePathname();

  const filteredNav = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[var(--bg)]">
      {/* Top Navbar */}
      <nav className="h-12 bg-[var(--ink)] flex items-center px-6 gap-4 sticky top-0 z-50 shadow-md">
        <div className="text-white font-serif text-xl tracking-tight mr-auto flex items-center gap-2">
          FP<span className="text-[var(--teal2)] font-black italic">doc</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
        </div>
        
        {/* Role Selector (Dev only) */}
        <div className="hidden sm:flex bg-white/10 p-1 rounded-full border border-white/5 gap-1">
          {(['JEFE', 'DOCENTE', 'ALUMNO'] as Role[]).map(role => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                currentRole === role 
                  ? 'bg-white text-[var(--ink)] shadow-lg' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="flex gap-3 ml-4 items-center">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-tighter">Conectado como</span>
            <span className="text-[11px] text-white font-bold leading-none">Administrador</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-white/10 text-white/70 flex items-center justify-center text-xs hover:bg-white/20 transition-all">🔔</button>
          <button className="w-8 h-8 rounded-full bg-[var(--teal)] text-white flex items-center justify-center text-xs shadow-lg shadow-[var(--teal2)]/20">👤</button>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-[#e5e3dc] p-5 flex flex-col gap-1 sticky top-12 h-[calc(100vh-48px)]">
          <div className="text-[10px] font-bold text-[var(--ink3)] uppercase tracking-[0.2em] px-2 mb-4 opacity-50">Menú Académico</div>
          
          <div className="space-y-1">
            {filteredNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all group ${
                    isActive 
                      ? 'bg-[var(--bg2)] text-[var(--ink)] border border-[#e5e3dc] shadow-sm' 
                      : 'text-[var(--ink3)] hover:bg-[var(--bg2)] hover:text-[var(--ink)] border border-transparent'
                  }`}
                >
                  <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? 'grayscale-0' : 'grayscale'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span 
                      className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold"
                      style={{ 
                        backgroundColor: item.badge.color === 'red' ? 'var(--red2)' : 
                                       item.badge.color === 'amber' ? 'var(--amber2)' : 
                                       item.badge.color === 'teal' ? 'var(--teal2)' : 'var(--bg2)',
                        color: item.badge.color === 'red' ? 'var(--red)' : 
                               item.badge.color === 'amber' ? 'var(--amber)' : 
                               item.badge.color === 'teal' ? 'var(--teal)' : 'var(--ink3)',
                        border: !item.badge.color ? '1px solid #e5e3dc' : 'none'
                      }}
                    >
                      {item.badge.text}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div 
            className="mt-auto p-4 rounded-2xl border border-[#e5e3dc] relative overflow-hidden group"
            style={{ backgroundColor: 'var(--bg2)' }}
          >
            <div className="relative z-10">
              <div 
                className="text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: 'var(--ink)' }}
              >
                Centro Educativo
              </div>
              <div 
                className="text-[11px] font-medium"
                style={{ color: 'var(--ink3)' }}
              >
                IES Antigravity Tech
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 group-hover:opacity-10 transition-opacity rotate-12">🏢</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto bg-[var(--bg)] scroll-smooth">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm"
                  style={{ 
                    backgroundColor: currentRole === 'JEFE' ? 'var(--teal)' : 
                                   currentRole === 'DOCENTE' ? '#2563eb' : '#f97316',
                    color: 'white'
                  }}
                >
                  {currentRole === 'JEFE' ? 'Jefe Dpto.' : currentRole === 'DOCENTE' ? 'Docente' : 'Alumno'}
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--ink3)] opacity-30" />
                <span className="text-[10px] text-[var(--ink3)] font-bold uppercase tracking-tighter">FPDoc v1.2</span>
              </div>
              <h1 className="text-3xl font-bold font-serif text-[var(--ink)] tracking-tight">
                {pathname.includes('programaciones') ? 'Gestión de Programaciones' : 
                 pathname.includes('import') ? 'Importación Curricular' : 
                 'Panel Principal'}
              </h1>
            </div>
            
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-[var(--ink3)] font-bold uppercase">Estado Sistema</div>
                <div className="text-[11px] text-[var(--teal)] font-bold">● Operativo y Sincronizado</div>
              </div>
            </div>
          </header>
          
          <div className="min-h-[calc(100vh-250px)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
