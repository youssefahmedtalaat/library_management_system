import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Send, Check, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

export default function StarRatingWidget({
  bookId,
  initialRating = 0,
  initialReview = '',
  onRatingSubmitted,
  compact = false,
  size = 'md'
}) {
  const { isAuthenticated, currentUser } = useAuth();
  const { rateBook, lang, t } = useLibrary();

  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(initialReview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(Boolean(initialReview));

  useEffect(() => {
    setRating(initialRating || 0);
    setReview(initialReview || '');
    if (initialReview) setShowReviewInput(true);
  }, [initialRating, initialReview]);

  const starLabels = {
    1: t('ratings.stars1') || (lang === 'en' ? 'Poor' : 'ضعيف جداً'),
    2: t('ratings.stars2') || (lang === 'en' ? 'Fair' : 'مقبول'),
    3: t('ratings.stars3') || (lang === 'en' ? 'Good' : 'جيد'),
    4: t('ratings.stars4') || (lang === 'en' ? 'Very Good' : 'جيد جداً'),
    5: t('ratings.stars5') || (lang === 'en' ? 'Masterpiece' : 'ممتاز / تحفة فكرية')
  };

  const starSizes = {
    sm: 18,
    md: 26,
    lg: 32
  };
  const iconSize = starSizes[size] || starSizes.md;

  const currentDisplayRating = hoverRating || rating;

  const handleStarClick = async (starVal) => {
    setRating(starVal);
    if (compact) {
      // Quick rating submission without review
      setIsSubmitting(true);
      const res = await rateBook(bookId, starVal, '');
      setIsSubmitting(false);
      if (res?.success) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 2500);
        if (onRatingSubmitted) onRatingSubmitted(res.data);
      }
    } else {
      setShowReviewInput(true);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!rating) return;

    setIsSubmitting(true);
    const res = await rateBook(bookId, rating, review.trim());
    setIsSubmitting(false);

    if (res?.success) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      if (onRatingSubmitted) onRatingSubmitted(res.data);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: compact ? '8px 12px' : '16px 20px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-muted)',
          border: '1px dashed var(--border-subtle)',
          display: 'flex',
          flexDirection: compact ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', opacity: 0.6 }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={compact ? 16 : 22} color="var(--border-strong)" />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t('ratings.loginToRate')}
          </span>
          <Link
            to="/login"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', fontSize: '0.8rem' }}
          >
            <LogIn size={13} />
            <span>{lang === 'en' ? 'Sign In' : 'تسجيل الدخول'}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Compact mode (for lists or loan tables)
  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'inline-flex', gap: '3px' }}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= currentDisplayRating;
            return (
              <button
                key={star}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                title={`${star} - ${starLabels[star]}`}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  transition: 'transform 0.15s ease',
                  color: isFilled ? '#F59E0B' : 'var(--border-strong)'
                }}
              >
                <Star
                  size={iconSize}
                  fill={isFilled ? '#F59E0B' : 'transparent'}
                  strokeWidth={isFilled ? 0 : 1.8}
                />
              </button>
            );
          })}
        </div>
        {isSuccess && (
          <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Check size={12} /> {lang === 'en' ? 'Saved' : 'تم'}
          </span>
        )}
      </div>
    );
  }

  // Full interactive widget (for Book Details Modal)
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--bg-muted)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        transition: 'all var(--transition-normal)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--color-ai-accent)" />
          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {initialRating ? t('ratings.updateRating') : t('ratings.rateThisBook')}
          </h4>
        </div>
        {rating > 0 && (
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-subtle)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {starLabels[currentDisplayRating] || `${currentDisplayRating} / 5`}
          </span>
        )}
      </div>

      {/* Interactive 5-Star Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 0'
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= currentDisplayRating;
            const isHovered = hoverRating === star;
            return (
              <button
                key={star}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} stars - ${starLabels[star]}`}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: isSubmitting ? 'wait' : 'pointer',
                  transform: isHovered ? 'scale(1.2)' : isFilled ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.18s',
                  color: isFilled ? '#F59E0B' : 'var(--text-muted)',
                  filter: isHovered ? 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.45))' : 'none'
                }}
              >
                <Star
                  size={iconSize}
                  fill={isFilled ? '#F59E0B' : 'transparent'}
                  stroke="currentColor"
                  strokeWidth={isFilled ? 0 : 1.8}
                />
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-secondary)', marginInlineStart: '6px' }}>
          {currentDisplayRating > 0 ? `${currentDisplayRating} / 5` : (lang === 'en' ? 'Select a rating' : 'اختر تقييماً')}
        </span>
      </div>

      {/* Optional Review Textarea */}
      {showReviewInput && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className="form-input"
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, 500))}
              placeholder={t('ratings.writeReviewPlaceholder')}
              maxLength={500}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '0.86rem',
                lineHeight: 1.5,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                resize: 'vertical'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                left: lang === 'ar' ? '10px' : 'auto',
                right: lang === 'en' ? '10px' : 'auto',
                fontSize: '0.72rem',
                color: 'var(--text-muted)'
              }}
            >
              {review.length}/500
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <MessageSquare size={13} />
              {currentUser?.name || (lang === 'en' ? 'Verified Member' : 'عضو معتمد')}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSuccess && (
                <span style={{ color: 'var(--status-available-text)', fontSize: '0.84rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={16} /> {t('ratings.ratingSuccess')}
                </span>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !rating}
                className="btn btn-primary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  fontWeight: 600
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span>{t('ratings.submitting')}</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>{initialRating ? t('ratings.updateRating') : t('ratings.submitBtn')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
