# Figma Redesign Brief — Smart Library LMS 2026

> **Paste everything below this line into Figma Make / Figma AI (or hand it to a designer).**
> It is a complete, self-contained specification of the existing system: every page, every
> component, every state, every flow. The redesign must change **visual form only** — never
> the colors, never the functionality, never the information architecture.

---

## 0. THE ONE RULE

You are redesigning the **visual layer** of an existing, working, production React application.

**LOCKED — you may not change these:**
1. **Colors.** Every hex value in §2 is frozen. You may change *where* a color is applied
   (e.g. a border becomes a background tint) but you may not introduce a new hue, change a
   hex value, or re-map a semantic token to a different meaning.
2. **Functionality.** Every button, input, filter, table column, tab, modal, toast, badge and
   data field listed in §5–§8 must exist in the redesign, do the same thing, and live on the
   same page/route. Nothing may be removed, merged away, or moved to another page.
3. **Routes & navigation structure.** The route list in §4 is fixed.
4. **Content & copy.** Keep all existing labels (both Arabic and English). You may restyle
   text, not rewrite it.
5. **Bilingual + bidirectional support.** Arabic (RTL) is the default language; English (LTR)
   is the second. Both must work. Both themes (light + dark) must work.

**FREE — this is what you are actually redesigning:**
Layout, spacing rhythm, grid, hierarchy, typographic scale, component shape and construction,
corner radii, elevation and shadows, borders vs. fills, iconography treatment, density,
alignment, card anatomy, table styling, empty-state illustration, micro-interaction polish,
responsive behavior, and overall craft/modernity.

**Target aesthetic:** an institutional-grade, calm, high-trust library/enterprise product.
Think "modern academic SaaS": generous whitespace, crisp hierarchy, restrained elevation,
confident typography, dense-but-legible data tables. Not playful, not neobrutalist, not glassy.

---

## 1. WHAT THE SYSTEM IS

**Smart Library Management System (نظام إدارة المكتبة الذكي) — "Smart Library / المكتبة الذكية", badge "LMS 2026".**

A bilingual (Arabic-first, RTL) library management platform with **three role portals** sharing
one design system, plus two global overlays (a Book Details modal and an AI Librarian drawer).

### The three roles

| Role | Arabic | Entry route | Shell |
|---|---|---|---|
| **Member / visitor** | عضو / مستفيد | `/` | Public site: fixed top navbar + content + rich footer |
| **Librarian** | أمين المكتبة | `/librarian` | Dashboard app: dark floating sidebar + topbar + content |
| **System Admin** | مدير النظام | `/admin` | Same dashboard shell, different nav items |

### Core domain concepts (keep these distinctions visible in the design)

- **Book (title)** — the bibliographic record: title, author, ISBN, publisher, publication year,
  language, category, description, cover image, reader rating.
- **Book copy (physical item)** — each printed copy is a **separate** entity with its own
  **barcode** (`BC-101-01`), its own **shelf location** (`جناح التاريخ - رف H-04` / "History Wing - Shelf H-04"),
  and its own **status** (available / borrowed / reserved / maintenance).
  *This title↔copy separation is the backbone of the product — the design must always make it
  obvious that a title has N copies, each individually tracked.*
- **Member** — membership code `MEM-2026-0042`, membership status (active/blocked), active loan
  count, fines due (in **EGP / ج.م**), join date.
- **Loan** — a copy issued to a member: issue date, due date, renew count, status
  (borrowed / due_soon / overdue / returned).
- **Reservation (hold)** — a queue on a title, with a **queue position** (#1, #2 …) and a
  pickup expiry window.
- **Fine** — a money row: member, related book, amount in EGP, reason, assessed date,
  status (paid / unpaid).
- **Audit log** — immutable record of every sensitive staff action: timestamp, actor, actor role,
  action, entity type + id, details.
- **Policies** — admin-configurable: max concurrent loans, loan duration in days, max renewals,
  daily overdue fine, hold pickup window in hours, AI assistant on/off.
  *Current defaults: 3 books, 14 days, 2 renewals, 5.00 EGP/day, 48 hours, AI enabled.*

---

## 2. COLOR SYSTEM — FROZEN, COPY EXACTLY

Build these as **Figma variables** in two modes: `Light` and `Dark`. Do not invent values.

### 2.1 Brand & AI accent

| Variable | Light | Dark |
|---|---|---|
| `color/primary` | `#1E3A5F` | `#3B82F6` |
| `color/primary-hover` | `#0F2744` | `#2563EB` |
| `color/primary-subtle` | `#EDF4FA` | `rgba(59,130,246,0.15)` |
| `color/ai-accent` | `#1D4ED8` | `#60A5FA` |
| `color/ai-hover` | `#1E40AF` | `#93C5FD` |
| `color/ai-surface` | `#EFF6FF` | `rgba(30,58,138,0.28)` |
| `color/ai-border` | `#BFDBFE` | `rgba(96,165,250,0.35)` |

### 2.2 Surfaces & text

| Variable | Light | Dark |
|---|---|---|
| `bg/page` | `#FCFCFA` | `#0F172A` |
| `bg/surface` | `#FFFFFF` | `#1E293B` |
| `bg/surface-elevated` | `#FFFFFF` | `#26334D` |
| `bg/muted` | `#F8FAFC` | `#182234` |
| `text/primary` | `#1F2937` | `#F8FAFC` |
| `text/secondary` | `#64748B` | `#94A3B8` |
| `text/muted` | `#94A3B8` | `#64748B` |
| `border/subtle` | `#E2E8F0` | `#334155` |
| `border/hover` | `#CBD5E1` | `#475569` |

### 2.3 Circulation status tokens (text / background / border)

| Status | Light text | Light bg | Light border | Dark text | Dark bg | Dark border |
|---|---|---|---|---|---|---|
| **available** (متاح) | `#0284C7` | `#E0F2FE` | `#BAE6FD` | `#38BDF8` | `rgba(2,132,199,0.22)` | `rgba(56,189,248,0.35)` |
| **borrowed** (مُعار) | `#1E40AF` | `#DBEAFE` | `#93C5FD` | `#60A5FA` | `rgba(30,64,175,0.25)` | `rgba(96,165,250,0.35)` |
| **reserved / due_soon** (محجوز / قريب الاستحقاق) | `#4338CA` | `#EEF2FF` | `#C7D2FE` | `#818CF8` | `rgba(79,70,229,0.22)` | `rgba(129,140,248,0.35)` |
| **overdue / unpaid** (متأخر / غير مسدد) | `#B91C1C` | `#FEE2E2` | `#FCA5A5` | `#F87171` | `rgba(185,28,28,0.25)` | `rgba(248,113,113,0.35)` |

Also mapped: `active` and `paid` reuse **available**; `blocked` reuses **overdue**;
`maintenance` uses the neutral badge (`bg/muted` + `text/secondary` + `border/subtle`).

### 2.4 Sidebar (always dark, even in light mode)

| Variable | Light mode | Dark mode |
|---|---|---|
| `sidebar/bg` | `#152033` | `#0D1525` |
| `sidebar/text` | `#F1F5F9` | `#E2E8F0` |
| `sidebar/text-dim` | `#94A3B8` | `#94A3B8` |
| `sidebar/text-muted` | `#64748B` | `#475569` |
| `sidebar/border` | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.06)` |
| `sidebar/item-hover` | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.05)` |
| `sidebar/item-active` | `rgba(30,58,95,0.7)` | `rgba(59,130,246,0.25)` |
| `sidebar/accent-bg` | `rgba(37,99,235,0.15)` | `rgba(59,130,246,0.18)` |
| `sidebar/dropdown-bg` | `#1B2940` | `#131E33` |

