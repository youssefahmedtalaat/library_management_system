import React from 'react';
import {
  BookOpen,
  RotateCcw,
  CheckCircle2,
  BookmarkCheck,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';
import { getMemberName, getBookTitle, getBookAuthor } from '../../data/mockData';

export default function MemberDashboard() {
  const {
    currentMemberId,
    members,
    loans,
    reservations,
    renewLoan,
    cancelReservation,
    policies,
    openBookModal,
    books,
    lang,
    t
  } = useLibrary();

  const isRTL = lang === 'ar';
  const member = members.find((m) => m.id === currentMemberId) || members[0];
  const activeLoans = loans.filter((l) => l.member_id === currentMemberId && !l.returned_at);
  const activeReservations = reservations.filter((r) => r.member_id === currentMemberId && r.status === 'active');

  const memberDisplayName = getMemberName(member, lang);

  // Helper to calculate days remaining
  const getDaysRemaining = (dueDateStr) => {
    const due = new Date(dueDateStr).getTime();
    const now = new Date('2026-10-26T13:50:00Z').getTime();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
      {/* Member Profile Overview Card */}
      <div
        className="card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-muted) 100%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        {/* Left: User Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {memberDisplayName.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{memberDisplayName}</h2>
              <StatusBadge status={member.membership_status} size="sm" />
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {t('memberDashboard.memberCode')} <strong style={{ fontFamily: 'monospace' }}>{member.member_code}</strong> | {t('memberDashboard.joinedAt')} {member.joined_at}
            </p>
          </div>
        </div>

        {/* Center: Borrowing Limit Meter */}
        <div style={{ padding: '12px 18px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t('memberDashboard.borrowLimit')}</span>
            <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
              {t('memberDashboard.booksOfLimit', { n: activeLoans.length, max: policies.max_borrow_limit })}
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(activeLoans.length / policies.max_borrow_limit) * 100}%`,
                height: '100%',
                backgroundColor: activeLoans.length >= policies.max_borrow_limit ? 'var(--status-overdue-text)' : 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {lang === 'en'
              ? `You can borrow ${Math.max(0, policies.max_borrow_limit - activeLoans.length)} more book(s)`
              : `يمكنك استعارة ${Math.max(0, policies.max_borrow_limit - activeLoans.length)} كتب إضافية`}
          </p>
        </div>

        {/* Right: Fines & Standing */}
        <div style={{ padding: '12px 18px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>{t('memberDashboard.finesDue')}</span>
              <strong style={{ fontSize: '1.25rem', color: member.fines_due > 0 ? 'var(--status-overdue-text)' : 'var(--status-available-text)' }}>
                {member.fines_due.toFixed(2)} {lang === 'en' ? 'SAR' : 'ر.س'}
              </strong>
            </div>
            {member.fines_due === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--status-available-text)', fontSize: '0.8rem', fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                <span>{lang === 'en' ? 'Clean Record' : 'سجل ناصع'}</span>
              </div>
            ) : (
              <span className="badge badge-overdue" style={{ fontSize: '0.75rem' }}>
                {lang === 'en' ? 'Action Required' : 'يتطلب التسوية'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active Loans Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              {t('memberDashboard.activeLoans')} ({activeLoans.length})
            </h3>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            {lang === 'en'
              ? 'Loans can be renewed online up to 2 times unless reserved by another member'
              : 'يمكن تجديد الإعارة إلكترونياً مرتين كحد أقصى ما لم يكن الكتاب محجوزاً'}
          </span>
        </div>

        {activeLoans.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {activeLoans.map((loan) => {
              const daysRemaining = getDaysRemaining(loan.due_at);
              const isOverdue = daysRemaining < 0 || loan.status === 'overdue';
              const isDueSoon = daysRemaining <= 2 && daysRemaining >= 0;

              // Find book cover & details
              const bookObj = books.find((b) => b.id === loan.book_id);
              const bookTitle = bookObj ? getBookTitle(bookObj, lang) : (lang === 'en' ? (loan.book_title_en || loan.book_title) : loan.book_title);
              const bookAuthor = bookObj ? getBookAuthor(bookObj, lang) : (lang === 'en' ? (loan.book_author_en || loan.book_author) : loan.book_author);

              let statusText = '';
              if (isOverdue) {
                statusText = lang === 'en' ? `Overdue by ${Math.abs(daysRemaining)} d` : `متأخر ${Math.abs(daysRemaining)} يوم`;
              } else if (isDueSoon) {
                statusText = lang === 'en' ? `${daysRemaining} d left` : `متبقي ${daysRemaining} يوم`;
              } else {
                statusText = lang === 'en' ? `${daysRemaining} d left` : `متبقي ${daysRemaining} أيام`;
              }

              return (
                <div
                  key={loan.id}
                  className="card"
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderLeft: isRTL ? 'none' : (isOverdue ? '4px solid var(--status-overdue-border)' : isDueSoon ? '4px solid var(--status-reserved-border)' : '4px solid var(--status-available-border)'),
                    borderRight: !isRTL ? 'none' : (isOverdue ? '4px solid var(--status-overdue-border)' : isDueSoon ? '4px solid var(--status-reserved-border)' : '4px solid var(--status-available-border)')
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    {bookObj && (
                      <img
                        src={bookObj.cover_image}
                        alt={bookTitle}
                        style={{
                          width: '60px',
                          height: '84px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)',
                          flexShrink: 0
                        }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 3px 0', color: 'var(--text-primary)' }}>
                          {bookTitle}
                        </h4>
                        <StatusBadge
                          status={isOverdue ? 'overdue' : isDueSoon ? 'due_soon' : 'borrowed'}
                          text={statusText}
                          size="sm"
                        />
                      </div>

                      <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {lang === 'en' ? 'Author:' : 'المؤلف:'} {bookAuthor}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>{lang === 'en' ? 'Barcode:' : 'باركود:'} <strong style={{ fontFamily: 'monospace' }}>{loan.copy_barcode}</strong></span>
                        <span>•</span>
                        <span>{lang === 'en' ? `Renewals: ${loan.renew_count} of ${policies.max_renewals}` : `التجديدات: ${loan.renew_count} من ${policies.max_renewals}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates breakdown */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{lang === 'en' ? 'Issued:' : 'تاريخ الصرف:'} </span>
                      <strong>{formatDate(loan.issued_at)}</strong>
                    </div>
                    <div>
                      <span style={{ color: isOverdue ? 'var(--status-overdue-text)' : 'var(--text-secondary)' }}>
                        {lang === 'en' ? 'Due Date:' : 'تاريخ الاستحقاق:'}{' '}
                      </span>
                      <strong style={{ color: isOverdue ? 'var(--status-overdue-text)' : 'var(--text-primary)' }}>
                        {formatDate(loan.due_at)}
                      </strong>
                    </div>
                  </div>

                  {/* Renew Button */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                      disabled={isOverdue || loan.renew_count >= policies.max_renewals}
                      onClick={() => renewLoan(loan.id)}
                    >
                      <RotateCcw size={14} />
                      <span>
                        {loan.renew_count >= policies.max_renewals
                          ? t('memberDashboard.maxRenewalsReached')
                          : isOverdue
                          ? (lang === 'en' ? 'Cannot Renew (Overdue)' : 'لا يمكن التجديد (متأخر)')
                          : (lang === 'en' ? `Request Renewal (+${policies.default_loan_days} days)` : `طلب تجديد (+${policies.default_loan_days} يوماً)`)}
                      </span>
                    </button>

                    {bookObj && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openBookModal(bookObj)}
                      >
                        {lang === 'en' ? 'Details' : 'تفاصيل'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <BookOpen size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <p>{t('memberDashboard.noLoans')}</p>
          </div>
        )}
      </div>

      {/* Active Reservations Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookmarkCheck size={20} color="var(--color-ai-accent)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              {t('memberDashboard.activeReservations')} ({activeReservations.length})
            </h3>
          </div>
        </div>

        {activeReservations.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {activeReservations.map((res) => {
              const bookObj = books.find((b) => b.id === res.book_id);
              const title = bookObj ? getBookTitle(bookObj, lang) : (lang === 'en' ? (res.book_title_en || res.book_title) : res.book_title);

              return (
                <div
                  key={res.id}
                  className="card"
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    borderTop: '3px solid var(--color-ai-accent)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '0 0 3px 0' }}>
                        {title}
                      </h4>
                      <span className="badge badge-ai" style={{ fontSize: '0.74rem' }}>
                        {t('memberDashboard.queuePosition', { n: res.queue_position })}
                      </span>
                    </div>
                    <StatusBadge status="reserved" size="sm" />
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>{lang === 'en' ? 'Hold Placed Date:' : 'تاريخ طلب الحجز:'} {formatDate(res.placed_at)}</span>
                    <span>{t('memberDashboard.expiresAt')} {formatDate(res.expires_at)}</span>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', color: 'var(--status-overdue-text)' }}
                      onClick={() => cancelReservation(res.id)}
                    >
                      <XCircle size={14} />
                      <span>{t('memberDashboard.cancelHold')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ margin: 0 }}>{t('memberDashboard.noReservations')}</p>
          </div>
        )}
      </div>

      {/* Circulation Policy Rules Summary */}
      <div
        className="card"
        style={{
          padding: '18px 22px',
          backgroundColor: 'var(--bg-muted)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="var(--color-primary)" />
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0 }}>
              {lang === 'en' ? 'Active Lending Rules & Policies' : 'سياسات التداول المعمول بها'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {lang === 'en'
                ? `Standard loan duration ${policies.default_loan_days} days • Max ${policies.max_borrow_limit} books • ${policies.max_renewals} renewals allowed • ${policies.fine_per_day} SAR daily overdue fine.`
                : `مدة الإعارة ${policies.default_loan_days} يوماً • بحد أقصى ${policies.max_borrow_limit} كتب • ${policies.max_renewals} تجديدات مسموحة • غرامة التأخير ${policies.fine_per_day} ر.س / يوم.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
