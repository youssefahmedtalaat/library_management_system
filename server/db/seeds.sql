USE library_lms_db;

-- 1. Circulation & System Policies
INSERT INTO policies (policy_key, policy_value, description) VALUES
  ('max_borrow_limit', '3', 'Maximum books a member can borrow at once'),
  ('default_loan_days', '14', 'Standard loan duration in days'),
  ('max_renewals', '2', 'Maximum allowable renewals per loan'),
  ('fine_per_day', '5.00', 'Daily fine rate in Egyptian Pounds (EGP) for overdue items'),
  ('reservation_expiry_hours', '48', 'Hours reserved item is held once made available'),
  ('allow_self_renewal', 'true', 'Allow members to renew loans online'),
  ('enable_ai_librarian', 'true', 'Enable AI Discovery Assistant')
ON DUPLICATE KEY UPDATE policy_value = VALUES(policy_value);

-- 2. Initial Users (passwords hashed with bcrypt)
-- admin123, librarian123, member123
INSERT INTO users (id, full_name, email, password_hash, role, status) VALUES
  (1, 'د. هشام القاسمي', 'admin@library.sa', '$2a$10$81piwWmFU3sOX8bcB/6Aj.FuX4Wlw7tVT8ST84RTLbl5B5rAA1c9e', 'admin', 'active'),
  (2, 'سليمان العبدلي', 'sulaiman@library.sa', '$2a$10$.17Yf2jLeyoDIIfCGKUEYeUDiy1uzZQbdsL9.dfdec16BN/KbnZly', 'librarian', 'active'),
  (3, 'مها الشريف', 'maha@library.sa', '$2a$10$.17Yf2jLeyoDIIfCGKUEYeUDiy1uzZQbdsL9.dfdec16BN/KbnZly', 'librarian', 'active'),
  (4, 'أحمد محمود التميمي', 'ahmed@library.sa', '$2a$10$GIYWcN/sz1.RtlKp3bb5K.Tm6EPYRIdmDHFuIhVmUNe4iGf9gBSOy', 'member', 'active'),
  (5, 'سارة خالد المنصور', 'sara@library.sa', '$2a$10$GIYWcN/sz1.RtlKp3bb5K.Tm6EPYRIdmDHFuIhVmUNe4iGf9gBSOy', 'member', 'active'),
  (6, 'عمر ياسين الكردي', 'omar@library.sa', '$2a$10$GIYWcN/sz1.RtlKp3bb5K.Tm6EPYRIdmDHFuIhVmUNe4iGf9gBSOy', 'member', 'active'),
  (7, 'فاطمة ناصر الزهراني', 'fatimah@library.sa', '$2a$10$GIYWcN/sz1.RtlKp3bb5K.Tm6EPYRIdmDHFuIhVmUNe4iGf9gBSOy', 'member', 'suspended')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- 3. Member Profiles
INSERT INTO members (id, user_id, member_code, phone, membership_status, max_allowed_loans) VALUES
  (1, 4, 'MEM-2026-0042', '+966 50 123 4567', 'active', 3),
  (2, 5, 'MEM-2026-0089', '+966 55 987 6543', 'active', 3),
  (3, 6, 'MEM-2026-0115', '+966 54 321 0000', 'active', 3),
  (4, 7, 'MEM-2026-0158', '+966 56 444 3322', 'suspended', 3)
ON DUPLICATE KEY UPDATE member_code = VALUES(member_code);

-- 4. Categories
INSERT INTO categories (id, name, description) VALUES
  (1, 'تاريخ وفلسفة', 'كتب التاريخ، الفلسفة، وحركات النهضة والعمران'),
  (2, 'ذكاء اصطناعي وتكنولوجيا', 'علوم الحاسب، النظم الموزعة، وهندسة البرمجيات'),
  (3, 'روايات وأدب', 'الأدب العربي والعالمي والروايات الخالدة'),
  (4, 'غموض وبوليسي', 'روايات التحقيق والجرائم والذكاء الاستنتاجي'),
  (5, 'إدارة وتطوير الذات', 'الإنتاجية، العادات الإيجابية، وعلم النفس العملي')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 5. Authors
