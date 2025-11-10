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
    <header className="sticky top-0 z-[90] bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-fjpp-blue hover:bg-fjpp-light transition-colors"
        >
          <List size={22} />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fjpp-light hover:bg-fjpp-blue hover:text-white text-fjpp-blue transition-colors"
            >
              <PersonCircle size={20} />
              <span className="hidden sm:inline">{usuario?.nome || 'Usuário'}</span>
              <ChevronDown size={16} className={classNames('transition-transform', dropdownOpen && 'rotate-180')} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Sair
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

