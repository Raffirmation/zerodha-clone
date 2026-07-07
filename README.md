# Zerodha Clone — with JWT Authentication

A clone of Zerodha's landing site + Kite trading dashboard, now backed by a
real authentication layer using **JSON Web Tokens (JWT)**.

## Architecture

This project has three parts, each run independently:

| App | Port | Description |
|---|---|---|
| `/` (root) | 3000 | Landing page — Home, About, Pricing, **Signup/Login** |
| `/dashboard` | 3001 | Kite-style trading dashboard (protected) |
| `/backend` | 5000 | Express + MongoDB auth API that issues/verifies JWTs |

## How the JWT auth flow works

1. **Signup / Login** (`POST /api/auth/signup`, `/api/auth/login`)
   Passwords are hashed with `bcryptjs` before being stored. On success, the
   backend signs a JWT (`jsonwebtoken`) containing the user's id and sets it
   as an **httpOnly cookie** — this means client-side JavaScript can never
   read the token, which protects it from XSS-based theft. The token is also
   returned in the JSON response for non-browser clients (e.g. Postman).

2. **Staying logged in**
   On every page load, the frontend calls `GET /api/auth/me`. The browser
   automatically attaches the httpOnly cookie, the backend's `protect`
   middleware verifies the JWT signature/expiry, and returns the current
   user — no token handling needed in React state.

3. **Protecting the dashboard**
   The dashboard app wraps its routes in a `RequireAuth` component that calls
   `/api/auth/me` before rendering anything. If the request fails (no valid
   token), the user is redirected to the login page instead of seeing any
   trading data.

4. **Logout** (`POST /api/auth/logout`)
   Clears the cookie server-side by overwriting it with an expired one.

Because both React apps and the backend run on `localhost` in dev, the
cookie (scoped to the host, not the port) is shared across all three ports
automatically. In a real deployment you'd host them on subdomains of the
same root domain (e.g. `app.example.com`, `dashboard.example.com`,
`api.example.com`) and set the cookie's `domain` to `.example.com`.

## Running locally

You need MongoDB running locally (or a free MongoDB Atlas cluster).

```bash
# 1. Backend
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # http://localhost:5000

# 2. Landing page + signup/login
cd ..
npm install
npm start                  # http://localhost:3000

# 3. Dashboard (separate terminal)
cd dashboard
npm install
npm start                  # http://localhost:3001
```

Visit `http://localhost:3000/signup`, create an account, and you'll be
redirected to the dashboard — which will only load your data once the
JWT has been verified.

## Tech stack

- **Frontend:** React 18/19, React Router, Axios, MUI, Chart.js
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT (`jsonwebtoken`), password hashing (`bcryptjs`), httpOnly cookies

## Resume-ready summary

> Built a full-stack trading platform clone (React + Node/Express + MongoDB)
> implementing JWT-based authentication with bcrypt password hashing and
> httpOnly cookie storage; protected a separate dashboard SPA behind an
> auth-verification middleware, preventing unauthenticated access to
> trading data.
