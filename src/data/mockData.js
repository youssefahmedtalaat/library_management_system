// Comprehensive mock data for Smart Library LMS (نظام إدارة المكتبة الذكي)

export const initialBooks = [
  {
    id: 1,
    isbn: '978-977-09-1234-5',
    title: 'مقدمة ابن خلدون: ديوان المبتدأ والخبر',
    author: 'عبد الرحمن بن خلدون',
    publisher: 'دار الشروق',
    publication_year: 2021,
    language: 'العربية',
    category: 'تاريخ وفلسفة',
    cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'المصنف التأسيسي في علم الاجتماع وفلسفة التاريخ والعمران البشري، يتناول طبائع العمران والدول وأسباب صعود وسقوط الحضارات.',
    shelf_location: 'جناح التاريخ - رف H-04',
    total_copies: 4,
    available_copies: 2,
    rating: 4.9,
    match_keywords: ['تاريخ', 'علم اجتماع', 'حضارة', 'فلسفة', 'كلاسيكيات عربية', 'سياسة']
  },
  {
    id: 2,
    isbn: '978-013-468-599-1',
    title: 'الذكاء الاصطناعي: مقاربة حديثة (Artificial Intelligence: A Modern Approach)',
    author: 'ستيوارت راسل وبيتر نورفيغ',
    publisher: 'Pearson Education / دار المريخ',
    publication_year: 2023,
    language: 'العربية / الإنجليزية',
    category: 'ذكاء اصطناعي وتكنولوجيا',
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'المرجع الجامعي الأوسع انتشاراً عالمياً لتدريس الذكاء الاصطناعي، يغطي الوكلاء الأذكياء، وتعلم الآلة، والشبكات العصبية، ومعالجة اللغات الطبيعية.',
    shelf_location: 'جناح التقنية - رف CS-12',
    total_copies: 5,
    available_copies: 3,
    rating: 4.8,
    match_keywords: ['ذكاء اصطناعي', 'تعلم الآلة', 'برمجة', 'حاسوب', 'خوارزميات', 'روبوتات', 'ai']
  },
  {
    id: 3,
    isbn: '978-977-14-5542-1',
    title: 'ثلاثية غرناطة',
    author: 'رضوى عاشور',
    publisher: 'دار الشروق',
    publication_year: 2019,
    language: 'العربية',
    category: 'روايات وأدب',
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    description: 'رواية ملحمية تتتبع سيرة أجيال عائلة أندلسية في غرناطة بعد سقوط الحكم الإسلامي، وتوثق صراع الهوية والذاكرة والحرية.',
    shelf_location: 'جناح الروايات - رف NOV-07',
    total_copies: 3,
    available_copies: 0,
    rating: 4.9,
    match_keywords: ['رواية', 'أدب', 'تاريخ', 'الأندلس', 'غرناطة', 'قصة مشوقة']
  },
  {
    id: 4,
    isbn: '978-013-235-088-4',
    title: 'الكود النظيف: دليل الصنعة البرمجية الرشيقة (Clean Code)',
    author: 'روبرت مارتن (Uncle Bob)',
    publisher: 'Prentice Hall',
    publication_year: 2022,
    language: 'English',
    category: 'ذكاء اصطناعي وتكنولوجيا',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    description: 'دليل جوهري للمهندسين والمطورين لكتابة شيفرات برمجية واضحة، قابلة للاختبار والصيانة، مع تدريبات عملية في إعادة البناء وهندسة البرمجيات.',
    shelf_location: 'جناح التقنية - رف CS-05',
    total_copies: 4,
    available_copies: 1,
    rating: 4.7,
    match_keywords: ['برمجة', 'كود', 'software', 'clean code', 'هندسة البرمجيات', 'تطوير']
  },
  {
    id: 5,
    isbn: '978-977-09-8877-3',
    title: 'لغز الغرفة الصفراء (قصة غموض مشوقة)',
    author: 'غاستون ليرو (ترجمة معتمدة)',
    publisher: 'دار الأجيال',
    publication_year: 2020,
    language: 'العربية',
    category: 'غموض وبوليسي',
    cover_image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    description: 'واحدة من أشهر قصص الغموض الكلاسيكية في تاريخ الأدب؛ جريمة تحدث داخل غرفة مغلقة بإحكام من الداخل، مثالية لمحبي الاستنتاج والغموض للمبتدئين.',
    shelf_location: 'جناح الغموض - رف MYS-02',
    total_copies: 3,
    available_copies: 2,
    rating: 4.6,
    match_keywords: ['قصة غموض قصيرة للمبتدئين', 'غموض', 'بوليسي', 'جريمة', 'تحقيق', 'إثارة']
  },
  {
    id: 6,
    isbn: '978-995-389-102-4',
    title: 'العادات الذرية: تغييرات صغيرة لنتائج مبهرة',
    author: 'جيمس كلير',
    publisher: 'مكتبة جرير / دار التنوير',
    publication_year: 2022,
    language: 'العربية',
    category: 'إدارة وتطوير الذات',
    cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    description: 'إطار عملي علمي يعلمك كيف تكتسب عادات جيدة وتتخلص من السيئة عبر تحسينات صغيرة بنسبة 1% تتراكم لتحدث تحولاً كبيراً.',
    shelf_location: 'جناح تطوير الذات - رف DEV-11',
    total_copies: 6,
    available_copies: 4,
    rating: 4.9,
    match_keywords: ['تطوير الذات', 'عادات', 'إنتاجية', 'نجاح', 'إدارة الوقت', 'علم نفس']
  },
  {
    id: 7,
    isbn: '978-977-09-9941-2',
    title: 'رجال في الشمس',
    author: 'غسان كنفاني',
    publisher: 'دار الآداب',
    publication_year: 2018,
    language: 'العربية',
    category: 'روايات وأدب',
    cover_image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    description: 'رواية قصيرة مكثفة تسرد رحلة ثلاثة رجال فلسطينيين يبحثون عن الأمل والعمل، وتعد نموذجاً فريداً للرمزية الأدبية والعمق الإنساني.',
    shelf_location: 'جناح الروايات - رف NOV-03',
    total_copies: 4,
    available_copies: 3,
    rating: 4.8,
    match_keywords: ['أدب', 'رواية قصيرة', 'فلسطين', 'غسان كنفاني', 'دراما']
  },
  {
    id: 8,
    isbn: '978-149-204-113-9',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    publisher: "O'Reilly Media",
    publication_year: 2021,
    language: 'English',
    category: 'ذكاء اصطناعي وتكنولوجيا',
    cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    description: 'The definitive guide to the architecture, storage engines, distributed consensus, transactions, and reliability of modern database systems.',
    shelf_location: 'جناح التقنية - رف CS-18',
    total_copies: 3,
    available_copies: 1,
    rating: 4.95,
    match_keywords: ['قواعد بيانات', 'database', 'distributed systems', 'architecture', 'mysql', 'بيانات']
  }
];

