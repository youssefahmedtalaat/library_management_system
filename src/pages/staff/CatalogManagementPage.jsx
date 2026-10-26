import React, { useState } from 'react';
import {
  Plus,
  Search,
  MapPin,
  X,
  CheckCircle2
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';
import StatusBadge from '../../components/StatusBadge';

export default function CatalogManagementPage() {
  const { books, bookCopies, addBook, openBookModal } = useLibrary();

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New book form state
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'روايات وأدب',
    publisher: 'دار الشروق',
    publication_year: '2026',
    language: 'العربية',
    shelf_location: 'جناح التقنية - رف CS-20',
    initial_copies: 3,
    description: ''
  });

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.isbn) return;
    addBook(newBook);
    setShowAddModal(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      category: 'روايات وأدب',
      publisher: 'دار الشروق',
      publication_year: '2026',
      language: 'العربية',
      shelf_location: 'جناح التقنية - رف CS-20',
      initial_copies: 3,
      description: ''
    });
  };

  return (
    <div style={{ maxWidth: '1360px', width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 2px 0' }}>
            إدارة الفهرس والنسخ المادية
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            إضافة العناوين الببليوغرافية الجديدة، وإدارة النسخ والباركودات وحالات الصيانة ومواقع الرفوف.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>إضافة عنوان جديد للفهرس</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '14px 18px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '12px', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="بحث بالعنوان، المؤلف، أو رقم الـ ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingRight: '38px' }}
          />
        </div>
      </div>

      {/* Books & Copies Inventory Table */}
      <div className="card" style={{ padding: '20px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>الكتاب</th>
                <th>التصنيف</th>
                <th>موقع الرف</th>
                <th>إجمالي النسخ</th>
                <th>النسخ المتاحة</th>
                <th>الباركودات وحالاتها</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => {
                const copies = bookCopies.filter((c) => c.book_id === book.id);

                return (
                  <tr key={book.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          style={{ width: '40px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.92rem', display: 'block' }}>{book.title}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{book.author}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>ISBN: {book.isbn}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{book.category}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--color-primary)" />
                        {book.shelf_location}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{book.total_copies}</td>
                    <td>
                      <StatusBadge
                        status={book.available_copies > 0 ? 'available' : 'borrowed'}
                        text={`${book.available_copies} متاح`}
                        size="sm"
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '240px' }}>
                        {copies.map((copy) => (
                          <div
                            key={copy.id}
                            style={{
                              padding: '2px 6px',
                              backgroundColor: 'var(--bg-muted)',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.72rem',
                              border: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{copy.barcode}</span>
                            <StatusBadge status={copy.status} size="sm" text="" />
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openBookModal(book)}
                      >
                        عرض وإدارة
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Book Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                إضافة عنوان ببليوغرافي جديد
              </h3>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">عنوان الكتاب:</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="مثال: أسس تعلم الآلة والذكاء الاصطناعي"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">المؤلف:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="اسم المؤلف أو المترجم"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">رقم ISBN الدولي:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="978-xxx-xxx-xxx-x"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">التصنيف:</label>
                  <select
                    className="form-select"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  >
                    <option value="ذكاء اصطناعي وتكنولوجيا">ذكاء اصطناعي وتكنولوجيا</option>
                    <option value="روايات وأدب">روايات وأدب</option>
                    <option value="تاريخ وفلسفة">تاريخ وفلسفة</option>
                    <option value="غموض وبوليسي">غموض وبوليسي</option>
                    <option value="إدارة وتطوير الذات">إدارة وتطوير الذات</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">سنة النشر:</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newBook.publication_year}
                    onChange={(e) => setNewBook({ ...newBook, publication_year: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">موقع الرف الافتراضي:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newBook.shelf_location}
                    onChange={(e) => setNewBook({ ...newBook, shelf_location: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">عدد النسخ المادية المبدئية:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="form-input"
                    value={newBook.initial_copies}
                    onChange={(e) => setNewBook({ ...newBook, initial_copies: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">ملخص ومقدمة الكتاب:</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="وصف مختصر لمحتوى الكتاب..."
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  إلغاء
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} />
                  <span>حفظ وإصدار الباركودات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
