'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import PWAInstallButton from '@/components/PWAInstallButton';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, ArrowRight, 
  Mail, Lock, Loader2, AlertCircle,
  User, CheckCircle2, Sparkles, ChevronDown
} from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

function extractErrorMessage(err: any): string {
  if (err?.message) return err.message;
  const data = err?.response?.data;
  if (data?.message) {
    const msg = data.message;
    if (Array.isArray(msg)) return msg.join('. ');
    return msg;
  }
  return 'Error al crear la cuenta. Inténtalo de nuevo.';
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    role: 'ALUMNO' as string,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🏗️ Validación: Email institucional (opcional pero forzamos JEFATURA)
      let finalData = { ...formData };
      if (formData.email.endsWith('departamento.madera@gmail.com')) {
        finalData.role = 'JEFATURA';
      }

      const { user, token } = await authService.register(finalData);
      
      if (!token) {
        // El usuario se ha creado pero requiere confirmación por email (Supabase default)
        setSuccess(true);
        // No redirigimos a onboarding porque aún no tiene sesión
      } else {
        setSuccess(true);
        // Redirigimos tras un breve delay para que vea el mensaje de éxito
        setTimeout(() => router.push('/onboarding'), 1500);
      }
    } catch (err: any) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    // Guardar rol seleccionado para recuperarlo tras el redirect de OAuth
    if (formData.role) {
      sessionStorage.setItem('selectedRole', formData.role);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });
    if (error) setError(error.message);
  };

  useEffect(() => {
    let mounted = true;

    // 1. Si ya tenemos usuario persistido localmente y no hay hash de OAuth, redirigimos
    const localUser = authService.getCurrentUser();
    if (localUser && !window.location.hash) {
      router.replace('/onboarding');
      return;
    }

    // 2. Usar onAuthStateChange para manejar el callback de forma robusta
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        if (authService.getCurrentUser()?.id === session.user.id) {
          if (mounted) router.replace('/onboarding');
          return;
        }

        if (mounted) setLoading(true);
        try {
          const storedRole = sessionStorage.getItem('selectedRole');
          await authService.socialLogin({
            email: session.user.email!,
            role: storedRole || 'ALUMNO',
            firstName: session.user.user_metadata?.first_name || session.user.user_metadata?.full_name?.split(' ')[0] || '',
            lastName: session.user.user_metadata?.last_name || session.user.user_metadata?.full_name?.split(' ')[1] || '',
          });
          sessionStorage.removeItem('selectedRole');
          
          if (mounted) {
            router.replace('/onboarding');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[var(--teal)]/10 blur-[120px] rounded-full -ml-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--teal)]/5 blur-[100px] rounded-full -mr-32 -mb-32 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-[#18181b]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/5 rounded-2xl mb-6 shadow-sm border border-white/10">
             <UserPlus className="w-7 h-7 text-[var(--teal)]" />
          </div>
          <h1 className="text-4xl font-bold font-serif text-white tracking-tight">
            Únete a FP<span className="text-[var(--teal)] italic">doc</span>
          </h1>
          <p className="text-[10px] font-black text-white/40 mt-2 uppercase tracking-[0.2em]">SISTEMA DE GESTIÓN ACADÉMICA</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black rounded-2xl flex items-center gap-3 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-8 p-4 bg-[var(--teal)]/10 border border-[var(--teal)]/20 text-[var(--teal)] text-xs font-black rounded-2xl flex items-center gap-3 overflow-hidden"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {authService.getCurrentUser() 
                ? 'Cuenta creada con éxito. Redirigiendo a onboarding...'
                : 'Registro realizado con éxito. Por favor, revisa tu email para confirmar tu cuenta y poder iniciar sesión.'
              }
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Nombre</label>
                <input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full h-12 bg-white/5 border border-white/5 rounded-[18px] px-4 text-sm font-bold text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/50 transition-all outline-none"
                  placeholder="Ej. Maria"
                  required
                />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Apellido</label>
                <input
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full h-12 bg-white/5 border border-white/5 rounded-[18px] px-4 text-sm font-bold text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/50 transition-all outline-none"
                  placeholder="Ej. García"
                  required
                />
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Email Institucional</label>
            <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[var(--teal)] transition-colors" />
               <input
                 name="email"
                 type="email"
                 value={formData.email}
                 onChange={handleChange}
                 className="w-full h-12 bg-white/5 border border-white/5 rounded-[18px] pl-12 pr-4 text-sm font-bold text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/50 transition-all outline-none"
                 placeholder="maria@centro.es"
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Clave de Seguridad</label>
            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[var(--teal)] transition-colors" />
               <input
                 name="password"
                 type="password"
                 value={formData.password}
                 onChange={handleChange}
                 className="w-full h-12 bg-white/5 border border-white/5 rounded-[18px] pl-12 pr-4 text-sm font-bold text-white placeholder-white/20 focus:bg-white/10 focus:border-[var(--teal)]/50 transition-all outline-none"
                 placeholder="Mínimo 6 caracteres"
                 minLength={6}
                 required
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-white/40 tracking-widest ml-1">Responsabilidad</label>
            <div className="relative">
               <select
                 name="role"
                 value={formData.role}
                 onChange={handleChange}
                 className="w-full h-12 bg-white/5 border border-white/5 rounded-[18px] px-4 text-sm font-bold text-white focus:bg-white/10 focus:border-[var(--teal)]/50 transition-all outline-none appearance-none cursor-pointer"
               >
                 <option value="ALUMNO" className="bg-[#18181b]">Alumno / Estudiante</option>
                 <option value="PROFESOR" className="bg-[#18181b]">Profesor / Docente</option>
                 <option value="JEFATURA" className="bg-[#18181b]">Jefatura de Departamento</option>
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-14 bg-[var(--teal)] text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-[var(--teal)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>CREAR MI CUENTA</span>}
            <Sparkles className="w-4 h-4 text-white/80" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <p className="text-xs text-white/40 font-medium">¿Ya formas parte de FPdoc?</p>
             <Link href="/login" className="inline-block mt-1 text-[11px] font-black uppercase text-[var(--teal)] tracking-widest border-b-2 border-transparent hover:border-[var(--teal)] transition-all">
                 Acceder a mi panel
             </Link>
        </div>

        <div className="mt-6">
           <PWAInstallButton />
        </div>
      </motion.div>
    </div>
  );
}
