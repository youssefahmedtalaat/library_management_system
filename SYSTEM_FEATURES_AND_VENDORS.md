# 📚 Smart Library Management System (LMS 2026)
## Comprehensive System Features, Architecture & Vendor Specification

---

## 1. Executive Summary & System Overview

**Smart Library LMS** is a full-stack, enterprise-grade digital library management and bibliographic circulation platform. It combines modern academic library operations (physical barcode item-level tracking, priority hold queues, ACID loan transactions, and financial overdue penalties) with an **AI Discovery Assistant** powered by **Google Gemini**.

The platform is designed around strict separation between **bibliographic titles** (abstract catalog records) and **physical copies** (individually barcode-tagged printed inventory with discrete shelf locations). It natively supports **Arabic-first (RTL)** and **English (LTR)** internationalization, responsive desktop/tablet/mobile viewports, and unified light/dark design token themes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Vite Dev Server (:5173)                         │
│   React 19 SPA • Dual RTL/LTR • Light/Dark Mode • Auto Backend Spawner │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Reverse Proxy /api -> :5001
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express REST API (:5001)                        │
│   JWT Auth • RBAC Middleware • ACID Transactions • Gemini AI Assistant │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ mysql2 Pool (InnoDB)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      MySQL Database Engine (:3306)                     │
│    library_lms_db • UTF8mb4 • Foreign Keys • Cascade/Restrict Rules   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Complete Vendor & Third-Party Dependency Ecosystem

### 2.1 Frontend Dependencies & Vendors

| Vendor / Package | Version | Classification | Purpose & Implementation Details |
| :--- | :--- | :--- | :--- |
| **React** | `^19.3.1` | Core Framework | Declarative UI rendering, hooks (`useState`, `useEffect`, `useMemo`, `useRef`), and component lifecycle management. |
| **React DOM** | `^19.3.1` | UI Renderer | Document Object Model renderer for React 19 web applications. |
| **Lucide React** (`lucide-react`) | `^1.61.0` | Iconography Vendor | Clean, consistent SVG icon set covering 40+ system actions (circulation, badges, arrows, ratings, AI, administration). |
| **Vite** | `^8.3.4` | Build Tool & Dev Server | Next-generation ESM bundler and development server featuring Hot Module Replacement (HMR) and custom auto-start plugins. |
| **@vitejs/plugin-react** | `^6.1.2` | Vite Compiler Plugin | Provides Fast Refresh and JSX/TSX transformation support via esbuild and Babel. |
| **Oxlint** (`oxlint`) | `^1.88.0` | Quality & Linting | Rust-based high-speed linter enforcing idiomatic code quality and catching syntax regressions. |
| **Concurrently** (`concurrently`) | `^9.2.5` | Dev Tooling | Cross-platform multi-process runner used to orchestrate concurrent Node and Vite sessions. |
| **Google Fonts** (External Vendor) | CDN Hosted | Typography System | **Cairo** font family for Arabic (RTL) and **Plus Jakarta Sans** for English (LTR) with full weight scales (`300` to `900`). |
| **Unsplash** (External Vendor) | CDN Hosted | Imagery Vendor | High-resolution curated book cover imagery and author portraits with fallback caching. |

---

### 2.2 Backend Dependencies & Vendors

