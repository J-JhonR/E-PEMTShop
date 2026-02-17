import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.service';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuth();
    };
    init();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      const role = localStorage.getItem('role') || localStorage.getItem('userRole');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/public/me');
        const me = res?.data?.data;
        if (me) {
          const nextUser = {
            id: me.id,
            email: me.email,
            firstName: me.firstName,
            lastName: me.lastName,
            phone: me.phone,
            avatarUrl: me.avatarUrl || null,
            role: me.role || role || 'client',
            token
          };
          localStorage.setItem('userData', JSON.stringify(nextUser));
          localStorage.setItem('role', nextUser.role);
          setUser(nextUser);
          setLoading(false);
          return;
        }
      } catch (e) {
        // fallback to local userData
      }

      if (userData && role) {
        const parsed = JSON.parse(userData);
        setUser({ ...parsed, role: parsed.role || role, token });
      }
    } catch (error) {
      console.error("Erreur auth:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role = 'client', authPayload = null) => {
    setLoading(true);

    const nextToken = authPayload?.token || localStorage.getItem('token') || 'mock-token-123';
    const fromPayload = authPayload?.user || {};
    const nextUser = {
      id: fromPayload.id || null,
      email: fromPayload.email || email,
      firstName: fromPayload.firstName || '',
      lastName: fromPayload.lastName || '',
      phone: fromPayload.phone || '',
      avatarUrl: fromPayload.avatarUrl || null,
      role: authPayload?.role || role,
      token: nextToken
    };

    localStorage.setItem('token', nextToken);
    localStorage.setItem('userData', JSON.stringify(nextUser));
    localStorage.setItem('role', nextUser.role);
    localStorage.setItem('userRole', nextUser.role);

    setUser(nextUser);
    setLoading(false);
    window.location.href = '/';
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('role');
    localStorage.removeItem('userRole');
    localStorage.removeItem('vendorData');
    setUser(null);
    window.history.replaceState(null, '', '/');
    window.location.href = '/';
  };

  const value = {
    user,
    loading,
    login,
    logout,
    setUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