### 2.5 Fixed literal colors (keep as-is)

- Star / rating amber: `#F59E0B`, filled star on cover `#FBBF24`.
- Primary button gradient: `linear-gradient(135deg, #1E3A5F → #0F2744)`; hover `#152943 → #0A1B30`.
- AI button gradient: `linear-gradient(135deg, #1E40AF → #2563EB)`; hover `#172554 → #1D4ED8`.
- AI banner icon gradient: `linear-gradient(135deg, #1E3A8A → #2563EB)`.
- Modal backdrop `rgba(15,23,42,0.65)` + 4px blur; login overlay `rgba(15,23,42,0.55)` + 8px blur;
  AI drawer backdrop `rgba(15,23,42,0.45)` + 3px blur.
- Book-cover scrim: `linear-gradient(to top, rgba(15,23,42,0.75) 0%, transparent 60%)`.
- Rating pill on cover: `rgba(15,23,42,0.85)`, white text, 1px `rgba(255,255,255,0.18)` border, 6px blur.
- Demo-account accent chips on login: member `#3B82F6`, librarian `#8B5CF6`, admin `#F59E0B`.

### 2.6 Current scale values (you MAY redesign these — document what you change)

- Radii: `4 / 6 / 10 / 14 / 20 / 9999` px. Sidebar & login card currently use `24px`.
- Shadows: 5 steps, xs→xl, soft and low-contrast in light; heavier/darker in dark mode.
- Transitions: fast `150ms`, normal `220ms`, smooth `320ms cubic-bezier(0.16,1,0.3,1)`.

---

## 3. TYPOGRAPHY, ICONS, LAYOUT GRID

### Typography — fonts are locked, scale is yours to refine
- **Arabic / RTL:** `Cairo` (Google Fonts).
- **English / LTR:** `Plus Jakarta Sans` (Google Fonts).
- Root size `15px`, base line-height `1.5`; headings line-height `1.25`, weight `700`.
- Current observed scale (rebuild it properly as text styles, keep it recognizable):
  topbar title `1.35rem/800` · page h1 `1.15rem/700` · section h3 `1.0–1.15rem/800` ·
  card title `0.98rem/800` · KPI value `1.75rem/800` (letter-spacing `-0.5px`) ·
  body `0.88rem` · secondary `0.82–0.85rem` · meta/caption `0.72–0.78rem` ·
  table header `0.82rem/700 uppercase +0.4px` · table cell `0.9rem` ·
  badge `0.78rem/600` · button `0.9rem/600` (sm `0.82rem`, lg `1rem`).
- **Monospace** for every machine identifier: barcodes (`BC-101-01`), member codes
  (`MEM-2026-0042`), ISBNs, audit entity ids. Keep them `dir="ltr"` even in Arabic.

### Icons
Library is **Lucide React** — keep using Lucide so the implementation can map 1:1.
Sizes in use: 12 / 13 / 14 / 15 / 16 / 17 / 18 / 19 / 20 / 22 / 24 / 32 / 36.
Icons actually used (keep these semantics): BookOpen, BookMarked, BookmarkCheck, Sparkles, Bot,
Sun, Moon, Globe, LogIn, LogOut, UserPlus, User, Users, Shield, ShieldCheck, ShieldAlert,
LayoutDashboard, BarChart3, ArrowRightLeft, RotateCcw, Clock, Calendar, CalendarDays,
AlertTriangle, AlertCircle, CheckCircle2, CheckCircle, XCircle, X, Search, Filter, Bell,
Barcode, Hash, MapPin, Building, Layers, Plus, PlusCircle, FileText, Mail, Phone, Star,
MessageSquare, Send, Eye, EyeOff, ChevronDown, ArrowRight, ArrowUp, ArrowUpRight, Settings,
Wrench, HelpCircle, ExternalLink, Menu, Info, Heart.

### Layout & breakpoints
- Public site: fixed navbar, container `max-width 1400px`, min navbar height `64px`,
  padding `10px 24px`; content `padding: 24px` with `padding-top: 64px + 24px`.
- Dashboard: sidebar `260px` wide, floating (`height: calc(100vh - 28px)`, radius `24px`,
  inset with margin), topbar `padding 16px 28px`, content `padding 24px 28px`,
  inner page `max-width 1360px`.
- Breakpoints currently honored: **1200** (KPI grid 4→2, dashboard grid 3→2 cols),
  **1024** (sidebar 260→220, search min-width shrinks), **768** (sidebar becomes an
  off-canvas drawer + hamburger; grids collapse to 1 col; public nav collapses into the
  mobile panel), **600** (KPI grid → 1 col), **480** (tighter paddings, login card radius 18px).
- Page content gaps: `20–22px` between major blocks; cards `16–24px` internal padding.

### RTL requirements
Everything must mirror. Specifically: sidebar flips side, AI drawer slides in from the
**left** in RTL and from the **right** in LTR, toasts anchor bottom-right in RTL /
bottom-left in LTR, input icons swap sides, loan-card accent stripe moves from
`border-left` to `border-right`, chat bubble tail corner flips, back-to-top and chevrons flip.

---

## 4. ROUTE MAP (FIXED)

```
/                        Public catalog (home)            — PublicLayout
/login                   Login + Sign-up MODAL rendered OVER a blurred /  — PublicLayout
/my-loans                Member dashboard (auth required)  — PublicLayout
/librarian               Librarian dashboard               — LibrarianLayout
/librarian/circulation   Circulation desk
/librarian/catalog       Catalog & copies management
/librarian/reservations  Reservations & hold queues
/librarian/overdues      Overdues & fines ledger
/admin                   Staff management                  — AdminLayout
/admin/policies          Lending rules & system policies
/admin/audit             Audit log
*                        redirect → /
```
Guard behavior to reflect in flow diagrams: unauthenticated → `/login` (remembering intended
destination); wrong role → bounced to that role's own home.

---

## 5. SHELLS & CHROME

### 5.1 Public navbar (fixed, blurred, 64px min)
Left→right (mirrored in RTL):
- **Logo block:** rounded icon tile with `BookOpen`, then two stacked lines —
  "المكتبة الذكية / Smart Library" + small badge pill `LMS 2026`.
