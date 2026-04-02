import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
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

    if (profileError) console.error('Error al crear perfil público:', profileError);

    const finalUser = {
      id: data.user.id,
      email: data.user.email!,
      role: userData.role,
      firstName: userData.nombre,
      lastName: userData.apellido,
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
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user') || Cookies.get('user');
      return user ? JSON.parse(user) : null;
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
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
  },

  socialLogin: async (data: { email: string; firstName?: string; lastName?: string, id?: string }): Promise<AuthResponse> => {
    // Si viene de un OAuth exitoso, ya tenemos la sesión en Supabase.
    // Solo aseguramos que el perfil público exista.
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) throw new Error('No hay sesión activa');

    // Verificar si existe el perfil
    const { data: existingProfile } = await supabase
      .from('User')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!existingProfile) {
      await supabase.from('User').insert({
        id: session.user.id,
        email: session.user.email!,
        passwordHash: 'SOCIAL_AUTH',
        firstName: data.firstName || session.user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: data.lastName || session.user.user_metadata?.full_name?.split(' ')[1] || '',
        role: 'ALUMNO',
      });
    }

    const userData = {
      id: session.user.id,
      email: session.user.email!,
      role: existingProfile?.role || 'ALUMNO',
      firstName: existingProfile?.firstName || data.firstName,
      lastName: existingProfile?.lastName || data.lastName,
    };

    localStorage.setItem('token', session.access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', session.access_token, { expires: 7 });
    Cookies.set('user', JSON.stringify(userData), { expires: 7 });

    return { user: userData, token: session.access_token };
  }
};
