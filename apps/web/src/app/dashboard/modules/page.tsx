'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Trophy, BookOpen, Clock, Target, 
  ArrowRight, Star, TrendingUp,
  MapPin, Zap, GraduationCap 
} from 'lucide-react';

const ModuleProgressCard = ({ module, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="fp-card border-none bg-white p-6 shadow-sm hover:shadow-xl group cursor-pointer transition-all border-l-4"
    style={{ borderLeftColor: module.progress > 80 ? 'var(--teal)' : module.progress > 40 ? 'var(--amber)' : 'var(--red)' }}
  >
    <div className="flex justify-between items-start mb-4">
      <div 
        className="p-3 rounded-2xl group-hover:text-white transition-colors"
        style={{ backgroundColor: 'var(--bg2)', color: 'var(--ink)' }}
      >
        <BookOpen className="w-5 h-5" />
      </div>
      <div className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-[0.2em]">{module.id} • 1º DAW</div>
    </div>
    
    <h3 className="text-sm font-bold text-[var(--ink)] mb-1">{module.name}</h3>
    <div className="flex items-center gap-2 mb-6">
      <Target className="w-3 h-3 text-[var(--ink3)] opacity-40" />
      <span className="text-[9px] font-bold text-[var(--ink3)] uppercase tracking-tighter">
        {module.achievedRAs} / {module.totalRAs} Resultados Logrados
      </span>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black">
        <span className="text-[var(--ink2)] uppercase tracking-widest">Progreso Global</span>
        <span className={module.progress > 50 ? 'text-[var(--teal)]' : 'text-[var(--amber)]'}>{module.progress}%</span>
      </div>
      <div className="h-2 bg-[var(--bg2)] rounded-full overflow-hidden border border-[#f0eee8]">
        <motion.div 
          initial={{ width: 0 }} animate={{ width: `${module.progress}%` }}
          className={`h-full rounded-full ${module.progress > 80 ? 'bg-[var(--teal)]' : 'bg-[var(--amber)] shadow-lg shadow-amber-500/20'}`}
        />
      </div>
    </div>
    
    <div className="mt-8 pt-4 border-t border-[#f0eee8] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-[9px] font-bold text-[var(--ink3)] uppercase">Ver Ruta de Logros</span>
      <div className="w-6 h-6 bg-[var(--ink)] text-white rounded-lg flex items-center justify-center">
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  </motion.div>
);

export default function StudentModulesPage() {
  const modules = [
    { id: 'SI', name: 'Sistemas Informáticos', progress: 65, achievedRAs: 3, totalRAs: 6 },
    { id: 'PR', name: 'Programación', progress: 42, achievedRAs: 2, totalRAs: 8 },
    { id: 'BD', name: 'Bases de Datos', progress: 88, achievedRAs: 5, totalRAs: 6 },
    { id: 'ED', name: 'Entornos de Des.', progress: 15, achievedRAs: 0, totalRAs: 4 },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="h-[1px] w-8 bg-[var(--ink3)] opacity-20" />
              <div className="text-[10px] text-[var(--ink3)] font-black uppercase tracking-[0.4em]">Estudiante Ciclo DAW</div>
            </div>
            <h1 className="text-4xl font-bold font-serif text-[var(--ink)] tracking-tight mb-2">Tu Hoja de Ruta Académica</h1>
            <p className="text-[13px] text-[var(--ink3)] max-w-lg leading-relaxed italic opacity-80 decoration-[var(--teal)] decoration-4">Rastrea tu dominio sobre cada competencia y prepárate para los próximos retos.</p>
          </div>

          <div className="bg-[var(--ink)] shadow-2xl shadow-[var(--ink)]/20 text-white p-6 rounded-[32px] md:w-64 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Logro Total Ciclo</div>
              <div className="text-3xl font-black mb-4 flex items-baseline gap-1">52.5<span className="text-sm opacity-50">%</span></div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: '52.5%' }} className="h-full bg-[var(--teal2)]" />
              </div>
              <div className="text-[9px] font-bold text-white/50 flex items-center gap-1"><Zap className="w-3 h-3 text-[var(--amber)]" /> Próximo hito: 60%</div>
            </div>
            <Trophy className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </header>

        {/* Global Progress Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/50 backdrop-blur-sm border border-[#e5e3dc] p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-white cursor-pointer hover:shadow-xl">
             <div className="w-10 h-10 rounded-2xl bg-[var(--teal2)] flex items-center justify-center text-[var(--teal)]"><Star className="w-5 h-5 fill-current" /></div>
             <div>
               <div className="text-[10px] font-black text-[var(--ink3)] uppercase opacity-50">Logro Reciente</div>
               <div className="text-[11px] font-bold text-[var(--ink)]">Estructuras en SQL (BD)</div>
             </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-[#e5e3dc] p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-white cursor-pointer hover:shadow-xl">
             <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600"><Clock className="w-5 h-5" /></div>
             <div>
               <div className="text-[10px] font-black text-[var(--ink3)] uppercase opacity-50">Próximo Reto</div>
               <div className="text-[11px] font-bold text-[var(--ink)]">RA 3: Config Apache (SI)</div>
             </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm border border-[#e5e3dc] p-4 rounded-3xl flex items-center gap-4 transition-all hover:bg-white cursor-pointer hover:shadow-xl">
             <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600"><TrendingUp className="w-5 h-5" /></div>
             <div>
               <div className="text-[10px] font-black text-[var(--ink3)] uppercase opacity-50">Tendencia</div>
               <div className="text-[11px] font-bold text-[var(--ink)]">+12% esta semana</div>
             </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modules.map((m, i) => (
            <ModuleProgressCard key={m.id} module={m} index={i} />
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 fp-card border-none bg-white p-8 overflow-hidden relative group">
            <h2 className="text-xl font-bold font-serif mb-8 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--ink3)]" /> Tu próxima meta para cada módulo
            </h2>
            <div className="space-y-4">
              {[
                { mod: 'BD', ra: 'RA 4: PL/SQL', desc: 'Dominio de procedimientos y triggers.', date: 'Semana 12' },
                { mod: 'SI', ra: 'RA 2: Servidores', desc: 'Instalación básica de Linux Server.', date: 'Semana 10' },
                { mod: 'PR', ra: 'RA 5: Gestión memoria', desc: 'Control de punteros y buffers.', date: 'Semana 14' },
              ].map((goal, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-[var(--teal2)] hover:bg-white hover:shadow-lg transition-all cursor-pointer group/item"
                  style={{ backgroundColor: 'rgba(236, 234, 228, 0.5)' }}
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-[var(--ink)] text-[11px]">
                    {goal.mod}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-[var(--ink)]">{goal.ra}</div>
                    <div className="text-[10px] text-[var(--ink3)] font-medium leading-tight">{goal.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black text-[var(--teal)] uppercase mb-1">{goal.date}</div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] ml-auto" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-[var(--teal2)] opacity-10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          </div>

          <div className="bg-[var(--bg2)]/80 p-8 rounded-[32px] border border-[#e5e3dc] relative overflow-hidden flex flex-col items-center text-center justify-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl border border-[#f0eee8] transform rotate-12 group-hover:rotate-0 transition-transform text-3xl">
              🏅
            </div>
            <h3 className="text-lg font-bold font-serif mb-2">Insignias por Desbloquear</h3>
            <p className="text-[11px] text-[var(--ink3)] leading-relaxed mb-6">Completa todos los criterios de evaluación de un RA para ganar tu insignia oficial de módulo.</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="w-10 h-10 bg-white/50 rounded-lg border border-dashed border-[#e5e3dc] flex items-center justify-center opacity-40">🛠️</div>
              <div className="w-10 h-10 bg-white/50 rounded-lg border border-dashed border-[#e5e3dc] flex items-center justify-center opacity-40">🔌</div>
              <div className="w-10 h-10 bg-white/50 rounded-lg border border-dashed border-[#e5e3dc] flex items-center justify-center opacity-40">🛡️</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
