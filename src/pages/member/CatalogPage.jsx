import React, { useState, useMemo } from 'react';
import { Search, Sparkles, BookOpen, X } from 'lucide-react';
import BookCard from '../../components/BookCard';
import { useLibrary } from '../../context/LibraryContext';

export default function CatalogPage() {
  const { books, openAIDrawer } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // all, available, borrowed
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('rating'); // rating, year, title

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
          const matchesTitle = book.title.toLowerCase().includes(q);
          const matchesAuthor = book.author.toLowerCase().includes(q);
          const matchesIsbn = book.isbn.toLowerCase().includes(q);
          const matchesKeywords = book.match_keywords.some((k) => k.toLowerCase().includes(q));
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
        if (selectedLanguage !== 'all' && !book.language.includes(selectedLanguage)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'year') return b.publication_year - a.publication_year;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [books, searchQuery, selectedCategory, availabilityFilter, selectedLanguage, sortBy]);

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
          marginBottom: '24px',
          background: 'linear-gradient(135deg, var(--color-ai-surface) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--color-ai-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              استكشف الفهرس بواسطة الذكاء الاصطناعي
            </h2>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              صف ما ترغب في قراءته بلغتك الطبيعية (مثل: "قصة غموض مشوقة للمبتدئين" أو "مراجع الذكاء الاصطناعي") وسيقوم المساعد بشرح الترشيحات.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ai"
            onClick={() => openAIDrawer('قصة غموض قصيرة للمبتدئين')}
          >
            <Sparkles size={15} />
            <span>قصة غموض للمبتدئين</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => openAIDrawer('أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات')}
          >
            <span>كتب الذكاء الاصطناعي</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '18px 20px',
          marginBottom: '24px',
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
                right: '12px',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، اسم المؤلف، موضوع الكتاب، أو رقم الـ ISBN..."
              style={{ paddingRight: '38px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Availability filter */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              className="form-select"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">حالة التوفر (الكل)</option>
              <option value="available">متاح للإعارة فوراً</option>
              <option value="borrowed">مُعار حالياً</option>
            </select>
          </div>

          {/* Language filter */}
          <div style={{ flex: '0 1 150px' }}>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="all">اللغة (الكل)</option>
              <option value="العربية">اللغة العربية</option>
              <option value="English">English</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ flex: '0 1 170px' }}>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">الأعلى تقييماً ⭐</option>
              <option value="year">الأحدث نشراً 📅</option>
              <option value="title">أبجدياً بالاسم 🔤</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            التصنيفات:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'all' ? 'جميع التصنيفات' : cat;

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
          marginBottom: '18px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
            عناوين الفهرس المتاحة ({filteredBooks.length})
          </h2>
          {(searchQuery || selectedCategory !== 'all' || availabilityFilter !== 'all' || selectedLanguage !== 'all') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={clearFilters}
              style={{ fontSize: '0.78rem' }}
            >
              <X size={13} />
              <span>إعادة تعيين الفلاتر</span>
            </button>
          )}
        </div>
        <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          عرض بطاقات النسخ مع مواقع الرفوف
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
            لم نعثر على كتب مطابقة لمعايير البحث
          </h3>
          <p style={{ maxWidth: '420px', margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            جرّب تغيير كلمات البحث، أو إلغاء تحديد فلاتر التوفر، أو اسأل أمين المكتبة الذكي للحصول على اقتراحات بديلة.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              مسح عوامل التصفية
            </button>
            <button type="button" className="btn btn-ai" onClick={() => openAIDrawer(searchQuery)}>
              <Sparkles size={16} />
              <span>البحث بواسطة المساعد الذكي</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
