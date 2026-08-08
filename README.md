# ForumKu - Interactive Discussion Forum

ForumKu adalah aplikasi forum diskusi interaktif yang dibangun dengan React, Redux, dan Tailwind CSS. Aplikasi ini memungkinkan pengguna untuk berpartisipasi dalam diskusi, membuat thread, memberikan voting, dan melihat leaderboard. Aplikasi ini menggunakan Dicoding Forum API untuk semua operasi backend.

---

## Fitur Utama

### Autentikasi
- Registrasi pengguna baru
- Login dengan email dan password
- Logout dan manajemen sesi
- Proteksi route untuk halaman yang memerlukan autentikasi
- Token autentikasi JWT yang disimpan secara lokal

### Threads (Diskusi)
- Melihat daftar thread dengan pagination
- Melihat detail thread lengkap dengan komentar
- Membuat thread baru dengan judul, konten, dan kategori
- Menghapus thread yang dibuat sendiri
- Filter thread berdasarkan kategori
- Pencarian thread berdasarkan judul dan konten
- Vote up/down pada thread
- Toggle vote (klik lagi untuk menghilangkan vote)

### Komentar
- Melihat komentar pada setiap thread
- Menambahkan komentar baru
- Reply/membalas komentar
- Vote up/down pada komentar
- Toggle vote pada komentar
- Timestamp relatif (misal: "2 jam lalu")

### Voting System
- Upvote dan downvote pada threads dan komentar
- Sistem toggle: klik vote yang sama untuk menghilangkan vote
- Optimistic update dengan rollback jika gagal
- Vote state persisten setelah refresh (berdasarkan API response)
- Indikator visual untuk vote aktif

### Leaderboard
- Menampilkan peringkat pengguna
- Top 3 podium display
- Ranking lengkap dengan skor dan statistik
- Peringkat pengguna saat ini (jika login)

### Kategori
- Filter thread berdasarkan kategori dinamis
- Kategori diambil dari data thread yang ada
- Input kategori kustom saat membuat thread
- Tidak ada kategori default (hanya dari data)

### UI/UX
- Desain modern dan responsif dengan Tailwind CSS
- Dark mode support
- Skeleton loading states untuk loading yang lebih baik
- Toast notifications untuk feedback
- Navigasi mobile-friendly
- Animasi transisi yang halus
- Empty states untuk data yang kosong

---

## Testing

Proyek ini memiliki comprehensive testing setup dengan **118 total tests**.

### Unit Tests (Vitest)
```bash
# Run all unit tests
npm run test:run

# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)
```bash
# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui

# Run E2E tests in debug mode
npm run e2e:debug
```

### Storybook
```bash
# Start Storybook dev server (port 6006)
npm run storybook

# Build static Storybook
npm run build-storybook
```

### Test Coverage

| Category | Tests | Files |
|----------|-------|-------|
| Reducer Tests | 39 | `threadsSlice.test.js`, `authSlice.test.js` |
| Thunk Tests | 23 | `threadsThunk.test.js`, `authThunk.test.js` |
| Component Tests | 42 | `Button.test.jsx`, `LoginForm.test.jsx` |
| E2E Tests | 14 | `login.spec.js` |
| **TOTAL** | **118** | **9 files** |

---

## CI/CD

Proyek ini menggunakan GitHub Actions untuk CI/CD dengan pipeline berikut:

### Workflow Jobs

1. **Lint** - ESLint code quality checks
2. **Test** - Vitest unit & component tests
3. **E2E** - Playwright E2E tests
4. **Build** - Production build verification

### Branch Protection

Branch `main` dilindungi dengan:
- ✅ Require pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### Deployment

Aplikasi di-deploy otomatis ke Vercel pada setiap merge ke branch `main`.

**Live Demo**: https://forumku-app.vercel.app/

---

## Cara Instalasi dan Menjalankan Proyek

### Prerequisites
- Node.js versi 18 atau lebih tinggi
- npm atau yarn sebagai package manager

### Langkah Instalasi

1. Clone repository
```bash
git clone https://github.com/sefriadiahmad/forumku-app.git
cd forumku-app
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173`

### Setup untuk Development

```bash
# Copy environment file
cp .env.example .env