INSERT INTO authors (id, name) VALUES
  (1, 'عبد الرحمن بن خلدون'),
  (2, 'ستيوارت راسل وبيتر نورفيغ'),
  (3, 'رضوى عاشور'),
  (4, 'روبرت مارتن (Uncle Bob)'),
  (5, 'غاستون ليرو'),
  (6, 'جيمس كلير'),
  (7, 'غسان كنفاني'),
  (8, 'مارتن كليبمان')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 6. Books
INSERT INTO books (id, isbn, title, publication_year, language, description, cover_url, rating, status) VALUES
  (1, '978-977-09-1234-5', 'مقدمة ابن خلدون: ديوان المبتدأ والخبر', 2021, 'العربية', 'المصنف التأسيسي في علم الاجتماع وفلسفة التاريخ والعمران البشري، يتناول طبائع العمران والدول وأسباب صعود وسقوط الحضارات.', '/images/books/muqaddimah.jpg', 4.90, 'active'),
  (2, '978-013-468-599-1', 'الذكاء الاصطناعي: مقاربة حديثة', 2023, 'العربية / الإنجليزية', 'المرجع الجامعي الأوسع انتشاراً عالمياً لتدريس الذكاء الاصطناعي، يغطي الوكلاء الأذكياء، وتعلم الآلة، والشبكات العصبية، ومعالجة اللغات الطبيعية.', '/images/books/ai-approach.jpg', 4.80, 'active'),
  (3, '978-977-14-5542-1', 'ثلاثية غرناطة', 2019, 'العربية', 'رواية ملحمية تتتبع سيرة أجيال عائلة أندلسية في غرناطة بعد سقوط الحكم الإسلامي، وتوثق صراع الهوية والذاكرة والحرية.', '/images/books/granada.jpg', 4.90, 'active'),
  (4, '978-013-235-088-4', 'الكود النظيف: دليل الصنعة البرمجية الرشيقة', 2022, 'English', 'دليل جوهري للمهندسين والمطورين لكتابة شيفرات برمجية واضحة، قابلة للاختبار والصيانة، مع تدريبات عملية في إعادة البناء وهندسة البرمجيات.', '/images/books/clean-code.jpg', 4.70, 'active'),
  (5, '978-977-09-8877-3', 'لغز الغرفة الصفراء', 2020, 'العربية', 'واحدة من أشهر قصص الغموض الكلاسيكية في تاريخ الأدب؛ جريمة تحدث داخل غرفة مغلقة بإحكام من الداخل، مثالية لمحبي الاستنتاج والغموض للمبتدئين.', '/images/books/yellow-room.jpg', 4.60, 'active'),
  (6, '978-995-389-102-4', 'العادات الذرية: تغييرات صغيرة لنتائج مبهرة', 2022, 'العربية', 'إطار عملي علمي يعلمك كيف تكتسب عادات جيدة وتتخلص من السيئة عبر تحسينات صغيرة بنسبة 1% تتراكم لتحدث تحولاً كبيراً.', '/images/books/atomic-habits.png', 4.90, 'active'),
  (7, '978-977-09-9941-2', 'رجال في الشمس', 2018, 'العربية', 'رواية قصيرة مكثفة تسرد رحلة ثلاثة رجال فلسطينيين يبحثون عن الأمل والعمل، وتعد نموذجاً فريداً للرمزية الأدبية والعمق الإنساني.', '/images/books/men-in-the-sun.jpg', 4.80, 'active'),
  (8, '978-149-204-113-9', 'تصميم التطبيقات كثيفة البيانات', 2021, 'English', 'الدليل المرجعي الشامل لمعمارية نظم البيانات، محركات التخزين، التوافق الموزع، والموثوقية في النظم السحابية وقواعد البيانات الحديثة.', '/images/books/data-intensive.jpg', 4.95, 'active')
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Book Authors
INSERT INTO book_authors (book_id, author_id) VALUES
  (1, 1), (2, 2), (3, 3), (4, 4), (5, 5), (6, 6), (7, 7), (8, 8)
ON DUPLICATE KEY UPDATE author_id = VALUES(author_id);

-- Book Categories
INSERT INTO book_categories (book_id, category_id) VALUES
  (1, 1), (2, 2), (3, 3), (4, 2), (5, 4), (6, 5), (7, 3), (8, 2)
