import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Profile</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: isAdmin ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
            color: isAdmin ? 'var(--accent)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, border: '1px solid var(--border)'
          }}>
            {user?.avatar}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>
          <span className={`badge ${isAdmin ? 'badge-accent' : 'badge-muted'}`} style={{ marginLeft: 'auto' }}>
            {isAdmin ? '🔑 Admin' : '👤 User'}
          </span>
        </div>
      </div>

      {/* Role Capabilities */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={15} /> Access Level
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'View Products', allowed: true },
            { label: 'View Product Details', allowed: true },
            { label: 'See Only Published Products', allowed: !isAdmin },
            { label: 'See All Products (incl. hidden)', allowed: isAdmin },
            { label: 'Toggle Product Visibility', allowed: isAdmin },
            { label: 'View Analytics Dashboard', allowed: isAdmin },
          ].map(({ label, allowed }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span style={{ color: allowed ? 'var(--success)' : 'var(--text-muted)', fontWeight: 600 }}>
                {allowed ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button className="btn btn-danger" onClick={handleLogout} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6 }}>
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}
