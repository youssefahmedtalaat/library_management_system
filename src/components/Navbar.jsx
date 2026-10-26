import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Globe,
  Bell,
  User,
  Shield,
  Layers,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  Settings,
  Users,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function Navbar() {
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

  const [showNotifications, setShowNotifications] = useState(false);

  const currentMember = members.find((m) => m.id === currentMemberId) || members[0];
  const memberActiveLoans = loans.filter((l) => l.member_id === currentMemberId && !l.returned_at);
  const memberActiveRes = reservations.filter((r) => r.member_id === currentMemberId && r.status === 'active');
  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);

  const notifications = [
    {
      id: 1,
      title: 'موعد استحقاق قريب',
      text: 'كتاب "الكود النظيف" مستحق للإرجاع خلال 48 ساعة.',
      time: 'منذ ساعتين',
      type: 'warning'
    },
    {
      id: 2,
      title: 'إشعار قائمة الحجز',
      text: 'أنت الآن في المرتبة #1 لحجز كتاب "ثلاثية غرناطة".',
      time: 'منذ يوم',
      type: 'info'
    },
    {
      id: 3,
      title: 'تحديث الفهرس',
      text: 'تمت إضافة 4 مراجع جديدة في جناح الذكاء الاصطناعي.',
      time: 'منذ يومين',
      type: 'success'
    }
  ];

  return (
    <header
      style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-md)',
        transition: 'background-color var(--transition-normal)'
      }}
    >
      {/* Top Bar: Brand, Role Switcher, Quick Actions */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <BookOpen size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.3px' }}>
                نظام إدارة المكتبة الذكي
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600
                }}
              >
                LMS 2026
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.75)', margin: 0 }}>
              منصة الفهرسة الموحدة وإدارة الإعارات والاستكشاف
            </p>
          </div>
        </div>

        {/* Role Selector Tabs (Member, Staff, Admin) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.22)',
            padding: '3px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setCurrentRole('member');
              setActiveTab('catalog');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 700,
              backgroundColor: currentRole === 'member' ? '#FFFFFF' : 'transparent',
              color: currentRole === 'member' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.85)',
              boxShadow: currentRole === 'member' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <User size={15} />
            <span>بوابة العضو</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentRole('staff');
              setActiveTab('dashboard');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 700,
              backgroundColor: currentRole === 'staff' ? '#FFFFFF' : 'transparent',
              color: currentRole === 'staff' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.85)',
              boxShadow: currentRole === 'staff' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Layers size={15} />
            <span>أمين المكتبة</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentRole('admin');
              setActiveTab('staff-mgmt');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: 700,
              backgroundColor: currentRole === 'admin' ? '#FFFFFF' : 'transparent',
              color: currentRole === 'admin' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.85)',
              boxShadow: currentRole === 'admin' ? 'var(--shadow-sm)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Shield size={15} />
            <span>مدير النظام</span>
          </button>
        </div>

        {/* Right Tools: AI Assistant Button, Notifications, Theme, Lang, User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* AI Librarian trigger button */}
          <button
            type="button"
            className="btn btn-ai"
            style={{
              padding: '6px 13px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onClick={() => openAIDrawer()}
          >
            <Sparkles size={16} />
            <span>المساعد الذكي</span>
          </button>

          {/* Notifications button */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-icon"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
              onClick={() => setShowNotifications((prev) => !prev)}
              aria-label="التنبيهات"
            >
              <Bell size={17} />
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--color-ai-accent)',
                  borderRadius: '50%',
                  border: '2px solid var(--color-primary)'
                }}
              />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: lang === 'ar' ? 0 : 'auto',
                  left: lang === 'ar' ? 'auto' : 0,
                  width: '320px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 110,
                  overflow: 'hidden',
                  animation: 'slideUp 0.2s ease-out'
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-muted)'
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>التنبيهات والإشعارات</span>
                  <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}>
                    3 جديدة
                  </span>
                </div>

                <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem',
                        transition: 'background-color var(--transition-fast)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{n.title}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="btn btn-icon"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}
            onClick={toggleTheme}
            aria-label="تبديل المظهر"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            className="btn btn-icon"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              fontWeight: 700,
              fontSize: '0.78rem'
            }}
            onClick={toggleLang}
            aria-label="تبديل اللغة"
          >
            <Globe size={16} />
          </button>

          {/* Current User Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.75rem'
              }}
            >
              {currentRole === 'member' ? 'أ' : currentRole === 'staff' ? 'س' : 'هـ'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                {currentRole === 'member'
                  ? currentMember.full_name.split(' ')[0]
                  : currentRole === 'staff'
                  ? 'سليمان (أمين إعارة)'
                  : 'د. هشام (مدير)'}
              </span>
              <span style={{ fontSize: '0.66rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                {currentRole === 'member' ? currentMember.member_code : 'مكتب الإدارة'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar for the Current Active Role */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto'
          }}
        >
          {/* Member Subnav */}
          {currentRole === 'member' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'catalog' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'catalog' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'catalog' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <BookOpen size={16} />
                <span>فهرس الكتب والبحث المتقدم</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my-loans')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'my-loans' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'my-loans' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'my-loans' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Clock size={16} />
                <span>إعاراتي وحجوزاتي</span>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {memberActiveLoans.length + memberActiveRes.length}
                </span>
              </button>
            </>
          )}

          {/* Staff Subnav */}
          {currentRole === 'staff' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'dashboard' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'dashboard' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'dashboard' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <CheckCircle2 size={16} />
                <span>لوحة المتابعة</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('circulation')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'circulation' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'circulation' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'circulation' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <ArrowRightLeft size={16} />
                <span>مكتب الإعارة والإرجاع</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('catalog-mgmt')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'catalog-mgmt' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'catalog-mgmt' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'catalog-mgmt' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <BookOpen size={16} />
                <span>إدارة الفهرس والنسخ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reservations')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'reservations' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'reservations' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'reservations' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Clock size={16} />
                <span>قائمة الحجوزات ({reservations.filter((r) => r.status === 'active').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overdues')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'overdues' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'overdues' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'overdues' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <AlertTriangle size={16} />
                <span>المتأخرات والغرامات</span>
                {overdueLoans.length > 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--status-overdue-bg)',
                      color: 'var(--status-overdue-text)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    {overdueLoans.length}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Admin Subnav */}
          {currentRole === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('staff-mgmt')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'staff-mgmt' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'staff-mgmt' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'staff-mgmt' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users size={16} />
                <span>إدارة الموظفين والأدوار</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('policies')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'policies' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'policies' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'policies' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <Settings size={16} />
                <span>سياسات وقواعد الإعارة</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('audit')}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === 'audit' ? '3px solid #FCD34D' : '3px solid transparent',
                  color: activeTab === 'audit' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)',
                  fontWeight: activeTab === 'audit' ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileText size={16} />
                <span>سجل التدقيق والإجراءات</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
