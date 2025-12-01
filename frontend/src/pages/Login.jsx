import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', senha: '' });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(credentials.email, credentials.senha);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fjpp-light p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h5 className="text-gray-500 text-sm mb-2">Sistema de Presença</h5>
          <h3 className="text-2xl font-bold text-fjpp-blue-DEFAULT">Fundação José Possidônio Peixoto</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="exemplo@fundacao.org"
              value={credentials.email}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, email: event.target.value }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue-DEFAULT focus:border-fjpp-blue-DEFAULT outline-none transition-colors"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="login-senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="login-senha"
              type="password"
              placeholder="********"
              value={credentials.senha}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, senha: event.target.value }))
              }
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fjpp-blue-DEFAULT focus:border-fjpp-blue-DEFAULT outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-fjpp-green-DEFAULT rounded-lg hover:bg-fjpp-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

