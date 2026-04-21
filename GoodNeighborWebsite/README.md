# Good Neighbor Website

A modern Next.js app for login and client management, built with TypeScript and Tailwind CSS.

## Features

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- ESLint and Prettier
- Jest and Testing Library
- Azure App Service deployment support

## Project Structure

```text
./
├── src/
│   ├── app/                # Next.js pages, layouts, and API routes
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home route
│   │   ├── login/          # Login page
│   │   ├── clients/        # Clients list and client profile pages
│   │   └── api/            # API route handlers
│   ├── components/         # Shared UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Database, auth, and client helpers
│   ├── styles/             # Global styles
│   └── types/              # Shared TypeScript types
├── public/                 # Static assets
├── .github/                # GitHub workflows and config
├── .env.example            # Example environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Scripts and dependencies
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env.local
```

Update `.env.local` with your database and auth settings.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Route Map

This app only uses the following API routes:

- `src/app/api/auth/login/route.ts` maps to `POST /api/auth/login`
- `src/app/api/auth/me/route.ts` maps to `GET /api/auth/me`
- `src/app/api/auth/logout/route.ts` maps to `POST /api/auth/logout`
- `src/app/api/clients/route.ts` maps to `GET /api/clients`
- `src/app/api/clients/[id]/route.ts` maps to `GET /api/clients/:id`

How the pages use them:

- `src/app/login/page.tsx` calls `POST /api/auth/login`
- `src/app/clients/page.tsx` checks the session with `GET /api/auth/me` and loads the client list with `GET /api/clients`
- `src/app/clients/ClientsPageClient.tsx` calls `GET /api/clients` for search and pagination, and `POST /api/auth/logout` for sign out
- `src/app/clients/[id]/page.tsx` calls `GET /api/clients/:id` for the client profile dashboard

## Deployment

### Azure App Service

This app can run on Azure App Service as a Node.js web app.

1. Create an Azure App Service using a Windows runtime stack with Node.js.
2. Set the startup command to `npm start`.
3. Add these app settings in Azure:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_PORT`
   - `DB_SSL=true`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_API_URL=/api`
   - `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
4. Make sure your MySQL firewall allows Azure outbound traffic.
5. Add your publish profile secret as `AZURE_WEBAPP_PUBLISH_PROFILE`.

### Vercel

```bash
npm install -g vercel
vercel
```

## Notes

- Keep `NEXT_PUBLIC_API_URL=/api` unless you intentionally want a different API host.
- Do not commit real secrets in `.env.local`.

