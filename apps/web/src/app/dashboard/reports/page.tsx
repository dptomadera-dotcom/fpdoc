'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  FileText, Download, Clock, CheckCircle, 
  Settings, Zap, BarChart3, ChevronRight, 
  Globe, ShieldCheck 
} from 'lucide-react';

const ReportCard = ({ title, desc, icon: Icon, color, onGenerate }: any) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="fp-card border-none bg-white p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group border-b-4"
    style={{ borderBottomColor: 'var(--' + color + ')' }}
  >
    <div 
      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12"
      style={{ backgroundColor: 'var(--' + color + '2)' }}
    >
      <Icon 
        className="w-6 h-6" 
        style={{ color: 'var(--' + color + ')' }}
      />
    </div>
    
    <h3 className="text-[15px] font-bold text-[var(--ink)] mb-2">{title}</h3>
    <p className="text-[11px] text-[var(--ink3)] leading-relaxed mb-6">{desc}</p>
    
    <button 
      onClick={() => onGenerate(title)}
      className="w-full h-9 bg-[var(--bg2)] text-[var(--ink)] text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 group-hover:bg-[var(--ink)] group-hover:text-white transition-all transform group-active:scale-95"
    >
      Generar Ahora <ChevronRight className="w-3 h-3" />
    </button>
  </motion.div>
);

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const handleGenerate = (type: string) => {
    setIsGenerating(true);
    // Simulate a complex generation process (Phase 2 core)
    setTimeout(() => {
      setIsGenerating(false);
      setLastGenerated(type);
      alert(`✅ ${type} generado con éxito y sincronizado con el servidor.`);
    }, 2000);
  };

  return (
    <DashboardLayout>
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center">
          <div className="bg-white p-10 rounded-3xl text-center max-w-sm animate-in zoom-in-95 duration-200">
            <div 
              className="w-20 h-20 border-4 rounded-full animate-spin mx-auto mb-6"
              style={{ borderColor: 'var(--teal2)', borderTopColor: 'var(--teal)' }}
            />
            <h2 className="text-xl font-bold mb-2">Compilando Informe...</h2>
            <p className="text-xs text-[var(--ink3)]">Extrayendo trazabilidad, métricas de seguimiento y cobertura de decretos.</p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 p-6 bg-gradient-to-br from-[var(--ink)] to-[#1a1a1a] rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-[var(--ink)]/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div 
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80"
                style={{ color: 'var(--teal2)' }}
              >
                Phase 2.1 • Document Excellence
              </div>
              <h1 className="text-3xl font-bold font-serif mb-2 tracking-tight">Centro de Informes y Memorias</h1>
              <p className="text-[13px] text-white/60 max-w-lg">Consolida automáticamente meses de actividad académica en documentos oficiales listos para inspección o auditoría con un clic.</p>
            </div>
            
            <button className="h-12 px-8 bg-[var(--teal)] text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-[var(--teal)]/40 hover:scale-105 transition-all flex items-center gap-3">
              <Zap className="w-4 h-4 text-white animate-pulse" /> Generación Inteligente
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--teal)] opacity-[0.05] rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <ReportCard 
            title="Memoria Final de Curso" 
            desc="Informe completo de ejecución curricular, cumplimiento de horas y justificación de cambios anuales." 
            icon={FileText} 
            color="teal" 
            onGenerate={handleGenerate}
          />
          <ReportCard 
            title="Informe de Seguimiento" 
            desc="Estado actual del departamento, ausencias, UTs cubiertas y tareas pendientes de validación." 
            icon={BarChart3} 
            color="amber" 
            onGenerate={handleGenerate}
          />
          <ReportCard 
            title="Cuadro de Mandos RA/CE" 
            desc="Visualización técnica de la cobertura de decretos por cada módulo y Resultado de Aprendizaje." 
            icon={ShieldCheck} 
            color="blue" 
            onGenerate={handleGenerate}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Historial de Generación */}
          <div className="lg:col-span-2 fp-card border-none bg-white p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold font-serif flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--ink3)]" /> Historial de Documentos
              </h2>
              <button className="text-[10px] font-bold text-[var(--teal)] hover:opacity-70 transition-all uppercase tracking-widest">Descargar Todo</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Memoria_DAW_2023.pdf', type: 'Final', date: 'Hoy, 10:45', size: '2.4 MB', icon: FileText },
                { name: 'Seguimiento_T1_DAM.docx', type: 'Trimestral', date: 'Ayer, 08:30', size: '1.1 MB', icon: FileText },
                { name: 'Cobertura_SI_Fase1.xlsx', type: 'Datos', date: '21 Mar 2024', size: '0.8 MB', icon: BarChart3 },
              ].map((doc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg2)]/50 border border-[#f0eee8] group hover:bg-white hover:border-[var(--teal2)] hover:shadow-lg transition-all cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-[var(--ink3)] group-hover:text-[var(--teal)] transition-colors">
                    <doc.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-[var(--ink)]">{doc.name}</div>
                    <div className="text-[10px] text-[var(--ink3)] font-medium uppercase tracking-tighter">{doc.type} • {doc.date}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-2 bg-[var(--ink)] text-white rounded-lg transition-opacity">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Configuración de Reportes */}
          <div className="fp-card border-none p-8" style={{ backgroundColor: 'var(--surface)' }}>
            <h2 className="text-lg font-bold font-serif mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[var(--ink3)]" /> Configuración
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[var(--ink2)] tracking-widest">Formato de Exportación</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    className="p-2 border-2 border-[#0d6e6e] rounded-xl text-[10px] font-bold"
                    style={{ backgroundColor: 'var(--teal2)', color: 'var(--teal)' }}
                  >
                    PDF (Oficial)
                  </button>
                  <button 
                    className="p-2 border border-[#e5e3dc] rounded-xl text-[10px] font-bold"
                    style={{ color: 'var(--ink3)' }}
                  >
                    Excel (Editable)
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#e5e3dc]">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[var(--ink2)]">Incluir Trazabilidad</span>
                  <div className="w-8 h-4 bg-[var(--teal)] rounded-full relative"><span className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></span></div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[var(--ink2)]">Anexo de RAs Cubiertos</span>
                  <div className="w-8 h-4 bg-[var(--teal)] rounded-full relative"><span className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></span></div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold opacity-40">
                  <span className="text-[var(--ink2)]">Firma Digital OE</span>
                  <div className="w-8 h-4 bg-gray-300 rounded-full relative"><span className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full"></span></div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 p-4 border border-dashed border-[#e5e3dc] rounded-2xl text-center">
              <div className="text-[10px] font-bold text-[var(--ink3)] mb-1 uppercase tracking-tighter">Auto-Sincronización</div>
              <div className="text-[9px] text-[var(--ink3)] font-medium">Informes generados en OneDrive/Google Drive semanalmente.</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
