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

## Cara Instalasi dan Menjalankan Proyek

### Prerequisites
- Node.js versi 18 atau lebih tinggi
- npm atau yarn sebagai package manager

### Langkah Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd forumku-app
```

2. Install dependencies
```bash
npm install
```

3. Buat file environment
```bash
cp .env.example .env
```

4. Edit file `.env` dengan konfigurasi yang sesuai
```env
VITE_API_BASE_URL=
VITE_API_TIMEOUT=
```

5. Jalankan development server
```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173` (atau port lain yang ditampilkan di terminal).

### Build untuk Production
```bash
npm run build
```

Build akan tersimpan di folder `dist/`.

### Preview Production Build
```bash
npm run preview
```

---

## Struktur Folder

```
forumku-app/
├── public/                    # Static assets
├── src/
│   ├── components/            # Shared components
│   │   ├── auth/            # Auth-related components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── PageLayout.jsx
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Textarea.jsx
│   │       ├── Avatar.jsx
│   │       ├── Badge.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Skeleton.jsx
│   │       ├── Spinner.jsx
│   │       ├── VoteButton.jsx
│   │       ├── VoteGroup.jsx
│   │       ├── DropdownMenu.jsx
│   │       ├── CategoryBadge.jsx
│   │       └── Toast/
│   │           ├── Toast.jsx
│   │           └── ToastProvider.jsx
│   │
│   ├── features/            # Feature-based modules
│   │   ├── auth/           # Authentication feature
│   │   │   ├── authAPI.js
│   │   │   ├── authSlice.js
│   │   │   └── components/
│   │   │       └── LoginForm.jsx
│   │   │
│   │   ├── comments/       # Comments feature
│   │   │   ├── commentsAPI.js
│   │   │   ├── commentsSlice.js
│   │   │   └── components/
│   │   │       ├── CommentCard.jsx
│   │   │       └── CommentSection.jsx
│   │   │
│   │   ├── leaderboard/    # Leaderboard feature
│   │   │   ├── leaderboardAPI.js
│   │   │   ├── leaderboardSlice.js
│   │   │   └── components/
│   │   │       ├── LeaderboardCard.jsx
│   │   │       ├── LeaderboardList.jsx
│   │   │       └── LeaderboardPodium.jsx
│   │   │
│   │   └── threads/        # Threads feature
│   │       ├── threadsAPI.js
│   │       ├── threadsSlice.js
│   │       └── components/
│   │           ├── ThreadCard.jsx
│   │           ├── ThreadList.jsx
│   │           └── CategoryFilter.jsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useRelativeTime.js
│   │   └── useToast.js
│   │
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── CreateThreadPage.jsx
│   │   ├── ThreadDetailPage.jsx
│   │   └── LeaderboardPage.jsx
│   │
│   ├── services/            # API configuration
│   │   ├── api.js          # Base API service
│   │   └── apiEndpoints.js # API endpoint constants
│   │
│   ├── store/               # Redux store
│   │   └── index.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── storageUtils.js # LocalStorage helpers
│   │   └── dateUtils.js    # Date formatting helpers
│   │
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
│
├── .env.example            # Environment template
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Penjelasan Struktur

Setiap feature module mengikuti pola Redux Toolkit:

- `*API.js` - Berisi fungsi-fungsi pemanggilan API
- `*Slice.js` - Berisi Redux slice dengan actions, reducers, dan selectors
- `components/` - Komponen React spesifik untuk feature tersebut

Pendekatan ini memisahkan logika berdasarkan fitur dan membuat kode lebih terorganisir.

---

## Teknologi yang Digunakan

### Frontend Framework
- **React 19** - Library utama untuk membangun UI
- **React Router DOM v6** - Routing dan navigasi

### State Management
- **Redux Toolkit** - State management dengan createAsyncThunk, createSlice, dan createSelector
- **React Redux** - Binding Redux dengan React

### Styling
- **Tailwind CSS v4** - Utility-first CSS framework
- **clsx** - Helper untuk conditional class names

### Build Tools
- **Vite** - Build tool dan development server
- **Vitest** - Testing framework (opsional)

### API & HTTP
- **Fetch API** - Untuk HTTP requests
- **Dicoding Forum API** - Backend API

### Libraries Tambahan
- **Lucide React** - Icon library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting

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

Aplikasi ini dapat di-deploy ke berbagai static hosting services:

- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages

Build production dapat dilakukan dengan:
```bash
npm run build
```

Hasil build di folder `dist/` dapat langsung di-serve sebagai static site.

---

## Lisensi

MIT License
