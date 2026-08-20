import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/projetos', label: 'Projetos' },
    { path: '/contato', label: 'Contato' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/logo-fundacao-jpp.svg"
              alt="Fundação José Possidônio Peixoto"
              className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold text-fjpp-blue-DEFAULT group-hover:text-fjpp-blue-600 transition-colors hidden lg:inline">
              Fundação José Possidônio Peixoto
            </span>
            <span className="text-xl font-bold text-fjpp-blue-DEFAULT group-hover:text-fjpp-blue-600 transition-colors lg:hidden">
              Fundação JPP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-gradient-to-r from-fjpp-blue to-fjpp-blue-700 shadow-button'
                    : 'text-fjpp-gray-700 hover:text-fjpp-blue hover:bg-fjpp-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-fjpp-gray-700 hover:bg-fjpp-blue-50 hover:text-fjpp-blue focus:outline-none transition-all"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-slide-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-white bg-gradient-to-r from-fjpp-blue to-fjpp-blue-700 shadow-button'
                    : 'text-fjpp-gray-700 hover:text-fjpp-blue hover:bg-fjpp-blue-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

