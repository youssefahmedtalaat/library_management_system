import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRightLeft,
  ArrowUp,
  BarChart3,
  Barcode,
  Bell,
  BookMarked,
  BookOpen,
  BookmarkCheck,
  Bot,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  Globe,
  Hash,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Moon,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { api } from "./services/api";

const copy = {
  ar: {
    catalog: "فهرس الكتب",
    loans: "إعاراتي وحجوزاتي",
    assistant: "المساعد الذكي",
    signIn: "تسجيل الدخول",
    search: "ابحث بالعنوان أو المؤلف أو ISBN...",
    allBooks: "كل الكتب",
    available: "متاح الآن",
    allCategories: "كل التصنيفات",
    results: "كتاب متاح",
    view: "عرض النسخ",
    hold: "حجز مسبق",
    queue: "انضم للطابور",
    by: "بقلم",
  },
  en: {
    catalog: "Book Catalog",
    loans: "My Loans & Reservations",
    assistant: "AI Assistant",
    signIn: "Sign In",
    search: "Search by title, author, or ISBN...",
    allBooks: "All books",
    available: "Available now",
    allCategories: "All categories",
    results: "books available",
    view: "View Copies",
    hold: "Place Hold",
    queue: "Join Queue",
    by: "by",
  },
};

const defaultCovers = [
  "https://images.unsplash.com/photo-1603058817990-2b9a9abbce86?auto=format&fit=crop&w=800&q=82",
  "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=800&q=82",
  "https://images.unsplash.com/photo-1502485019198-a625bd53ceb7?auto=format&fit=crop&w=800&q=82",
  "https://images.unsplash.com/photo-1600181982553-ce7d36051c01?auto=format&fit=crop&w=800&q=82",
  "https://images.unsplash.com/photo-1535905496755-26ae35d0ae54?auto=format&fit=crop&w=800&q=82",
  "https://images.unsplash.com/photo-1625053376622-e462848c453f?auto=format&fit=crop&w=800&q=82",
];

const initialBooks = [
  { id: 1, title: "الذكاء الاصطناعي: مدخل حديث", en: "Artificial Intelligence: A Modern Approach", author: "ستيوارت راسل وبيتر نورفيغ", category: "ذكاء اصطناعي وتكنولوجيا", rating: 4.8, reviews: 124, available: 3, total: 5, shelf: "جناح التقنية · رف CS-12", isbn: "978-0134610993", year: "2024", cover: defaultCovers[0], description: "المرجع الجامعي الأوسع انتشاراً عالمياً لتدريس الذكاء الاصطناعي، يغطي الوكلاء وتعلم الآلة والشبكات العصبية." },
  { id: 2, title: "مائة عام من العزلة", en: "One Hundred Years of Solitude", author: "غابرييل غارسيا ماركيز", category: "روايات وأدب", rating: 4.7, reviews: 96, available: 0, total: 4, shelf: "جناح الأدب · رف L-08", isbn: "978-0060883287", year: "2020", cover: defaultCovers[1], description: "رواية كلاسيكية ملحمية تتتبع أجيال عائلة بوينديا في قرية ماكوندو المعزولة وتجسد الواقعية السحرية." },
  { id: 3, title: "تاريخ موجز للزمان", en: "A Brief History of Time", author: "ستيفن هوكينغ", category: "تاريخ وفلسفة", rating: 4.6, reviews: 82, available: 2, total: 3, shelf: "جناح العلوم · رف S-04", isbn: "978-0553380163", year: "2019", cover: defaultCovers[2], description: "رحلة استكشافية لفهم الكون، الانفجار العظيم، الثقوب السوداء، وطبيعة الزمان والمكان للمبتدئين والباحثين." },
  { id: 4, title: "جريمة في قطار الشرق السريع", en: "Murder on the Orient Express", author: "أجاثا كريستي", category: "غموض وبوليسي", rating: 4.5, reviews: 71, available: 1, total: 3, shelf: "جناح الروايات · رف M-11", isbn: "978-0062693662", year: "2017", cover: defaultCovers[3], description: "واحدة من أشهر روايات التحقيق الكلاسيكية، يواجه فيها المحقق هرقل بوارو لغز جريمة غامضة داخل قطار ثلجي." },
  { id: 5, title: "العادات الذرية: تغييرات صغيرة لنتائج مبهرة", en: "Atomic Habits", author: "جيمس كلير", category: "إدارة وتطوير الذات", rating: 4.9, reviews: 148, available: 4, total: 6, shelf: "جناح الإدارة · رف B-03", isbn: "978-0735211292", year: "2021", cover: defaultCovers[4], description: "إطار عملي علمي يعلمك كيف تكتسب عادات جيدة وتتخلص من السيئة عبر تحسينات صغيرة بنسبة 1% تتراكم لتحدث تحولاً كبيراً." },
  { id: 6, title: "مقدمة ابن خلدون: ديوان المبتدأ والخبر", en: "The Muqaddimah", author: "عبد الرحمن ابن خلدون", category: "تاريخ وفلسفة", rating: 4.7, reviews: 59, available: 2, total: 2, shelf: "جناح التاريخ · رف H-04", isbn: "978-0691166285", year: "2015", cover: defaultCovers[5], description: "المصنف التأسيسي في علم الاجتماع وفلسفة التاريخ والعمران البشري، يتناول طبائع العمران والدول وأسباب نهوض وسقوط الحضارات." },
];

function Button({ children, variant = "secondary", onClick, type = "button", disabled = false, className = "" }) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function Badge({ status = "neutral", children }) {
  const icons = { available: CheckCircle2, borrowed: BookOpen, reserved: Clock, overdue: AlertCircle, neutral: Hash };
  const Icon = icons[status] || Hash;
  return (
    <span className={`badge badge-${status}`}>
      <Icon size={13} />
      {children}
    </span>
  );
}

function Logo({ compact = false }) {
  return (
    <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
      <span className="logo-mark"><BookOpen size={21} /></span>
      {!compact && (
        <span>
          <b>المكتبة الذكية</b>
          <small>Smart Library <em>LMS 2026</em></small>
        </span>
      )}
    </div>
  );
}

function navigate(path) {
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function PublicNav({ lang, setLang, dark, setDark, onAI, onMenu, mobileOpen, currentUser, onLogout }) {
  const t = copy[lang];
  return (
    <header className="public-nav">
      <Logo />
      <nav className="nav-links">
        <button className="nav-link active" onClick={() => navigate("/")}><BookOpen size={17} />{t.catalog}</button>
        <button className="nav-link" onClick={() => navigate("/my-loans")}><Clock size={17} />{t.loans}<span className="count">3</span></button>
        <button className="nav-link ai-link" onClick={onAI}><Sparkles size={17} />{t.assistant}</button>
      </nav>
      <div className="nav-tools">
        <Button variant="ghost" className="icon-btn" onClick={() => setDark(!dark)} title="تبديل المظهر">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button variant="ghost" onClick={() => setLang(lang === "ar" ? "en" : "ar")} title="Change Language">
          <Globe size={17} />{lang === "ar" ? "EN" : "ع"}
        </Button>
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {currentUser.role === "admin" && (
              <Button variant="secondary" onClick={() => navigate("/admin")}><Shield size={16} />لوحة الإدارة</Button>
            )}
            {currentUser.role === "librarian" && (
              <Button variant="secondary" onClick={() => navigate("/librarian")}><LayoutDashboard size={16} />لوحة أمين المكتبة</Button>
            )}
            <Button variant="ghost" className="icon-btn" onClick={onLogout} title="تسجيل الخروج"><LogOut size={17} /></Button>
          </div>
        ) : (
          <Button variant="primary" onClick={() => navigate("/login")}><LogIn size={17} />{t.signIn}</Button>
        )}
        <Button variant="ghost" className="menu-btn" onClick={onMenu}>{mobileOpen ? <X /> : <Menu />}</Button>
      </div>
      {mobileOpen && (
        <div className="mobile-nav">
          <Button variant="ghost" onClick={() => { navigate("/"); onMenu(); }}><BookOpen size={18} />{t.catalog}</Button>
          <Button variant="ghost" onClick={() => { navigate("/my-loans"); onMenu(); }}><Clock size={18} />{t.loans}</Button>
          <Button variant="ai" onClick={() => { onAI(); onMenu(); }}><Sparkles size={18} />{t.assistant}</Button>
          {currentUser ? (
            <Button variant="danger" onClick={() => { onLogout(); onMenu(); }}><LogOut size={18} />تسجيل الخروج</Button>
          ) : (
            <Button variant="primary" onClick={() => { navigate("/login"); onMenu(); }}><LogIn size={18} />{t.signIn}</Button>
          )}
        </div>
      )}
    </header>
  );
}

