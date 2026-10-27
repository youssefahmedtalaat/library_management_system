import { query, withTransaction } from '../../config/db.js';
import { recordAuditLog } from '../../middlewares/audit.js';

export async function listBooks({ q, category, availability, page = 1, limit = 12 }) {
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
  const conditions = ["b.status = 'active'"];
  const params = [];

  if (q && q.trim()) {
    const term = `%${q.trim()}%`;
    conditions.push('(b.title LIKE ? OR b.isbn LIKE ? OR a.name LIKE ? OR b.description LIKE ?)');
    params.push(term, term, term, term);
  }

  if (category && category !== 'all') {
    conditions.push('(c.name = ? OR c.id = ?)');
    params.push(category, category);
  }

  const whereClause = conditions.join(' AND ');

  // Query books with aggregated authors, categories, total copies, and available copies
  const sql = `
    SELECT
      b.id, b.isbn, b.title, b.publication_year, b.language,
      b.description, b.cover_url, b.rating, COALESCE(b.ratings_count, 0) AS ratings_count, b.status,
      GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS author_name,
      GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_name,
      COALESCE(copies_agg.total_copies, 0) AS total_copies,
      COALESCE(copies_agg.available_copies, 0) AS available_copies,
      COALESCE(copies_agg.shelf_location, 'General Stacks') AS shelf_location
    FROM books b
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
    LEFT JOIN (
      SELECT
        book_id,
        COUNT(id) AS total_copies,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_copies,
        MIN(shelf_location) AS shelf_location
      FROM book_copies
      GROUP BY book_id
    ) copies_agg ON b.id = copies_agg.book_id
    WHERE ${whereClause}
    GROUP BY b.id
    ${availability === 'available' ? 'HAVING available_copies > 0' : availability === 'borrowed' ? 'HAVING available_copies = 0' : ''}
    ORDER BY b.id ASC
    LIMIT ? OFFSET ?
  `;

  const countSql = `
    SELECT COUNT(DISTINCT b.id) AS total
    FROM books b
    LEFT JOIN book_authors ba ON b.id = ba.book_id
    LEFT JOIN authors a ON ba.author_id = a.id
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
    LEFT JOIN (
      SELECT
        book_id,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available_copies
      FROM book_copies
      GROUP BY book_id
    ) copies_agg ON b.id = copies_agg.book_id
    WHERE ${whereClause}
    ${availability === 'available' ? 'AND COALESCE(copies_agg.available_copies, 0) > 0' : availability === 'borrowed' ? 'AND COALESCE(copies_agg.available_copies, 0) = 0' : ''}
  `;

  const rows = await query(sql, [...params, parseInt(limit, 10), offset]);
  const countResult = await query(countSql, params);
  const total = countResult[0]?.total || 0;

  return {
    books: rows.map(r => ({
      ...r,
      total_copies: Number(r.total_copies),
      available_copies: Number(r.available_copies),
      rating: Number(r.rating),
      ratings_count: Number(r.ratings_count || 0)
    })),
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getBookById(id) {
  const books = await query(
    `SELECT
      b.id, b.isbn, b.title, b.publication_year, b.language,
      b.description, b.cover_url, b.rating, COALESCE(b.ratings_count, 0) AS ratings_count, b.status,
      GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS author_name,
      GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_name
     FROM books b
     LEFT JOIN book_authors ba ON b.id = ba.book_id
     LEFT JOIN authors a ON ba.author_id = a.id
     LEFT JOIN book_categories bc ON b.id = bc.book_id
     LEFT JOIN categories c ON bc.category_id = c.id
     WHERE b.id = ?
     GROUP BY b.id`,
    [id]
  );

  if (books.length === 0) {
    const error = new Error('Book not found');
    error.status = 404;
    error.code = 'BOOK_NOT_FOUND';
    throw error;
  }

  const book = books[0];

  const copies = await query(
    `SELECT id, barcode, status, shelf_location, condition_note
     FROM book_copies
     WHERE book_id = ?
     ORDER BY barcode ASC`,
    [id]
  );

  const availableCopies = copies.filter(c => c.status === 'available').length;

  return {
    ...book,
    rating: Number(book.rating),
    ratings_count: Number(book.ratings_count || 0),
    total_copies: copies.length,
    available_copies: availableCopies,
    shelf_location: copies[0]?.shelf_location || 'General Stacks',
    copies
  };
}

export async function createBook(bookData, actorUserId) {
  const {
    isbn, title, author, category, publication_year,
    language, description, cover_url, shelf_location, copies_count = 1
  } = bookData;

  return await withTransaction(async (conn) => {
    // 1. Insert or find Author
    let authorId;
    const [existingAuthor] = await conn.query('SELECT id FROM authors WHERE name = ?', [author.trim()]);
    if (existingAuthor.length > 0) {
      authorId = existingAuthor[0].id;
    } else {
      const [newAuthor] = await conn.query('INSERT INTO authors (name) VALUES (?)', [author.trim()]);
      authorId = newAuthor.insertId;
    }

    // 2. Insert or find Category
    let categoryId;
    const [existingCat] = await conn.query('SELECT id FROM categories WHERE name = ?', [category.trim()]);
    if (existingCat.length > 0) {
      categoryId = existingCat[0].id;
    } else {
      const [newCat] = await conn.query('INSERT INTO categories (name) VALUES (?)', [category.trim()]);
      categoryId = newCat.insertId;
    }

    // 3. Insert Book
    const [bookResult] = await conn.query(
      `INSERT INTO books (isbn, title, publication_year, language, description, cover_url, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [
        isbn.trim(),
        title.trim(),
        publication_year || new Date().getFullYear(),
        language || 'العربية',
        description || '',
        cover_url || '/images/books/generic.jpg'
      ]
    );

    const bookId = bookResult.insertId;

    // 4. Link book_authors and book_categories
    await conn.query('INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)', [bookId, authorId]);
    await conn.query('INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)', [bookId, categoryId]);

    // 5. Generate Physical Copies with unique barcodes
    const numCopies = Math.max(1, parseInt(copies_count, 10));
    for (let i = 1; i <= numCopies; i++) {
      const barcode = `BC-${bookId}-${String(i).padStart(2, '0')}`;
      await conn.query(
        `INSERT INTO book_copies (book_id, barcode, status, shelf_location)
         VALUES (?, ?, 'available', ?)`,
        [bookId, barcode, shelf_location || 'General Stacks']
      );
    }

    await recordAuditLog(actorUserId, 'إضافة كتاب جديد', 'Book', bookId, { title, isbn, copies: numCopies });

    return { id: bookId, title, isbn, copies_count: numCopies };
  });
}

export async function updateBook(id, updateData, actorUserId) {
  const { title, publication_year, language, description, cover_url } = updateData;

  await query(
    `UPDATE books
     SET title = COALESCE(?, title),
         publication_year = COALESCE(?, publication_year),
         language = COALESCE(?, language),
         description = COALESCE(?, description),
         cover_url = COALESCE(?, cover_url)
     WHERE id = ?`,
    [title, publication_year, language, description, cover_url, id]
  );

  await recordAuditLog(actorUserId, 'تحديث بيانات كتاب', 'Book', id, updateData);
  return getBookById(id);
}

export async function archiveBook(id, actorUserId) {
  // Soft delete as specified in PDF
  await query("UPDATE books SET status = 'archived' WHERE id = ?", [id]);
  await recordAuditLog(actorUserId, 'أرشفة كتاب (تعطيل)', 'Book', id);
  return { id, archived: true };
}

export async function getAllCategories() {
  return await query('SELECT id, name, description FROM categories ORDER BY name ASC');
}

export async function getAllAuthors() {
  return await query('SELECT id, name FROM authors ORDER BY name ASC');
}

/**
 * Submit or update a rating and review for a book
 */
export async function rateBook(bookId, userId, ratingVal, reviewText, actorName = 'User') {
  const rating = parseInt(ratingVal, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    const err = new Error('Rating must be an integer between 1 and 5');
    err.status = 400;
    err.code = 'INVALID_RATING';
    throw err;
  }

  return await withTransaction(async (conn) => {
    // 1. Verify book exists
    const [books] = await conn.query('SELECT id, title FROM books WHERE id = ? FOR UPDATE', [bookId]);
    if (books.length === 0) {
      const err = new Error('Book not found');
      err.status = 404;
      err.code = 'BOOK_NOT_FOUND';
      throw err;
    }

    const cleanReview = reviewText && reviewText.trim() ? reviewText.trim() : null;

    // 2. UPSERT rating
    await conn.query(
      `INSERT INTO book_ratings (book_id, user_id, rating, review, updated_at)
       VALUES (?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), review = VALUES(review), updated_at = NOW()`,
      [bookId, userId, rating, cleanReview]
    );

    // 3. Recalculate average rating & total count
    const [aggResult] = await conn.query(
      `SELECT ROUND(AVG(rating), 2) AS avg_rating, COUNT(id) AS total_count
       FROM book_ratings
       WHERE book_id = ?`,
      [bookId]
    );

    const newAvg = parseFloat(aggResult[0]?.avg_rating || rating);
    const newCount = parseInt(aggResult[0]?.total_count || 1, 10);

    // 4. Update cached rating on books table
    await conn.query(
      'UPDATE books SET rating = ?, ratings_count = ? WHERE id = ?',
      [newAvg, newCount, bookId]
    );

    // 5. Log audit
    await recordAuditLog(userId, 'تقييم كتاب', 'Book', bookId, {
      rating,
      book_title: books[0].title,
      actor_name: actorName
    });

    return {
      bookId: parseInt(bookId, 10),
      averageRating: newAvg,
      ratingsCount: newCount,
      userRating: rating,
      review: cleanReview
    };
  });
}

/**
 * Get aggregate breakdown and recent reviews for a book
 */
export async function getBookRatings(bookId, currentUserId = null) {
  const reviews = await query(
    `SELECT r.id, r.rating, r.review, r.created_at, r.updated_at,
            u.id AS user_id, u.full_name AS user_name, u.role AS user_role
     FROM book_ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.book_id = ?
     ORDER BY r.updated_at DESC
     LIMIT 25`,
    [bookId]
  );

  const [agg] = await query(
    `SELECT
       COUNT(id) AS total_ratings,
       ROUND(AVG(rating), 2) AS average_rating,
       SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS count_5,
       SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS count_4,
       SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS count_3,
       SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS count_2,
       SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS count_1
     FROM book_ratings
     WHERE book_id = ?`,
    [bookId]
  );

  let myRating = null;
  if (currentUserId) {
    const userRatingRow = reviews.find(r => r.user_id === currentUserId);
    if (userRatingRow) {
      myRating = {
        rating: userRatingRow.rating,
        review: userRatingRow.review,
        updatedAt: userRatingRow.updated_at
      };
    }
  }

  return {
    bookId: parseInt(bookId, 10),
    averageRating: parseFloat(agg?.average_rating || 0),
    totalRatings: parseInt(agg?.total_ratings || 0, 10),
    distribution: {
      5: parseInt(agg?.count_5 || 0, 10),
      4: parseInt(agg?.count_4 || 0, 10),
      3: parseInt(agg?.count_3 || 0, 10),
      2: parseInt(agg?.count_2 || 0, 10),
      1: parseInt(agg?.count_1 || 0, 10)
    },
    myRating,
    reviews
  };
}