ON DUPLICATE KEY UPDATE category_id = VALUES(category_id);

-- 7. Physical Book Copies
INSERT INTO book_copies (id, book_id, barcode, status, shelf_location) VALUES
  -- Book 1 (Ibn Khaldun)
  (101, 1, 'BC-101-01', 'available', 'جناح التاريخ - رف H-04'),
  (102, 1, 'BC-101-02', 'available', 'جناح التاريخ - رف H-04'),
  (103, 1, 'BC-101-03', 'borrowed',  'جناح التاريخ - رف H-04'),
  (104, 1, 'BC-101-04', 'reserved',  'مكتب الحجوزات'),
  -- Book 2 (AI Approach)
  (201, 2, 'BC-202-01', 'available', 'جناح التقنية - رف CS-12'),
  (202, 2, 'BC-202-02', 'available', 'جناح التقنية - رف CS-12'),
  (203, 2, 'BC-202-03', 'available', 'جناح التقنية - رف CS-12'),
  (204, 2, 'BC-202-04', 'borrowed',  'جناح التقنية - رف CS-12'),
  (205, 2, 'BC-202-05', 'borrowed',  'جناح التقنية - رف CS-12'),
  -- Book 3 (Granada)
  (301, 3, 'BC-303-01', 'borrowed',  'جناح الروايات - رف NOV-07'),
  (302, 3, 'BC-303-02', 'borrowed',  'جناح الروايات - رف NOV-07'),
  (303, 3, 'BC-303-03', 'reserved',  'مكتب الحجوزات'),
  -- Book 4 (Clean Code)
  (401, 4, 'BC-404-01', 'available', 'جناح التقنية - رف CS-05'),
  (402, 4, 'BC-404-02', 'borrowed',  'جناح التقنية - رف CS-05'),
  (403, 4, 'BC-404-03', 'borrowed',  'جناح التقنية - رف CS-05'),
  (404, 4, 'BC-404-04', 'maintenance', 'ورشة التجليد والصيانة'),
  -- Book 5 (Yellow Room)
  (501, 5, 'BC-505-01', 'available', 'جناح الغموض - رف MYS-02'),
  (502, 5, 'BC-505-02', 'available', 'جناح الغموض - رف MYS-02'),
  (503, 5, 'BC-505-03', 'borrowed',  'جناح الغموض - رف MYS-02'),
  -- Book 6 (Atomic Habits)
  (601, 6, 'BC-606-01', 'available', 'جناح تطوير الذات - رف DEV-11'),
  (602, 6, 'BC-606-02', 'available', 'جناح تطوير الذات - رف DEV-11'),
  (603, 6, 'BC-606-03', 'available', 'جناح تطوير الذات - رف DEV-11'),
  (604, 6, 'BC-606-04', 'available', 'جناح تطوير الذات - رف DEV-11'),
  (605, 6, 'BC-606-05', 'borrowed',  'جناح تطوير الذات - رف DEV-11'),
  (606, 6, 'BC-606-06', 'borrowed',  'جناح تطوير الذات - رف DEV-11'),
  -- Book 7 (Men in Sun)
  (701, 7, 'BC-707-01', 'available', 'جناح الروايات - رف NOV-03'),
  (702, 7, 'BC-707-02', 'available', 'جناح الروايات - رف NOV-03'),
  (703, 7, 'BC-707-03', 'available', 'جناح الروايات - رف NOV-03'),
  (704, 7, 'BC-707-04', 'borrowed',  'جناح الروايات - رف NOV-03'),
  -- Book 8 (Data-Intensive)
  (801, 8, 'BC-808-01', 'available', 'جناح التقنية - رف CS-18'),
  (802, 8, 'BC-808-02', 'borrowed',  'جناح التقنية - رف CS-18'),
  (803, 8, 'BC-808-03', 'borrowed',  'جناح التقنية - رف CS-18')
ON DUPLICATE KEY UPDATE barcode = VALUES(barcode);

