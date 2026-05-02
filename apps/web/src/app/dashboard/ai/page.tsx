'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthGuard } from '@/lib/use-auth-guard';
import {
  Cpu, Send, Bot, User,
  Zap, BrainCircuit, History,
  Lightbulb, Wand2, FileSearch, Trash2,
  ChevronRight, Brain, AlertCircle, Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { aiService } from '@/services/ai.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

function getUserRole(): string {
  if (typeof window === 'undefined') return 'PROFESOR';
  try {
    const raw = localStorage.getItem('user');
    if (raw) return JSON.parse(raw).role ?? 'PROFESOR';
  } catch {}
  return 'PROFESOR';
}

const WELCOME: Record<string, string> = {
  ALUMNO:
    'Hola. Soy tu asistente de FPdoc. Puedo ayudarte a entender tus tareas, organizar tus entregas y orientarte en tu progreso. ¿En qué te ayudo?',
  DEFAULT:
    'Hola. Soy el asistente IA de FPdoc. Puedo ayudarte a planificar proyectos, analizar brechas curriculares y apoyar el seguimiento del grupo. ¿En qué trabajamos hoy?',
};

export default function AIAssistantPage() {
  useAuthGuard();
  const role = getUserRole();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: WELCOME[role] ?? WELCOME.DEFAULT,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      let responseText: string;

      if (role === 'ALUMNO') {
        responseText = await aiService.askStudentAssistant({
          message: input,
          route: '/dashboard/ai',
        });
      } else {
        responseText = await aiService.askTeacherAssistant({
          message: input,
          route: '/dashboard/ai',
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Ha ocurrido un error al conectar con el asistente. Comprueba la conexión e inténtalo de nuevo.',
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, role]);

  const handleClear = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: WELCOME[role] ?? WELCOME.DEFAULT,
        timestamp: new Date(),
      },
    ]);
  };

  const suggestions =
    role === 'ALUMNO'
      ? [
          { icon: Brain, label: '¿Qué tareas tengo pendientes?' },
          { icon: Wand2, label: '¿Cómo organizo mi entrega?' },
          { icon: FileSearch, label: '¿En qué fase estoy?' },
        ]
      : [
          { icon: Wand2, label: 'Propón una actividad para el RA2' },
          { icon: FileSearch, label: '¿Qué alumnos tienen tareas atrasadas?' },
          { icon: Brain, label: 'Resumen del estado del grupo' },
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
                  <h2 className="text-sm font-black uppercase tracking-widest text-[var(--ink)]">
                    Asistente IA
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
                    <span className="text-[10px] font-bold text-[var(--ink3)]">
                      {role === 'ALUMNO' ? 'Asistente de alumno' : 'Asistente de profesorado'} · Claude Opus
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-2.5 bg-[var(--bg1)] hover:bg-[var(--bg2)] rounded-xl transition-all"
                title="Nueva conversación"
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
                  <div
                    className={cn(
                      'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
                      msg.role === 'assistant'
                        ? 'bg-[var(--bg1)] text-[var(--teal)] border border-[#f0eee8]'
                        : 'bg-[var(--ink)] text-white',
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      msg.isError ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>

                  <div
                    className={cn(
                      'p-5 rounded-[24px] text-[13px] leading-relaxed whitespace-pre-wrap',
                      msg.role === 'assistant'
                        ? msg.isError
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : 'bg-[var(--bg1)] text-[var(--ink2)] border-b border-r border-[#f0eee8]'
                        : 'bg-[var(--teal)] text-white font-medium',
                    )}
                  >
                    {msg.content}
                    <span
                      className={cn(
                        'block mt-2 text-[9px] opacity-40 uppercase font-black tracking-widest',
                        msg.role === 'user' ? 'text-right' : '',
                      )}
                    >
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
                    Consultando a Claude Opus...
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
                  placeholder={
                    role === 'ALUMNO'
                      ? 'Pregúntame sobre tus tareas o entregas...'
                      : 'Dime qué quieres analizar o planificar...'
                  }
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

              <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
                <span className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3 text-[var(--amber)]" /> Preguntas rápidas:
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

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] space-y-6">
            <div className="bg-white border border-[#f0eee8] rounded-[40px] p-8 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ink)] mb-6 flex items-center gap-3">
                <History className="w-4 h-4 text-[var(--teal)]" /> Esta sesión
              </h3>
              <div className="space-y-3">
                {messages
                  .filter((m) => m.role === 'user')
                  .slice(-4)
                  .reverse()
                  .map((m) => (
                    <div
                      key={m.id}
                      className="group cursor-pointer"
                      onClick={() => setInput(m.content)}
                    >
                      <p className="text-[10px] font-black text-[var(--ink3)] uppercase tracking-tighter">
                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs font-bold text-[var(--ink)] group-hover:text-[var(--teal)] transition-colors line-clamp-2">
                        {m.content}
                      </p>
                    </div>
                  ))}
                {messages.filter((m) => m.role === 'user').length === 0 && (
                  <p className="text-[11px] text-[var(--ink3)] italic">Aún no hay preguntas en esta sesión.</p>
                )}
                <button
                  onClick={handleClear}
                  className="w-full h-12 border border-dashed border-[#f0eee8] rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--ink3)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all"
                >
                  Nueva conversación <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--ink)] text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <BrainCircuit className="w-10 h-10 text-[var(--teal2)] mb-4 group-hover:rotate-12 transition-transform" />
                <h4 className="text-xl font-bold font-serif mb-2 leading-tight">Claude Opus 4.6</h4>
                <p className="text-[11px] text-white/50 leading-relaxed mb-6">
                  Modelo conectado con contexto real de tus proyectos, grupos y currículo de la plataforma.
                </p>
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                  <span>Estado</span>
                  <span className="text-[var(--teal2)]">Activo</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="w-full h-full bg-[var(--teal2)]" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
            </div>

            <div className="bg-[var(--amber2)] border border-[var(--amber)]/10 rounded-[40px] p-8 flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-[var(--amber)] shrink-0" />
              <div>
                <p className="text-[10px] font-black text-[var(--amber)] uppercase tracking-widest mb-1">
                  Tip
                </p>
                <p className="text-[11px] text-[var(--ink3)] leading-relaxed italic">
                  {role === 'ALUMNO'
                    ? '"Pregúntame qué tienes que entregar esta semana para organizar tu tiempo."'
                    : '"Pregúntame el estado del grupo en un proyecto específico para obtener un resumen inmediato."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