- **Center nav:** `فهرس الكتب / Book Catalog` (BookOpen) · `إعاراتي وحجوزاتي / My Loans & Reservations`
  (Clock, with a **count badge** = active loans + active reservations, members only) ·
  `المساعد الذكي / AI Assistant` (Sparkles — this is a *button*, opens the drawer, styled as the AI accent).
- **Right tools:** theme toggle (Moon/Sun) · language toggle (Globe + "EN"/"ع") ·
  then **either** a primary `تسجيل الدخول / Sign In` button **or** the signed-in user area:
  role jump-link button (`لوحة أمين المكتبة / Librarian Dashboard` with LayoutDashboard,
  or `لوحة الإدارة / Admin Dashboard` with Shield) + a user chip (circular avatar with the
  initial letter, name, logout icon button).
- **Hamburger** (Menu/X) below 768px.
- **Mobile panel (open state — design it):** stacked nav links as filled rows, the AI link in
  AI-accent styling, then an auth section: full-width Sign In button, or a user card with
  avatar + name + role label + logout + dashboard button.

### 5.2 Public footer (3 bands)
1. **Highlights band** — 3 items, each an icon tile + bold line + sub line:
   AI-powered semantic discovery · Real-time catalog & barcode tracking · Fair lending & queue policies.
2. **Main band** — 4 columns:
   - *Brand*: logo + `LMS 2026` badge + paragraph + a live "status pill" with a pulsing dot
     ("النظام متصل • الفهرس محدّث / System Online • Catalog Live").
   - *Catalog & Discovery*: Browse All Titles (link) + 3 AI-prompt buttons (AI & Tech References,
     Literature & History, Mystery & Fiction) that open the drawer pre-filled.
   - *Member Services*: My Loans & Reservations · Lending & Renewal Rules (AI prompt) ·
     AI Assistant Drawer · Member & Staff Sign In.
   - *Hours & Contact*: Sun–Thu 8:00 AM–9:00 PM · Fri–Sat 2:00 PM–9:00 PM ·
     Location "Knowledge Hall, Main Circulation Desk" · `info@smartlibrary.sa` (Clock/MapPin/Mail icons).
3. **Bottom band** — © 2026 copyright · Privacy Policy • Terms of Service • Accessibility ·
   a "Top / للأعلى" back-to-top button with ArrowUp.

### 5.3 Dashboard sidebar (librarian + admin, always dark, floating 260px)
Top→bottom: logo block (icon tile + title + `LMS 2026` version line) → **user card**
(square-ish avatar with initial, name, role label) → nav section with a tiny uppercase
label "القائمة الرئيسية / Main Menu" → nav items → "الأدوات / Tools" section with the
**AI Assistant** button (AI-accent treatment) → flexible spacer → bottom block:
`الموقع العام / Public Site` link (ExternalLink) and a row of 4 small square icon buttons
(theme, language, help, logout — logout in the overdue/danger color).

- **Librarian nav:** Dashboard (BarChart3) · Circulation Desk (ArrowRightLeft) ·
  Catalog Management (BookMarked) · Reservations (Clock, **info count badge**) ·
  Overdues & Fines (AlertTriangle, **danger count badge**).
- **Admin nav:** Staff Management (Users) · Policies (Settings) · Audit Log (FileText).
- States needed: default / hover / **active** (filled pill) / with badge / collapsed-mobile drawer.

### 5.4 Dashboard topbar
- Left: page/app title (`المكتبة الذكية / Smart Library` for librarian, `لوحة الإدارة / Admin Dashboard`
  for admin) + a date line (Calendar icon + long localized date).
- Right: **pill search field** (Search icon, placeholder "ابحث عن كتاب، عضو، أو رقم ISBN… /
  Search books, members, or ISBN…", clear X when filled, a Filter icon button inside; admin
  placeholder is "ابحث في السجلات… / Search records…"), min-width 280 / max 420 ·
  `الموقع العام / Public Site` secondary button · **notification bell** with an unread count dot.
