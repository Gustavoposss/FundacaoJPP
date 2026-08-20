import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { HouseDoor, People, CalendarEvent, GraphUp, Globe, PersonBadge, Award } from 'react-bootstrap-icons';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HouseDoor },
  { to: '/idosos', label: 'Idosos', icon: People },
  { to: '/eventos', label: 'Eventos', icon: CalendarEvent },
  { to: '/relatorios', label: 'Relatórios', icon: GraphUp },
];

const menuItemsSitePublico = [
  { to: '/eventos-publicos', label: 'Eventos Públicos', icon: Globe },
  { to: '/membros-equipe', label: 'Membros Equipe', icon: PersonBadge },
  { to: '/patrocinadores', label: 'Patrocinadores', icon: Award },
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
        borderRight: '1px solid #f3f4f6',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        zIndex: 1000,
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        overflowY: 'auto',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: '24px',
          borderBottom: '1px solid #f3f4f6',
          minHeight: '80px',
          backgroundColor: '#fafbfd'
        }}
      >
        <img 
          src="/logo-fundacao-jpp.svg"
          alt="Fundação José Possidônio Peixoto"
          style={{
            width: collapsed ? '40px' : '180px',
            height: collapsed ? '40px' : 'auto',
            maxHeight: collapsed ? '40px' : '60px',
            objectFit: 'contain',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onError={(e) => {
            console.error('Erro ao carregar logo:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 12px', marginTop: '20px' }}>
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
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? '#00a859' : '#6b7280',
                backgroundColor: isActive ? '#e8f8f0' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingLeft: collapsed ? '12px' : '16px',
                borderLeft: isActive ? '3px solid #00a859' : '3px solid transparent',
                marginLeft: collapsed ? '0' : '8px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.color = '#00a859';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <IconComponent
                size={22}
                style={{
                  color: isActive ? '#00a859' : '#9ca3af',
                  transition: 'color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0
                }}
              />
              {!collapsed && <span style={{ transition: 'opacity 0.3s ease' }}>{item.label}</span>}
            </NavLink>
          );
        })}
        
        {/* Separador */}
        {!collapsed && (
          <div style={{ margin: '24px 0 12px 0', padding: '0 24px' }}>
            <div style={{ height: '1px', backgroundColor: '#e5e7eb', marginBottom: '12px' }}></div>
            <p style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              color: '#9ca3af', 
              textTransform: 'uppercase', 
              letterSpacing: '1px',
              marginBottom: '8px'
            }}>
              Site Público
            </p>
          </div>
        )}
        
        {/* Menu Site Público */}
        {menuItemsSitePublico.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? '#00a859' : '#6b7280',
                backgroundColor: isActive ? '#e8f8f0' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                justifyContent: collapsed ? 'center' : 'flex-start',
                paddingLeft: collapsed ? '12px' : '16px',
                borderLeft: isActive ? '3px solid #00a859' : '3px solid transparent',
                marginLeft: collapsed ? '0' : '8px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.color = '#00a859';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <IconComponent
                size={22}
                style={{
                  color: isActive ? '#00a859' : '#9ca3af',
                  transition: 'color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0
                }}
              />
              {!collapsed && <span style={{ transition: 'opacity 0.3s ease' }}>{item.label}</span>}
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

