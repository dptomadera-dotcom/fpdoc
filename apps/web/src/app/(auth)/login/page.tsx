'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, ArrowRight,
  Mail, Lock, Loader2, AlertCircle,
  Eye, EyeOff, Sparkles, Zap,
  GraduationCap, BookOpen, Users
} from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

function extractErrorMessage(err: any): string {
  if (err?.message) return err.message;
  const data = err?.response?.data;
  if (data?.message) {
    const msg = data.message;
    if (Array.isArray(msg)) return msg.join('. ');
    return msg;
  }
  return 'Error al conectar con el servicio de autenticación.';
}

const ROLES = [
  {
    key: 'ALUMNO',
    label: 'Alumnado',
    icon: GraduationCap,
    desc: 'Consulta programaciones, prácticas FCT y tu itinerario formativo.',
    color: '#0d6e6e',
    bgFrom: 'from-teal-600',
    bgTo: 'to-teal-800',
    redirect: '/dashboard',
  },
  {
    key: 'PROFESOR',
    label: 'Profesorado',
    icon: BookOpen,
    desc: 'Diseña y gestiona las programaciones de tus módulos asignados.',
    color: '#7c3aed',
    bgFrom: 'from-violet-600',
    bgTo: 'to-purple-800',
    redirect: '/dashboard/programaciones',
  },
  {
    key: 'JEFATURA',
    label: 'Jefe de Dpto.',
    icon: ShieldCheck,
    desc: 'Supervisa, valida y publica la Programación Didáctica del ciclo.',
    color: '#b45309',
    bgFrom: 'from-amber-600',
    bgTo: 'to-orange-700',
    redirect: '/dashboard',
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getRedirectForRole = (role: string) => {
    const r = ROLES.find(r => r.key === role);
    return r?.redirect || '/dashboard';
  };

  // Si el usuario no ha completado el onboarding, siempre va ahí primero
  const getSmartRedirect = (user: { role: string; onboardingCompleted?: boolean }) => {
    if (!user.onboardingCompleted) return '/onboarding';
    return getRedirectForRole(user.role);
  };

  const handleGoogleLogin = async (roleValue: 'PROFESOR' | 'ALUMNO' | 'JEFATURA') => {
    setLoading(true);
    try {
      // 🏗️ SIMULACIÓN LOGIN (Sustituir por Supabase real en producción)
      // Forzamos el role que el usuario ha solicitado al pulsar el botón
      const mockUser = {
        id: '1',
        email: 'dev@fpdoc.local',
        role: roleValue,
        firstName: 'Usuario',
        lastName: 'Demo',
        onboardingCompleted: true, // dev: saltar onboarding
      };
      authService.setUser(mockUser);
      useAuthStore.getState().setUser(mockUser, '');
      router.push(getRedirectForRole(roleValue));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user, token } = await authService.login({ email, password });
      useAuthStore.getState().setUser(user, token ?? '');
      router.push(getSmartRedirect(user));
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    // Guardar rol seleccionado para recuperarlo tras el redirect de OAuth
    if (selectedRole) {
      sessionStorage.setItem('selectedRole', selectedRole);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (error) setError(error.message);
  };

  useEffect(() => {
    let mounted = true;

    // 1. Verificación inicial rápida para usuarios que ya tienen sesión local
    const localUser = authService.getCurrentUser();
    if (localUser && !window.location.hash) {
      router.replace(getSmartRedirect(localUser));
      return;
    }

    // 2. Suscribirse a los cambios de estado de Supabase para capturar el OAuth callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        // Validar que no hayamos persistido ya a este usuario (para no repetir la lógica)
        if (authService.getCurrentUser()?.id === session.user.id) {
          if (mounted) router.replace(getSmartRedirect(authService.getCurrentUser() as any));
          return;
        }

        if (mounted) setLoading(true);
        try {
          const storedRole = sessionStorage.getItem('selectedRole');
          const finalRole = storedRole || 'ALUMNO';
          
          const { user, token } = await authService.socialLogin({
            email: session.user.email!,
            role: finalRole,
            firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.full_name?.split(' ')[0] || '',
            lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.full_name?.split(' ')[1] || '',
          });

          useAuthStore.getState().setUser(user, (token as string) ?? '');
          sessionStorage.removeItem('selectedRole');

          if (mounted) {
            router.replace(getSmartRedirect(user));
          }
        } catch (err: any) {
          if (mounted) setError(extractErrorMessage(err));
        } finally {
          if (mounted) setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const activeRoleData = ROLES.find(r => r.key === selectedRole);

  return (
    <div className="min-h-screen bg-[var(--ink)] flex items-stretch relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--teal)]/10 blur-[150px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-900/10 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

      {/* ── PANEL IZQUIERDO (informativo) ── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group w-fit">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--teal)] to-[var(--teal3)] rounded-2xl flex items-center justify-center shadow-lg shadow-[var(--teal)]/20 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold font-serif text-white">FP<span className="text-[var(--teal)] italic">doc</span></span>
        </Link>

        {/* Selector de roles visual */}
        <div>
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3">Selecciona tu perfil</span>
            <h2 className="text-4xl font-bold font-serif text-white tracking-tight leading-tight">
              Elige tu rol<br /><span className="text-white/30">para continuar</span>
            </h2>
          </div>

          <div className="space-y-3">
            {ROLES.map(role => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.key;
              return (
                <motion.button
                  key={role.key}
                  onClick={() => setSelectedRole(isSelected ? null : role.key)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-5 p-5 rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${role.color}30`, border: `1.5px solid ${role.color}60` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: role.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{role.label}</p>
                    <p className="text-[11px] text-white/40 leading-relaxed mt-0.5">{role.desc}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: role.color }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {activeRoleData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/5"
              >
                <p className="text-[11px] text-white/40 leading-relaxed">
                  <span className="text-white font-bold">{activeRoleData.label}</span> — {activeRoleData.desc}
                  {' '}Una vez autenticado serás redirigido a tu espacio de trabajo correspondiente.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer izquierdo */}
        <div className="flex items-center gap-6 text-[10px] text-white/20 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />FPD-256 Auth</div>
          <div className="flex items-center gap-2"><Zap className="w-3 h-3 text-[var(--amber)]" />Servicio Activo</div>
        </div>
      </div>

      {/* Separador vertical */}
      <div className="hidden lg:block w-px bg-white/5 my-8" />

      {/* ── PANEL DERECHO (formulario) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--teal)] to-[var(--teal3)] rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-serif text-white">FP<span className="text-[var(--teal)] italic">doc</span></span>
          </div>

          {/* Selector de rol mobile */}
          <div className="lg:hidden mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Tu perfil</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(role => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.key;
                return (
                  <button
                    key={role.key}
                    onClick={() => setSelectedRole(isSelected ? null : role.key)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      isSelected ? 'bg-white/10 border-white/20' : 'bg-white/[0.03] border-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" style={{ color: role.color }} />
                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-wide leading-tight text-center">{role.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cabecera formulario */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Iniciar Sesión</h1>
            <p className="text-sm text-white/30 mt-1">
              {activeRoleData
                ? <span>Accediendo como <span className="text-white font-bold">{activeRoleData.label}</span></span>
                : 'Introduce tus credenciales para continuar'}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[var(--teal)] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-medium text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/60 transition-all outline-none"
                  placeholder="ejemplo@fp.es"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Contraseña</label>
                <Link href="/forgot-password" className="text-[10px] font-bold text-[var(--teal)] hover:text-white transition-colors">¿Olvidaste tu clave?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[var(--teal)] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-sm font-medium text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/60 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[var(--teal)] text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-[var(--teal)]/20 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>INICIAR SESIÓN</span>}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Acceso rápido (solo dev) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6">
              <div className="relative flex items-center gap-4 text-[10px] font-black uppercase text-white/20 tracking-[0.2em] mb-3">
                <div className="flex-1 h-px bg-white/10" />Acceso rápido dev<div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(r => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleGoogleLogin(r.key as any)}
                      disabled={loading}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-center"
                    >
                      <Icon className="w-4 h-4" style={{ color: r.color }} />
                      <span className="text-[9px] font-black uppercase tracking-wide text-white/40 leading-tight">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* OAuth */}
          <div className="mt-6">
            <div className="relative flex items-center gap-4 text-[10px] font-black uppercase text-white/20 tracking-[0.2em] mb-5">
              <div className="flex-1 h-px bg-white/10" />O mediante<div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                onClick={() => handleSocialLogin('github')}
                className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
              >
                <GithubIcon />
                GitHub
              </button>
            </div>
          </div>

          {/* Registro */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/30">¿No tienes cuenta aún?</p>
            <Link href="/register" className="inline-block mt-1 text-[11px] font-black uppercase text-[var(--teal)] tracking-widest hover:text-white transition-colors">
              Solicitar Acceso al Centro →
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <Link href="/" className="text-[10px] text-white/20 font-bold uppercase tracking-widest hover:text-white/40 transition-colors flex items-center justify-center gap-2">
              ← Volver a la portada
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
