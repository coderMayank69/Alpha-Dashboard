import { useAuth } from '../contexts/AuthContext';
import { Package, BarChart3, Star, TrendingUp, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Welcome Header */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1 className="welcome-title">
            Good {getTimeOfDay()}, <span className="welcome-name">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="welcome-sub">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className={`welcome-role-badge ${isAdmin ? 'admin' : 'user'}`}>
          {isAdmin ? '🔑 Admin Access' : '👤 User Access'}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2 className="section-title">Quick Access</h2>
        <div className="quick-grid">
          <Link to="/products" className="quick-card products">
            <div className="quick-icon"><Package size={22} /></div>
            <div className="quick-info">
              <span className="quick-label">Products</span>
              <span className="quick-desc">Browse & manage inventory</span>
            </div>
            <ArrowRight size={16} className="quick-arrow" />
          </Link>

          {isAdmin && (
            <Link to="/analytics" className="quick-card analytics">
              <div className="quick-icon"><BarChart3 size={22} /></div>
              <div className="quick-info">
                <span className="quick-label">Analytics</span>
                <span className="quick-desc">View insights & reports</span>
              </div>
              <ArrowRight size={16} className="quick-arrow" />
            </Link>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="features-section">
        <h2 className="section-title">Platform Highlights</h2>
        <div className="features-grid">
          {FEATURES.filter(f => !f.adminOnly || isAdmin).map(f => (
            <div key={f.title} className="feature-card card">
              <div className="feature-icon" style={{ background: f.bg, color: f.color }}>
                <f.icon size={16} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const FEATURES = [
  {
    title: 'Smart Search',
    desc: 'Debounced real-time search with URL sync across all products.',
    icon: Package,
    bg: 'var(--accent-dim)', color: 'var(--accent)',
  },
  {
    title: 'Advanced Filters',
    desc: 'Multi-category filtering, rating, and stock status filters.',
    icon: ShoppingCart,
    bg: 'var(--success-dim)', color: 'var(--success)',
  },
  {
    title: 'Analytics Dashboard',
    desc: 'Rich charts with inventory value, category distribution, ratings.',
    icon: BarChart3,
    bg: 'var(--info-dim)', color: 'var(--info)',
    adminOnly: true,
  },
  {
    title: 'Live Updates',
    desc: 'Real-time product polling with live indicator badge.',
    icon: TrendingUp,
    bg: 'var(--warning-dim)', color: 'var(--warning)',
  },
  {
    title: 'Column Customizer',
    desc: 'Drag, reorder, and toggle table columns to your preference.',
    icon: Star,
    bg: 'var(--danger-dim)', color: 'var(--danger)',
  },
];
