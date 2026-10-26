import React, { useState } from 'react';
import { Search, Bell, Filter, X, Calendar } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function TopBar() {
  const { lang, currentRole, activeTab, loans } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const overdueCount = loans.filter((l) => l.status === 'overdue' && !l.returned_at).length;

  const notifications = [
    {
      id: 1,
      title: lang === 'en' ? 'Upcoming Due Date' : 'موعد استحقاق قريب',
      text: lang === 'en' ? 'Book "Clean Code" is due for return within 48 hours.' : 'كتاب "الكود النظيف" مستحق للإرجاع خلال 48 ساعة.',
      time: lang === 'en' ? '2h ago' : 'منذ ساعتين',
      type: 'warning',
      unread: true
    },
    {
      id: 2,
      title: lang === 'en' ? 'Reservation Hold Notice' : 'إشعار قائمة الحجز',
      text: lang === 'en' ? 'You are now #1 in queue for "Granada: A Novel".' : 'أنت الآن في المرتبة #1 لحجز كتاب "ثلاثية غرناطة".',
      time: lang === 'en' ? '1d ago' : 'منذ يوم',
      type: 'info',
      unread: true
    },
    {
      id: 3,
      title: lang === 'en' ? 'Catalog Updated' : 'تحديث الفهرس',
      text: lang === 'en' ? '4 new titles added to the AI & Technology wing.' : 'تمت إضافة 4 مراجع جديدة في جناح الذكاء الاصطناعي.',
      time: lang === 'en' ? '2d ago' : 'منذ يومين',
      type: 'success',
      unread: false
    }
  ];

  const getPageTitle = () => {
    const titles = {
      catalog: { ar: 'فهرس الكتب', en: 'Book Catalog' },
      'my-loans': { ar: 'إعاراتي وحجوزاتي', en: 'My Loans & Reservations' },
      dashboard: { ar: 'لوحة المتابعة', en: 'Dashboard' },
      circulation: { ar: 'مكتب الإعارة والإرجاع', en: 'Circulation Desk' },
      'catalog-mgmt': { ar: 'إدارة الفهرس والنسخ', en: 'Catalog Management' },
      reservations: { ar: 'قائمة الحجوزات', en: 'Reservations' },
      overdues: { ar: 'المتأخرات والغرامات', en: 'Overdues & Fines' },
      'staff-mgmt': { ar: 'إدارة الموظفين والأدوار', en: 'Staff Management' },
      policies: { ar: 'سياسات وقواعد الإعارة', en: 'Lending Policies' },
      audit: { ar: 'سجل التدقيق والإجراءات', en: 'Audit Log' },
    };
    const t = titles[activeTab] || { ar: 'المكتبة', en: 'Library' };
    return lang === 'ar' ? t.ar : t.en;
  };

  const getPageSubtitle = () => {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title-group">
          <h1 className="topbar-title">{getPageTitle()}</h1>
          <span className="topbar-date">
            <Calendar size={13} />
            {getPageSubtitle()}
          </span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Pill Search Bar */}
        <div className="topbar-search">
          <Search size={16} className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder={lang === 'ar' ? 'ابحث عن كتاب، عضو، أو رقم ISBN...' : 'Search books, members, or ISBN...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="topbar-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
          <button className="topbar-search-filter" title={lang === 'ar' ? 'تصفية متقدمة' : 'Advanced Filter'}>
            <Filter size={14} />
          </button>
        </div>

        {/* Notifications */}
        <div className="topbar-notifications-wrapper">
          <button
            className="topbar-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={lang === 'ar' ? 'التنبيهات' : 'Notifications'}
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
                  <span className="topbar-notifications-title">
                    {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
                  </span>
                  <span className="badge badge-ai" style={{ fontSize: '0.7rem' }}>
                    {unreadCount} {lang === 'ar' ? 'جديدة' : 'new'}
                  </span>
                </div>
                <div className="topbar-notifications-list">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`topbar-notification-item ${n.unread ? 'unread' : ''}`}
                    >
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
