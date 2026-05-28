import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, Menu, X, ChevronDown, Sun, Moon, Monitor, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from './Logo';
import './TopBar.css';

const BREADCRUMBS = {
  '/dashboard': ['Dashboard'],
  '/products':  ['Products'],
  '/analytics': ['Analytics'],
  '/settings':  ['Settings'],
};

export default function TopBar({ onMenuToggle, mobileOpen }) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const crumbs = BREADCRUMBS[location.pathname] ??
    (location.pathname.startsWith('/products/') ? ['Products', 'Detail'] : ['Dashboard']);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  const themeLabel = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile menu toggle */}
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        {/* Mobile logo */}
        <div className="topbar-mobile-logo">
          <Logo size={24} />
          <span className="topbar-brand">Alpha</span>
        </div>

        {/* Breadcrumb — desktop only */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            Home
          </span>
          {crumbs.map((crumb, i) => (
            <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span className="breadcrumb-sep">›</span>
              <span className={i === crumbs.length - 1 ? 'breadcrumb-current' : 'breadcrumb-link'}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="topbar-right">
        {/* Theme cycle */}
        <button
          className="theme-toggle"
          onClick={cycleTheme}
          aria-label={`Switch theme (current: ${themeLabel})`}
          data-tooltip={`${themeLabel} mode`}
          data-tooltip-position="bottom"
        >
          <ThemeIcon size={16} className="theme-icon" />
        </button>

        {/* Notification Bell */}
        <button className="btn-icon notif-btn" aria-label="Notifications" data-tooltip="Notifications" data-tooltip-position="bottom">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>

        {/* User Dropdown */}
        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="user-trigger"
            onClick={() => setDropdownOpen(o => !o)}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            <div className={`user-avatar-sm ${isAdmin ? 'admin' : ''}`}>
              {user?.avatar}
            </div>
            <span className="user-trigger-name">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={13} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              {/* Header */}
              <div className="dropdown-header">
                <div className="dropdown-avatar">{user?.avatar}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="dropdown-name">{user?.name}</div>
                  <div className="dropdown-email">{user?.email}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="dropdown-items">
                <button className="dropdown-item" onClick={() => { navigate('/settings'); setDropdownOpen(false); }}>
                  <Settings size={14} /> Settings
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={handleLogout}>
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