| Vendor / Package | Version | Classification | Purpose & Implementation Details |
| :--- | :--- | :--- | :--- |
| **Express** (`express`) | `^4.21.2` | Server Framework | Fast, unopinionated HTTP REST API server powering routes, parameter parsing, error handlers, and middleware pipelines. |
| **MySQL2** (`mysql2`) | `^3.12.0` | Database Driver | High-performance MySQL driver with native `mysql2/promise` API, connection pooling, prepared statements, and ACID transactions. |
| **JSONWebToken** (`jsonwebtoken`) | `^9.0.2` | Authentication | Cryptographic signing and verification of stateless Bearer tokens (`HS256`, 7-day expiration). |
| **BcryptJS** (`bcryptjs`) | `^2.4.3` | Cryptography | One-way password hashing using salt rounds (work factor 10) for secure credential storage. |
| **Dotenv** (`dotenv`) | `^16.4.7` | Configuration | Loads runtime environment variables from `.env` and `server/.env` into `process.env`. |
| **CORS** (`cors`) | `^2.8.5` | Security Middleware | Cross-Origin Resource Sharing middleware enabling safe communication between frontend and API origins. |
| **Morgan** (`morgan`) | `^1.10.0` | Observability | HTTP request logger in development mode for tracing response codes, method verbs, and execution times. |

---

### 2.3 AI & Cloud Integration Vendors

| Service / Provider | Model / API | Implementation Location | Purpose & Capabilities |
| :--- | :--- | :--- | :--- |
| **Google Gemini API** | `gemini-1.5-flash` | `server/modules/ai/ai.service.js` | Generative AI assistant providing natural-language book recommendations, semantic catalog searches, and library policy inquiries. |
| **Heuristic Fallback Engine** | Local Node.js Logic | `server/modules/ai/ai.service.js` | Zero-dependency local keyword matcher that provides instant, reliable recommendations if the external API key is absent or offline. |

---

## 3. Role-Based Feature Matrix

The system implements strict **Role-Based Access Control (RBAC)** across three distinct user roles:

| Capability / Flow | Visitor / Member (عضو) | Librarian (أمين المكتبة) | Administrator (مدير النظام) |
| :--- | :---: | :---: | :---: |
| **Browse & Filter Catalog** | ✅ | ✅ | ✅ |
| **Read Book Details & Shelf Locations** | ✅ | ✅ | ✅ |
| **Submit Star Rating & Written Review** | ✅ (Logged in) | ✅ | ✅ |
| **AI Discovery Assistant Drawer** | ✅ | ✅ | ✅ |
| **Place Hold / Join Waitlist Queue** | ✅ | ✅ | ✅ |
| **Self-Service Online Loan Renewal** | ✅ | ❌ (Staff override) | ❌ |
| **View Personal Loans, Fines & Standing** | ✅ | ❌ | ❌ |
| **Quick Circulation Desk (Barcode/Preset)** | ❌ | ✅ | ✅ |
| **Issue New Physical Loan (Checkout)** | ❌ | ✅ | ✅ |
| **Return Physical Item (Checkin + Auto-Fine)** | ❌ | ✅ | ✅ |
| **Manage Bibliographic Titles & Copies** | ❌ | ✅ | ✅ |
| **Notify Waiting Members (48h Window)** | ❌ | ✅ | ✅ |
| **Collect & Settle Financial Fines** | ❌ | ✅ | ✅ |
| **Operational KPI Dashboard & Traffic Chart** | ❌ | ✅ | ✅ |
| **Manage Staff Accounts & Credentials** | ❌ | ❌ | ✅ |
| **Configure System Lending Policies** | ❌ | ❌ | ✅ |
| **Inspect Immutable Audit Log** | ❌ | ❌ | ✅ |

---

## 4. Detailed Feature Breakdown by Domain

### 4.1 Bibliographic Catalog & Physical Inventory
- **Separation of Title and Copy**: A single bibliographic title (e.g., *الذكاء الاصطناعي: مقاربة حديثة*) owns multiple physical book copies (`BC-202-01`, `BC-202-02`), each tracked independently.
- **Item-Level Barcode System**: Every copy has a unique barcode format (`BC-XXX-XX`) and status (`available`, `borrowed`, `reserved`, `maintenance`).
- **Exact Shelf Location Mapping**: Displays precise library shelving metadata (e.g., `جناح التقنية - رف CS-12` / *Tech Wing - Shelf CS-12*).
- **Search & Advanced Filtering**: Live search by Arabic/English title, author, ISBN, or keywords with category pills and availability dropdowns.
- **Copy Availability Meter**: Visual progress bar indicating available versus total physical copies.
- **Interactive Ratings & Reviews**: Score breakdown with overall rating (e.g., 4.8★), 5-to-1 star distribution bars, and reader comments.