# Edit .env dengan konfigurasi yang sesuai
VITE_API_BASE_URL=VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000
```

### Build untuk Production
```bash
npm run build
```

Build akan tersimpan di folder `dist/`.

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

## Struktur Folder

```
forumku-app/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── .storybook/
│   ├── main.js                 # Storybook configuration
│   └── preview.jsx             # Storybook preview config
├── e2e/
│   └── login.spec.js           # E2E login tests (Playwright)
├── public/
│   └── assets/                 # Static assets (logos, icons)
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageLayout.jsx
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── VoteButton.jsx
│   │   │   ├── DropdownMenu.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── index.js
│   │   │   ├── stories/              # Storybook stories
│   │   │   │   ├── Button.stories.jsx
│   │   │   │   ├── Input.stories.jsx
│   │   │   │   ├── Avatar.stories.jsx
│   │   │   │   └── Spinner.stories.jsx
│   │   │   └── tests/               # Component tests
│   │   │       ├── Button.test.jsx
│   │   │       └── LoginForm.test.jsx
│   │   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authAPI.js
│   │   │   ├── authSlice.js
│   │   │   ├── authSlice.test.js     # Reducer tests
│   │   │   ├── authThunk.test.js     # Thunk tests
│   │   │   └── components/
│   │   │       └── LoginForm.jsx
│   │   │
│   │   ├── comments/
│   │   │   ├── commentsAPI.js
│   │   │   ├── commentsSlice.js
│   │   │   └── components/
│   │   │       ├── CommentCard.jsx
│   │   │       └── CommentSection.jsx
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── leaderboardAPI.js
│   │   │   ├── leaderboardSlice.js
│   │   │   └── components/
│   │   │       ├── LeaderboardCard.jsx
│   │   │       ├── LeaderboardList.jsx
│   │   │       └── LeaderboardPodium.jsx
│   │   │
│   │   └── threads/
│   │       ├── threadsAPI.js
│   │       ├── threadsSlice.js
│   │       ├── threadsSlice.test.js   # Reducer tests
│   │       ├── threadsThunk.test.js   # Thunk tests
│   │       └── components/
│   │           ├── ThreadCard.jsx
│   │           ├── ThreadList.jsx
│   │           └── CategoryFilter.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useRelativeTime.js
│   │   └── useToast.js
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CreateThreadPage.jsx
│   │   ├── ThreadDetailPage.jsx
│   │   └── LeaderboardPage.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── apiEndpoints.js
│   │
│   ├── store/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── storageUtils.js
│   │   └── dateUtils.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── setupTests.js           # Test setup (jest-dom)
│
├── vitest.config.js            # Vitest configuration
├── playwright.config.js       # Playwright configuration
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Teknologi yang Digunakan

### Frontend Framework
- **React 19** - Library utama untuk membangun UI
- **React Router DOM v7** - Routing dan navigasi

### State Management
- **Redux Toolkit** - State management dengan createAsyncThunk, createSlice, dan createSelector
- **React Redux** - Binding Redux dengan React

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **clsx** - Helper untuk conditional class names

### Build Tools
- **Vite** - Build tool dan development server

### Testing
- **Vitest** - Unit & component testing framework
- **Playwright** - E2E testing framework
- **Storybook** - Component documentation & development
- **@testing-library/react** - React component testing
- **@testing-library/jest-dom** - Jest DOM matchers
- **@testing-library/user-event** - User interaction simulation

### API & HTTP
- **Fetch API** - Untuk HTTP requests
- **Dicoding Forum API** - Backend API

### Libraries Tambahan
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **date-fns** - Date formatting

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting

### CI/CD
- **GitHub Actions** - Continuous integration & deployment
- **Vercel** - Cloud deployment platform

---

## Konsep Penting

### Feature-Sliced Architecture
Proyek ini menggunakan pendekatan feature-based organization di mana setiap fitur (auth, threads, comments, leaderboard) memiliki struktur internalnya sendiri dengan API, Slice, dan Components.

### Optimistic Updates
Fitur voting menggunakan optimistic updates untuk respons yang cepat. State diperbarui segera di frontend, kemudian sinkronisasi dengan API. Jika API gagal, state akan di-rollback.

### Memoized Selectors
Redux selectors menggunakan `createSelector` untuk memoization, mencegah re-render yang tidak perlu dan meningkatkan performa.

### Dynamic Categories
Kategori tidak hardcoded, melainkan diambil secara dinamis dari data thread yang ada di API. Ini membuat sistem lebih fleksibel dan self-organizing.

### Persistent Vote State
Vote state user persisten setelah refresh karena setiap fetch thread/comment mengevaluasi apakah user ID ada di array `upVotesBy` atau `downVotesBy`.

---

## Deployment

Aplikasi di-deploy otomatis ke **Vercel** pada setiap push ke branch `main`.

**Live Demo**: https://forumku-app.vercel.app/

### Manual Deployment

```bash
# Build production
npm run build

# Deploy dist/ folder to Vercel
vercel --prod
```

---

## Lisensi

MIT License
