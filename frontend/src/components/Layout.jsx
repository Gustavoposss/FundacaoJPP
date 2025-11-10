import { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = ({ requiresAuth = true }) => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 256;

  return (
    <>
      {requiresAuth && <Sidebar collapsed={collapsed} />}
      <div
        style={{ 
          marginLeft: requiresAuth ? `${sidebarWidth}px` : '0',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: requiresAuth ? `calc(100% - ${sidebarWidth}px)` : '100%'
        }}
      >
        {requiresAuth && (
          <Header onToggleSidebar={() => setCollapsed((prev) => !prev)} />
        )}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

Layout.propTypes = {
  requiresAuth: PropTypes.bool,
};

Layout.defaultProps = {
  requiresAuth: true,
};

