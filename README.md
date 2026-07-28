# SoulHaven

A quiet place to find your people. No judgment. No pressure. Just humans being human together.

## Features

- 🌿 Anonymous soul names — no real names, no signup
- 💬 Real-time healing rooms with Socket.IO
- 📖 Threads & boards for deeper conversations
- 📅 Adult play dates for offline meetups
- ❤️ Crisis resources & hotlines
- 🛡️ Privacy-first — minimal data storage

## Tech Stack

- React 18 + TypeScript
- Vite (frontend build)
- Express + Socket.IO (backend)
- Supabase (PostgreSQL database)
- Zustand (state management)

## Quick Start (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In your project dashboard, go to **Project Settings > API**
3. Copy your **Project URL** and **anon public** key
4. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
5. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 3. Run the frontend

```bash
npm run dev
```

Open `http://localhost:3000`

### 4. Run the backend (in a new terminal)

```bash
npm run server
```

The API runs on `http://localhost:3001`

## Deployment

### Frontend (Static Site)

Build the frontend:
```bash
npm run build
```

Deploy the `dist/` folder to:
- [Render.com](https://render.com) (Static Site)
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

### Backend (Node.js Server)

Deploy `server/` to:
- [Render.com](https://render.com) (Web Service, free tier)
- [Railway](https://railway.app)
- [Fly.io](https://fly.io)

Environment variables needed on the server:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `PORT` (Render sets this automatically)
- `NODE_ENV=production`

## Database Schema

See `supabase-schema.sql` for the full schema including:
- `rooms` — healing room definitions
- `messages` — chat messages (persisted)
- `threads` — discussion threads
- `replies` — thread replies
- `play_dates` — offline meetup listings

## License

Made with care for humans being human.
