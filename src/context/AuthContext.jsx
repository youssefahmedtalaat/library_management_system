import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers } from '../data/mockData';
import { api } from '../services/api';

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

  const login = useCallback(async (email, password) => {
    setAuthError('');

    // Try backend REST API first
    try {
      const data = await api.auth.login({ email, password });
      if (data?.token && data?.user) {
        localStorage.setItem('library_token', data.token);
        const session = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
          name: data.user.fullName,
          name_ar: data.user.fullName,
          memberId: data.user.memberId || null,
          staffId: data.user.role !== 'member' ? data.user.id : null,
          avatarLetter: data.user.fullName?.charAt(0).toUpperCase() || 'U'
        };
        localStorage.setItem('library_session', JSON.stringify(session));
        setCurrentUser(session);
        return { success: true, role: data.user.role };
      }
    } catch {
      // Backend error or offline, fallback to mock users
    }

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

  const registerMember = useCallback(async (name, email, password) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    // Try backend REST API
    try {
      const data = await api.auth.register({ fullName: name, email: cleanEmail, password });
      if (data?.token && data?.user) {
        localStorage.setItem('library_token', data.token);
        const session = {
          id: data.user.id,
          email: data.user.email,
          role: 'member',
          name: data.user.fullName,
          name_ar: data.user.fullName,
          memberId: data.user.memberId,
          staffId: null,
          avatarLetter: data.user.fullName?.charAt(0).toUpperCase() || 'M'
        };
        localStorage.setItem('library_session', JSON.stringify(session));
        setCurrentUser(session);
        return { success: true, role: 'member', user: session };
      }
    } catch (err) {
      if (err.code === 'EMAIL_ALREADY_EXISTS') {
        setAuthError('email_exists');
        return { success: false, error: 'email_exists' };
      }
    }

    const existing = mockUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      setAuthError('email_exists');
      return { success: false, error: 'email_exists' };
    }

    const newMemberId = Date.now();
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      email: cleanEmail,
      password,
      role: 'member',
      name: name.trim(),
      name_ar: name.trim(),
      memberId: newMemberId,
      avatarLetter: name.trim().charAt(0).toUpperCase()
    };

    mockUsers.push(newUser);

    const session = {
      id: newUser.id,
      email: newUser.email,
      role: 'member',
      name: newUser.name,
      name_ar: newUser.name_ar,
      memberId: newMemberId,
      staffId: null,
      avatarLetter: newUser.avatarLetter
    };

    localStorage.setItem('library_session', JSON.stringify(session));
    setCurrentUser(session);
    return { success: true, role: 'member', user: session };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('library_session');
    localStorage.removeItem('library_token');
    api.auth.logout().catch(() => {});
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
        registerMember,
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
