-- ============================================================================
-- Smart Library Management System (LMS) - MySQL Database Schema
-- Fully compliant with proposed specification (26 October 2026)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS library_lms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE library_lms_db;

-- 1. Users table (Identities for members, librarians, and admins)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('member', 'librarian', 'admin') NOT NULL DEFAULT 'member',
  status ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Members profile table (Member details, borrow eligibility, code)
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  member_code VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(50) NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  membership_status ENUM('active', 'expired', 'suspended') NOT NULL DEFAULT 'active',
  max_allowed_loans INT NOT NULL DEFAULT 5,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_members_code (member_code),
  INDEX idx_members_status (membership_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Books bibliographic master records
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(30) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  publisher_id INT NULL,
  publication_year INT NULL,
  language VARCHAR(30) NOT NULL DEFAULT 'English',
  description TEXT NULL,
  cover_url TEXT NULL,
  pages INT NULL,
  edition VARCHAR(50) NULL,
  rating DECIMAL(3,2) DEFAULT 4.50,
  status ENUM('active', 'archived') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_books_isbn (isbn),
  INDEX idx_books_title (title),
  INDEX idx_books_lang (language),
  INDEX idx_books_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Authors table
CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  bio TEXT NULL,
  INDEX idx_authors_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Book Authors (many-to-many relationship)
CREATE TABLE IF NOT EXISTS book_authors (
  book_id INT NOT NULL,
  author_id INT NOT NULL,
  PRIMARY KEY (book_id, author_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
  INDEX idx_ba_author (author_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Book Categories (many-to-many relationship)
CREATE TABLE IF NOT EXISTS book_categories (
  book_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (book_id, category_id),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_bc_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Book Copies (Physical trackable instances with barcodes)
CREATE TABLE IF NOT EXISTS book_copies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  barcode VARCHAR(64) NOT NULL UNIQUE,
  status ENUM('available', 'borrowed', 'reserved', 'maintenance') NOT NULL DEFAULT 'available',
  shelf_location VARCHAR(100) NOT NULL DEFAULT 'General Stacks',
  condition_note VARCHAR(150) NULL DEFAULT 'Good',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
  INDEX idx_copies_barcode (barcode),
  INDEX idx_copies_book (book_id),
  INDEX idx_copies_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Loans (Active and past circulation history)
-- Ensures only one active loan per physical copy at any time
CREATE TABLE IF NOT EXISTS loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  copy_id INT NOT NULL,
  member_id INT NOT NULL,
  issued_by INT NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_at TIMESTAMP NOT NULL,
  returned_at TIMESTAMP NULL,
  renewal_count INT NOT NULL DEFAULT 0,
  status ENUM('active', 'returned', 'overdue') NOT NULL DEFAULT 'active',
  FOREIGN KEY (copy_id) REFERENCES book_copies(id) ON DELETE RESTRICT,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE RESTRICT,
  FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_loans_copy (copy_id),
  INDEX idx_loans_member_status (member_id, status),
  INDEX idx_loans_due (due_at),
  INDEX idx_loans_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Reservations queue on title level
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  member_id INT NOT NULL,
  queue_position INT NOT NULL DEFAULT 1,
  status ENUM('pending', 'fulfilled', 'cancelled', 'expired') NOT NULL DEFAULT 'pending',
  placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_res_book_queue (book_id, queue_position),
  INDEX idx_res_member (member_id),
  INDEX idx_res_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Fines on overdue loans or damages
CREATE TABLE IF NOT EXISTS fines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loan_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'EGP',
  status ENUM('unpaid', 'paid', 'waived') NOT NULL DEFAULT 'unpaid',
  assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settled_at TIMESTAMP NULL,
  settled_by INT NULL,
  FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE RESTRICT,
  FOREIGN KEY (settled_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_fines_loan (loan_id),
  INDEX idx_fines_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Audit Logs (Immutable regulatory audit log of sensitive staff/admin actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  actor_user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  details JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_actor_created (actor_user_id, created_at),
  INDEX idx_audit_action (action),
  INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. AI Usage Events (Monitors AI latency, model, tokens, without logging personal queries)
CREATE TABLE IF NOT EXISTS ai_usage_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  request_id VARCHAR(100) NOT NULL,
  outcome ENUM('success', 'fallback', 'error') NOT NULL DEFAULT 'success',
  model VARCHAR(100) NOT NULL,
  latency_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ai_user (user_id),
  INDEX idx_ai_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. System Circulation Policies (configurable by admin)
CREATE TABLE IF NOT EXISTS policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  policy_key VARCHAR(100) NOT NULL UNIQUE,
  policy_value VARCHAR(255) NOT NULL,
  description VARCHAR(255) NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
