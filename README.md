# ForumKu - Interactive Discussion Forum

A React-based discussion forum application that allows users to engage in discussions, create threads, vote, and view leaderboards. The application utilizes the Dicoding Forum API for all backend operations.

ForumKu is a modern, interactive discussion forum application built with React, Redux, and Tailwind CSS.

## Features

### Core Features
- **Authentication** - Register, login, logout with JWT tokens
- **Threads** - Create, read, update, delete discussion threads
- **Categories** - Filter threads by category
- **Voting** - Upvote/downvote threads and comments with optimistic updates
- **Comments** - Nested comment system with replies
- **Leaderboard** - User rankings with daily/weekly/monthly filters

### UI/UX
- Modern, responsive design with Tailwind CSS v4
- Skeleton loading states
- Toast notifications
- Mobile-friendly navigation
- Smooth animations with CSS transitions

## Tech Stack

- **Frontend**: React 19
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd forumku-app
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── auth/           # Auth components (ProtectedRoute)
│   ├── layout/         # Layout components (Navbar, Footer, PageLayout)
│   └── ui/             # UI components (Button, Input, Card, etc.)
├── features/
│   ├── auth/           # Auth feature (API, Slice, Components)
│   ├── comments/       # Comments feature
│   ├── leaderboard/    # Leaderboard feature
│   └── threads/        # Threads feature
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── store/              # Redux store configuration
├── utils/              # Utility functions
└── App.jsx            # Main app component with routing
```

## Deployment

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Static Hosting

This app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## License

MIT License - see LICENSE file for details
