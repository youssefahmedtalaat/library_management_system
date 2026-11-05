import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  AlertCircle,
  AlertTriangle,
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
  Eye,
  EyeOff,
  FileText,
  Filter,
  Globe,
  Hash,
  LayoutDashboard,
  Lock,
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
  X,
} from "lucide-react";
import { api } from "./services/api";
import { initialBooks as seedBooks } from "./data/mockData";
import { makeT, categoryEn, shelfEn } from "./i18n";

/* ═══════════════════════════════════════════════════════════
   Routing — a tiny history-based router (no render-time nav)
   ═══════════════════════════════════════════════════════════ */

const ROUTES = [
  "/",
  "/login",
  "/my-loans",
  "/librarian",
  "/librarian/circulation",
  "/librarian/catalog",
  "/librarian/reservations",
  "/librarian/overdues",
  "/admin",
  "/admin/policies",
  "/admin/audit",
];

function navigate(path) {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function useRouter() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Unknown route → fall back to the catalog (in an effect, never during render)
  useEffect(() => {
    if (!ROUTES.includes(path)) navigate("/");
  }, [path]);

  return path;
}

/* ═══════════════════════════════════════════════════════════
   Demo accounts — these match server/db/seeds.sql exactly
   ═══════════════════════════════════════════════════════════ */

const DEMO_ACCOUNTS = [
  {
    role: "member",
    email: "ahmed@library.sa",
    password: "member123",
    nameAr: "أحمد محمود التميمي",
    nameEn: "Ahmed Mahmoud Al-Tamimi",
    icon: User,
    home: "/",
  },
  {
    role: "librarian",
    email: "sulaiman@library.sa",
    password: "librarian123",
    nameAr: "سليمان العبدلي",
    nameEn: "Sulaiman Al-Abdali",
    icon: BookMarked,
    home: "/librarian",
  },
  {
    role: "admin",
    email: "admin@library.sa",
    password: "admin123",
    nameAr: "د. هشام القاسمي",
    nameEn: "Dr. Hesham Al-Qasimi",
    icon: Shield,
    home: "/admin",
  },
];

const roleHome = (role) =>
  role === "admin" ? "/admin" : role === "librarian" ? "/librarian" : "/";

/* ═══════════════════════════════════════════════════════════
   Catalog data helpers
   ═══════════════════════════════════════════════════════════ */

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80";

/** Merge a REST book with the bilingual seed record that shares its ISBN. */
function toBook(remote, seed, index) {
  const shelf = remote.shelf_location || seed?.shelf_location || "";
  return {
    id: remote.id ?? seed?.id ?? index + 1,
    isbn: remote.isbn || seed?.isbn || `978-000-000-${index}`,
    title: remote.title || seed?.title || "",
    titleEn: seed?.title_en || remote.title_en || remote.title || "",
    author: remote.author_name || seed?.author || "",
    authorEn: seed?.author_en || remote.author_name || "",
    category: remote.category_name || seed?.category || "عام",
    categoryEn:
      seed?.category_en ||
      categoryEn[remote.category_name || seed?.category] ||
      remote.category_name ||
      "General",
    description: remote.description || seed?.description || "",
    descriptionEn: seed?.description_en || remote.description || "",
    shelf,
    shelfEn: seed?.shelf_location_en || shelfEn(shelf),
    language: remote.language || seed?.language || "العربية",
    languageEn: seed?.language_en || "Arabic",
    rating: Number(remote.rating ?? seed?.rating ?? 0),
    reviews: Number(remote.ratings_count ?? seed?.ratings_count ?? 0),
    available: Number(remote.available_copies ?? seed?.available_copies ?? 0),
    total: Number(remote.total_copies ?? seed?.total_copies ?? 1),
    year: String(remote.publication_year || seed?.publication_year || ""),
    cover: remote.cover_url || seed?.cover_image || FALLBACK_COVER,
  };
}

/** Offline catalog: the bilingual seed data on its own. */
const OFFLINE_BOOKS = seedBooks.map((s, i) => toBook({}, s, i));

const bookTitle = (b, lang) => (lang === "en" ? b.titleEn || b.title : b.title);
const bookAuthor = (b, lang) => (lang === "en" ? b.authorEn || b.author : b.author);
const bookCategory = (b, lang) => (lang === "en" ? b.categoryEn || b.category : b.category);
const bookDesc = (b, lang) => (lang === "en" ? b.descriptionEn || b.description : b.description);
const bookShelf = (b, lang) => (lang === "en" ? b.shelfEn || b.shelf : b.shelf);
const bookLang = (b, lang) => (lang === "en" ? b.languageEn || b.language : b.language);

const barcodeFor = (book, n) =>
  `BC-${String(book.id).padStart(3, "0")}-${String(n + 1).padStart(2, "0")}`;

function formatDate(date, lang) {
  return new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════════
   Seeded operational records (local, but fully mutable)
   ═══════════════════════════════════════════════════════════ */

const MEMBERS = [
  { code: "MEM-2026-0042", nameAr: "أحمد محمود التميمي", nameEn: "Ahmed Al-Tamimi", loans: 2, fines: 0 },
  { code: "MEM-2026-0089", nameAr: "سارة خالد المنصور", nameEn: "Sara Al-Mansoor", loans: 1, fines: 15 },
  { code: "MEM-2026-0115", nameAr: "عمر ياسين الكردي", nameEn: "Omar Al-Kurdi", loans: 3, fines: 0 },
];

const memberName = (m, lang) => (lang === "en" ? m.nameEn : m.nameAr);

const DAY = 86400000;

function buildLoans(books) {
  return books.slice(0, 5).map((book, i) => {
    const member = MEMBERS[i % MEMBERS.length];
    const issued = Date.now() - (i + 3) * 2 * DAY;
    const overdue = i === 2;
    const due = overdue ? Date.now() - 4 * DAY : issued + 14 * DAY;
    return {
      id: `L-${1042 + i}`,
      bookId: book.id,
      barcode: barcodeFor(book, 0),
      memberCode: member.code,
      issued,
      due,
      renewals: i % 2,
      status: overdue ? "overdue" : "borrowed",
    };
  });
}

function buildReservations(books) {
  return books.slice(0, 5).map((book, i) => {
    const member = MEMBERS[i % MEMBERS.length];
    return {
      id: `R-${500 + i}`,
      bookId: book.id,
      memberCode: member.code,
      position: (i % 3) + 1,
      placed: Date.now() - (i + 1) * DAY,
      expires: Date.now() + (3 - (i % 3)) * DAY,
      status: i < 3 ? "active" : "fulfilled",
      notified: false,
    };
  });
}

function buildFines(books) {
  return books.slice(0, 5).map((book, i) => ({
    id: `F-${900 + i}`,
    bookId: book.id,
    memberCode: MEMBERS[i % MEMBERS.length].code,
    amount: (i + 2) * 5,
    assessed: Date.now() - (i + 2) * DAY,
    status: i < 3 ? "unpaid" : "paid",
  }));
}

const INITIAL_STAFF = [
  { id: 1, nameAr: "د. هشام القاسمي", nameEn: "Dr. Hesham Al-Qasimi", email: "admin@library.sa", role: "admin", lastLogin: Date.now() - 2 * 3600000, status: "active" },
  { id: 2, nameAr: "سليمان العبدلي", nameEn: "Sulaiman Al-Abdali", email: "sulaiman@library.sa", role: "librarian", lastLogin: Date.now() - 5 * 3600000, status: "active" },
  { id: 3, nameAr: "مها الشريف", nameEn: "Maha Al-Sharif", email: "maha@library.sa", role: "cataloger", lastLogin: Date.now() - 26 * 3600000, status: "active" },
];

const DEFAULT_POLICIES = {
  maxLoans: 3,
  loanDays: 14,
  maxRenewals: 2,
  finePerDay: 5,
  holdHours: 48,
  aiEnabled: true,
};

const INITIAL_AUDIT = [
  { id: 1, at: Date.now() - 12 * 60000, actorAr: "سليمان العبدلي", actorEn: "Sulaiman Al-Abdali", role: "librarian", action: "audit.actIssue", entity: "Loan #1042" },
  { id: 2, at: Date.now() - 48 * 60000, actorAr: "سليمان العبدلي", actorEn: "Sulaiman Al-Abdali", role: "librarian", action: "audit.actReturn", entity: "Loan #1039" },
  { id: 3, at: Date.now() - 3 * 3600000, actorAr: "مها الشريف", actorEn: "Maha Al-Sharif", role: "librarian", action: "audit.actSettle", entity: "Fine #901" },
  { id: 4, at: Date.now() - 5 * 3600000, actorAr: "د. هشام القاسمي", actorEn: "Dr. Hesham Al-Qasimi", role: "admin", action: "audit.actPolicies", entity: "Policy #1" },
  { id: 5, at: Date.now() - 26 * 3600000, actorAr: "مها الشريف", actorEn: "Maha Al-Sharif", role: "librarian", action: "audit.actAddBook", entity: "Book #8" },
];

/* ═══════════════════════════════════════════════════════════
   Primitives
   ═══════════════════════════════════════════════════════════ */

function Button({ children, variant = "secondary", onClick, type = "button", disabled = false, className = "", title, ...rest }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...rest}
    >
      {children}
    </button>
  );
}

function Badge({ status = "neutral", children }) {
  const icons = {
    available: CheckCircle2,
    borrowed: BookOpen,
    reserved: Clock,
    overdue: AlertCircle,
    neutral: Hash,
  };
  const Icon = icons[status] || Hash;
  return (
    <span className={`badge badge-${status}`}>
      <Icon size={13} />
      {children}
    </span>
  );
}

function Logo({ onClick }) {
  return (
    <div className="logo" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <span className="logo-mark"><BookOpen size={21} /></span>
      <span>
        <b>المكتبة الذكية</b>
        <small>Smart Library <em>LMS 2026</em></small>
      </span>
    </div>
  );
}

function DataTable({ columns, rows, empty }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="table-empty">{empty}</td></tr>
          ) : (
            rows.map((row, i) => <tr key={i}>{row.map((c, j) => <td key={j}>{c}</td>)}</tr>)
          )}
        </tbody>
      </table>
    </div>
  );
}

function PageTitle({ title, sub, action }) {
  return (
    <div className="page-title">
      <div><h1>{title}</h1><p>{sub}</p></div>
      {action}
    </div>
  );
}

