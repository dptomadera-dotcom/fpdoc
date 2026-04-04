'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, LogOut, Menu, X, LayoutDashboard, Briefcase } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(authService.getCurrentUser());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY > 20) setMobileOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl' 
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Cpu className="text-[var(--teal)] w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold font-serif tracking-tighter text-2xl leading-none">
                  FP<span className="text-[var(--teal)] italic">doc</span>
                </span>
                <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] mt-0.5 hidden sm:block">Gestión Premium</span>
              </div>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-[var(--teal)]" /> Inicio
                </Link>
                <Link href="/projects" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--teal)]" /> Mis Proyectos
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-[var(--teal)] font-black uppercase tracking-widest mb-0.5">{user.role}</span>
                  <span className="text-[10px] text-white/40 font-bold max-w-[140px] truncate">{user.email}</span>
                </div>
                <div className="relative group">
                  <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white font-black hover:bg-white/10 transition-all text-xs shadow-sm">
                    {getInitials(user.email)}
                  </button>
                  <div className="absolute top-full right-0 mt-3 w-56 bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                    <div className="px-4 py-4 border-b border-white/5 mb-1">
                      <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1.5">Usuario Identificado</p>
                      <p className="text-xs text-white font-bold truncate">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-black uppercase tracking-widest">
                      <LogOut className="w-4 h-4" /> CERRAR SESIÓN
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" className="text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Acceder</Link>
                <Link href="/register" className="h-11 px-6 bg-[var(--teal)] text-white text-[10px] font-black rounded-2xl transition-all shadow-xl shadow-[var(--teal)]/20 uppercase tracking-widest flex items-center">
                  Empieza Gratis
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-11 h-11 flex items-center justify-center text-white bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all shadow-sm"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl pt-28 px-6 flex flex-col gap-3 md:hidden"
          >
            {user ? (
              <>
                <div className="flex items-center gap-4 bg-white/5 rounded-3xl p-5 mb-4 border border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 shadow-sm flex items-center justify-center text-[var(--teal)] font-black text-sm">
                    {getInitials(user.email)}
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--teal)] font-black uppercase tracking-widest mb-0.5">{user.role}</p>
                    <p className="text-sm text-white font-bold">{user.email}</p>
                  </div>
                </div>
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 px-6 py-5 rounded-[24px] bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:border-[var(--teal)] transition-all shadow-sm">
                  <LayoutDashboard className="w-5 h-5 text-[var(--teal)]" /> Panel de Control
                </Link>
                <Link href="/projects" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 px-6 py-5 rounded-[24px] bg-white/5 border border-white/5 text-white font-black text-xs uppercase tracking-widest hover:border-[var(--teal)] transition-all shadow-sm">
                  <Briefcase className="w-5 h-5 text-[var(--teal)]" /> Mis Proyectos
                </Link>
                <div className="mt-auto pb-10">
                  <button onClick={handleLogout} className="w-full h-16 flex items-center justify-center gap-3 bg-red-400/10 border border-red-400/10 text-red-400 font-black text-xs uppercase tracking-[0.2em] rounded-[24px] hover:bg-red-400 hover:text-white transition-all shadow-sm">
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-16 px-6 rounded-[24px] bg-white/5 border border-white/5 text-white font-black text-sm uppercase tracking-widest shadow-sm">
                  Iniciar Sesión
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center h-16 px-6 rounded-[24px] bg-[var(--teal)] text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-[var(--teal)]/30">
                  Registrarse
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
