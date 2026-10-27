import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Sparkles, Sun, Moon, Globe, LogOut,
  BarChart3, ArrowRightLeft, BookMarked, Clock,
  AlertTriangle, Bell, Search, Filter, X, Calendar,
  ExternalLink, HelpCircle
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import AIAssistantDrawer from '../../components/AIAssistantDrawer';
import BookDetailsModal from '../../components/BookDetailsModal';
import ToastContainer from '../../components/ToastContainer';

const librarianNavItems = [
  { to: '/librarian', label: 'لوحة المتابعة', labelEn: 'Dashboard', icon: BarChart3, end: true },
  { to: '/librarian/circulation', label: 'مكتب الإعارة', labelEn: 'Circulation Desk', icon: ArrowRightLeft },
  { to: '/librarian/catalog', label: 'إدارة الفهرس', labelEn: 'Catalog Management', icon: BookMarked },
  { to: '/librarian/reservations', label: 'الحجوزات', labelEn: 'Reservations', icon: Clock },
  { to: '/librarian/overdues', label: 'المتأخرات والغرامات', labelEn: 'Overdues & Fines', icon: AlertTriangle },
];

function DashboardSidebar({ navItems }) {
  const { lang, toggleTheme, toggleLang, theme, openAIDrawer, loans, reservations } = useLibrary();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);
  const activeReservations = reservations.filter((r) => r.status === 'active');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Logo */}
      <div className="dashboard-sidebar-header">
        <div className="dashboard-sidebar-logo">
          <div className="dashboard-sidebar-logo-icon">
            <BookOpen size={20} />
          </div>
          <div className="dashboard-sidebar-logo-text">
            <span className="dashboard-sidebar-logo-title">{isAr ? 'المكتبة الذكية' : 'Smart Library'}</span>
            <span className="dashboard-sidebar-logo-version">LMS 2026</span>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="dashboard-sidebar-user-card">
        <div className="dashboard-sidebar-user-avatar">
          {currentUser?.avatarLetter || 'S'}
        </div>
        <div className="dashboard-sidebar-user-info">
          <span className="dashboard-sidebar-user-name">
            {isAr ? currentUser?.name_ar : currentUser?.name}
          </span>
          <span className="dashboard-sidebar-user-role">
            {isAr
              ? (currentUser?.role === 'librarian' ? 'أمين المكتبة' : 'مدير النظام')
              : (currentUser?.role === 'librarian' ? 'Librarian' : 'System Admin')}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="dashboard-sidebar-nav">
        <span className="dashboard-sidebar-nav-label">
          {isAr ? 'القائمة الرئيسية' : 'Main Menu'}
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          let badge = null;
          if (item.to.includes('overdues') && overdueLoans.length > 0) {
            badge = <span className="dashboard-sidebar-badge danger">{overdueLoans.length}</span>;
          }
          if (item.to.includes('reservations') && activeReservations.length > 0) {
            badge = <span className="dashboard-sidebar-badge info">{activeReservations.length}</span>;
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `dashboard-sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={17} />
              <span className="dashboard-sidebar-nav-text">
                {isAr ? item.label : item.labelEn}
              </span>
              {badge}
            </NavLink>
          );
        })}
      </nav>

      {/* Tools */}
      <div className="dashboard-sidebar-section">
        <span className="dashboard-sidebar-nav-label">
          {isAr ? 'الأدوات' : 'Tools'}
        </span>
        <button className="dashboard-sidebar-nav-item dashboard-ai-btn" onClick={openAIDrawer}>
          <Sparkles size={17} />
          <span className="dashboard-sidebar-nav-text">
            {isAr ? 'المساعد الذكي' : 'AI Assistant'}
          </span>
        </button>
      </div>

      <div className="dashboard-sidebar-spacer" />

      {/* Bottom */}
      <div className="dashboard-sidebar-bottom">
        {/* Public site link (librarians can see the public site) */}
        <Link
          to="/"
          className="dashboard-sidebar-nav-item dashboard-sidebar-public-link"
        >
          <ExternalLink size={17} />
          <span className="dashboard-sidebar-nav-text">
            {isAr ? 'الموقع العام' : 'Public Site'}
          </span>
        </Link>

        {/* Bottom actions row */}
        <div className="dashboard-sidebar-actions-row">
          <button
            className="dashboard-sidebar-action-btn"
            onClick={toggleTheme}
            title={isAr ? 'تبديل السمة' : 'Toggle theme'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            className="dashboard-sidebar-action-btn"
            onClick={toggleLang}
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe size={16} />
          </button>
          <button
            className="dashboard-sidebar-action-btn"
            title={isAr ? 'المساعدة' : 'Help'}
          >
            <HelpCircle size={16} />
          </button>
          <button
            id="dashboard-logout-btn"
            className="dashboard-sidebar-action-btn dashboard-logout-btn"
            onClick={handleLogout}
            title={isAr ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

function DashboardTopBar() {
  const { lang, loans, activeTab } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const isAr = lang === 'ar';

  const overdueCount = loans.filter((l) => l.status === 'overdue' && !l.returned_at).length;

  const notifications = [
    {
      id: 1,
      title: isAr ? 'موعد استحقاق قريب' : 'Upcoming Due Date',
      text: isAr ? 'كتاب "الكود النظيف" مستحق للإرجاع خلال 48 ساعة.' : 'Book "Clean Code" is due for return within 48 hours.',
      time: isAr ? 'منذ ساعتين' : '2h ago',
      type: 'warning',
      unread: true
    },
    {
      id: 2,
      title: isAr ? 'إشعار قائمة الحجز' : 'Reservation Hold Notice',
      text: isAr ? 'أنت الآن في المرتبة #1 لحجز كتاب "ثلاثية غرناطة".' : 'A member is #1 in queue for "Granada: A Novel".',
      time: isAr ? 'منذ يوم' : '1d ago',
      type: 'info',
      unread: true
    },
    {
      id: 3,
      title: isAr ? 'تحديث الفهرس' : 'Catalog Updated',
      text: isAr ? 'تمت إضافة 4 مراجع جديدة في جناح الذكاء الاصطناعي.' : '4 new titles added to the AI & Technology wing.',
      time: isAr ? 'منذ يومين' : '2d ago',
      type: 'success',
      unread: false
    }
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getDateStr = () => {
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', opts);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title-group">
          <h1 className="topbar-title">
            {isAr ? 'المكتبة الذكية' : 'Smart Library'}
          </h1>
          <span className="topbar-date">
            <Calendar size={13} />
            {getDateStr()}
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder={isAr ? 'ابحث عن كتاب، عضو، أو رقم ISBN...' : 'Search books, members, or ISBN...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="topbar-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
          <button className="topbar-search-filter" title={isAr ? 'تصفية متقدمة' : 'Advanced Filter'}>
            <Filter size={14} />
          </button>
        </div>

        {/* View Public Site button */}
        <Link
          to="/"
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
          title={isAr ? 'عرض الواجهة العامة للمكتبة' : 'View Public Catalog Website'}
        >
          <ExternalLink size={14} />
          <span>{isAr ? 'الموقع العام' : 'Public Site'}</span>
        </Link>

        {/* Notifications */}
        <div className="topbar-notifications-wrapper">
          <button
            className={`topbar-icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={isAr ? 'التنبيهات' : 'Notifications'}
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="topbar-notification-dot">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="topbar-overlay" onClick={() => setShowNotifications(false)} />
              <div className="topbar-notifications-dropdown">
                <div className="topbar-notifications-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={15} color="var(--color-primary)" />
                    <span className="topbar-notifications-title">
                      {isAr ? 'الإشعارات' : 'Notifications'}
                    </span>
                  </div>
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                    {unreadCount} {isAr ? 'جديدة' : 'new'}
                  </span>
                </div>
                <div className="topbar-notifications-list">
                  {notifications.map((n) => (
                    <div key={n.id} className={`topbar-notification-item ${n.unread ? 'unread' : ''}`}>
                      <div className={`topbar-notification-indicator ${n.type}`} />
                      <div className="topbar-notification-content">
                        <div className="topbar-notification-row">
                          <strong>{n.title}</strong>
                          <span className="topbar-notification-time">{n.time}</span>
                        </div>
                        <p className="topbar-notification-text">{n.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default function LibrarianLayout() {
  return (
    <div className="app-layout">
      <DashboardSidebar navItems={librarianNavItems} />
      <div className="app-main">
        <DashboardTopBar />
        <main className="main-content">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
      <BookDetailsModal />
      <AIAssistantDrawer />
      <ToastContainer />
    </div>
  );
}
