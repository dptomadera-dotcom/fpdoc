'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Cpu,
  Settings,
  LogOut,
  Sparkles,
  Plus,
  GraduationCap,
  ShieldCheck,
  FileText,
  BarChart3,
  Users,
  Workflow,
  FileSearch,
  Calendar,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth.service';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  roles?: string[];
  group: string;
}

const navigation: NavItem[] = [
  // ── Comunes ──
  { name: 'Inicio', href: '/dashboard', icon: LayoutDashboard, roles: ['JEFATURA', 'PROFESOR', 'ALUMNO'], group: 'principal' },

  // ── Alumno ──
  { name: 'Mis Módulos', href: '/dashboard/programaciones', icon: FolderOpen, roles: ['ALUMNO'], group: 'alumno' },
  { name: 'Mi Progreso', href: '/dashboard/modules', icon: BarChart3, roles: ['ALUMNO'], group: 'alumno' },

  // ── Docente + Jefe ──
  { name: 'Programaciones', href: '/dashboard/programaciones', icon: BookOpen, roles: ['JEFATURA', 'PROFESOR'], group: 'docente' },
  { name: 'Programación Viva', href: '/dashboard/programacion-viva', icon: Workflow, roles: ['JEFATURA', 'PROFESOR'], badge: 'NUEVO', group: 'docente' },
  { name: 'IA Docente', href: '/dashboard/ai', icon: Cpu, roles: ['JEFATURA', 'PROFESOR'], badge: 'IA', group: 'docente' },
  { name: 'Currículo', href: '/dashboard/curriculum/import', icon: FileSearch, roles: ['JEFATURA', 'PROFESOR'], group: 'docente' },

  // ── Solo Jefe ──
  { name: 'Transversalidad', href: '/dashboard/transversal', icon: Target, roles: ['JEFATURA'], group: 'jefe' },
  { name: 'Coordinación', href: '/dashboard/coordinacion', icon: Users, roles: ['JEFATURA'], group: 'jefe' },
  { name: 'Informes', href: '/dashboard/reports', icon: BarChart3, roles: ['JEFATURA'], group: 'jefe' },
];

const ROLE_META: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  ALUMNO: { label: 'Alumnado', color: 'var(--teal)', bg: 'rgba(20, 184, 166, 0.1)', Icon: GraduationCap },
  PROFESOR: { label: 'Profesorado', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', Icon: BookOpen },
  JEFATURA: { label: 'Departamento', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', Icon: ShieldCheck },
};

const GROUP_LABELS: Record<string, string> = {
  principal: 'Principal',
  alumno: 'Mi Espacio',
  docente: 'Gestión Docente',
  jefe: 'Jefatura',
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = async () => {
    await authService.logout(); // ya redirige internamente vía window.location
  };

  const role = user?.role || 'PROFESOR';
  const roleMeta = ROLE_META[role] || ROLE_META['PROFESOR'];
  const RoleIcon = roleMeta.Icon;

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(role);
  });

  // Agrupar items por group
  const groups = Array.from(new Set(filteredNavigation.map(i => i.group)));

  return (
    <aside className="w-[280px] flex flex-col bg-[var(--ink)] text-white h-screen sticky top-0 overflow-hidden z-30">
      {/* Brand */}
      <div className="p-8 pb-6 flex flex-col gap-1 items-start border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--teal)] to-[var(--teal3)] rounded-[16px] flex items-center justify-center shadow-xl shadow-[var(--teal)]/20 transition-transform group-hover:rotate-6">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-serif tracking-tighter leading-none">
              FP<span className="text-[var(--teal)] italic">doc</span>
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">v3.0 Production</span>
          </div>
        </Link>

        {/* Badge de rol */}
        {user && (
          <div
            className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest"
            style={{ background: roleMeta.bg, color: roleMeta.color, border: `1px solid ${roleMeta.color}30` }}
          >
            <RoleIcon className="w-3.5 h-3.5" />
            {roleMeta.label}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 overflow-y-auto scrollbar-hide py-4 space-y-5">
        {groups.map(group => {
          const items = filteredNavigation.filter(i => i.group === group);
          return (
            <div key={group}>
              <h3 className="px-3 text-[9px] font-black uppercase tracking-[0.25em] text-white/20 mb-2">{GROUP_LABELS[group] || group}</h3>
              <div className="space-y-1">
                {items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group relative h-11 px-4 rounded-xl text-[13px] font-medium transition-all duration-200 flex items-center gap-3',
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebar"
                          className="absolute left-0 w-1 h-6 rounded-r-full"
                          style={{ background: roleMeta.color }}
                        />
                      )}
                      <item.icon className={cn(
                        'w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60'
                      )} style={isActive ? { color: roleMeta.color } : {}} />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[var(--teal)]/20 text-[var(--teal)] border border-[var(--teal)]/20 tracking-tighter uppercase">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Herramientas */}
        <div>
          <h3 className="px-3 text-[9px] font-black uppercase tracking-[0.25em] text-white/20 mb-2">Herramientas</h3>
          <div className="space-y-1">
            <Link href="/dashboard/settings" className={cn('group h-11 px-4 rounded-xl text-[13px] font-medium flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 transition-all')}>
              <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform text-white/30 group-hover:text-white/60" />
              Ajustes
            </Link>
            {(role === 'PROFESOR' || role === 'JEFATURA') && (
              <Link href="/dashboard/curriculum/import" className="group h-11 px-4 rounded-xl text-[13px] font-medium flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/5 transition-all">
                <Plus className="w-4 h-4 text-[var(--teal)]" />
                Nueva Programación
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Perfil / Footer */}
      <div className="p-5 border-t border-white/5">
        <div className="bg-white/[0.04] hover:bg-white/[0.07] rounded-2xl p-4 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-8 -translate-y-4" style={{ background: `${roleMeta.color}30` }} />
          <div className="flex items-center gap-3 mb-4 relative">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border"
              style={{ background: roleMeta.bg, color: roleMeta.color, borderColor: `${roleMeta.color}30` }}
            >
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate text-white">{user?.email?.split('@')[0] || 'Usuario'}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: roleMeta.color }}>{roleMeta.label}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full h-10 rounded-xl bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
