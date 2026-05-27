import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Settings, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products',  icon: Package,         label: 'Products' },
  { to: '/analytics', icon: BarChart3,        label: 'Analytics', adminOnly: true },
  { to: '/settings',  icon: Settings,         label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={18} />
        </div>
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
              data-tooltip={collapsed ? label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
              {active && !collapsed && <div className="nav-active-indicator" />}
            </NavLink>
          );
        })}
      </nav>

      {/* User Badge */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`user-avatar ${isAdmin ? 'admin' : ''}`}>
            {user?.avatar}
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">{user?.name}</span>
              <span className={`badge badge-sm ${isAdmin ? 'badge-accent' : 'badge-muted'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button className="collapse-btn btn-icon" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
