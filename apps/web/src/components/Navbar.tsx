'use client';

import React, { useEffect, useState } from 'react';
import { Cpu, LogOut, Menu, X, LayoutDashboard, Briefcase } from 'lucide-react';
import { authService } from '@/services/auth.service';
import Link from 'next/link';

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
    window.location.href = '/login';
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                <Cpu className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black tracking-tighter text-lg leading-none">TRANSVERSAL <span className="text-blue-500 italic">FP</span></span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 hidden sm:block">Gestión Industrial</span>
              </div>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-5">
                <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Panel
                </Link>
                <Link href="/projects" className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Proyectos
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{user.role}</span>
                  <span className="text-xs text-gray-400 font-medium max-w-[160px] truncate">{user.email}</span>
                </div>
                <div className="relative group">
                  <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-bold hover:bg-white/10 transition-all text-sm">
                    {getInitials(user.email)}
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-1">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Cuenta</p>
                      <p className="text-xs text-white font-bold truncate">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold">
                      <LogOut className="w-3.5 h-3.5" /> CERRAR SESIÓN
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Acceder</Link>
                <Link href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest">
                  Registro
                </Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl pt-20 px-6 flex flex-col gap-2 md:hidden">
          {user ? (
            <>
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black">
                  {getInitials(user.email)}
                </div>
                <div>
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{user.role}</p>
                  <p className="text-sm text-white font-medium">{user.email}</p>
                </div>
              </div>
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white font-bold hover:border-blue-500/30 transition-all">
                <LayoutDashboard className="w-5 h-5 text-blue-400" /> Panel de Control
              </Link>
              <Link href="/projects" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/5 border border-white/5 text-white font-bold hover:border-blue-500/30 transition-all">
                <Briefcase className="w-5 h-5 text-purple-400" /> Proyectos
              </Link>
              <div className="mt-auto pb-8">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition-all">
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:border-blue-500/30 transition-all">
                Iniciar Sesión
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
