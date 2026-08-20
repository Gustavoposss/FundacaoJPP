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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fjpp-blue-50 via-white to-fjpp-green-50 p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-elevated border border-gray-100 p-10 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-fjpp-blue to-fjpp-blue-700 rounded-2xl flex items-center justify-center shadow-card">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h5 className="text-fjpp-green-600 text-sm font-semibold mb-2 uppercase tracking-wide">Sistema de Presença</h5>
          <h3 className="text-2xl font-bold text-fjpp-blue">Fundação José Possidônio Peixoto</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="login-email" className="block text-sm font-semibold text-fjpp-gray-700 mb-2">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-all hover:border-gray-300 bg-white"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="login-senha" className="block text-sm font-semibold text-fjpp-gray-700 mb-2">
              Senha
            </label>
            <input
              id="login-senha"
              type="password"
              placeholder="••••••••"
              value={credentials.senha}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, senha: event.target.value }))
              }
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-fjpp-blue focus:border-fjpp-blue outline-none transition-all hover:border-gray-300 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-fjpp-green to-fjpp-green-600 rounded-xl hover:from-fjpp-green-600 hover:to-fjpp-green-700 transition-all shadow-button hover:shadow-elevated transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

