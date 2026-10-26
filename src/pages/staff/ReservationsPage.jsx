import React, { useState } from 'react';
import { XCircle, Bell, User } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';
import { getBookTitle, getMemberName } from '../../data/mockData';

export default function ReservationsPage() {
  const { reservations, cancelReservation, addToast, books, members, lang } = useLibrary();
  const [filter, setFilter] = useState('active');

  const filtered = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const notifyMember = (res) => {
    const bookObj = books.find((b) => b.id === res.book_id);
    const title = bookObj ? getBookTitle(bookObj, lang) : (lang === 'en' ? (res.book_title_en || res.book_title) : res.book_title);
    const memberObj = members.find((m) => m.id === res.member_id);
    const memberName = memberObj ? getMemberName(memberObj, lang) : (lang === 'en' ? (res.member_name_en || res.member_name) : res.member_name);

    addToast({
      type: 'success',
      title: lang === 'en' ? 'Availability Notice Sent' : 'تم إرسال إشعار التوفر',
      message: lang === 'en'
        ? `Notified member ${memberName} that reserved copy of "${title}" is ready for pickup at Circulation Desk for 48 hours.`
        : `تم إشعار العضو ${memberName} بأن نسخته المحجوزة من "${title}" جاهزة للاستلام بمكتب الإعارة لمدة 48 ساعة.`
    });
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
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
            {lang === 'en' ? 'Reservations & Hold Queue Management' : 'قائمة الحجوزات وطوابير الانتظار'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {lang === 'en'
              ? 'Track member holds on checked-out books, manage queue orders, and notify members upon item check-in.'
              : 'متابعة حجوزات الأعضاء للعناوين المعارة، وترتيب أدوار الطابور وتأكيد استلام النسخ المحجوزة.'}
          </p>
        </div>

        {/* Status filter tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: filter === 'active' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'active' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
            onClick={() => setFilter('active')}
          >
            {lang === 'en' ? 'Active' : 'النشطة'} ({reservations.filter((r) => r.status === 'active').length})
          </button>
          <button
            type="button"
            className="btn btn-sm"
            style={{
              backgroundColor: filter === 'all' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'all' ? '#FFFFFF' : 'var(--text-secondary)'
            }}
            onClick={() => setFilter('all')}
          >
            {lang === 'en' ? 'All' : 'الكل'} ({reservations.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{lang === 'en' ? 'Book Title' : 'عنوان الكتاب'}</th>
                <th>{lang === 'en' ? 'Borrower Member' : 'العضو الحاجز'}</th>
                <th>{lang === 'en' ? 'Member Code' : 'كود العضو'}</th>
                <th>{lang === 'en' ? 'Queue Position' : 'الترتيب في الطابور'}</th>
                <th>{lang === 'en' ? 'Placed Date' : 'تاريخ الطلب'}</th>
                <th>{lang === 'en' ? 'Pickup Expiration' : 'صلاحية الحجز'}</th>
                <th>{lang === 'en' ? 'Status' : 'الحالة'}</th>
                <th>{lang === 'en' ? 'Actions' : 'إجراءات الإدارة'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => {
                const bookObj = books.find((b) => b.id === res.book_id);
                const title = bookObj ? getBookTitle(bookObj, lang) : (lang === 'en' ? (res.book_title_en || res.book_title) : res.book_title);
                const memberObj = members.find((m) => m.id === res.member_id);
                const memberName = memberObj ? getMemberName(memberObj, lang) : (lang === 'en' ? (res.member_name_en || res.member_name) : res.member_name);

                return (
                  <tr key={res.id}>
                    <td>
                      <strong>{title}</strong>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} color="var(--color-primary)" />
                        {memberName}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{res.member_code}</td>
                    <td>
                      <span className="badge badge-ai" style={{ fontWeight: 800 }}>
                        {lang === 'en' ? `#${res.queue_position} in Queue` : `المرتبة #${res.queue_position}`}
                      </span>
                    </td>
                    <td>{formatDate(res.placed_at)}</td>
                    <td>{formatDate(res.expires_at)}</td>
                    <td>
                      <StatusBadge status={res.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {res.status === 'active' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              title={lang === 'en' ? 'Notify member copy is ready' : 'إشعار بتوفر النسخة'}
                              onClick={() => notifyMember(res)}
                            >
                              <Bell size={13} />
                              <span>{lang === 'en' ? 'Notify' : 'إشعار'}</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              title={lang === 'en' ? 'Cancel reservation' : 'إلغاء الحجز'}
                              onClick={() => cancelReservation(res.id)}
                            >
                              <XCircle size={13} />
                              <span>{lang === 'en' ? 'Cancel' : 'إلغاء'}</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    {lang === 'en' ? 'No hold reservations found for the selected filter.' : 'لا توجد حجوزات مطابقة للفئة المحددة حالياً.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
