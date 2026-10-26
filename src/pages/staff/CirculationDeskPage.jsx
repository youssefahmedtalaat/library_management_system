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
import { getBookTitle, getBookAuthor, getBookShelf, getMemberName } from '../../data/mockData';

export default function CirculationDeskPage() {
  const {
    bookCopies,
    books,
    members,
    loans,
    policies,
    issueLoan,
    returnLoan,
    lang
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

  const previewDueDate = useMemo(() => {
    return new Date(Date.now() + policies.default_loan_days * 86400000);
  }, [policies.default_loan_days]);

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
            {lang === 'en' ? 'Central Circulation & Lending Desk' : 'مكتب الإعارة والتداول المركزي'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {lang === 'en'
              ? 'Issue physical copies to members and process returns with instantaneous policy and fine checks.'
              : 'صرف النسخ المادية للأعضاء واستلام المرتجعات مع التحقق الفوري من قيود السياسات والغرامات.'}
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
            <span>{lang === 'en' ? 'Issue Loan (Checkout)' : 'تسجيل إعارة جديدة'}</span>
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
            <span>{lang === 'en' ? 'Return Copy (Checkin)' : 'تسجيل إرجاع نسخة'}</span>
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
              {lang === 'en' ? 'Loan Issue Form' : 'بيانات صرف الإعارة'}
            </h3>

            <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Member Selection */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  {lang === 'en' ? 'Select Borrower Member:' : 'اختر العضو المستعير:'}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'en' ? ' or choose by code' : ' أو أدخل الكود مباشرة'}
                  </span>
                </label>
                <select
                  className="form-select"
                  value={selectedMemberCode}
                  onChange={(e) => setSelectedMemberCode(e.target.value)}
                >
                  {members.map((m) => {
                    const memberName = getMemberName(m, lang);
                    return (
                      <option key={m.id} value={m.member_code}>
                        {memberName} ({m.member_code}) — {m.membership_status === 'active' ? (lang === 'en' ? 'Active' : 'نشط') : (lang === 'en' ? 'Blocked' : 'موقوف')} [{lang === 'en' ? 'Loans:' : 'إعاراته:'} {m.active_loans_count}/{policies.max_borrow_limit}]
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Barcode Selection / Input */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  {lang === 'en' ? 'Item Copy Barcode:' : 'باركود النسخة المادية:'}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {lang === 'en' ? ' scan or select from available' : ' امسح الباركود أو اختر من المتاح'}
                  </span>
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
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '100%' }}>
                    {lang === 'en' ? 'Available copies for quick testing:' : 'نسخ متاحة حالياً للتجربة السريعة:'}
                  </span>
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
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'en' ? 'Standard Loan Duration:' : 'مدة الإعارة المطبقة:'}</span>
                  <strong>{policies.default_loan_days} {lang === 'en' ? 'days' : 'يوماً'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{lang === 'en' ? 'Calculated Due Date:' : 'تاريخ الاستحقاق المحسوب:'}</span>
                  <strong style={{ color: 'var(--color-primary)' }}>{formatDate(previewDueDate)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px' }}
                disabled={!selectedBarcode || (selectedMember && selectedMember.membership_status !== 'active')}
              >
                <CheckCircle2 size={18} />
                <span>{lang === 'en' ? 'Complete Loan & Issue Copy' : 'إتمام تسجيل الإعارة وصرف النسخة'}</span>
              </button>
            </form>
          </div>

          {/* Member & Copy Inspection Card */}
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              {lang === 'en' ? 'Pre-flight Validation' : 'فحص الأهلية المسبق'}
            </h3>

            {/* Member Card */}
            {selectedMember ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={18} color="var(--color-primary)" />
                    <strong style={{ fontSize: '0.95rem' }}>{getMemberName(selectedMember, lang)}</strong>
                  </div>
                  <StatusBadge status={selectedMember.membership_status} size="sm" />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{lang === 'en' ? 'Member Code:' : 'كود العضو:'} <strong>{selectedMember.member_code}</strong></span>
                  <span>{lang === 'en' ? 'Current Active Loans:' : 'الكتب المعارة حالياً:'} <strong>{selectedMember.active_loans_count} / {policies.max_borrow_limit}</strong></span>
                  <span>{lang === 'en' ? 'Recorded Fines:' : 'الغرامات المسجلة:'} <strong style={{ color: selectedMember.fines_due > 0 ? 'var(--status-overdue-text)' : 'inherit' }}>{selectedMember.fines_due} {lang === 'en' ? 'SAR' : 'ر.س'}</strong></span>
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? 'No member selected' : 'لم يتم تحديد عضو'}</p>
            )}

            {/* Book Copy Preview */}
            {selectedCopy && selectedBook ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
                <img
                  src={selectedBook.cover_image}
                  alt={getBookTitle(selectedBook, lang)}
                  style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{getBookTitle(selectedBook, lang)}</strong>
                    <StatusBadge status={selectedCopy.status} size="sm" />
                  </div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{getBookAuthor(selectedBook, lang)}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lang === 'en' ? 'Shelf:' : 'موقع الرف:'} {getBookShelf(selectedCopy, lang)}</span>
                </div>
              </div>
            ) : selectedBarcode ? (
              <div style={{ padding: '14px', backgroundColor: 'var(--status-overdue-bg)', borderRadius: 'var(--radius-md)', color: 'var(--status-overdue-text)', fontSize: '0.82rem' }}>
                {lang === 'en' ? 'Entered barcode is not registered in catalog database' : 'الباركود المدخل غير مسجل في قاعدة البيانات'}
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
              {lang === 'en' ? 'Return & Check-in Copy' : 'استلام وإرجاع نسخة مادية'}
            </h3>

            <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  {lang === 'en' ? 'Scan or Enter Returned Copy Barcode:' : 'امسح أو أدخل باركود النسخة المسترجعة:'}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> BC-xxx-xx</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={lang === 'en' ? 'Enter item barcode...' : 'أدخل باركود النسخة...'}
                  value={returnBarcode}
                  onChange={(e) => setReturnBarcode(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '100%' }}>
                    {lang === 'en' ? 'Currently checked-out copies for quick check-in:' : 'نسخ معارة حالياً للإرجاع السريع:'}
                  </span>
                  {borrowedLoans.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                      onClick={() => setReturnBarcode(l.copy_barcode)}
                    >
                      {l.copy_barcode} ({l.status === 'overdue' ? (lang === 'en' ? 'Overdue ⚠️' : 'متأخر ⚠️') : (lang === 'en' ? 'Active' : 'ساري')})
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
                <span>{lang === 'en' ? 'Confirm Check-in & Close Loan' : 'تأكيد استلام النسخة وإغلاق الإعارة'}</span>
              </button>
            </form>
          </div>

          {/* Return Loan Details Preview */}
          <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-surface)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
              {lang === 'en' ? 'Loan Details Preview' : 'تفاصيل الإعارة المستهدفة'}
            </h3>

            {selectedReturnLoan ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '14px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '1rem' }}>
                      {lang === 'en' ? (selectedReturnLoan.book_title_en || selectedReturnLoan.book_title) : selectedReturnLoan.book_title}
                    </strong>
                    <StatusBadge status={selectedReturnLoan.status} size="sm" />
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>{lang === 'en' ? 'Borrower:' : 'المستعير:'} <strong>{lang === 'en' ? (selectedReturnLoan.member_name_en || selectedReturnLoan.member_name) : selectedReturnLoan.member_name}</strong> ({selectedReturnLoan.member_code})</span>
                    <span>{lang === 'en' ? 'Due Date:' : 'تاريخ الاستحقاق:'} <strong>{formatDate(selectedReturnLoan.due_at)}</strong></span>
                  </div>
                </div>

                {selectedReturnLoan.status === 'overdue' && (
                  <div style={{ padding: '12px 16px', backgroundColor: 'var(--status-overdue-bg)', border: '1px solid var(--status-overdue-border)', borderRadius: 'var(--radius-md)', color: 'var(--status-overdue-text)', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                      <AlertTriangle size={16} />
                      <span>{lang === 'en' ? 'Alert: Copy is overdue!' : 'تنبيه: النسخة متأخرة عن موعدها!'}</span>
                    </div>
                    <span>
                      {lang === 'en'
                        ? `An automatic fine of ${policies.fine_per_day} SAR per overdue day will be assessed and added to the member ledger.`
                        : `سيتم احتساب غرامة تأخير تلقائية بمقدار ${policies.fine_per_day} ر.س عن كل يوم تأخير وإضافتها لسجل العضو.`}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>{lang === 'en' ? 'Scan or enter a borrowed copy barcode to preview borrower details and overdue status.' : 'اختر أو أدخل باركود نسخة معارة لعرض تفاصيل المستعير وتاريخ الاستحقاق والغرامات.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Borrowed Loans Table */}
      <div className="card" style={{ padding: '22px', backgroundColor: 'var(--bg-surface)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--color-primary)" />
          {lang === 'en' ? `Current Circulating Loans (${borrowedLoans.length})` : `قائمة الإعارات الجارية (${borrowedLoans.length})`}
        </h3>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{lang === 'en' ? 'Barcode' : 'الباركود'}</th>
                <th>{lang === 'en' ? 'Book Title' : 'عنوان الكتاب'}</th>
                <th>{lang === 'en' ? 'Borrower' : 'المستعير'}</th>
                <th>{lang === 'en' ? 'Issue Date' : 'تاريخ الإعارة'}</th>
                <th>{lang === 'en' ? 'Due Date' : 'تاريخ الاستحقاق'}</th>
                <th>{lang === 'en' ? 'Status' : 'الحالة'}</th>
                <th>{lang === 'en' ? 'Quick Action' : 'إجراء سريع'}</th>
              </tr>
            </thead>
            <tbody>
              {borrowedLoans.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{l.copy_barcode}</td>
                  <td><strong>{lang === 'en' ? (l.book_title_en || l.book_title) : l.book_title}</strong></td>
                  <td>{lang === 'en' ? (l.member_name_en || l.member_name) : l.member_name}</td>
                  <td>{formatDate(l.issued_at)}</td>
                  <td>{formatDate(l.due_at)}</td>
                  <td><StatusBadge status={l.status} size="sm" /></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => returnLoan(l.copy_barcode)}
                    >
                      {lang === 'en' ? 'Check-in' : 'استلام'}
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
