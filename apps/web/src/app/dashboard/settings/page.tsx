'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Save, Building2, Bell, Shield, Palette, CheckCircle2, Cpu, Loader2, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLlmConfig, saveLlmConfig, aiService, LlmConfig } from '@/services/ai.service';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('centro');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'error' } | null>(null);

  // ── LLM config state ──
  const [llmConfig, setLlmConfig] = useState<LlmConfig>({ provider: 'anthropic' });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; model?: string; error?: string } | null>(null);

  useEffect(() => {
    setLlmConfig(getLlmConfig());
  }, []);

  const showToast = (msg: string, type: 'ok' | 'error' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    if (activeTab === 'ia') {
      saveLlmConfig(llmConfig);
    }
    setTimeout(() => {
      setIsSaving(false);
      showToast('Configuración guardada correctamente');
    }, 600);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await aiService.testConnection(llmConfig);
    setTestResult(result);
    setTesting(false);
    if (result.ok) showToast(`Conexión OK · ${result.model}`, 'ok');
    else showToast(`Error: ${result.error}`, 'error');
  };

  const tabs = [
    { id: 'centro',         label: 'Centro Educativo', icon: Building2 },
    { id: 'ia',             label: 'Inteligencia Artificial', icon: Cpu },
    { id: 'notificaciones', label: 'Notificaciones',   icon: Bell },
    { id: 'seguridad',      label: 'Seguridad y RLS',  icon: Shield },
    { id: 'apariencia',     label: 'Apariencia',        icon: Palette },
  ];

  return (
    <DashboardLayout>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border ${
              toast.type === 'error'
                ? 'bg-red-950 border-red-800 text-red-200'
                : 'bg-[var(--ink)] border-white/10 text-white'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${toast.type === 'error' ? 'text-red-400' : 'text-[var(--teal)]'}`} />
            <span className="text-sm font-bold">{toast.msg}</span>
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
          {/* Tabs */}
          <div className="w-64 space-y-1">
            {tabs.map((tab) => (
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

          {/* Content */}
          <div className="flex-1 space-y-6">

            {/* ── Centro ── */}
            {activeTab === 'centro' && (
              <div className="fp-card animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Información del Centro</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Nombre del Centro</label>
                    <input type="text" defaultValue="IES Antigravity Tech" className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Código de Centro</label>
                      <input type="text" defaultValue="28012345" className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Localidad</label>
                      <input type="text" defaultValue="Madrid" className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium" />
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

            {/* ── IA ── */}
            {activeTab === 'ia' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">

                {/* Selector de proveedor */}
                <div className="fp-card">
                  <h3 className="font-bold text-sm mb-1 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[var(--teal)]" /> Proveedor de IA
                  </h3>
                  <p className="text-[11px] text-[var(--ink3)] mb-5">Elige entre la API de Claude (Anthropic) o un modelo instalado localmente en tu servidor.</p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Claude */}
                    <button
                      onClick={() => { setLlmConfig(c => ({ ...c, provider: 'anthropic' })); setTestResult(null); }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        llmConfig.provider === 'anthropic'
                          ? 'border-[var(--teal)] bg-[var(--teal)]/5'
                          : 'border-[#e5e3dc] hover:border-[var(--ink3)]/30'
                      }`}
                    >
                      <div className="text-lg mb-1">☁️</div>
                      <div className="text-[12px] font-black text-[var(--ink)]">Claude · Anthropic</div>
                      <div className="text-[10px] text-[var(--ink3)] mt-1 leading-relaxed">API cloud. Mayor calidad. Requiere clave API en el servidor.</div>
                      {llmConfig.provider === 'anthropic' && (
                        <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-[var(--teal)]">Seleccionado</div>
                      )}
                    </button>

                    {/* Local */}
                    <button
                      onClick={() => { setLlmConfig(c => ({ ...c, provider: 'local', endpoint: c.endpoint ?? 'http://localhost:11434/v1', model: c.model ?? 'llama3.2' })); setTestResult(null); }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        llmConfig.provider === 'local'
                          ? 'border-[var(--teal)] bg-[var(--teal)]/5'
                          : 'border-[#e5e3dc] hover:border-[var(--ink3)]/30'
                      }`}
                    >
                      <div className="text-lg mb-1">🏠</div>
                      <div className="text-[12px] font-black text-[var(--ink)]">Local · OpenAI-compatible</div>
                      <div className="text-[10px] text-[var(--ink3)] mt-1 leading-relaxed">Ollama, LM Studio, Jan.ai. Sin coste. Datos no salen del centro.</div>
                      {llmConfig.provider === 'local' && (
                        <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-[var(--teal)]">Seleccionado</div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Config local */}
                {llmConfig.provider === 'local' && (
                  <div className="fp-card animate-in fade-in slide-in-from-top-2 duration-200">
                    <h3 className="font-bold text-sm mb-5 pb-2 border-b border-[#f0eee8]">Configuración del modelo local</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Endpoint (URL base)</label>
                        <input
                          type="url"
                          value={llmConfig.endpoint ?? 'http://localhost:11434/v1'}
                          onChange={e => setLlmConfig(c => ({ ...c, endpoint: e.target.value }))}
                          placeholder="http://servidor-ollama:11434/v1"
                          className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium font-mono"
                        />
                        <p className="text-[10px] text-[var(--ink3)] mt-1 ml-1">Para Ollama el endpoint es <code className="bg-[var(--bg2)] px-1 rounded">http://HOST:11434/v1</code></p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Nombre del modelo</label>
                        <input
                          type="text"
                          value={llmConfig.model ?? 'llama3.2'}
                          onChange={e => setLlmConfig(c => ({ ...c, model: e.target.value }))}
                          placeholder="llama3.2 / mistral / gemma2"
                          className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium font-mono"
                        />
                        <p className="text-[10px] text-[var(--ink3)] mt-1 ml-1">Ejecuta <code className="bg-[var(--bg2)] px-1 rounded">ollama list</code> para ver los modelos instalados.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Anthropic */}
                {llmConfig.provider === 'anthropic' && (
                  <div className="fp-card animate-in fade-in slide-in-from-top-2 duration-200">
                    <h3 className="font-bold text-sm mb-3 pb-2 border-b border-[#f0eee8]">Configuración de Anthropic</h3>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                      La clave de API de Anthropic (<code className="bg-blue-100 px-1 rounded">ANTHROPIC_API_KEY</code>) se configura como variable de entorno en el servidor backend, no aquí. Si no está configurada, el chat mostrará un error.
                    </div>
                  </div>
                )}

                {/* Test de conexión */}
                <div className="fp-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm">Probar conexión</h3>
                      <p className="text-[11px] text-[var(--ink3)] mt-0.5">Envía una petición de prueba con la configuración actual.</p>
                    </div>
                    <button
                      onClick={handleTestConnection}
                      disabled={testing}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--ink)] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[var(--ink)]/80 transition-all disabled:opacity-50"
                    >
                      {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                      {testing ? 'Probando...' : 'Probar'}
                    </button>
                  </div>

                  {testResult && (
                    <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 text-[11px] font-bold ${
                      testResult.ok ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
                    }`}>
                      {testResult.ok ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-500" />}
                      {testResult.ok ? `Conexión OK · Modelo: ${testResult.model}` : `Error: ${testResult.error}`}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Seguridad ── */}
            {activeTab === 'seguridad' && (
              <div className="fp-card animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Configuración de Seguridad</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Modo Estricto de Datos', desc: 'Forzar validación curricular en cada guardado.' },
                    { label: 'Auditoría de Cambios', desc: 'Registrar cada modificación en la tabla de auditoría.' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[var(--bg)] rounded-xl border border-[#e5e3dc]">
                      <div>
                        <div className="text-xs font-bold text-[var(--ink)]">{item.label}</div>
                        <div className="text-[10px] text-[var(--ink3)]">{item.desc}</div>
                      </div>
                      <div className="w-10 h-5 bg-[var(--teal)] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                      </div>
                    </div>
                  ))}
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
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Tema Visual</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border-2 border-[var(--teal)] bg-white">
                    <div className="flex gap-2 mb-3">
                      <div className="w-4 h-4 rounded-full bg-[#1a1a24]" />
                      <div className="w-4 h-4 rounded-full bg-[#0d6e6e]" />
                      <div className="w-4 h-4 rounded-full bg-[#f9faf8]" />
                    </div>
                    <div className="text-xs font-bold">Oak & Ink (Actual)</div>
                  </div>
                  <div className="p-4 rounded-xl border border-[#e5e3dc] bg-[#0d0d12] text-white opacity-50 grayscale cursor-not-allowed">
                    <div className="flex gap-2 mb-3">
                      <div className="w-4 h-4 rounded-full bg-[#000]" />
                      <div className="w-4 h-4 rounded-full bg-[#333]" />
                      <div className="w-4 h-4 rounded-full bg-[#0d6e6e]" />
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
