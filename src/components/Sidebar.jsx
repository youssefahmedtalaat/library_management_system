import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Globe,
  User,
  Shield,
  Layers,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  Settings,
  Users,
  FileText,
  CheckCircle2,
  Search,
  Home,
  BookMarked,
  LogOut,
  ChevronDown,
  BarChart3,
  Bell,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

const memberNavItems = [
  { id: 'catalog', icon: Search, label: 'فهرس الكتب', labelEn: 'Book Catalog' },
  { id: 'my-loans', icon: BookMarked, label: 'إعاراتي وحجوزاتي', labelEn: 'My Loans & Reservations' },
];

const staffNavItems = [
  { id: 'dashboard', icon: BarChart3, label: 'لوحة المتابعة', labelEn: 'Dashboard' },
  { id: 'circulation', icon: ArrowRightLeft, label: 'مكتب الإعارة', labelEn: 'Circulation Desk' },
  { id: 'catalog-mgmt', icon: BookOpen, label: 'إدارة الفهرس', labelEn: 'Catalog Management' },
  { id: 'reservations', icon: Clock, label: 'الحجوزات', labelEn: 'Reservations' },
  { id: 'overdues', icon: AlertTriangle, label: 'المتأخرات', labelEn: 'Overdues & Fines' },
];

const adminNavItems = [
  { id: 'staff-mgmt', icon: Users, label: 'إدارة الموظفين', labelEn: 'Staff Management' },
  { id: 'policies', icon: Settings, label: 'السياسات', labelEn: 'Policies' },
  { id: 'audit', icon: FileText, label: 'سجل التدقيق', labelEn: 'Audit Log' },
];

const roles = [
  { id: 'member', icon: User, label: 'بوابة العضو', labelEn: 'Member', defaultTab: 'catalog' },
  { id: 'staff', icon: Layers, label: 'أمين المكتبة', labelEn: 'Librarian', defaultTab: 'dashboard' },
  { id: 'admin', icon: Shield, label: 'مدير النظام', labelEn: 'Admin', defaultTab: 'staff-mgmt' },
];

export default function Sidebar() {
  const {
    theme,
    toggleTheme,
    lang,
    toggleLang,
    currentRole,
    setCurrentRole,
    activeTab,
    setActiveTab,
    openAIDrawer,
    loans,
    reservations,
    currentMemberId,
    members
  } = useLibrary();

  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentMember = members.find((m) => m.id === currentMemberId) || members[0];
  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);
  const activeReservations = reservations.filter((r) => r.status === 'active');

  const currentRoleConfig = roles.find((r) => r.id === currentRole);
  const navItems = currentRole === 'member' ? memberNavItems : currentRole === 'staff' ? staffNavItems : adminNavItems;

  const getUserName = () => {
    if (currentRole === 'member') return currentMember.full_name.split(' ').slice(0, 2).join(' ');
    if (currentRole === 'staff') return 'سليمان المنصور';
    return 'د. هشام الراشد';
  };

  const getUserSubtitle = () => {
    if (currentRole === 'member') return currentMember.member_code;
    if (currentRole === 'staff') return 'أمين إعارة';
    return 'مدير النظام';
  };

  return (
    <aside className="sidebar">
      {/* Logo Area */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BookOpen size={20} />
          </div>
          {!isCollapsed && (
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">المكتبة الذكية</span>
              <span className="sidebar-logo-version">LMS 2026</span>
            </div>
          )}
        </div>
      </div>

      {/* Role Switcher */}
      <div className="sidebar-role-switcher">
        <button
          className="sidebar-role-btn"
          onClick={() => setIsRoleSelectorOpen(!isRoleSelectorOpen)}
        >
          <div className="sidebar-role-icon">
            {currentRoleConfig && <currentRoleConfig.icon size={16} />}
          </div>
          {!isCollapsed && (
            <>
              <span className="sidebar-role-label">
                {lang === 'ar' ? currentRoleConfig?.label : currentRoleConfig?.labelEn}
              </span>
              <ChevronDown
                size={14}
                className={`sidebar-role-chevron ${isRoleSelectorOpen ? 'rotated' : ''}`}
              />
            </>
          )}
        </button>

        {isRoleSelectorOpen && (
          <div className="sidebar-role-dropdown">
            {roles.map((role) => (
              <button
                key={role.id}
                className={`sidebar-role-option ${currentRole === role.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentRole(role.id);
                  setActiveTab(role.defaultTab);
                  setIsRoleSelectorOpen(false);
                }}
              >
                <role.icon size={15} />
                <span>{lang === 'ar' ? role.label : role.labelEn}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">
          {lang === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          let badge = null;
          if (item.id === 'overdues' && overdueLoans.length > 0) {
            badge = <span className="sidebar-nav-badge danger">{overdueLoans.length}</span>;
          }
          if (item.id === 'reservations' && activeReservations.length > 0) {
            badge = <span className="sidebar-nav-badge info">{activeReservations.length}</span>;
          }

          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              {!isCollapsed && (
                <>
                  <span className="sidebar-nav-text">
                    {lang === 'ar' ? item.label : item.labelEn}
                  </span>
                  {badge}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Assistant */}
      <div className="sidebar-section">
        <div className="sidebar-nav-label">
          {lang === 'ar' ? 'الأدوات' : 'Tools'}
        </div>
        <button className="sidebar-nav-item sidebar-ai-btn" onClick={openAIDrawer}>
          <Sparkles size={18} />
          {!isCollapsed && (
            <span className="sidebar-nav-text">
              {lang === 'ar' ? 'المساعد الذكي' : 'AI Assistant'}
            </span>
          )}
        </button>
      </div>

      {/* Spacer */}
      <div className="sidebar-spacer" />

      {/* Bottom Actions */}
      <div className="sidebar-bottom">
        <div className="sidebar-bottom-actions">
          <button
            className="sidebar-action-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            className="sidebar-action-btn"
            onClick={toggleLang}
            title="تبديل اللغة"
          >
            <Globe size={17} />
          </button>
          <button
            className="sidebar-action-btn"
            title="المساعدة"
          >
            <HelpCircle size={17} />
          </button>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            {currentRole === 'member' ? 'أ' : currentRole === 'staff' ? 'س' : 'هـ'}
          </div>
          {!isCollapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{getUserName()}</span>
              <span className="sidebar-user-role">{getUserSubtitle()}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
