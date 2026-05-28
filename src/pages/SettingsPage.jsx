import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Sun, Moon, Monitor } from 'lucide-react';
import './SettingsPage.css';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Clean & bright' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Match OS setting' },
];

export default function SettingsPage() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="settings-page animate-fade-in">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-sub">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card settings-card">
        <h2 className="settings-card-title">Profile</h2>
        <div className="profile-row">
          <div className={`profile-avatar ${isAdmin ? 'admin' : ''}`}>
            {user?.avatar}
          </div>
          <div className="profile-info">
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
          </div>
          <span className={`badge ${isAdmin ? 'badge-accent' : 'badge-muted'}`}>
            {isAdmin ? '🔑 Admin' : '👤 User'}
          </span>
        </div>
      </div>

      {/* Appearance / Theme */}
      <div className="card settings-card">
        <h2 className="settings-card-title">Appearance</h2>
        <p className="settings-card-desc">Choose your preferred theme</p>
        <div className="theme-options">
          {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              className={`theme-option ${theme === value ? 'active' : ''}`}
              onClick={() => setTheme(value)}
            >
              <Icon size={20} />
              <span className="theme-option-label">{label}</span>
              <span className="theme-option-desc">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role Capabilities */}
      <div className="card settings-card">
        <h2 className="settings-card-title">
          <Shield size={15} /> Access Level
        </h2>
        <div className="access-list">
          {[
            { label: 'View Products', allowed: true },
            { label: 'View Product Details', allowed: true },
            { label: 'See Only Published Products', allowed: !isAdmin },
            { label: 'See All Products (incl. hidden)', allowed: isAdmin },
            { label: 'Toggle Product Visibility', allowed: isAdmin },
            { label: 'View Analytics Dashboard', allowed: isAdmin },
          ].map(({ label, allowed }) => (
            <div key={label} className="access-row">
              <span className="access-label">{label}</span>
              <span className={`access-value ${allowed ? 'yes' : 'no'}`}>
                {allowed ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button className="btn btn-danger settings-logout" onClick={handleLogout}>
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}
