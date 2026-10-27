// Comprehensive bilingual dictionary for Smart Library LMS (نظام إدارة المكتبة الذكي)

export const translations = {
  ar: {
    // App & Layout
    appName: 'المكتبة الذكية',
    appSubtitle: 'نظام إدارة المكتبة الذكي LMS 2026',
    sidebar: {
      logoTitle: 'المكتبة الذكية',
      logoVersion: 'LMS 2026',
      mainMenu: 'القائمة الرئيسية',
      tools: 'الأدوات',
      aiAssistant: 'المساعد الذكي',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      toggleTheme: 'تبديل المظهر',
      toggleLang: 'English',
      help: 'المساعدة',
      userStaffName: 'سليمان المنصور',
      userStaffRole: 'أمين إعارة',
      userAdminName: 'د. هشام الراشد',
      userAdminRole: 'مدير النظام',
    },
    topbar: {
      searchPlaceholder: 'ابحث عن كتاب، عضو، أو رقم ISBN...',
      filterTooltip: 'تصفية متقدمة',
      notifications: 'الإشعارات',
      newBadge: 'جديدة',
      clearSearch: 'مسح البحث',
    },
    notificationsList: [
      {
        id: 1,
        title: 'موعد استحقاق قريب',
        text: 'كتاب "الكود النظيف" مستحق للإرجاع خلال 48 ساعة.',
        time: 'منذ ساعتين',
      },
      {
        id: 2,
        title: 'إشعار قائمة الحجز',
        text: 'أنت الآن في المرتبة #1 لحجز كتاب "ثلاثية غرناطة".',
        time: 'منذ يوم',
      },
      {
        id: 3,
        title: 'تحديث الفهرس',
        text: 'تمت إضافة 4 مراجع جديدة في جناح الذكاء الاصطناعي.',
        time: 'منذ يومين',
      },
    ],

    // Roles
    roles: {
      member: 'بوابة العضو',
      staff: 'أمين المكتبة',
      admin: 'مدير النظام',
    },

    // Navigation Tabs
    nav: {
      catalog: 'فهرس الكتب',
      myLoans: 'إعاراتي وحجوزاتي',
      dashboard: 'لوحة المتابعة',
      circulation: 'مكتب الإعارة والإرجاع',
      catalogMgmt: 'إدارة الفهرس والنسخ',
      reservations: 'قائمة الحجوزات',
      overdues: 'المتأخرات والغرامات',
      staffMgmt: 'إدارة الموظفين والأدوار',
      policies: 'سياسات وقواعد الإعارة',
      audit: 'سجل التدقيق والإجراءات',
    },

    // Statuses
    status: {
      available: 'متاح',
      reserved: 'محجوز',
      dueSoon: 'قريب الاستحقاق',
      borrowed: 'مُعار',
      issued: 'مُعار',
      overdue: 'متأخر',
      maintenance: 'صيانة وتجليد',
      active: 'نشط',
      blocked: 'موقوف',
      paid: 'مسدد',
      unpaid: 'غير مسدد',
      cancelled: 'ملغي',
      returned: 'تم الإرجاع',
    },

    // Catalog Page
    catalog: {
      aiBannerTitle: 'استكشف الفهرس بواسطة الذكاء الاصطناعي',
      aiBannerDesc: 'صف ما ترغب في قراءته بلغتك الطبيعية (مثل: "قصة غموض مشوقة للمبتدئين" أو "مراجع الذكاء الاصطناعي") وسيقوم المساعد بشرح الترشيحات.',
      promptMystery: 'قصة غموض للمبتدئين',
      promptAI: 'كتب الذكاء الاصطناعي',
      searchPlaceholder: 'ابحث بالعنوان، اسم المؤلف، موضوع الكتاب، أو رقم الـ ISBN...',
      filterAvailabilityAll: 'حالة التوفر (الكل)',
      filterAvailableNow: 'متاح للإعارة فوراً',
      filterBorrowedNow: 'مُعار حالياً',
      filterLangAll: 'اللغة (الكل)',
      filterLangAr: 'اللغة العربية',
      filterLangEn: 'English',
      sortRating: 'الأعلى تقييماً ⭐',
      sortYear: 'الأحدث نشراً 📅',
      sortTitle: 'أبجدياً بالاسم 🔤',
      categoriesLabel: 'التصنيفات:',
      allCategories: 'جميع التصنيفات',
      availableCount: 'عناوين الفهرس المتاحة ({n})',
      resetFilters: 'إعادة تعيين الفلاتر',
      shelfLocationsNote: 'عرض بطاقات النسخ مع مواقع الرفوف',
      noBooksFound: 'لم نعثر على كتب مطابقة لمعايير البحث',
      noBooksFoundDesc: 'جرّب تغيير كلمات البحث، أو إلغاء تحديد فلاتر التوفر، أو اسأل أمين المكتبة الذكي للحصول على اقتراحات بديلة.',
      clearFilters: 'مسح عوامل التصفية',
      searchWithAI: 'البحث بواسطة المساعد الذكي',
    },

    // Book Card
    bookCard: {
      availableCount: '{n} متاح',
      fullyBorrowed: 'مُعار بالكامل',
      location: 'الموقع:',
      availableCopies: 'النسخ المتاحة:',
      copiesOfTotal: '{n} من {total}',
      viewCopies: 'عرض النسخ',
      placeHold: 'حجز مسبق',
      joinQueue: 'انضم للطابور',
      ratingLabel: 'تقييم القراء',
    },

    // Book Details Modal
    modal: {
      title: 'بطاقة الكتاب والنسخ المادية',
      close: 'إغلاق',
      by: 'تأليف:',
      publisher: 'الناشر:',
      pubYear: 'سنة النشر:',
      language: 'اللغة:',
      activeHolds: 'يوجد حالياً {n} طلبات حجز نشطة في طابور الانتظار لهذا العنوان.',
      physicalCopiesTitle: 'النسخ المادية المستقلة ({n} نسخ)',
      defaultShelf: 'رمز الرف الافتراضي:',
      barcodeCol: 'باركود النسخة',
      shelfCol: 'موقع الرف',
      statusCol: 'الحالة التشغيلية',
      staffActionCol: 'إجراء الموظف',
      noCopiesRegistered: 'لا توجد نسخ مسجلة في قاعدة البيانات حالياً',
      rulesNotice: 'قواعد الإعارة المطبقة: مدة الإعارة 14 يوماً وتجديدين كحد أقصى',
      holdForPickup: 'حجز مسبق للاستلام',
      joinWaitlist: 'انضمام لطابور الحجز',
      statusOptions: {
        available: 'متاح للإعارة',
        borrowed: 'مُعار حالياً',
        reserved: 'محجوز',
        maintenance: 'صيانة وتجليد',
      },
    },

    // Ratings & Reviews
    ratings: {
      title: 'تقييمات ومراجعات القراء',
      rateThisBook: 'قيّم هذا الكتاب',
      yourRating: 'تقييمك الحالي',
      updateRating: 'تحديث تقييمك',
      loginToRate: 'سجّل الدخول لكتابة تقييم ومراجعة',
      writeReviewPlaceholder: 'اكتب انطباعك أو مراجعتك المختصرة عن الكتاب (اختياري)...',
      submitBtn: 'إرسال التقييم',
      submitting: 'جاري الحفظ...',
      totalRatings: '{n} تقييم',
      noRatingsYet: 'لا توجد مراجعات مكتوبة بعد، كن أول من يقيّم هذا الكتاب!',
      ratingSuccess: 'تم حفظ تقييمك بنجاح ⭐',
      ratingError: 'تعذر حفظ التقييم، يرجى المحاولة مرة أخرى',
      stars1: 'ضعيف جداً',
      stars2: 'مقبول',
      stars3: 'جيد',
      stars4: 'جيد جداً',
      stars5: 'ممتاز / تحفة فكرية',
      breakdown: 'توزيع التقييمات',
      verifiedReader: 'قارئ معتمد',
      rateBookAction: 'تقييم الكتاب',
      averageScore: 'متوسط التقييم العام',
    },

    // AI Drawer
    ai: {
      drawerTitle: 'أمين المكتبة الذكي',
      drawerSubtitle: 'اكتشاف عناوين الفهرس وشرح السياسات المعتمدة',
      disclaimer: 'المساعد للاسترشاد والتوصية؛ العمليات الفعلية كالإعارة تدار عبر النظام.',
      recommendationBadge: 'توصية الفهرس الذكي:',
      thinking: 'جاري استرجاع الكتب من الفهرس وصياغة الشرح...',
      inputPlaceholder: 'اسأل عن عنوان، فكرة، أو سياسة الإعارة...',
      sendBtn: 'إرسال',
      viewBook: 'عرض',
      reserveBook: 'حجز',
      welcome: 'مرحباً بك في المساعد الذكي لمكتبتنا! 📚 يمكنني مساعدتك في العثور على الكتب المناسبة، وشرح سبب التوصية، أو توضيح سياسات الإعارة والاسترجاع المعتمدة.',
      suggestions: [
        'قصة غموض قصيرة للمبتدئين',
        'أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات',
        'روايات تاريخية عربية مشوقة',
        'ما هي مدة الإعارة وسياسة التجديد؟',
      ],
    },

    // Member Dashboard
    memberDashboard: {
      memberCode: 'رقم العضوية:',
      joinedAt: 'تاريخ الانضمام:',
      borrowLimit: 'الحد المسموح للاستعارة:',
      booksOfLimit: '{n} من أصل {max} كتب',
      finesDue: 'الغرامات المستحقة:',
      noFines: 'لا توجد غرامات',
      payNow: 'سداد الآن',
      activeLoans: 'إعاراتي النشطة',
      activeReservations: 'حجوزاتي المعلقة',
      renewBtn: 'طلب تجديد',
      renewalsLeft: 'التجديدات المتبقية: {n}',
      maxRenewalsReached: 'بلغت الحد الأقصى للتجديد',
      daysLeft: 'متبقي {n} يوم',
      dueToday: 'مستحق اليوم!',
      overdueBy: 'متأخر منذ {n} يوم',
      cancelHold: 'إلغاء الحجز',
      queuePosition: 'الترتيب في الطابور: #{n}',
      expiresAt: 'صلاحية الاستلام حتى:',
      noLoans: 'لا توجد إعارات جارية لديك حالياً',
      noReservations: 'لا توجد حجوزات معلقة',
      exploreCatalog: 'استكشف الفهرس',
    },

    // Staff Dashboard
    staffDashboard: {
      kpiCatalog: 'عناوين الفهرس',
      kpiCopies: '{n} نسخ مادية',
      kpiLoans: 'الإعارات الجارية',
      kpiAvailable: '{n} نسخ متاحة',
      kpiReservations: 'الحجوزات النشطة',
      kpiWaiting: 'في طوابير الانتظار',
      kpiOverdues: 'المتأخرات',
      kpiFines: '{n} ج.م غرامات',
      quickTitle: 'العمليات السريعة في مكتب الإعارة',
      issueMode: 'تسجيل إعارة كتاب',
      returnMode: 'إرجاع واستلام نسخة',
      barcodePlaceholder: 'امسح أو أدخل باركود النسخة (مثال: BC-101-01)',
      memberCodePlaceholder: 'رقم العضوية (مثال: MEM-2026-0042)',
      submitIssue: 'تأكيد الإعارة الفورية',
      submitReturn: 'تأكيد الإرجاع والاستلام',
      recentActivity: 'سجل العمليات والتدقيق المباشر',
      viewAllAudit: 'عرض سجل التدقيق الكامل',
      weeklyTraffic: 'نشاط الإعارة والإرجاع الأسبوعي',
      weeklyDesc: 'توزيع حركة الكتب المستعارة والمرجعة خلال أيام الأسبوع',
      inventorySnapshot: 'نظرة سريعة على المستودع',
      registeredMembers: 'إجمالي الأعضاء المسجلين',
      activeRate: 'نسبة الأعضاء النشطين',
      utilizationRate: 'معدل إشغال النسخ',
      daysOfWeek: {
        Sun: 'الأحد',
        Mon: 'الإثنين',
        Tue: 'الثلاثاء',
        Wed: 'الأربعاء',
        Thu: 'الخميس',
        Fri: 'الجمعة',
        Sat: 'السبت',
      },
    },

    // Circulation Desk
    circulation: {
      title: 'مكتب الإعارة والإرجاع',
      tabIssue: 'إعارة كتاب لعضو',
      tabReturn: 'استلام وإرجاع كتاب',
      memberLookup: 'بيانات العضو المستعير',
      copyLookup: 'النسخة المراد إعارتها',
      enterMemberCode: 'أدخل كود العضو (MEM-...)',
      enterBarcode: 'اختر أو امسح باركود النسخة (BC-...)',
      loanPeriodNote: 'فترة الإعارة القياسية: 14 يوماً من تاريخ اليوم',
      confirmIssueBtn: 'تأكيد الإعارة الفورية',
      confirmReturnBtn: 'تأكيد استلام النسخة',
      activeLoansTable: 'الإعارات الحالية قيد التداول',
      bookCol: 'الكتاب',
      borrowerCol: 'المستعير',
      issueDateCol: 'تاريخ الإعارة',
      dueDateCol: 'تاريخ الاستحقاق',
      actionCol: 'إجراء فوري',
      returnNowBtn: 'إرجاع الآن',
    },

    // Catalog Management
    catalogMgmt: {
      title: 'إدارة الفهرس والنسخ المادية',
      addNewBook: 'إضافة عنوان جديد',
      searchPlaceholder: 'بحث في الفهرس بالاسم، المؤلف، أو ISBN...',
      totalTitles: 'عناوين الفهرس: {n}',
      totalCopies: 'النسخ المادية: {n}',
      addCopy: 'إضافة نسخة',
      edit: 'تعديل',
      titleCol: 'العنوان والمؤلف',
      categoryCol: 'التصنيف',
      ratingCol: 'التقييم',
      copiesCol: 'النسخ',
      locationCol: 'الموقع الافتراضي',
    },

    // Reservations Page
    reservationsPage: {
      title: 'قائمة الحجوزات وطوابير الانتظار',
      activeHoldsList: 'الحجوزات النشطة في النظام',
      bookCol: 'اسم الكتاب',
      memberCol: 'اسم العضو',
      queueCol: 'الترتيب في الطابور',
      placedAtCol: 'تاريخ الطلب',
      expiresAtCol: 'صلاحية الاستلام حتى',
      cancelBtn: 'إلغاء الحجز',
      noReservations: 'لا توجد حجوزات نشطة حالياً في النظام',
    },

    // Overdues Page
    overduesPage: {
      title: 'المتأخرات والغرامات المالية',
      overdueLoansList: 'الكتب المتأخرة عن موعد الإرجاع',
      unpaidFinesList: 'سجل الغرامات المالية غير المسددة',
      bookCol: 'الكتاب',
      memberCol: 'المستعير',
      dueDateCol: 'تاريخ الاستحقاق',
      daysLateCol: 'أيام التأخير',
      fineAmountCol: 'الغرامة المستحقة',
      reasonCol: 'السبب',
      settleBtn: 'تحصيل وتسوية الغرامة',
      noOverdues: 'لا توجد إعارات متأخرة حالياً',
      noFines: 'لا توجد غرامات غير مسددة',
    },

    // Staff Management Page
    staffMgmt: {
      title: 'إدارة طاقم العمل والصلاحيات',
      addStaffBtn: 'إضافة موظف جديد',
      staffList: 'قائمة موظفي المكتبة والصلاحيات',
      nameCol: 'الاسم',
      emailCol: 'البريد الإلكتروني',
      roleCol: 'المسمى والدور',
      lastLoginCol: 'آخر تسجيل دخول',
      statusCol: 'الحالة',
    },

    // Policies Page
    policiesPage: {
      title: 'سياسات وقواعد الإعارة',
      maxBorrowLimit: 'الحد الأقصى للإعارة لكل عضو (كتب)',
      defaultLoanDays: 'مدة الإعارة القياسية (بالأيام)',
      maxRenewals: 'الحد الأقصى للتجديدات المسموحة',
      finePerDay: 'غرامة التأخير اليومية (ج.م/يوم)',
      reservationExpiryHours: 'مهلة استلام الحجز (بالساعات)',
      allowSelfRenewal: 'السماح بالتجديد الذاتي من حساب العضو',
      enableAILibrarian: 'تفعيل المساعد الذكي للاسترشاد الفهرسي',
      saveBtn: 'حفظ وتطبيق السياسات',
    },

    // Audit Log Page
    auditPage: {
      title: 'سجل التدقيق والإجراءات الرقابية',
      desc: 'توثيق زمني غير قابل للتعديل لجميع العمليات الحساسة من إعارة، استرجاع، تجديد، تسوية غرامات، وتعديل سياسات.',
      searchPlaceholder: 'ابحث بالاسم، تفاصيل الإجراء، أو رمز الكيان...',
      allActions: 'جميع الإجراءات',
      timeCol: 'التاريخ والوقت',
      actorCol: 'المستخدم المنفذ',
      roleCol: 'الدور',
      actionCol: 'نوع الإجراء',
      entityCol: 'الكيان المستهدف',
      detailsCol: 'تفاصيل الإجراء',
      noLogs: 'لا توجد سجلات مطابقة للبحث.',
      actions: {
        all: 'جميع الإجراءات',
        issueLoan: 'تسجيل إعارة',
        renewLoan: 'تجديد إعارة',
        returnCopy: 'إرجاع نسخة',
        placeHold: 'تسجيل حجز عنوان',
        cancelHold: 'إلغاء حجز',
        settleFine: 'تسوية غرامة',
        assessFine: 'احتساب غرامة تأخير',
        addNewBook: 'إضافة عنوان جديد',
        updatePolicies: 'تحديث سياسات النظام',
        modifyPolicies: 'تعديل السياسات',
      },
    },

    // Common words
    common: {
      search: 'بحث',
      cancel: 'إلغاء',
      close: 'إغلاق',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      view: 'عرض',
      actions: 'الإجراءات',
      all: 'الكل',
      loading: 'جاري التحميل...',
      days: 'أيام',
      day: 'يوم',
      sar: 'ج.م',
      egp: 'ج.م',
      books: 'كتب',
      copies: 'نسخ',
      of: 'من',
    },
  },

  en: {
    // App & Layout
    appName: 'Smart Library',
    appSubtitle: 'Smart Library Management System LMS 2026',
    sidebar: {
      logoTitle: 'Smart Library',
      logoVersion: 'LMS 2026',
      mainMenu: 'Main Menu',
      tools: 'Tools',
      aiAssistant: 'AI Assistant',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      toggleTheme: 'Toggle Theme',
      toggleLang: 'العربية',
      help: 'Help',
      userStaffName: 'Sulaiman Al-Mansoor',
      userStaffRole: 'Circulation Desk',
      userAdminName: 'Dr. Hesham Al-Rashed',
      userAdminRole: 'System Admin',
    },
    topbar: {
      searchPlaceholder: 'Search books, members, or ISBN...',
      filterTooltip: 'Advanced Filter',
      notifications: 'Notifications',
      newBadge: 'new',
      clearSearch: 'Clear search',
    },
    notificationsList: [
      {
        id: 1,
        title: 'Upcoming Due Date',
        text: 'Book "Clean Code" is due for return within 48 hours.',
        time: '2h ago',
      },
      {
        id: 2,
        title: 'Reservation Hold Notice',
        text: 'You are now #1 in queue for "Granada Trilogy".',
        time: '1d ago',
      },
      {
        id: 3,
        title: 'Catalog Updated',
        text: '4 new titles added to the AI & Technology section.',
        time: '2d ago',
      },
    ],

    // Roles
    roles: {
      member: 'Member Portal',
      staff: 'Librarian',
      admin: 'System Admin',
    },

    // Navigation Tabs
    nav: {
      catalog: 'Book Catalog',
      myLoans: 'My Loans & Reservations',
      dashboard: 'Dashboard',
      circulation: 'Circulation Desk',
      catalogMgmt: 'Catalog Management',
      reservations: 'Reservations',
      overdues: 'Overdues & Fines',
      staffMgmt: 'Staff Management',
      policies: 'Lending Policies',
      audit: 'Audit Log',
    },

    // Statuses
    status: {
      available: 'Available',
      reserved: 'Reserved',
      dueSoon: 'Due Soon',
      borrowed: 'Borrowed',
      issued: 'Issued',
      overdue: 'Overdue',
      maintenance: 'Maintenance',
      active: 'Active',
      blocked: 'Blocked',
      paid: 'Paid',
      unpaid: 'Unpaid',
      cancelled: 'Cancelled',
      returned: 'Returned',
    },

    // Catalog Page
    catalog: {
      aiBannerTitle: 'Explore Catalog with AI Assistant',
      aiBannerDesc: 'Describe what you wish to read in natural language (e.g. "beginner mystery novel" or "AI & machine learning guides") and the assistant will explain recommendations.',
      promptMystery: 'Beginner Mystery',
      promptAI: 'AI & Tech Books',
      searchPlaceholder: 'Search by title, author, topic, or ISBN...',
      filterAvailabilityAll: 'All Availability',
      filterAvailableNow: 'Available Now',
      filterBorrowedNow: 'Currently Borrowed',
      filterLangAll: 'All Languages',
      filterLangAr: 'Arabic',
      filterLangEn: 'English',
      sortRating: 'Highest Rated ⭐',
      sortYear: 'Newest First 📅',
      sortTitle: 'Alphabetical 🔤',
      categoriesLabel: 'Categories:',
      allCategories: 'All Categories',
      availableCount: 'Available Catalog Titles ({n})',
      resetFilters: 'Reset Filters',
      shelfLocationsNote: 'Showing book copies with live shelf locations',
      noBooksFound: 'No books match your search criteria',
      noBooksFoundDesc: 'Try adjusting your search terms, removing filters, or ask the AI Assistant for recommendations.',
      clearFilters: 'Clear Filters',
      searchWithAI: 'Search with AI Assistant',
    },

    // Book Card
    bookCard: {
      availableCount: '{n} Available',
      fullyBorrowed: 'Fully Borrowed',
      location: 'Location:',
      availableCopies: 'Available Copies:',
      copiesOfTotal: '{n} of {total}',
      viewCopies: 'View Copies',
      placeHold: 'Place Hold',
      joinQueue: 'Join Queue',
      ratingLabel: 'Reader Rating',
    },

    // Book Details Modal
    modal: {
      title: 'Book Details & Physical Copies',
      close: 'Close',
      by: 'By:',
      publisher: 'Publisher:',
      pubYear: 'Publication Year:',
      language: 'Language:',
      activeHolds: 'There are currently {n} active hold requests in the waiting queue for this title.',
      physicalCopiesTitle: 'Physical Item Copies ({n} copies)',
      defaultShelf: 'Default Shelf Location:',
      barcodeCol: 'Barcode',
      shelfCol: 'Shelf Location',
      statusCol: 'Operating Status',
      staffActionCol: 'Staff Action',
      noCopiesRegistered: 'No registered copies in the database',
      rulesNotice: 'Applicable lending rules: 14-day duration, max 2 renewals',
      holdForPickup: 'Hold for Pickup',
      joinWaitlist: 'Join Waiting Queue',
      statusOptions: {
        available: 'Available to Borrow',
        borrowed: 'Currently Borrowed',
        reserved: 'Reserved',
        maintenance: 'Maintenance & Repair',
      },
    },

    // Ratings & Reviews
    ratings: {
      title: 'Reader Ratings & Reviews',
      rateThisBook: 'Rate this book',
      yourRating: 'Your rating',
      updateRating: 'Update your rating',
      loginToRate: 'Sign in to rate and review this book',
      writeReviewPlaceholder: 'Share your thoughts or a brief review (optional)...',
      submitBtn: 'Submit Rating',
      submitting: 'Saving...',
      totalRatings: '{n} ratings',
      noRatingsYet: 'No written reviews yet. Be the first to review this book!',
      ratingSuccess: 'Your rating was submitted successfully ⭐',
      ratingError: 'Failed to submit rating, please try again',
      stars1: 'Poor',
      stars2: 'Fair',
      stars3: 'Good',
      stars4: 'Very Good',
      stars5: 'Masterpiece',
      breakdown: 'Rating Distribution',
      verifiedReader: 'Verified Reader',
      rateBookAction: 'Rate Book',
      averageScore: 'Overall Reader Rating',
    },

    // AI Drawer
    ai: {
      drawerTitle: 'Smart AI Librarian',
      drawerSubtitle: 'Catalog discovery & lending policy clarification',
      disclaimer: 'Assistant is for guidance & recommendations; actual loans are executed via the LMS.',
      recommendationBadge: 'AI Catalog Recommendation:',
      thinking: 'Retrieving titles from catalog and generating recommendations...',
      inputPlaceholder: 'Ask for a title, topic, or lending policy...',
      sendBtn: 'Send',
      viewBook: 'View',
      reserveBook: 'Reserve',
      welcome: 'Welcome to the Smart Library AI Assistant! 📚 I can help you find suitable books, explain recommendations, or clarify lending and return policies.',
      suggestions: [
        'Short mystery stories for beginners',
        'Top AI & software engineering references',
        'Compelling historical literature',
        'What is the loan duration and renewal policy?',
      ],
    },

    // Member Dashboard
    memberDashboard: {
      memberCode: 'Member Code:',
      joinedAt: 'Member Since:',
      borrowLimit: 'Borrowing Limit:',
      booksOfLimit: '{n} of {max} books',
      finesDue: 'Outstanding Fines:',
      noFines: 'No pending fines',
      payNow: 'Pay Now',
      activeLoans: 'My Active Loans',
      activeReservations: 'My Pending Reservations',
      renewBtn: 'Request Renewal',
      renewalsLeft: 'Renewals left: {n}',
      maxRenewalsReached: 'Max renewals reached',
      daysLeft: '{n} days left',
      dueToday: 'Due today!',
      overdueBy: 'Overdue by {n} days',
      cancelHold: 'Cancel Hold',
      queuePosition: 'Queue Position: #{n}',
      expiresAt: 'Pickup Expiration:',
      noLoans: 'You have no active loans right now',
      noReservations: 'No pending reservations',
      exploreCatalog: 'Explore Catalog',
    },

    // Staff Dashboard
    staffDashboard: {
      kpiCatalog: 'Catalog Titles',
      kpiCopies: '{n} physical copies',
      kpiLoans: 'Active Loans',
      kpiAvailable: '{n} available copies',
      kpiReservations: 'Active Reservations',
      kpiWaiting: 'In waiting queues',
      kpiOverdues: 'Overdues',
      kpiFines: '{n} EGP fines',
      quickTitle: 'Quick Circulation Desk Actions',
      issueMode: 'Issue Book Loan',
      returnMode: 'Return & Check-in Copy',
      barcodePlaceholder: 'Scan or enter copy barcode (e.g. BC-101-01)',
      memberCodePlaceholder: 'Member code (e.g. MEM-2026-0042)',
      submitIssue: 'Confirm Immediate Issue',
      submitReturn: 'Confirm Return & Check-in',
      recentActivity: 'Live Operations & Audit Stream',
      viewAllAudit: 'View Full Audit Log',
      weeklyTraffic: 'Weekly Circulation Activity',
      weeklyDesc: 'Distribution of check-outs and returns across the week',
      inventorySnapshot: 'Inventory Snapshot',
      registeredMembers: 'Registered Members',
      activeRate: 'Active Member Rate',
      utilizationRate: 'Collection Utilization',
      daysOfWeek: {
        Sun: 'Sun',
        Mon: 'Mon',
        Tue: 'Tue',
        Wed: 'Wed',
        Thu: 'Thu',
        Fri: 'Fri',
        Sat: 'Sat',
      },
    },

    // Circulation Desk
    circulation: {
      title: 'Circulation Desk',
      tabIssue: 'Issue Loan to Member',
      tabReturn: 'Return & Check-in Copy',
      memberLookup: 'Borrower Member Details',
      copyLookup: 'Item Copy to Issue',
      enterMemberCode: 'Enter Member Code (MEM-...)',
      enterBarcode: 'Select or scan item barcode (BC-...)',
      loanPeriodNote: 'Standard loan period: 14 days from today',
      confirmIssueBtn: 'Confirm Immediate Issue',
      confirmReturnBtn: 'Confirm Return & Check-in',
      activeLoansTable: 'Current Circulating Loans',
      bookCol: 'Book Title',
      borrowerCol: 'Borrower',
      issueDateCol: 'Issue Date',
      dueDateCol: 'Due Date',
      actionCol: 'Immediate Action',
      returnNowBtn: 'Return Now',
    },

    // Catalog Management
    catalogMgmt: {
      title: 'Catalog & Physical Copies Management',
      addNewBook: 'Add New Title',
      searchPlaceholder: 'Search catalog by title, author, or ISBN...',
      totalTitles: 'Catalog Titles: {n}',
      totalCopies: 'Physical Copies: {n}',
      addCopy: 'Add Copy',
      edit: 'Edit',
      titleCol: 'Title & Author',
      categoryCol: 'Category',
      ratingCol: 'Rating',
      copiesCol: 'Copies',
      locationCol: 'Default Shelf',
    },

    // Reservations Page
    reservationsPage: {
      title: 'Reservations & Hold Queue',
      activeHoldsList: 'Active System Holds',
      bookCol: 'Book Title',
      memberCol: 'Member Name',
      queueCol: 'Queue Order',
      placedAtCol: 'Placed Date',
      expiresAtCol: 'Hold Expiration',
      cancelBtn: 'Cancel Reservation',
      noReservations: 'No active reservations in the system right now',
    },

    // Overdues Page
    overduesPage: {
      title: 'Overdues & Outstanding Fines',
      overdueLoansList: 'Overdue Circulating Books',
      unpaidFinesList: 'Unpaid Fines Ledger',
      bookCol: 'Book',
      memberCol: 'Borrower',
      dueDateCol: 'Due Date',
      daysLateCol: 'Days Late',
      fineAmountCol: 'Fine Due',
      reasonCol: 'Reason',
      settleBtn: 'Settle & Collect Fine',
      noOverdues: 'No overdue loans at this moment',
      noFines: 'No unpaid fines',
    },

    // Staff Management Page
    staffMgmt: {
      title: 'Staff & Roles Management',
      addStaffBtn: 'Add Staff Member',
      staffList: 'Library Staff Roster & Permissions',
      nameCol: 'Name',
      emailCol: 'Email',
      roleCol: 'Role & Title',
      lastLoginCol: 'Last Login',
      statusCol: 'Status',
    },

    // Policies Page
    policiesPage: {
      title: 'Lending Rules & System Policies',
      maxBorrowLimit: 'Max Borrow Limit per Member (Books)',
      defaultLoanDays: 'Standard Loan Duration (Days)',
      maxRenewals: 'Max Allowed Renewals',
      finePerDay: 'Daily Overdue Fine (EGP/Day)',
      reservationExpiryHours: 'Hold Pickup Window (Hours)',
      allowSelfRenewal: 'Allow Self-Renewal from Member Portal',
      enableAILibrarian: 'Enable AI Librarian for Catalog Discovery',
      saveBtn: 'Save & Apply Policies',
    },

    // Audit Log Page
    auditPage: {
      title: 'Audit Log & Compliance Trail',
      desc: 'Immutable chronological record of all sensitive operations: check-outs, returns, renewals, fines settlement, and policy updates.',
      searchPlaceholder: 'Search by actor, action details, or entity code...',
      allActions: 'All Actions',
      timeCol: 'Date & Time',
      actorCol: 'Executing User',
      roleCol: 'Role',
      actionCol: 'Action Type',
      entityCol: 'Target Entity',
      detailsCol: 'Action Details',
      noLogs: 'No logs match your search criteria.',
      actions: {
        all: 'All Actions',
        issueLoan: 'Issue Loan',
        renewLoan: 'Renew Loan',
        returnCopy: 'Return Copy',
        placeHold: 'Place Hold',
        cancelHold: 'Cancel Reservation',
        settleFine: 'Settle Fine',
        assessFine: 'Assess Overdue Fine',
        addNewBook: 'Add New Title',
        updatePolicies: 'Update System Policies',
        modifyPolicies: 'Update Policies',
      },
    },

    // Common words
    common: {
      search: 'Search',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      actions: 'Actions',
      all: 'All',
      loading: 'Loading...',
      days: 'days',
      day: 'day',
      sar: 'EGP',
      egp: 'EGP',
      books: 'books',
      copies: 'copies',
      of: 'of',
    },
  },
};