---

### 4.2 Circulation Desk & ACID Transaction Engine
- **Pre-Flight Validation**: Automatic real-time verification before issuing a loan:
  1. Member account must be active (not blocked or suspended).
  2. Member must not have exceeded the maximum active loans limit (default: 3 books).
  3. Member must have zero outstanding overdue fines.
  4. Physical copy must be currently available with row-level database locking (`FOR UPDATE`).
- **Atomic Loan Checkout**: Generates a database loan record, flags the copy as `borrowed`, increments active loan counts, and logs an immutable audit event inside a single transaction.
- **Automated Checkin & Overdue Penalty Assessment**:
  - Scanning or entering a barcode automatically locates the active loan.
  - Checks if `NOW() > due_at`.
  - Automatically calculates days overdue and assesses a penalty in Egyptian Pounds (`5.00 EGP / day`).
  - Automatically releases the copy and marks it available (or shifts it to `reserved` if a waitlist exists).
- **Self-Service & Staff Loan Renewals**:
  - Validates that `renewal_count < max_renewals` (default: 2 renewals allowed).
  - Confirms no other member has placed an active hold on the title.
  - Extends due date by standard duration (14 days).

---

### 4.3 Hold Queues & Priority Reservations
- **Dynamic Queue Numbering**: Placing a hold on an unavailable title assigns sequential position numbers (`المرتبة #1`, `المرتبة #2`).
- **Automated Availability Notification**: When an overdue or borrowed copy is returned, the system alerts the first member in queue and initiates a **48-hour pickup window**.
- **Self-Service Cancellation**: Members can cancel holds directly from their personal dashboard.

---

### 4.4 Financial & Overdues Ledger
- **Egyptian Pound Currency Standardization**: All library fines and penalties are officially computed in **EGP (ج.م)**.
- **Overdue Summary Banner**: Displays total uncollected fines across all accounts and pending violation claims.
- **Days Late Counter**: Real-time counter showing overdue days with distinct visual styling.
- **Fine Settlement ("تسوية وتحصيل")**: Staff can collect outstanding cash fines, timestamping the payment and updating member borrowing eligibility.

---

### 4.5 AI Discovery Librarian Drawer
- **Slide-Over Interactive Drawer**: Seamless sliding drawer accessible globally from public and staff views.
- **Bilingual Conversations**: Native support for Arabic and English prompts.
- **Curated Prompt Shortcuts**:
  - *"قصة غموض قصيرة للمبتدئين"* (Mystery fiction for beginners)
  - *"أفضل مراجع الذكاء الاصطناعي"* (Top AI & CS reference books)
  - *"روايات تاريخية عربية"* (Arabic historical literature)
  - *"ما هي سياسة التجديد والإعارة؟"* (Lending & renewal rules inquiry)
- **Direct Catalog Match Cards**: Embeds interactive book recommendation cards into chat bubbles with "View" and "Hold" buttons.
- **Privacy Assurance**: Queries are processed without storing member identities in AI event logs.

---

### 4.6 Member Self-Service Portal (`/my-loans`)
- **Member Overview Card**: Displays membership code (`MEM-2026-XXXX`), join date, and membership status badge.
- **Borrowing Limit Progress Gauge**: Interactive bar indicating quota utilization (e.g., 2 of 3 allowed books).
- **Financial Clean Record Indicator**: Confirms `0.00 EGP` clean standing or highlights required settlements.
- **Countdown Due Date Tags**: Live countdown tags (e.g., `متبقي 8 أيام` or `متبقي يومان`).
- **One-Click Renewal Button**: Extends active loans with instant feedback.