- **Notifications dropdown (open state — design it):** 360px panel, header ("الإشعارات /
  Notifications" + an AI-styled "N new" badge), then a list of items: a small colored dot
  (warning / info / success), bold title, time ago on the opposite side, body text; unread rows
  get a tinted background. Sample content: upcoming due date · reservation hold notice ·
  catalog updated (librarian); monthly performance report · new staff permissions (admin).

---

## 6. GLOBAL OVERLAYS (shared by all three portals)

### 6.1 Book Details Modal (max-width 780px, scrollable, radius xl)
- **Header:** BookOpen icon + "تفاصيل العنوان والنسخ" title + close icon button.
- **Metadata block:** cover image (~170px column) + right column: a badge row
  (category neutral badge · **AI-styled rating badge** with Star, average, count,
  "تقييم القراء / Reader Rating" · availability status badge "N of M available") →
  large title → author line in brand color prefixed "بقلم / by" → description paragraph →
  a muted **bibliographic grid**: Publisher (Building) · Publication year (Calendar) ·
  Language (Globe) · ISBN (Hash).
- **Active holds banner** (only when holds exist): AI-surface tinted strip, BookmarkCheck icon,
  "N active holds on this title".
- **Physical copies table:** heading "النسخ المادية (N)" + Layers icon, with the default shelf
  shown on the right. Columns: **Barcode** (mono, bold) · **Shelf location** (MapPin + text) ·
  **Status** (badge) · **Staff action** (staff only: a select to change copy status between
  available / borrowed / reserved / maintenance). Empty row: "no copies registered".
- **Ratings & reviews section** (above a divider):
  - Heading with amber Star + "التقييمات والمراجعات" + a pill with the review count.
  - **Score breakdown card:** giant average (2.4rem, brand color), a 5-star row under it,
    "N ratings" caption, and 5→1 **distribution bars** (label `5★`, amber progress track, count).
  - **Interactive star-rating widget** (see 7.6) side by side with the breakdown.
  - **Reader reviews list** (scrollable, max ~220px): per review — circular avatar initial,
    reviewer name, role badge ("عضو / Member"), a 5-star row on the opposite side, the quoted
    review text, and the date. Empty state: italic "no ratings yet".
- **Footer bar** (muted background): a reassurance line with a green CheckCircle
  ("rules notice") on one side; `إغلاق / Close` secondary + a primary/AI CTA
  `حجز للاستلام / Hold for pickup` when copies are available, otherwise
  `انضم لقائمة الانتظار / Join waitlist`.

### 6.2 AI Librarian Drawer (slide-over, max-width 480px, full height)
Design in the **AI accent** family (NOT amber — the AI color is navy-blue `#1D4ED8` / `#60A5FA`).
- **Header:** AI-surface background, 3px AI-accent top border, a rounded AI-accent icon tile
  with Sparkles, title "أمين المكتبة الذكي", a small "AI Assistant" pill, a subtitle line,
  and a close icon button.
- **Disclaimer strip:** muted band, ShieldCheck icon, privacy/disclaimer sentence.
- **Message stream** (scrollable, 18px padding, 16px gap):
  - **User bubble:** primary-filled, white text, right/start aligned per direction, one corner tightened.
  - **Assistant bubble:** muted surface + subtle border, prefixed by a small AI-accent label row
    with the Bot icon ("توصية / Recommendation").
  - **Matched-book result cards** under an assistant message: small cover thumb (45×60),
    title, author, availability status badge + shelf location, and two stacked tiny buttons —
    `عرض الكتاب / View Book` (secondary) and `حجز / Reserve` (primary).
  - **Suggestion chips:** pill buttons in AI-surface/AI-accent with a ⚡ prefix. Seed chips:
    "قصة غموض قصيرة للمبتدئين" · "أفضل مراجع الذكاء الاصطناعي وهندسة البرمجيات" ·
    "روايات تاريخية عربية مشوقة" · "ما هي مدة الإعارة وسياسة التجديد؟"
    (EN: "Short mystery stories for beginners" · "Top AI & software engineering references" ·
    "Compelling historical literature" · "What is the loan duration and renewal policy?").
  - **Loading state:** AI-surface strip, pulsing Sparkles, "جاري التفكير… / Thinking…".
- **Input bar:** text field + a square 42×42 AI-gradient send button (Send icon), disabled when empty/loading.
- **First-run state:** welcome assistant message + the 4 seed chips.

### 6.3 Toasts (bottom corner stack, max-width 380px)
Card with a 4px colored accent edge on the inline-start side, an icon, a bold title, a body
line, and a close X. Four variants: **success** (available colors, CheckCircle2) ·
**error** (overdue colors, XCircle) · **warning** (reserved colors, AlertTriangle) ·
**info** (primary, Info). Slide-up entry, auto-dismiss.

---

## 7. COMPONENT LIBRARY TO REBUILD (make these Figma components with variants)

### 7.1 Buttons
Variants: `primary` (navy gradient, white) · `secondary` (surface + subtle border) ·
`outline` (transparent + primary border/text) · `ai` (AI-blue gradient + glow shadow,
lifts 1px on hover) · `danger` (overdue tint → solid `#B91C1C` + white on hover).
Sizes: `sm` (5×10, .82rem) · `default` (8×16, .9rem) · `lg` (12×24, 1rem) · `icon` (38×38 square).
States: default / hover / focus / active (1px push-down) / disabled (55% opacity).
Icon-left + label is the norm; gap 8px (sm: 6px).

### 7.2 Badges (`StatusBadge`)
Pill, icon + label, 1px border, `0.78rem/600`. Variants map to §2.3:
available (CheckCircle2) · borrowed/issued (BookOpen) · reserved/due_soon (Clock) ·
overdue (AlertCircle) · maintenance (Wrench, neutral) · active (ShieldCheck) ·
blocked (ShieldAlert) · paid (CheckCircle2) · unpaid (AlertCircle) · **ai** (AI colors) ·
**neutral**. Sizes: sm / md. Must also support an **icon-only** mode (used inside barcode chips)
and a **custom label** mode (e.g. "3 متاح", "متأخر 5 يوم", "#2 in Queue").

### 7.3 Cards & surfaces
`card` (surface, subtle border, radius lg, xs shadow; hover → md shadow + border-hover) ·
`card-elevated` · `kpi-card` (radius xl, 20px padding, hover lifts 2px, with a faint corner
flourish) · `dashboard-card` (radius xl, 22px padding; `compact` = 16px).

### 7.4 Form controls
`form-input` / `form-select` / `form-textarea`: full width, 9×13 padding, radius md,
surface background, subtle border; **focus** = primary border + 3px primary focus ring.
`form-group` = label + control + 6px gap. `form-label` = `.85rem/600`, with an optional muted
hint on the trailing side. Plus: a **select wrapper** with a ChevronDown affordance, a
**password field** with an Eye/EyeOff toggle, an **inline-icon input** (icon inset 12px,
content padding 38px on that side), a **checkbox** (18×18, AI-accent), and a
**barcode/scan input** (Barcode icon inset, mono value).

### 7.5 Tables
`table-container` = subtle border + radius lg + surface + horizontal scroll.
`th` = muted background, `0.82rem/700`, **uppercase**, +0.4px tracking, bottom border.
`td` = 13×16 padding, `0.9rem`; row hover tint; last row no bottom border.
Must support: embedded badges, mono identifier cells, a cover-thumb + 3-line title cell,
wrapped chip clusters, inline selects, and 1–2 action buttons per row.
Also design the **empty row** pattern (centered muted text spanning all columns) and a
celebratory empty variant (the overdues table shows a 🎉 line in the available color).

### 7.6 Star rating widget (`StarRatingWidget`)
Three states, all needed:
- **Unauthenticated:** dashed-border muted panel, 5 dim stars, "sign in to rate" line + a small
  primary `Sign In` button.
- **Compact:** inline 5 clickable stars (amber when filled), plus a "Saved ✓" confirmation.
- **Full:** panel with a header (Sparkles + "قيّم هذا الكتاب / Rate this book", and a
  qualitative label pill when a rating is picked — ضعيف جداً / مقبول / جيد / جيد جداً / ممتاز),
  a large interactive 5-star row (hover scales 1.2 with an amber drop-shadow glow) with an
  "N / 5" readout, then a **review textarea** (max 500 chars with a live `n/500` counter),
  a footer row with the reviewer identity (MessageSquare + name) and a primary Submit/Update
  button (Send icon, spinner while submitting, success check when done).

### 7.7 Misc patterns
- **KPI card:** label, icon badge (44×44 tinted square per status color), big value in the
  status color, optional up/down trend pill, sub-caption line.
- **Mode pill group** (`quick-mode-pills` / `mode-switcher`): muted rounded-full track with
  a 4px inset, pills go primary-filled + white when active.
- **Activity timeline** (`activity-queue`): a dot with a connecting vertical line, a bold action
  title, a time on the opposite side, a details line, and an actor line in the brand color.
- **Mini bar chart:** 7 columns, 80px tall, rounded tops, last bar in AI accent, day labels under.
- **Stat rows list:** label + bold value, separated by hairlines.
- **Progress meters:** 5–8px rounded tracks — used for copy availability, borrow-limit usage,
  and rating distribution. Track `border/subtle` or `bg/muted`; fill = the relevant status color
  (borrow-limit fill turns overdue-red when the limit is hit).
- **Count badges:** circular/pill numeric badges on nav items and the notification bell
  (danger and info variants).
- **Modal shell:** backdrop + centered card (max-width 650px default, radius xl, xl shadow,
  max-height 90vh, scroll), header row with title + close icon button, body, and a right-aligned
  Cancel / Confirm action row.
- **Empty state:** circular muted icon tile (64px), heading, explanatory paragraph (max ~420px),
  and 1–2 recovery actions (one of them often the AI search button).
- **Loading:** button spinner, drawer "thinking" strip, skeletons if you add them.

---

## 8. EVERY PAGE — REDESIGN ALL OF THESE

> For each page: produce **light + RTL** as the master, plus a **dark** variant and a
> **mobile (375px)** variant. Design every listed state.

### 8.1 `/` — Public Book Catalog *(the home page; also the member's main browse surface)*
Content, top to bottom:
1. **AI discovery banner** — AI-surface→surface gradient card with an AI-border, a 46px
   AI-gradient Sparkles tile, a bold brand-color headline + description, and two CTAs on the
   trailing side: an **AI button** ("قصة غموض قصيرة للمبتدئين" prompt) and a secondary button
   ("أفضل مراجع الذكاء الاصطناعي" prompt). Both open the AI drawer pre-filled.
2. **Search & filter bar** — one card containing: a wide search input (Search icon,
   placeholder covering title/author/ISBN/keywords, a clear X when filled) + four selects:
   **Category** (dynamic: ذكاء اصطناعي وتكنولوجيا · روايات وأدب · تاريخ وفلسفة · غموض وبوليسي ·
   إدارة وتطوير الذات, plus "all") · **Availability** (all / available now / borrowed now) ·
   **Language** (all / العربية / English) · **Sort by** (rating / year / title).
3. **Results header** — "N كتاب متاح" heading, a `إعادة ضبط الفلاتر / Reset filters` chip that
   appears only when filters are active, and a trailing note about shelf locations.
4. **Book grid** — `repeat(auto-fill, minmax(280px, 1fr))`, 20px gap, of **BookCard**:
   - 220px cover area with a bottom scrim; **availability badge** top-start;
     **clickable rating pill** top-end (Star + value + "(count)" — opens the details modal);
     on the cover's bottom edge a **category tag** and the **publication year** (Calendar).
   - Body: title (clickable) → author → 2-line clamped description → a muted info block with
     **shelf location** (MapPin) and **ISBN** (Hash) and an **available-copies meter**
     ("N of M" + a 5px progress bar) → two buttons: `عرض النسخ / View Copies` (secondary) and
     `حجز مسبق / Place Hold` (primary when available) or `انضم للطابور / Join Queue` (AI style when not).
   - Hover: cover scales 1.04, card shadow deepens.
5. **Empty state** — circular BookOpen tile, "لم يتم العثور على كتب" heading, explanation,
   and two buttons: `مسح الفلاتر / Clear filters` + an AI `البحث بالذكاء الاصطناعي` button.

States to deliver: default grid · filtered (with the reset chip) · search-active · empty · mobile 1-col.

### 8.2 `/login` — Sign In / Sign Up modal **over the blurred catalog**
This is not a separate page: the catalog stays behind it, blurred `12px` + brightness `0.88`,
and the overlay is `rgba(15,23,42,0.55)` + 8px blur. Card: `max-width 530px`,
`min-height 590px`, `max-height 94vh`, radius 24px, scale-up entry, dismissible by backdrop
click or Escape.
- **Card header:** logo tile with BookOpen **plus a small Sparkles sparkle accent**, title
  "المكتبة الذكية" + "LMS 2026" sub-line, and on the trailing side three mini controls:
  theme toggle, language toggle (Globe + EN/ع), and close X.
- **Tab bar:** `تسجيل الدخول / Sign In` (LogIn) · `إنشاء حساب عضو / Sign Up (Members)` (UserPlus,
  with a small "للأعضاء / Members" badge).
- **Error banner** (when present): overdue-tinted strip with AlertCircle — invalid credentials,
  email already registered, password too short, passwords don't match.
- **Sign In tab:** heading "أهلاً بك مجدداً / Welcome Back" + subheading → Email field
  (`name@library.sa`, forced LTR) → Password field with Eye/EyeOff toggle → full-width submit
  button with ArrowRight (and a **spinner loading state**) → a divider labeled
  "أو دخول سريع بحساب تجريبي / or quick access with demo accounts" → **three demo cards**
  (each: tinted icon tile in its own accent — Member `#3B82F6`/User, Librarian `#8B5CF6`/Layers,
  Admin `#F59E0B`/Shield — plus role label, person name, and a one-line description) →
  a switch footer: "ليس لديك حساب عضو؟ سجل كعضو جديد الآن ←".
- **Sign Up tab (members only):** heading "إنشاء حساب عضو جديد" + subheading → an **info notice
  pill** (Info icon) stating that librarian/admin accounts are provisioned administratively →
  Full Name → Email → a two-column row of Password (with toggle, "6 أحرف على الأقل" hint) and
  Confirm Password → full-width submit with CheckCircle2 ("إنشاء حساب عضوية فوري") → a switch
  footer back to Sign In.

States to deliver: Sign In default · Sign In with error · Sign In loading · Sign Up default ·
Sign Up with validation error · dark · mobile (radius 18px, card scrolls).

### 8.3 `/my-loans` — Member Dashboard (إعاراتي وحجوزاتي)
1. **Profile overview card** (surface→muted gradient, 3 auto-fit columns):
   - *Identity:* 64px rounded-xl primary avatar with the initial, name, membership status badge,
     then a line with the **member code** (mono) and the join date.
   - *Borrow-limit meter:* label + "N من M كتب" in brand color, an 8px progress bar (turns
     overdue-red at the limit), and a caption "يمكنك استعارة X كتب إضافية".
   - *Fines & standing:* "الغرامات المستحقة" label + a large amount in EGP (green when 0, red
     when owed), and either a green "سجل ناصع / Clean Record" line with CheckCircle2 or an
     overdue "يتطلب التسوية / Action Required" badge.
2. **Active Loans section** — heading (BookOpen + "الإعارات النشطة (N)") with a trailing
   policy note about online renewals. Grid `minmax(340px, 1fr)` of **loan cards**, each:
   - A 4px **accent stripe** on the inline-start edge: available-green (healthy) /
     reserved-indigo (due soon ≤2 days) / overdue-red.
   - 60×84 cover thumb + title + a status badge showing the live countdown
     ("متبقي 5 أيام" / "متأخر 3 يوم") + author line + a meta row with the **barcode** (mono)
     and "التجديدات: n من m".
   - A muted dates strip: **تاريخ الصرف / Issued** and **تاريخ الاستحقاق / Due Date**
     (the due date turns red when overdue).
   - Action row: a wide primary **Renew** button (RotateCcw) whose label changes to
     "بلغت الحد الأقصى للتجديد" or "لا يمكن التجديد (متأخر)" and is **disabled** in those cases,
     plus a `تقييم / Rate` button (amber Star) and a `تفاصيل / Details` button.
   - Empty state: muted BookOpen + "لا توجد إعارات نشطة".
3. **Active Reservations section** — heading (BookmarkCheck in AI accent + count). Grid
   `minmax(320px, 1fr)` of cards with a 3px AI-accent **top** border: title, an AI badge with
   the **queue position** ("المرتبة #2"), a reserved status badge, placed date + expiry date,
   and a full-width `إلغاء الحجز / Cancel hold` button in the danger color (XCircle).
   Empty state: "لا توجد حجوزات نشطة".
4. **Policy summary strip** — muted card with ShieldCheck: "مدة الإعارة 14 يوماً • بحد أقصى 3 كتب •
   2 تجديدات مسموحة • غرامة التأخير 5 ج.م / يوم".

States: full (loans + reservations) · empty both · at-limit (red meter) · with unpaid fines ·
an overdue loan with a disabled renew · dark · mobile.

### 8.4 `/librarian` — Librarian Dashboard (لوحة المتابعة)
1. **4 KPI cards** (4 → 2 → 1 columns):
   - **الفهرس / Catalog** — total titles, sub "N نسخة مادية", BookOpen, primary colors, `+2` up-trend.
   - **الإعارات النشطة / Active Loans** — count, sub "N متاح", ArrowRightLeft, borrowed colors.
   - **الحجوزات / Reservations** — count, sub "في الانتظار", Clock, reserved colors.
   - **المتأخرات / Overdues** — count, sub "غرامات: N ج.م", AlertTriangle, overdue colors, down-trend.
2. **Main grid** `1fr 1fr 280px` (→ 2 cols at 1200, 1 col at 768):
   - **Quick circulation desk card** — header (Barcode icon + title) with a **mode pill group**
     (`إعارة / Issue` ArrowRightLeft · `إرجاع / Return` RotateCcw). Form: a **barcode input**
     with an inset Barcode icon (label changes per mode), plus — in Issue mode only — a
     **member-code input** with an inset Users icon. Below: a primary submit button whose label
     and icon follow the mode, and a muted **quick-presets** block ("نماذج سريعة") with two
     small preset buttons (`Issue: BC-101-01`, `Return: BC-404-02`).
   - **Recent activity card** — header (FileText + "النشاط الأخير") with a `عرض الكل / View All`
     button (ArrowUpRight), then the **activity timeline** of the last 6 audit entries
     (action, time, details, "بواسطة: actor").
   - **Right stack of three compact cards:**
     a) **الحركة الأسبوعية / Weekly Traffic** — CalendarDays header + the 7-bar mini chart
        (Sun→Sat labels, last bar in AI accent).
     b) **لمحة المخزون / Inventory Snapshot** — Users header + stat rows: Registered members ·
        Utilization rate (% in borrowed color) · Avg loans per member · Unpaid fines total
        (in overdue color).
     c) **Quick actions** — two side-by-side buttons: primary `مكتب التداول / Circulation Desk`
        and secondary `إضافة كتاب / Add Book` (PlusCircle).

