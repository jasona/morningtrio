# MorningTrio - Daily Task Tracker

A minimalist PWA for daily task management, focused on prioritizing your top 3 must-do tasks each day.

## Features

- **Morning Planning Ritual**: Start each day with a guided planning flow
  - Review and carry over incomplete tasks from yesterday
  - Select your top 3 priorities for the day
  - Motivational confirmation to kick off your day

- **Task Management**
  - Quick task capture with Enter-to-submit
  - Drag-and-drop reordering within and between sections
  - "Must Do Today" (max 3) and "Other Tasks" sections
  - Task completion with checkbox toggle
  - Delete tasks with confirmation dialog

- **Celebration & Motivation**
  - Confetti celebration when all 3 must-do tasks are complete
  - Clear completed tasks with one click

- **Offline-First PWA**
  - Works offline with service worker caching
  - Installable on mobile and desktop
  - Data persists in IndexedDB (via Dexie.js)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with custom warm color palette
- **Components**: shadcn/ui (customized)
- **Database**: Dexie.js (IndexedDB wrapper)
- **Drag & Drop**: @dnd-kit
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jasona/morningtrio.git
cd morningtrio

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (static export) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |

## Build & Deployment

This app is configured for static export:

```bash
# Build the app
npm run build

# Output is in the `out/` directory
# Deploy to any static hosting (Netlify, Vercel, GitHub Pages, etc.)
```

## Project Structure

```
morningtrio/
├── public/
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── src/
│   ├── app/
│   │   ├── globals.css  # Tailwind + custom animations
│   │   ├── layout.tsx   # Root layout with PWA metadata
│   │   └── page.tsx     # Main app page
│   ├── components/
│   │   ├── ui/          # shadcn/ui components
│   │   ├── TaskItem.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskInput.tsx
│   │   ├── MorningPlanning.tsx
│   │   └── CelebrationModal.tsx
│   ├── hooks/
│   │   ├── useTasks.ts      # Task CRUD operations
│   │   └── useAppState.ts   # App state management
│   ├── lib/
│   │   ├── db.ts        # Dexie database setup
│   │   └── utils.ts     # Utility functions
│   └── types/
│       └── task.ts      # TypeScript interfaces
└── package.json
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/components/TaskItem.test.tsx
```

## License

MIT
