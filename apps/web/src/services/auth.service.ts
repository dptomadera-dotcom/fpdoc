import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    departmentId?: string;
    onboardingCompleted?: boolean;
  };
  token: string;
}

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    // Obtener perfil de la tabla pública
    const { data: profile } = await supabase
      .from('User')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const userData = {
      id: data.user.id,
      email: data.user.email!,
      role: profile?.role || 'ALUMNO',
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      departmentId: profile?.departmentId,
      onboardingCompleted: profile?.onboardingCompleted ?? false,
    };

    const token = data.session.access_token;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    }

    return { user: userData, token };
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.nombre,
          last_name: userData.apellido,
          role: userData.role,
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error('No se pudo crear el usuario');

    // Ahora la sincronización con la tabla pública User la hace el TRIGGER de Supabase
    // Esto es mucho más robusto y evita errores de RLS/red en el cliente.
    
    const finalUser = {
      id: data.user.id,
      email: data.user.email!,
      role: userData.role,
      firstName: userData.nombre,
      lastName: userData.apellido,
      departmentId: userData.departmentId,
    };

    const token = data.session?.access_token || '';

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUser));
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(finalUser), { expires: 7 });
    }

    return { user: finalUser, token };
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('user');
    
    // Redirección robusta para GitHub Pages
    const isProd = process.env.NODE_ENV === 'production';
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? '/fpdoc' : '');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Si estamos en un subdirectorio (GitHub Pages), nos aseguramos de que el path sea correcto
    window.location.href = `${origin}${basePath}/login/`;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user') || Cookies.get('user');
      if (!userStr) return null;
      try {
        const user = JSON.parse(userStr);
        // 🔥 REFUERZO DE SEGURIDAD: Override de correo institucional
        const userEmail = user?.email?.toLowerCase();
        const isDeptEmail = userEmail === 'dpto.madera@gmail.com';
        user.role = isDeptEmail ? 'JEFATURA' : (user?.role || 'ALUMNO');
        // Persistimos el override para evitar desincronizaciones
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token') || Cookies.get('token');
    }
    return Cookies.get('token');
  },

  forgotPassword: async (email: string) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + basePath + '/reset-password',
    });
  },

  setUser: (userData: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      Cookies.set('user', JSON.stringify(userData), { expires: 7 });
    }
  },

  /**
   * Sincroniza el login social (Google/Github) con el sistema de perfiles
   */
  socialLogin: async (data: { email: string; firstName?: string; lastName?: string, id?: string, role?: string }): Promise<AuthResponse> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No hay sesión activa de Supabase');

    // 1. Lógica de rol simplificada
    let finalRole = data.role || 'ALUMNO';
    if (session.user.email?.toLowerCase() === 'dpto.madera@gmail.com') {
      finalRole = 'JEFATURA';
    }

    // 2. Intentar obtener onboardingCompleted de forma SEGURA
    let onboardingCompleted = false;
    try {
      const { data: profile, error } = await supabase
        .from('User')
        .select('onboardingCompleted, role')
        .eq('id', session.user.id)
        .maybeSingle(); // maybeSingle no arroja error si hay 0 filas

      if (profile) {
        onboardingCompleted = !!profile.onboardingCompleted;
        if (profile.role) finalRole = profile.role;
      }
      
      if (error) {
        console.warn('Fallo no-crítico al obtener perfil (User table might 500):', error);
        // NO relanzamos el error, permitimos que el usuario entre aunque sea sin perfil
      }
    } catch (e) {
      console.error('Error catastrófico consultando tabla User:', e);
    }

    const userData = {
      id: session.user.id,
      email: session.user.email!,
      role: finalRole as any,
      firstName: data.firstName || session.user.user_metadata?.full_name?.split(' ')[0] || '',
      lastName: data.lastName || session.user.user_metadata?.full_name?.split(' ')[1] || '',
      onboardingCompleted: onboardingCompleted,
    };

    localStorage.setItem('token', session.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', session.access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    return { user: userData, token: session.access_token };
  }
};
