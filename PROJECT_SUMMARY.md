# Project Summary

A Next.js application with user authentication, profile management, and expense tracking. This document helps new developers understand and run the project.

---

## 1. Overview

- **Purpose:** Web app for user signup/login, profile viewing, and managing expenses (with expense types and sub-types).
- **Framework:** Next.js 16 (App Router), React 19, TypeScript.
- **Database:** PostgreSQL via Prisma ORM.
- **Auth:** JWT stored in httpOnly cookie; login sets the cookie, protected routes expect it.

---

## 2. Tech Stack

| Category    | Technology                    |
|------------|-------------------------------|
| Frontend   | Next.js 16, React 19, Tailwind CSS 4 |
| Backend    | Next.js API Routes (App Router) |
| Database   | PostgreSQL, Prisma            |
| Auth       | JWT (jsonwebtoken), bcrypt    |
| HTTP client| axios                         |
| Notifications | react-hot-toast            |
| Realtime   | Socket.io (present but not wired into app flow) |

---

## 3. Getting Started

### Prerequisites

- Node.js (compatible with Next 16)
- PostgreSQL database
- npm (or yarn/pnpm)

### Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`.
   - Set:
     - `DATABASE_URL` – PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/dbname?schema=public`).
     - `JWT_SECRET` – secret for signing JWTs.
     - `expireIn` – optional; JWT expiry (e.g. `1d`).
     - `NEXT_PUBLIC_API_URL` – optional; defaults to `http://localhost:3000/api` in `next.config.ts`.

3. **Database**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   App runs at **http://localhost:4000** (port 4000, not 3000).

---

## 4. Project Structure

```
my-next-app/
├── prisma/
│   ├── schema.prisma          # Data models
│   └── migrations/            # SQL migrations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # login, register
│   │   │   ├── user/          # profile
│   │   │   ├── expense/       # add-expense
│   │   │   └── admin/         # sub_expense (CRUD for sub-expense types)
│   │   ├── login/, signup/, profile/   # Page routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home
│   │   ├── globals.css
│   │   ├── lib/               # socket.ts (Socket.io helper)
│   │   └── utils/             # jwt.ts (sign JWT)
│   ├── config/
│   │   └── database.ts        # Prisma client + connect/disconnect
│   └── proxy.ts               # JWT middleware logic (not yet wired via middleware.ts)
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env / .env.example
```

---

## 5. Data Models (Prisma)

- **User**  
  `id`, `email` (unique), `name`, `role`, `password` (nullable, hashed), `createdAt`, `updatedAt`, `is_deleted`.

- **Expense**  
  `id`, `expense_type`, `sub_expense_type`, `amount`, `description`, `expense_date`, `createdAt`, `updatedAt`, `is_deleted`.  
  *(No `userId` in schema; expenses are not yet linked to users.)*

- **SubExpenseType**  
  `id`, `expense_type`, `description`, `createdAt`, `updatedAt`, `is_deleted`.  
  Used to define sub-types under an expense type.

---

## 6. Authentication Flow

1. **Register** (`POST /api/auth/register`)  
   Body: `name`, `email`, `password`. Password is hashed with bcrypt; user is created with default role `Admin`. No JWT or cookie set; user is redirected to login.

2. **Login** (`POST /api/auth/login`)  
   Body: `email`, `password`. On success, a JWT is signed (see `src/app/utils/jwt.ts`) and set as an **httpOnly cookie** named `token`. Response also returns user data and token in JSON.

3. **Protected routes**  
   Profile and other protected APIs expect the **decoded JWT** in the `x-user` header (JSON string).  
   `src/proxy.ts` contains the logic: read `token` cookie → verify JWT → set `x-user` and call `NextResponse.next()`. This must be wired in a root **middleware.ts** (e.g. in `src/`) for Next.js to run it; currently there is no `middleware.ts` file.

4. **Profile**  
   `POST /api/user/profile` reads `x-user`, parses it, loads user by `id` from DB, and returns profile data. The profile page must send the cookie (e.g. axios with `withCredentials: true` for same-origin or correct CORS).

---

## 7. API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST   | `/api/auth/register` | No  | Create user (name, email, password). |
| POST   | `/api/auth/login`    | No  | Login; sets httpOnly `token` cookie and returns user + token. |
| POST   | `/api/user/profile` | Yes* | Returns current user profile; expects `x-user` header. |
| POST   | `/api/expense/add-expense` | No** | Create expense (expense_type, sub_expense_type, amount, description, expense_date). |
| POST   | `/api/admin/sub_expense` | No** | Create sub-expense type (type, description). |
| GET    | `/api/admin/sub_expense` | No** | List sub-expense types. |

\* Auth via middleware that sets `x-user` (middleware not yet wired).  
\** No auth checks in route handlers; consider protecting and/or linking to `userId`.

---

## 8. Pages (UI)

| Route     | File | Description |
|-----------|------|-------------|
| `/`       | `app/page.tsx`   | Default Next.js landing (links to Templates, Docs). |
| `/login`  | `app/login/page.tsx`  | Email + password form; POST to `api/auth/login`; redirects to `/profile` on success. |
| `/signup` | `app/signup/page.tsx` | Name, email, password; POST to `api/auth/register`; redirects to `/login` on success. |
| `/profile`| `app/profile/page.tsx`| Loads user via `POST /api/user/profile`; shows name and email. |

---

## 9. Key Files

| File | Role |
|------|------|
| `prisma/schema.prisma` | Data models and DB schema. |
| `src/config/database.ts` | Prisma client; `connectToDatabase` / `disconnectFromDatabase`. |
| `src/app/utils/jwt.ts` | `signJwt(userData)` for issuing JWTs. |
| `src/proxy.ts` | JWT verification from cookie and setting `x-user`; intended for middleware. |
| `src/app/api/auth/login/route.ts` | Login handler; sets `token` cookie. |
| `src/app/api/user/profile/route.ts` | Profile handler; uses `x-user` header. |
| `next.config.ts` | Next config; sets `NEXT_PUBLIC_API_URL` default. |

---

## 10. Scripts (package.json)

- `npm run dev` – Dev server on port **4000**.
- `npm run build` – Production build.
- `npm run start` – Start production server.
- `npm run lint` – Run ESLint.

---

## 11. Notes for Developers

- **Port:** Dev server uses **4000**, not 3000.
- **Middleware:** `proxy.ts` is not used until you add a root `middleware.ts` that imports and invokes it for the desired paths.
- **Profile + cookies:** If profile fails with “Token not found”, ensure requests to `/api/user/profile` send the cookie (e.g. `withCredentials: true` in axios).
- **Expenses:** Expense creation does not require auth and does not store a `userId`; consider adding auth and a user–expense relation.
- **Socket.io:** Present in `src/app/lib/socket.ts` but not integrated into the app or API routes.
- **Typos:** Login API returns "Passwrod" in one message; admin sub_expense POST returns `success: false` in body while message says "Added Successfully"—worth fixing for consistency.

---

## 12. Quick Test Flow

1. Start app and DB, then open http://localhost:4000.
2. Go to `/signup`, create a user.
3. Go to `/login`, sign in; you should be redirected to `/profile`.
4. Confirm profile shows name and email (and that cookie is sent if you use a separate API client).

This file is the main entry point for understanding the project. For deeper details, read the source files listed in **Section 9** and the API handlers under `src/app/api/`.
