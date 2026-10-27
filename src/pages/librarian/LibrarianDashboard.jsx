import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  Barcode,
  PlusCircle,
  FileText,
  CalendarDays,
  ArrowUpRight,
  Users
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export default function StaffDashboard() {
  const {
    books,
    bookCopies,
    loans,
    reservations,
    fines,
    auditLogs,
    members,
    issueLoan,
    returnLoan,
    setActiveTab,
    lang,
    t
  } = useLibrary();

  // Quick circulation states
  const [quickMode, setQuickMode] = useState('issue');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [memberCodeInput, setMemberCodeInput] = useState('');

  // Stats calculations
  const totalBooks = books.length;
  const totalCopies = bookCopies.length;
  const activeLoans = loans.filter((l) => !l.returned_at);
  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);
  const activeReservations = reservations.filter((r) => r.status === 'active');
  const unpaidFinesTotal = fines.filter((f) => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);
  const availableCopies = bookCopies.filter((c) => c.status === 'available').length;

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickMode === 'issue') {
      if (!barcodeInput || !memberCodeInput) return;
      issueLoan(barcodeInput, memberCodeInput);
      setBarcodeInput('');
    } else {
      if (!barcodeInput) return;
      returnLoan(barcodeInput);
      setBarcodeInput('');
    }
  };

  const kpiCards = [
    {
      label: t('staffDashboard.kpiCatalog'),
      value: totalBooks,
      sub: t('staffDashboard.kpiCopies', { n: totalCopies }),
      icon: BookOpen,
      trend: '+2',
      trendUp: true,
      color: 'primary'
    },
    {
      label: t('staffDashboard.kpiLoans'),
      value: activeLoans.length,
      sub: t('staffDashboard.kpiAvailable', { n: availableCopies }),
      icon: ArrowRightLeft,
      trend: null,
      color: 'borrowed'
    },
    {
      label: t('staffDashboard.kpiReservations'),
      value: activeReservations.length,
      sub: t('staffDashboard.kpiWaiting'),
      icon: Clock,
      trend: null,
      color: 'reserved'
    },
    {
      label: t('staffDashboard.kpiOverdues'),
      value: overdueLoans.length,
      sub: t('staffDashboard.kpiFines', { n: unpaidFinesTotal }),
      icon: AlertTriangle,
      trend: overdueLoans.length > 0 ? `${overdueLoans.length}` : '0',
      trendUp: false,
      color: 'overdue'
    }
  ];

  const getKPIStyles = (color) => {
    const styles = {
      primary: {
        iconBg: 'var(--color-primary-subtle)',
        iconColor: 'var(--color-primary)',
        valueColor: 'var(--color-primary)',
      },
      borrowed: {
        iconBg: 'var(--status-borrowed-bg)',
        iconColor: 'var(--status-borrowed-text)',
        valueColor: 'var(--status-borrowed-text)',
      },
      reserved: {
        iconBg: 'var(--status-reserved-bg)',
        iconColor: 'var(--status-reserved-text)',
        valueColor: 'var(--status-reserved-text)',
      },
      overdue: {
        iconBg: 'var(--status-overdue-bg)',
        iconColor: 'var(--status-overdue-text)',
        valueColor: 'var(--status-overdue-text)',
      }
    };
    return styles[color] || styles.primary;
  };

  const weekDays = lang === 'en'
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const weekData = [12, 18, 15, 24, 20, 8, 14];
  const maxWeek = Math.max(...weekData);

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 4 Pastel Modern KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((kpi, idx) => {
          const style = getKPIStyles(kpi.color);
          const Icon = kpi.icon;

          return (
            <div key={idx} className={`kpi-card kpi-${kpi.color}`}>
              <div className="kpi-header">
                <span className="kpi-label">{kpi.label}</span>
                <div className="kpi-icon-badge" style={{ backgroundColor: style.iconBg, color: style.iconColor }}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="kpi-body">
                <span className="kpi-value" style={{ color: style.valueColor }}>{kpi.value}</span>
                {kpi.trend && (
                  <span className={`kpi-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                    {kpi.trend}
                  </span>
                )}
              </div>

              <span className="kpi-sub">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Quick Desk + Activity Queue + Weekly Mini Chart */}
      <div className="dashboard-main-grid">
        {/* Quick Desk Action Panel */}
        <div className="dashboard-card quick-desk-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">
              <Barcode size={18} color="var(--color-primary)" />
              <h3>{t('staffDashboard.quickTitle')}</h3>
            </div>
            <div className="quick-mode-pills">
              <button
                type="button"
                className={`quick-mode-pill ${quickMode === 'issue' ? 'active' : ''}`}
                onClick={() => setQuickMode('issue')}
              >
                {t('staffDashboard.issueMode')}
              </button>
              <button
                type="button"
                className={`quick-mode-pill ${quickMode === 'return' ? 'active' : ''}`}
                onClick={() => setQuickMode('return')}
              >
                {t('staffDashboard.returnMode')}
              </button>
            </div>
          </div>

          <form onSubmit={handleQuickSubmit} className="quick-form">
            <div className="quick-form-fields">
              <div className="quick-input-group">
                <label className="quick-label">
                  {quickMode === 'issue'
                    ? (lang === 'en' ? 'Item Barcode to Issue:' : 'باركود النسخة المراد إعارتها:')
                    : (lang === 'en' ? 'Returned Item Barcode:' : 'باركود النسخة المسترجعة:')}
                </label>
                <div className="quick-input-wrapper">
                  <Barcode size={16} className="quick-input-icon" />
                  <input
                    type="text"
                    className="form-input quick-input"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder={t('staffDashboard.barcodePlaceholder')}
                  />
                </div>
              </div>

              {quickMode === 'issue' && (
                <div className="quick-input-group">
                  <label className="quick-label">
                    {lang === 'en' ? 'Borrower Member Code:' : 'رقم العضوية للمستعير:'}
                  </label>
                  <div className="quick-input-wrapper">
                    <Users size={16} className="quick-input-icon" />
                    <input
                      type="text"
                      className="form-input quick-input"
                      value={memberCodeInput}
                      onChange={(e) => setMemberCodeInput(e.target.value)}
                      placeholder={t('staffDashboard.memberCodePlaceholder')}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="quick-form-actions">
              <button type="submit" className="btn btn-primary" style={{ padding: '9px 20px' }}>
                {quickMode === 'issue' ? (
                  <>
                    <ArrowRightLeft size={16} />
                    <span>{t('staffDashboard.submitIssue')}</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={16} />
                    <span>{t('staffDashboard.submitReturn')}</span>
                  </>
                )}
              </button>

              <div className="quick-presets">
                <span className="quick-presets-label">{lang === 'en' ? 'Quick Presets:' : 'نماذج سريعة:'}</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setBarcodeInput('BC-101-01');
                    setMemberCodeInput('MEM-2026-0042');
                    setQuickMode('issue');
                  }}
                >
                  {lang === 'en' ? 'Issue: BC-101-01' : 'إعارة: BC-101-01'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setBarcodeInput('BC-404-02');
                    setQuickMode('return');
                  }}
                >
                  {lang === 'en' ? 'Return: BC-404-02' : 'إرجاع: BC-404-02'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Recent Activity Queue */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">
              <FileText size={18} color="var(--color-primary)" />
              <h3>{t('staffDashboard.recentActivity')}</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('audit')}
            >
              {lang === 'en' ? 'View All' : 'عرض الكل'}
              <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="activity-queue">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-action">
                      {lang === 'en' ? (log.action_en || log.action) : log.action}
                    </span>
                    <span className="activity-time">
                      {new Date(log.created_at).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="activity-details">
                    {lang === 'en' ? (log.details_en || log.details) : log.details}
                  </p>
                  <span className="activity-actor">
                    {lang === 'en' ? 'By: ' : 'بواسطة: '}
                    {lang === 'en' ? (log.actor_en || log.actor) : log.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Mini Chart + Quick Stats */}
        <div className="dashboard-sidebar-stack">
          {/* Weekly Chart */}
          <div className="dashboard-card compact">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">
                <CalendarDays size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '0.92rem' }}>{t('staffDashboard.weeklyTraffic')}</h3>
              </div>
            </div>
            <div className="mini-chart">
              {weekData.map((val, i) => (
                <div key={i} className="mini-chart-col">
                  <div className="mini-chart-bar-wrapper">
                    <div
                      className="mini-chart-bar"
                      style={{
                        height: `${(val / maxWeek) * 100}%`,
                        backgroundColor: i === weekData.length - 1 ? 'var(--color-ai-accent)' : 'var(--color-primary)'
                      }}
                    />
                  </div>
                  <span className="mini-chart-label">{weekDays[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card compact">
            <div className="dashboard-card-header">
              <div className="dashboard-card-title">
                <Users size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '0.92rem' }}>{t('staffDashboard.inventorySnapshot')}</h3>
              </div>
            </div>
            <div className="quick-stats-list">
              <div className="quick-stat-row">
                <span className="quick-stat-label">{t('staffDashboard.registeredMembers')}</span>
                <span className="quick-stat-value">{members.length}</span>
              </div>
              <div className="quick-stat-row">
                <span className="quick-stat-label">{t('staffDashboard.utilizationRate')}</span>
                <span className="quick-stat-value" style={{ color: 'var(--status-borrowed-text)' }}>
                  {totalCopies > 0 ? Math.round((activeLoans.length / totalCopies) * 100) : 0}%
                </span>
              </div>
              <div className="quick-stat-row">
                <span className="quick-stat-label">{lang === 'en' ? 'Avg Loans/Member' : 'متوسط الإعارات/عضو'}</span>
                <span className="quick-stat-value">
                  {members.length > 0 ? (activeLoans.length / members.length).toFixed(1) : 0}
                </span>
              </div>
              <div className="quick-stat-row">
                <span className="quick-stat-label">{lang === 'en' ? 'Unpaid Fines Total' : 'إجمالي الغرامات'}</span>
                <span className="quick-stat-value" style={{ color: 'var(--status-overdue-text)' }}>
                  {unpaidFinesTotal} {lang === 'en' ? 'SAR' : 'ر.س'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card compact">
            <div className="quick-action-btns">
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setActiveTab('circulation')}
              >
                <ArrowRightLeft size={15} />
                <span>{lang === 'en' ? 'Circulation Desk' : 'مكتب التداول'}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setActiveTab('catalog-mgmt')}
              >
                <PlusCircle size={15} />
                <span>{lang === 'en' ? 'Add Book' : 'إضافة كتاب'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