States: Issue mode · Return mode · dark · tablet 2-col · mobile 1-col.

### 8.5 `/librarian/circulation` — Circulation Desk (مكتب الإعارة والتداول المركزي)
- **Page header:** h1 + description, and on the trailing side a **segmented switch**:
  `تسجيل إعارة جديدة / Issue Loan (Checkout)` (BookOpen) · `تسجيل إرجاع نسخة / Return Copy (Checkin)` (RotateCcw).
- **ISSUE tab — two columns** (`minmax(360px, 1fr)`):
  - *Loan Issue Form card* (BookOpen heading): a **member select** whose options read
    "Name (MEM-2026-0042) — Active [إعاراته: 1/3]" · a **barcode text input** (`BC-xxx-xx`)
    with a wrapped row of up to 4 **available-copy quick-pick chips** under it · a muted
    **loan-terms preview** block showing "مدة الإعارة المطبقة: 14 يوماً" and
    "تاريخ الاستحقاق المحسوب: <date>" (date in brand color) · a tall primary submit
    "إتمام تسجيل الإعارة وصرف النسخة" (CheckCircle2) that is **disabled** when no barcode is
    entered or the selected member is not active.
  - *Pre-flight Validation card* ("فحص الأهلية المسبق"):
    a **member panel** (User icon + name + membership status badge; member code, current active
    loans "1 / 3", recorded fines in EGP — red when > 0) and a **copy preview panel**
    (50×70 cover thumb, title, copy status badge, author, shelf location). If the typed barcode
    doesn't exist → an **overdue-tinted error panel** "الباركود المدخل غير مسجل في قاعدة البيانات".
    If nothing is selected → a muted placeholder line.