-- 8. Loans
INSERT INTO loans (id, copy_id, member_id, issued_by, issued_at, due_at, renewal_count, status) VALUES
  (1, 103, 1, 2, '2026-10-18 10:00:00', '2026-11-01 10:00:00', 0, 'active'),
  (2, 402, 1, 2, '2026-10-07 11:30:00', '2026-11-04 11:30:00', 1, 'active'),
  (3, 301, 2, 2, '2026-10-07 14:00:00', '2026-10-21 14:00:00', 0, 'overdue'),
  (4, 204, 3, 2, '2026-10-20 16:15:00', '2026-11-03 16:15:00', 0, 'active'),
  (5, 803, 4, 2, '2026-10-01 09:00:00', '2026-10-15 09:00:00', 0, 'overdue')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 9. Reservations
INSERT INTO reservations (id, book_id, member_id, queue_position, status, placed_at, expires_at) VALUES
  (1, 3, 1, 1, 'pending', '2026-10-24 16:00:00', '2026-11-07 16:00:00'),
  (2, 1, 2, 1, 'pending', '2026-10-25 11:30:00', '2026-11-08 11:30:00')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- 10. Fines
INSERT INTO fines (id, loan_id, amount, currency, status, assessed_at) VALUES
  (1, 3, 15.00, 'EGP', 'unpaid', '2026-10-24 00:00:00'),
  (2, 5, 45.00, 'EGP', 'unpaid', '2026-10-10 00:00:00')
ON DUPLICATE KEY UPDATE amount = VALUES(amount);

-- 11. Audit Logs
INSERT INTO audit_logs (id, actor_user_id, action, entity_type, entity_id, details, created_at) VALUES
  (1, 2, 'إصدار إعارة', 'Loan', '1', '{"barcode": "BC-101-03", "member_code": "MEM-2026-0042"}', '2026-10-18 10:00:00'),
  (2, 2, 'تجديد إعارة', 'Loan', '2', '{"renewal_count": 1, "new_due_at": "2026-11-04"}', '2026-10-21 11:30:00'),
  (3, 1, 'تحديث سياسات التداول', 'Policy', 'max_borrow_limit', '{"old": 5, "new": 3}', '2026-10-22 11:00:00')
ON DUPLICATE KEY UPDATE action = VALUES(action);

-- 12. Initial Book Ratings & Reviews
INSERT INTO book_ratings (book_id, user_id, rating, review, created_at) VALUES
  (1, 4, 5, 'مرجع تأسيسي عظيم لا غنى عنه لأي باحث في فلسفة التاريخ وعلم الاجتماع.', '2026-10-15 14:00:00'),
  (1, 5, 5, 'تحفة فكرية رائدة، أسلوب ابن خلدون سابق لعصره بقرون.', '2026-10-20 11:20:00'),
  (2, 4, 5, 'المرجع الأشمل والأكثر تنظيماً في مفاهيم الذكاء الاصطناعي وخوارزميات البحث.', '2026-10-18 16:30:00'),
  (2, 6, 5, 'The best textbook on modern AI and intelligent agents.', '2026-10-22 09:15:00'),
  (3, 5, 5, 'رواية مؤثرة جداً تبكيك وتبهرك في آن واحد، قلم رضوى عاشور عبقري.', '2026-10-19 18:40:00'),
  (4, 4, 5, 'كتاب غير مساري المهني كمطور برمجيات تماماً، قواعد ضرورية لكل مبرمج.', '2026-10-12 10:10:00'),
  (4, 6, 4, 'Practical and timeless principles for software craft.', '2026-10-21 15:00:00'),
  (5, 5, 5, 'حبكة الجريمة المغلقة من أروع ما قرأت في أدب الغموض الكلاسيكي.', '2026-10-23 20:00:00'),
  (6, 4, 5, 'كتاب عملي غير عاداتي اليومية نحو الأفضل، أفكار الـ 1% مؤثرة ومجربة.', '2026-10-17 13:00:00'),
  (7, 5, 5, 'رمزية عالية وإنسانية عميقة تسبر أغوار اللجوء والبحث عن الكرامة.', '2026-10-24 17:30:00'),
  (8, 4, 5, 'The holy grail for distributed systems, replication, and database engines.', '2026-10-14 12:00:00')
ON DUPLICATE KEY UPDATE rating = VALUES(rating), review = VALUES(review);

-- Sync initial ratings_count
UPDATE books b
SET ratings_count = (SELECT COUNT(id) FROM book_ratings WHERE book_id = b.id);

