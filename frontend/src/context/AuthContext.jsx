import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('fjpp_usuario');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fjpp_token') || '');
  const [loading, setLoading] = useState(false);

  // Carregar token do localStorage ao montar o componente
  useEffect(() => {
    const storedToken = localStorage.getItem('fjpp_token');
    const storedUsuario = localStorage.getItem('fjpp_usuario');
    
    if (storedToken && storedUsuario) {
      try {
        const parsedUsuario = JSON.parse(storedUsuario);
        setToken(storedToken);
        setUsuario(parsedUsuario);
        api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      } catch (e) {
        console.error('Erro ao parsear usuário do localStorage:', e);
        localStorage.removeItem('fjpp_token');
        localStorage.removeItem('fjpp_usuario');
        setUsuario(null);
        setToken('');
      }
    } else if (!storedToken) {
      setUsuario(null);
      setToken('');
    }
  }, []); // Executar apenas uma vez ao montar
  
  // Atualizar header quando token mudar
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      setToken(data.data.token);
      setUsuario(data.data.usuario);
      localStorage.setItem('fjpp_token', data.data.token);
      localStorage.setItem('fjpp_usuario', JSON.stringify(data.data.usuario));
      api.defaults.headers.common.Authorization = `Bearer ${data.data.token}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Credenciais inválidas',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken('');
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('fjpp_token');
    localStorage.removeItem('fjpp_usuario');
  };

  const value = useMemo(
    () => ({
      usuario,
      token,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(usuario && token),
      setUsuario,
    }),
    [usuario, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return context;
};

