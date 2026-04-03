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
          <div className="text-[26px] font-semibold text-[var(--ink)] leading-none">12</div>
          <div className="text-[11px] text-[var(--ink3)] mt-1 font-bold uppercase tracking-wider">Unidades Activas</div>
        </div>
        <div className="fp-card">
          <div className="text-[26px] font-semibold text-[var(--teal)] leading-none">84%</div>
          <div className="text-[11px] text-[var(--ink3)] mt-1 font-bold uppercase tracking-wider">Progreso Medio</div>
        </div>
        <div className="fp-card">
          <div className="text-[26px] font-semibold text-[var(--amber)] leading-none">3</div>
          <div className="text-[11px] text-[var(--ink3)] mt-1 font-bold uppercase tracking-wider">Cambios Pendientes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="fp-card">
          <h2 className="font-bold text-sm mb-4 flex items-center justify-between">
            Actividad del Currículo
            <span className="text-[10px] text-[var(--teal)] font-bold cursor-pointer hover:underline">Ver Historial</span>
          </h2>
          
          <div className="space-y-3">
            {[
              { title: 'UT 04: Configuración de Sistemas', sub: 'Módulo: Sistemas Informáticos', status: 'Modificado', color: 'amber' },
              { title: 'RA 02: Gestión de Almacenamiento', sub: 'Módulo: Bases de Datos', status: 'Validado', color: 'teal' },
              { title: 'Programación 2024 (Borrador)', sub: 'Dpto: Informática', status: 'En Proceso', color: 'gray' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-[#f0eee8] last:border-none">
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--ink)]">{item.title}</div>
                  <div className="text-[11px] text-[var(--ink3)]">{item.sub}</div>
                </div>
                <span className={`fp-badge ${
                  item.color === 'amber' ? 'bg-[var(--amber2)] text-[var(--amber)]' :
                  item.color === 'teal' ? 'bg-[var(--teal2)] text-[var(--teal)]' :
                  'bg-[var(--bg2)] text-[var(--ink3)]'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cola de Aprobación para Jefe de Departamento */}
        <div className="fp-card border-none bg-[var(--ink)] text-white shadow-xl shadow-[var(--ink)]/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--teal)]" />
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
                  <button className="flex-1 py-1.5 bg-[var(--teal)] text-white text-[10px] font-bold rounded-lg shadow-lg shadow-[var(--teal)]/10 group-hover:scale-[1.02] transition-transform">Revisar</button>
                  <button className="px-2 py-1.5 bg-white/10 text-white text-[10px] font-bold rounded-lg hover:bg-white/20">Aprobar</button>
                </div>
              </div>
            ))}
          </div>
          
          <Link href="/dashboard/programaciones" className="mt-6 block text-center text-[10px] font-black uppercase tracking-widest text-[var(--teal2)] hover:text-white transition-colors">
            Ver todas las programaciones →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}

