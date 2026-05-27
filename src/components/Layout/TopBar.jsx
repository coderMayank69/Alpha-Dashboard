import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './TopBar.css';

const BREADCRUMBS = {
  '/dashboard': ['Dashboard'],
  '/products':  ['Dashboard', 'Products'],
  '/analytics': ['Dashboard', 'Analytics'],
  '/settings':  ['Dashboard', 'Settings'],
};

export default function TopBar({ onMenuToggle, mobileOpen }) {
  const { user, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const crumbs = BREADCRUMBS[location.pathname] ||
    (location.pathname.startsWith('/products/') ? ['Dashboard', 'Products', 'Detail'] : ['Dashboard']);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile menu toggle */}
        <button className="btn-icon mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          {crumbs.map((crumb, i) => (
            <span key={crumb} className="breadcrumb-item">
              {i > 0 && <span className="breadcrumb-sep">/</span>}
              <span className={i === crumbs.length - 1 ? 'breadcrumb-current' : 'breadcrumb-link'}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="topbar-right">
        {/* Notification Bell */}
        <button className="btn-icon" aria-label="Notifications" data-tooltip="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {/* User Dropdown */}
        <div className="user-dropdown" onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}>
          <button
            className="user-trigger"
            onClick={() => setDropdownOpen(o => !o)}
            aria-label="User menu"
          >
            <div className={`user-avatar-sm ${isAdmin ? 'admin' : ''}`}>{user?.avatar}</div>
            <span className="user-trigger-name">{user?.name?.split(' ')[0]}</span>
            <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu animate-fade-in">
              <div className="dropdown-header">
                <div className="dropdown-avatar">{user?.avatar}</div>
                <div>
                  <div className="dropdown-name">{user?.name}</div>
                  <div className="dropdown-email">{user?.email}</div>
                </div>
              </div>
              <hr className="divider" />
              <button className="dropdown-item">
                <User size={14} /> Profile
              </button>
              <hr className="divider" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
