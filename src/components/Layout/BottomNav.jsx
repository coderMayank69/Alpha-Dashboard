import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/products',  icon: Package,         label: 'Products' },
  { to: '/analytics', icon: BarChart3,        label: 'Analytics', adminOnly: true },
  { to: '/settings',  icon: Settings,         label: 'Settings' },
];

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ to, icon: Icon, label, adminOnly }) => {
        if (adminOnly && !isAdmin) return null;
        const active = location.pathname.startsWith(to);
        return (
          <NavLink key={to} to={to} className={`bnav-item ${active ? 'active' : ''}`}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span className="bnav-label">{label}</span>
            {active && <span className="bnav-indicator" />}
          </NavLink>
        );
      })}
    </nav>
  );
}
