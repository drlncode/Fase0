# Fase0

A real-time chat application with authentication, friend management, and live messaging.

Built with React 19, TypeScript, and Vite.

## Features

- **Real-time messaging** with optimistic updates, message editing, deletion, replies, read markers, and date-grouped sticky headers
- **Friend system** with send/cancel/accept/reject requests and friend removal
- **Authentication** with email + password sign-up/sign-in, session confirmation flow, and password recovery
- **User profiles** with avatar upload, public profile, and search
- **Live WebSocket sync** for messages, chats, and friend events

## Tech Stack

| | |
|---|---|
| **Framework** | React 19, TypeScript 6, Vite 8 |
| **Routing** | React Router 7 |
| **State** | Zustand 5, React Context |
| **Forms** | React Hook Form 7 + Zod 3 |
| **HTTP** | Axios with Bearer token interceptor |
| **WebSocket** | Socket.IO Client |
| **Styling** | Tailwind CSS 4, tailwind-merge, clsx |
| **Lint** | ESLint 9 with TypeScript, React Hooks, JSX a11y, and Tailwind plugins |

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm

### Installation

```bash
pnpm install
```

### Environment

Copy `.env.example` to `.env` and configure the variables:

```env
VITE_API_URL=https://your-api.com/v1/api
VITE_WS_URL=wss://your-api.com
VITE_API_TIMEOUT=30000
VITE_CHATS_PER_PAGE=10
VITE_FRIENDS_PER_PAGE=20
VITE_MESSAGES_PER_PAGE=30
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## Architecture

```
src/
├── features/         # Domain modules (auth, chats, messages, friends, users, etc.)
│   ├── auth/
│   ├── chats/
│   ├── messages/
│   ├── friends/
│   ├── users/
│   ├── media/
│   └── app/
├── shared/           # Reusable UI components, hooks, utils, and types
│   ├── components/
│   │   ├── ui/       # Generic presentational components
│   │   └── modals/   # Modal system
│   ├── hooks/
│   ├── store/
│   ├── types/
│   └── utils/
└── index.tsx
```

## License

MIT
