import api from '../lib/api-client';
import Cookies from 'js-cookie';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.access_token || response.data.token;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Establecer cookie para middleware
      Cookies.set('token', token, { expires: 7 }); // 7 días
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    }
    return { ...response.data, token };
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    const token = response.data.access_token || response.data.token;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Establecer cookie para middleware
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    }
    return { ...response.data, token };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('user');
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
    return await api.post('/auth/forgot-password', { email });
  },

  socialLogin: async (data: { email: string; firstName?: string; lastName?: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/social-login', data);
    const token = response.data.access_token || response.data.token;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    }
    return { ...response.data, token };
  }
};