// Category mapping helper
export const categoryTranslations = {
  'تاريخ وفلسفة': { ar: 'تاريخ وفلسفة', en: 'History & Philosophy' },
  'ذكاء اصطناعي وتكنولوجيا': { ar: 'ذكاء اصطناعي وتكنولوجيا', en: 'AI & Technology' },
  'روايات وأدب': { ar: 'روايات وأدب', en: 'Literature & Fiction' },
  'غموض وبوليسي': { ar: 'غموض وبوليسي', en: 'Mystery & Crime' },
  'إدارة وتطوير الذات': { ar: 'إدارة وتطوير الذات', en: 'Self-Development & Management' },
};

export function getCategoryLabel(cat, lang = 'ar') {
  if (cat === 'all') {
    return lang === 'ar' ? 'جميع التصنيفات' : 'All Categories';
  }
  const match = categoryTranslations[cat];
  if (match) return match[lang] || match.ar;
  return cat;
}

// Shelf location mapping helper
export function getShelfLocation(location, lang = 'ar') {
  if (!location) return '';
  if (lang === 'ar') return location;

  return location
    .replace('جناح التاريخ - رف', 'History Wing - Shelf')
    .replace('جناح التقنية - رف', 'Tech Wing - Shelf')
    .replace('جناح الروايات - رف', 'Novels Wing - Shelf')
    .replace('جناح الغموض - رف', 'Mystery Wing - Shelf')
    .replace('جناح تطوير الذات - رف', 'Self-Dev Wing - Shelf')
    .replace('مكتب الحجوزات', 'Holds Pickup Desk')
    .replace('ورشة التجليد والصيانة', 'Binding & Repair Workshop');
}

