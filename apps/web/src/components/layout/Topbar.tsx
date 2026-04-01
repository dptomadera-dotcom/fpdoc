'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, Menu, User, LogOut } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10 transition-all duration-300">
      {/* Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar en el taller..." 
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/30 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      <div className="md:hidden">
        <button className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl relative transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0a] group-hover:scale-110 transiton-transform" />
        </button>
        
        <div className="h-6 w-px bg-white/10" />

        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white uppercase tracking-tighter">
                {user.role}
              </p>
              <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                {user.email}
              </p>
            </div>
            
            <div className="relative group/user">
              <button className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold hover:bg-blue-500/20 transition-all">
                {getInitials(user.email)}
              </button>
              
              {/* Dropdown menu (simplified) */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all py-1 p-1 z-50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group/logout"
                >
                  <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              href="/login"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20"
            >
              Registro
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