export const initialBookCopies = [
  // Book 1: مقدمة ابن خلدون (4 copies: 2 available, 1 borrowed, 1 reserved)
  { id: 101, book_id: 1, barcode: 'BC-101-01', status: 'available', shelf_location: 'جناح التاريخ - رف H-04' },
  { id: 102, book_id: 1, barcode: 'BC-101-02', status: 'available', shelf_location: 'جناح التاريخ - رف H-04' },
  { id: 103, book_id: 1, barcode: 'BC-101-03', status: 'borrowed', shelf_location: 'جناح التاريخ - رف H-04' },
  { id: 104, book_id: 1, barcode: 'BC-101-04', status: 'reserved', shelf_location: 'مكتب الحجوزات' },

  // Book 2: الذكاء الاصطناعي (5 copies: 3 available, 2 borrowed)
  { id: 201, book_id: 2, barcode: 'BC-202-01', status: 'available', shelf_location: 'جناح التقنية - رف CS-12' },
  { id: 202, book_id: 2, barcode: 'BC-202-02', status: 'available', shelf_location: 'جناح التقنية - رف CS-12' },
  { id: 203, book_id: 2, barcode: 'BC-202-03', status: 'available', shelf_location: 'جناح التقنية - رف CS-12' },
  { id: 204, book_id: 2, barcode: 'BC-202-04', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-12' },
  { id: 205, book_id: 2, barcode: 'BC-202-05', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-12' },

  // Book 3: ثلاثية غرناطة (3 copies: all borrowed/reserved, 0 available)
  { id: 301, book_id: 3, barcode: 'BC-303-01', status: 'borrowed', shelf_location: 'جناح الروايات - رف NOV-07' },
  { id: 302, book_id: 3, barcode: 'BC-303-02', status: 'borrowed', shelf_location: 'جناح الروايات - رف NOV-07' },
  { id: 303, book_id: 3, barcode: 'BC-303-03', status: 'reserved', shelf_location: 'مكتب الحجوزات' },

  // Book 4: Clean Code (4 copies: 1 available, 2 borrowed, 1 maintenance)
  { id: 401, book_id: 4, barcode: 'BC-404-01', status: 'available', shelf_location: 'جناح التقنية - رف CS-05' },
  { id: 402, book_id: 4, barcode: 'BC-404-02', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-05' },
  { id: 403, book_id: 4, barcode: 'BC-404-03', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-05' },
  { id: 404, book_id: 4, barcode: 'BC-404-04', status: 'maintenance', shelf_location: 'ورشة التجليد والصيانة' },

  // Book 5: لغز الغرفة الصفراء (3 copies: 2 available, 1 borrowed)
  { id: 501, book_id: 5, barcode: 'BC-505-01', status: 'available', shelf_location: 'جناح الغموض - رف MYS-02' },
  { id: 502, book_id: 5, barcode: 'BC-505-02', status: 'available', shelf_location: 'جناح الغموض - رف MYS-02' },
  { id: 503, book_id: 5, barcode: 'BC-505-03', status: 'borrowed', shelf_location: 'جناح الغموض - رف MYS-02' },

  // Book 6: العادات الذرية (6 copies: 4 available, 2 borrowed)
  { id: 601, book_id: 6, barcode: 'BC-606-01', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11' },
  { id: 602, book_id: 6, barcode: 'BC-606-02', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11' },
  { id: 603, book_id: 6, barcode: 'BC-606-03', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11' },
  { id: 604, book_id: 6, barcode: 'BC-606-04', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11' },
  { id: 605, book_id: 6, barcode: 'BC-606-05', status: 'borrowed', shelf_location: 'جناح تطوير الذات - رف DEV-11' },
  { id: 606, book_id: 6, barcode: 'BC-606-06', status: 'borrowed', shelf_location: 'جناح تطوير الذات - رف DEV-11' },

  // Book 7: رجال في الشمس (4 copies: 3 available, 1 borrowed)
  { id: 701, book_id: 7, barcode: 'BC-707-01', status: 'available', shelf_location: 'جناح الروايات - رف NOV-03' },
  { id: 702, book_id: 7, barcode: 'BC-707-02', status: 'available', shelf_location: 'جناح الروايات - رف NOV-03' },
  { id: 703, book_id: 7, barcode: 'BC-707-03', status: 'available', shelf_location: 'جناح الروايات - رف NOV-03' },
  { id: 704, book_id: 7, barcode: 'BC-707-04', status: 'borrowed', shelf_location: 'جناح الروايات - رف NOV-03' },

  // Book 8: Designing Data-Intensive Applications (3 copies: 1 available, 2 borrowed)
  { id: 801, book_id: 8, barcode: 'BC-808-01', status: 'available', shelf_location: 'جناح التقنية - رف CS-18' },
  { id: 802, book_id: 8, barcode: 'BC-808-02', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-18' },
  { id: 803, book_id: 8, barcode: 'BC-808-03', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-18' }
];

export const initialMembers = [
  {
    id: 1,
    user_id: 101,
    full_name: 'أحمد محمود التميمي',
    email: 'ahmed.tamimi@example.com',
    phone: '+966 50 123 4567',
    member_code: 'MEM-2026-0042',
    membership_status: 'active',
    active_loans_count: 2,
    fines_due: 0,
    joined_at: '2025-01-15'
  },
  {
    id: 2,
    user_id: 102,
    full_name: 'سارة خالد المنصور',
    email: 'sara.mansoor@example.com',
    phone: '+966 55 987 6543',
    member_code: 'MEM-2026-0089',
    membership_status: 'active',
    active_loans_count: 1,
    fines_due: 15.00,
    joined_at: '2025-04-10'
  },
  {
    id: 3,
    user_id: 103,
    full_name: 'عمر ياسين الكردي',
    email: 'omar.kurdi@example.com',
    phone: '+966 54 321 0000',
    member_code: 'MEM-2026-0115',
    membership_status: 'active',
    active_loans_count: 3,
    fines_due: 0,
    joined_at: '2024-11-20'
  },
  {
    id: 4,
    user_id: 104,
    full_name: 'فاطمة ناصر الزهراني',
    email: 'fatimah.zahrani@example.com',
    phone: '+966 56 444 3322',
    member_code: 'MEM-2026-0158',
    membership_status: 'blocked',
    active_loans_count: 1,
    fines_due: 45.00,
    joined_at: '2024-08-05'
  }
];

export const initialLoans = [
  {
    id: 1,
    copy_id: 103,
    book_id: 1,
    book_title: 'مقدمة ابن خلدون: ديوان المبتدأ والخبر',
    book_author: 'عبد الرحمن بن خلدون',
    copy_barcode: 'BC-101-03',
    member_id: 1,
    member_name: 'أحمد محمود التميمي',
    member_code: 'MEM-2026-0042',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_at: '2026-10-18T10:30:00Z',
    due_at: '2026-11-01T23:59:59Z',
    returned_at: null,
    renew_count: 0,
    status: 'issued' // active, due in 6 days
  },
  {
    id: 2,
    copy_id: 402,
    book_id: 4,
    book_title: 'الكود النظيف: دليل الصنعة البرمجية الرشيقة',
    book_author: 'روبرت مارتن',
    copy_barcode: 'BC-404-02',
    member_id: 1,
    member_name: 'أحمد محمود التميمي',
    member_code: 'MEM-2026-0042',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_at: '2026-10-14T09:15:00Z',
    due_at: '2026-10-28T23:59:59Z',
    returned_at: null,
    renew_count: 1,
    status: 'issued' // due soon: in 2 days
  },
  {
    id: 3,
    copy_id: 301,
    book_id: 3,
    book_title: 'ثلاثية غرناطة',
    book_author: 'رضوى عاشور',
    copy_barcode: 'BC-303-01',
    member_id: 2,
    member_name: 'سارة خالد المنصور',
    member_code: 'MEM-2026-0089',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_at: '2026-10-05T12:00:00Z',
    due_at: '2026-10-23T23:59:59Z', // overdue by 3 days
    returned_at: null,
    renew_count: 0,
    status: 'overdue'
  },
  {
    id: 4,
    copy_id: 204,
    book_id: 2,
    book_title: 'الذكاء الاصطناعي: مقاربة حديثة',
    book_author: 'ستيوارت راسل وبيتر نورفيغ',
    copy_barcode: 'BC-202-04',
    member_id: 3,
    member_name: 'عمر ياسين الكردي',
    member_code: 'MEM-2026-0115',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_at: '2026-10-20T14:45:00Z',
    due_at: '2026-11-03T23:59:59Z',
    returned_at: null,
    renew_count: 0,
    status: 'issued'
  },
  {
    id: 5,
    copy_id: 802,
    book_id: 8,
    book_title: 'Designing Data-Intensive Applications',
    book_author: 'Martin Kleppmann',
    copy_barcode: 'BC-808-02',
    member_id: 4,
    member_name: 'فاطمة ناصر الزهراني',
    member_code: 'MEM-2026-0158',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_at: '2026-09-20T11:20:00Z',
    due_at: '2026-10-04T23:59:59Z', // overdue by 22 days!
    returned_at: null,
    renew_count: 0,
    status: 'overdue'
  }
];

export const initialReservations = [
  {
    id: 1,
    book_id: 3,
    book_title: 'ثلاثية غرناطة',
    member_id: 1,
    member_name: 'أحمد محمود التميمي',
    member_code: 'MEM-2026-0042',
    queue_position: 1,
    status: 'active',
    placed_at: '2026-10-24T16:00:00Z',
    expires_at: '2026-11-07T16:00:00Z'
  },
  {
    id: 2,
    book_id: 1,
    book_title: 'مقدمة ابن خلدون: ديوان المبتدأ والخبر',
    member_id: 2,
    member_name: 'سارة خالد المنصور',
    member_code: 'MEM-2026-0089',
    queue_position: 1,
    status: 'active',
    placed_at: '2026-10-25T11:30:00Z',
    expires_at: '2026-11-08T11:30:00Z'
  }
];

export const initialFines = [
  {
    id: 1,
    loan_id: 3,
    member_id: 2,
    member_name: 'سارة خالد المنصور',
    member_code: 'MEM-2026-0089',
    book_title: 'ثلاثية غرناطة',
    amount: 15.00,
    status: 'unpaid',
    assessed_at: '2026-10-24T00:00:00Z',
    settled_at: null,
    reason: 'تأخير إعادة نسخة (3 أيام × 5 ر.س)'
  },
  {
    id: 2,
    loan_id: 5,
    member_id: 4,
    member_name: 'فاطمة ناصر الزهراني',
    member_code: 'MEM-2026-0158',
    book_title: 'Designing Data-Intensive Applications',
    amount: 45.00,
    status: 'unpaid',
    assessed_at: '2026-10-10T00:00:00Z',
    settled_at: null,
    reason: 'تأخير إعادة نسخة لأكثر من 9 أيام'
  }
];

export const initialAuditLogs = [
  {
    id: 1,
    actor: 'أمين الإعارة (سليمان)',
    actor_role: 'Librarian',
    action: 'تسجيل إعارة',
    entity_type: 'Loan',
    entity_id: 'LN-004',
    created_at: '2026-10-20T14:45:00Z',
    details: 'إعارة نسخة BC-202-04 للعضو عمر ياسين'
  },
  {
    id: 2,
    actor: 'أمين الإعارة (سليمان)',
    actor_role: 'Librarian',
    action: 'تجديد إعارة',
    entity_type: 'Loan',
    entity_id: 'LN-002',
    created_at: '2026-10-21T09:12:00Z',
    details: 'تجديد كتاب Clean Code للعضو أحمد التميمي (تجديد أول)'
  },
  {
    id: 3,
    actor: 'مدير النظام (د. هشام)',
    actor_role: 'Admin',
    action: 'تعديل السياسات',
    entity_type: 'Policy',
    entity_id: 'POL-01',
    created_at: '2026-10-22T11:00:00Z',
    details: 'تحديث الحد الأقصى للإعارة لكل عضو إلى 3 كتب'
  },
  {
    id: 4,
    actor: 'النظام الآلي (Cron)',
    actor_role: 'System',
    action: 'احتساب غرامة تأخير',
    entity_type: 'Fine',
    entity_id: 'FN-001',
    created_at: '2026-10-24T00:00:00Z',
    details: 'احتساب 15 ر.س غرامة تأخير على العضو سارة المنصور'
  }
];

export const initialStaff = [
  {
    id: 1,
    full_name: 'د. هشام القاسمي',
    email: 'hisham.qasimi@library.gov.sa',
    role: 'admin',
    role_title: 'مدير عام النظام والمكتبة',
    status: 'active',
    last_login: '2026-10-26T08:15:00Z'
  },
  {
    id: 2,
    full_name: 'سليمان العبدلي',
    email: 'sulaiman.abdali@library.gov.sa',
    role: 'librarian',
    role_title: 'أمين الإعارة والتداول',
    status: 'active',
    last_login: '2026-10-26T09:40:00Z'
  },
  {
    id: 3,
    full_name: 'مها الشريف',
    email: 'maha.shareef@library.gov.sa',
    role: 'cataloger',
    role_title: 'مشرفة الفهرسة والتصنيف',
    status: 'active',
    last_login: '2026-10-25T14:20:00Z'
  }
];

export const initialPolicies = {
  max_borrow_limit: 3,
  default_loan_days: 14,
  max_renewals: 2,
  fine_per_day: 5.0,
  reservation_expiry_hours: 48,
  allow_self_renewal: true,
  enable_ai_librarian: true
};
