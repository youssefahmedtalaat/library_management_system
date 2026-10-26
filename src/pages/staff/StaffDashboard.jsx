import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  Barcode,
  PlusCircle,
  FileText,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarDays,
  ArrowUpRight,
  MoreHorizontal,
  BookMarked
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
    setActiveTab
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
      label: 'عناوين الفهرس',
      value: totalBooks,
      sub: `${totalCopies} نسخ مادية`,
      icon: BookOpen,
      trend: '+2',
      trendUp: true,
      color: 'primary'
    },
    {
      label: 'الإعارات الجارية',
      value: activeLoans.length,
      sub: `${availableCopies} نسخ متاحة`,
      icon: ArrowRightLeft,
      trend: null,
      color: 'borrowed'
    },
    {
      label: 'الحجوزات النشطة',
      value: activeReservations.length,
      sub: 'في طوابير الانتظار',
      icon: Clock,
      trend: null,
      color: 'reserved'
    },
    {
      label: 'المتأخرات',
      value: overdueLoans.length,
      sub: `${unpaidFinesTotal} ر.س غرامات`,
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

  // Weekly mini chart data (simulated)
  const weekDays = ['سب', 'أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع'];
  const weekData = [3, 7, 5, 8, 4, 6, 2];
  const maxWeek = Math.max(...weekData);

  return (
    <div className="dashboard-layout">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpiCards.map((kpi, i) => {
          const s = getKPIStyles(kpi.color);
          const Icon = kpi.icon;
          return (
            <div className="kpi-card" key={i}>
              <div className="kpi-card-header">
                <div className="kpi-icon" style={{ backgroundColor: s.iconBg, color: s.iconColor }}>
                  <Icon size={20} />
                </div>
                {kpi.trend && (
                  <span className={`kpi-trend ${kpi.trendUp ? 'up' : 'down'}`}>
                    {kpi.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {kpi.trend}
                  </span>
                )}
              </div>
              <div className="kpi-card-body">
                <span className="kpi-label">{kpi.label}</span>
                <h2 className="kpi-value" style={{ color: s.valueColor }}>{kpi.value}</h2>
                <span className="kpi-sub">{kpi.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Quick Circulation + Activity Queue + Mini Stats */}
      <div className="dashboard-grid">
        {/* Quick Circulation Station */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">
              <Barcode size={18} color="var(--color-primary)" />
              <h3>محطة التداول السريع</h3>
            </div>
            <div className="mode-switcher">
              <button
                type="button"
                className={`mode-btn ${quickMode === 'issue' ? 'active' : ''}`}
                onClick={() => setQuickMode('issue')}
              >
                تسجيل إعارة
              </button>
              <button
                type="button"
                className={`mode-btn ${quickMode === 'return' ? 'active' : ''}`}
                onClick={() => setQuickMode('return')}
              >
                تسجيل إرجاع
              </button>
            </div>
          </div>

          <form onSubmit={handleQuickSubmit} className="quick-form">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                باركود النسخة المادية
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>مثال: BC-101-01</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="أدخل أو امسح الباركود (BC-xxx-xx)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                required
              />
            </div>

            {quickMode === 'issue' && (
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  كود العضو المستعير
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>مثال: MEM-2026-0042</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="أدخل كود العضو (MEM-xxxx-xxxx)..."
                  value={memberCodeInput}
                  onChange={(e) => setMemberCodeInput(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              <CheckCircle2 size={16} />
              <span>{quickMode === 'issue' ? 'تأكيد الإعارة' : 'تأكيد الإرجاع'}</span>
            </button>

            {/* Quick presets */}
            <div className="quick-presets">
              <span className="quick-presets-label">أكواد تجريبية:</span>
              <div className="quick-presets-btns">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setBarcodeInput('BC-101-01');
                    setMemberCodeInput('MEM-2026-0042');
                    setQuickMode('issue');
                  }}
                >
                  إعارة: BC-101-01
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setBarcodeInput('BC-404-02');
                    setQuickMode('return');
                  }}
                >
                  إرجاع: BC-404-02
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
              <h3>سجل النشاط الأخير</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('audit')}
            >
              عرض الكل
              <ArrowUpRight size={12} />
            </button>
          </div>

          <div className="activity-queue">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-action">{log.action}</span>
                    <span className="activity-time">
                      {new Date(log.created_at).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="activity-details">{log.details}</p>
                  <span className="activity-actor">بواسطة: {log.actor}</span>
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
                <h3 style={{ fontSize: '0.92rem' }}>حركة الأسبوع</h3>
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
                <h3 style={{ fontSize: '0.92rem' }}>إحصائيات سريعة</h3>
              </div>
            </div>
            <div className="quick-stats-list">
              <div className="quick-stat-row">
                <span className="quick-stat-label">إجمالي الأعضاء</span>
                <span className="quick-stat-value">{members.length}</span>
              </div>
              <div className="quick-stat-row">
                <span className="quick-stat-label">نسبة الإشغال</span>
                <span className="quick-stat-value" style={{ color: 'var(--status-borrowed-text)' }}>
                  {totalCopies > 0 ? Math.round((activeLoans.length / totalCopies) * 100) : 0}%
                </span>
              </div>
              <div className="quick-stat-row">
                <span className="quick-stat-label">متوسط الإعارات/عضو</span>
                <span className="quick-stat-value">
                  {members.length > 0 ? (activeLoans.length / members.length).toFixed(1) : 0}
                </span>
              </div>
              <div className="quick-stat-row">
                <span className="quick-stat-label">إجمالي الغرامات</span>
                <span className="quick-stat-value" style={{ color: 'var(--status-overdue-text)' }}>
                  {unpaidFinesTotal} ر.س
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
                <span>مكتب التداول</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setActiveTab('catalog-mgmt')}
              >
                <PlusCircle size={15} />
                <span>إضافة كتاب</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
