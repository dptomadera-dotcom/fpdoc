'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, LogOut, GraduationCap, BookOpen, ShieldCheck, ChevronDown, Settings, User } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ROLE_META: Record<string, { label: string; color: string; bg: string; border: string; Icon: any }> = {
  ALUMNO:    { label: 'Alumnado',      color: '#0d9488', bg: 'rgba(13,148,136,0.12)',  border: 'rgba(13,148,136,0.3)',  Icon: GraduationCap },
  PROFESOR:  { label: 'Docente',       color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)',  Icon: BookOpen },
  JEFATURA:  { label: 'Departamento', color: '#d97706', bg: 'rgba(217,119,6,0.12)',  border: 'rgba(217,119,6,0.3)',   Icon: ShieldCheck },
  ADMIN:     { label: 'Admin',         color: '#e11d48', bg: 'rgba(225,29,72,0.12)',   border: 'rgba(225,29,72,0.3)',   Icon: ShieldCheck },
};

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await authService.logout();
  };

  const roleMeta = user ? (ROLE_META[user.role] || ROLE_META['PROFESOR']) : null;
  const RoleIcon = roleMeta?.Icon;
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : '??';

  return (
    <header className="h-16 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between sticky top-0 z-20 gap-4">

      {/* ── Búsqueda ─────────────────────────────────────────── */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
          <input
            type="text"
            placeholder="Búsqueda rápida…"
            className="w-full h-11 pl-11 pr-4 bg-white/5 border border-white/5 rounded-xl text-[13px] text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/40 transition-all outline-none"
          />
        </div>
      </div>

      {/* ── Zona derecha ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* Notificaciones */}
        <button className="relative w-10 h-10 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors rounded-xl hover:bg-white/5">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--teal)] rounded-full" />
        </button>

        {user && roleMeta ? (
          <>
            {/* Badge de rol — siempre visible */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 h-9 rounded-xl text-[10px] font-black uppercase tracking-wider border"
              style={{ background: roleMeta.bg, color: roleMeta.color, borderColor: roleMeta.border }}
            >
              <RoleIcon className="w-3.5 h-3.5" />
              {roleMeta.label}
            </div>

            {/* ── Botón "Cambiar rol / Cerrar sesión" ── */}
            <div className="relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2.5 h-10 pl-1 pr-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
              >
                {/* Avatar inicial */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0"
                  style={{ background: roleMeta.bg, color: roleMeta.color, border: `1px solid ${roleMeta.border}` }}
                >
                  {initials}
                </div>
                {/* Email abreviado */}
                <span className="hidden md:block text-[11px] font-medium text-white/50 max-w-[120px] truncate">
                  {user.email?.split('@')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-[#18181b] border border-white/10 rounded-[24px] shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    {/* Info usuario */}
                    <div className="px-5 py-4 border-b border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                          style={{ background: roleMeta.bg, color: roleMeta.color, border: `1px solid ${roleMeta.border}` }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{user.email}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <RoleIcon className="w-3 h-3" style={{ color: roleMeta.color }} />
                            <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: roleMeta.color }}>
                              {roleMeta.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="p-2">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <Settings className="w-4 h-4 text-white/30" />
                        Ajustes de perfil
                      </Link>

                      {/* ── SEPARADOR ── */}
                      <div className="my-1 h-px bg-white/5 mx-2" />

                      {/* ── CAMBIAR ROL / CERRAR SESIÓN ── */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors flex-shrink-0">
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        <div className="text-left">
                          <div className="text-[12px] font-black uppercase tracking-widest text-red-400">Cambiar de rol</div>
                          <div className="text-[10px] text-white/30 font-normal mt-0.5">Cerrar sesión e ir al acceso</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
