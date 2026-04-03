'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { ArrowLeft, Mail, ShieldCheck, Loader2, Sparkles } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.forgotPassword(email);
      setMessage('Un protocolo de recuperación ha sido enviado a su buzón institucional.');
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        'Identidad no reconocida o error de red en el nodo de autenticación.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg1)] p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--teal)]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--teal)]/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-lg relative">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[48px] border border-white p-10 md:p-14 shadow-[0_32px_100px_rgba(0,0,0,0.06)] animate-in zoom-in-95 duration-700">
          
          {/* Logo & Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-[var(--ink)] rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 hover:rotate-0 transition-transform">
              <ShieldCheck className="w-10 h-10 text-[var(--teal)]" />
            </div>
            <h1 className="text-3xl font-black text-[var(--ink)] tracking-tighter uppercase mb-3 flex items-center justify-center gap-3">
              Recuperar <span className="text-[var(--teal)] italic font-serif lowercase tracking-normal">Acceso</span>
            </h1>
            <p className="text-[var(--ink3)] text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              Protocolo de Emergencia • Seguridad Central
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
          )}

          {message && (
            <div className="mb-8 p-5 bg-[var(--bg2)] border border-[var(--teal)]/20 rounded-[32px] text-center space-y-4 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-[var(--teal)]/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-[var(--teal)]" />
              </div>
              <p className="text-sm font-bold text-[var(--ink)] leading-relaxed italic">
                "{message}"
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[10px] font-black text-[var(--teal)] uppercase tracking-widest hover:scale-105 transition-transform"
              >
                Volver al Portal <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--ink)] uppercase tracking-widest px-1">Correo Institucional</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink3)] group-focus-within:text-[var(--teal)] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[72px] bg-[var(--bg1)] border-2 border-transparent rounded-[24px] pl-16 pr-6 text-sm font-bold text-[var(--ink)] placeholder-[var(--ink3)]/40 focus:bg-white focus:border-[var(--teal)] transition-all outline-none"
                    placeholder="usuario@centro.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[80px] bg-[var(--ink)] text-white rounded-[32px] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[var(--ink)]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[var(--teal)]" />
                ) : (
                  <>
                    Restablecer Identidad
                    <div className="w-8 h-8 bg-[var(--teal)] rounded-xl flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
                      <Sparkles className="w-5 h-5 text-[var(--ink)]" />
                    </div>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100/50 text-center">
            <Link 
              href="/login" 
              className="group inline-flex items-center gap-3 text-[10px] font-black text-[var(--ink3)] uppercase tracking-widest hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Regresar al Log-in
            </Link>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center mt-12 text-[10px] font-black text-[var(--ink3)] uppercase tracking-[0.4em] opacity-40">
          TRANSVERSAL <span className="text-[var(--teal)]">FP</span> | SECURE NODE 01
        </p>
      </div>
    </div>
  );
}
