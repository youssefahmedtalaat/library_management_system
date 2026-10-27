import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, X, ChevronDown } from 'lucide-react';
import BookCard from '../../components/BookCard';
import { useLibrary } from '../../context/LibraryContext';
import { getCategoryLabel } from '../../data/translations';

export default function CatalogPage() {
  const { books, openAIDrawer, lang, t } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, borrowed
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // rating, year, title

  const isRTL = lang === 'ar';

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category));
    return ['all', ...Array.from(set)];
  }, [books]);

  // Filtered and sorted books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle =
            (book.title && book.title.toLowerCase().includes(q)) ||
            (book.title_en && book.title_en.toLowerCase().includes(q)) ||
            (book.title_ar && book.title_ar.toLowerCase().includes(q));
          const matchesAuthor =
            (book.author && book.author.toLowerCase().includes(q)) ||
            (book.author_en && book.author_en.toLowerCase().includes(q)) ||
            (book.author_ar && book.author_ar.toLowerCase().includes(q));
          const matchesIsbn = book.isbn && book.isbn.toLowerCase().includes(q);
          const matchesKeywords = book.match_keywords && book.match_keywords.some((k) => k.toLowerCase().includes(q));
          if (!matchesTitle && !matchesAuthor && !matchesIsbn && !matchesKeywords) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all' && book.category !== selectedCategory) {
          return false;
        }

        // Availability filter
        if (availabilityFilter === 'available' && book.available_copies === 0) {
          return false;
        }
        if (availabilityFilter === 'borrowed' && book.available_copies > 0) {
          return false;
        }

        // Language filter
        if (selectedLanguage !== 'all') {
          if (selectedLanguage === 'العربية' || selectedLanguage === 'ar') {
            if (!book.language?.includes('العربية') && !book.language_ar?.includes('العربية')) return false;
          } else if (selectedLanguage === 'English' || selectedLanguage === 'en') {
            if (!book.language?.includes('English') && !book.language_en?.includes('English')) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.publication_year - a.publication_year;
        if (sortBy === 'title') {
          const titleA = lang === 'en' ? (a.title_en || a.title) : (a.title_ar || a.title);
          const titleB = lang === 'en' ? (b.title_en || b.title) : (b.title_ar || b.title);
          return titleA.localeCompare(titleB);
        }
        return 0;
      });
  }, [books, searchQuery, selectedCategory, availabilityFilter, selectedLanguage, sortBy, lang]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setSelectedLanguage('all');
    setSortBy('rating');
  };

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* AI Discovery Banner */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, var(--color-ai-surface) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--color-ai-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 450px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-ai-accent)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-ai-accent)', margin: '0 0 4px 0' }}>
              {t('catalog.aiBannerTitle')}
            </h2>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              {t('catalog.aiBannerDesc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ai"
            onClick={() => openAIDrawer(lang === 'en' ? 'Short mystery stories for beginners' : 'قصة غموض قصيرة للمبتدئين')}
          >
            <Sparkles size={15} />
            <span>{t('catalog.promptMystery')}</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => openAIDrawer(lang === 'en' ? 'Top AI & software engineering references' : 'أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات')}
          >
            <span>{t('catalog.promptAI')}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '18px 20px',
          marginBottom: '20px',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Main search input */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: isRTL ? '12px' : 'auto',
                left: isRTL ? 'auto' : '12px',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('catalog.searchPlaceholder')}
              style={{
                paddingRight: isRTL ? '38px' : '14px',
                paddingLeft: isRTL ? '14px' : '38px'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: isRTL ? 'auto' : '12px',
                  left: isRTL ? '12px' : 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                title={t('topbar.clearSearch')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Availability filter */}
          <div style={{ flex: '0 1 180px', minWidth: '160px' }}>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="all">{t('catalog.filterAvailabilityAll')}</option>
                <option value="available">{t('catalog.filterAvailableNow')}</option>
                <option value="borrowed">{t('catalog.filterBorrowedNow')}</option>
              </select>
              <ChevronDown size={15} className="select-arrow" />
            </div>
          </div>

          {/* Language filter */}
          <div style={{ flex: '0 1 150px', minWidth: '140px' }}>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="all">{t('catalog.filterLangAll')}</option>
                <option value="العربية">{t('catalog.filterLangAr')}</option>
                <option value="English">{t('catalog.filterLangEn')}</option>
              </select>
              <ChevronDown size={15} className="select-arrow" />
            </div>
          </div>

          {/* Sort By */}
          <div style={{ flex: '0 1 180px', minWidth: '170px' }}>
            <div className="select-wrapper">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">{t('catalog.sortRating')}</option>
                <option value="year">{t('catalog.sortYear')}</option>
                <option value="title">{t('catalog.sortTitle')}</option>
              </select>
              <ChevronDown size={15} className="select-arrow" />
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            {t('catalog.categoriesLabel')}
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = getCategoryLabel(cat, lang);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-muted)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Results Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
            {t('catalog.availableCount', { n: filteredBooks.length })}
          </h2>
          {(searchQuery || selectedCategory !== 'all' || availabilityFilter !== 'all' || selectedLanguage !== 'all') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={clearFilters}
              style={{ fontSize: '0.78rem' }}
            >
              <X size={13} />
              <span>{t('catalog.resetFilters')}</span>
            </button>
          )}
        </div>
        <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          {t('catalog.shelfLocationsNote')}
        </span>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className="card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <BookOpen size={32} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            {t('catalog.noBooksFound')}
          </h3>
          <p style={{ maxWidth: '420px', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {t('catalog.noBooksFoundDesc')}
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              {t('catalog.clearFilters')}
            </button>
            <button
              type="button"
              className="btn btn-ai"
              onClick={() => openAIDrawer(searchQuery || (lang === 'en' ? 'Show top rated books' : 'أفضل الكتب تقييماً'))}
            >
              <Sparkles size={16} />
              <span>{t('catalog.searchWithAI')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
