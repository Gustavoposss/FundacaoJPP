import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

const mapUsuario = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    nome: user.user_metadata?.nome || user.user_metadata?.full_name || user.email,
    ...user.user_metadata,
  };
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let ativo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSession(data.session);
      setUsuario(mapUsuario(data.session?.user));
      setInitializing(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, novaSessao) => {
      setSession(novaSessao);
      setUsuario(mapUsuario(novaSessao?.user));
    });

    return () => {
      ativo = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, senha) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        return {
          success: false,
          message:
            error.message === 'Invalid login credentials'
              ? 'Credenciais inválidas'
              : error.message,
        };
      }

      setSession(data.session);
      setUsuario(mapUsuario(data.user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Não foi possível entrar. Tente novamente.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUsuario(null);
  };

  const value = useMemo(
    () => ({
      usuario,
      token: session?.access_token || '',
      loading,
      initializing,
      login,
      logout,
      isAuthenticated: Boolean(session),
      setUsuario,
    }),
    [usuario, session, loading, initializing]
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
