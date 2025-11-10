import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HouseDoor, People, CalendarEvent, GraphUp } from 'react-bootstrap-icons';
import classNames from 'classnames';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HouseDoor },
  { to: '/idosos', label: 'Idosos', icon: People },
  { to: '/eventos', label: 'Eventos', icon: CalendarEvent },
  { to: '/relatorios', label: 'Relatórios', icon: GraphUp },
];

export const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <aside
      style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        width: `${sidebarWidth}px`,
        height: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        padding: 0,
        margin: 0
      }}
      aria-label="Sidebar"
    >
      {/* Brand/Logo Section */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '24px',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(0, 168, 89, 0.1)', 
            border: '1px solid rgba(0, 168, 89, 0.2)', 
            color: '#00a859'
          }}
        >
          <HouseDoor size={20} />
        </div>
        {!collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1f2937' }}>Fundação J.P.P.</span>
            <small style={{ fontSize: '12px', color: '#6b7280' }}>Painel Admin</small>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px', marginTop: '16px' }}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '0 12px 12px 0',
                textDecoration: 'none',
                color: isActive ? '#00a859' : '#4b5563',
                backgroundColor: isActive ? '#e0f2e7' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingLeft: collapsed ? '12px' : '16px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 168, 89, 0.08)';
                  e.currentTarget.style.color = '#00a859';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#4b5563';
                }
              }}
            >
              <IconComponent
                size={20}
                style={{
                  color: isActive ? '#00a859' : '#9ca3af',
                  transition: 'color 0.2s ease'
                }}
              />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};

Sidebar.defaultProps = {
  collapsed: false,
};

