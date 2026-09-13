# Student Voice — Frontend

React + TypeScript frontend for the Student Voice complaint portal. Guides a student through email verification and lets them submit a concern that's routed directly to the Principal.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Project Structure

```
src/
  pages/
    Home.tsx           # Email entry, requests OTP
    Verify.tsx          # OTP verification, issues session token
    ComplainPage.tsx     # Category, subject, concern submission
  App.tsx               # Route definitions (/, /verify, /complain)
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend API URL

Create a `.env` file in the frontend root:

```
VITE_API_URL=http://localhost:8000
```

Update this to your deployed backend URL when going to production.

### 3. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### 4. Build for production

```bash
npm run build
```

Outputs a static build to `dist/`, ready to deploy on Vercel, Netlify, or similar.

## App Flow

1. **Home (`/`)** — student enters their `@krce.ac.in` email; validated client-side and server-side. On success, email is stored in `sessionStorage` and the student is routed to `/verify`.
2. **Verify (`/verify`)** — student enters the 6-digit OTP sent to their email. On success, a session token is stored in `sessionStorage` and the student is routed to `/complain`.
3. **Complain (`/complain`)** — student selects a category, enters a subject and concern, and submits. The session token is sent as an `X-Session-Token` header and is consumed (single-use) on successful submission.

Both `/verify` and `/complain` redirect back to `/` if the required `sessionStorage` values are missing — this prevents skipping the verification flow by navigating directly to a URL.

## Design Notes

- No student identity is attached to the submitted complaint — the OTP step only proves domain ownership.
- `sessionStorage` (not `localStorage`) is used intentionally, so verification state doesn't persist beyond the browser tab/session.
- All API calls use `VITE_API_URL` so the same code works in both local development and production without edits.

## Known Limitations

- No "Resend OTP" option yet if the first email doesn't arrive.
- No client-side cooldown to prevent rapid repeated OTP requests.