function AIBanner({ onAI }) {
  return (
    <section className="ai-banner">
      <span className="ai-orb"><Sparkles size={25} /></span>
      <div>
        <span className="eyebrow">AI DISCOVERY</span>
        <h1>اكتشف كتابك القادم بطريقة أذكى</h1>
        <p>صف ما ترغب في قراءته، وسيرشح لك أمين المكتبة الذكي أفضل العناوين المتاحة ومواقعها على الرفوف بدقة.</p>
      </div>
      <div className="banner-actions">
        <Button variant="ai" onClick={() => onAI("قصة غموض قصيرة للمبتدئين")}><Sparkles size={16} />قصة غموض قصيرة</Button>
        <Button onClick={() => onAI("أفضل مراجع الذكاء الاصطناعي")}><BookOpen size={16} />مراجع الذكاء الاصطناعي</Button>
      </div>
    </section>
  );
}

function BookCard({ book, lang, onDetails, onToast }) {
  const t = copy[lang];
  return (
    <article className="book-card">
      <div className="cover-wrap" onClick={onDetails}>
        <img src={book.cover} alt={book.title} loading="lazy" />
        <Badge status={book.available > 0 ? "available" : "reserved"}>
          {book.available > 0 ? `${book.available} متاح` : "قائمة انتظار"}
        </Badge>
        <span className="rating"><Star size={13} fill="currentColor" />{book.rating} <small>({book.reviews})</small></span>
        <div className="cover-meta"><span>{book.category}</span><span><Calendar size={13} />{book.year}</span></div>
      </div>
      <div className="book-body">
        <button className="title-link" onClick={onDetails}>{lang === "ar" ? book.title : book.en}</button>
        <p className="author">{t.by} {book.author}</p>
        <p className="description">{book.description}</p>
        <div className="book-info">
          <span><MapPin size={14} />{book.shelf}</span>
          <span dir="ltr"><Hash size={14} />{book.isbn}</span>
          <div className="availability">
            <span>{book.available} من {book.total} نسخ</span>
            <div className="progress"><i style={{ width: `${Math.min(100, Math.round((book.available / (book.total || 1)) * 100))}%` }} /></div>
          </div>
        </div>
        <div className="card-actions">
          <Button onClick={onDetails}><BookOpen size={16} />{t.view}</Button>
          <Button
            variant={book.available > 0 ? "primary" : "ai"}
            onClick={() => onToast(book.available > 0 ? "تم حجز النسخة للاستلام بنجاح" : "تمت إضافتك إلى قائمة الانتظار")}
          >
            {book.available > 0 ? <BookmarkCheck size={16} /> : <Clock size={16} />}
            {book.available > 0 ? t.hold : t.queue}
          </Button>
        </div>
      </div>
    </article>
  );
}

function Footer({ onAI }) {
  return (
    <footer>
      <div className="footer-highlights">
        <div><Sparkles /><span><b>اكتشاف ذكي مدعوم بالذكاء الاصطناعي</b><small>توصيات دقيقة تناسب اهتماماتك</small></span></div>
        <div><Barcode /><span><b>تتبع فوري للنسخ والباركود</b><small>موقع وحالة كل نسخة لحظة بلحظة</small></span></div>
        <div><ShieldCheck /><span><b>سياسات إعارة عادلة وواضحة</b><small>طوابير حجز منظمة وشفافة</small></span></div>
      </div>
      <div className="footer-main">
        <div>
          <Logo />
          <p>منصة مؤسسية حديثة لإدارة المكتبة والكتب، تضع المعرفة في متناول الجميع.</p>
          <span className="online"><i />النظام متصل · الفهرس محدّث</span>
        </div>
        <div>
          <b>الفهرس والاكتشاف</b>
          <button onClick={() => navigate("/")}>تصفح جميع العناوين</button>
          <button onClick={() => onAI("مراجع الذكاء الاصطناعي")}>مراجع التقنية والذكاء الاصطناعي</button>
          <button onClick={() => onAI("روايات تاريخية عربية")}>الأدب والتاريخ</button>
        </div>
        <div>
          <b>خدمات الأعضاء</b>
          <button onClick={() => navigate("/my-loans")}>إعاراتي وحجوزاتي</button>
          <button onClick={() => onAI("ما سياسة الإعارة والتجديد؟")}>قواعد الإعارة والتجديد</button>
          <button onClick={() => navigate("/login")}>دخول الأعضاء والموظفين</button>
        </div>
        <div>
          <b>الساعات والتواصل</b>
          <span><Clock size={15} />الأحد–الخميس · 8 ص–9 م</span>
          <span><MapPin size={15} />قاعة المعرفة، مكتب التداول</span>
          <span dir="ltr"><Mail size={15} />info@smartlibrary.sa</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 المكتبة الذكية LMS · جميع الحقوق محفوظة</span>
        <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          للأعلى <ArrowUp size={15} />
        </Button>
      </div>
    </footer>
  );
}

function Catalog({ books, lang, onAI, onDetails, onToast }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("all");
  const t = copy[lang];

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchCat = !category || b.category === category;
      const matchAvail = availability === "all" || (availability === "available" ? b.available > 0 : b.available === 0);
      const q = search.toLowerCase();
      const matchSearch = !q || `${b.title} ${b.en || ""} ${b.author} ${b.isbn}`.toLowerCase().includes(q);
      return matchCat && matchAvail && matchSearch;
    });
  }, [books, search, category, availability]);

  const categories = useMemo(() => {
    return [...new Set(books.map((b) => b.category))];
  }, [books]);

  return (
    <>
      <main className="public-main">
        <AIBanner onAI={onAI} />
        <section className="filter-card">
          <label className="search-field">
            <Search size={19} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.search} />
            {search && <button onClick={() => setSearch("")}><X size={16} /></button>}
          </label>
          <label className="select-field">
            <BookMarked size={17} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{t.allCategories}</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={15} />
          </label>
          <label className="select-field">
            <CheckCircle2 size={17} />
            <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
              <option value="all">{t.allBooks}</option>
              <option value="available">{t.available}</option>
              <option value="borrowed">مُعار الآن</option>
            </select>
            <ChevronDown size={15} />
          </label>
          <Button className="filter-button" onClick={() => { setSearch(""); setCategory(""); setAvailability("all"); }}>
            <Filter size={17} />إعادة الضبط
          </Button>
        </section>
        <div className="results-head">
          <div><span className="eyebrow">CURATED COLLECTION</span><h2><b>{filtered.length}</b> {t.results}</h2></div>
          <p><MapPin size={15} />مواقع الرفوف محدّثة لحظياً</p>
        </div>
        {filtered.length ? (
          <section className="book-grid">
            {filtered.map((book) => (
              <BookCard key={book.isbn || book.id} book={book} lang={lang} onDetails={() => onDetails(book)} onToast={onToast} />
            ))}
          </section>
        ) : (
          <div className="empty">
            <span><BookOpen /></span>
            <h2>لم يتم العثور على كتب</h2>
            <p>جرّب تعديل كلمات البحث أو إزالة عوامل التصفية الحالية.</p>
            <div>
              <Button onClick={() => { setSearch(""); setCategory(""); setAvailability("all"); }}>مسح الفلاتر</Button>
              <Button variant="ai" onClick={() => onAI(search)}><Sparkles size={16} />البحث بالذكاء الاصطناعي</Button>
            </div>
          </div>
        )}
      </main>
      <Footer onAI={onAI} />
    </>
  );
}

