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

    // Sincronizar con la tabla pública User (la que usa Prisma)
    // Nota: Esto asume que el usuario tiene permisos de inserción en la tabla User
    // En un entorno real, usaríamos un Trigger de Supabase
    const { error: profileError } = await supabase
      .from('User')
      .insert({
        id: data.user.id,
        email: userData.email,
        passwordHash: 'SUPABASE_AUTH', // No almacenamos el hash en nuestra tabla pública si usamos Supabase Auth
        firstName: userData.nombre,
        lastName: userData.apellido,
        role: userData.role,
      });

    if (profileError) {
      console.warn('Advertencia: El perfil público no pudo crearse automáticamente.', profileError);
      // No lanzamos error para permitir que el registro de auth continúe,
      // pero el desarrollador verá la advertencia con el detalle del RLS.
    }

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
    
    // Redirección usando el basePath configurado en Next.js
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    window.location.href = `${basePath}/login`;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user') || Cookies.get('user');
      if (!userStr) return null;
      try {
        const user = JSON.parse(userStr);
        // 🔥 REFUERZO DE SEGURIDAD: Override de correo institucional
        const userEmail = user?.email?.toLowerCase();
        const isDeptEmail = userEmail === 'departamento.madera@gmail.com';
        user.role = isDeptEmail ? 'JEFATURA' : (user?.role || 'PROFESOR');
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

  socialLogin: async (data: { email: string; firstName?: string; lastName?: string, id?: string, role?: string }): Promise<AuthResponse> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('No hay sesión activa de Supabase');

    // Lógica de rol simplificada y robusta
    let finalRole = data.role || 'ALUMNO';
    if (session.user.email?.toLowerCase() === 'departamento.madera@gmail.com') {
      finalRole = 'JEFATURA';
    }

    // Obtener onboardingCompleted del perfil si existe
    const { data: profile } = await supabase
      .from('User')
      .select('onboardingCompleted')
      .eq('id', session.user.id)
      .single();

    const userData = {
      id: session.user.id,
      email: session.user.email!,
      role: finalRole as any,
      firstName: data.firstName || session.user.user_metadata?.full_name?.split(' ')[0] || '',
      lastName: data.lastName || session.user.user_metadata?.full_name?.split(' ')[1] || '',
      onboardingCompleted: profile?.onboardingCompleted ?? false,
    };

    localStorage.setItem('token', session.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', session.access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    return { user: userData, token: session.access_token };
  }
};