// Audit localized mapping helpers
export function getAuditAction(action, lang = 'ar') {
  if (!action) return '';
  if (lang === 'ar') return action;
  const actionMap = {
    'تسجيل إعارة': 'Issue Loan',
    'تجديد إعارة': 'Renew Loan',
    'إرجاع نسخة': 'Return Copy',
    'تسجيل حجز عنوان': 'Place Hold',
    'إلغاء حجز': 'Cancel Reservation',
    'تسوية غرامة': 'Settle Fine',
    'احتساب غرامة تأخير': 'Assess Overdue Fine',
    'إضافة عنوان جديد': 'Add New Title',
    'تحديث سياسات النظام': 'Update System Policies',
    'تعديل السياسات': 'Update Policies',
  };
  return actionMap[action] || action;
}

export function getAuditRole(role, lang = 'ar') {
  if (!role) return '';
  if (lang === 'en') {
    const roleEnMap = {
      'Member': 'Member',
      'Librarian': 'Librarian',
      'Admin': 'System Admin',
      'System': 'System',
      'عضو': 'Member',
      'أمين مكتبة': 'Librarian',
      'مدير نظام': 'System Admin',
    };
    return roleEnMap[role] || role;
  }
  const roleArMap = {
    'Member': 'عضو',
    'Librarian': 'أمين مكتبة',
    'Admin': 'مدير نظام',
    'System': 'نظام آلي',
  };
  return roleArMap[role] || role;
}