const librarianNav = [
  ["/librarian", "لوحة المتابعة", BarChart3],
  ["/librarian/circulation", "مكتب التداول", ArrowRightLeft],
  ["/librarian/catalog", "إدارة الفهرس", BookMarked],
  ["/librarian/reservations", "الحجوزات", Clock],
  ["/librarian/overdues", "المتأخرات والغرامات", AlertTriangle],
];
const adminNav = [
  ["/admin", "إدارة الموظفين", Users],
  ["/admin/policies", "السياسات", Settings],
  ["/admin/audit", "سجل التدقيق", FileText]
];

function Sidebar({ path, admin, dark, setDark, lang, setLang, onAI, open, setOpen, onLogout }) {
  const links = admin ? adminNav : librarianNav;
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-mobile-head">
        <Logo />
        <Button variant="ghost" className="icon-btn" onClick={() => setOpen(false)}><X /></Button>
      </div>
      <Logo />
      <div className="user-card">
        <span>{admin ? "ن" : "أ"}</span>
        <div>
          <b>{admin ? "نورا السالمي" : "أحمد منصور"}</b>
          <small>{admin ? "مدير النظام" : "أمين المكتبة"}</small>
        </div>
      </div>
      <small className="side-label">القائمة الرئيسية</small>
      <nav>
        {links.map(([href, label, Icon], i) => (
          <button
            key={href}
            className={path === href ? "active" : ""}
            onClick={() => { navigate(href); setOpen(false); }}
          >
            <Icon size={19} />
            {label}
            {i > 2 && <span className={i === 4 ? "danger-count" : "info-count"}>{i === 4 ? 3 : 7}</span>}
          </button>
        ))}
      </nav>
      <small className="side-label">الأدوات</small>
      <button className="sidebar-ai" onClick={onAI}><Sparkles size={19} />المساعد الذكي</button>
      <div className="sidebar-bottom">
        <button onClick={() => navigate("/")}><ExternalLink size={18} />الموقع العام</button>
        <div>
          <button onClick={() => setDark(!dark)} title="المظهر">{dark ? <Sun /> : <Moon />}</button>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} title="اللغة"><Globe /></button>
          <button title="إشعارات"><Bell /></button>
          <button className="logout" onClick={onLogout} title="تسجيل الخروج"><LogOut /></button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ admin, onMenu }) {
  return (
    <header className="topbar">
      <Button variant="ghost" className="dash-menu" onClick={onMenu}><Menu /></Button>
      <div>
        <h2>{admin ? "لوحة الإدارة" : "المكتبة الذكية — لوحة الإدارة التشغيلية"}</h2>
        <p><Calendar size={14} />الأربعاء، 18 مارس 2026</p>
      </div>
      <label className="top-search">
        <Search size={17} />
        <input placeholder={admin ? "ابحث في السجلات..." : "ابحث عن كتاب، عضو، أو رقم ISBN..."} />
        <Filter size={16} />
      </label>
      <Button onClick={() => navigate("/")}><ExternalLink size={16} />الموقع العام</Button>
      <Button variant="ghost" className="icon-btn bell"><Bell size={19} /><i>3</i></Button>
    </header>
  );
}

function PageTitle({ title, sub, action }) {
  return <div className="page-title"><div><h1>{title}</h1><p>{sub}</p></div>{action}</div>;
}

function Kpi({ label, value, sub, type, icon: Icon }) {
  return (
    <div className={`kpi kpi-${type}`}>
      <span><Icon /></span>
      <div><small>{label}</small><strong>{value}</strong><p>{sub}</p></div>
    </div>
  );
}

