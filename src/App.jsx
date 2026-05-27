import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductStatusProvider } from './contexts/ProductStatusContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

// Lazy-loaded pages (Performance Optimization #5)
const LoginPage         = lazy(() => import('./pages/LoginPage'));
const DashboardPage     = lazy(() => import('./pages/DashboardPage'));
const ProductsPage      = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AnalyticsPage     = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage      = lazy(() => import('./pages/SettingsPage'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: 300
    }}>
      <div className="spinner" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductStatusProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Dashboard Shell */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute adminOnly>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </ProductStatusProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
