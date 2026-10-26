import React from 'react';
import { BookOpen, MapPin, Hash, Star, Calendar, BookmarkCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLibrary } from '../context/LibraryContext';

export default function BookCard({ book }) {
  const { openBookModal, reserveBook, currentRole } = useLibrary();

  const isAvailable = book.available_copies > 0;
  const statusKey = isAvailable ? 'available' : 'borrowed';
  const availabilityPercent = Math.round((book.available_copies / Math.max(1, book.total_copies)) * 100);

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      {/* Book Cover + Top Badges */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', backgroundColor: 'var(--bg-muted)' }}>
        <img
          src={book.cover_image}
          alt={book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, transparent 60%)',
            pointerEvents: 'none'
          }}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
          <StatusBadge
            status={statusKey}
            text={isAvailable ? `${book.available_copies} متاح` : 'مُعار بالكامل'}
            size="sm"
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            color: '#FCD34D',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            fontWeight: 700,
            backdropFilter: 'blur(4px)'
          }}
        >
          <Star size={13} fill="#FCD34D" color="#FCD34D" />
          <span>{book.rating}</span>
        </div>

        {/* Category Tag on Cover bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            left: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#FFFFFF'
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: 'rgba(30, 58, 95, 0.85)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-xs)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {book.category}
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Calendar size={12} />
            {book.publication_year}
          </span>
        </div>
      </div>

      {/* Book Body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
        <div>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              marginBottom: '4px',
              lineHeight: 1.4,
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
            onClick={() => openBookModal(book)}
          >
            {book.title}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {book.author}
          </p>
        </div>

        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {book.description}
        </p>

        {/* Shelf location & ISBN */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            border: '1px solid var(--border-subtle)',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            <MapPin size={14} color="var(--color-primary)" />
            <span style={{ fontWeight: 600 }}>الموقع:</span>
            <span>{book.shelf_location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <Hash size={14} />
            <span>ISBN: {book.isbn}</span>
          </div>

          {/* Availability progress meter */}
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '3px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>النسخ المتاحة:</span>
              <span style={{ fontWeight: 700, color: isAvailable ? 'var(--status-available-text)' : 'var(--status-borrowed-text)' }}>
                {book.available_copies} من {book.total_copies}
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '5px',
                backgroundColor: 'var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${availabilityPercent}%`,
                  height: '100%',
                  backgroundColor: isAvailable ? 'var(--status-available-text)' : 'var(--status-borrowed-text)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
            onClick={() => openBookModal(book)}
          >
            <BookOpen size={14} />
            <span>عرض النسخ</span>
          </button>

          {currentRole === 'member' && (
            <button
              type="button"
              className={isAvailable ? 'btn btn-primary btn-sm' : 'btn btn-ai btn-sm'}
              style={{ flex: 1 }}
              onClick={() => reserveBook(book.id)}
            >
              <BookmarkCheck size={14} />
              <span>{isAvailable ? 'حجز مسبق' : 'انضم للطابور'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