/** Generic centred form modal, styled on the existing book-modal shell. */
function FormModal({ title, onClose, onSubmit, submitLabel, children, t }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="book-modal form-modal"
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
      >
        <div className="modal-head">
          <div><Plus /><h2>{title}</h2></div>
          <Button variant="ghost" className="icon-btn" onClick={onClose} title={t("common.close")}><X /></Button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <span />
          <div>
            <Button onClick={onClose}>{t("common.cancel")}</Button>
            <Button variant="primary" type="submit"><CheckCircle2 size={16} />{submitLabel}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Public chrome
   ═══════════════════════════════════════════════════════════ */

function PublicNav({ t, lang, setLang, dark, setDark, onAI, path, currentUser, onLogout, loanCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const go = (to) => { navigate(to); setMobileOpen(false); };

  return (
    <header className="public-nav">
      <Logo onClick={() => go("/")} />
      <nav className="nav-links">
        <button className={`nav-link ${path === "/" ? "active" : ""}`} onClick={() => go("/")}>
          <BookOpen size={17} />{t("nav.catalog")}
        </button>
        <button className={`nav-link ${path === "/my-loans" ? "active" : ""}`} onClick={() => go("/my-loans")}>
          <Clock size={17} />{t("nav.loans")}
          {loanCount > 0 && <span className="count">{loanCount}</span>}
        </button>
        <button className="nav-link ai-link" onClick={() => { onAI(); setMobileOpen(false); }}>
          <Sparkles size={17} />{t("nav.assistant")}
        </button>
      </nav>
      <div className="nav-tools">
        <Button variant="ghost" className="icon-btn" onClick={() => setDark(!dark)} title={t("nav.toggleTheme")}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button variant="ghost" onClick={() => setLang(lang === "ar" ? "en" : "ar")} title={t("nav.changeLanguage")}>
          <Globe size={17} />{lang === "ar" ? "EN" : "ع"}
        </Button>
        {currentUser ? (
          <div className="nav-user">
            {currentUser.role === "admin" && (
              <Button variant="secondary" onClick={() => go("/admin")}><Shield size={16} />{t("nav.adminPanel")}</Button>
            )}
            {currentUser.role === "librarian" && (
              <Button variant="secondary" onClick={() => go("/librarian")}><LayoutDashboard size={16} />{t("nav.librarianPanel")}</Button>
            )}
            <span className="nav-avatar" title={currentUser.name}>{currentUser.name?.charAt(0) || "U"}</span>
            <Button variant="ghost" className="icon-btn" onClick={onLogout} title={t("nav.signOut")}><LogOut size={17} /></Button>
          </div>
        ) : (
          <Button variant="primary" onClick={() => go("/login")}><LogIn size={17} />{t("nav.signIn")}</Button>
        )}
        <Button variant="ghost" className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)} title={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}>
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>
      {mobileOpen && (
        <div className="mobile-nav">
          <Button variant="ghost" onClick={() => go("/")}><BookOpen size={18} />{t("nav.catalog")}</Button>
          <Button variant="ghost" onClick={() => go("/my-loans")}><Clock size={18} />{t("nav.loans")}</Button>
          <Button variant="ai" onClick={() => { onAI(); setMobileOpen(false); }}><Sparkles size={18} />{t("nav.assistant")}</Button>
          {currentUser?.role === "admin" && (
            <Button variant="secondary" onClick={() => go("/admin")}><Shield size={18} />{t("nav.adminPanel")}</Button>
          )}
          {currentUser?.role === "librarian" && (
            <Button variant="secondary" onClick={() => go("/librarian")}><LayoutDashboard size={18} />{t("nav.librarianPanel")}</Button>
          )}
          {currentUser ? (
            <Button variant="danger" onClick={() => { onLogout(); setMobileOpen(false); }}><LogOut size={18} />{t("nav.signOut")}</Button>
          ) : (
            <Button variant="primary" onClick={() => go("/login")}><LogIn size={18} />{t("nav.signIn")}</Button>
          )}
        </div>
      )}
    </header>
  );
}

function AIBanner({ t, onAI }) {
  return (
    <section className="ai-banner">
      <span className="ai-orb"><Sparkles size={25} /></span>
      <div>
        <span className="eyebrow">{t("banner.eyebrow")}</span>
        <h1>{t("banner.title")}</h1>
        <p>{t("banner.desc")}</p>
      </div>
      <div className="banner-actions">
        <Button variant="ai" onClick={() => onAI(t("banner.promptMysteryFull"))}>
          <Sparkles size={16} />{t("banner.promptMystery")}
        </Button>
        <Button onClick={() => onAI(t("banner.promptAIFull"))}>
          <BookOpen size={16} />{t("banner.promptAI")}
        </Button>
      </div>
    </section>
  );
}

function BookCard({ book, lang, t, onDetails, onReserve }) {
  const pct = Math.min(100, Math.round((book.available / (book.total || 1)) * 100));
  return (
    <article className="book-card">
      <div className="cover-wrap" onClick={onDetails}>
        <img
          src={book.cover}
          alt={bookTitle(book, lang)}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }}
        />
        <Badge status={book.available > 0 ? "available" : "reserved"}>
          {book.available > 0 ? t("book.availableCount", { n: book.available }) : t("status.waitlist")}
        </Badge>
        <span className="rating">
          <Star size={13} fill="currentColor" />{book.rating} <small>({book.reviews})</small>
        </span>
        <div className="cover-meta">
          <span>{bookCategory(book, lang)}</span>
          <span><Calendar size={13} />{book.year}</span>
        </div>
      </div>
      <div className="book-body">
        <button className="title-link" onClick={onDetails}>{bookTitle(book, lang)}</button>
        <p className="author">{t("common.by")} {bookAuthor(book, lang)}</p>
        <p className="description">{bookDesc(book, lang)}</p>
        <div className="book-info">
          <span><MapPin size={14} />{bookShelf(book, lang)}</span>
          <span dir="ltr"><Hash size={14} />{book.isbn}</span>
          <div className="availability">
            <span>{t("book.copiesOf", { n: book.available, total: book.total })}</span>
            <div className="progress"><i style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
        <div className="card-actions">
          <Button onClick={onDetails}><BookOpen size={16} />{t("book.view")}</Button>
          <Button variant={book.available > 0 ? "primary" : "ai"} onClick={() => onReserve(book)}>
            {book.available > 0 ? <BookmarkCheck size={16} /> : <Clock size={16} />}
            {book.available > 0 ? t("book.hold") : t("book.queue")}
          </Button>
        </div>
      </div>
    </article>
  );
}

