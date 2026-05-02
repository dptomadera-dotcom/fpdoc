'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useAuthGuard } from '@/lib/use-auth-guard';
import {
  Save, Building2, Bell, Shield, Palette, CheckCircle2,
  BrainCircuit, Key, Loader2, Wifi, WifiOff, Eye, EyeOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadLlmConfig, saveLlmConfig, aiService, LlmConfig } from '@/services/ai.service';
import { applyTheme, getSavedTheme } from '@/components/theme-provider';
import { getModelsByProvider, ACTIVE_MODELS, type ModelProvider } from '@fpdoc/ai-models';

// ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  useAuthGuard();
  const [activeTab, setActiveTab] = useState('centro');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // ── Tema ──
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    setSelectedTheme(getSavedTheme());
  }, []);

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSelectedTheme(theme);
    applyTheme(theme);
    showToast(theme === 'light' ? 'Tema Oak & Ink activado' : 'Tema Dark Walnut activado');
  };

  // ── IA state ──
  const [llmProvider, setLlmProvider] = useState<ModelProvider>('anthropic');
  const [llmApiKey, setLlmApiKey]     = useState('');
  const [llmEndpoint, setLlmEndpoint] = useState('');
  const [llmModel, setLlmModel]       = useState('');
  const [llmModelCustom, setLlmModelCustom] = useState('');
  const [showKey, setShowKey]         = useState(false);
  const [llmLoading, setLlmLoading]   = useState(false);
  const [testStatus, setTestStatus]   = useState<'idle' | 'ok' | 'error'>('idle');
  const [testMsg, setTestMsg]         = useState('');

  // Cargar config guardada al entrar en la pestaña IA
  useEffect(() => {
    if (activeTab !== 'ia') return;
    loadLlmConfig().then(cfg => {
      if (!cfg) return;
      setLlmProvider(cfg.provider);
      setLlmApiKey(cfg.apiKey ?? '');
      setLlmEndpoint(cfg.endpoint ?? '');
      setLlmModel(cfg.model ?? '');
    });
  }, [activeTab]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Configuración guardada correctamente');
    }, 1000);
  };

  // Resolver modelo real (soporta modelo personalizado en local)
  const resolveModel = () => llmModel === '__custom__' ? llmModelCustom.trim() : llmModel.trim();

  // Guardar config IA en Supabase
  const handleSaveIa = async () => {
    setLlmLoading(true);
    try {
      const cfg: LlmConfig = {
        provider: llmProvider,
        apiKey: llmApiKey.trim() || undefined,
        endpoint: llmEndpoint.trim() || undefined,
        model: resolveModel() || undefined,
      };
      await saveLlmConfig(cfg);
      showToast('Configuración de IA guardada');
    } catch (err: any) {
      showToast(err.message ?? 'Error al guardar', false);
    } finally {
      setLlmLoading(false);
    }
  };

  // Probar conexión
  const handleTest = async () => {
    setLlmLoading(true);
    setTestStatus('idle');
    try {
      const cfg: LlmConfig = {
        provider: llmProvider,
        apiKey: llmApiKey.trim() || undefined,
        endpoint: llmEndpoint.trim() || undefined,
        model: resolveModel() || undefined,
      };
      const result = await aiService.testConnection(cfg);
      if (result.ok) {
        setTestStatus('ok');
        setTestMsg(result.model ? `Conectado · ${result.model}` : 'Conexión exitosa');
      } else {
        setTestStatus('error');
        setTestMsg(result.error ?? 'Error desconocido');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMsg(err.message ?? 'Error al conectar');
    } finally {
      setLlmLoading(false);
    }
  };

  const tabs = [
    { id: 'centro',         label: 'Centro Educativo',    icon: Building2 },
    { id: 'notificaciones', label: 'Notificaciones',       icon: Bell },
    { id: 'seguridad',      label: 'Seguridad y RLS',      icon: Shield },
    { id: 'apariencia',     label: 'Apariencia (Tema)',    icon: Palette },
    { id: 'ia',             label: 'Inteligencia Artificial', icon: BrainCircuit },
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
              toast.ok
                ? 'bg-[var(--ink)] text-white border-white/10'
                : 'bg-red-700 text-white border-red-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[var(--teal)] flex-shrink-0" />
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
          {activeTab !== 'ia' && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--teal)] text-white rounded-xl font-bold shadow-lg shadow-[var(--teal2)]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Tabs Sidebar */}
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

          {/* Form Content */}
          <div className="flex-1 space-y-6">

            {/* ── Centro ── */}
            {activeTab === 'centro' && (
              <div className="fp-card animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="font-bold text-sm mb-6 pb-2 border-b border-[#f0eee8]">Información del Centro</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Nombre del Centro</label>
                    <input type="text" defaultValue="IES Antigravity Tech"
                      className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Código de Centro</label>
                      <input type="text" defaultValue="28012345"
                        className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Localidad</label>
                      <input type="text" defaultValue="Madrid"
                        className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium" />
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

            {/* ── Seguridad ── */}
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

            {/* ── Notificaciones ── */}
            {activeTab === 'notificaciones' && (
              <div className="fp-card text-center py-12">
                <div className="text-3xl mb-2">🔔</div>
                <div className="text-sm font-bold text-[var(--ink3)]">Módulo de notificaciones en fase beta.</div>
              </div>
            )}

            {/* ── Apariencia ── */}
            {activeTab === 'apariencia' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="fp-card">
                  <h3 className="font-bold text-sm mb-2 pb-2 border-b border-[#f0eee8] flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[var(--teal)]" /> Tema Visual
                  </h3>
                  <p className="text-[11px] text-[var(--ink3)] mb-5">El tema se aplica instantáneamente y se guarda en este dispositivo.</p>

                  <div className="grid grid-cols-2 gap-4">

                    {/* Oak & Ink — claro */}
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        selectedTheme === 'light'
                          ? 'border-[var(--teal)] shadow-lg shadow-[var(--teal)]/10'
                          : 'border-[#e5e3dc] hover:border-[var(--teal)]/40'
                      }`}
                    >
                      {/* Preview */}
                      <div className="w-full h-16 rounded-xl bg-[#f5f3ee] mb-3 overflow-hidden relative border border-[#e5e3dc]">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1a1a24]" />
                        <div className="absolute left-10 top-3 right-2 h-2.5 bg-[#1a1a24]/15 rounded-full" />
                        <div className="absolute left-10 top-7 right-6 h-2 bg-[#0d6e6e]/20 rounded-full" />
                        <div className="absolute left-10 top-11 w-10 h-2 bg-[#0d6e6e] rounded-full" />
                      </div>
                      <div className="flex gap-1.5 mb-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#1a1a24]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#0d6e6e]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#f5f3ee] border border-[#e5e3dc]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#d97706]" />
                      </div>
                      <div className="text-xs font-black text-[#1a1a24]">Oak & Ink</div>
                      <div className="text-[10px] text-[#8a8a9a]">Claro · Cálido</div>
                      {selectedTheme === 'light' && (
                        <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-[var(--teal)]">● Activo</div>
                      )}
                    </button>

                    {/* Dark Walnut — oscuro */}
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        selectedTheme === 'dark'
                          ? 'border-[#14b8a6] shadow-lg shadow-[#14b8a6]/15'
                          : 'border-[#2a2a35] hover:border-[#14b8a6]/40'
                      } bg-[#111118]`}
                    >
                      {/* Preview */}
                      <div className="w-full h-16 rounded-xl bg-[#0a0a0d] mb-3 overflow-hidden relative border border-[#2a2a35]">
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1c1c26]" />
                        <div className="absolute left-10 top-3 right-2 h-2.5 bg-white/10 rounded-full" />
                        <div className="absolute left-10 top-7 right-6 h-2 bg-[#14b8a6]/20 rounded-full" />
                        <div className="absolute left-10 top-11 w-10 h-2 bg-[#14b8a6] rounded-full" />
                      </div>
                      <div className="flex gap-1.5 mb-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#e8e8ee]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#14b8a6]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#111118] border border-[#2a2a35]" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b]" />
                      </div>
                      <div className="text-xs font-black text-[#e8e8ee]">Dark Walnut</div>
                      <div className="text-[10px] text-[#6b6b78]">Oscuro · Nocturno</div>
                      {selectedTheme === 'dark' && (
                        <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-[#14b8a6]">● Activo</div>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-[var(--bg1)] border border-[var(--border)] rounded-2xl text-[11px] text-[var(--ink3)] leading-relaxed">
                  <strong className="text-[var(--ink)] block mb-1">Nota</strong>
                  El tema se aplica en este navegador. Las partes del interfaz con colores directos mejorarán progresivamente con futuras actualizaciones.
                </div>
              </div>
            )}

            {/* ── Inteligencia Artificial ── */}
            {activeTab === 'ia' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

                {/* Proveedor */}
                <div className="fp-card">
                  <h3 className="font-bold text-sm mb-5 pb-2 border-b border-[#f0eee8] flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-[var(--teal)]" /> Proveedor de IA
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {([
                      { id: 'anthropic' as ModelProvider,         label: 'Anthropic',     sub: 'Claude' },
                      { id: 'openai' as ModelProvider,            label: 'OpenAI',        sub: 'GPT-4o' },
                      { id: 'glm' as ModelProvider,               label: 'GLM',           sub: 'Zhipu AI' },
                      { id: 'minimax' as ModelProvider,           label: 'MiniMax',       sub: 'Cloud' },
                      { id: 'ollama' as ModelProvider,            label: 'Local',         sub: 'Ollama' },
                      { id: 'groq' as ModelProvider,              label: 'Groq',          sub: 'Mixtral' },
                      { id: 'ollama-cloud' as ModelProvider,      label: 'Ollama Cloud',  sub: 'REST · API key' },
                      { id: 'ollama-cloud-daemon' as ModelProvider, label: 'Ollama Daemon', sub: 'Cloud vía daemon' },
                    ]).map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setLlmProvider(p.id); setTestStatus('idle'); }}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          llmProvider === p.id
                            ? 'border-[var(--teal)] bg-[var(--teal)]/5'
                            : 'border-[var(--border)] hover:border-[var(--teal)]/40'
                        }`}
                      >
                        <div className="text-xs font-bold text-[var(--ink)]">{p.label}</div>
                        <div className="text-[9px] text-[var(--ink3)]">{p.sub}</div>
                      </button>
                    ))}
                  </div>

                  {/* API Key — Cloud providers (excepto local y daemon) */}
                  {llmProvider !== 'ollama' && llmProvider !== 'ollama-cloud-daemon' && (
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1 flex items-center gap-1.5">
                        <Key className="w-3 h-3" />
                        API Key de {getModelsByProvider(llmProvider)?.[0]?.name ?? llmProvider}
                      </label>
                      <div className="relative">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={llmApiKey}
                          onChange={e => setLlmApiKey(e.target.value)}
                          placeholder={
                            llmProvider === 'anthropic' ? 'sk-ant-...'
                              : llmProvider === 'glm' ? 'zhipuai-...'
                              : llmProvider === 'minimax' ? 'mm-...'
                              : llmProvider === 'groq' ? 'gsk_...'
                              : 'sk-...'
                          }
                          className="w-full bg-[var(--bg)] border border-[#e5e3dc] rounded-xl px-4 py-3 pr-12 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink3)] hover:text-[var(--ink)] transition-colors"
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--ink3)] mt-1 ml-1">
                        La clave se guarda cifrada en tu perfil. Solo la usa el servidor al procesar tus peticiones.
                      </p>
                    </div>
                  )}

                  {/* Modelo selector — dinámico por proveedor */}
                  {(llmProvider !== 'ollama' || true) && (
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Modelo</label>
                        <select
                          value={llmModel}
                          onChange={e => setLlmModel(e.target.value)}
                          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all font-medium"
                        >
                          <option value="">Usar modelo por defecto</option>
                          {getModelsByProvider(llmProvider)?.map(model => (
                            <option key={model.id} value={model.id}>
                              {model.name} ({model.maxTokens.toLocaleString()} tk)
                            </option>
                          ))}
                        </select>
                      </div>
                      {llmProvider === 'ollama' && (
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">Nombre del modelo personalizado</label>
                          <input
                            type="text"
                            value={llmModelCustom}
                            onChange={e => setLlmModelCustom(e.target.value)}
                            placeholder="gemma:4b"
                            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Endpoint — Ollama local y daemon */}
                  {(llmProvider === 'ollama' || llmProvider === 'ollama-cloud-daemon') && (
                    <div className="mb-4">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[var(--ink3)] mb-1.5 ml-1">
                        URL del servidor Ollama{llmProvider === 'ollama-cloud-daemon' ? ' (daemon)' : ''}
                      </label>
                      <input
                        type="text"
                        value={llmEndpoint}
                        onChange={e => setLlmEndpoint(e.target.value)}
                        placeholder="http://localhost:11434"
                        className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--teal2)] transition-all"
                      />
                      {llmProvider === 'ollama-cloud-daemon' && (
                        <p className="text-[10px] text-[var(--ink3)] mt-1 ml-1">
                          Requiere Ollama instalado y <code className="font-mono">ollama signin</code> ejecutado en el servidor.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Estado del test */}
                  <AnimatePresence>
                    {testStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-2 text-[11px] font-bold px-4 py-3 rounded-xl mb-4 ${
                          testStatus === 'ok'
                            ? 'bg-green-50 text-green-700 border border-green-100'
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}
                      >
                        {testStatus === 'ok'
                          ? <Wifi className="w-4 h-4 shrink-0" />
                          : <WifiOff className="w-4 h-4 shrink-0" />}
                        {testMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Botones */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleTest}
                      disabled={llmLoading}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[#e5e3dc] rounded-xl text-[12px] font-bold text-[var(--ink2)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all disabled:opacity-50"
                    >
                      {llmLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />}
                      Probar conexión
                    </button>
                    <button
                      onClick={handleSaveIa}
                      disabled={llmLoading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[var(--teal)] text-white rounded-xl text-[12px] font-bold shadow-lg shadow-[var(--teal2)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {llmLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Guardar configuración
                    </button>
                  </div>
                </div>

                {/* Info box */}
                <div className="p-5 bg-[var(--bg1)] border border-[#f0eee8] rounded-2xl text-[11px] text-[var(--ink3)] leading-relaxed">
                  <strong className="text-[var(--ink)] block mb-1">¿Cómo funciona?</strong>
                  Tu API key se almacena de forma segura en tu perfil de Supabase con cifrado RLS.
                  El asistente IA la usa automáticamente en cada conversación sin necesidad de introducirla de nuevo.
                  Si no configuras ninguna, el sistema usará la clave compartida del servidor (si está disponible).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
