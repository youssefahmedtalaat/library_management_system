import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Sparkles, Sun, Moon, Globe, LogOut,
  Clock, LogIn, LayoutDashboard, Shield, User, ChevronDown
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import { useAuth } from '../../context/AuthContext';
import BookDetailsModal from '../../components/BookDetailsModal';
import AIAssistantDrawer from '../../components/AIAssistantDrawer';
import ToastContainer from '../../components/ToastContainer';
import Footer from '../../components/Footer';

export default function PublicLayout() {
  const { lang, toggleTheme, toggleLang, theme, openAIDrawer, loans, reservations, currentMemberId } = useLibrary();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isAr = lang === 'ar';

  const memberActiveLoans = loans.filter((l) => l.member_id === currentMemberId && !l.returned_at);
  const memberActiveRes = reservations.filter((r) => r.member_id === currentMemberId && r.status === 'active');
  const totalMemberActivity = memberActiveLoans.length + memberActiveRes.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMyLoansClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: { pathname: '/my-loans' } } });
    }
  };

  return (
    <div className="public-site-layout" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Navbar */}
      <header className="public-navbar">
        <div className="public-navbar-container">
          {/* Logo */}
          <Link to="/" className="public-navbar-logo">
            <div className="public-logo-icon">
              <BookOpen size={20} />
            </div>
            <div className="public-logo-text">
              <span className="public-logo-title">{isAr ? 'المكتبة الذكية' : 'Smart Library'}</span>
              <span className="public-logo-badge">LMS 2026</span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="public-navbar-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>{isAr ? 'فهرس الكتب' : 'Book Catalog'}</span>
            </NavLink>

            <NavLink
              to="/my-loans"
              onClick={handleMyLoansClick}
              className={({ isActive }) => `public-nav-link ${isActive ? 'active' : ''}`}
            >
              <Clock size={16} />
              <span>{isAr ? 'إعاراتي وحجوزاتي' : 'My Loans & Reservations'}</span>
              {isAuthenticated && currentUser?.role === 'member' && totalMemberActivity > 0 && (
                <span className="public-nav-badge">{totalMemberActivity}</span>
              )}
            </NavLink>

            <button
              type="button"
              className="public-nav-link public-ai-trigger"
              onClick={() => openAIDrawer()}
            >
              <Sparkles size={16} />
              <span>{isAr ? 'المساعد الذكي' : 'AI Assistant'}</span>
            </button>
          </nav>

          {/* Right Tools & Authentication */}
          <div className="public-navbar-actions">
            {/* Theme Toggle */}
            <button
              type="button"
              className="public-tool-btn"
              onClick={toggleTheme}
              title={isAr ? 'تبديل المظهر' : 'Toggle theme'}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
            </button>

            {/* Language Toggle */}
            <button
              type="button"
              className="public-tool-btn public-lang-btn"
              onClick={toggleLang}
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
              aria-label="Toggle language"
            >
              <Globe size={16} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>{isAr ? 'EN' : 'ع'}</span>
            </button>

            {/* Authentication area */}
            {!isAuthenticated ? (
              <Link to="/login" className="btn btn-primary public-login-btn">
                <LogIn size={15} />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </Link>
            ) : (
              <div className="public-user-area">
                {/* Role-specific dashboard jump links */}
                {currentUser?.role === 'librarian' && (
                  <Link to="/librarian" className="btn btn-secondary public-dashboard-link">
                    <LayoutDashboard size={15} />
                    <span>{isAr ? 'لوحة أمين المكتبة' : 'Librarian Dashboard'}</span>
                  </Link>
                )}
                {currentUser?.role === 'admin' && (
                  <Link to="/admin" className="btn btn-secondary public-dashboard-link">
                    <Shield size={15} />
                    <span>{isAr ? 'لوحة الإدارة' : 'Admin Dashboard'}</span>
                  </Link>
                )}

                {/* User avatar & name */}
                <div className="public-user-chip">
                  <div className="public-user-avatar">
                    {currentUser?.avatarLetter || currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="public-user-name">
                    {isAr ? currentUser?.name_ar || currentUser?.name : currentUser?.name}
                  </span>
                  <button
                    type="button"
                    className="public-logout-btn"
                    onClick={handleLogout}
                    title={isAr ? 'تسجيل الخروج' : 'Log out'}
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="public-content">
        <Outlet />
      </main>

      {/* Public Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <BookDetailsModal />
      <AIAssistantDrawer />
      <ToastContainer />
    </div>
  );
}
