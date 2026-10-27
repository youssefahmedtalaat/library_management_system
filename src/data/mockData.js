// Comprehensive mock data for Smart Library LMS (نظام إدارة المكتبة الذكي)

export const initialBooks = [
  {
    id: 1,
    isbn: '978-977-09-1234-5',
    title: 'مقدمة ابن خلدون: ديوان المبتدأ والخبر',
    title_ar: 'مقدمة ابن خلدون: ديوان المبتدأ والخبر',
    title_en: 'The Muqaddimah: An Introduction to History',
    author: 'عبد الرحمن بن خلدون',
    author_ar: 'عبد الرحمن بن خلدون',
    author_en: 'Ibn Khaldun',
    publisher: 'دار الشروق',
    publisher_ar: 'دار الشروق',
    publisher_en: 'Dar El Shorouk',
    publication_year: 2021,
    language: 'العربية',
    language_ar: 'العربية',
    language_en: 'Arabic',
    category: 'تاريخ وفلسفة',
    category_en: 'History & Philosophy',
    cover_image: '/images/books/muqaddimah.jpg',
    description: 'المصنف التأسيسي في علم الاجتماع وفلسفة التاريخ والعمران البشري، يتناول طبائع العمران والدول وأسباب صعود وسقوط الحضارات.',
    description_ar: 'المصنف التأسيسي في علم الاجتماع وفلسفة التاريخ والعمران البشري، يتناول طبائع العمران والدول وأسباب صعود وسقوط الحضارات.',
    description_en: 'The foundational treatise in sociology, historiography, and civilization dynamics, examining human culture and the rise and fall of empires.',
    shelf_location: 'جناح التاريخ - رف H-04',
    shelf_location_en: 'History Wing - Shelf H-04',
    total_copies: 4,
    available_copies: 2,
    rating: 4.9,
    match_keywords: ['تاريخ', 'علم اجتماع', 'حضارة', 'فلسفة', 'كلاسيكيات عربية', 'سياسة', 'history', 'sociology', 'ibn khaldun']
  },
  {
    id: 2,
    isbn: '978-013-468-599-1',
    title: 'الذكاء الاصطناعي: مقاربة حديثة',
    title_ar: 'الذكاء الاصطناعي: مقاربة حديثة',
    title_en: 'Artificial Intelligence: A Modern Approach',
    author: 'ستيوارت راسل وبيتر نورفيغ',
    author_ar: 'ستيوارت راسل وبيتر نورفيغ',
    author_en: 'Stuart Russell & Peter Norvig',
    publisher: 'Pearson Education / دار المريخ',
    publisher_ar: 'Pearson Education / دار المريخ',
    publisher_en: 'Pearson Education',
    publication_year: 2023,
    language: 'العربية / الإنجليزية',
    language_ar: 'العربية / الإنجليزية',
    language_en: 'Arabic / English',
    category: 'ذكاء اصطناعي وتكنولوجيا',
    category_en: 'AI & Technology',
    cover_image: '/images/books/ai-approach.jpg',
    description: 'المرجع الجامعي الأوسع انتشاراً عالمياً لتدريس الذكاء الاصطناعي، يغطي الوكلاء الأذكياء، وتعلم الآلة، والشبكات العصبية، ومعالجة اللغات الطبيعية.',
    description_ar: 'المرجع الجامعي الأوسع انتشاراً عالمياً لتدريس الذكاء الاصطناعي، يغطي الوكلاء الأذكياء، وتعلم الآلة، والشبكات العصبية، ومعالجة اللغات الطبيعية.',
    description_en: 'The leading global textbook in artificial intelligence, covering intelligent agents, machine learning, neural networks, logic, and natural language processing.',
    shelf_location: 'جناح التقنية - رف CS-12',
    shelf_location_en: 'Tech Wing - Shelf CS-12',
    total_copies: 5,
    available_copies: 3,
    rating: 4.8,
    match_keywords: ['ذكاء اصطناعي', 'تعلم الآلة', 'برمجة', 'حاسوب', 'خوارزميات', 'روبوتات', 'ai', 'machine learning', 'algorithms']
  },
  {
    id: 3,
    isbn: '978-977-14-5542-1',
    title: 'ثلاثية غرناطة',
    title_ar: 'ثلاثية غرناطة',
    title_en: 'Granada: A Novel',
    author: 'رضوى عاشور',
    author_ar: 'رضوى عاشور',
    author_en: 'Radwa Ashour',
    publisher: 'دار الشروق',
    publisher_ar: 'دار الشروق',
    publisher_en: 'Dar El Shorouk',
    publication_year: 2019,
    language: 'العربية',
    language_ar: 'العربية',
    language_en: 'Arabic',
    category: 'روايات وأدب',
    category_en: 'Literature & Fiction',
    cover_image: '/images/books/granada.jpg',
    description: 'رواية ملحمية تتتبع سيرة أجيال عائلة أندلسية في غرناطة بعد سقوط الحكم الإسلامي، وتوثق صراع الهوية والذاكرة والحرية.',
    description_ar: 'رواية ملحمية تتتبع سيرة أجيال عائلة أندلسية في غرناطة بعد سقوط الحكم الإسلامي، وتوثق صراع الهوية والذاكرة والحرية.',
    description_en: 'An acclaimed epic trilogy portraying generations of an Andalusian family in Granada following the fall of Islamic rule, exploring identity, resilience, and memory.',
    shelf_location: 'جناح الروايات - رف NOV-07',
    shelf_location_en: 'Novels Wing - Shelf NOV-07',
    total_copies: 3,
    available_copies: 0,
    rating: 4.9,
    match_keywords: ['رواية', 'أدب', 'تاريخ', 'الأندلس', 'غرناطة', 'قصة مشوقة', 'novel', 'andalusia', 'literature']
  },
  {
    id: 4,
    isbn: '978-013-235-088-4',
    title: 'الكود النظيف: دليل الصنعة البرمجية الرشيقة',
    title_ar: 'الكود النظيف: دليل الصنعة البرمجية الرشيقة',
    title_en: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'روبرت مارتن (Uncle Bob)',
    author_ar: 'روبرت مارتن (Uncle Bob)',
    author_en: 'Robert C. Martin',
    publisher: 'Prentice Hall',
    publisher_ar: 'Prentice Hall',
    publisher_en: 'Prentice Hall',
    publication_year: 2022,
    language: 'English',
    language_ar: 'الإنجليزية',
    language_en: 'English',
    category: 'ذكاء اصطناعي وتكنولوجيا',
    category_en: 'AI & Technology',
    cover_image: '/images/books/clean-code.jpg',
    description: 'دليل جوهري للمهندسين والمطورين لكتابة شيفرات برمجية واضحة، قابلة للاختبار والصيانة، مع تدريبات عملية في إعادة البناء وهندسة البرمجيات.',
    description_ar: 'دليل جوهري للمهندسين والمطورين لكتابة شيفرات برمجية واضحة، قابلة للاختبار والصيانة، مع تدريبات عملية في إعادة البناء وهندسة البرمجيات.',
    description_en: 'A foundational handbook for software engineers and developers detailing practical principles, patterns, and refactoring techniques to write clean, maintainable code.',
    shelf_location: 'جناح التقنية - رف CS-05',
    shelf_location_en: 'Tech Wing - Shelf CS-05',
    total_copies: 4,
    available_copies: 1,
    rating: 4.7,
    match_keywords: ['برمجة', 'كود', 'software', 'clean code', 'هندسة البرمجيات', 'تطوير', 'agile', 'refactoring']
  },
  {
    id: 5,
    isbn: '978-977-09-8877-3',
    title: 'لغز الغرفة الصفراء',
    title_ar: 'لغز الغرفة الصفراء',
    title_en: 'The Mystery of the Yellow Room',
    author: 'غاستون ليرو',
    author_ar: 'غاستون ليرو',
    author_en: 'Gaston Leroux',
    publisher: 'دار الأجيال',
    publisher_ar: 'دار الأجيال',
    publisher_en: 'Dar Al-Ajyal',
    publication_year: 2020,
    language: 'العربية',
    language_ar: 'العربية',
    language_en: 'Arabic',
    category: 'غموض وبوليسي',
    category_en: 'Mystery & Crime',
    cover_image: '/images/books/yellow-room.jpg',
    description: 'واحدة من أشهر قصص الغموض الكلاسيكية في تاريخ الأدب؛ جريمة تحدث داخل غرفة مغلقة بإحكام من الداخل، مثالية لمحبي الاستنتاج والغموض للمبتدئين.',
    description_ar: 'واحدة من أشهر قصص الغموض الكلاسيكية في تاريخ الأدب؛ جريمة تحدث داخل غرفة مغلقة بإحكام من الداخل، مثالية لمحبي الاستنتاج والغموض للمبتدئين.',
    description_en: 'One of the first locked-room mystery novels in literary history; an intricate puzzle centered on a crime committed inside a locked chamber, ideal for deductive mystery lovers.',
    shelf_location: 'جناح الغموض - رف MYS-02',
    shelf_location_en: 'Mystery Wing - Shelf MYS-02',
    total_copies: 3,
    available_copies: 2,
    rating: 4.6,
    match_keywords: ['قصة غموض قصيرة للمبتدئين', 'غموض', 'بوليسي', 'جريمة', 'تحقيق', 'إثارة', 'mystery', 'detective', 'crime']
  },
  {
    id: 6,
    isbn: '978-995-389-102-4',
    title: 'العادات الذرية: تغييرات صغيرة لنتائج مبهرة',
    title_ar: 'العادات الذرية: تغييرات صغيرة لنتائج مبهرة',
    title_en: 'Atomic Habits: Tiny Changes, Remarkable Results',
    author: 'جيمس كلير',
    author_ar: 'جيمس كلير',
    author_en: 'James Clear',
    publisher: 'مكتبة جرير / دار التنوير',
    publisher_ar: 'مكتبة جرير / دار التنوير',
    publisher_en: 'Jarir Bookstore / Dar Al-Tanweer',
    publication_year: 2022,
    language: 'العربية',
    language_ar: 'العربية',
    language_en: 'Arabic',
    category: 'إدارة وتطوير الذات',
    category_en: 'Self-Development & Management',
    cover_image: '/images/books/atomic-habits.png',
    description: 'إطار عملي علمي يعلمك كيف تكتسب عادات جيدة وتتخلص من السيئة عبر تحسينات صغيرة بنسبة 1% تتراكم لتحدث تحولاً كبيراً.',
    description_ar: 'إطار عملي علمي يعلمك كيف تكتسب عادات جيدة وتتخلص من السيئة عبر تحسينات صغيرة بنسبة 1% تتراكم لتحدث تحولاً كبيراً.',
    description_en: 'A comprehensive, practical guide on how to change daily habits by 1% every day, using behavioral science to achieve long-term mastery.',
    shelf_location: 'جناح تطوير الذات - رف DEV-11',
    shelf_location_en: 'Self-Dev Wing - Shelf DEV-11',
    total_copies: 6,
    available_copies: 4,
    rating: 4.9,
    match_keywords: ['تطوير الذات', 'عادات', 'إنتاجية', 'نجاح', 'إدارة الوقت', 'علم نفس', 'habits', 'productivity', 'self help']
  },
  {
    id: 7,
    isbn: '978-977-09-9941-2',
    title: 'رجال في الشمس',
    title_ar: 'رجال في الشمس',
    title_en: 'Men in the Sun',
    author: 'غسان كنفاني',
    author_ar: 'غسان كنفاني',
    author_en: 'Ghassan Kanafani',
    publisher: 'دار الآداب',
    publisher_ar: 'دار الآداب',
    publisher_en: 'Dar Al-Adab',
    publication_year: 2018,
    language: 'العربية',
    language_ar: 'العربية',
    language_en: 'Arabic',
    category: 'روايات وأدب',
    category_en: 'Literature & Fiction',
    cover_image: '/images/books/men-in-the-sun.jpg',
    description: 'رواية قصيرة مكثفة تسرد رحلة ثلاثة رجال فلسطينيين يبحثون عن الأمل والعمل، وتعد نموذجاً فريداً للرمزية الأدبية والعمق الإنساني.',
    description_ar: 'رواية قصيرة مكثفة تسرد رحلة ثلاثة رجال فلسطينيين يبحثون عن الأمل والعمل، وتعد نموذجاً فريداً للرمزية الأدبية والعمق الإنساني.',
    description_en: 'A powerful masterwork of modern Arabic literature following the journey of three refugees traveling across the desert in search of hope and dignity.',
    shelf_location: 'جناح الروايات - رف NOV-03',
    shelf_location_en: 'Novels Wing - Shelf NOV-03',
    total_copies: 4,
    available_copies: 3,
    rating: 4.8,
    match_keywords: ['أدب', 'رواية قصيرة', 'فلسطين', 'غسان كنفاني', 'دراما', 'literature', 'novella', 'kanafani']
  },
  {
    id: 8,
    isbn: '978-149-204-113-9',
    title: 'تصميم التطبيقات كثيفة البيانات',
    title_ar: 'تصميم التطبيقات كثيفة البيانات',
    title_en: 'Designing Data-Intensive Applications',
    author: 'مارتن كليبمان',
    author_ar: 'مارتن كليبمان',
    author_en: 'Martin Kleppmann',
    publisher: "O'Reilly Media",
    publisher_ar: "O'Reilly Media",
    publisher_en: "O'Reilly Media",
    publication_year: 2021,
    language: 'English',
    language_ar: 'الإنجليزية',
    language_en: 'English',
    category: 'ذكاء اصطناعي وتكنولوجيا',
    category_en: 'AI & Technology',
    cover_image: '/images/books/data-intensive.jpg',
    description: 'The definitive guide to the architecture, storage engines, distributed consensus, transactions, and reliability of modern database systems.',
    description_ar: 'الدليل المرجعي الشامل لمعمارية نظم البيانات، محركات التخزين، التوافق الموزع، والموثوقية في النظم السحابية وقواعد البيانات الحديثة.',
    description_en: 'The definitive guide to the architecture, storage engines, distributed consensus, transactions, and reliability of modern database systems.',
    shelf_location: 'جناح التقنية - رف CS-18',
    shelf_location_en: 'Tech Wing - Shelf CS-18',
    total_copies: 3,
    available_copies: 1,
    rating: 4.95,
    match_keywords: ['قواعد بيانات', 'database', 'distributed systems', 'architecture', 'mysql', 'بيانات', 'nosql', 'storage engines']
  }
];

