import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import PublicLayout from '../pages/public/PublicLayout';
import LibrarianLayout from '../pages/librarian/LibrarianLayout';
import AdminLayout from '../pages/admin/AdminLayout';

// Public & Member Pages
import LoginPage from '../pages/public/LoginPage';
import CatalogPage from '../pages/member/CatalogPage';
import MemberDashboard from '../pages/member/MemberDashboard';

// Librarian Pages
import LibrarianDashboard from '../pages/librarian/LibrarianDashboard';
import CirculationDeskPage from '../pages/librarian/CirculationDeskPage';
import CatalogManagementPage from '../pages/librarian/CatalogManagementPage';
import ReservationsPage from '../pages/librarian/ReservationsPage';
import OverduesPage from '../pages/librarian/OverduesPage';

// Admin Pages
import StaffManagementPage from '../pages/admin/StaffManagementPage';
import PoliciesPage from '../pages/admin/PoliciesPage';
import AuditLogPage from '../pages/admin/AuditLogPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* ─── Public Website & Member Portal ─── */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<CatalogPage />} />
        <Route
          path="my-loans"
          element={
            <ProtectedRoute>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ─── Unified Login Page ─── */}
      <Route path="/login" element={<LoginPage />} />

      {/* ─── Protected Librarian Dashboard ─── */}
      <Route
        path="/librarian"
        element={
          <ProtectedRoute role="librarian">
            <LibrarianLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LibrarianDashboard />} />
        <Route path="circulation" element={<CirculationDeskPage />} />
        <Route path="catalog" element={<CatalogManagementPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="overdues" element={<OverduesPage />} />
      </Route>

      {/* ─── Protected Admin Dashboard ─── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffManagementPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="audit" element={<AuditLogPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