function Dashboard({ onToast }) {
  const [quickMode, setQuickMode] = useState("issue");
  const [barcode, setBarcode] = useState("");
  const [memberCode, setMemberCode] = useState("");

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickMode === "issue") {
      onToast?.(barcode ? `تم تسجيل الإعارة للنسخة ${barcode} بنجاح` : "تم تسجيل الإعارة وصرف النسخة بنجاح");
    } else {
      onToast?.(barcode ? `تم استلام النسخة ${barcode} وإغلاق الإعارة بنجاح` : "تم تأكيد استلام النسخة وإغلاق الإعارة بنجاح");
    }
    setBarcode("");
    setMemberCode("");
  };

  const handlePreset = (mode, code) => {
    setQuickMode(mode);
    setBarcode(code);
  };

  return (
    <div>
      <PageTitle title="لوحة المتابعة" sub="نظرة شاملة على حركة المكتبة اليوم" />
      <div className="kpi-grid">
        <Kpi label="الفهرس" value="1,248" sub="3,672 نسخة مادية · +2 اليوم" type="neutral" icon={BookOpen} />
        <Kpi label="الإعارات النشطة" value="286" sub="2,941 نسخة متاحة" type="borrowed" icon={ArrowRightLeft} />
        <Kpi label="الحجوزات" value="37" sub="في قائمة الانتظار" type="reserved" icon={Clock} />
        <Kpi label="المتأخرات" value="12" sub="غرامات: 485 ج.م" type="overdue" icon={AlertTriangle} />
      </div>
      <div className="dashboard-grid">
        <section className="panel circulation-quick">
          <div className="panel-head">
            <div>
              <Barcode />
              <span>
                <h3>مكتب التداول السريع</h3>
                <p>{quickMode === "issue" ? "إصدار أو استلام نسخة بالباركود" : "استلام نسخة بالباركود واحتساب التأخير"}</p>
              </span>
            </div>
            <span className="mode">
              <button
                type="button"
                className={quickMode === "issue" ? "active" : ""}
                onClick={() => setQuickMode("issue")}
              >
                إعارة
              </button>
              <button
                type="button"
                className={quickMode === "return" ? "active" : ""}
                onClick={() => setQuickMode("return")}
              >
                إرجاع
              </button>
            </span>
          </div>
          <form onSubmit={handleQuickSubmit}>
            <label className="form-group">
              <span>{quickMode === "issue" ? "باركود النسخة" : "باركود النسخة المسترجعة"}</span>
              <span className="input-icon">
                <Barcode />
                <input
                  dir="ltr"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="BC-xxx-xx"
                />
              </span>
            </label>
            {quickMode === "issue" && (
              <label className="form-group">
                <span>كود العضو</span>
                <span className="input-icon">
                  <Users />
                  <input
                    dir="ltr"
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    placeholder="MEM-2026-0042"
                  />
                </span>
              </label>
            )}
            <Button
              type="submit"
              variant="primary"
              className="wide"
              disabled={!barcode}
            >
              {quickMode === "issue" ? (
                <>
                  <ArrowRightLeft size={17} />
                  إتمام تسجيل الإعارة
                </>
              ) : (
                <>
                  <RotateCcw size={17} />
                  تأكيد استلام النسخة وإغلاق الإعارة
                </>
              )}
            </Button>
          </form>
          <div className="presets">
            <small>نماذج سريعة</small>
            <button
              type="button"
              dir="ltr"
              onClick={() => handlePreset("issue", "BC-101-01")}
            >
              Issue: BC-101-01
            </button>
            <button
              type="button"
              dir="ltr"
              onClick={() => handlePreset("return", "BC-404-02")}
            >
              Return: BC-404-02
            </button>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><div><FileText /><span><h3>النشاط الأخير</h3><p>آخر العمليات المسجلة</p></span></div><Button variant="ghost">عرض الكل</Button></div>
          <div className="timeline">
            {[
              ["تم تسجيل إعارة جديدة", "منذ 8 دقائق", "BC-101-01 ← MEM-2026-0042"],
              ["تم إرجاع نسخة", "منذ 24 دقيقة", "مائة عام من العزلة"],
              ["حجز عنوان جديد", "منذ ساعة", "المرتبة #2 في الطابور"],
              ["تحديث حالة نسخة", "منذ ساعتين", "إحالة النسخة إلى الصيانة"],
            ].map((x, i) => (
              <div key={i}><i /><span><b>{x[0]}</b><small>{x[2]}</small><em>بواسطة: نورا السالمي</em></span><time>{x[1]}</time></div>
            ))}
          </div>
        </section>
        <div className="right-stack">
          <section className="panel compact"><div className="panel-head"><h3>الحركة الأسبوعية</h3><Calendar size={18} /></div><div className="chart">{[48, 65, 44, 78, 62, 86, 94].map((h, i) => <span key={i}><i style={{ height: `${h}%` }} /><small>{["ح", "ن", "ث", "ر", "خ", "ج", "س"][i]}</small></span>)}</div></section>
          <section className="panel compact"><div className="panel-head"><h3>لمحة المخزون</h3><Users size={18} /></div><div className="stat-list"><span>الأعضاء المسجلون <b>842</b></span><span>معدل الاستخدام <b>78%</b></span><span>متوسط الإعارات <b>2.4</b></span><span>غرامات غير مسددة <b className="danger-text">485 ج.م</b></span></div></section>
          <section className="panel compact"><h3>إجراءات سريعة</h3><div className="quick-actions"><Button variant="primary" onClick={() => navigate("/librarian/circulation")}><ArrowRightLeft size={16} />مكتب التداول</Button><Button onClick={() => navigate("/librarian/catalog")}><Plus size={16} />إضافة كتاب</Button></div></section>
        </div>
      </div>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Circulation({ onToast, books }) {
  const [mode, setMode] = useState("issue");
  const [barcode, setBarcode] = useState("");
  return (
    <div>
      <PageTitle
        title="مكتب الإعارة والتداول المركزي"
        sub="إدارة إصدار واستلام النسخ مع فحص الأهلية المسبق"
        action={
          <span className="segmented">
            <button className={mode === "issue" ? "active" : ""} onClick={() => setMode("issue")}><BookOpen />تسجيل إعارة جديدة</button>
            <button className={mode === "return" ? "active" : ""} onClick={() => setMode("return")}><RotateCcw />تسجيل إرجاع نسخة</button>
          </span>
        }
      />
      <div className="two-col">
        <section className="panel form-panel">
          <div className="panel-head"><div>{mode === "issue" ? <BookOpen /> : <RotateCcw />}<h3>{mode === "issue" ? "نموذج إصدار إعارة" : "استلام وإغلاق إعارة"}</h3></div></div>
          {mode === "issue" && (
            <label className="form-group">
              <span>العضو المستفيد</span>
              <select>
                <option>سارة أحمد (MEM-2026-0042) — نشط [1/3]</option>
                <option>عمر خالد (MEM-2026-0188) — نشط [2/3]</option>
              </select>
            </label>
          )}
          <label className="form-group">
            <span>باركود النسخة</span>
            <span className="input-icon"><Barcode /><input value={barcode} onChange={(e) => setBarcode(e.target.value)} dir="ltr" placeholder="BC-xxx-xx" /></span>
          </label>
          <div className="chips">
            <button onClick={() => setBarcode("BC-101-01")} dir="ltr">BC-101-01</button>
            <button onClick={() => setBarcode("BC-205-03")} dir="ltr">BC-205-03</button>
            <button onClick={() => setBarcode("BC-404-02")} dir="ltr">BC-404-02 {mode === "return" && "⚠️"}</button>
          </div>
          <div className="terms">
            <ShieldCheck />
            <span>
              <b>{mode === "issue" ? "مدة الإعارة المطبقة: 14 يوماً" : "يتم احتساب الغرامة تلقائياً عند التأخير"}</b>
              <small>{mode === "issue" ? "تاريخ الاستحقاق المحسوب: 1 أبريل 2026" : "التعرفة الرسمية: 5 ج.م / يوم"}</small>
            </span>
          </div>
          <Button
            variant="primary"
            className="wide tall"
            disabled={!barcode}
            onClick={() => onToast(mode === "issue" ? "تم تسجيل الإعارة بنجاح" : "تم استلام النسخة وإغلاق الإعارة")}
          >
            <CheckCircle2 />{mode === "issue" ? "إتمام تسجيل الإعارة وصرف النسخة" : "تأكيد استلام النسخة وإغلاق الإعارة"}
          </Button>
        </section>
        <section className="panel validation">
          <div className="panel-head"><div><ShieldCheck /><h3>{mode === "issue" ? "فحص الأهلية المسبق" : "معاينة تفاصيل الإعارة"}</h3></div></div>
          {barcode ? (
            <>
              <div className="member-preview"><span className="avatar">س</span><div><b>سارة أحمد</b><small dir="ltr">MEM-2026-0042</small></div><Badge status="available">عضوية نشطة</Badge></div>
              <div className="copy-preview"><img src={books[0]?.cover || defaultCovers[0]} alt="" /><div><Badge status={mode === "return" ? "overdue" : "available"}>{mode === "return" ? "متأخر 3 أيام" : "متاح"}</Badge><h3>{books[0]?.title}</h3><p><MapPin />{books[0]?.shelf}</p></div></div>
              {mode === "return" && <div className="danger-alert"><AlertTriangle /><div><b>تنبيه: النسخة متأخرة عن موعدها!</b><p>سيتم احتساب غرامة تأخير تلقائية بقيمة 15 ج.م.</p></div></div>}
            </>
          ) : (
            <div className="placeholder"><Barcode /><p>أدخل أو امسح باركود النسخة لعرض تفاصيلها والتحقق من العملية.</p></div>
          )}
        </section>
      </div>
      <section className="panel table-panel">
        <div className="panel-head"><div><Clock /><h3>الإعارات المتداولة حالياً</h3><Badge status="borrowed">286 إعارة</Badge></div></div>
        <DataTable
          columns={["الباركود", "عنوان الكتاب", "المستفيد", "تاريخ الصرف", "تاريخ الاستحقاق", "الحالة", "إجراء سريع"]}
          rows={books.slice(0, 4).map((b, i) => [
            <code dir="ltr" key="c">BC-{101 + i}-0{i + 1}</code>,
            <b key="t">{b.title}</b>,
            i % 2 ? "عمر خالد" : "سارة أحمد",
            "18 مارس 2026",
            i === 2 ? <b key="d" className="danger-text">15 مارس 2026</b> : "1 أبريل 2026",
            <Badge key="b" status={i === 2 ? "overdue" : "borrowed"}>{i === 2 ? "متأخر" : "مُعار"}</Badge>,
            <Button key="a" onClick={() => { setMode("return"); setBarcode(`BC-${101 + i}-0${i + 1}`); }}><RotateCcw size={14} />استلام</Button>
          ])}
        />
      </section>
    </div>
  );
}

function CatalogAdmin({ books, onDetails }) {
  return (
    <div>
      <PageTitle title="إدارة الفهرس والنسخ المادية" sub="إدارة البيانات الببليوجرافية وتتبع كل نسخة بصورة مستقلة" action={<Button variant="primary"><Plus />إضافة عنوان جديد للفهرس</Button>} />
      <section className="panel search-panel"><label className="input-icon"><Search /><input placeholder="ابحث بالعنوان، المؤلف، أو ISBN..." /></label></section>
      <DataTable
        columns={["الكتاب", "التصنيف", "موقع الرف", "إجمالي النسخ", "النسخ المتاحة", "الباركودات وحالاتها", "إجراءات"]}
        rows={books.map((b, i) => [
          <span key="bk" className="table-book"><img src={b.cover} alt="" /><span><b>{b.title}</b><small>{b.author}</small><code dir="ltr">{b.isbn}</code></span></span>,
          <Badge key="cat">{b.category}</Badge>,
          <span key="sh" className="with-icon"><MapPin />{b.shelf}</span>,
          <b key="tot">{b.total}</b>,
          <Badge key="avail" status={b.available > 0 ? "available" : "borrowed"}>{b.available > 0 ? `${b.available} متاح` : "مُعار بالكامل"}</Badge>,
          <span key="bcs" className="barcode-cluster">{Array.from({ length: Math.min(b.total, 3) }, (_, n) => <code key={n}>BC-{101 + i}-0{n + 1}</code>)}</span>,
          <Button key="btn" onClick={() => onDetails(b)}>عرض وإدارة</Button>,
        ])}
      />
    </div>
  );
}

function Reservations({ books, onToast }) {
  const [filter, setFilter] = useState("active");
  const filtered = filter === "active" ? books.slice(0, 3) : books.slice(0, 5);
  return (
    <div>
      <PageTitle
        title="الحجوزات وطوابير الانتظار"
        sub="إدارة أولوية المستفيدين ونوافذ الاستلام"
        action={
          <span className="segmented">
            <button
              type="button"
              className={filter === "active" ? "active" : ""}
              onClick={() => setFilter("active")}
            >
              النشطة (7)
            </button>
            <button
              type="button"
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              الكل (24)
            </button>
          </span>
        }
      />
      <DataTable
        columns={["عنوان الكتاب", "العضو المستفيد", "كود العضو", "موضع الطابور", "تاريخ الحجز", "انتهاء الاستلام", "الحالة", "الإجراءات"]}
        rows={filtered.map((b, i) => [
          <b key="t">{b.title}</b>,
          <span key="u" className="with-icon"><User />{i % 2 ? "عمر خالد" : "سارة أحمد"}</span>,
          <code key="c">MEM-2026-00{42 + i}</code>,
          <Badge key="q" status="reserved">المرتبة #{i + 1}</Badge>,
          "16 مارس 2026",
          "20 مارس 2026",
          <Badge key="st" status="reserved">نشط</Badge>,
          <span key="act" className="row-actions">
            <Button onClick={() => onToast("تم إرسال إشعار الاستلام؛ النافذة متاحة لمدة 48 ساعة")}><Bell size={14} />إشعار</Button>
            <Button variant="danger"><X size={14} />إلغاء</Button>
          </span>
        ])}
      />
    </div>
  );
}

function Overdues({ books, onToast }) {
  const [tab, setTab] = useState("overdue");
  return (
    <div>
      <PageTitle
        title="المتأخرات وسجل الغرامات"
        sub="متابعة النسخ المتأخرة وتحصيل المطالبات المالية"
        action={
          <span className="segmented">
            <button className={tab === "overdue" ? "active" : ""} onClick={() => setTab("overdue")}>الإعارات المتأخرة (12)</button>
            <button className={tab === "fines" ? "active" : ""} onClick={() => setTab("fines")}>سجل الغرامات (18)</button>
          </span>
        }
      />
      <section className="overdue-banner">
        <span><AlertTriangle /></span>
        <div><h2>إجمالي الغرامات المستحقة غير المحصلة: 485 ج.م</h2><p>التعرفة الرسمية: 5 ج.م عن كل يوم تأخير بعد 14 يوماً</p></div>
        <Badge status="overdue">12 مطالبة معلقة</Badge>
      </section>
      {tab === "overdue" ? (
        <DataTable
          columns={["الباركود", "الكتاب المتأخر", "المستفيد", "تاريخ الاستحقاق", "أيام التأخير", "الغرامة المقدرة", "إرجاع سريع"]}
          rows={books.slice(0, 4).map((b, i) => [
            <code key="c">BC-{301 + i}-01</code>,
            <b key="t">{b.title}</b>,
            <span key="u"><b>سارة أحمد</b><small className="block">MEM-2026-0042</small></span>,
            <b key="d" className="danger-text">12 مارس 2026</b>,
            <Badge key="b" status="overdue">{i + 2} أيام تأخير</Badge>,
            <b key="f" className="danger-text">{(i + 2) * 5} ج.م</b>,
            <Button key="btn" onClick={() => onToast("تم استلام النسخة واحتساب الغرامة")}><RotateCcw size={14} />استلام واحتساب</Button>
          ])}
        />
      ) : (
        <DataTable
          columns={["العضو", "كود العضو", "الكتاب", "قيمة الغرامة", "السبب", "التاريخ", "الحالة", "التسوية"]}
          rows={books.slice(0, 5).map((b, i) => [
            <b key="u">{i % 2 ? "عمر خالد" : "سارة أحمد"}</b>,
            <code key="c">MEM-2026-00{42 + i}</code>,
            b.title,
            <b key="f" className={i < 3 ? "danger-text" : ""}>{(i + 2) * 5} ج.م</b>,
            "تأخير في إرجاع النسخة",
            "17 مارس 2026",
            <Badge key="st" status={i < 3 ? "overdue" : "available"}>{i < 3 ? "غير مسدد" : "مدفوع"}</Badge>,
            i < 3 ? (
              <Button key="btn" variant="primary" onClick={() => onToast("تمت تسوية الغرامة وتحصيلها بنجاح")}><CheckCircle2 size={14} />تسوية وتحصيل</Button>
            ) : (
              <span key="btn" className="success-text">تم التحصيل بنجاح</span>
            )
          ])}
        />
      )}
    </div>
  );
}

function Staff() {
  const staff = [
    ["نورا السالمي", "n.alsalmi@library.gov.sa", "admin", "مدير نظام المكتبة"],
    ["أحمد منصور", "a.mansour@library.gov.sa", "librarian", "أمين الإعارة والتداول"],
    ["ليلى حسن", "l.hassan@library.gov.sa", "cataloger", "مشرف الفهرسة والتصنيف"]
  ];
  return (
    <div>
      <PageTitle title="حسابات الموظفين والصلاحيات" sub="إدارة وصول فريق المكتبة وتوزيع المسؤوليات" action={<Button variant="primary"><Plus />إضافة حساب موظف جديد</Button>} />
      <DataTable
        columns={["الموظف", "البريد المؤسسي", "الدور", "المسمى الوظيفي", "آخر دخول", "حالة الحساب"]}
        rows={staff.map((s) => [
          <span key="stf" className="staff-name"><i>{s[0][0]}</i><b>{s[0]}</b></span>,
          <span key="ml" className="with-icon"><Mail />{s[1]}</span>,
          <Badge key="rl">{s[2]}</Badge>,
          s[3],
          "18 مارس، 09:42",
          <Badge key="act" status="available">نشط</Badge>
        ])}
      />
    </div>
  );
}

function Policies({ onToast }) {
  return (
    <div>
      <PageTitle title="قواعد الإعارة وسياسات النظام" sub="تُطبّق التعديلات فوراً على الإعارات والغرامات والمساعد الذكي" />
      <div className="two-col">
        <section className="panel form-panel">
          <div className="panel-head"><div><ShieldCheck /><h3>قواعد الإعارة والتجديد</h3></div></div>
          {[["الحد الأقصى للإعارات النشطة", "3", "كتب"], ["مدة الإعارة الافتراضية", "14", "أيام"], ["الحد الأقصى للتجديدات", "2", "مرات"]].map((x) => (
            <label className="form-group" key={x[0]}>
              <span>{x[0]}</span>
              <span className="unit-input"><input type="number" defaultValue={x[1]} /><i>{x[2]}</i></span>
            </label>
          ))}
        </section>
        <section className="panel form-panel">
          <div className="panel-head"><div><Settings /><h3>رسوم التأخير ومهل الحجز</h3></div></div>
          {[["غرامة التأخير اليومية لكل نسخة", "5", "ج.م / يوم"], ["مهلة استلام الحجز", "48", "ساعات"]].map((x) => (
            <label className="form-group" key={x[0]}>
              <span>{x[0]}</span>
              <span className="unit-input"><input type="number" defaultValue={x[1]} /><i>{x[2]}</i></span>
            </label>
          ))}
          <label className="ai-toggle">
            <Sparkles />
            <span><b>تفعيل أمين المكتبة الذكي</b><small>إتاحة التوصيات والإجابة عن السياسات</small></span>
            <input type="checkbox" defaultChecked />
          </label>
        </section>
        <div className="policy-actions">
          <Button><RotateCcw />إعادة التعيين</Button>
          <Button variant="primary" onClick={() => onToast("تم حفظ واعتماد السياسات الجديدة")}><CheckCircle2 />حفظ واعتماد التعديلات</Button>
        </div>
      </div>
    </div>
  );
}

function Audit() {
  return (
    <div>
      <PageTitle title="سجل التدقيق الرقابي" sub="سجل مؤسسي غير قابل للتعديل لكل الإجراءات الحساسة" />
      <section className="panel filter-row">
        <label className="input-icon"><Search /><input placeholder="ابحث بالمستخدم، التفاصيل، الإجراء، أو رقم الكيان..." /></label>
        <select><option>كل الإجراءات</option><option>تسجيل إعارة</option><option>إرجاع نسخة</option><option>تحديث السياسات</option></select>
      </section>
      <DataTable
        columns={["الوقت", "المنفذ", "الدور", "الإجراء", "الكيان", "التفاصيل"]}
        rows={["تسجيل إعارة", "إرجاع نسخة", "تسوية غرامة", "تحديث سياسات النظام", "إضافة عنوان جديد"].map((a, i) => [
          "18 مارس، 09:4" + i,
          <b key="actor">{i % 2 ? "أحمد منصور" : "نورا السالمي"}</b>,
          <Badge key="r">{i === 3 ? "admin" : "librarian"}</Badge>,
          <span key="tag" className="action-tag">{a}</span>,
          <code key="id">Loan #{1042 + i}</code>,
          "تم تنفيذ الإجراء بنجاح وتسجيل تفاصيل العملية كاملة."
        ])}
      />
    </div>
  );
}

function MemberLoans({ books }) {
  return (
    <main className="public-main member-page">
      <PageTitle title="إعاراتي وحجوزاتي" sub="تابع كتبك الحالية، مواعيد الإرجاع، وطوابير الانتظار" />
      <section className="profile-card">
        <div className="identity">
          <span>س</span>
          <div><h2>سارة أحمد</h2><Badge status="available">عضوية نشطة</Badge><p><code>MEM-2026-0042</code> · عضو منذ يناير 2024</p></div>
        </div>
        <div>
          <span className="metric-label">حد الاستعارة <b>2 من 3 كتب</b></span>
          <div className="progress lg"><i style={{ width: "66%" }} /></div>
          <small>يمكنك استعارة كتاب إضافي واحد</small>
        </div>
        <div>
          <span className="metric-label">الغرامات المستحقة</span>
          <strong className="success-text">0.00 ج.م</strong>
          <p className="success-text"><CheckCircle2 />سجل ناصع</p>
        </div>
      </section>
      <section className="member-section">
        <div className="section-title"><h2><BookOpen />الإعارات النشطة (2)</h2><p>يمكن التجديد مرتين ما لم يكن العنوان محجوزاً</p></div>
        <div className="loan-grid">
          {books.slice(0, 2).map((b, i) => (
            <article className={`loan-card ${i ? "due" : ""}`} key={b.isbn || i}>
              <img src={b.cover} alt="" />
              <div className="loan-main">
                <div><h3>{b.title}</h3><Badge status={i ? "reserved" : "available"}>{i ? "متبقي يومان" : "متبقي 8 أيام"}</Badge></div>
                <p>{b.author}</p>
                <span><code>BC-10{i + 1}-01</code> · التجديدات: {i} من 2</span>
                <div className="date-strip"><span>تاريخ الصرف <b>4 مارس 2026</b></span><span>تاريخ الاستحقاق <b>18 مارس 2026</b></span></div>
                <div className="card-actions">
                  <Button variant="primary"><RotateCcw />تجديد الإعارة</Button>
                  <Button><Star />تقييم</Button>
                  <Button>تفاصيل</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="member-section">
        <div className="section-title"><h2><BookmarkCheck />الحجوزات النشطة (1)</h2></div>
        <article className="reservation-card">
          <div><h3>مائة عام من العزلة</h3><p>تم الحجز في 16 مارس · ينتهي 20 مارس</p></div>
          <Badge status="reserved">المرتبة #2</Badge>
          <Button variant="danger"><X />إلغاء الحجز</Button>
        </article>
      </section>
      <div className="policy-strip">
        <ShieldCheck /><span>مدة الإعارة 14 يوماً · بحد أقصى 3 كتب · تجديدان مسموحان · غرامة التأخير 5 ج.م / يوم</span>
      </div>
    </main>
  );
}

function LoginModal({ onClose, onToast, onLoginSuccess }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "login") {
        const res = await api.auth.login({ email, password });
        if (res?.token) localStorage.setItem("library_token", res.token);
        onLoginSuccess({ email, role: res?.user?.role || "member", name: res?.user?.full_name || email.split("@")[0] });
        onToast("مرحباً بعودتك إلى المكتبة الذكية");
      } else {
        const res = await api.auth.register({ email, password, full_name: name });
        if (res?.token) localStorage.setItem("library_token", res.token);
        onLoginSuccess({ email, role: "member", name });
        onToast("تم إنشاء حساب العضوية بنجاح");
      }
      onClose();
    } catch (err) {
      // Fallback demo login
      onLoginSuccess({ email: email || "member@library.sa", role: "member", name: name || "عضو جديد" });
      onToast(tab === "login" ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function loginDemo(role, defaultName, defaultEmail) {
    onLoginSuccess({ role, name: defaultName, email: defaultEmail });
    onToast(`تم الدخول بحساب تجريبي: ${defaultName}`);
    onClose();
    if (role === "admin") navigate("/admin");
    else if (role === "librarian") navigate("/librarian");
  }

  return (
    <div className="login-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="login-card" onSubmit={submit}>
        <div className="login-head"><Logo /><Button variant="ghost" className="icon-btn" onClick={onClose}><X /></Button></div>
        <div className="login-tabs">
          <button type="button" className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}><LogIn />تسجيل الدخول</button>
          <button type="button" className={tab === "signup" ? "active" : ""} onClick={() => setTab("signup")}><User />إنشاء حساب عضو</button>
        </div>
        <div className="login-copy">
          <span className="eyebrow">{tab === "login" ? "WELCOME BACK" : "MEMBER REGISTRATION"}</span>
          <h1>{tab === "login" ? "أهلاً بك مجدداً" : "إنشاء حساب عضو جديد"}</h1>
          <p>{tab === "login" ? "سجّل الدخول للوصول إلى إعاراتك وحجوزاتك." : "أنشئ عضويتك الفورية وابدأ باستكشاف الفهرس."}</p>
        </div>
        {tab === "signup" && (
          <label className="form-group">
            <span>الاسم الكامل</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم كما يظهر في الهوية" />
          </label>
        )}
        <label className="form-group">
          <span>البريد الإلكتروني</span>
          <input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@library.sa" />
        </label>
        <label className="form-group">
          <span>كلمة المرور</span>
          <input required type="password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={6} />
        </label>
        {tab === "signup" && (
          <label className="form-group">
            <span>تأكيد كلمة المرور</span>
            <input required type="password" dir="ltr" placeholder="••••••••" minLength={6} />
          </label>
        )}
        <Button variant="primary" type="submit" className="wide tall" disabled={loading}>
          {tab === "login" ? <LogIn /> : <CheckCircle2 />}
          {loading ? "جاري المعالجة..." : tab === "login" ? "تسجيل الدخول" : "إنشاء حساب عضوية فوري"}
        </Button>
        {tab === "login" && (
          <>
            <div className="divider"><span>أو دخول سريع بحساب تجريبي</span></div>
            <div className="demo-grid">
              <button type="button" onClick={() => loginDemo("member", "سارة أحمد", "sara@library.sa")}>
                <User /><span><b>عضو</b><small>سارة أحمد</small></span>
              </button>
              <button type="button" onClick={() => loginDemo("librarian", "أحمد منصور", "a.mansour@library.gov.sa")}>
                <BookMarked /><span><b>أمين مكتبة</b><small>أحمد منصور</small></span>
              </button>
              <button type="button" onClick={() => loginDemo("admin", "نورا السالمي", "n.alsalmi@library.gov.sa")}>
                <Shield /><span><b>مدير النظام</b><small>نورا السالمي</small></span>
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

function BookModal({ book, onClose, onToast }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="book-modal">
        <div className="modal-head">
          <div><BookOpen /><h2>تفاصيل العنوان والنسخ</h2></div>
          <Button variant="ghost" className="icon-btn" onClick={onClose}><X /></Button>
        </div>
        <div className="modal-body">
          <div className="metadata">
            <img src={book.cover} alt={book.title} />
            <div>
              <div className="badge-row">
                <Badge>{book.category}</Badge>
                <Badge status="reserved"><Star fill="currentColor" />{book.rating} · {book.reviews} تقييماً</Badge>
                <Badge status={book.available > 0 ? "available" : "borrowed"}>
                  {book.available} من {book.total} متاح
                </Badge>
              </div>
              <h1>{book.title}</h1>
              <p className="author">بقلم {book.author}</p>
              <p>{book.description}</p>
              <div className="biblio">
                <span><Calendar />سنة النشر <b>{book.year}</b></span>
                <span><Globe />اللغة <b>العربية</b></span>
                <span><Hash />ISBN <code>{book.isbn}</code></span>
                <span><MapPin />الموقع <b>{book.shelf}</b></span>
              </div>
            </div>
          </div>
          <div className="section-title"><h2><BookMarked />النسخ المادية ({book.total})</h2><p>{book.shelf}</p></div>
          <DataTable
            columns={["الباركود", "موقع الرف", "الحالة", "إجراء الموظف"]}
            rows={Array.from({ length: book.total || 3 }, (_, i) => [
              <code key="bc">BC-10{book.id || 1}-0{i + 1}</code>,
              <span key="sh" className="with-icon"><MapPin />{book.shelf}</span>,
              <Badge key="st" status={i < book.available ? "available" : "borrowed"}>{i < book.available ? "متاح" : "مُعار"}</Badge>,
              <select key="act"><option>متاح</option><option>مُعار</option><option>محجوز</option><option>صيانة</option></select>
            ])}
          />
          <div className="reviews">
            <div>
              <strong>{book.rating}</strong>
              <span className="stars">{[1, 2, 3, 4, 5].map((i) => <Star key={i} fill={i <= Math.round(book.rating) ? "currentColor" : "none"} />)}</span>
              <small>{book.reviews} تقييماً</small>
            </div>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((r) => (
                <span key={r}>
                  <b>{r}★</b>
                  <i><em style={{ width: `${r * 18}%` }} /></i>
                  <small>{r * 8}</small>
                </span>
              ))}
            </div>
            <div className="rate-box">
              <Sparkles />
              <b>قيّم هذا الكتاب</b>
              <div className="stars interactive">
                {[1, 2, 3, 4, 5].map((i) => <button key={i}><Star fill={i <= 4 ? "currentColor" : "none"} /></button>)}
              </div>
              <textarea placeholder="اكتب مراجعتك الاختيارية..." maxLength={500} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <span><CheckCircle2 />سيتم تطبيق سياسات الحجز والاستلام الحالية.</span>
          <div>
            <Button onClick={onClose}>إغلاق</Button>
            <Button
              variant={book.available > 0 ? "primary" : "ai"}
              onClick={() => {
                onToast(book.available > 0 ? "تم حجز النسخة للاستلام" : "تمت إضافتك إلى قائمة الانتظار");
                onClose();
              }}
            >
              <BookmarkCheck />{book.available > 0 ? "حجز للاستلام" : "انضم لقائمة الانتظار"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function AIDrawer({ onClose, prompt, onDetails, booksList, lang }) {
  const [value, setValue] = useState(prompt || "");
  const [messages, setMessages] = useState(prompt ? [{ sender: "user", text: prompt }] : []);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(textToSend) {
    const q = (textToSend || value).trim();
    if (!q) return;
    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    setValue("");
    setLoading(true);

    try {
      const res = await api.ai.ask({ prompt: q, locale: lang });
      if (res && res.answer) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            text: res.answer,
            matchedBooks: res.matched_books || booksList.slice(0, 1)
          }
        ]);
      } else {
        throw new Error("No direct response");
      }
    } catch {
      // Local intelligent response
      let matched = booksList.filter((b) => q.includes("ذكاء") || q.includes("تقنية") ? b.category.includes("ذكاء") : true).slice(0, 1);
      if (!matched.length) matched = booksList.slice(0, 1);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: `بناءً على طلبك، بحثت في الفهرس ووجدت ترشيحاً مناسباً ومتاحاً حالياً على الرفوف. يمكنك الاطلاع على التفاصيل أو حجز النسخة فوراً:`,
          matchedBooks: matched
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="ai-drawer">
        <div className="drawer-head">
          <span className="ai-orb"><Sparkles /></span>
          <div>
            <span className="eyebrow">AI ASSISTANT</span>
            <h2>أمين المكتبة الذكي</h2>
            <p>توصيات واعية بحالة الفهرس والسياسات</p>
          </div>
          <Button variant="ghost" className="icon-btn" onClick={onClose}><X /></Button>
        </div>
        <div className="disclaimer">
          <ShieldCheck />محادثتك خاصة. تحقق دائماً من تفاصيل النسخة وموقع الرف قبل الاستلام.
        </div>
        <div className="messages">
          <div className="assistant-msg">
            <span><Bot />توصية</span>
            <p>مرحباً! أخبرني ماذا تريد أن تقرأ، وسأبحث لك في العناوين والنسخ المتاحة وأوضح لك سياسات المكتبة.</p>
          </div>
          {!messages.length && (
            <div className="suggestions">
              {[
                "قصة غموض قصيرة للمبتدئين",
                "أفضل مراجع الذكاء الاصطناعي",
                "روايات تاريخية عربية مشوقة",
                "ما هي سياسة التجديد؟"
              ].map((x) => (
                <button key={x} onClick={() => send(x)}>⚡ {x}</button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className="conversation">
              {m.sender === "user" ? (
                <div className="user-msg">{m.text}</div>
              ) : (
                <div className="assistant-msg">
                  <span><Bot />أمين المكتبة</span>
                  <p>{m.text}</p>
                  {m.matchedBooks?.map((b) => (
                    <article key={b.isbn || b.id} className="ai-result">
                      <img src={b.cover || defaultCovers[0]} alt="" />
                      <div>
                        <b>{b.title}</b>
                        <small>{b.author}</small>
                        <Badge status="available">{b.available || 2} نسخ متاحة</Badge>
                      </div>
                      <Button onClick={() => onDetails(b)}>عرض</Button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="assistant-msg">
              <span><Sparkles />جاري التفكير والبحث...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="drawer-input">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="اسأل عن كتاب أو سياسة..."
          />
          <Button variant="ai" className="icon-btn" onClick={() => send()} disabled={!value.trim() || loading}>
            <Send />
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 4200);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div className="toast">
      <CheckCircle2 />
      <div><b>تمت العملية بنجاح</b><p>{message}</p></div>
      <button onClick={onClose}><X /></button>
    </div>
  );
}

function DashboardShell({ path, children, lang, setLang, dark, setDark, onAI, onLogout }) {
  const admin = path.startsWith("/admin");
  const [open, setOpen] = useState(false);
  return (
    <div className="dashboard-shell">
      <Sidebar
        path={path}
        admin={admin}
        dark={dark}
        setDark={setDark}
        lang={lang}
        setLang={setLang}
        onAI={onAI}
        open={open}
        setOpen={setOpen}
        onLogout={onLogout}
      />
      <div className="dash-main">
        <Topbar admin={admin} onMenu={() => setOpen(true)} />
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState(location.pathname);
  const [lang, setLang] = useState("ar");
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ai, setAI] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [books, setBooks] = useState(initialBooks);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("library_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync books with backend API
  useEffect(() => {
    let active = true;
    async function fetchBooks() {
      try {
        const data = await api.books.list({ limit: 100 });
        if (active && data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((b, i) => ({
            id: b.id,
            title: b.title,
            en: b.title_en || b.title,
            author: b.author_name || b.author || "مؤلف معتمد",
            category: b.category_name || b.category || "عام",
            rating: Number(b.rating || 4.7),
            reviews: b.ratings_count || 45,
            available: b.available_copies !== undefined ? b.available_copies : 2,
            total: b.total_copies !== undefined ? b.total_copies : 4,
            shelf: b.shelf_location || "جناح التقنية · رف CS-12",
            isbn: b.isbn || `978-013-000-${i}`,
            year: String(b.publication_year || "2024"),
            cover: b.cover_url && !b.cover_url.startsWith("/images") ? b.cover_url : defaultCovers[i % defaultCovers.length],
            description: b.description || "مرجع مختار بعناية يقدّم تجربة قراءة ثرية وموثوقة."
          }));
          setBooks(mapped);
        }
      } catch (err) {
        // Backend offline or starting up; initial books will be displayed gracefully
      }
    }
    fetchBooks();
    return () => { active = false; };
  }, []);

  // Sync URL changes
  useEffect(() => {
    const pop = () => setPath(location.pathname);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);

  // HTML attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("dark", dark);
  }, [lang, dark]);

  const openAI = (p = "") => {
    setPrompt(p);
    setAI(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("library_current_user", JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("library_current_user");
      localStorage.removeItem("library_token");
    } catch {}
    setToast("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

  const dashboardPage = useMemo(() => {
    if (path === "/librarian") return <Dashboard onToast={setToast} />;
    if (path === "/librarian/circulation") return <Circulation onToast={setToast} books={books} />;
    if (path === "/librarian/catalog") return <CatalogAdmin books={books} onDetails={setSelected} />;
    if (path === "/librarian/reservations") return <Reservations books={books} onToast={setToast} />;
    if (path === "/librarian/overdues") return <Overdues books={books} onToast={setToast} />;
    if (path === "/admin") return <Staff />;
    if (path === "/admin/policies") return <Policies onToast={setToast} />;
    if (path === "/admin/audit") return <Audit />;
    return null;
  }, [path, books]);

  const isDashboard = path.startsWith("/librarian") || path.startsWith("/admin");
  const isKnownRoute = ["/", "/login", "/my-loans"].includes(path) || isDashboard;
  if (!isKnownRoute) {
    navigate("/");
  }

  return (
    <div className="app">
      {isDashboard ? (
        <DashboardShell
          path={path}
          lang={lang}
          setLang={setLang}
          dark={dark}
          setDark={setDark}
          onAI={() => openAI()}
          onLogout={handleLogout}
        >
          {dashboardPage}
        </DashboardShell>
      ) : (
        <>
          <PublicNav
            lang={lang}
            setLang={setLang}
            dark={dark}
            setDark={setDark}
            onAI={() => openAI()}
            onMenu={() => setMobileOpen(!mobileOpen)}
            mobileOpen={mobileOpen}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          {path === "/my-loans" ? (
            <MemberLoans books={books} />
          ) : (
            <Catalog
              books={books}
              lang={lang}
              onAI={openAI}
              onDetails={setSelected}
              onToast={setToast}
            />
          )}
          {path === "/login" && (
            <LoginModal
              onClose={() => navigate("/")}
              onToast={setToast}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </>
      )}

      {selected && (
        <BookModal
          book={selected}
          onClose={() => setSelected(null)}
          onToast={setToast}
        />
      )}

      {ai && (
        <AIDrawer
          prompt={prompt}
          onClose={() => setAI(false)}
          onDetails={(b) => {
            setAI(false);
            setSelected(b);
          }}
          booksList={books}
          lang={lang}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