- **RETURN tab — two columns:**
  - *Return & Check-in card* (RotateCcw heading): a barcode input, a wrapped row of
    **currently-checked-out quick-pick chips** each annotated `(متأخر ⚠️)` or `(ساري)`, and a
    tall primary submit "تأكيد استلام النسخة وإغلاق الإعارة".
  - *Loan Details Preview card:* the target loan — book title + status badge, borrower name +
    member code, due date; **and when overdue**, an overdue-tinted alert block (AlertTriangle,
    bold "تنبيه: النسخة متأخرة عن موعدها!") explaining the automatic 5 EGP/day fine. Empty
    placeholder when nothing is scanned.
- **Bottom: Current Circulating Loans table** (Clock heading + live count). Columns:
  Barcode (mono bold) · Book Title (bold) · Borrower · Issue Date · Due Date · Status (badge) ·
  Quick Action (`استلام / Check-in` button).

States: Issue empty · Issue valid+previewed · Issue invalid barcode · Issue blocked member ·
Return empty · Return with an overdue alert · dark · mobile (stacked).

### 8.6 `/librarian/catalog` — Catalog & Physical Copies Management
- **Header:** h1 + description, trailing primary `إضافة عنوان جديد للفهرس / Add New Title` (Plus).
- **Search card:** one inset-icon input (title / author / ISBN).
- **Inventory table.** Columns:
  **الكتاب / Book** (40×54 cover thumb + title bold + author + `ISBN: …` caption) ·
  **التصنيف / Category** (neutral badge) ·
  **موقع الرف / Shelf Location** (MapPin + text) ·
  **إجمالي النسخ / Total Copies** (bold number) ·
  **النسخ المتاحة / Available** (status badge "3 متاح" or "مُعار بالكامل") ·
  **الباركودات وحالاتها / Item Barcodes & Status** (a wrapped cluster of small **barcode chips**,
  each = mono barcode + an icon-only status badge, max ~240px wide) ·
  **إجراءات / Actions** (`عرض وإدارة / Manage` → opens the Book Details modal).
- **"Add New Bibliographic Title" modal** (max-width 600px): header + close; fields —
  Book Title (full width) · a 2-col row Author / ISBN (`978-xxx-xxx-xxx-x`) ·
  a 2-col row Category select / Publication Year · a 2-col row Default Shelf Location /
  Initial Physical Copies (number 1–20) · Description textarea (3 rows) ·
  footer `إلغاء / Cancel` + primary `حفظ وإصدار الباركودات / Save & Issue Barcodes` (CheckCircle2).

