import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Só remover token se realmente for erro de autenticação
      // Não remover em caso de erro de rede ou outros problemas
      const token = localStorage.getItem('fjpp_token');
      if (token) {
        // Verificar se o erro é realmente de token inválido
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.includes('Token inválido') || errorMessage.includes('expirado')) {
          localStorage.removeItem('fjpp_token');
          localStorage.removeItem('fjpp_usuario');
          // Redirecionar apenas se estiver em uma rota protegida
          if (window.location.pathname !== '/') {
            window.location.href = '/';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

