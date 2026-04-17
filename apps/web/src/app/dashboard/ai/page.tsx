'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu, Send, Bot, User,
  Zap, BrainCircuit, History,
  Lightbulb, Wand2, FileSearch, Trash2,
  ChevronRight, Brain, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { aiService, loadLlmConfig } from '@/services/ai.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola. Soy el motor de inteligencia de FPdoc. Puedo ayudarte a analizar tus programaciones, proponer actividades transversales o redactar criterios de evaluación. ¿En qué trabajamos hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [providerLabel, setProviderLabel] = useState('Conectando…');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cargar etiqueta del proveedor activo
  useEffect(() => {
    loadLlmConfig().then(cfg => {
      if (!cfg) { setProviderLabel('Servidor · Claude Sonnet'); return; }
      if (cfg.provider === 'anthropic') setProviderLabel('Anthropic · Claude Sonnet');
      else if (cfg.provider === 'openai') setProviderLabel(`OpenAI · ${cfg.model ?? 'gpt-4o-mini'}`);
      else setProviderLabel(`Local · ${cfg.model ?? 'llama3.2'}`);
    }).catch(() => setProviderLabel('Servidor · Claude Sonnet'));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const history = [...messages, userMsg]
      .filter(m => !m.error)
      .map(m => ({ role: m.role, content: m.content }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const content = await aiService.chat(history);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
      }]);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message ?? err.message ?? 'Error al conectar con el modelo';
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ ${errorMsg}`,
        timestamp: new Date(),
        error: true,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Conversación reiniciada. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    }]);
  };

  const suggestions = [
    { icon: Wand2,       label: 'Genera una actividad para RA2' },
    { icon: FileSearch,  label: 'Analiza brechas en mi programación' },
    { icon: Brain,       label: 'Vincula estos criterios de evaluación' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-160px)] bg-transparent">
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-0">

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white border border-[#f0eee8] rounded-[40px] shadow-sm overflow-hidden relative">

            {/* Header */}
            <div className="px-8 py-5 border-b border-[#f0eee8] flex items-center justify-between bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--ink)] rounded-2xl flex items-center justify-center relative shadow-lg">
                  <Cpu className="w-5 h-5 text-[var(--teal)]" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">Asistente IA</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--ink3)]">{providerLabel}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-2.5 bg-[var(--bg1)] hover:bg-[var(--bg2)] rounded-xl transition-all"
                title="Reiniciar conversación"
              >
                <Trash2 className="w-4 h-4 text-[var(--ink3)]" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex items-start gap-4 max-w-[85%]',
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : '',
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
                    msg.role === 'assistant'
                      ? 'bg-[var(--bg1)] text-[var(--teal)] border border-[#f0eee8]'
                      : 'bg-[var(--ink)] text-white',
                  )}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    'p-5 rounded-[24px] text-[13px] leading-relaxed relative whitespace-pre-wrap',
                    msg.error
                      ? 'bg-red-50 text-red-800 border border-red-100'
                      : msg.role === 'assistant'
                        ? 'bg-[var(--bg1)] text-[var(--ink2)] border-b border-r border-[#f0eee8]'
                        : 'bg-[var(--teal)] text-white font-medium',
                  )}>
                    {msg.content}
                    <span className={cn(
                      'block mt-2 text-[9px] opacity-40 uppercase font-black tracking-widest',
                      msg.role === 'user' ? 'text-right' : '',
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[var(--ink3)]"
                  >
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[var(--teal)] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    Generando respuesta...
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-8 bg-white border-t border-[#f0eee8]">
              <div className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                  }}
                  placeholder="Escribe tu consulta… (Enter para enviar)"
                  className="w-full bg-[var(--bg1)] border border-transparent rounded-[24px] pl-6 pr-16 py-5 text-[13px] font-medium text-[var(--ink)] placeholder-[var(--ink3)]/50 focus:bg-white focus:border-[var(--teal)] focus:ring-4 focus:ring-[var(--teal)]/5 transition-all outline-none resize-none min-h-[70px] max-h-[200px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-4 bottom-4 w-10 h-10 bg-[var(--ink)] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[var(--ink)]/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                  {isTyping
                    ? <Loader2 className="w-4 h-4 animate-spin text-[var(--teal2)]" />
                    : <Send className="w-4 h-4 text-[var(--teal2)]" />}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[var(--amber)]" /> Ideas rápidas:
                </span>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s.label)}
                    className="text-[11px] font-bold text-[var(--ink2)] hover:text-[var(--teal)] flex items-center gap-1.5 whitespace-nowrap transition-colors"
                  >
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="w-full lg:w-[300px] space-y-4">
            <div className="bg-white border border-[#f0eee8] rounded-[32px] p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ink)] mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-[var(--teal)]" /> Historial
              </h3>
              <div className="space-y-3">
                {[
                  { date: 'Hace 2h', title: 'Propuesta RA2 Madera' },
                  { date: 'Ayer',    title: 'Brechas Sostenibilidad' },
                  { date: 'Lunes',   title: 'Vínculo CE 1.1' },
                ].map((item, i) => (
                  <div key={i} className="cursor-pointer group">
                    <p className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-tighter">{item.date}</p>
                    <p className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--teal)] transition-colors line-clamp-1">{item.title}</p>
                  </div>
                ))}
                <button className="w-full h-10 border border-dashed border-[#f0eee8] rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all">
                  Ver todo <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--ink)] text-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
              <BrainCircuit className="w-8 h-8 text-[var(--teal2)] mb-3" />
              <h4 className="text-base font-bold font-serif mb-1">Modelo activo</h4>
              <p className="text-[11px] text-white/60 leading-relaxed mb-3">{providerLabel}</p>
              <a href="/dashboard/settings?tab=ia" className="text-[9px] font-black uppercase tracking-widest text-[var(--teal2)] hover:text-white transition-colors">
                Cambiar en Ajustes →
              </a>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-[32px] p-5 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[var(--amber)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black text-[var(--amber)] uppercase tracking-widest mb-1">Consejo</p>
                <p className="text-[11px] text-[var(--ink3)] leading-relaxed italic">"Adjunta el acta de tu última reunión para que pueda proponer una temporalización realista."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
