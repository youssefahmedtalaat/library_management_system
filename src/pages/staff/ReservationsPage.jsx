import React, { useState } from 'react';
import { XCircle, Bell, User } from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';

export default function ReservationsPage() {
  const { reservations, cancelReservation, addToast } = useLibrary();
  const [filter, setFilter] = useState('active');

  const filtered = reservations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const notifyMember = (res) => {
    addToast({
      type: 'success',
      title: 'تم إرسال إشعار التوفر',
      message: `تم إشعار العضو ${res.member_name} بأن نسخته المحجوزة من "${res.book_title}" جاهزة للاستلام بمكتب الإعارة لمدة 48 ساعة.`
    });
  };

  return (
    <div style={{ padding: '24px 20px', maxWidth: '1360px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 4px 0' }}>
            قائمة الحجوزات وطوابير الانتظار
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            متابعة حجوزات الأعضاء للعناوين المعارة، وترتيب أدوار الطابور وتأكيد استلام النسخ المحجوزة.
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
            النشطة ({reservations.filter((r) => r.status === 'active').length})
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
            الكل ({reservations.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>عنوان الكتاب</th>
                <th>العضو الحاجز</th>
                <th>كود العضو</th>
                <th>الترتيب في الطابور</th>
                <th>تاريخ الطلب</th>
                <th>صلاحية الحجز</th>
                <th>الحالة</th>
                <th>إجراءات الإدارة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => (
                <tr key={res.id}>
                  <td>
                    <strong>{res.book_title}</strong>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={14} color="var(--color-primary)" />
                      {res.member_name}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace' }}>{res.member_code}</td>
                  <td>
                    <span className="badge badge-ai" style={{ fontWeight: 800 }}>
                      المرتبة #{res.queue_position}
                    </span>
                  </td>
                  <td>{new Date(res.placed_at).toLocaleDateString('ar-EG')}</td>
                  <td>{new Date(res.expires_at).toLocaleDateString('ar-EG')}</td>
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
                            title="إشعار بتوفر النسخة"
                            onClick={() => notifyMember(res)}
                          >
                            <Bell size={13} />
                            <span>إشعار</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            title="إلغاء الحجز"
                            onClick={() => cancelReservation(res.id)}
                          >
                            <XCircle size={13} />
                            <span>إلغاء</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    لا توجد حجوزات مطابقة للفئة المحددة حالياً.
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
