import React from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
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
  const { currentRole, activeTab } = useLibrary();

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
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="main-content">
          <div className="page-container">
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <BookDetailsModal />
      <AIAssistantDrawer />
      <ToastContainer />
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
