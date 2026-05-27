import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        gap: '12px',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <h2 style={{ color: 'var(--text-primary)', fontSize: 20 }}>Access Denied</h2>
        <p style={{ fontSize: 14 }}>This section is only available to administrators.</p>
      </div>
    );
  }

  return children;
}
