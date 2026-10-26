import React from 'react';
import { X, BookOpen, MapPin, Hash, Star, Calendar, BookmarkCheck, Building, Globe, Layers, CheckCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLibrary } from '../context/LibraryContext';

export default function BookDetailsModal() {
  const {
    selectedBook,
    closeBookModal,
    bookCopies,
    reserveBook,
    reservations,
    currentRole,
    updateCopyStatus
  } = useLibrary();

  if (!selectedBook) return null;

  const copies = bookCopies.filter((c) => c.book_id === selectedBook.id);
  const activeReservations = reservations.filter(
    (r) => r.book_id === selectedBook.id && r.status === 'active'
  );

  const handleReserve = () => {
    reserveBook(selectedBook.id);
  };

  return (
    <div className="modal-backdrop" onClick={closeBookModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>بطاقة الكتاب والنسخ المادية</h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={closeBookModal}
            aria-label="إغلاق النافذة"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Top section: Book Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: '22px' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', maxHeight: '240px' }}>
              <img
                src={selectedBook.cover_image}
                alt={selectedBook.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-neutral">{selectedBook.category}</span>
                <span className="badge badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="var(--color-ai-accent)" />
                  {selectedBook.rating} تقييم القراء
                </span>
                <StatusBadge
                  status={selectedBook.available_copies > 0 ? 'available' : 'borrowed'}
                  text={`${selectedBook.available_copies} من ${selectedBook.total_copies} متاح`}
                  size="sm"
                />
              </div>

              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {selectedBook.title}
              </h1>

              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                تأليف: {selectedBook.author}
              </p>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedBook.description}
              </p>

              {/* Bibliographic grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px',
                  backgroundColor: 'var(--bg-muted)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  marginTop: 'auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} color="var(--text-muted)" />
                  <span>الناشر: {selectedBook.publisher}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--text-muted)" />
                  <span>سنة النشر: {selectedBook.publication_year}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} color="var(--text-muted)" />
                  <span>اللغة: {selectedBook.language}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hash size={14} color="var(--text-muted)" />
                  <span>ISBN: {selectedBook.isbn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation / Holds status banner */}
          {activeReservations.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: 'var(--color-ai-surface)',
                border: '1px solid var(--color-ai-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-ai-accent)',
                fontSize: '0.88rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookmarkCheck size={18} />
                <span>
                  يوجد حالياً <strong>{activeReservations.length} طلبات حجز</strong> نشطة في طابور الانتظار لهذا العنوان.
                </span>
              </div>
            </div>
          )}

          {/* Physical Copies Breakdown Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--color-primary)" />
                النسخ المادية المستقلة ({copies.length} نسخ)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                رمز الرف الافتراضي: <strong>{selectedBook.shelf_location}</strong>
              </span>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>باركود النسخة</th>
                    <th>موقع الرف</th>
                    <th>الحالة التشغيلية</th>
                    {currentRole === 'staff' && <th>إجراء الموظف</th>}
                  </tr>
                </thead>
                <tbody>
                  {copies.map((copy) => (
                    <tr key={copy.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {copy.barcode}
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={13} color="var(--color-primary)" />
                          {copy.shelf_location}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={copy.status} />
                      </td>
                      {currentRole === 'staff' && (
                        <td>
                          <select
                            className="form-select"
                            value={copy.status}
                            onChange={(e) => updateCopyStatus(copy.id, e.target.value)}
                            style={{ padding: '3px 8px', fontSize: '0.78rem', width: 'auto' }}
                          >
                            <option value="available">متاح للإعارة</option>
                            <option value="borrowed">مُعار حالياً</option>
                            <option value="reserved">محجوز</option>
                            <option value="maintenance">صيانة وتجليد</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                  {copies.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                        لا توجد نسخ مسجلة في قاعدة البيانات حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomLeftRadius: 'var(--radius-xl)',
            borderBottomRightRadius: 'var(--radius-xl)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <CheckCircle size={15} color="var(--status-available-text)" />
            <span>قواعد الإعارة المطبقة: مدة الإعارة 14 يوماً وتجديدين كحد أقصى</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={closeBookModal}>
              إغلاق
            </button>
            {currentRole === 'member' && (
              <button
                type="button"
                className={selectedBook.available_copies > 0 ? 'btn btn-primary' : 'btn btn-ai'}
                onClick={handleReserve}
              >
                <BookmarkCheck size={16} />
                <span>{selectedBook.available_copies > 0 ? 'حجز مسبق للاستلام' : 'انضمام لطابور الحجز'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