---

### 4.7 Administrative Governance & Auditing (`/admin`)
- **Staff Accounts Management**: Creation, credential provisioning, and role assignment for library team members.
- **System Policies Engine**: Admin configuration panel adjusting live rules without server restarts:
  - `max_borrow_limit`: Maximum concurrent books.
  - `default_loan_days`: Standard loan period.
  - `max_renewals`: Maximum allowable renewals.
  - `fine_per_day`: Overdue fee per day in EGP.
  - `reservation_expiry_hours`: Hold pickup window.
  - `enable_ai_librarian`: Master switch for AI assistant.
- **Immutable Audit Log**: Chronological record logging actor ID, staff role, action type, entity type/ID, and timestamp.

---

## 5. Design System & Tokens (Figma Inspired)

The system adheres to an institutional, high-trust academic design system with custom CSS variables:

### 5.1 Color Palette & Semantic Tokens

| Token Role | CSS Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | `--primary` | `#1E3A5F` (Oxford Navy) | `#3B82F6` (Electric Blue) | Navbars, headers, primary buttons, active tabs |
| **Primary Hover** | `--primary-hover`| `#0F2744` | `#2563EB` | Button hover and pressed states |
| **Primary Subtle**| `--primary-subtle`| `#EDF4FA` | `rgba(59,130,246,0.15)` | Selected rows, avatar backdrops, chip badges |
| **AI Accent** | `--ai` | `#1D4ED8` (Royal Blue) | `#60A5FA` | AI assistant buttons, AI banner, AI badges |
| **AI Surface** | `--ai-surface` | `#EFF6FF` | `rgba(30,58,138,0.28)` | AI drawer header, prompt suggestion pills |
| **Available** | `--available` | `#0284C7` | `#38BDF8` | In-stock book copies, active member status |
| **Borrowed** | `--borrowed` | `#1E40AF` | `#60A5FA` | Active circulation loans |
| **Reserved** | `--reserved` | `#4338CA` | `#818CF8` | Hold queue items, due-soon countdowns |
| **Danger / Fine**| `--danger` | `#B91C1C` | `#F87171` | Overdue loans, unpaid penalties, delete actions |
| **Page Base** | `--page` | `#FCFCFA` (Warm Paper) | `#0F172A` (Midnight Slate) | Application background |
| **Surface** | `--surface` | `#FFFFFF` | `#1E293B` | Cards, panels, modals, dropdowns |
| **Sidebar** | `--sidebar` | `#152033` (Deep Navy) | `#0D1525` | Always-dark staff floating sidebar |

---

## 6. REST API Endpoints Specification

