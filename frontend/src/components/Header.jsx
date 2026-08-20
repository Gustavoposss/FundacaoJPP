import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, PersonCircle, ChevronDown } from 'react-bootstrap-icons';
import { useAuth } from '../hooks/useAuth';
import classNames from 'classnames';

export const Header = ({ onToggleSidebar }) => {
  const { usuario, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-[90] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-soft">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl text-fjpp-gray-700 hover:bg-fjpp-blue-50 hover:text-fjpp-blue transition-all"
        >
          <List size={24} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-fjpp-gray-50 hover:bg-fjpp-blue hover:text-white text-fjpp-gray-700 transition-all shadow-soft hover:shadow-button"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fjpp-blue to-fjpp-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline font-medium">{usuario?.nome || 'Usuário'}</span>
              <ChevronDown 
                size={18} 
                className={classNames(
                  'transition-transform duration-200',
                  dropdownOpen && 'rotate-180'
                )} 
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-gray-100 py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-fjpp-gray-900">{usuario?.nome || 'Usuário'}</p>
                  <p className="text-xs text-fjpp-gray-500 mt-0.5">{usuario?.email || ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-fjpp-red-500 hover:bg-fjpp-red-50 transition-colors flex items-center gap-2 mt-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair da conta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onToggleSidebar: PropTypes.func.isRequired,
};