function Footer({ t, onAI }) {
  return (
    <footer>
      <div className="footer-highlights">
        <div><Sparkles /><span><b>{t("footer.h1Title")}</b><small>{t("footer.h1Sub")}</small></span></div>
        <div><Barcode /><span><b>{t("footer.h2Title")}</b><small>{t("footer.h2Sub")}</small></span></div>
        <div><ShieldCheck /><span><b>{t("footer.h3Title")}</b><small>{t("footer.h3Sub")}</small></span></div>
      </div>
      <div className="footer-main">
        <div>
          <Logo onClick={() => navigate("/")} />
          <p>{t("footer.brandDesc")}</p>
          <span className="online"><i />{t("footer.online")}</span>
        </div>
        <div>
          <b>{t("footer.discovery")}</b>
          <button onClick={() => navigate("/")}>{t("footer.browseAll")}</button>
          <button onClick={() => onAI(t("banner.promptAIFull"))}>{t("footer.techRefs")}</button>
          <button onClick={() => onAI(t("footer.promptHistory"))}>{t("footer.litHistory")}</button>
        </div>
        <div>
          <b>{t("footer.memberServices")}</b>
          <button onClick={() => navigate("/my-loans")}>{t("footer.myLoans")}</button>
          <button onClick={() => onAI(t("footer.promptPolicy"))}>{t("footer.lendingRules")}</button>
          <button onClick={() => navigate("/login")}>{t("footer.staffSignIn")}</button>
        </div>
        <div>
          <b>{t("footer.hoursContact")}</b>
          <span><Clock size={16} />{t("footer.hours")}</span>
          <span><MapPin size={16} />{t("footer.location")}</span>
          <span><Mail size={16} /><span dir="ltr">info@smartlibrary.sa</span></span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t("footer.copyright")}</span>
        <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {t("footer.backToTop")} <ArrowUp size={15} />
        </Button>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   Public catalog
   ═══════════════════════════════════════════════════════════ */

function Catalog({ books, lang, t, onAI, onDetails, onReserve, initialQuery }) {
  const [search, setSearch] = useState(initialQuery || "");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("all");

  useEffect(() => { if (initialQuery) setSearch(initialQuery); }, [initialQuery]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      if (category && b.category !== category) return false;
      if (availability === "available" && b.available === 0) return false;
      if (availability === "borrowed" && b.available > 0) return false;
      if (!q) return true;
      return `${b.title} ${b.titleEn} ${b.author} ${b.authorEn} ${b.isbn} ${b.category} ${b.categoryEn}`
        .toLowerCase()
        .includes(q);
    });
  }, [books, search, category, availability]);

  const categories = useMemo(() => [...new Set(books.map((b) => b.category))], [books]);
  const clear = () => { setSearch(""); setCategory(""); setAvailability("all"); };

  return (
    <>
      <main className="public-main">
        <AIBanner t={t} onAI={onAI} />
        <section className="filter-card">
          <label className="search-field">
            <Search size={19} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("catalog.searchPlaceholder")}
              aria-label={t("common.search")}
            />
            {search && <button onClick={() => setSearch("")} title={t("common.close")}><X size={16} /></button>}
          </label>
          <label className="select-field">
            <BookMarked size={17} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label={t("catalog.allCategories")}>
              <option value="">{t("catalog.allCategories")}</option>
              {categories.map((c) => (
                <option key={c} value={c}>{lang === "en" ? categoryEn[c] || c : c}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <label className="select-field">
            <CheckCircle2 size={17} />
            <select value={availability} onChange={(e) => setAvailability(e.target.value)} aria-label={t("catalog.allBooks")}>
              <option value="all">{t("catalog.allBooks")}</option>
              <option value="available">{t("catalog.availableNow")}</option>
              <option value="borrowed">{t("catalog.borrowedNow")}</option>
            </select>
            <ChevronDown size={15} />
          </label>
          <Button className="filter-button" onClick={clear}>
            <Filter size={17} />{t("catalog.resetFilters")}
          </Button>
        </section>

        <div className="results-head">
          <div>
            <span className="eyebrow">{t("catalog.eyebrow")}</span>
            <h2><b>{filtered.length}</b> {t("catalog.resultsCount")}</h2>
          </div>
          <p><MapPin size={15} />{t("catalog.shelfNote")}</p>
        </div>

        {filtered.length ? (
          <section className="book-grid">
            {filtered.map((book) => (
              <BookCard
                key={book.isbn || book.id}
                book={book}
                lang={lang}
                t={t}
                onDetails={() => onDetails(book)}
                onReserve={onReserve}
              />
            ))}
          </section>
        ) : (
          <div className="empty">
            <span><BookOpen /></span>
            <h2>{t("catalog.emptyTitle")}</h2>
            <p>{t("catalog.emptyDesc")}</p>
            <div>
              <Button onClick={clear}>{t("catalog.clearFilters")}</Button>
              <Button variant="ai" onClick={() => onAI(search)}>
                <Sparkles size={16} />{t("catalog.aiSearch")}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer t={t} onAI={onAI} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   Dashboard chrome
   ═══════════════════════════════════════════════════════════ */

const librarianNav = [
  ["/librarian", "dash.title", BarChart3],
  ["/librarian/circulation", "dash.circulationDesk", ArrowRightLeft],
  ["/librarian/catalog", "cat.title", BookMarked],
  ["/librarian/reservations", "res.title", Clock],
  ["/librarian/overdues", "ovd.title", AlertTriangle],
];

const adminNav = [
  ["/admin", "staff.title", Users],
  ["/admin/policies", "pol.title", Settings],
  ["/admin/audit", "audit.title", FileText],
];

const SHORT_NAV_LABEL = {
  "/librarian": { ar: "لوحة المتابعة", en: "Dashboard" },
  "/librarian/circulation": { ar: "مكتب التداول", en: "Circulation desk" },
  "/librarian/catalog": { ar: "إدارة الفهرس", en: "Catalog" },
  "/librarian/reservations": { ar: "الحجوزات", en: "Reservations" },
  "/librarian/overdues": { ar: "المتأخرات والغرامات", en: "Overdues & fines" },
  "/admin": { ar: "إدارة الموظفين", en: "Staff management" },
  "/admin/policies": { ar: "السياسات", en: "Policies" },
  "/admin/audit": { ar: "سجل التدقيق", en: "Audit log" },
};

function Sidebar({ path, admin, dark, setDark, lang, setLang, t, onAI, open, setOpen, onLogout, currentUser, counts, onBell }) {
  const links = admin ? adminNav : librarianNav;
  const go = (to) => { navigate(to); setOpen(false); };

  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-mobile-head">
        <Logo onClick={() => go("/")} />
        <Button variant="ghost" className="icon-btn" onClick={() => setOpen(false)} title={t("nav.closeMenu")}><X /></Button>
      </div>
      <Logo onClick={() => go(admin ? "/admin" : "/librarian")} />
      <div className="user-card">
        <span>{currentUser?.name?.charAt(0) || (admin ? "ه" : "س")}</span>
        <div>
          <b>{currentUser?.name || "—"}</b>
          <small>{admin ? t("login.roleAdmin") : t("login.roleLibrarian")}</small>
        </div>
      </div>
      <small className="side-label">{t("topbar.mainMenu")}</small>
      <nav>
        {links.map(([href, , Icon]) => {
          const badge =
            href === "/librarian/reservations" ? counts.reservations :
            href === "/librarian/overdues" ? counts.overdues : 0;
          return (
            <button key={href} className={path === href ? "active" : ""} onClick={() => go(href)}>
              <Icon size={19} />
              {SHORT_NAV_LABEL[href][lang]}
              {badge > 0 && (
                <span className={href.includes("overdues") ? "danger-count" : "info-count"}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>
      <small className="side-label">{t("topbar.tools")}</small>
      <button className="sidebar-ai" onClick={() => { onAI(); setOpen(false); }}>
        <Sparkles size={19} />{t("nav.assistant")}
      </button>
      <div className="sidebar-bottom">
        <button onClick={() => go("/")}><ExternalLink size={18} />{t("nav.publicSite")}</button>
        <div>
          <button onClick={() => setDark(!dark)} title={t("nav.toggleTheme")}>{dark ? <Sun /> : <Moon />}</button>
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} title={t("nav.changeLanguage")}><Globe /></button>
          <button onClick={onBell} title={t("common.notifications")}><Bell /></button>
          <button className="logout" onClick={onLogout} title={t("nav.signOut")}><LogOut /></button>
        </div>
      </div>
    </aside>
  );
}

function NotificationPanel({ t, onClose }) {
  const items = [
    { key: 1, title: t("topbar.notif1"), text: t("topbar.notif1Text"), type: "warning", time: t("dash.hoursAgo") },
    { key: 2, title: t("topbar.notif2"), text: t("topbar.notif2Text"), type: "info", time: t("dash.hourAgo") },
    { key: 3, title: t("topbar.notif3"), text: t("topbar.notif3Text"), type: "success", time: t("dash.minsAgo", { n: 40 }) },
  ];
  return (
    <>
      <div className="dropdown-overlay" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-head">
          <span><Bell size={15} />{t("common.notifications")}</span>
          <Badge status="reserved">{items.length}</Badge>
        </div>
        <div className="notif-list">
          {items.map((n) => (
            <div key={n.key} className="notif-item">
              <i className={`notif-dot ${n.type}`} />
              <div>
                <div className="notif-row"><b>{n.title}</b><time>{n.time}</time></div>
                <p>{n.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Topbar({ t, lang, admin, onMenu, onSearch }) {
  const [query, setQuery] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const today = useMemo(
    () => new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }),
    [lang]
  );

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <header className="topbar">
      <Button variant="ghost" className="dash-menu" onClick={onMenu} title={t("nav.openMenu")}><Menu /></Button>
      <div>
        <h2>{admin ? t("topbar.adminTitle") : t("topbar.librarianTitle")}</h2>
        <p><Calendar size={14} />{today}</p>
      </div>
      <form className="top-search" onSubmit={submit}>
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={admin ? t("topbar.searchAdmin") : t("topbar.searchLibrarian")}
          title={t("topbar.searchHint")}
        />
        <button type="submit" title={t("common.search")}><Filter size={16} /></button>
      </form>
      <Button onClick={() => navigate("/")}><ExternalLink size={16} />{t("nav.publicSite")}</Button>
      <div className="bell-wrap">
        <Button variant="ghost" className="icon-btn bell" onClick={() => setBellOpen((v) => !v)} title={t("common.notifications")}>
          <Bell size={19} /><i>3</i>
        </Button>
        {bellOpen && <NotificationPanel t={t} onClose={() => setBellOpen(false)} />}
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   Librarian — dashboard
   ═══════════════════════════════════════════════════════════ */

function Kpi({ label, value, sub, type, icon: Icon }) {
  return (
    <div className={`kpi kpi-${type}`}>
      <span><Icon /></span>
      <div><small>{label}</small><strong>{value}</strong><p>{sub}</p></div>
    </div>
  );
}

function Dashboard({ t, lang, books, loans, reservations, fines, audit, onIssue, onReturn }) {
  const [quickMode, setQuickMode] = useState("issue");
  const [barcode, setBarcode] = useState("");
  const [memberCode, setMemberCode] = useState("");

  const activeLoans = loans.filter((l) => l.status !== "returned");
  const overdues = loans.filter((l) => l.status === "overdue");
  const activeRes = reservations.filter((r) => r.status === "active");
  const unpaid = fines.filter((f) => f.status === "unpaid").reduce((s, f) => s + f.amount, 0);
  const totalCopies = books.reduce((s, b) => s + b.total, 0);
  const availableCopies = books.reduce((s, b) => s + b.available, 0);

  const submit = (e) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    if (quickMode === "issue") onIssue(barcode.trim(), memberCode.trim());
    else onReturn(barcode.trim());
    setBarcode("");
    setMemberCode("");
  };

  const week = [48, 65, 44, 78, 62, 86, 94];
  const dayKeys = ["day.sun", "day.mon", "day.tue", "day.wed", "day.thu", "day.fri", "day.sat"];

  return (
    <div>
      <PageTitle title={t("dash.title")} sub={t("dash.sub")} />
      <div className="kpi-grid">
        <Kpi label={t("dash.kpiCatalog")} value={books.length} sub={t("dash.kpiCatalogSub", { copies: totalCopies })} type="neutral" icon={BookOpen} />
        <Kpi label={t("dash.kpiLoans")} value={activeLoans.length} sub={t("dash.kpiLoansSub", { n: availableCopies })} type="borrowed" icon={ArrowRightLeft} />
        <Kpi label={t("dash.kpiReservations")} value={activeRes.length} sub={t("dash.kpiReservationsSub")} type="reserved" icon={Clock} />
        <Kpi label={t("dash.kpiOverdues")} value={overdues.length} sub={t("dash.kpiOverduesSub", { n: unpaid })} type="overdue" icon={AlertTriangle} />
      </div>

      <div className="dashboard-grid">
        <section className="panel circulation-quick">
          <div className="panel-head">
            <div>
              <Barcode />
              <span>
                <h3>{t("dash.quickDesk")}</h3>
                <p>{quickMode === "issue" ? t("dash.quickDeskIssueSub") : t("dash.quickDeskReturnSub")}</p>
              </span>
            </div>
            <span className="mode">
              <button type="button" className={quickMode === "issue" ? "active" : ""} onClick={() => setQuickMode("issue")}>
                {t("dash.modeIssue")}
              </button>
              <button type="button" className={quickMode === "return" ? "active" : ""} onClick={() => setQuickMode("return")}>
                {t("dash.modeReturn")}
              </button>
            </span>
          </div>
          <form onSubmit={submit}>
            <label className="form-group">
              <span>{quickMode === "issue" ? t("dash.barcodeLabel") : t("dash.barcodeReturnLabel")}</span>
              <span className="input-icon">
                <Barcode />
                <input dir="ltr" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="BC-xxx-xx" />
              </span>
            </label>
            {quickMode === "issue" && (
              <label className="form-group">
                <span>{t("dash.memberCodeLabel")}</span>
                <span className="input-icon">
                  <Users />
                  <input dir="ltr" value={memberCode} onChange={(e) => setMemberCode(e.target.value)} placeholder="MEM-2026-0042" />
                </span>
              </label>
            )}
            <Button type="submit" variant="primary" className="wide" disabled={!barcode.trim()}>
              {quickMode === "issue"
                ? <><ArrowRightLeft size={17} />{t("dash.submitIssue")}</>
                : <><RotateCcw size={17} />{t("dash.submitReturn")}</>}
            </Button>
          </form>
          <div className="presets">
            <small>{t("dash.presets")}</small>
            <button type="button" dir="ltr" onClick={() => { setQuickMode("issue"); setBarcode(loans[0]?.barcode || "BC-001-01"); setMemberCode(MEMBERS[0].code); }}>
              Issue: {loans[0]?.barcode || "BC-001-01"}
            </button>
            <button type="button" dir="ltr" onClick={() => { setQuickMode("return"); setBarcode(overdues[0]?.barcode || loans[1]?.barcode || "BC-002-01"); }}>
              Return: {overdues[0]?.barcode || loans[1]?.barcode || "BC-002-01"}
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <div><FileText /><span><h3>{t("dash.recentActivity")}</h3><p>{t("dash.recentActivitySub")}</p></span></div>
            <Button variant="ghost" onClick={() => navigate("/admin/audit")}>{t("common.viewAll")}</Button>
          </div>
          <div className="timeline">
            {audit.slice(0, 4).map((entry) => (
              <div key={entry.id}>
                <i />
                <span>
                  <b>{t(entry.action)}</b>
                  <small>{entry.entity}</small>
                  <em>{t("dash.by")}: {lang === "en" ? entry.actorEn : entry.actorAr}</em>
                </span>
                <time>{formatDate(entry.at, lang)}</time>
              </div>
            ))}
          </div>
        </section>

        <div className="right-stack">
          <section className="panel compact">
            <div className="panel-head"><h3>{t("dash.weeklyTraffic")}</h3><Calendar size={18} /></div>
            <div className="chart">
              {week.map((h, i) => (
                <span key={i}><i style={{ height: `${h}%` }} /><small>{t(dayKeys[i])}</small></span>
              ))}
            </div>
          </section>
          <section className="panel compact">
            <div className="panel-head"><h3>{t("dash.inventory")}</h3><Users size={18} /></div>
            <div className="stat-list">
              <span>{t("dash.registeredMembers")} <b>{MEMBERS.length * 281}</b></span>
              <span>{t("dash.utilization")} <b>{totalCopies ? Math.round(((totalCopies - availableCopies) / totalCopies) * 100) : 0}%</b></span>
              <span>{t("dash.avgLoans")} <b>{(activeLoans.length / MEMBERS.length).toFixed(1)}</b></span>
              <span>{t("dash.unpaidFines")} <b className="danger-text">{unpaid} {t("common.egp")}</b></span>
            </div>
          </section>
          <section className="panel compact">
            <h3>{t("dash.quickActions")}</h3>
            <div className="quick-actions">
              <Button variant="primary" onClick={() => navigate("/librarian/circulation")}>
                <ArrowRightLeft size={16} />{t("dash.circulationDesk")}
              </Button>
              <Button onClick={() => navigate("/librarian/catalog")}>
                <Plus size={16} />{t("dash.addBook")}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Librarian — circulation desk
   ═══════════════════════════════════════════════════════════ */

function Circulation({ t, lang, books, loans, policies, onIssue, onReturn }) {
  const [mode, setMode] = useState("issue");
  const [barcode, setBarcode] = useState("");
  const [member, setMember] = useState(MEMBERS[0].code);

  const activeLoans = loans.filter((l) => l.status !== "returned");
  const matchedLoan = activeLoans.find((l) => l.barcode.toUpperCase() === barcode.trim().toUpperCase());
  const matchedBook =
    books.find((b) => b.id === matchedLoan?.bookId) ||
    books.find((b) => barcodeFor(b, 0).toUpperCase() === barcode.trim().toUpperCase());
  const selectedMember = MEMBERS.find((m) => m.code === member);
  const dueDate = new Date(Date.now() + policies.loanDays * DAY);
  const lateDays = matchedLoan?.status === "overdue"
    ? Math.max(1, Math.ceil((Date.now() - matchedLoan.due) / DAY))
    : 0;

  const submit = () => {
    if (!barcode.trim()) return;
    if (mode === "issue") onIssue(barcode.trim(), member);
    else onReturn(barcode.trim());
    setBarcode("");
  };

  return (
    <div>
      <PageTitle
        title={t("circ.title")}
        sub={t("circ.sub")}
        action={
          <span className="segmented">
            <button className={mode === "issue" ? "active" : ""} onClick={() => setMode("issue")}>
              <BookOpen />{t("circ.tabIssue")}
            </button>
            <button className={mode === "return" ? "active" : ""} onClick={() => setMode("return")}>
              <RotateCcw />{t("circ.tabReturn")}
            </button>
          </span>
        }
      />
      <div className="two-col">
        <section className="panel form-panel">
          <div className="panel-head">
            <div>{mode === "issue" ? <BookOpen /> : <RotateCcw />}<h3>{mode === "issue" ? t("circ.formIssue") : t("circ.formReturn")}</h3></div>
          </div>
          {mode === "issue" && (
            <label className="form-group">
              <span>{t("circ.memberLabel")}</span>
              <select value={member} onChange={(e) => setMember(e.target.value)}>
                {MEMBERS.map((m) => (
                  <option key={m.code} value={m.code}>
                    {memberName(m, lang)} ({m.code}) — {t("status.active")} [{m.loans}/{policies.maxLoans}]
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="form-group">
            <span>{t("dash.barcodeLabel")}</span>
            <span className="input-icon">
              <Barcode />
              <input value={barcode} onChange={(e) => setBarcode(e.target.value)} dir="ltr" placeholder="BC-xxx-xx" />
            </span>
          </label>
          <div className="chips">
            {activeLoans.slice(0, 3).map((l) => (
              <button key={l.id} onClick={() => setBarcode(l.barcode)} dir="ltr">
                {l.barcode}{l.status === "overdue" ? " ⚠️" : ""}
              </button>
            ))}
          </div>
          <div className="terms">
            <ShieldCheck />
            <span>
              <b>{mode === "issue" ? t("circ.termsIssue", { days: policies.loanDays }) : t("circ.termsReturn")}</b>
              <small>
                {mode === "issue"
                  ? t("circ.termsIssueSub", { date: formatDate(dueDate, lang) })
                  : t("circ.termsReturnSub", { fine: policies.finePerDay })}
              </small>
            </span>
          </div>
          <Button variant="primary" className="wide tall" disabled={!barcode.trim()} onClick={submit}>
            <CheckCircle2 />{mode === "issue" ? t("circ.submitIssue") : t("circ.submitReturn")}
          </Button>
        </section>

        <section className="panel validation">
          <div className="panel-head">
            <div><ShieldCheck /><h3>{mode === "issue" ? t("circ.validationIssue") : t("circ.validationReturn")}</h3></div>
          </div>
          {barcode.trim() ? (
            <>
              <div className="member-preview">
                <span className="avatar">{memberName(selectedMember, lang).charAt(0)}</span>
                <div><b>{memberName(selectedMember, lang)}</b><small dir="ltr">{selectedMember.code}</small></div>
                <Badge status="available">{t("status.activeMembership")}</Badge>
              </div>
              {matchedBook ? (
                <div className="copy-preview">
                  <img src={matchedBook.cover} alt="" onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }} />
                  <div>
                    <Badge status={lateDays ? "overdue" : "available"}>
                      {lateDays ? t("circ.overdueDays", { n: lateDays }) : t("status.available")}
                    </Badge>
                    <h3>{bookTitle(matchedBook, lang)}</h3>
                    <p><MapPin />{bookShelf(matchedBook, lang)}</p>
                  </div>
                </div>
              ) : (
                <div className="danger-alert">
                  <AlertTriangle />
                  <div><b>{t("common.error")}</b><p>{t("common.noResults")}</p></div>
                </div>
              )}
              {lateDays > 0 && (
                <div className="danger-alert">
                  <AlertTriangle />
                  <div>
                    <b>{t("circ.overdueAlert")}</b>
                    <p>{t("circ.overdueAlertSub", { amount: lateDays * policies.finePerDay })}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="placeholder"><Barcode /><p>{t("circ.placeholder")}</p></div>
          )}
        </section>
      </div>

      <section className="panel table-panel">
        <div className="panel-head">
          <div><Clock /><h3>{t("circ.tableTitle")}</h3><Badge status="borrowed">{t("circ.loansCount", { n: activeLoans.length })}</Badge></div>
        </div>
        <DataTable
          empty={t("common.noResults")}
          columns={[t("circ.colBarcode"), t("circ.colTitle"), t("circ.colBorrower"), t("circ.colIssued"), t("circ.colDue"), t("circ.colStatus"), t("circ.colAction")]}
          rows={activeLoans.map((l) => {
            const book = books.find((b) => b.id === l.bookId);
            const m = MEMBERS.find((x) => x.code === l.memberCode);
            const late = l.status === "overdue";
            return [
              <code dir="ltr" key="c">{l.barcode}</code>,
              <b key="t">{book ? bookTitle(book, lang) : "—"}</b>,
              memberName(m || MEMBERS[0], lang),
              formatDate(l.issued, lang),
              late ? <b key="d" className="danger-text">{formatDate(l.due, lang)}</b> : formatDate(l.due, lang),
              <Badge key="b" status={late ? "overdue" : "borrowed"}>{late ? t("status.overdue") : t("status.borrowed")}</Badge>,
              <Button key="a" onClick={() => { setMode("return"); setBarcode(l.barcode); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <RotateCcw size={14} />{t("circ.checkIn")}
              </Button>,
            ];
          })}
        />
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Librarian — catalog management
   ═══════════════════════════════════════════════════════════ */

function CatalogAdmin({ t, lang, books, onDetails, onAddBook }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "", author: "", isbn: "", category: "ذكاء اصطناعي وتكنولوجيا",
    year: "2026", shelf: "جناح التقنية - رف CS-20", copies: 3, description: "",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) =>
      `${b.title} ${b.titleEn} ${b.author} ${b.authorEn} ${b.isbn}`.toLowerCase().includes(q)
    );
  }, [books, search]);

  const submit = () => {
    if (!form.title.trim() || !form.author.trim() || !form.isbn.trim()) return;
    onAddBook(form);
    setShowModal(false);
    setForm({ title: "", author: "", isbn: "", category: "ذكاء اصطناعي وتكنولوجيا", year: "2026", shelf: "جناح التقنية - رف CS-20", copies: 3, description: "" });
  };

  return (
    <div>
      <PageTitle
        title={t("cat.title")}
        sub={t("cat.sub")}
        action={<Button variant="primary" onClick={() => setShowModal(true)}><Plus />{t("cat.addTitle")}</Button>}
      />
      <section className="panel search-panel">
        <label className="input-icon">
          <Search />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("cat.searchPlaceholder")} />
        </label>
      </section>
      <DataTable
        empty={t("common.noResults")}
        columns={[t("cat.colBook"), t("cat.colCategory"), t("cat.colShelf"), t("cat.colTotal"), t("cat.colAvailable"), t("cat.colBarcodes"), t("cat.colActions")]}
        rows={filtered.map((b) => [
          <span key="bk" className="table-book">
            <img src={b.cover} alt="" onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }} />
            <span><b>{bookTitle(b, lang)}</b><small>{bookAuthor(b, lang)}</small><code dir="ltr">{b.isbn}</code></span>
          </span>,
          <Badge key="cat">{bookCategory(b, lang)}</Badge>,
          <span key="sh" className="with-icon"><MapPin />{bookShelf(b, lang)}</span>,
          <b key="tot">{b.total}</b>,
          <Badge key="avail" status={b.available > 0 ? "available" : "borrowed"}>
            {b.available > 0 ? t("book.availableCount", { n: b.available }) : t("status.fullyBorrowed")}
          </Badge>,
          <span key="bcs" className="barcode-cluster">
            {Array.from({ length: Math.min(b.total, 3) }, (_, n) => <code key={n}>{barcodeFor(b, n)}</code>)}
          </span>,
          <Button key="btn" onClick={() => onDetails(b)}>{t("common.manage")}</Button>,
        ])}
      />

      {showModal && (
        <FormModal t={t} title={t("cat.modalTitle")} submitLabel={t("cat.saveBook")} onClose={() => setShowModal(false)} onSubmit={submit}>
          <label className="form-group">
            <span>{t("cat.fieldTitle")}</span>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <div className="form-row">
            <label className="form-group">
              <span>{t("cat.fieldAuthor")}</span>
              <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </label>
            <label className="form-group">
              <span>{t("cat.fieldIsbn")}</span>
              <input required dir="ltr" placeholder="978-xxx-xxx-xxx-x" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
            </label>
          </div>
          <div className="form-row">
            <label className="form-group">
              <span>{t("cat.fieldCategory")}</span>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {Object.keys(categoryEn).map((c) => (
                  <option key={c} value={c}>{lang === "en" ? categoryEn[c] : c}</option>
                ))}
              </select>
            </label>
            <label className="form-group">
              <span>{t("cat.fieldYear")}</span>
              <input type="number" min="1900" max="2100" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </label>
          </div>
          <div className="form-row">
            <label className="form-group">
              <span>{t("cat.fieldShelf")}</span>
              <input value={form.shelf} onChange={(e) => setForm({ ...form, shelf: e.target.value })} />
            </label>
            <label className="form-group">
              <span>{t("cat.fieldCopies")}</span>
              <input type="number" min="1" max="20" value={form.copies} onChange={(e) => setForm({ ...form, copies: Number(e.target.value) })} />
            </label>
          </div>
          <label className="form-group">
            <span>{t("cat.fieldDescription")}</span>
            <textarea rows={3} placeholder={t("cat.descriptionPlaceholder")} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
        </FormModal>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Librarian — reservations
   ═══════════════════════════════════════════════════════════ */

function Reservations({ t, lang, books, reservations, onNotify, onCancel }) {
  const [filter, setFilter] = useState("active");
  const activeCount = reservations.filter((r) => r.status === "active").length;
  const rows = filter === "active" ? reservations.filter((r) => r.status === "active") : reservations;

  return (
    <div>
      <PageTitle
        title={t("res.title")}
        sub={t("res.sub")}
        action={
          <span className="segmented">
            <button type="button" className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
              {t("res.tabActive", { n: activeCount })}
            </button>
            <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              {t("res.tabAll", { n: reservations.length })}
            </button>
          </span>
        }
      />
      <DataTable
        empty={t("res.empty")}
        columns={[t("res.colTitle"), t("res.colMember"), t("res.colCode"), t("res.colQueue"), t("res.colPlaced"), t("res.colExpires"), t("res.colStatus"), t("res.colActions")]}
        rows={rows.map((r) => {
          const book = books.find((b) => b.id === r.bookId);
          const m = MEMBERS.find((x) => x.code === r.memberCode) || MEMBERS[0];
          return [
            <b key="t">{book ? bookTitle(book, lang) : "—"}</b>,
            <span key="u" className="with-icon"><User />{memberName(m, lang)}</span>,
            <code key="c">{r.memberCode}</code>,
            <Badge key="q" status="reserved">{t("member.queuePosition", { n: r.position })}</Badge>,
            formatDate(r.placed, lang),
            formatDate(r.expires, lang),
            <Badge key="st" status={r.status === "active" ? "reserved" : "available"}>
              {r.status === "active" ? t("status.active") : t("status.paid")}
            </Badge>,
            <span key="act" className="row-actions">
              {r.status === "active" ? (
                <>
                  <Button onClick={() => onNotify(r)} disabled={r.notified}>
                    <Bell size={14} />{t("res.notify")}
                  </Button>
                  <Button variant="danger" onClick={() => onCancel(r)}>
                    <X size={14} />{t("res.cancel")}
                  </Button>
                </>
              ) : (
                <span className="success-text">{t("ovd.settled")}</span>
              )}
            </span>,
          ];
        })}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Librarian — overdues & fines
   ═══════════════════════════════════════════════════════════ */

function Overdues({ t, lang, books, loans, fines, policies, onReturn, onSettle }) {
  const [tab, setTab] = useState("overdue");
  const overdueLoans = loans.filter((l) => l.status === "overdue");
  const unpaidTotal = fines.filter((f) => f.status === "unpaid").reduce((s, f) => s + f.amount, 0);
  const unpaidCount = fines.filter((f) => f.status === "unpaid").length;

  return (
    <div>
      <PageTitle
        title={t("ovd.title")}
        sub={t("ovd.sub")}
        action={
          <span className="segmented">
            <button className={tab === "overdue" ? "active" : ""} onClick={() => setTab("overdue")}>
              {t("ovd.tabOverdue", { n: overdueLoans.length })}
            </button>
            <button className={tab === "fines" ? "active" : ""} onClick={() => setTab("fines")}>
              {t("ovd.tabFines", { n: fines.length })}
            </button>
          </span>
        }
      />
      <section className="overdue-banner">
        <span><AlertTriangle /></span>
        <div>
          <h2>{t("ovd.bannerTitle", { amount: unpaidTotal })}</h2>
          <p>{t("ovd.bannerSub", { fine: policies.finePerDay, days: policies.loanDays })}</p>
        </div>
        <Badge status="overdue">{t("ovd.pendingClaims", { n: unpaidCount })}</Badge>
      </section>

      {tab === "overdue" ? (
        <DataTable
          empty={t("ovd.emptyOverdue")}
          columns={[t("ovd.colBarcode"), t("ovd.colBook"), t("ovd.colBorrower"), t("ovd.colDue"), t("ovd.colDaysLate"), t("ovd.colFine"), t("ovd.colQuickReturn")]}
          rows={overdueLoans.map((l) => {
            const book = books.find((b) => b.id === l.bookId);
            const m = MEMBERS.find((x) => x.code === l.memberCode) || MEMBERS[0];
            const late = Math.max(1, Math.ceil((Date.now() - l.due) / DAY));
            return [
              <code key="c">{l.barcode}</code>,
              <b key="t">{book ? bookTitle(book, lang) : "—"}</b>,
              <span key="u"><b>{memberName(m, lang)}</b><small className="block">{m.code}</small></span>,
              <b key="d" className="danger-text">{formatDate(l.due, lang)}</b>,
              <Badge key="b" status="overdue">{t("ovd.daysLate", { n: late })}</Badge>,
              <b key="f" className="danger-text">{late * policies.finePerDay} {t("common.egp")}</b>,
              <Button key="btn" onClick={() => onReturn(l.barcode)}>
                <RotateCcw size={14} />{t("ovd.checkInAssess")}
              </Button>,
            ];
          })}
        />
      ) : (
        <DataTable
          empty={t("common.noResults")}
          columns={[t("ovd.colMember"), t("ovd.colMemberCode"), t("ovd.colBookSimple"), t("ovd.colAmount"), t("ovd.colReason"), t("ovd.colDate"), t("circ.colStatus"), t("ovd.colSettlement")]}
          rows={fines.map((f) => {
            const book = books.find((b) => b.id === f.bookId);
            const m = MEMBERS.find((x) => x.code === f.memberCode) || MEMBERS[0];
            const unpaid = f.status === "unpaid";
            return [
              <b key="u">{memberName(m, lang)}</b>,
              <code key="c">{f.memberCode}</code>,
              book ? bookTitle(book, lang) : "—",
              <b key="f" className={unpaid ? "danger-text" : ""}>{f.amount} {t("common.egp")}</b>,
              t("ovd.reasonLate"),
              formatDate(f.assessed, lang),
              <Badge key="st" status={unpaid ? "overdue" : "available"}>{unpaid ? t("status.unpaid") : t("status.paid")}</Badge>,
              unpaid ? (
                <Button key="btn" variant="primary" onClick={() => onSettle(f)}>
                  <CheckCircle2 size={14} />{t("ovd.settle")}
                </Button>
              ) : (
                <span key="btn" className="success-text">{t("ovd.settled")}</span>
              ),
            ];
          })}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Admin — staff, policies, audit
   ═══════════════════════════════════════════════════════════ */

function Staff({ t, lang, staff, onAddStaff }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "librarian" });

  const roleTitle = (role) =>
    role === "admin" ? t("staff.roleAdmin") : role === "cataloger" ? t("staff.roleCataloger") : t("staff.roleLibrarian");

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onAddStaff(form);
    setShowModal(false);
    setForm({ name: "", email: "", role: "librarian" });
  };

  return (
    <div>
      <PageTitle
        title={t("staff.title")}
        sub={t("staff.sub")}
        action={<Button variant="primary" onClick={() => setShowModal(true)}><Plus />{t("staff.add")}</Button>}
      />
      <DataTable
        empty={t("common.noResults")}
        columns={[t("staff.colStaff"), t("staff.colEmail"), t("staff.colRole"), t("staff.colJobTitle"), t("staff.colLastLogin"), t("staff.colStatus")]}
        rows={staff.map((s) => {
          const name = lang === "en" ? s.nameEn : s.nameAr;
          return [
            <span key="stf" className="staff-name"><i>{name.charAt(0)}</i><b>{name}</b></span>,
            <span key="ml" className="with-icon"><Mail />{s.email}</span>,
            <Badge key="rl">{s.role}</Badge>,
            roleTitle(s.role),
            formatDate(s.lastLogin, lang),
            <Badge key="act" status="available">{t("status.active")}</Badge>,
          ];
        })}
      />

      {showModal && (
        <FormModal t={t} title={t("staff.modalTitle")} submitLabel={t("staff.create")} onClose={() => setShowModal(false)} onSubmit={submit}>
          <label className="form-group">
            <span>{t("staff.fieldName")}</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("staff.namePlaceholder")} />
          </label>
          <label className="form-group">
            <span>{t("staff.fieldEmail")}</span>
            <input required type="email" dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="employee@library.sa" />
          </label>
          <label className="form-group">
            <span>{t("staff.fieldRole")}</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="librarian">{t("staff.roleLibrarian")}</option>
              <option value="cataloger">{t("staff.roleCataloger")}</option>
              <option value="admin">{t("staff.roleAdmin")}</option>
            </select>
          </label>
        </FormModal>
      )}
    </div>
  );
}

function Policies({ t, policies, onSave, onReset }) {
  const [form, setForm] = useState(policies);
  useEffect(() => setForm(policies), [policies]);

  const fields = [
    ["maxLoans", "pol.maxLoans", "pol.unitBooks", 1, 10, 1],
    ["loanDays", "pol.loanDays", "pol.unitDays", 1, 60, 1],
    ["maxRenewals", "pol.maxRenewals", "pol.unitTimes", 0, 5, 1],
  ];
  const fineFields = [
    ["finePerDay", "pol.finePerDay", "pol.unitEgpDay", 0, 100, 0.5],
    ["holdHours", "pol.holdWindow", "pol.unitHours", 12, 168, 1],
  ];

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
    >
      <PageTitle title={t("pol.title")} sub={t("pol.sub")} />
      <div className="two-col">
        <section className="panel form-panel">
          <div className="panel-head"><div><ShieldCheck /><h3>{t("pol.lendingCard")}</h3></div></div>
          {fields.map(([key, label, unit, min, max, step]) => (
            <label className="form-group" key={key}>
              <span>{t(label)}</span>
              <span className="unit-input">
                <input
                  type="number" min={min} max={max} step={step} required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                />
                <i>{t(unit)}</i>
              </span>
            </label>
          ))}
        </section>
        <section className="panel form-panel">
          <div className="panel-head"><div><Settings /><h3>{t("pol.finesCard")}</h3></div></div>
          {fineFields.map(([key, label, unit, min, max, step]) => (
            <label className="form-group" key={key}>
              <span>{t(label)}</span>
              <span className="unit-input">
                <input
                  type="number" min={min} max={max} step={step} required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                />
                <i>{t(unit)}</i>
              </span>
            </label>
          ))}
          <label className="ai-toggle">
            <Sparkles />
            <span><b>{t("pol.aiToggle")}</b><small>{t("pol.aiToggleSub")}</small></span>
            <input
              type="checkbox"
              checked={form.aiEnabled}
              onChange={(e) => setForm({ ...form, aiEnabled: e.target.checked })}
            />
          </label>
        </section>
        <div className="policy-actions">
          <Button onClick={() => { setForm(policies); onReset(); }}><RotateCcw />{t("common.reset")}</Button>
          <Button variant="primary" type="submit"><CheckCircle2 />{t("pol.save")}</Button>
        </div>
      </div>
    </form>
  );
}

function Audit({ t, lang, audit }) {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");

  const actions = ["audit.actIssue", "audit.actReturn", "audit.actSettle", "audit.actPolicies", "audit.actAddBook"];

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return audit.filter((e) => {
      if (action !== "all" && e.action !== action) return false;
      if (!q) return true;
      const actor = (lang === "en" ? e.actorEn : e.actorAr).toLowerCase();
      return `${actor} ${t(e.action).toLowerCase()} ${e.entity.toLowerCase()} ${t("audit.detail").toLowerCase()}`.includes(q);
    });
  }, [audit, search, action, lang, t]);

  return (
    <div>
      <PageTitle title={t("audit.title")} sub={t("audit.sub")} />
      <section className="panel filter-row">
        <label className="input-icon">
          <Search />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("audit.searchPlaceholder")} />
        </label>
        <select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="all">{t("audit.allActions")}</option>
          {actions.map((a) => <option key={a} value={a}>{t(a)}</option>)}
        </select>
      </section>
      <DataTable
        empty={t("audit.empty")}
        columns={[t("audit.colTime"), t("audit.colActor"), t("audit.colRole"), t("audit.colAction"), t("audit.colEntity"), t("audit.colDetails")]}
        rows={rows.map((e) => [
          new Date(e.at).toLocaleString(lang === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          <b key="actor">{lang === "en" ? e.actorEn : e.actorAr}</b>,
          <Badge key="r">{e.role}</Badge>,
          <span key="tag" className="action-tag">{t(e.action)}</span>,
          <code key="id">{e.entity}</code>,
          t("audit.detail"),
        ])}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Member — my loans
   ═══════════════════════════════════════════════════════════ */

function MemberLoans({ t, lang, books, loans, reservations, policies, currentUser, onRenew, onCancelHold, onDetails }) {
  const myLoans = loans.filter((l) => l.status !== "returned").slice(0, 2);
  const myRes = reservations.filter((r) => r.status === "active").slice(0, 2);
  const used = myLoans.length;
  const pct = Math.min(100, Math.round((used / policies.maxLoans) * 100));
  const remaining = Math.max(0, policies.maxLoans - used);
  const name = currentUser?.name || memberName(MEMBERS[0], lang);

  return (
    <main className="public-main member-page">
      <PageTitle title={t("member.title")} sub={t("member.sub")} />

      <section className="profile-card">
        <div className="identity">
          <span>{name.charAt(0)}</span>
          <div>
            <h2>{name}</h2>
            <Badge status="available">{t("status.activeMembership")}</Badge>
            <p><code>{MEMBERS[0].code}</code> · {t("member.memberSince")}</p>
          </div>
        </div>
        <div>
          <span className="metric-label">
            {t("member.borrowLimit")} <b>{t("member.booksOfLimit", { n: used, max: policies.maxLoans })}</b>
          </span>
          <div className="progress lg"><i style={{ width: `${pct}%` }} /></div>
          <small>{remaining > 0 ? t("member.canBorrowMore", { n: remaining }) : t("member.atLimit")}</small>
        </div>
        <div>
          <span className="metric-label">{t("member.finesDue")}</span>
          <strong className="success-text">0.00 {t("common.egp")}</strong>
          <p className="success-text"><CheckCircle2 />{t("member.cleanRecord")}</p>
        </div>
      </section>

      <section className="member-section">
        <div className="section-title">
          <h2><BookOpen />{t("member.activeLoans", { n: myLoans.length })}</h2>
          <p>{t("member.renewNote")}</p>
        </div>
        {myLoans.length ? (
          <div className="loan-grid">
            {myLoans.map((l) => {
              const book = books.find((b) => b.id === l.bookId);
              const daysLeft = Math.ceil((l.due - Date.now()) / DAY);
              const overdue = daysLeft < 0;
              const canRenew = !overdue && l.renewals < policies.maxRenewals;
              return (
                <article className={`loan-card ${overdue ? "due" : ""}`} key={l.id}>
                  <img src={book?.cover || FALLBACK_COVER} alt="" onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }} />
                  <div className="loan-main">
                    <div>
                      <h3>{book ? bookTitle(book, lang) : "—"}</h3>
                      <Badge status={overdue ? "overdue" : "available"}>
                        {overdue ? t("member.overdueBy", { n: Math.abs(daysLeft) }) : t("member.daysLeft", { n: daysLeft })}
                      </Badge>
                    </div>
                    <p>{book ? bookAuthor(book, lang) : ""}</p>
                    <span><code>{l.barcode}</code> · {t("member.renewals", { n: l.renewals, max: policies.maxRenewals })}</span>
                    <div className="date-strip">
                      <span>{t("member.issuedOn")} <b>{formatDate(l.issued, lang)}</b></span>
                      <span>{t("member.dueOn")} <b>{formatDate(l.due, lang)}</b></span>
                    </div>
                    <div className="card-actions">
                      <Button variant="primary" disabled={!canRenew} onClick={() => onRenew(l)}>
                        <RotateCcw />
                        {overdue ? t("member.cannotRenewOverdue")
                          : l.renewals >= policies.maxRenewals ? t("member.maxRenewals")
                          : t("member.renew")}
                      </Button>
                      {book && <Button onClick={() => onDetails(book)}><Star />{t("member.rate")}</Button>}
                      {book && <Button onClick={() => onDetails(book)}>{t("common.details")}</Button>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty"><span><BookOpen /></span><p>{t("member.noLoans")}</p></div>
        )}
      </section>

      <section className="member-section">
        <div className="section-title"><h2><BookmarkCheck />{t("member.activeReservations", { n: myRes.length })}</h2></div>
        {myRes.length ? (
          myRes.map((r) => {
            const book = books.find((b) => b.id === r.bookId);
            return (
              <article className="reservation-card" key={r.id}>
                <div>
                  <h3>{book ? bookTitle(book, lang) : "—"}</h3>
                  <p>{t("member.reservedOn", { date: formatDate(r.placed, lang), expires: formatDate(r.expires, lang) })}</p>
                </div>
                <Badge status="reserved">{t("member.queuePosition", { n: r.position })}</Badge>
                <Button variant="danger" onClick={() => onCancelHold(r)}><X />{t("member.cancelHold")}</Button>
              </article>
            );
          })
        ) : (
          <div className="empty"><span><BookmarkCheck /></span><p>{t("member.noReservations")}</p></div>
        )}
      </section>

      <div className="policy-strip">
        <ShieldCheck />
        <span>{t("member.policyStrip", {
          days: policies.loanDays,
          max: policies.maxLoans,
          renewals: policies.maxRenewals,
          fine: policies.finePerDay,
        })}</span>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════
   Login modal
   ═══════════════════════════════════════════════════════════ */

function LoginModal({ t, lang, onClose, onToast, onLoginSuccess }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const switchTab = (next) => { setTab(next); setError(""); };

  /** Map a backend error onto a translated message. */
  const messageFor = (err) => {
    if (err?.code === "INVALID_CREDENTIALS" || err?.status === 401) return t("login.errInvalid");
    if (err?.code === "EMAIL_ALREADY_EXISTS" || err?.status === 409) return t("login.errEmailExists");
    if (err?.code === "ACCOUNT_INACTIVE" || err?.status === 403) return t("login.errInactive");
    if (err?.status === undefined) return t("login.errOffline");
    return err?.message || t("common.error");
  };

  const finish = (user, token, successKey) => {
    if (token) {
      try { localStorage.setItem("library_token", token); } catch { /* storage unavailable */ }
    }
    onLoginSuccess(user);
    onToast(t(successKey));
    onClose();
    navigate(roleHome(user.role));
  };

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (tab === "signup") {
      if (password.length < 6) { setError(t("login.errShortPassword")); return; }
      if (password !== confirm) { setError(t("login.errMismatch")); return; }
    }

    setLoading(true);
    try {
      if (tab === "login") {
        const res = await api.auth.login({ email: email.trim(), password });
        finish(
          { email: res.user.email, role: res.user.role, name: res.user.fullName, memberCode: res.user.memberCode },
          res.token,
          "login.successSignIn"
        );
      } else {
        const res = await api.auth.register({ fullName: name.trim(), email: email.trim(), password });
        finish(
          { email: res.user.email, role: "member", name: res.user.fullName, memberCode: res.user.memberCode },
          res.token,
          "login.successSignUp"
        );
      }
    } catch (err) {
      setError(messageFor(err));
    } finally {
      setLoading(false);
    }
  }

  /** Demo cards sign in for real, using the seeded credentials. */
  async function loginDemo(account) {
    setError("");
    setLoading(true);
    setEmail(account.email);
    setPassword(account.password);
    try {
      const res = await api.auth.login({ email: account.email, password: account.password });
      finish(
        { email: res.user.email, role: res.user.role, name: res.user.fullName, memberCode: res.user.memberCode },
        res.token,
        "login.successSignIn"
      );
    } catch (err) {
      // Backend unreachable → fall back to a clearly-labelled offline demo session.
      if (err?.status === undefined) {
        const displayName = lang === "en" ? account.nameEn : account.nameAr;
        finish({ email: account.email, role: account.role, name: displayName }, null, "login.successSignIn");
      } else {
        setError(messageFor(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="login-card" onSubmit={submit}>
        <div className="login-head">
          <Logo />
          <Button variant="ghost" className="icon-btn" onClick={onClose} title={t("common.close")}><X /></Button>
        </div>

        <div className="login-tabs">
          <button type="button" className={tab === "login" ? "active" : ""} onClick={() => switchTab("login")}>
            <LogIn />{t("login.tabSignIn")}
          </button>
          <button type="button" className={tab === "signup" ? "active" : ""} onClick={() => switchTab("signup")}>
            <User />{t("login.tabSignUp")}
          </button>
        </div>

        <div className="login-copy">
          <span className="eyebrow">{tab === "login" ? t("login.eyebrowSignIn") : t("login.eyebrowSignUp")}</span>
          <h1>{tab === "login" ? t("login.headingSignIn") : t("login.headingSignUp")}</h1>
          <p>{tab === "login" ? t("login.subSignIn") : t("login.subSignUp")}</p>
        </div>

        {error && (
          <div className="login-error" role="alert">
            <AlertCircle size={17} />
            <span>{error}</span>
          </div>
        )}

        {tab === "signup" && (
          <label className="form-group">
            <span>{t("login.fullName")}</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("login.fullNamePlaceholder")} autoComplete="name" />
          </label>
        )}

        <label className="form-group">
          <span>{t("login.email")}</span>
          <input
            required type="email" dir="ltr" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@library.sa"
            autoComplete="email"
          />
        </label>

        <label className="form-group">
          <span>{t("login.password")}</span>
          <span className="password-field">
            <input
              required type={showPassword ? "text" : "password"} dir="ltr" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" minLength={6}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              title={showPassword ? t("login.hidePassword") : t("login.showPassword")}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </label>

        {tab === "signup" && (
          <label className="form-group">
            <span>{t("login.confirmPassword")}</span>
            <input
              required type="password" dir="ltr" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••" minLength={6} autoComplete="new-password"
            />
          </label>
        )}

        <Button variant="primary" type="submit" className="wide tall" disabled={loading}>
          {tab === "login" ? <LogIn /> : <CheckCircle2 />}
          {loading ? t("common.processing") : tab === "login" ? t("login.submitSignIn") : t("login.submitSignUp")}
        </Button>

        {tab === "login" && (
          <>
            <div className="divider"><span>{t("login.divider")}</span></div>
            <p className="demo-hint"><Lock size={13} />{t("login.demoHint")}</p>
            <div className="demo-grid">
              {DEMO_ACCOUNTS.map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.role} type="button" disabled={loading} onClick={() => loginDemo(a)}>
                    <Icon />
                    <span>
                      <b>{a.role === "member" ? t("login.roleMember") : a.role === "librarian" ? t("login.roleLibrarian") : t("login.roleAdmin")}</b>
                      <small>{lang === "en" ? a.nameEn : a.nameAr}</small>
                      <code dir="ltr">{a.email}</code>
                      <code dir="ltr">{a.password}</code>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Book details modal
   ═══════════════════════════════════════════════════════════ */

function BookModal({ t, lang, book, onClose, onReserve, onRate, onCopyStatus, isStaff }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [copyStatus, setCopyStatus] = useState(() =>
    Array.from({ length: book.total || 1 }, (_, i) => (i < book.available ? "available" : "borrowed"))
  );

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const statusLabels = {
    available: t("status.available"),
    borrowed: t("status.borrowed"),
    reserved: t("status.reserved"),
    maintenance: t("status.maintenance"),
  };

  const changeCopy = (index, value) => {
    setCopyStatus((prev) => prev.map((s, i) => (i === index ? value : s)));
    onCopyStatus(barcodeFor(book, index), statusLabels[value]);
  };

  const submitRating = () => {
    if (!rating) return;
    onRate(book, rating, review);
    setReview("");
  };

  const shown = hover || rating;

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="book-modal">
        <div className="modal-head">
          <div><BookOpen /><h2>{t("modal.title")}</h2></div>
          <Button variant="ghost" className="icon-btn" onClick={onClose} title={t("common.close")}><X /></Button>
        </div>

        <div className="modal-body">
          <div className="metadata">
            <img src={book.cover} alt={bookTitle(book, lang)} onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }} />
            <div>
              <div className="badge-row">
                <Badge>{bookCategory(book, lang)}</Badge>
                <Badge status="reserved">
                  <Star fill="currentColor" />{book.rating} · {t("book.reviewsCount", { n: book.reviews })}
                </Badge>
                <Badge status={book.available > 0 ? "available" : "borrowed"}>
                  {book.available} {t("common.of")} {book.total} {t("status.available")}
                </Badge>
              </div>
              <h1>{bookTitle(book, lang)}</h1>
              <p className="author">{t("common.by")} {bookAuthor(book, lang)}</p>
              <p>{bookDesc(book, lang)}</p>
              <div className="biblio">
                <span><Calendar />{t("modal.pubYear")} <b>{book.year}</b></span>
                <span><Globe />{t("modal.language")} <b>{bookLang(book, lang)}</b></span>
                <span><Hash />ISBN <code>{book.isbn}</code></span>
                <span><MapPin />{t("modal.location")} <b>{bookShelf(book, lang)}</b></span>
              </div>
            </div>
          </div>

          <div className="section-title">
            <h2><BookMarked />{t("modal.physicalCopies", { n: book.total })}</h2>
            <p>{bookShelf(book, lang)}</p>
          </div>
          <DataTable
            empty={t("common.noResults")}
            columns={[t("modal.colBarcode"), t("modal.colShelf"), t("modal.colStatus"), ...(isStaff ? [t("modal.colStaffAction")] : [])]}
            rows={copyStatus.map((status, i) => [
              <code key="bc">{barcodeFor(book, i)}</code>,
              <span key="sh" className="with-icon"><MapPin />{bookShelf(book, lang)}</span>,
              <Badge key="st" status={status === "maintenance" ? "neutral" : status}>{statusLabels[status]}</Badge>,
              ...(isStaff
                ? [
                    <select key="act" value={status} onChange={(e) => changeCopy(i, e.target.value)}>
                      <option value="available">{t("status.available")}</option>
                      <option value="borrowed">{t("status.borrowed")}</option>
                      <option value="reserved">{t("status.reserved")}</option>
                      <option value="maintenance">{t("status.maintenance")}</option>
                    </select>,
                  ]
                : []),
            ])}
          />

          <div className="reviews">
            <div>
              <strong>{book.rating}</strong>
              <span className="stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} fill={i <= Math.round(book.rating) ? "currentColor" : "none"} />
                ))}
              </span>
              <small>{t("book.reviewsCount", { n: book.reviews })}</small>
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
              <b>{t("modal.rateThis")}</b>
              <div className="stars interactive">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${i} / 5`}
                  >
                    <Star fill={i <= shown ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <textarea
                placeholder={t("modal.reviewPlaceholder")}
                maxLength={500}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <Button variant="primary" disabled={!rating} onClick={submitRating}>
                <Send size={15} />{t("modal.submitReview")}
              </Button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <span><CheckCircle2 />{t("modal.rulesNotice")}</span>
          <div>
            <Button onClick={onClose}>{t("common.close")}</Button>
            <Button
              variant={book.available > 0 ? "primary" : "ai"}
              onClick={() => { onReserve(book); onClose(); }}
            >
              <BookmarkCheck />{book.available > 0 ? t("modal.hold") : t("modal.joinWaitlist")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   AI drawer
   ═══════════════════════════════════════════════════════════ */

function AIDrawer({ t, lang, onClose, prompt, onDetails, books }) {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const sentPrompt = useRef(false);

  const send = useCallback(async (textToSend) => {
    const q = (textToSend ?? "").trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    setValue("");
    setLoading(true);
    try {
      const res = await api.ai.ask({ prompt: q, locale: lang });
      if (!res?.answer) throw new Error("empty");
      setMessages((prev) => [...prev, {
        sender: "assistant",
        text: res.answer,
        matchedBooks: (res.matched_books?.length ? res.matched_books : books.slice(0, 2)),
      }]);
    } catch {
      const lower = q.toLowerCase();
      let matched = books.filter((b) =>
        `${b.title} ${b.titleEn} ${b.category} ${b.categoryEn} ${b.author} ${b.authorEn}`
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word && lower.includes(word))
      );
      if (!matched.length) matched = books.slice(0, 2);
      setMessages((prev) => [...prev, {
        sender: "assistant",
        text: t("ai.fallback"),
        matchedBooks: matched.slice(0, 2),
      }]);
    } finally {
      setLoading(false);
    }
  }, [books, lang, loading, t]);

  // Fire the seeded prompt exactly once
  useEffect(() => {
    if (prompt && !sentPrompt.current) {
      sentPrompt.current = true;
      send(prompt);
    }
  }, [prompt, send]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const suggestions = [t("ai.suggestion1"), t("ai.suggestion2"), t("ai.suggestion3"), t("ai.suggestion4")];

  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="ai-drawer">
        <div className="drawer-head">
          <span className="ai-orb"><Sparkles /></span>
          <div>
            <span className="eyebrow">{t("ai.eyebrow")}</span>
            <h2>{t("ai.title")}</h2>
            <p>{t("ai.sub")}</p>
          </div>
          <Button variant="ghost" className="icon-btn" onClick={onClose} title={t("common.close")}><X /></Button>
        </div>

        <div className="disclaimer"><ShieldCheck />{t("ai.disclaimer")}</div>

        <div className="messages">
          <div className="assistant-msg">
            <span><Bot />{t("ai.recommendation")}</span>
            <p>{t("ai.welcome")}</p>
          </div>

          {!messages.length && (
            <div className="suggestions">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)}>⚡ {s}</button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="conversation">
              {m.sender === "user" ? (
                <div className="user-msg">{m.text}</div>
              ) : (
                <div className="assistant-msg">
                  <span><Bot />{t("ai.librarian")}</span>
                  <p>{m.text}</p>
                  {m.matchedBooks?.map((b) => (
                    <article key={b.isbn || b.id} className="ai-result">
                      <img src={b.cover || FALLBACK_COVER} alt="" onError={(e) => { e.currentTarget.src = FALLBACK_COVER; }} />
                      <div>
                        <b>{bookTitle(b, lang)}</b>
                        <small>{bookAuthor(b, lang)}</small>
                        <Badge status={b.available > 0 ? "available" : "reserved"}>
                          {b.available > 0 ? t("ai.copiesAvailable", { n: b.available }) : t("status.waitlist")}
                        </Badge>
                      </div>
                      <Button onClick={() => onDetails(b)}>{t("ai.view")}</Button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="assistant-msg"><span><Sparkles />{t("ai.thinking")}</span></div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="drawer-input">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(value); } }}
            placeholder={t("ai.inputPlaceholder")}
          />
          <Button variant="ai" className="icon-btn" onClick={() => send(value)} disabled={!value.trim() || loading} title={t("ai.send")}>
            <Send />
          </Button>
        </div>
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Toast + access guard
   ═══════════════════════════════════════════════════════════ */

function Toast({ message, onClose, t }) {
  useEffect(() => {
    const id = setTimeout(onClose, 4200);
    return () => clearTimeout(id);
  }, [onClose, message]);

  return (
    <div className="toast" role="status">
      <CheckCircle2 />
      <div><b>{t("common.success")}</b><p>{message}</p></div>
      <button onClick={onClose} title={t("common.close")}><X /></button>
    </div>
  );
}

function AccessDenied({ t }) {
  return (
    <main className="public-main">
      <div className="empty">
        <span><Shield /></span>
        <h2>{t("guard.title")}</h2>
        <p>{t("guard.desc")}</p>
        <div>
          <Button variant="primary" onClick={() => navigate("/login")}><LogIn size={16} />{t("guard.signIn")}</Button>
          <Button onClick={() => navigate("/")}>{t("guard.backHome")}</Button>
        </div>
      </div>
    </main>
  );
}

function DashboardShell({ children, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dashboard-shell">
      <Sidebar {...props} open={open} setOpen={setOpen} />
      <div className="dash-main">
        <Topbar t={props.t} lang={props.lang} admin={props.admin} onMenu={() => setOpen(true)} onSearch={props.onSearch} />
        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   App
   ═══════════════════════════════════════════════════════════ */

export default function App() {
  const path = useRouter();

  const [lang, setLang] = useState(() => localStorage.getItem("library_lang") || "ar");
  const [dark, setDark] = useState(() => localStorage.getItem("library_theme") === "dark");
  const t = useMemo(() => makeT(lang), [lang]);

  const [books, setBooks] = useState(OFFLINE_BOOKS);
  const [loans, setLoans] = useState(() => buildLoans(OFFLINE_BOOKS));
  const [reservations, setReservations] = useState(() => buildReservations(OFFLINE_BOOKS));
  const [fines, setFines] = useState(() => buildFines(OFFLINE_BOOKS));
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [audit, setAudit] = useState(INITIAL_AUDIT);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [catalogQuery, setCatalogQuery] = useState("");

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("library_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  /* ── Persisted preferences ── */
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("library_lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("library_theme", dark ? "dark" : "light");
  }, [dark]);

  /* ── Load the live catalog, merged with bilingual seed records ── */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await api.books.list({ limit: 100 });
        if (!active || !Array.isArray(data) || data.length === 0) return;
        const merged = data.map((remote, i) =>
          toBook(remote, seedBooks.find((s) => s.isbn === remote.isbn), i)
        );
        setBooks(merged);
        setLoans(buildLoans(merged));
        setReservations(buildReservations(merged));
        setFines(buildFines(merged));
      } catch {
        /* Backend offline — the bilingual seed catalog stays on screen. */
      }
    })();
    return () => { active = false; };
  }, []);

  /* ── Helpers ── */
  const logAudit = useCallback((action, entity) => {
    setAudit((prev) => [
      {
        id: Date.now(),
        at: Date.now(),
        actorAr: currentUser?.name || "سليمان العبدلي",
        actorEn: currentUser?.name || "Sulaiman Al-Abdali",
        role: currentUser?.role || "librarian",
        action,
        entity,
      },
      ...prev,
    ]);
  }, [currentUser]);

  const openAI = useCallback((p = "") => { setAiPrompt(p); setAiOpen(true); }, []);

  const requireAuth = useCallback(() => {
    if (currentUser) return true;
    navigate("/login");
    return false;
  }, [currentUser]);

  /* ── Circulation actions ── */
  const issueLoan = useCallback((barcode, memberCode) => {
    const book = books.find((b) => Array.from({ length: b.total }, (_, i) => barcodeFor(b, i)).includes(barcode.toUpperCase()))
      || books.find((b) => b.available > 0);
    if (!book) { setToast(t("common.noResults")); return; }

    setBooks((prev) => prev.map((b) => (b.id === book.id && b.available > 0 ? { ...b, available: b.available - 1 } : b)));
    setLoans((prev) => [
      {
        id: `L-${Date.now()}`,
        bookId: book.id,
        barcode: barcode.toUpperCase(),
        memberCode: memberCode || MEMBERS[0].code,
        issued: Date.now(),
        due: Date.now() + policies.loanDays * DAY,
        renewals: 0,
        status: "borrowed",
      },
      ...prev,
    ]);
    logAudit("audit.actIssue", `Loan ${barcode.toUpperCase()}`);
    setToast(t("dash.issuedToast", { code: barcode.toUpperCase() }));
  }, [books, policies.loanDays, t, logAudit]);

  const returnLoan = useCallback((barcode) => {
    const code = barcode.toUpperCase();
    const loan = loans.find((l) => l.barcode.toUpperCase() === code && l.status !== "returned");
    if (!loan) { setToast(t("common.noResults")); return; }

    const lateDays = loan.due < Date.now() ? Math.max(1, Math.ceil((Date.now() - loan.due) / DAY)) : 0;
    setLoans((prev) => prev.filter((l) => l.id !== loan.id));
    setBooks((prev) => prev.map((b) => (b.id === loan.bookId ? { ...b, available: Math.min(b.total, b.available + 1) } : b)));

    if (lateDays > 0) {
      setFines((prev) => [
        {
          id: `F-${Date.now()}`,
          bookId: loan.bookId,
          memberCode: loan.memberCode,
          amount: lateDays * policies.finePerDay,
          assessed: Date.now(),
          status: "unpaid",
        },
        ...prev,
      ]);
    }
    logAudit("audit.actReturn", `Loan ${code}`);
    setToast(lateDays > 0 ? t("ovd.returnedToast") : t("dash.returnedToast", { code }));
  }, [loans, policies.finePerDay, t, logAudit]);

  const renewLoan = useCallback((loan) => {
    setLoans((prev) => prev.map((l) =>
      l.id === loan.id ? { ...l, renewals: l.renewals + 1, due: l.due + policies.loanDays * DAY } : l
    ));
    logAudit("audit.actIssue", `Loan ${loan.barcode}`);
    setToast(t("member.renewed", { days: policies.loanDays }));
  }, [policies.loanDays, t, logAudit]);

  const reserveBook = useCallback((book) => {
    if (!requireAuth()) return;
    const existing = reservations.filter((r) => r.bookId === book.id && r.status === "active").length;
    setReservations((prev) => [
      {
        id: `R-${Date.now()}`,
        bookId: book.id,
        memberCode: currentUser?.memberCode || MEMBERS[0].code,
        position: existing + 1,
        placed: Date.now(),
        expires: Date.now() + policies.holdHours * 3600000,
        status: "active",
        notified: false,
      },
      ...prev,
    ]);
    setToast(book.available > 0 ? t("modal.heldToast") : t("modal.queuedToast"));
  }, [requireAuth, reservations, currentUser, policies.holdHours, t]);

  const notifyReservation = useCallback((res) => {
    setReservations((prev) => prev.map((r) => (r.id === res.id ? { ...r, notified: true } : r)));
    setToast(t("res.notifiedToast"));
  }, [t]);

  const cancelReservation = useCallback((res) => {
    setReservations((prev) =>
      prev
        .filter((r) => r.id !== res.id)
        .map((r) => (r.bookId === res.bookId && r.position > res.position ? { ...r, position: r.position - 1 } : r))
    );
    setToast(t("res.cancelledToast"));
  }, [t]);

  const settleFine = useCallback((fine) => {
    setFines((prev) => prev.map((f) => (f.id === fine.id ? { ...f, status: "paid" } : f)));
    logAudit("audit.actSettle", `Fine ${fine.id}`);
    setToast(t("ovd.settledToast"));
  }, [t, logAudit]);

  const addBook = useCallback((form) => {
    const copies = Math.max(1, Number(form.copies) || 1);
    const newBook = {
      id: Math.max(0, ...books.map((b) => b.id)) + 1,
      isbn: form.isbn.trim(),
      title: form.title.trim(),
      titleEn: form.title.trim(),
      author: form.author.trim(),
      authorEn: form.author.trim(),
      category: form.category,
      categoryEn: categoryEn[form.category] || form.category,
      description: form.description.trim(),
      descriptionEn: form.description.trim(),
      shelf: form.shelf,
      shelfEn: shelfEn(form.shelf),
      language: "العربية",
      languageEn: "Arabic",
      rating: 0,
      reviews: 0,
      available: copies,
      total: copies,
      year: String(form.year),
      cover: FALLBACK_COVER,
    };
    setBooks((prev) => [newBook, ...prev]);
    logAudit("audit.actAddBook", `Book #${newBook.id}`);
    setToast(t("cat.addedToast", { title: newBook.title, n: copies }));
  }, [books, t, logAudit]);

  const addStaff = useCallback((form) => {
    setStaff((prev) => [
      ...prev,
      {
        id: Date.now(),
        nameAr: form.name.trim(),
        nameEn: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        lastLogin: Date.now(),
        status: "active",
      },
    ]);
    logAudit("audit.actAddBook", `Staff #${staff.length + 1}`);
    setToast(t("staff.addedToast", { name: form.name.trim() }));
  }, [staff.length, t, logAudit]);

  const savePolicies = useCallback((next) => {
    setPolicies(next);
    logAudit("audit.actPolicies", "Policy #1");
    setToast(t("pol.savedToast"));
  }, [t, logAudit]);

  const rateBook = useCallback(async (book, rating, review) => {
    setBooks((prev) => prev.map((b) => {
      if (b.id !== book.id) return b;
      const count = b.reviews + 1;
      const avg = (b.rating * b.reviews + rating) / count;
      return { ...b, reviews: count, rating: Math.round(avg * 100) / 100 };
    }));
    setToast(t("modal.ratedToast", { n: rating }));
    try { await api.books.rate(book.id, { rating, review }); } catch { /* recorded locally */ }
  }, [t]);

  const handleLogin = useCallback((user) => {
    setCurrentUser(user);
    try { localStorage.setItem("library_current_user", JSON.stringify(user)); } catch { /* ignore */ }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("library_current_user");
      localStorage.removeItem("library_token");
    } catch { /* ignore */ }
    api.auth.logout().catch(() => {});
    setToast(t("login.successSignOut"));
    navigate("/");
  }, [t]);

  /* ── Route rendering ── */
  const isDashboard = path.startsWith("/librarian") || path.startsWith("/admin");
  const isAdminRoute = path.startsWith("/admin");
  const isStaff = currentUser?.role === "librarian" || currentUser?.role === "admin";
  const canSeeRoute = isAdminRoute ? currentUser?.role === "admin" : isStaff;

  const activeLoanCount = loans.filter((l) => l.status !== "returned").length;
  const sidebarCounts = {
    reservations: reservations.filter((r) => r.status === "active").length,
    overdues: loans.filter((l) => l.status === "overdue").length,
  };

  const dashboardPage = () => {
    switch (path) {
      case "/librarian":
        return <Dashboard t={t} lang={lang} books={books} loans={loans} reservations={reservations} fines={fines} audit={audit} onIssue={issueLoan} onReturn={returnLoan} />;
      case "/librarian/circulation":
        return <Circulation t={t} lang={lang} books={books} loans={loans} policies={policies} onIssue={issueLoan} onReturn={returnLoan} />;
      case "/librarian/catalog":
        return <CatalogAdmin t={t} lang={lang} books={books} onDetails={setSelected} onAddBook={addBook} />;
      case "/librarian/reservations":
        return <Reservations t={t} lang={lang} books={books} reservations={reservations} onNotify={notifyReservation} onCancel={cancelReservation} />;
      case "/librarian/overdues":
        return <Overdues t={t} lang={lang} books={books} loans={loans} fines={fines} policies={policies} onReturn={returnLoan} onSettle={settleFine} />;
      case "/admin":
        return <Staff t={t} lang={lang} staff={staff} onAddStaff={addStaff} />;
      case "/admin/policies":
        return <Policies t={t} policies={policies} onSave={savePolicies} onReset={() => setToast(t("pol.resetToast"))} />;
      case "/admin/audit":
        return <Audit t={t} lang={lang} audit={audit} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {isDashboard ? (
        canSeeRoute ? (
          <DashboardShell
            t={t}
            lang={lang}
            setLang={setLang}
            dark={dark}
            setDark={setDark}
            path={path}
            admin={isAdminRoute}
            currentUser={currentUser}
            counts={sidebarCounts}
            onAI={() => openAI()}
            onLogout={handleLogout}
            onBell={() => setToast(t("topbar.notif1Text"))}
            onSearch={(q) => { setCatalogQuery(q); navigate("/"); }}
          >
            {dashboardPage()}
          </DashboardShell>
        ) : (
          <>
            <PublicNav
              t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
              path={path} onAI={() => openAI()} currentUser={currentUser}
              onLogout={handleLogout} loanCount={activeLoanCount}
            />
            <AccessDenied t={t} />
            <Footer t={t} onAI={openAI} />
          </>
        )
      ) : (
        <>
          <PublicNav
            t={t} lang={lang} setLang={setLang} dark={dark} setDark={setDark}
            path={path} onAI={() => openAI()} currentUser={currentUser}
            onLogout={handleLogout} loanCount={activeLoanCount}
          />
          {path === "/my-loans" ? (
            currentUser ? (
              <MemberLoans
                t={t} lang={lang} books={books} loans={loans} reservations={reservations}
                policies={policies} currentUser={currentUser}
                onRenew={renewLoan} onCancelHold={cancelReservation} onDetails={setSelected}
              />
            ) : (
              <AccessDenied t={t} />
            )
          ) : (
            <Catalog
              books={books} lang={lang} t={t} onAI={openAI}
              onDetails={setSelected} onReserve={reserveBook}
              initialQuery={catalogQuery}
            />
          )}
          {path === "/my-loans" && <Footer t={t} onAI={openAI} />}
          {path === "/login" && (
            <LoginModal
              t={t} lang={lang}
              onClose={() => navigate("/")}
              onToast={setToast}
              onLoginSuccess={handleLogin}
            />
          )}
        </>
      )}

      {selected && (
        <BookModal
          t={t} lang={lang} book={selected} isStaff={isStaff}
          onClose={() => setSelected(null)}
          onReserve={reserveBook}
          onRate={rateBook}
          onCopyStatus={(code, status) => setToast(t("modal.copyStatusToast", { code, status }))}
        />
      )}

      {aiOpen && (
        <AIDrawer
          t={t} lang={lang} prompt={aiPrompt} books={books}
          onClose={() => { setAiOpen(false); setAiPrompt(""); }}
          onDetails={(b) => { setAiOpen(false); setAiPrompt(""); setSelected(b); }}
        />
      )}

      {toast && <Toast t={t} message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
