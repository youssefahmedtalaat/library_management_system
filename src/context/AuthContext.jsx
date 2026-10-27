import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('library_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState('');

  const login = useCallback((email, password) => {
    setAuthError('');
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
      setAuthError('invalid_credentials');
      return { success: false };
    }

    // Strip password before storing
    const session = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      name_ar: user.name_ar,
      memberId: user.memberId || null,
      staffId: user.staffId || null,
      avatarLetter: user.avatarLetter || user.name.charAt(0)
    };

    localStorage.setItem('library_session', JSON.stringify(session));
    setCurrentUser(session);
    return { success: true, role: user.role };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('library_session');
    setCurrentUser(null);
    setAuthError('');
  }, []);

  const clearAuthError = useCallback(() => setAuthError(''), []);

  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        authError,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
