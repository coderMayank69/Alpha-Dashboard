import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, BarChart3,
  Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from './Logo';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products',  icon: Package,         label: 'Products' },
  { to: '/analytics', icon: BarChart3,        label: 'Analytics', adminOnly: true },
  { to: '/settings',  icon: Settings,         label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <Logo size={28} />
        {!collapsed && <span className="logo-text">Alpha</span>}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label, adminOnly }) => {
          if (adminOnly && !isAdmin) return null;
          const active = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`nav-item ${active ? 'active' : ''}`}
              title={collapsed ? label : undefined}
            >
              {/* Active bar indicator */}
              <span className="nav-active-bar" aria-hidden="true" />

              {/* Icon */}
              <span className="nav-icon">
                <Icon size={17} strokeWidth={active ? 2.3 : 1.8} />
              </span>

              {/* Label (hidden when collapsed) */}
              {!collapsed && <span className="nav-label">{label}</span>}

              {/* Real tooltip span — won't overflow viewport */}
              <span className="nav-tooltip" aria-hidden="true">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`user-avatar ${isAdmin ? 'admin' : ''}`}>
            {user?.avatar}
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className={`badge-sm ${isAdmin ? 'badge-accent' : 'badge-muted'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          className="collapse-btn"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  );
}
