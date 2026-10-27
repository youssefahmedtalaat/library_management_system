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
    <div className="catalog-container">
      {/* AI Discovery Banner */}
      <div className="card catalog-ai-banner">
        <div className="catalog-ai-content">
          <div className="catalog-ai-icon">
            <Sparkles size={24} />
          </div>
          <div className="catalog-ai-text">
            <h2 className="catalog-ai-title">
              {t('catalog.aiBannerTitle')}
            </h2>
            <p className="catalog-ai-desc">
              {t('catalog.aiBannerDesc')}
            </p>
          </div>
        </div>

        <div className="catalog-ai-actions">
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
      <div className="card catalog-filter-card">
        <div className="catalog-filter-row">
          {/* Main search input */}
          <div className="catalog-search-box">
            <Search
              size={18}
              className="catalog-search-icon"
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
              className="form-input catalog-search-input"
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
                className="catalog-search-clear-btn"
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

          {/* Select filters group */}
          <div className="catalog-filters-group">
            {/* Availability filter */}
            <div className="catalog-filter-item">
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
            <div className="catalog-filter-item">
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
            <div className="catalog-filter-item">
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
        </div>

        {/* Category Filter Chips */}
        <div className="catalog-categories-bar">
          <span className="catalog-categories-label">
            {t('catalog.categoriesLabel')}
          </span>
          <div className="catalog-categories-list">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const label = getCategoryLabel(cat, lang);

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`catalog-category-chip ${isSelected ? 'active' : ''}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Catalog Results Header */}
      <div className="catalog-results-header">
        <div className="catalog-results-title-group">
          <h2 className="catalog-results-title">
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
        <span className="catalog-results-note">
          {t('catalog.shelfLocationsNote')}
        </span>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="catalog-books-grid">
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