export function getAuditEntity(type, lang = 'ar') {
  if (!type) return '';
  if (lang === 'en') {
    const map = {
      'Loan': 'Loan',
      'Reservation': 'Reservation',
      'Fine': 'Fine',
      'Book': 'Book',
      'Policy': 'Policy',
      'إعارة': 'Loan',
      'حجز': 'Reservation',
      'غرامة': 'Fine',
      'كتاب': 'Book',
      'سياسة': 'Policy',
    };
    return map[type] || type;
  }
  const map = {
    'Loan': 'إعارة',
    'Reservation': 'حجز',
    'Fine': 'غرامة',
    'Book': 'عنوان كتاب',
    'Policy': 'سياسة إعارة',
  };
  return map[type] || type;
}

// Deep get helper for translation keys e.g. "catalog.aiBannerTitle"
export function translate(keyPath, lang = 'ar', params = {}) {
  const dict = translations[lang] || translations.ar;
  const parts = keyPath.split('.');
  let current = dict;

  for (const part of parts) {
    if (current && current[part] !== undefined) {
      current = current[part];
    } else {
      // Fallback to Arabic or raw key
      const arDict = translations.ar;
      let arCurrent = arDict;
      for (const p of parts) {
        if (arCurrent && arCurrent[p] !== undefined) {
          arCurrent = arCurrent[p];
        } else {
          arCurrent = null;
          break;
        }
      }
      current = arCurrent || keyPath;
      break;
    }
  }

  if (typeof current !== 'string') {
    return current;
  }

  // Parameter replacement: {n}, {max}, {total}
  let result = current;
  Object.keys(params).forEach((paramKey) => {
    result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
  });

  return result;
}