States: table default · search-filtered · modal open · modal with validation · dark ·
mobile (horizontally scrolling table).

### 8.7 `/librarian/reservations` — Reservations & Hold Queues
- **Header:** h1 + description, trailing **filter segmented control**:
  `النشطة / Active (n)` · `الكل / All (n)`.
- **Table.** Columns: Book Title (bold) · Borrower Member (User icon + name) ·
  Member Code (mono) · **Queue Position** (AI badge, bold, "المرتبة #2" / "#2 in Queue") ·
  Placed Date · Pickup Expiration · Status (badge) · **Actions** — for active rows a
  `إشعار / Notify` secondary button (Bell) and a `إلغاء / Cancel` danger button (XCircle).
- **Empty row:** "لا توجد حجوزات مطابقة للفئة المحددة حالياً."
- The Notify action fires a **success toast** describing a 48-hour pickup window — design that toast.

States: active-filtered · all · empty · dark · mobile.

### 8.8 `/librarian/overdues` — Overdues & Fine Ledger
- **Header:** h1 + description, trailing segmented control:
  `الإعارات المتأخرة / Overdue Loans (n)` · `سجل الغرامات / Fines Ledger (n)`.
- **Summary banner** — overdue-tinted gradient card with an overdue-border: a 46px solid
  overdue-red tile with AlertTriangle, a bold red headline "إجمالي الغرامات المستحقة غير المحصلة:
  N ج.م", a sub-line stating the official rate ("5 ج.م عن كل يوم تأخير بعد 14 يوماً"), and a
  trailing overdue badge "N مطالبات معلقة".
- **Tab A — Overdue loans table.** Columns: Barcode (mono) · Overdue Book · Borrower
  (User icon + name + code) · Due Date (red, semibold) · **Days Late** (overdue badge
  "5 أيام تأخير") · **Estimated Fine** (bold red, EGP) · Quick Return
  (`استلام واحتساب الغرامة / Check-in & Assess`, RotateCcw).
  **Celebratory empty state:** centered, in the available color — "🎉 لا توجد أي إعارات متأخرة حالياً!".
- **Tab B — Fines ledger table.** Columns: Member (User icon + name) · Member Code (mono) ·
  Related Book · **Fine Amount** (bold, red when unpaid) · Reason (small, secondary) ·
  Date · Status (paid/unpaid badge) · **Settlement Action** — a primary
  `تسوية وتحصيل / Settle & Collect` button (CheckCircle2) for unpaid rows, or muted
  "تم التحصيل بنجاح / Settled Successfully" text for paid ones.

States: overdues populated · overdues empty (🎉) · fines mixed paid/unpaid · dark · mobile.

### 8.9 `/admin` — Staff Accounts & Permissions
- **Header:** h1 + description, trailing primary `إضافة حساب موظف جديد / Add Staff Member` (Plus).
- **Table.** Columns: **Staff Member** (34px circular primary-subtle avatar with the initial +
  bold name) · **Email** (Mail icon + address, secondary) · **Role** (neutral badge with the raw
  role key: `librarian` / `cataloger` / `admin`) · **Job Title** (e.g. "أمين الإعارة والتداول" /
  "Circulation & Lending Librarian", "مشرف الفهرسة والتصنيف", "مدير نظام المكتبة") ·
  **Last Login** (muted datetime) · **Account Status** (active/blocked badge).
- **"Create New Staff Account" modal** (max-width 520px): Full Name · Institutional Email
  (`employee@library.gov.sa`) · a **Role & Permissions select** (Circulation Desk Librarian /
  Cataloging & Inventory Specialist / System & Library Admin) · footer Cancel + primary
  `إنشاء الحساب / Create Account` (CheckCircle2).

States: table · modal open · dark · mobile.

### 8.10 `/admin/policies` — Lending Rules & System Policies
- **Header:** h1 + description.
- **Two-column form** (`minmax(360px, 1fr)`):
  - **Card A — "قواعد الإعارة والتجديد / Lending & Renewal Rules"** (ShieldCheck heading):
    *Maximum active loans per member* (number 1–10, unit hint "كتب") ·
    *Default loan duration* (1–60, "أيام") ·
    *Maximum allowed renewals per book* (0–5, "مرات").
  - **Card B — "رسوم التأخير ومهل طوابير الحجز / Overdue Fines & Hold Queues"** (Settings heading):
    *Daily overdue fine per item* (step 0.5, unit "ج.م / يوم") ·
    *Hold pickup window before automatic cancellation* (12–168, "ساعات") ·
    then an **AI toggle block**: AI-surface panel with an AI-border, Sparkles icon, bold
    AI-accent title "تفعيل أمين المكتبة الذكي (AI Assistant)", a description line, and an
    18×18 AI-accent checkbox on the trailing side.
- **Full-width action row** (spans both columns, right-aligned): secondary
  `إعادة التعيين / Reset to Defaults` (RotateCcw) + primary
  `حفظ واعتماد التعديلات / Save & Enforce Policies` (CheckCircle2).
- Saving fires a success toast — design it.

States: default values · edited/dirty · AI toggle off · dark · mobile (1-col).

### 8.11 `/admin/audit` — Audit Log (سجل التدقيق الرقابي)
- **Header:** h1 + description (immutability of the record).
- **Filter card:** an inset-icon search input (actor / details / action / entity id) +
  an **action-type select** with these options: All · تسجيل إعارة (Issue loan) ·
  تجديد إعارة (Renew) · إرجاع نسخة (Return copy) · تسجيل حجز عنوان (Place hold) ·
  إلغاء حجز (Cancel hold) · تسوية غرامة (Settle fine) · احتساب غرامة تأخير (Assess fine) ·
  إضافة عنوان جديد (Add new book) · تحديث سياسات النظام (Update policies) ·
  تعديل السياسات (Modify policies).
- **Logs table.** Columns: **Time** (small, nowrap, secondary, localized datetime) ·
  **Actor** (User icon + bold name) · **Role** (neutral badge) · **Action** (a compact
  primary-subtle **tag** with primary text, radius xs, bold) · **Entity** (mono,
  "Loan #1042"-style) · **Details** (primary text, small).
- **Empty row:** "لا توجد سجلات".

States: populated · filtered · empty · dark · mobile.

### 8.12 Also deliver
- **Protected-route redirect** behavior as a small flow note (not a screen).
- **Unknown route** → silently redirects to `/` (no 404 page exists today; **do not invent one**
  unless you present it as an optional addition, clearly labeled).

---

## 9. KEY FLOWS (each must stay fully possible after the redesign)

1. **Browse → inspect → hold.** Catalog → filter/search → BookCard → Book Details modal →
   see per-copy barcodes and shelves → "Hold for pickup" / "Join waitlist" → success toast →
   the hold appears on `/my-loans` with a queue position.
2. **Guest hold attempt.** Unauthenticated reserve/rate → prompted to sign in → `/login` modal
   over the blurred catalog → after sign-in, returns to the intended destination.
