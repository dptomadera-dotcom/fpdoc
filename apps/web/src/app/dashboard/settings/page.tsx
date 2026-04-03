'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Save, Building2, Bell, Shield, Palette, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('centro');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Configuración guardada correctamente');
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 bg-[var(--ink)] text-white rounded-2xl shadow-2xl shadow-black/30 border border-white/10"
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--teal)] flex-shrink-0" />
            <span className="text-sm font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-serif text-[var(--ink)] tracking-tight">Ajustes del Sistema</h1>
            <p className="text-[var(--ink3)] text-sm">Configura los parámetros globales de la plataforma FPdoc.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--teal)] text-white rounded-xl font-bold shadow-lg shadow-[var(--teal2)]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Tabs Sidebar */}
          <div className="w-64 space-y-1">
            {[
              { id: 'centro', label: 'Centro Educativo', icon: Building2 },
              { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
              { id: 'seguridad', label: 'Seguridad y RLS', icon: Shield },
              { id: 'apariencia', label: 'Apariencia (Tema)', icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-[var(--ink)] shadow-sm border border-[#e5e3dc]' 
                    : 'text-[var(--ink3)] hover:bg-white/50 border border-transparent'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[var(--teal)]' : 'opacity-40'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 space-y-6">
            {activeTab === 'centro' && (
              <div className="fp-card animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Información del Centro</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Nombre del Centro</label>
                    <input 
                      type="text" 
                      defaultValue="IES Antigravity Tech"
                      className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Código de Centro</label>
                      <input 
                        type="text" 
                        defaultValue="28012345"
                        className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Localidad</label>
                      <input 
                        type="text" 
                        defaultValue="Madrid"
                        className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Zona Horaria</label>
                    <select className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium">
                      <option>Europe/Madrid (GMT+1)</option>
                      <option>Atlantic/Canary (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="fp-card animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Configuración de Seguridad (Supabase)</h3>
                
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 mb-6">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <h4 className="text-[11px] font-bold text-amber-900 uppercase">Alerta de Permisos</h4>
                    <p className="text-[11px] text-amber-700/80 leading-relaxed mt-1">
                      Se han detectado errores de esquema (42501). Asegúrese de que las políticas RLS de Supabase permiten el acceso al rol 'anon'.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-xl border border-[#e5e3dc]">
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">Modo Estricto de Datos</div>
                      <div className="text-[10px] text-[var(--ink3)]">Forzar validación curricular en cada guardado.</div>
                    </div>
                    <div className="w-10 h-5 bg-[var(--teal)] rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-xl border border-[#e5e3dc]">
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">Auditoría de Cambios</div>
                      <div className="text-[10px] text-[var(--ink3)]">Registrar cada modificación en la tabla de justificación.</div>
                    </div>
                    <div className="w-10 h-5 bg-[var(--teal)] rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notificaciones' && (
              <div className="fp-card text-center py-12">
                <div className="text-3xl mb-2">🔔</div>
                <div className="text-sm font-bold text-[var(--ink3)]">Módulo de notificaciones en fase beta.</div>
              </div>
            )}

            {activeTab === 'apariencia' && (
              <div className="fp-card animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Tema Visual (Industrial Premium)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border-2 border-[var(--teal)] bg-white">
                    <div className="flex gap-2 mb-3">
                      <div className="w-4 h-4 rounded-full bg-[#1a1a24]"></div>
                      <div className="w-4 h-4 rounded-full bg-[#0d6e6e]"></div>
                      <div className="w-4 h-4 rounded-full bg-[#f9faf8]"></div>
                    </div>
                    <div className="text-xs font-bold">Oak & Ink (Actual)</div>
                  </div>
                  <div className="p-4 rounded-xl border border-[#e5e3dc] bg-[#0d0d12] text-white opacity-50 grayscale cursor-not-allowed">
                    <div className="flex gap-2 mb-3">
                      <div className="w-4 h-4 rounded-full bg-[#000]"></div>
                      <div className="w-4 h-4 rounded-full bg-[#333]"></div>
                      <div className="w-4 h-4 rounded-full bg-[#0d6e6e]"></div>
                    </div>
                    <div className="text-xs font-bold">Dark Walnut (Próximamente)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
