import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  initialBooks,
  initialBookCopies,
  initialMembers,
  initialLoans,
  initialReservations,
  initialFines,
  initialAuditLogs,
  initialStaff,
  initialPolicies
} from '../data/mockData';
import { translate } from '../data/translations';

const LibraryContext = createContext();

const tabRoutes = {
  circulation: '/librarian/circulation',
  'catalog-mgmt': '/librarian/catalog',
  reservations: '/librarian/reservations',
  overdues: '/librarian/overdues',
  dashboard: '/librarian',
  'staff-mgmt': '/admin',
  policies: '/admin/policies',
  audit: '/admin/audit',
  catalog: '/',
  'my-loans': '/my-loans'
};

export function LibraryProvider({ children }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const currentUser = auth?.currentUser;

  // Theme state: light or dark
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('library_theme') || 'light';
  });

  // Language state: ar (RTL) or en (LTR)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('library_lang') || 'ar';
  });

  // Current active role sourced from authentication (default to 'member' for public view)
  const currentRole = currentUser?.role || 'member';
  const setCurrentRole = useCallback(() => {}, []);

  // Current logged in member ID
  const currentMemberId = currentUser?.memberId || 1;

  // Active navigation tab with route dispatcher
  const [activeTab, setActiveTabState] = useState('catalog');

  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    if (tabRoutes[tab]) {
      navigate(tabRoutes[tab]);
    }
  }, [navigate]);

  // Entities
  const [books, setBooks] = useState(initialBooks);
  const [bookCopies, setBookCopies] = useState(initialBookCopies);
  const [members, setMembers] = useState(initialMembers);
  const [loans, setLoans] = useState(initialLoans);
  const [reservations, setReservations] = useState(initialReservations);
  const [fines, setFines] = useState(initialFines);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [staff, setStaff] = useState(initialStaff);
  const [policies, setPolicies] = useState(initialPolicies);

  // Modals & Drawers
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // AI Assistant conversation state
  const [aiMessages, setAiMessages] = useState(() => [
    {
      id: 1,
      sender: 'assistant',
      text: lang === 'en'
        ? 'Welcome to the Smart Library AI Assistant! 📚 I can help you find suitable books, explain recommendations, or clarify lending and return policies.'
        : 'مرحباً بك في المساعد الذكي لمكتبتنا! 📚 يمكنني مساعدتك في العثور على الكتب المناسبة، وشرح سبب التوصية، أو توضيح سياسات الإعارة والاسترجاع المعتمدة.',
      suggestions: lang === 'en'
        ? [
            'Short mystery stories for beginners',
            'Top AI & software engineering references',
            'Compelling historical literature',
            'What is the loan duration and renewal policy?'
          ]
        : [
            'قصة غموض قصيرة للمبتدئين',
            'أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات',
            'روايات تاريخية عربية مشوقة',
            'ما هي مدة الإعارة وسياسة التجديد؟'
          ],
      matchedBooks: []
    }
  ]);
  const [isAILoading, setIsAILoading] = useState(false);

  // Sync theme with DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('library_theme', theme);
  }, [theme]);

  // Sync language and dir with DOM & sync initial welcome message
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('library_lang', lang);

    setAiMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 1) {
        return [
          {
            id: 1,
            sender: 'assistant',
            text: lang === 'en'
              ? 'Welcome to the Smart Library AI Assistant! 📚 I can help you find suitable books, explain recommendations, or clarify lending and return policies.'
              : 'مرحباً بك في المساعد الذكي لمكتبتنا! 📚 يمكنني مساعدتك في العثور على الكتب المناسبة، وشرح سبب التوصية، أو توضيح سياسات الإعارة والاسترجاع المعتمدة.',
            suggestions: lang === 'en'
              ? [
                  'Short mystery stories for beginners',
                  'Top AI & software engineering references',
                  'Compelling historical literature',
                  'What is the loan duration and renewal policy?'
                ]
              : [
                  'قصة غموض قصيرة للمبتدئين',
                  'أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات',
                  'روايات تاريخية عربية مشوقة',
                  'ما هي مدة الإعارة وسياسة التجديد؟'
                ],
            matchedBooks: []
          }
        ];
      }
      return prev;
    });
  }, [lang]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Translation helper bound to current language
  const t = useCallback((keyPath, params = {}) => {
    return translate(keyPath, lang, params);
  }, [lang]);

  // Toast notification helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Book details modal handlers
  const openBookModal = (book) => setSelectedBook(book);
  const closeBookModal = () => setSelectedBook(null);

  // Audit log helper
  const recordAudit = (action, entityType, entityId, details, actionEn, detailsEn) => {
    const isMember = currentRole === 'member';
    const isStaff = currentRole === 'staff';
    const newEntry = {
      id: Date.now(),
      actor: isMember ? 'العضو (أحمد التميمي)' : isStaff ? 'أمين الإعارة (سليمان)' : 'مدير النظام (د. هشام)',
      actor_en: isMember ? 'Member (Ahmed Al-Tamimi)' : isStaff ? 'Circulation Desk (Sulaiman)' : 'System Admin (Dr. Hesham)',
      actor_role: isMember ? 'Member' : isStaff ? 'Librarian' : 'Admin',
      action,
      action_en: actionEn || action,
      entity_type: entityType,
      entity_id: String(entityId),
      created_at: new Date().toISOString(),
      details,
      details_en: detailsEn || details
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Action: Reserve book
  const reserveBook = (bookId) => {
    if (!auth?.isAuthenticated) {
      addToast({
        type: 'warning',
        title: lang === 'en' ? 'Sign In Required' : 'تسجيل الدخول مطلوب',
        message: lang === 'en'
          ? 'Please log in to your account first to place a hold on this book.'
          : 'يرجى تسجيل الدخول أولاً لتتمكن من حجز الكتاب أو الانضمام لقائمة الانتظار.'
      });
      navigate('/login');
      return { success: false, requireAuth: true };
    }

    const book = books.find((b) => b.id === bookId);
    if (!book) return { success: false, message: 'الكتاب غير موجود' };

    const member = members.find((m) => m.id === currentMemberId);
    if (!member) return { success: false, message: 'بيانات العضو غير متوفرة' };

    if (member.membership_status !== 'active') {
      addToast({
        type: 'error',
        title: 'تعذر الحجز',
        message: 'حساب العضو غير نشط أو موقوف حالياً'
      });
      return { success: false, message: 'العضو غير مؤهل للحجز' };
    }

    // Check if already reserved by member
    const existingRes = reservations.find(
      (r) => r.book_id === bookId && r.member_id === currentMemberId && r.status === 'active'
    );
    if (existingRes) {
      addToast({
        type: 'warning',
        title: 'حجز مكرر',
        message: 'لديك حجز نشط بالفعل لهذا العنوان في قائمة الانتظار'
      });
      return { success: false, message: 'مكرر' };
    }

    // Determine queue position
    const currentQueueCount = reservations.filter(
      (r) => r.book_id === bookId && r.status === 'active'
    ).length;
    const queuePosition = currentQueueCount + 1;

    const newRes = {
      id: Date.now(),
      book_id: bookId,
      book_title: book.title,
      member_id: currentMemberId,
      member_name: member.full_name,
      member_code: member.member_code,
      queue_position: queuePosition,
      status: 'active',
      placed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + policies.reservation_expiry_hours * 3600000).toISOString()
    };

    setReservations((prev) => [newRes, ...prev]);
    recordAudit('تسجيل حجز عنوان', 'Reservation', newRes.id, `حجز "${book.title}" للعضو ${member.full_name} في الدور #${queuePosition}`);

    addToast({
      type: 'success',
      title: 'تم تأكيد الحجز بنجاح',
      message: `تم حجز "${book.title}". دورك في قائمة الانتظار هو #${queuePosition}`
    });

    return { success: true, queuePosition };
  };

  // Action: Cancel reservation
  const cancelReservation = (reservationId) => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
    recordAudit('إلغاء حجز', 'Reservation', reservationId, `إلغاء حجز ${res.book_title}`);

    addToast({
      type: 'neutral',
      title: 'تم إلغاء الحجز',
      message: `تم إلغاء حجزك لكتاب "${res.book_title}"`
    });
  };

  // Action: Renew loan
  const renewLoan = (loanId) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { success: false, message: 'سجل الإعارة غير موجود' };

    // Check policy limits
    if (loan.renew_count >= policies.max_renewals) {
      addToast({
        type: 'error',
        title: 'تجاوز الحد المسموح',
        message: `تم الوصول إلى الحد الأقصى للتجديد (${policies.max_renewals} مرات) وفق سياسة المكتبة`
      });
      return { success: false, message: 'تجاوز حد التجديد' };
    }

    if (loan.status === 'overdue') {
      addToast({
        type: 'error',
        title: 'تعذر التجديد',
        message: 'لا يمكن تجديد كتاب متأخر بالفعل؛ يرجى مراجعة أمين المكتبة وسداد الرسوم'
      });
      return { success: false, message: 'الكتاب متأخر' };
    }

    // Check if book has a waiting queue
    const hasReservations = reservations.some(
      (r) => r.book_id === loan.book_id && r.status === 'active'
    );
    if (hasReservations) {
      addToast({
        type: 'warning',
        title: 'الكتاب مطلوب في قائمة الانتظار',
        message: 'لا يمكن تجديد الإعارة لوجود أعضاء آخرين في طابور الحجز لهذا العنوان'
      });
      return { success: false, message: 'مطلوب في طابور الحجز' };
    }

    // Extend due date by policy loan days
    const currentDue = new Date(loan.due_at).getTime();
    const extendedDue = new Date(currentDue + policies.default_loan_days * 86400000).toISOString();

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              due_at: extendedDue,
              renew_count: l.renew_count + 1
            }
          : l
      )
    );

    recordAudit('تجديد إعارة', 'Loan', loanId, `تمديد موعد استحقاق "${loan.book_title}" بنجاح إلى ${new Date(extendedDue).toLocaleDateString('ar-EG')}`);

    addToast({
      type: 'success',
      title: 'تم تجديد الإعارة بنجاح',
      message: `تم تمديد فترة إعارة "${loan.book_title}" لمدة ${policies.default_loan_days} يوماً إضافية`
    });

    return { success: true };
  };

  // Staff Action: Issue book copy to member
  const issueLoan = (barcode, memberCode) => {
    const copy = bookCopies.find((c) => c.barcode.trim().toUpperCase() === barcode.trim().toUpperCase());
    if (!copy) {
      addToast({ type: 'error', title: 'خطأ بالباركود', message: 'لم يتم العثور على نسخة مطابقة لهذا الباركود' });
      return { success: false, message: 'النسخة غير موجودة' };
    }

    if (copy.status !== 'available') {
      addToast({
        type: 'error',
        title: 'تعارض النسخة',
        message: `النسخة ${copy.barcode} غير متاحة حالياً (الحالة الحالية: ${copy.status === 'borrowed' ? 'مُعارة بالفعل' : copy.status})`
      });
      return { success: false, message: 'النسخة غير متاحة' };
    }

    const member = members.find((m) => m.member_code.trim().toUpperCase() === memberCode.trim().toUpperCase());
    if (!member) {
      addToast({ type: 'error', title: 'خطأ برقم العضو', message: 'لم يتم العثور على عضو بهذا الرمز' });
      return { success: false, message: 'العضو غير موجود' };
    }

    if (member.membership_status !== 'active') {
      addToast({ type: 'error', title: 'عضوية معلقة', message: 'حساب هذا العضو معلق أو موقوف بسبب غرامات متأخرة' });
      return { success: false, message: 'العضو غير نشط' };
    }

    if (member.active_loans_count >= policies.max_borrow_limit) {
      addToast({
        type: 'error',
        title: 'تجاوز حد الاستعارة',
        message: `العضو استنفد الحد الأقصى للإعارات المتزامنة (${policies.max_borrow_limit} كتب)`
      });
      return { success: false, message: 'تجاوز الحد' };
    }

    const book = books.find((b) => b.id === copy.book_id);
    const newDueDate = new Date(Date.now() + policies.default_loan_days * 86400000).toISOString();

    const newLoan = {
      id: Date.now(),
      copy_id: copy.id,
      book_id: copy.book_id,
      book_title: book ? book.title : 'كتاب غير معروف',
      book_author: book ? book.author : '',
      copy_barcode: copy.barcode,
      member_id: member.id,
      member_name: member.full_name,
      member_code: member.member_code,
      issued_by: 'أمين الإعارة (سليمان العبدلي)',
      issued_at: new Date().toISOString(),
      due_at: newDueDate,
      returned_at: null,
      renew_count: 0,
      status: 'issued'
    };

    // Update states
    setLoans((prev) => [newLoan, ...prev]);
    setBookCopies((prev) =>
      prev.map((c) => (c.id === copy.id ? { ...c, status: 'borrowed' } : c))
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === copy.book_id
          ? { ...b, available_copies: Math.max(0, b.available_copies - 1) }
          : b
      )
    );
    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id
          ? { ...m, active_loans_count: m.active_loans_count + 1 }
          : m
      )
    );

    recordAudit('إعارة نسخة', 'Loan', newLoan.id, `إعارة ${copy.barcode} (${newLoan.book_title}) للعضو ${member.full_name}`);

    addToast({
      type: 'success',
      title: 'تم تسجيل الإعارة بنجاح',
      message: `تم صرف النسخة ${copy.barcode} للعضو ${member.full_name}`
    });

    return { success: true };
  };

  // Staff Action: Return book copy
  const returnLoan = (barcode) => {
    const copy = bookCopies.find((c) => c.barcode.trim().toUpperCase() === barcode.trim().toUpperCase());
    if (!copy) {
      addToast({ type: 'error', title: 'خطأ', message: 'لم يتم العثور على النسخة' });
      return { success: false, message: 'غير موجود' };
    }

    const activeLoan = loans.find(
      (l) => l.copy_barcode.trim().toUpperCase() === barcode.trim().toUpperCase() && !l.returned_at
    );

    if (!activeLoan) {
      addToast({ type: 'warning', title: 'تنبيه', message: 'هذه النسخة ليست في حالة إعارة نشطة حالياً' });
      return { success: false, message: 'ليست معارة' };
    }

    const returnDate = new Date();
    const isLate = returnDate.getTime() > new Date(activeLoan.due_at).getTime();

    // If late, compute fine
    if (isLate) {
      const daysLate = Math.ceil((returnDate.getTime() - new Date(activeLoan.due_at).getTime()) / 86400000);
      const fineAmount = daysLate * policies.fine_per_day;
      const newFine = {
        id: Date.now(),
        loan_id: activeLoan.id,
        member_id: activeLoan.member_id,
        member_name: activeLoan.member_name,
        member_code: activeLoan.member_code,
        book_title: activeLoan.book_title,
        amount: fineAmount,
        status: 'unpaid',
        assessed_at: returnDate.toISOString(),
        settled_at: null,
        reason: `تأخير إعادة ${daysLate} يوم (${daysLate} × ${policies.fine_per_day} ر.س)`
      };
      setFines((prev) => [newFine, ...prev]);
      setMembers((prev) =>
        prev.map((m) =>
          m.id === activeLoan.member_id
            ? { ...m, fines_due: m.fines_due + fineAmount }
            : m
        )
      );
      addToast({
        type: 'warning',
        title: 'تم الإرجاع مع غرامة تأخير',
        message: `تم استلام النسخة، وسُجلت غرامة تأخير قدرها ${fineAmount} ر.س (${daysLate} يوم تأخير)`
      });
    } else {
      addToast({
        type: 'success',
        title: 'تم استلام النسخة بنجاح',
        message: `تم إعادة نسخة "${activeLoan.book_title}" في الموعد المحدد`
      });
    }

    // Check if book has reservations waiting
    const hasPendingRes = reservations.some(
      (r) => r.book_id === activeLoan.book_id && r.status === 'active'
    );

    const nextCopyStatus = hasPendingRes ? 'reserved' : 'available';

    setLoans((prev) =>
      prev.map((l) =>
        l.id === activeLoan.id
          ? { ...l, returned_at: returnDate.toISOString(), status: 'returned' }
          : l
      )
    );

    setBookCopies((prev) =>
      prev.map((c) => (c.id === copy.id ? { ...c, status: nextCopyStatus } : c))
    );

    setBooks((prev) =>
      prev.map((b) =>
        b.id === copy.book_id
          ? { ...b, available_copies: nextCopyStatus === 'available' ? b.available_copies + 1 : b.available_copies }
          : b
      )
    );

    setMembers((prev) =>
      prev.map((m) =>
        m.id === activeLoan.member_id
          ? { ...m, active_loans_count: Math.max(0, m.active_loans_count - 1) }
          : m
      )
    );

    recordAudit('إرجاع نسخة', 'Loan', activeLoan.id, `استلام النسخة ${copy.barcode} من ${activeLoan.member_name}`);

    return { success: true };
  };

  // Staff Action: Settle fine
  const settleFine = (fineId) => {
    const fine = fines.find((f) => f.id === fineId);
    if (!fine) return;

    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId ? { ...f, status: 'paid', settled_at: new Date().toISOString() } : f
      )
    );

    setMembers((prev) =>
      prev.map((m) =>
        m.id === fine.member_id
          ? {
              ...m,
              fines_due: Math.max(0, m.fines_due - fine.amount),
              membership_status: m.membership_status === 'blocked' ? 'active' : m.membership_status
            }
          : m
      )
    );

    recordAudit('تسوية غرامة', 'Fine', fineId, `تحصيل وتسوية غرامة قدرها ${fine.amount} ر.س للعضو ${fine.member_name}`);

    addToast({
      type: 'success',
      title: 'تمت تسوية الغرامة',
      message: `تم سداد الغرامة بقيمة ${fine.amount} ر.س وإعادة تنشيط العضوية إن كانت معلقة`
    });
  };

  // Staff Action: Add new book
  const addBook = (newBook) => {
    const id = Date.now();
    const copiesCount = parseInt(newBook.initial_copies, 10) || 1;
    const bookRecord = {
      id,
      isbn: newBook.isbn,
      title: newBook.title,
      author: newBook.author,
      publisher: newBook.publisher || 'دار نشر معتمدة',
      publication_year: parseInt(newBook.publication_year, 10) || 2026,
      language: newBook.language || 'العربية',
      category: newBook.category || 'عام',
      cover_image: newBook.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      description: newBook.description || 'لا يوجد وصف مدخل لهذا العنوان.',
      shelf_location: newBook.shelf_location || 'جناح عام - رف G-01',
      total_copies: copiesCount,
      available_copies: copiesCount,
      rating: 5.0,
      match_keywords: [newBook.title, newBook.author, newBook.category]
    };

    // Generate physical copies
    const newCopies = [];
    for (let i = 1; i <= copiesCount; i++) {
      newCopies.push({
        id: Date.now() + i,
        book_id: id,
        barcode: `BC-${id % 1000}-${String(i).padStart(2, '0')}`,
        status: 'available',
        shelf_location: bookRecord.shelf_location
      });
    }

    setBooks((prev) => [bookRecord, ...prev]);
    setBookCopies((prev) => [...prev, ...newCopies]);

    recordAudit('إضافة عنوان جديد', 'Book', id, `إضافة "${bookRecord.title}" وإصدار ${copiesCount} نسخ باركود`);

    addToast({
      type: 'success',
      title: 'تمت إضافة الكتاب',
      message: `تم إدراج "${bookRecord.title}" بنجاح في الفهرس وتوليد ${copiesCount} نسخ مادية`
    });
  };

  // Staff Action: Update copy status
  const updateCopyStatus = (copyId, newStatus) => {
    const copy = bookCopies.find((c) => c.id === copyId);
    if (!copy) return;

    const oldStatus = copy.status;
    setBookCopies((prev) =>
      prev.map((c) => (c.id === copyId ? { ...c, status: newStatus } : c))
    );

    // Update book available count if going to or from available
    if (oldStatus === 'available' && newStatus !== 'available') {
      setBooks((prev) =>
        prev.map((b) => (b.id === copy.book_id ? { ...b, available_copies: Math.max(0, b.available_copies - 1) } : b))
      );
    } else if (oldStatus !== 'available' && newStatus === 'available') {
      setBooks((prev) =>
        prev.map((b) => (b.id === copy.book_id ? { ...b, available_copies: b.available_copies + 1 } : b))
      );
    }

    recordAudit('تعديل حالة نسخة', 'Copy', copyId, `تغيير حالة النسخة ${copy.barcode} إلى ${newStatus}`);

    addToast({
      type: 'neutral',
      title: 'تم تحديث حالة النسخة',
      message: `حالة النسخة ${copy.barcode} أصبحت: ${newStatus}`
    });
  };

  // Admin Action: Update policies
  const updatePolicies = (newPol) => {
    setPolicies(newPol);
    recordAudit('تحديث سياسات النظام', 'Policy', 'SYSTEM', 'تعديل قواعد الإعارة والحجز والرسوم');
    addToast({
      type: 'success',
      title: 'تم حفظ السياسات',
      message: 'تم تحديث إعدادات وقواعد الإعارة بنجاح في عموم النظام'
    });
  };

  // Admin Action: Add Staff member
  const addStaffMember = (staffData) => {
    const newStaff = {
      id: Date.now(),
      full_name: staffData.full_name,
      email: staffData.email,
      role: staffData.role,
      role_title: staffData.role_title,
      status: 'active',
      last_login: new Date().toISOString()
    };
    setStaff((prev) => [...prev, newStaff]);
    recordAudit('إضافة موظف جديد', 'Staff', newStaff.id, `إضافة الموظف ${newStaff.full_name} بدور ${newStaff.role_title}`);
    addToast({
      type: 'success',
      title: 'تمت إضافة الموظف',
      message: `تم إنشاء حساب للموظف ${newStaff.full_name}`
    });
  };

  // AI Assistant conversational request
  const sendAIMessage = (userInput) => {
    if (!userInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userInput
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setIsAILoading(true);

    setTimeout(() => {
      const q = userInput.toLowerCase();
      let matched = [];
      let explanation = '';
      let suggestions = [];

      // Logic simulating context retrieval and safe policy answers:
      const isEnglish = lang === 'en';

      if (q.includes('غموض') || q.includes('بوليسي') || q.includes('مبتدئ') || q.includes('mystery') || q.includes('detective') || q.includes('crime')) {
        matched = books.filter((b) => b.category.includes('غموض') || b.id === 5);
        explanation = isEnglish
          ? 'I recommend this captivating locked-room classic mystery, ideal for beginners due to its accessible pacing and deductive puzzle structure.'
          : 'اخترت لك قصة الغموض الكلاسيكية الأكثر تشويقاً وتناسب المبتدئين لأسلوبها السلس وجريمتها المحكمة داخل غرفة مغلقة.';
        suggestions = isEnglish
          ? ['Are copies available on the mystery shelf?', 'Recommend other historical fiction titles']
          : ['هل تتوفر نسخ في جناح الغموض؟', 'اقترح لي روايات أدبية أخرى'];
      } else if (q.includes('ذكاء') || q.includes('ai') || q.includes('برمج') || q.includes('كود') || q.includes('software') || q.includes('data') || q.includes('code')) {
        matched = books.filter((b) => b.category.includes('ذكاء') || b.id === 2 || b.id === 4 || b.id === 8);
        explanation = isEnglish
          ? 'Here are the premier technical volumes in our catalog covering AI, software craftsmanship, clean code practices, and data systems.'
          : 'هذه أبرز المراجع التقنية الأكثر تقييماً واستعارة في الفهرس لموضوعات الذكاء الاصطناعي وهندسة البرمجيات وقواعد البيانات الموثوقة.';
        suggestions = isEnglish
          ? ['What are due dates for checked-out books?', 'How do I renew a technical book?']
          : ['ما هي مواعيد استحقاق الكتب المعارة؟', 'كيف أطلب تجديد كتاب تقني؟'];
      } else if (q.includes('تاريخ') || q.includes('حضار') || q.includes('أندلس') || q.includes('ابن خلدون') || q.includes('history') || q.includes('andalus') || q.includes('philosophy')) {
        matched = books.filter((b) => b.id === 1 || b.id === 3 || b.id === 7);
        explanation = isEnglish
          ? 'Here are landmark historical and literary works combining deep philosophical insight with compelling generational storytelling.'
          : 'إليك أبرز المصنفات التاريخية والأدبية التي تجمع بين البعد الفلسفي والتوثيق الملحمي الممتع.';
        suggestions = isEnglish
          ? ['Is The Muqaddimah currently available?', 'Suggest a self-development book']
          : ['هل كتاب مقدمة ابن خلدون متاح الآن؟', 'اقترح لي كتاب في تطوير الذات'];
      } else if (q.includes('سياس') || q.includes('تجديد') || q.includes('مدة') || q.includes('غرام') || q.includes('قانون') || q.includes('policy') || q.includes('renew') || q.includes('fine') || q.includes('rule')) {
        explanation = isEnglish
          ? `Per official library policy: standard loan duration is ${policies.default_loan_days} days, with a maximum of ${policies.max_renewals} renewals provided there are no pending holds. The late return fine is ${policies.fine_per_day} SAR per overdue day.`
          : `وفقاً للسياسة المعتمدة في المكتبة: مدة الإعارة الأساسية هي ${policies.default_loan_days} يوماً، والحد الأقصى للتجديد هو ${policies.max_renewals} مرات بشرط عدم وجود حجز نشط للعنوان. غرامة التأخير تبلغ ${policies.fine_per_day} ر.س عن كل يوم تأخير.`;
        suggestions = isEnglish
          ? ['How can I hold a checked-out book?', 'View my currently borrowed books']
          : ['كيف أحجز عنواناً معاراً؟', 'عرض كتبي المعارة حالياً'];
      } else {
        // General search in books
        matched = books.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            (b.title_en && b.title_en.toLowerCase().includes(q)) ||
            b.author.toLowerCase().includes(q) ||
            (b.author_en && b.author_en.toLowerCase().includes(q)) ||
            b.category.toLowerCase().includes(q) ||
            (b.category_en && b.category_en.toLowerCase().includes(q)) ||
            b.match_keywords.some((k) => k.toLowerCase().includes(q))
        );

        if (matched.length > 0) {
          explanation = isEnglish
            ? `Found ${matched.length} book(s) related to your query in the library catalog:`
            : `وجدت ${matched.length} كتاب مرتبط باستفسارك في فهرس المكتبة الرسمي:`;
        } else {
          explanation = isEnglish
            ? "I didn't find exact book matches for those keywords in our catalog, but you can explore general categories or search by author name."
            : 'لم أعثر على كتب متطابقة تماماً مع هذه الكلمات في الفهرس المتاح حالياً، ولكن يمكنك استكشاف الفئات العامة أو البحث بواسطة اسم المؤلف.';
          suggestions = isEnglish
            ? ['Top self-development books', 'History & Philosophy titles', 'What is the standard loan period?']
            : ['أفضل كتب تطوير الذات المتاحة', 'كتب التاريخ والفلسفة', 'ما هي مدة الإعارة المسموحة؟'];
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: explanation,
        suggestions,
        matchedBooks: matched
      };

      setAiMessages((prev) => [...prev, botMsg]);
      setIsAILoading(false);
    }, 700);
  };

  const openAIDrawer = (prefill) => {
    setIsAIDrawerOpen(true);
    if (prefill) {
      sendAIMessage(prefill);
    }
  };

  const closeAIDrawer = () => setIsAIDrawerOpen(false);

  return (
    <LibraryContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLang,
        t,
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        currentMemberId,
        setCurrentMemberId,
        books,
        bookCopies,
        members,
        loans,
        reservations,
        fines,
        auditLogs,
        staff,
        policies,
        selectedBook,
        openBookModal,
        closeBookModal,
        isAIDrawerOpen,
        openAIDrawer,
        closeAIDrawer,
        aiMessages,
        isAILoading,
        sendAIMessage,
        toasts,
        addToast,
        removeToast,
        reserveBook,
        cancelReservation,
        renewLoan,
        issueLoan,
        returnLoan,
        settleFine,
        addBook,
        updateCopyStatus,
        updatePolicies,
        addStaffMember
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
