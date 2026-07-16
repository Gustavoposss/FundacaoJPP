import axios from 'axios';
import { supabase } from './supabaseClient';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor de requisição: adiciona o access token da sessão do Supabase
api.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: tratar erros 401 (token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      if (
        errorMessage.includes('Token inválido') ||
        errorMessage.includes('expirado') ||
        errorMessage.includes('Token não fornecido')
      ) {
        await supabase.auth.signOut();
        if (window.location.pathname !== '/' && window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
      }
    }
    return Promise.reject(error);
  }
);
