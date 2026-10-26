import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Navbar from './components/Navbar';
import BookDetailsModal from './components/BookDetailsModal';
import AIAssistantDrawer from './components/AIAssistantDrawer';
import ToastContainer from './components/ToastContainer';

// Member Pages
import CatalogPage from './pages/member/CatalogPage';
import MemberDashboard from './pages/member/MemberDashboard';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import CirculationDeskPage from './pages/staff/CirculationDeskPage';
import CatalogManagementPage from './pages/staff/CatalogManagementPage';
import ReservationsPage from './pages/staff/ReservationsPage';
import OverduesPage from './pages/staff/OverduesPage';

// Admin Pages
import StaffManagementPage from './pages/admin/StaffManagementPage';
import PoliciesPage from './pages/admin/PoliciesPage';
import AuditLogPage from './pages/admin/AuditLogPage';

import './App.css';

function AppContent() {
  const { currentRole, activeTab, theme } = useLibrary();

  // Router dispatcher
  const renderCurrentPage = () => {
    if (currentRole === 'member') {
      switch (activeTab) {
        case 'catalog':
          return <CatalogPage />;
        case 'my-loans':
          return <MemberDashboard />;
        default:
          return <CatalogPage />;
      }
    }

    if (currentRole === 'staff') {
      switch (activeTab) {
        case 'dashboard':
          return <StaffDashboard />;
        case 'circulation':
          return <CirculationDeskPage />;
        case 'catalog-mgmt':
          return <CatalogManagementPage />;
        case 'reservations':
          return <ReservationsPage />;
        case 'overdues':
          return <OverduesPage />;
        default:
          return <StaffDashboard />;
      }
    }

    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'staff-mgmt':
          return <StaffManagementPage />;
        case 'policies':
          return <PoliciesPage />;
        case 'audit':
          return <AuditLogPage />;
        default:
          return <StaffManagementPage />;
      }
    }

    return <CatalogPage />;
  };

  return (
    <div className="app-wrapper">
      {/* Top Navigation */}
      <Navbar />

      {/* Design System Tokens Status Strip */}
      <div className="tokens-ribbon">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong>🎨 Design System Tokens ({theme.toUpperCase()}):</strong>
        </div>
        <div className="tokens-swatches">
          <span className="token-swatch">
            <span className="token-circle" style={{ backgroundColor: 'var(--color-primary)' }} />
            Primary (Oxford Navy)
          </span>
          <span className="token-swatch">
            <span className="token-circle" style={{ backgroundColor: 'var(--color-ai-accent)' }} />
            AI Accent (Warm Library Amber)
          </span>
          <span className="token-swatch">
            <span className="token-circle" style={{ backgroundColor: 'var(--status-available-text)' }} />
            متاح (#15803D)
          </span>
          <span className="token-swatch">
            <span className="token-circle" style={{ backgroundColor: 'var(--status-borrowed-text)' }} />
            مُعار (#1D4ED8)
          </span>
          <span className="token-swatch">
            <span className="token-circle" style={{ backgroundColor: 'var(--status-reserved-text)' }} />
            محجوز (#B45309)
          </span>
          <span className="token-swatch">
            <span className="token-circle" style={{ backgroundColor: 'var(--status-overdue-text)' }} />
            متأخر (#B91C1C)
          </span>
        </div>
        <div>
          <span>LMS Frontend v1.0 • React + Vite</span>
        </div>
      </div>

      {/* Main Page Body */}
      <main className="main-content">
        {renderCurrentPage()}
      </main>

      {/* Global Modals & Drawers */}
      <BookDetailsModal />
      <AIAssistantDrawer />
      <ToastContainer />

      {/* App Footer */}
      <footer className="app-footer">
        <div className="app-footer-container">
          <div>
            <strong>نظام إدارة المكتبة الذكي (Smart Library Management System)</strong>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              منصة رقمية موحدة لإدارة الفهرس الببليوغرافي، دورة الإعارة والتداول، ومساعد اكتشاف الكتب بالذكاء الاصطناعي.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem' }}>
            <span>دليل الاستخدام</span>
            <span>•</span>
            <span>سياسة الخصوصية</span>
            <span>•</span>
            <span>معايير إتاحة WCAG AA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}
