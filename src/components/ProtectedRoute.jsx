import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards a route based on authentication and required role.
 * - Not authenticated → redirect to /login
 * - Wrong role → redirect to home (/)
 */
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && currentUser.role !== role) {
    // Redirect to their own home based on role
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    if (currentUser.role === 'librarian') return <Navigate to="/librarian" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