All endpoints return a standardized JSON envelope:
```json
{
  "data": null,
  "error": null,
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

### 6.1 Authentication (`/api/v1/auth`)
- `POST /login`: Authenticates user credentials, returns JWT token and user profile.
- `POST /register`: Registers new member account.
- `POST /logout`: Invalidates client session.
- `GET  /me`: Returns profile of the currently authenticated bearer.

### 6.2 Catalog (`/api/v1/books`)
- `GET    /`: Search and list books with pagination, categories, and availability filters.
- `GET    /categories`: Returns list of all book categories.
- `GET    /authors`: Returns list of all registered authors.
- `GET    /:id`: Returns full bibliographic record with copies list and reviews.
- `GET    /:id/ratings`: Returns reviews and rating breakdown for title.
- `POST   /:id/ratings`: Submits star rating (1-5) and written reader review.
- `POST   /`: *(Staff)* Creates new title record and issues physical copies.
- `PUT    /:id`: *(Staff)* Updates title bibliographic information.
- `DELETE /:id`: *(Admin)* Deletes title record.

### 6.3 Circulation (`/api/v1/circulation` & `/api/v1`)
- `GET  /loans`: *(Staff)* Lists all circulating loans with filters (`status`, `memberId`).
- `POST /loans`: *(Staff)* Issues a new physical copy loan within an ACID transaction.
- `POST /loans/:id/return`: *(Staff)* Checks in returned copy and auto-assesses overdue fines.
- `POST /loans/:id/renew`: Renews loan duration after policy checks.
- `GET  /reservations`: Lists hold queues and active reservations.
- `POST /reservations`: Registers a new reservation queue entry.
- `POST /reservations/:id/cancel`: Cancels reservation.
- `GET  /fines`: Lists financial penalties and overdue claims.
- `POST /fines/:id/settle`: *(Staff)* Collects and settles fine in EGP.

### 6.4 AI Assistant (`/api/v1/ai`)
- `POST /assistant`: Accepts conversational prompts, evaluates library catalog state, and returns contextual recommendations.

### 6.5 Members (`/api/v1/members`)
- `GET /me/loans`: Lists active and past loans for authenticated member.
- `GET /me/reservations`: Lists active reservations for authenticated member.
- `GET /me/fines`: Lists fines assessed to authenticated member.
- `GET /`: *(Staff)* Search and list member profiles.
- `GET /:id`: *(Staff)* Retrieve member record with loan standing.

### 6.6 Administration (`/api/v1/admin`)
- `GET  /staff`: Lists library staff accounts and permission levels.
- `POST /staff`: Provisions new staff account.
- `PUT  /staff/:id/status`: Toggles staff account active/suspended state.
- `GET  /policies`: Retrieves current system policies.
- `PUT  /policies`: Updates system lending rules and fee values.
- `GET  /audit-logs`: Retrieves immutable audit trail with action filtering.

---

## 7. Relational Database Schema Architecture

The MySQL database schema is normalized and indexed for high concurrency and referential integrity:

1. **`users`**: Base credentials table (`id`, `full_name`, `email`, `password_hash`, `role`, `status`).
2. **`members`**: Member profile table linked 1:1 with `users` (`member_code`, `membership_status`, `max_allowed_loans`).
3. **`books`**: Master bibliographic records (`isbn`, `title`, `publication_year`, `language`, `cover_url`, `rating`, `ratings_count`).
4. **`authors` & `book_authors`**: Many-to-many author attribution tables.
5. **`categories` & `book_categories`**: Many-to-many taxonomy tables.
6. **`book_copies`**: Physical printed inventory (`barcode`, `shelf_location`, `status`, foreign key to `books`).
7. **`loans`**: Lending transactions (`copy_id`, `member_id`, `issued_at`, `due_at`, `returned_at`, `renewal_count`, `status`).
8. **`reservations`**: Hold queues with priority ordering (`book_id`, `member_id`, `queue_position`, `status`, `expires_at`).
9. **`fines`**: Financial ledger entries (`loan_id`, `amount`, `currency` = 'EGP', `status`, `settled_at`).
10. **`book_ratings`**: Reader reviews and ratings (`book_id`, `user_id`, `rating`, `review`, `created_at`).
11. **`policies`**: Key-value system operational configuration table.
12. **`audit_logs`**: Immutable security and compliance event journal.
13. **`ai_usage_events`**: Privacy-preserving AI assistant latency and performance metric log.

---

## 8. Development & Orchestration Workflow

- **Auto-Starting Backend**: `vite.config.js` includes the custom `autoBackendPlugin`, probing port `5001`. If offline, Vite spawns `node server/index.js` automatically.
- **Single Command Launch**: Running `npm run dev` boots the full system with live reverse proxying.
- **Deterministic Port Bindings**:
  - Vite Frontend: `http://localhost:5173/`
  - Express API: `http://localhost:5001/`
  - MySQL Server: `127.0.0.1:3306`
- **Seeded Demo Accounts**:
  - **Admin**: `admin@library.sa` / `admin123`
  - **Librarian**: `sulaiman@library.sa` / `librarian123`
  - **Member**: `sara@library.sa` / `member123`

