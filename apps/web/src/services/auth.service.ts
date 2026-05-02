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
    const refreshToken = data.session.refresh_token;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
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

    const finalUser = {
      id: data.user.id,
      email: data.user.email!,
      role: userData.role,
      firstName: userData.nombre,
      lastName: userData.apellido,
      departmentId: userData.departmentId,
    };

    const token = data.session?.access_token || '';
    const refreshToken = data.session?.refresh_token;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(finalUser));
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(finalUser), { expires: 7 });
    }

    return { user: finalUser, token };
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('user');

    const isProd = process.env.NODE_ENV === 'production';
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isProd ? '/fpdoc' : '');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    window.location.href = `${origin}${basePath}/login/`;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user') || Cookies.get('user');
      if (!userStr) return null;
      try {
        const user = JSON.parse(userStr);
        const userEmail = user?.email?.toLowerCase();
        const isDeptEmail = userEmail === 'dpto.madera@gmail.com';
        user.role = isDeptEmail ? 'JEFATURA' : (user?.role || 'ALUMNO');
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

    let finalRole = data.role || 'ALUMNO';
    if (session.user.email?.toLowerCase() === 'dpto.madera@gmail.com') {
      finalRole = 'JEFATURA';
    }

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
    if (session.refresh_token) {
      localStorage.setItem('refresh_token', session.refresh_token);
    }
    Cookies.set('token', session.access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    return { user: userData, token: session.access_token };
  },

  refreshTokens: async (): Promise<boolean> => {
    try {
      const storedRefreshToken = typeof window !== 'undefined'
        ? localStorage.getItem('refresh_token')
        : null;
      if (!storedRefreshToken) return false;

      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: storedRefreshToken,
      });
      if (error || !data.session) return false;

      const newToken = data.session.access_token;
      const newRefreshToken = data.session.refresh_token;

      localStorage.setItem('token', newToken);
      if (newRefreshToken) localStorage.setItem('refresh_token', newRefreshToken);
      Cookies.set('token', newToken, { expires: 7 });

      return true;
    } catch {
      return false;
    }
  },

  apiFetch: async (url: string, options?: RequestInit): Promise<Response> => {
    const token = authService.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string> || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      const refreshed = await authService.refreshTokens();
      if (refreshed) {
        const newToken = authService.getToken();
        if (newToken) headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      }
    }

    return response;
  },
};