3. **Register as member.** Sign Up tab → validation (≥6 chars, passwords match, email not taken)
   → account created → welcome toast → lands on the catalog as a member.
4. **Role-based landing.** Member → `/`; Librarian → `/librarian`; Admin → `/admin`. Staff can
   always jump back to the public site via the navbar button or the sidebar "Public Site" link.
5. **Issue a loan.** Librarian dashboard quick desk *or* `/librarian/circulation` Issue tab →
   enter/scan copy barcode + member code → pre-flight checks (copy exists & is available;
   member exists, is active, and is under the 3-book limit) → confirm → due date = today + 14
   days → copy flips to borrowed, the loan joins the circulating table, an audit entry is written,
   a toast confirms. Failure paths each produce an explicit error toast.
6. **Return a copy.** Return tab (or any table's Check-in button) → preview the loan and borrower
   → if past due, warn and auto-assess `days_late × 5 EGP` → confirm → copy becomes available
   (or goes to the Holds Pickup Desk if someone is queued), the loan closes, a fine row may be
   created, audit + toast.
7. **Self-service renewal.** `/my-loans` → Renew → allowed only if not overdue, renew count
   < 2, and no active hold on the title → due date extends by 14 days → toast.
8. **Hold queue management.** `/librarian/reservations` → Notify (sends an availability notice,
   48-hour pickup window) or Cancel → the queue re-orders.
9. **Fine settlement.** `/librarian/overdues` → Fines Ledger → Settle & Collect → the row turns
   paid, the member's balance drops, audit + toast.
10. **Catalog growth.** `/librarian/catalog` → Add New Title → N initial copies are created with
    auto-generated barcodes and a default shelf location → the title appears in the public catalog.
11. **Rate & review.** Member opens a book's details → interactive stars (+ optional ≤500-char
    review) → submit → average, count and distribution bars update; the review joins the list.
12. **AI discovery.** Any AI entry point (navbar, catalog banner, footer links, sidebar Tools,
    empty state, suggestion chip) → drawer opens, optionally pre-filled → the assistant replies
    with an explanation, matched book cards (with live availability + shelf) and follow-up chips →
    View Book (opens the modal and closes the drawer) or Reserve directly. It also answers policy
    questions from the live policy values.
13. **Policy change propagation.** `/admin/policies` → save → the new numbers immediately drive
    the member borrow-limit meter, due-date math, renewal caps, fine math, and the AI's policy answers.
14. **Audit visibility.** Every sensitive staff action above writes an immutable `/admin/audit` row.
15. **Theme & language.** Both toggles exist in the public navbar, inside the login card, and in
    the dashboard sidebar; switching language flips the whole app between RTL/Arabic and LTR/English.

---

## 10. DELIVERABLES

Organize the Figma file as:

```
📄 00 — Cover & Changelog        (what changed visually; what stayed locked)
📄 01 — Foundations              color variables (Light/Dark modes), type styles,
                                 spacing scale, radii, elevation, grids, icon sheet
📄 02 — Components               every component in §7, with variants + states,
                                 named to match the code (Button/primary, StatusBadge/overdue, …)
📄 03 — Public & Member          §8.1, §8.2, §8.3 + navbar, mobile nav panel, footer
📄 04 — Librarian               §8.4–§8.8 + sidebar, topbar, notifications dropdown
📄 05 — Admin                    §8.9–§8.11 + admin topbar/notifications
📄 06 — Overlays                 Book Details modal, AI drawer, all modals, toasts
📄 07 — Dark Mode                dark variants of every screen
📄 08 — Responsive               tablet (768) + mobile (375) for every screen
📄 09 — Flows                    the 15 flows in §9 as annotated arrows between frames
```

**Rules for the file:**
- **Auto layout everywhere**, with real constraints — the implementation is CSS flex/grid.
- **Figma variables** for all colors (two modes), spacing, and radii. No hard-coded hexes
  outside §2.5's intentional literals.
- **Frame names = routes.** `/`, `/login`, `/my-loans`, `/librarian`, `/librarian/circulation`,
  `/librarian/catalog`, `/librarian/reservations`, `/librarian/overdues`, `/admin`,
  `/admin/policies`, `/admin/audit` — suffixed `· light|dark`, `· rtl|ltr`, `· desktop|tablet|mobile`.
- **Component names should mirror the codebase** so a developer can map them directly:
  `BookCard`, `BookDetailsModal`, `AIAssistantDrawer`, `StatusBadge`, `StarRatingWidget`,
  `ToastContainer`, `Sidebar`, `TopBar`, `Footer`, `KpiCard`, `DashboardCard`, `Table`,
  `ModeSwitcher`, `ActivityTimeline`, `MiniChart`, `EmptyState`.
- **Annotate every deviation.** Any spacing/radius/shadow/typography value you change from §2.6
  and §3 must be listed on the Cover page as `old → new`, because it becomes a CSS variable edit.
- **Real content only.** Use the actual Arabic + English strings, real barcodes (`BC-101-01`),
  member codes (`MEM-2026-0042`), shelf names (`جناح التقنية - رف CS-12` / "Tech Wing - Shelf CS-12"),
  EGP amounts, and the real categories. No lorem ipsum, no placeholder numbers.
- **Accessibility:** keep ≥4.5:1 text contrast in both modes, visible focus rings (the current
  pattern is a 3px primary/AI ring), and ≥38×38 touch targets.

**Export for handoff (this is what gets implemented):**
1. Full-page **PNG @2x** and **SVG** of every frame, filenamed by route + theme + direction + breakpoint.
2. The **variables export (JSON)** or a complete token table of any changed non-color values.
3. The **Cover changelog** of `old → new` for spacing, radii, shadows and type.
4. A short **component-mapping note** listing, per redesigned component, which existing CSS class
   it corresponds to (`.card`, `.kpi-card`, `.dashboard-sidebar`, `.topbar`, `.public-navbar`,
   `.login-modal-card`, `.table`, `.badge`, `.btn-*`, `.form-input`, …).
5. The shareable **Figma link** with dev-mode access.

---

## 11. FINAL CHECKLIST BEFORE YOU HAND OFF

- [ ] Every hex in §2 is unchanged and used for the same semantic purpose.
- [ ] All 11 routes designed, plus the 3 shells, 3 global overlays, and all 5 modals.
- [ ] Every page has: default, populated, empty, error/validation, and loading states where applicable.
- [ ] Light **and** dark mode for every screen.
- [ ] RTL **and** LTR verified — nothing hard-mirrored wrong (icons, drawers, toasts, stripes, chevrons).
- [ ] Desktop + tablet + mobile for every screen.
- [ ] Not one button, column, filter, field, badge or toast from §5–§8 has been dropped.
- [ ] No new page, no new feature, no removed feature.
- [ ] Barcodes, member codes and ISBNs are monospace and LTR in both languages.
- [ ] Every changed non-color value is documented as `old → new`.
