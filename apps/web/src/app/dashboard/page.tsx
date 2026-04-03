'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { curriculumService } from '@/services/curriculum.service';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="fp-card">
          <div className="text-[26px] font-semibold leading-none" style={{ color: 'var(--ink)' }}>12</div>
          <div className="text-[11px] mt-1 font-bold uppercase tracking-wider" style={{ color: 'var(--ink3)' }}>Unidades Activas</div>
        </div>
        <div className="fp-card">
          <div className="text-[26px] font-semibold leading-none" style={{ color: 'var(--teal)' }}>84%</div>
          <div className="text-[11px] mt-1 font-bold uppercase tracking-wider" style={{ color: 'var(--ink3)' }}>Progreso Medio</div>
        </div>
        <div className="fp-card">
          <div className="text-[26px] font-semibold leading-none" style={{ color: 'var(--amber)' }}>3</div>
          <div className="text-[11px] mt-1 font-bold uppercase tracking-wider" style={{ color: 'var(--ink3)' }}>Cambios Pendientes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="fp-card">
          <h2 className="font-bold text-sm mb-4 flex items-center justify-between">
            Actividad del Currículo
            <span 
              className="text-[10px] font-bold cursor-pointer hover:underline"
              style={{ color: 'var(--teal)' }}
            >
              Ver Historial
            </span>
          </h2>
          
          <div className="space-y-3">
            {[
              { title: 'UT 04: Configuración de Sistemas', sub: 'Módulo: Sistemas Informáticos', status: 'Modificado', color: 'amber' },
              { title: 'RA 02: Gestión de Almacenamiento', sub: 'Módulo: Bases de Datos', status: 'Validado', color: 'teal' },
              { title: 'Programación 2024 (Borrador)', sub: 'Dpto: Informática', status: 'En Proceso', color: 'gray' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#f0eee8] last:border-none">
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{item.title}</div>
                  <div className="text-[11px]" style={{ color: 'var(--ink3)' }}>{item.sub}</div>
                </div>
                <span 
                  className="fp-badge"
                  style={{ 
                    backgroundColor: item.color === 'amber' ? 'var(--amber2)' : 
                                   item.color === 'teal' ? 'var(--teal2)' : 'var(--bg2)',
                    color: item.color === 'amber' ? 'var(--amber)' : 
                           item.color === 'teal' ? 'var(--teal)' : 'var(--ink3)'
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cola de Aprobación para Jefe de Departamento */}
        <div 
          className="fp-card border-none text-white shadow-xl" 
          style={{ backgroundColor: 'var(--ink)', boxShadow: '0 20px 25px -5px rgba(26, 26, 36, 0.25)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--teal)' }} />
              Cola de Validación
            </h2>
            <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] font-black">4 PENDIENTES</span>
          </div>
          
          <div className="space-y-4">
            {[
              { author: 'J. Pérez', type: 'Cambio UT', doc: 'Sistemas Inf.', time: '2h' },
              { author: 'L. Mosa', type: 'Nuevo RA', doc: 'Bases de Datos', time: '5h' },
              { author: 'R. Velasco', type: 'Ajuste CE', doc: 'Programación', time: '1d' },
            ].map((task, i) => (
              <div key={i} className="group p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[12px] font-bold">{task.type}</div>
                  <div className="text-[10px] opacity-40 uppercase font-black">{task.time}</div>
                </div>
                <div className="text-[11px] opacity-60 mb-3">{task.author} en {task.doc}</div>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-1.5 text-white text-[10px] font-bold rounded-lg shadow-lg group-hover:scale-[1.02] transition-transform"
                    style={{ backgroundColor: 'var(--teal)', boxShadow: '0 10px 15px -3px rgba(13, 110, 110, 0.2)' }}
                  >
                    Revisar
                  </button>
                  <button className="px-2 py-1.5 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20">Aprobar</button>
                </div>
              </div>
            ))}
          </div>
          
          <Link 
            href="/dashboard/programaciones" 
            className="mt-6 block text-center text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
            style={{ color: 'var(--teal2)' }}
          >
            Ver todas las programaciones →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