export const initialBookCopies = [
  // Book 1: مقدمة ابن خلدون (4 copies: 2 available, 1 borrowed, 1 reserved)
  { id: 101, book_id: 1, barcode: 'BC-101-01', status: 'available', shelf_location: 'جناح التاريخ - رف H-04', shelf_location_en: 'History Wing - Shelf H-04' },
  { id: 102, book_id: 1, barcode: 'BC-101-02', status: 'available', shelf_location: 'جناح التاريخ - رف H-04', shelf_location_en: 'History Wing - Shelf H-04' },
  { id: 103, book_id: 1, barcode: 'BC-101-03', status: 'borrowed', shelf_location: 'جناح التاريخ - رف H-04', shelf_location_en: 'History Wing - Shelf H-04' },
  { id: 104, book_id: 1, barcode: 'BC-101-04', status: 'reserved', shelf_location: 'مكتب الحجوزات', shelf_location_en: 'Holds Pickup Desk' },

  // Book 2: الذكاء الاصطناعي (5 copies: 3 available, 2 borrowed)
  { id: 201, book_id: 2, barcode: 'BC-202-01', status: 'available', shelf_location: 'جناح التقنية - رف CS-12', shelf_location_en: 'Tech Wing - Shelf CS-12' },
  { id: 202, book_id: 2, barcode: 'BC-202-02', status: 'available', shelf_location: 'جناح التقنية - رف CS-12', shelf_location_en: 'Tech Wing - Shelf CS-12' },
  { id: 203, book_id: 2, barcode: 'BC-202-03', status: 'available', shelf_location: 'جناح التقنية - رف CS-12', shelf_location_en: 'Tech Wing - Shelf CS-12' },
  { id: 204, book_id: 2, barcode: 'BC-202-04', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-12', shelf_location_en: 'Tech Wing - Shelf CS-12' },
  { id: 205, book_id: 2, barcode: 'BC-202-05', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-12', shelf_location_en: 'Tech Wing - Shelf CS-12' },

  // Book 3: ثلاثية غرناطة (3 copies: all borrowed/reserved, 0 available)
  { id: 301, book_id: 3, barcode: 'BC-303-01', status: 'borrowed', shelf_location: 'جناح الروايات - رف NOV-07', shelf_location_en: 'Novels Wing - Shelf NOV-07' },
  { id: 302, book_id: 3, barcode: 'BC-303-02', status: 'borrowed', shelf_location: 'جناح الروايات - رف NOV-07', shelf_location_en: 'Novels Wing - Shelf NOV-07' },
  { id: 303, book_id: 3, barcode: 'BC-303-03', status: 'reserved', shelf_location: 'مكتب الحجوزات', shelf_location_en: 'Holds Pickup Desk' },

  // Book 4: Clean Code (4 copies: 1 available, 2 borrowed, 1 maintenance)
  { id: 401, book_id: 4, barcode: 'BC-404-01', status: 'available', shelf_location: 'جناح التقنية - رف CS-05', shelf_location_en: 'Tech Wing - Shelf CS-05' },
  { id: 402, book_id: 4, barcode: 'BC-404-02', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-05', shelf_location_en: 'Tech Wing - Shelf CS-05' },
  { id: 403, book_id: 4, barcode: 'BC-404-03', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-05', shelf_location_en: 'Tech Wing - Shelf CS-05' },
  { id: 404, book_id: 4, barcode: 'BC-404-04', status: 'maintenance', shelf_location: 'ورشة التجليد والصيانة', shelf_location_en: 'Binding & Repair Workshop' },

  // Book 5: لغز الغرفة الصفراء (3 copies: 2 available, 1 borrowed)
  { id: 501, book_id: 5, barcode: 'BC-505-01', status: 'available', shelf_location: 'جناح الغموض - رف MYS-02', shelf_location_en: 'Mystery Wing - Shelf MYS-02' },
  { id: 502, book_id: 5, barcode: 'BC-505-02', status: 'available', shelf_location: 'جناح الغموض - رف MYS-02', shelf_location_en: 'Mystery Wing - Shelf MYS-02' },
  { id: 503, book_id: 5, barcode: 'BC-505-03', status: 'borrowed', shelf_location: 'جناح الغموض - رف MYS-02', shelf_location_en: 'Mystery Wing - Shelf MYS-02' },

  // Book 6: العادات الذرية (6 copies: 4 available, 2 borrowed)
  { id: 601, book_id: 6, barcode: 'BC-606-01', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11', shelf_location_en: 'Self-Dev Wing - Shelf DEV-11' },
  { id: 602, book_id: 6, barcode: 'BC-606-02', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11', shelf_location_en: 'Self-Dev Wing - Shelf DEV-11' },
  { id: 603, book_id: 6, barcode: 'BC-606-03', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11', shelf_location_en: 'Self-Dev Wing - Shelf DEV-11' },
  { id: 604, book_id: 6, barcode: 'BC-606-04', status: 'available', shelf_location: 'جناح تطوير الذات - رف DEV-11', shelf_location_en: 'Self-Dev Wing - Shelf DEV-11' },
  { id: 605, book_id: 6, barcode: 'BC-606-05', status: 'borrowed', shelf_location: 'جناح تطوير الذات - رف DEV-11', shelf_location_en: 'Self-Dev Wing - Shelf DEV-11' },
  { id: 606, book_id: 6, barcode: 'BC-606-06', status: 'borrowed', shelf_location: 'جناح تطوير الذات - رف DEV-11', shelf_location_en: 'Self-Dev Wing - Shelf DEV-11' },

  // Book 7: رجال في الشمس (4 copies: 3 available, 1 borrowed)
  { id: 701, book_id: 7, barcode: 'BC-707-01', status: 'available', shelf_location: 'جناح الروايات - رف NOV-03', shelf_location_en: 'Novels Wing - Shelf NOV-03' },
  { id: 702, book_id: 7, barcode: 'BC-707-02', status: 'available', shelf_location: 'جناح الروايات - رف NOV-03', shelf_location_en: 'Novels Wing - Shelf NOV-03' },
  { id: 703, book_id: 7, barcode: 'BC-707-03', status: 'available', shelf_location: 'جناح الروايات - رف NOV-03', shelf_location_en: 'Novels Wing - Shelf NOV-03' },
  { id: 704, book_id: 7, barcode: 'BC-707-04', status: 'borrowed', shelf_location: 'جناح الروايات - رف NOV-03', shelf_location_en: 'Novels Wing - Shelf NOV-03' },

  // Book 8: Designing Data-Intensive Applications (3 copies: 1 available, 2 borrowed)
  { id: 801, book_id: 8, barcode: 'BC-808-01', status: 'available', shelf_location: 'جناح التقنية - رف CS-18', shelf_location_en: 'Tech Wing - Shelf CS-18' },
  { id: 802, book_id: 8, barcode: 'BC-808-02', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-18', shelf_location_en: 'Tech Wing - Shelf CS-18' },
  { id: 803, book_id: 8, barcode: 'BC-808-03', status: 'borrowed', shelf_location: 'جناح التقنية - رف CS-18', shelf_location_en: 'Tech Wing - Shelf CS-18' }
];

export const initialMembers = [
  {
    id: 1,
    user_id: 101,
    full_name: 'أحمد محمود التميمي',
    full_name_ar: 'أحمد محمود التميمي',
    full_name_en: 'Ahmed Mahmoud Al-Tamimi',
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
    full_name_ar: 'سارة خالد المنصور',
    full_name_en: 'Sara Khaled Al-Mansoor',
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
    full_name_ar: 'عمر ياسين الكردي',
    full_name_en: 'Omar Yaseen Al-Kurdi',
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
    full_name_ar: 'فاطمة ناصر الزهراني',
    full_name_en: 'Fatimah Nasser Al-Zahrani',
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
    book_title_en: 'The Muqaddimah: An Introduction to History',
    book_author: 'عبد الرحمن بن خلدون',
    book_author_en: 'Ibn Khaldun',
    copy_barcode: 'BC-101-03',
    member_id: 1,
    member_name: 'أحمد محمود التميمي',
    member_name_en: 'Ahmed Mahmoud Al-Tamimi',
    member_code: 'MEM-2026-0042',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_by_en: 'Circulation Desk (Sulaiman Al-Abdali)',
    issued_at: '2026-10-18T10:30:00Z',
    due_at: '2026-11-01T23:59:59Z',
    returned_at: null,
    renew_count: 0,
    status: 'issued'
  },
  {
    id: 2,
    copy_id: 402,
    book_id: 4,
    book_title: 'الكود النظيف: دليل الصنعة البرمجية الرشيقة',
    book_title_en: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    book_author: 'روبرت مارتن',
    book_author_en: 'Robert C. Martin',
    copy_barcode: 'BC-404-02',
    member_id: 1,
    member_name: 'أحمد محمود التميمي',
    member_name_en: 'Ahmed Mahmoud Al-Tamimi',
    member_code: 'MEM-2026-0042',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_by_en: 'Circulation Desk (Sulaiman Al-Abdali)',
    issued_at: '2026-10-14T09:15:00Z',
    due_at: '2026-10-28T23:59:59Z',
    returned_at: null,
    renew_count: 1,
    status: 'issued'
  },
  {
    id: 3,
    copy_id: 301,
    book_id: 3,
    book_title: 'ثلاثية غرناطة',
    book_title_en: 'Granada: A Novel',
    book_author: 'رضوى عاشور',
    book_author_en: 'Radwa Ashour',
    copy_barcode: 'BC-303-01',
    member_id: 2,
    member_name: 'سارة خالد المنصور',
    member_name_en: 'Sara Khaled Al-Mansoor',
    member_code: 'MEM-2026-0089',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_by_en: 'Circulation Desk (Sulaiman Al-Abdali)',
    issued_at: '2026-10-05T12:00:00Z',
    due_at: '2026-10-23T23:59:59Z',
    returned_at: null,
    renew_count: 0,
    status: 'overdue'
  },
  {
    id: 4,
    copy_id: 204,
    book_id: 2,
    book_title: 'الذكاء الاصطناعي: مقاربة حديثة',
    book_title_en: 'Artificial Intelligence: A Modern Approach',
    book_author: 'ستيوارت راسل وبيتر نورفيغ',
    book_author_en: 'Stuart Russell & Peter Norvig',
    copy_barcode: 'BC-202-04',
    member_id: 3,
    member_name: 'عمر ياسين الكردي',
    member_name_en: 'Omar Yaseen Al-Kurdi',
    member_code: 'MEM-2026-0115',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_by_en: 'Circulation Desk (Sulaiman Al-Abdali)',
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
    book_title_en: 'Designing Data-Intensive Applications',
    book_author: 'Martin Kleppmann',
    book_author_en: 'Martin Kleppmann',
    copy_barcode: 'BC-808-02',
    member_id: 4,
    member_name: 'فاطمة ناصر الزهراني',
    member_name_en: 'Fatimah Nasser Al-Zahrani',
    member_code: 'MEM-2026-0158',
    issued_by: 'أمين الإعارة (سليمان العبدلي)',
    issued_by_en: 'Circulation Desk (Sulaiman Al-Abdali)',
    issued_at: '2026-09-20T11:20:00Z',
    due_at: '2026-10-04T23:59:59Z',
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
    book_title_en: 'Granada: A Novel',
    member_id: 1,
    member_name: 'أحمد محمود التميمي',
    member_name_en: 'Ahmed Mahmoud Al-Tamimi',
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
    book_title_en: 'The Muqaddimah: An Introduction to History',
    member_id: 2,
    member_name: 'سارة خالد المنصور',
    member_name_en: 'Sara Khaled Al-Mansoor',
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
    member_name_en: 'Sara Khaled Al-Mansoor',
    member_code: 'MEM-2026-0089',
    book_title: 'ثلاثية غرناطة',
    book_title_en: 'Granada: A Novel',
    amount: 15.00,
    status: 'unpaid',
    assessed_at: '2026-10-24T00:00:00Z',
    settled_at: null,
    reason: 'تأخير إعادة نسخة (3 أيام × 5 ج.م)',
    reason_en: 'Late return fine (3 days × 5 EGP)'
  },
  {
    id: 2,
    loan_id: 5,
    member_id: 4,
    member_name: 'فاطمة ناصر الزهراني',
    member_name_en: 'Fatimah Nasser Al-Zahrani',
    member_code: 'MEM-2026-0158',
    book_title: 'Designing Data-Intensive Applications',
    book_title_en: 'Designing Data-Intensive Applications',
    amount: 45.00,
    status: 'unpaid',
    assessed_at: '2026-10-10T00:00:00Z',
    settled_at: null,
    reason: 'تأخير إعادة نسخة لأكثر من 9 أيام',
    reason_en: 'Late return fine exceeding 9 days'
  }
];

export const initialAuditLogs = [
  {
    id: 1,
    actor: 'أمين الإعارة (سليمان)',
    actor_en: 'Circulation Desk (Sulaiman)',
    actor_role: 'Librarian',
    action: 'تسجيل إعارة',
    action_en: 'Issue Loan',
    entity_type: 'Loan',
    entity_id: 'LN-004',
    created_at: '2026-10-20T14:45:00Z',
    details: 'إعارة نسخة BC-202-04 للعضو عمر ياسين',
    details_en: 'Issued copy BC-202-04 to member Omar Yaseen'
  },
  {
    id: 2,
    actor: 'أمين الإعارة (سليمان)',
    actor_en: 'Circulation Desk (Sulaiman)',
    actor_role: 'Librarian',
    action: 'تجديد إعارة',
    action_en: 'Renew Loan',
    entity_type: 'Loan',
    entity_id: 'LN-002',
    created_at: '2026-10-21T09:12:00Z',
    details: 'تجديد كتاب Clean Code للعضو أحمد التميمي (تجديد أول)',
    details_en: 'Renewed Clean Code for member Ahmed Al-Tamimi (Renewal 1)'
  },
  {
    id: 3,
    actor: 'مدير النظام (د. هشام)',
    actor_en: 'System Admin (Dr. Hesham)',
    actor_role: 'Admin',
    action: 'تعديل السياسات',
    action_en: 'Update Policies',
    entity_type: 'Policy',
    entity_id: 'POL-01',
    created_at: '2026-10-22T11:00:00Z',
    details: 'تحديث الحد الأقصى للإعارة لكل عضو إلى 3 كتب',
    details_en: 'Updated max borrow limit per member to 3 books'
  },
  {
    id: 4,
    actor: 'النظام الآلي (Cron)',
    actor_en: 'System Scheduler (Cron)',
    actor_role: 'System',
    action: 'احتساب غرامة تأخير',
    action_en: 'Assess Overdue Fine',
    entity_type: 'Fine',
    entity_id: 'FN-001',
    created_at: '2026-10-24T00:00:00Z',
    details: 'احتساب 15 ج.م غرامة تأخير على العضو سارة المنصور',
    details_en: 'Assessed 15 EGP overdue fine on member Sara Al-Mansoor'
  }
];

export const initialStaff = [
  {
    id: 1,
    full_name: 'د. هشام القاسمي',
    full_name_ar: 'د. هشام القاسمي',
    full_name_en: 'Dr. Hesham Al-Qasimi',
    email: 'hisham.qasimi@library.gov.sa',
    role: 'admin',
    role_title: 'مدير عام النظام والمكتبة',
    role_title_ar: 'مدير عام النظام والمكتبة',
    role_title_en: 'General Library & System Director',
    status: 'active',
    last_login: '2026-10-26T08:15:00Z'
  },
  {
    id: 2,
    full_name: 'سليمان العبدلي',
    full_name_ar: 'سليمان العبدلي',
    full_name_en: 'Sulaiman Al-Abdali',
    email: 'sulaiman.abdali@library.gov.sa',
    role: 'librarian',
    role_title: 'أمين الإعارة والتداول',
    role_title_ar: 'أمين الإعارة والتداول',
    role_title_en: 'Circulation & Lending Librarian',
    status: 'active',
    last_login: '2026-10-26T09:40:00Z'
  },
  {
    id: 3,
    full_name: 'مها الشريف',
    full_name_ar: 'مها الشريف',
    full_name_en: 'Maha Al-Shareef',
    email: 'maha.shareef@library.gov.sa',
    role: 'cataloger',
    role_title: 'مشرفة الفهرسة والتصنيف',
    role_title_ar: 'مشرفة الفهرسة والتصنيف',
    role_title_en: 'Cataloging & Classification Specialist',
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

// ─── Mock Users (Authentication) ───────────────────────────────────────────
// These are the login credentials for all three roles.
// In production this would come from a real backend.
export const mockUsers = [
  {
    id: 'USR-001',
    email: 'ahmed@library.sa',
    password: 'member123',
    role: 'member',
    memberId: 1,
    name: 'Ahmed Mahmoud Al-Tamimi',
    name_ar: 'أحمد محمود التميمي',
    avatarLetter: 'A'
  },
  {
    id: 'USR-002',
    email: 'sulaiman@library.sa',
    password: 'librarian123',
    role: 'librarian',
    staffId: 2,
    name: 'Sulaiman Al-Abdali',
    name_ar: 'سليمان العبدلي',
    avatarLetter: 'S'
  },
  {
    id: 'USR-003',
    email: 'hesham@library.sa',
    password: 'admin123',
    role: 'admin',
    staffId: 1,
    name: 'Dr. Hesham Al-Qasimi',
    name_ar: 'د. هشام القاسمي',
    avatarLetter: 'H'
  }
];

// Bilingual access helpers
export function getBookTitle(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.title_en || book.title) : (book.title_ar || book.title);
}

export function getBookAuthor(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.author_en || book.author) : (book.author_ar || book.author);
}

export function getBookDescription(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.description_en || book.description) : (book.description_ar || book.description);
}

export function getBookCategory(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.category_en || book.category) : (book.category_ar || book.category);
}

export function getBookPublisher(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.publisher_en || book.publisher) : (book.publisher_ar || book.publisher);
}

export function getBookLanguage(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.language_en || book.language) : (book.language_ar || book.language);
}

export function getBookShelf(book, lang = 'ar') {
  if (!book) return '';
  return lang === 'en' ? (book.shelf_location_en || book.shelf_location) : (book.shelf_location_ar || book.shelf_location);
}

export function getMemberName(member, lang = 'ar') {
  if (!member) return '';
  return lang === 'en' ? (member.full_name_en || member.full_name) : (member.full_name_ar || member.full_name);
}

export function getStaffName(staff, lang = 'ar') {
  if (!staff) return '';
  return lang === 'en' ? (staff.full_name_en || staff.full_name) : (staff.full_name_ar || staff.full_name);
}

export function getStaffRoleTitle(staff, lang = 'ar') {
  if (!staff) return '';
  return lang === 'en' ? (staff.role_title_en || staff.role_title) : (staff.role_title_ar || staff.role_title);
}
