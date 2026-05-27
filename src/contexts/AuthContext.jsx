import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const USERS = {
  'admin@alpha.io': {
    id: 1,
    name: 'Admin User',
    email: 'admin@alpha.io',
    password: 'admin123',
    role: 'admin',
    avatar: 'AU',
  },
  'user@alpha.io': {
    id: 2,
    name: 'Demo User',
    email: 'user@alpha.io',
    password: 'user123',
    role: 'user',
    avatar: 'DU',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('alpha_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('alpha_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('alpha_user');
    }
  }, [user]);

  const login = (email, password) => {
    const found = USERS[email.toLowerCase()];
    if (found && found.password === password) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => setUser(null);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
