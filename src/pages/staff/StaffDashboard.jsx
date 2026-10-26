import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  Barcode,
  PlusCircle,
  FileText,
  CheckCircle2
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
    issueLoan,
    returnLoan,
    setActiveTab
  } = useLibrary();

  // Quick circulation states
  const [quickMode, setQuickMode] = useState('issue'); // 'issue' | 'return'
  const [barcodeInput, setBarcodeInput] = useState('');
  const [memberCodeInput, setMemberCodeInput] = useState('');

  // Stats calculations
  const totalBooks = books.length;
  const totalCopies = bookCopies.length;
  const activeLoans = loans.filter((l) => !l.returned_at);
  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);
  const activeReservations = reservations.filter((r) => r.status === 'active');
  const unpaidFinesTotal = fines.filter((f) => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);

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

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1360px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title & Staff Greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 4px 0' }}>
            لوحة متابعة أمين المكتبة والتداول
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            نظرة عامة فورية على حركة الإعارات، النسخ المتاحة، الحجوزات، والعمليات السريعة.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setActiveTab('circulation')}
          >
            <ArrowRightLeft size={16} />
            <span>مكتب التداول الكامل</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setActiveTab('catalog-mgmt')}
          >
            <PlusCircle size={16} />
            <span>إضافة كتاب جديد</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Total Catalog Titles */}
        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>عناوين الفهرس</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 0 0' }}>{totalBooks}</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{totalCopies} نسخ مادية</span>
          </div>
        </div>

        {/* Active Loans */}
        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--status-borrowed-bg)', color: 'var(--status-borrowed-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>الإعارات الجارية</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--status-borrowed-text)' }}>{activeLoans.length}</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>موزعة على الأعضاء</span>
          </div>
        </div>

        {/* Active Reservations */}
        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--status-reserved-bg)', color: 'var(--status-reserved-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>الحجوزات النشطة</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--status-reserved-text)' }}>{activeReservations.length}</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>في طوابير الانتظار</span>
          </div>
        </div>

        {/* Overdue Loans */}
        <div className="card" style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--status-overdue-bg)', color: 'var(--status-overdue-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>المتأخرات اليوم</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 0 0', color: 'var(--status-overdue-text)' }}>{overdueLoans.length}</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{unpaidFinesTotal} ر.س غرامات</span>
          </div>
        </div>
      </div>

      {/* Quick Circulation Widget + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Quick Circulation Station */}
        <div className="card" style={{ padding: '22px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Barcode size={22} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                محطة التداول السريع (مسح الباركود)
              </h3>
            </div>

            {/* Mode switch */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-muted)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
              <button
                type="button"
                onClick={() => setQuickMode('issue')}
                style={{
                  padding: '4px 10px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: quickMode === 'issue' ? 'var(--color-primary)' : 'transparent',
                  color: quickMode === 'issue' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                تسجيل إعارة
              </button>
              <button
                type="button"
                onClick={() => setQuickMode('return')}
                style={{
                  padding: '4px 10px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: quickMode === 'return' ? 'var(--color-primary)' : 'transparent',
                  color: quickMode === 'return' ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                تسجيل إرجاع
              </button>
            </div>
          </div>

          <form onSubmit={handleQuickSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">
                باركود النسخة المادية (Barcode):
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>مثال: BC-101-01</span>
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
                  كود العضو المستعير (Member Code):
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>مثال: MEM-2026-0042</span>
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

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '6px' }}
            >
              <CheckCircle2 size={16} />
              <span>{quickMode === 'issue' ? 'تأكيد وإتمام الإعارة' : 'تأكيد واستلام الإرجاع'}</span>
            </button>
          </form>

          {/* Quick presets for testing */}
          <div style={{ marginTop: '16px', padding: '10px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.76rem' }}>
            <span style={{ fontWeight: 700, display: 'block', marginBottom: '4px' }}>أكواد تجريبية سريعة:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                onClick={() => {
                  setBarcodeInput('BC-101-01');
                  setMemberCodeInput('MEM-2026-0042');
                  setQuickMode('issue');
                }}
              >
                إعارة: BC-101-01 ➜ MEM-2026-0042
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                onClick={() => {
                  setBarcodeInput('BC-404-02');
                  setQuickMode('return');
                }}
              >
                إرجاع: BC-404-02
              </button>
            </div>
          </div>
        </div>

        {/* Recent Audit & Activity Stream */}
        <div className="card" style={{ padding: '22px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                سجل النشاط والتداول الأخير
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab('audit')}
            >
              عرض السجل كاملاً
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '310px', overflowY: 'auto' }}>
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{log.action}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {new Date(log.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ margin: '0 0 3px 0', color: 'var(--text-secondary)' }}>{log.details}</p>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  بواسطة: {log.actor}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
