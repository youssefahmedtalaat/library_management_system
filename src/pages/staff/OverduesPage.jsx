import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, User, CheckCircle2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';
import { getBookTitle, getMemberName } from '../../data/mockData';

export default function OverduesPage() {
  const { loans, fines, settleFine, returnLoan, policies, books, members, lang } = useLibrary();

  const [activeTab, setActiveTab] = useState('overdues'); // 'overdues' | 'fines'

  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);
  const unpaidFines = fines.filter((f) => f.status === 'unpaid');

  const totalUnpaidAmount = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
            {lang === 'en' ? 'Overdues & Fine Ledger' : 'المتأخرات وحساب الغرامات'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {lang === 'en'
              ? 'Track loans exceeding their due date, calculate daily late return fines, and collect dues.'
              : 'متابعة الإعارات المتجاوزة لتواريخ الاستحقاق، واحتساب الغرامات اليومية وتسويتها.'}
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'overdues' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'overdues' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('overdues')}
          >
            {lang === 'en' ? 'Overdue Loans' : 'الإعارات المتأخرة'} ({overdueLoans.length})
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'fines' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'fines' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
            onClick={() => setActiveTab('fines')}
          >
            {lang === 'en' ? 'Fines Ledger' : 'سجل الغرامات'} ({fines.length})
          </button>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, var(--status-overdue-bg) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--status-overdue-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--status-overdue-text)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 3px 0', color: 'var(--status-overdue-text)' }}>
              {lang === 'en'
                ? `Total Outstanding Unpaid Fines: ${totalUnpaidAmount.toFixed(2)} SAR`
                : `إجمالي الغرامات المستحقة غير المحصلة: ${totalUnpaidAmount.toFixed(2)} ر.س`}
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              {lang === 'en'
                ? `Official fine rate: ${policies.fine_per_day} SAR per day overdue after loan expiration (${policies.default_loan_days} days).`
                : `معدل الغرامة المعتمد: ${policies.fine_per_day} ر.س عن كل يوم تأخير بعد انتهاء مدة الإعارة (${policies.default_loan_days} يوماً).`}
            </p>
          </div>
        </div>

        <span className="badge badge-overdue" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
          {lang === 'en' ? `${unpaidFines.length} pending claims` : `${unpaidFines.length} مطالبات معلقة`}
        </span>
      </div>

      {/* Overdue Loans Table */}
      {activeTab === 'overdues' ? (
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
            {lang === 'en' ? 'Currently Overdue Circulating Copies' : 'قائمة النسخ المتأخرة حالياً عن موعد الإرجاع'}
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{lang === 'en' ? 'Barcode' : 'الباركود'}</th>
                  <th>{lang === 'en' ? 'Overdue Book' : 'الكتاب المتأخر'}</th>
                  <th>{lang === 'en' ? 'Borrower' : 'المستعير'}</th>
                  <th>{lang === 'en' ? 'Due Date' : 'تاريخ الاستحقاق'}</th>
                  <th>{lang === 'en' ? 'Days Late' : 'أيام التأخير'}</th>
                  <th>{lang === 'en' ? 'Estimated Fine' : 'الغرامة التقديرية'}</th>
                  <th>{lang === 'en' ? 'Quick Return' : 'إجراء الاستلام السريع'}</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map((l) => {
                  const daysLate = Math.max(1, Math.ceil((new Date('2026-10-26T13:50:00Z').getTime() - new Date(l.due_at).getTime()) / 86400000));
                  const estFine = daysLate * policies.fine_per_day;

                  const bookObj = books.find((b) => b.id === l.book_id);
                  const title = bookObj ? getBookTitle(bookObj, lang) : (lang === 'en' ? (l.book_title_en || l.book_title) : l.book_title);
                  const memberObj = members.find((m) => m.id === l.member_id);
                  const memberName = memberObj ? getMemberName(memberObj, lang) : (lang === 'en' ? (l.member_name_en || l.member_name) : l.member_name);

                  return (
                    <tr key={l.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{l.copy_barcode}</td>
                      <td><strong>{title}</strong></td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={13} color="var(--color-primary)" />
                          {memberName} ({l.member_code})
                        </span>
                      </td>
                      <td style={{ color: 'var(--status-overdue-text)', fontWeight: 600 }}>
                        {formatDate(l.due_at)}
                      </td>
                      <td>
                        <span className="badge badge-overdue">
                          {daysLate} {lang === 'en' ? 'days late' : 'أيام تأخير'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--status-overdue-text)' }}>
                        {estFine.toFixed(2)} {lang === 'en' ? 'SAR' : 'ر.س'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => returnLoan(l.copy_barcode)}
                        >
                          <RotateCcw size={13} />
                          <span>{lang === 'en' ? 'Check-in & Assess' : 'استلام واحتساب الغرامة'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {overdueLoans.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--status-available-text)' }}>
                      🎉 {lang === 'en' ? 'No overdue loans at this moment! All items returned on schedule.' : 'لا توجد أي إعارات متأخرة حالياً! جميع النسخ يتم إرجاعها في المواعيد المحددة.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Fines Ledger Table */
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
            {lang === 'en' ? 'Financial Fines Ledger' : 'سجل الغرامات المالية'}
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>{lang === 'en' ? 'Member' : 'العضو'}</th>
                  <th>{lang === 'en' ? 'Member Code' : 'كود العضو'}</th>
                  <th>{lang === 'en' ? 'Related Book' : 'الكتاب المرتبط'}</th>
                  <th>{lang === 'en' ? 'Fine Amount' : 'مبلغ الغرامة'}</th>
                  <th>{lang === 'en' ? 'Reason' : 'سبب الاحتساب'}</th>
                  <th>{lang === 'en' ? 'Date' : 'تاريخ القيد'}</th>
                  <th>{lang === 'en' ? 'Status' : 'الحالة'}</th>
                  <th>{lang === 'en' ? 'Settlement Action' : 'إجراء التسوية'}</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f) => {
                  const memberObj = members.find((m) => m.id === f.member_id);
                  const memberName = memberObj ? getMemberName(memberObj, lang) : (lang === 'en' ? (f.member_name_en || f.member_name) : f.member_name);
                  const bookTitle = lang === 'en' ? (f.book_title_en || f.book_title) : f.book_title;
                  const reason = lang === 'en' ? (f.reason_en || f.reason) : f.reason;

                  return (
                    <tr key={f.id}>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={13} color="var(--color-primary)" />
                          {memberName}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace' }}>{f.member_code}</td>
                      <td>{bookTitle}</td>
                      <td style={{ fontWeight: 800, color: f.status === 'unpaid' ? 'var(--status-overdue-text)' : 'inherit' }}>
                        {f.amount.toFixed(2)} {lang === 'en' ? 'SAR' : 'ر.س'}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{reason}</td>
                      <td>{formatDate(f.assessed_at)}</td>
                      <td><StatusBadge status={f.status} size="sm" /></td>
                      <td>
                        {f.status === 'unpaid' ? (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => settleFine(f.id)}
                          >
                            <CheckCircle2 size={13} />
                            <span>{lang === 'en' ? 'Settle & Collect' : 'تسوية وتحصيل'}</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {lang === 'en' ? 'Settled Successfully' : 'تم التحصيل بنجاح'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
