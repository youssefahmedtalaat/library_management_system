import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  RotateCcw,
  User,
  AlertTriangle
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';

export default function CirculationDeskPage() {
  const {
    bookCopies,
    books,
    members,
    loans,
    policies,
    issueLoan,
    returnLoan
  } = useLibrary();

  const [activeSubTab, setActiveSubTab] = useState('issue'); // 'issue' | 'return'

  // Issue Form States
  const [selectedMemberCode, setSelectedMemberCode] = useState('MEM-2026-0042');
  const [selectedBarcode, setSelectedBarcode] = useState('');

  // Return Form States
  const [returnBarcode, setReturnBarcode] = useState('');

  // Available copies for borrowing
  const availableCopies = bookCopies.filter((c) => c.status === 'available');

  // Currently borrowed copies for quick return
  const borrowedLoans = loans.filter((l) => !l.returned_at);

  // Selected member details
  const selectedMember = members.find(
    (m) => m.member_code.toUpperCase() === selectedMemberCode.toUpperCase()
  );

  // Selected copy details
  const selectedCopy = bookCopies.find(
    (c) => c.barcode.toUpperCase() === selectedBarcode.toUpperCase()
  );
  const selectedBook = selectedCopy ? books.find((b) => b.id === selectedCopy.book_id) : null;

  // Selected return loan details
  const selectedReturnLoan = loans.find(
    (l) => l.copy_barcode.toUpperCase() === returnBarcode.toUpperCase() && !l.returned_at
  );

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedBarcode || !selectedMemberCode) return;
    const res = issueLoan(selectedBarcode, selectedMemberCode);
    if (res.success) {
      setSelectedBarcode('');
    }
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnBarcode) return;
    const res = returnLoan(returnBarcode);
    if (res.success) {
      setReturnBarcode('');
    }
  };

  // Calculate simulated due date (Today + policy default loan days)
  const previewDueDate = useMemo(() => {
    return new Date(Date.now() + policies.default_loan_days * 86400000);
  }, [policies.default_loan_days]);

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
            مكتب الإعارة والتداول المركزي
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            صرف النسخ المادية للأعضاء واستلام المرتجعات مع التحقق الفوري من قيود السياسات والغرامات.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('issue')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeSubTab === 'issue' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'issue' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <BookOpen size={16} />
            <span>تسجيل إعارة جديدة (Checkout)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('return')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: activeSubTab === 'return' ? 'var(--color-primary)' : 'transparent',
              color: activeSubTab === 'return' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <RotateCcw size={16} />
            <span>تسجيل إرجاع نسخة (Checkin)</span>
          </button>
        </div>
      </div>

      {/* Main Form Area */}
      {activeSubTab === 'issue' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Issue Form */}
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} color="var(--color-primary)" />
              بيانات صرف الإعارة
            </h3>

            <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Member Selection */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  اختر العضو المستعير:
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>أو أدخل الكود مباشرة</span>
                </label>
                <select
                  className="form-select"
                  value={selectedMemberCode}
                  onChange={(e) => setSelectedMemberCode(e.target.value)}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.member_code}>
                      {m.full_name} ({m.member_code}) — {m.membership_status === 'active' ? 'نشط' : 'موقوف'} [إعاراته: {m.active_loans_count}/{policies.max_borrow_limit}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Barcode Selection / Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  باركود النسخة المادية:
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>امسح الباركود أو اختر من المتاح</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="BC-xxx-xx"
                  value={selectedBarcode}
                  onChange={(e) => setSelectedBarcode(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '100%' }}>نسخ متاحة حالياً للتجربة السريعة:</span>
                  {availableCopies.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                      onClick={() => setSelectedBarcode(c.barcode)}
                    >
                      {c.barcode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Terms preview */}
              <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>مدة الإعارة المطبقة:</span>
                  <strong>{policies.default_loan_days} يوماً</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>تاريخ الاستحقاق المحسوب:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{previewDueDate.toLocaleDateString('ar-EG')}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px' }}
                disabled={!selectedBarcode || (selectedMember && selectedMember.membership_status !== 'active')}
              >
                <CheckCircle2 size={18} />
                <span>إتمام تسجيل الإعارة وصرف النسخة</span>
              </button>
            </form>
          </div>

          {/* Member & Copy Inspection Card */}
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              فحص الأهلية المسبق (Pre-flight Validation)
            </h3>

            {/* Member Card */}
            {selectedMember ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="var(--color-primary)" />
                    <strong style={{ fontSize: '0.95rem' }}>{selectedMember.full_name}</strong>
                  </div>
                  <StatusBadge status={selectedMember.membership_status} size="sm" />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>كود العضو: <strong>{selectedMember.member_code}</strong></span>
                  <span>الكتب المعارة حالياً: <strong>{selectedMember.active_loans_count} من {policies.max_borrow_limit}</strong></span>
                  <span>الغرامات المسجلة: <strong style={{ color: selectedMember.fines_due > 0 ? 'var(--status-overdue-text)' : 'inherit' }}>{selectedMember.fines_due} ر.س</strong></span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>لم يتم تحديد عضو</p>
            )}

            {/* Book Copy Preview */}
            {selectedCopy && selectedBook ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
                <img
                  src={selectedBook.cover_image}
                  alt={selectedBook.title}
                  style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{selectedBook.title}</strong>
                    <StatusBadge status={selectedCopy.status} size="sm" />
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{selectedBook.author}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>موقع الرف: {selectedCopy.shelf_location}</span>
                </div>
              </div>
            ) : selectedBarcode ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--status-overdue-bg)', borderRadius: 'var(--radius-md)', color: 'var(--status-overdue-text)', fontSize: '0.82rem' }}>
                الباركود المدخل غير مسجل في قاعدة البيانات
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Return Desk Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
          {/* Return Form */}
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RotateCcw size={20} color="var(--color-primary)" />
              استلام وإرجاع نسخة مادية
            </h3>

            <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  امسح أو أدخل باركود النسخة المسترجعة:
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BC-xxx-xx</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="أدخل باركود النسخة..."
                  value={returnBarcode}
                  onChange={(e) => setReturnBarcode(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '100%' }}>نسخ معارة حالياً للإرجاع السريع:</span>
                  {borrowedLoans.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                      onClick={() => setReturnBarcode(l.copy_barcode)}
                    >
                      {l.copy_barcode} ({l.status === 'overdue' ? 'متأخر ⚠️' : 'ساري'})
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px' }}
                disabled={!returnBarcode}
              >
                <CheckCircle2 size={18} />
                <span>تأكيد استلام النسخة وإغلاق الإعارة</span>
              </button>
            </form>
          </div>

          {/* Return Loan Details Preview */}
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
              تفاصيل الإعارة المستهدفة
            </h3>

            {selectedReturnLoan ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '1rem' }}>{selectedReturnLoan.book_title}</strong>
                    <StatusBadge status={selectedReturnLoan.status} size="sm" />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>المستعير: <strong>{selectedReturnLoan.member_name}</strong> ({selectedReturnLoan.member_code})</span>
                    <span>تاريخ الاستحقاق: <strong>{new Date(selectedReturnLoan.due_at).toLocaleDateString('ar-EG')}</strong></span>
                  </div>
                </div>

                {selectedReturnLoan.status === 'overdue' && (
                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-overdue-bg)', border: '1px solid var(--status-overdue-border)', borderRadius: 'var(--radius-md)', color: 'var(--status-overdue-text)', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                      <AlertTriangle size={16} />
                      <span>تنبيه: النسخة متأخرة عن موعدها!</span>
                    </div>
                    <span>سيتم احتساب غرامة تأخير تلقائية بمقدار {policies.fine_per_day} ر.س عن كل يوم تأخير وإضافتها لسجل العضو.</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>اختر أو أدخل باركود نسخة معارة لعرض تفاصيل المستعير وتاريخ الاستحقاق والغرامات.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Borrowed Loans Table */}
      <div className="card" style={{ padding: '22px', backgroundColor: 'var(--bg-surface)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--color-primary)" />
          قائمة الإعارات الجارية ({borrowedLoans.length})
        </h3>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>الباركود</th>
                <th>عنوان الكتاب</th>
                <th>المستعير</th>
                <th>تاريخ الإعارة</th>
                <th>تاريخ الاستحقاق</th>
                <th>الحالة</th>
                <th>إجراء سريع</th>
              </tr>
            </thead>
            <tbody>
              {borrowedLoans.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{l.copy_barcode}</td>
                  <td><strong>{l.book_title}</strong></td>
                  <td>{l.member_name}</td>
                  <td>{new Date(l.issued_at).toLocaleDateString('ar-EG')}</td>
                  <td>{new Date(l.due_at).toLocaleDateString('ar-EG')}</td>
                  <td><StatusBadge status={l.status} size="sm" /></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => returnLoan(l.copy_barcode)}
                    >
                      استلام
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
