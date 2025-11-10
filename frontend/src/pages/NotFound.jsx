import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-fjpp-light p-4">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center max-w-md w-full">
      <h1 className="text-6xl font-bold text-fjpp-blue mb-4">404</h1>
      <p className="text-gray-600 mb-6">Página não encontrada.</p>
      <Link
        to="/dashboard"
        className="inline-block px-6 py-3 text-sm font-medium text-white bg-fjpp-green rounded-lg hover:bg-green-600 transition-colors"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  </div>
);

