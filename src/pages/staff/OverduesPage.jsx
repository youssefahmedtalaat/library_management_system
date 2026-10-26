import React, { useState } from 'react';
import { AlertTriangle, RotateCcw, User, CheckCircle2 } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';

export default function OverduesPage() {
  const { loans, fines, settleFine, returnLoan, policies } = useLibrary();

  const [activeTab, setActiveTab] = useState('overdues'); // 'overdues' | 'fines'

  const overdueLoans = loans.filter((l) => l.status === 'overdue' && !l.returned_at);
  const unpaidFines = fines.filter((f) => f.status === 'unpaid');

  const totalUnpaidAmount = unpaidFines.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
            المتأخرات وحساب الغرامات
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            متابعة الإعارات المتجاوزة لتواريخ الاستحقاق، واحتساب الغرامات اليومية وتسويتها.
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
            الإعارات المتأخرة ({overdueLoans.length})
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
            سجل الغرامات ({fines.length})
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
              إجمالي الغرامات المستحقة غير المحصلة: {totalUnpaidAmount.toFixed(2)} ر.س
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              معدل الغرامة المعتمد: {policies.fine_per_day} ر.س عن كل يوم تأخير بعد انتهاء مدة الإعارة ({policies.default_loan_days} يوماً).
            </p>
          </div>
        </div>

        <span className="badge badge-overdue" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
          {unpaidFines.length} مطالبات معلقة
        </span>
      </div>

      {/* Overdue Loans Table */}
      {activeTab === 'overdues' ? (
        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
            قائمة النسخ المتأخرة حالياً عن موعد الإرجاع
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>الباركود</th>
                  <th>الكتاب المتأخر</th>
                  <th>المستعير</th>
                  <th>تاريخ الاستحقاق</th>
                  <th>أيام التأخير</th>
                  <th>الغرامة التقديرية</th>
                  <th>إجراء الاستلام السريع</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map((l) => {
                  const daysLate = Math.max(1, Math.ceil((new Date('2026-10-26T13:50:00Z').getTime() - new Date(l.due_at).getTime()) / 86400000));
                  const estFine = daysLate * policies.fine_per_day;

                  return (
                    <tr key={l.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{l.copy_barcode}</td>
                      <td><strong>{l.book_title}</strong></td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={13} color="var(--color-primary)" />
                          {l.member_name} ({l.member_code})
                        </span>
                      </td>
                      <td style={{ color: 'var(--status-overdue-text)', fontWeight: 600 }}>
                        {new Date(l.due_at).toLocaleDateString('ar-EG')}
                      </td>
                      <td>
                        <span className="badge badge-overdue">
                          {daysLate} أيام تأخير
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--status-overdue-text)' }}>
                        {estFine.toFixed(2)} ر.س
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => returnLoan(l.copy_barcode)}
                        >
                          <RotateCcw size={13} />
                          <span>استلام واحتساب الغرامة</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {overdueLoans.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--status-available-text)' }}>
                      🎉 لا توجد أي إعارات متأخرة حالياً! جميع النسخ يتم إرجاعها في المواعيد المحددة.
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
            سجل الغرامات المالية
          </h3>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>العضو</th>
                  <th>كود العضو</th>
                  <th>الكتاب المرتبط</th>
                  <th>مبلغ الغرامة</th>
                  <th>سبب الاحتساب</th>
                  <th>تاريخ القيد</th>
                  <th>الحالة</th>
                  <th>إجراء التسوية</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={13} color="var(--color-primary)" />
                        {f.member_name}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{f.member_code}</td>
                    <td>{f.book_title}</td>
                    <td style={{ fontWeight: 800, color: f.status === 'unpaid' ? 'var(--status-overdue-text)' : 'inherit' }}>
                      {f.amount.toFixed(2)} ر.س
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.reason}</td>
                    <td>{new Date(f.assessed_at).toLocaleDateString('ar-EG')}</td>
                    <td><StatusBadge status={f.status} size="sm" /></td>
                    <td>
                      {f.status === 'unpaid' ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => settleFine(f.id)}
                        >
                          <CheckCircle2 size={13} />
                          <span>تسوية وتحصيل</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          تم التحصيل بنجاح
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
