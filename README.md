# Nestiom Chat

Real-time chat web application built as a job interview task. Users can register, log in, and exchange private messages in real time with a rich set of features.

## Features

- **Real-time messaging** — instant delivery via Firebase Realtime Database
- **User presence** — online/offline status with "last seen" timestamps
- **Typing indicators** — see when the other person is typing
- **Read receipts** — sent/read status on messages
- **Unread counts** — badge next to user names for unread conversations
- **Message reactions** — emoji reactions on any message
- **Message editing & deletion** — edit or soft-delete your own messages
- **File attachments** — share images, PDFs, and text files (up to 10 MB)
- **Link previews** — automatic URL detection with preview cards
- **Message search** — search within a conversation with scroll-to-result navigation
- **24h message chart** — per-conversation bar chart showing messages exchanged over the last 24 hours (D3.js)
- **Dark mode** — system-aware theme toggle
- **Mobile responsive** — sidebar/chat panel layout with swipe-to-go-back gesture
- **Browser notifications** — optional desktop notifications for new messages

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3.6 beta (Composition API + `<script setup>`) |
| Build | Vite 8 beta |
| State | Pinia 3 |
| Routing | Vue Router 5 |
| Backend | Firebase 12 (Auth, Realtime Database, Hosting) |
| UI | shadcn-vue (Radix Vue + Tailwind CSS 4) |
| Charts | D3.js 7 |
| Language | TypeScript (strict mode) |
| Linting | oxlint + ESLint |
| Formatting | oxfmt |
| Testing | Vitest + @vue/test-utils |
| Package Manager | Bun |

## Getting Started

### Prerequisites

- Node.js ^20.19.0 or >=22.12.0
- [Bun](https://bun.sh/) package manager
- A Firebase project with Auth and Realtime Database enabled

### Setup

```bash
bun install
```

Create or update `src/firebase.ts` with your Firebase project configuration.

### Development

```bash
bun run dev          # start dev server (localhost:5173)
```

### Build & Deploy

```bash
bun run build        # type-check + production build
bun run preview      # preview production build locally
bunx firebase deploy # deploy to Firebase Hosting
```

### Testing & Linting

```bash
bun run test:unit    # run unit tests
bun run lint         # oxlint + eslint with auto-fix
bun run format       # format src/ with oxfmt
```

## Project Structure

```
src/
├── assets/          # Global CSS (Tailwind, animations)
├── components/
│   ├── chat/        # ChatPanel, MessageList, MessageBubble, MessageInput, etc.
│   ├── charts/      # MessageChart (D3.js), SparkBars
│   ├── ui/          # shadcn-vue primitives (Button, Input, Avatar, etc.)
│   └── users/       # UserList, UserListItem
├── composables/     # Firebase logic (useMessages, useAuth, usePresence, etc.)
├── lib/             # Utilities (linkify, utils)
├── router/          # Vue Router config with auth guards
├── stores/          # Pinia stores (auth, chat)
└── views/           # LandingView, LoginView, RegisterView, ChatView, NotFoundView
```

## Security

- Firebase security rules enforce per-user read/write access on all data paths
- Messages limited to 2,000 characters; files limited to 10 MB
- Hosting configured with `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and restrictive `Permissions-Policy`
- Email validation enforced in security rules

## Architecture

The app follows a clean separation between UI components and Firebase logic:

- **Composables** (`src/composables/`) encapsulate all Firebase interactions — auth, messaging, presence, typing, reactions, read receipts, file uploads, notifications, and search
- **Pinia stores** manage auth state and derived chat state
- **Components** are purely presentational, receiving data via props and emitting events
- **Security rules** (`database.rules.json`) enforce message privacy at the database level — users can only access their own conversations
