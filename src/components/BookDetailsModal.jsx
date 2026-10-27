import React, { useState, useEffect, useCallback } from 'react';
import { X, BookOpen, MapPin, Hash, Star, Calendar, BookmarkCheck, Building, Globe, Layers, CheckCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import StarRatingWidget from './StarRatingWidget';
import { useLibrary } from '../context/LibraryContext';
import { api } from '../services/api';
import {
  getBookTitle,
  getBookAuthor,
  getBookDescription,
  getBookCategory,
  getBookPublisher,
  getBookLanguage,
  getBookShelf
} from '../data/mockData';
import { getShelfLocation } from '../data/translations';

export default function BookDetailsModal() {
  const {
    selectedBook,
    closeBookModal,
    bookCopies,
    reserveBook,
    reservations,
    currentRole,
    updateCopyStatus,
    lang,
    t
  } = useLibrary();

  const [ratingsData, setRatingsData] = useState(null);

  const fetchRatings = useCallback(async () => {
    if (!selectedBook?.id) return;
    try {
      const data = await api.books.getRatings(selectedBook.id);
      if (data) setRatingsData(data);
    } catch {
      // Keep silent fallback if guest or offline
    }
  }, [selectedBook?.id]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  if (!selectedBook) return null;

  const copies = bookCopies.filter((c) => c.book_id === selectedBook.id);
  const activeReservations = reservations.filter(
    (r) => r.book_id === selectedBook.id && r.status === 'active'
  );

  const handleReserve = () => {
    reserveBook(selectedBook.id);
  };

  const displayTitle = getBookTitle(selectedBook, lang);
  const displayAuthor = getBookAuthor(selectedBook, lang);
  const displayDesc = getBookDescription(selectedBook, lang);
  const displayCategory = getBookCategory(selectedBook, lang);
  const displayPublisher = getBookPublisher(selectedBook, lang);
  const displayLanguage = getBookLanguage(selectedBook, lang);
  const displayShelf = getBookShelf(selectedBook, lang);

  const avgRating = Number(ratingsData?.averageRating ?? selectedBook.rating ?? 0);
  const totalRatings = Number(ratingsData?.totalRatings ?? selectedBook.ratings_count ?? 0);
  const distribution = ratingsData?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const reviews = ratingsData?.reviews || [];
  const myRating = ratingsData?.myRating || null;

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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              {t('modal.title')}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={closeBookModal}
            aria-label={t('modal.close')}
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
                alt={displayTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-neutral">{displayCategory}</span>
                <span className="badge badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}>
                  <Star size={12} fill="var(--color-ai-accent)" />
                  <span>{avgRating > 0 ? avgRating.toFixed(1) : selectedBook.rating}</span>
                  {totalRatings > 0 && <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>({totalRatings})</span>}
                  <span>{lang === 'en' ? 'Reader Rating' : 'تقييم القراء'}</span>
                </span>
                <StatusBadge
                  status={selectedBook.available_copies > 0 ? 'available' : 'borrowed'}
                  text={selectedBook.available_copies > 0
                    ? (lang === 'en' ? `${selectedBook.available_copies} of ${selectedBook.total_copies} available` : `${selectedBook.available_copies} من ${selectedBook.total_copies} متاح`)
                    : (lang === 'en' ? 'Checked Out' : 'مُعار بالكامل')}
                  size="sm"
                />
              </div>

              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {displayTitle}
              </h1>

              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                {t('modal.by')} {displayAuthor}
              </p>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {displayDesc}
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
                  <span>{t('modal.publisher')} {displayPublisher}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} color="var(--text-muted)" />
                  <span>{t('modal.pubYear')} {selectedBook.publication_year}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} color="var(--text-muted)" />
                  <span>{t('modal.language')} {displayLanguage}</span>
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
                  {t('modal.activeHolds', { n: activeReservations.length })}
                </span>
              </div>
            </div>
          )}

          {/* Physical Copies Breakdown Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--color-primary)" />
                {t('modal.physicalCopiesTitle', { n: copies.length })}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {t('modal.defaultShelf')} <strong>{displayShelf}</strong>
              </span>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('modal.barcodeCol')}</th>
                    <th>{t('modal.shelfCol')}</th>
                    <th>{t('modal.statusCol')}</th>
                    {currentRole === 'staff' && <th>{t('modal.staffActionCol')}</th>}
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
                          {lang === 'en' ? (copy.shelf_location_en || getShelfLocation(copy.shelf_location, 'en')) : copy.shelf_location}
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
                            <option value="available">{t('modal.statusOptions.available')}</option>
                            <option value="borrowed">{t('modal.statusOptions.borrowed')}</option>
                            <option value="reserved">{t('modal.statusOptions.reserved')}</option>
                            <option value="maintenance">{t('modal.statusOptions.maintenance')}</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))}
                  {copies.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                        {t('modal.noCopiesRegistered')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Ratings & Reviews Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Star size={18} fill="#F59E0B" color="#F59E0B" />
                <span>{t('ratings.title')}</span>
                {totalRatings > 0 && (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      color: '#B45309',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {totalRatings} {lang === 'en' ? 'reviews' : 'تقييم'}
                  </span>
                )}
              </h3>
            </div>

            {/* Score Breakdown & Interactive Widget Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                alignItems: 'start'
              }}
            >
              {/* Score & Distribution Breakdown */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--bg-muted)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#B45309', lineHeight: 1 }}>
                      {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                    </div>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '6px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={s <= Math.round(avgRating) ? '#F59E0B' : 'transparent'}
                          color={s <= Math.round(avgRating) ? '#F59E0B' : 'var(--border-strong)'}
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {totalRatings} {lang === 'en' ? 'ratings' : 'تقييم'}
                    </div>
                  </div>

                  {/* 5 to 1 Star Progress Bars */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = distribution[stars] || 0;
                      const percent = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem' }}>
                          <span style={{ width: '22px', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            {stars}★
                          </span>
                          <div
                            style={{
                              flex: 1,
                              height: '7px',
                              backgroundColor: 'var(--bg-surface)',
                              borderRadius: 'var(--radius-full)',
                              overflow: 'hidden',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <div
                              style={{
                                width: `${percent}%`,
                                height: '100%',
                                backgroundColor: '#F59E0B',
                                borderRadius: 'var(--radius-full)',
                                transition: 'width 0.4s ease'
                              }}
                            />
                          </div>
                          <span style={{ width: '24px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* User Interactive Rating Widget */}
              <StarRatingWidget
                bookId={selectedBook.id}
                initialRating={myRating?.rating || 0}
                initialReview={myRating?.review || ''}
                onRatingSubmitted={() => fetchRatings()}
              />
            </div>

            {/* Recent Reviews List */}
            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {lang === 'en' ? 'Reader Reviews' : 'مراجعات القراء'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto', paddingInlineEnd: '4px' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-muted)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-primary)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            {rev.user_name ? rev.user_name[0] : 'U'}
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {rev.user_name}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                            {rev.user_role === 'member' ? (lang === 'en' ? 'Member' : 'عضو') : rev.user_role}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={s <= rev.rating ? '#F59E0B' : 'transparent'}
                              color={s <= rev.rating ? '#F59E0B' : 'var(--border-strong)'}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.review && (
                        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          "{rev.review}"
                        </p>
                      )}

                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(rev.created_at || rev.updated_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                {t('ratings.noRatingsYet')}
              </p>
            )}
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
            borderBottomRightRadius: 'var(--radius-xl)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <CheckCircle size={15} color="var(--status-available-text)" />
            <span>{t('modal.rulesNotice')}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={closeBookModal}>
              {t('modal.close')}
            </button>
            <button
              type="button"
              className={selectedBook.available_copies > 0 ? 'btn btn-primary' : 'btn btn-ai'}
              onClick={handleReserve}
            >
              <BookmarkCheck size={16} />
              <span>{selectedBook.available_copies > 0 ? t('modal.holdForPickup') : t('modal.joinWaitlist')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
