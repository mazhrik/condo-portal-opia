# Frontend Contract

## Tech Stack
- React + Vite + TypeScript
- react-router-dom for routing
- axios for HTTP
- @tanstack/react-query for data fetching

## Auth Storage (Phase 0)
- Access token: in-memory only (cleared on refresh).
- Refresh token: localStorage key `auth.refreshToken`.
- User profile cache: react-query key `me`.

## Auth Flow
1. Login form submits to POST /api/token/ with email + password.
2. Store refresh token in localStorage and access token in memory.
3. Fetch /api/me and store in react-query cache.
4. On 401 from protected requests, attempt a single refresh:
   - POST /api/token/refresh/ with refresh token.
   - If successful, retry the original request once.
   - If refresh fails, clear tokens and redirect to /login.

## Protected Routes
- Use a central auth guard component.
- If no access token and no refresh token, redirect to /login.
- If refresh token exists, attempt refresh before rendering.

## Routes (Phase Mapped)
Phase 0
- /login (public)
- /dashboard (protected placeholder)

Phase 1
- /announcements (protected)
- /announcements/:id (protected)

Phase 2
- /maintenance (protected)

Phase 3
- /directory (role-gated)

## Role-aware UI
- Admin/Manager: can access announcement admin actions.
- Resident: read-only announcements.
- Directory page hidden for resident role.

## API Client Expectations
- Base URL: /api
- Authorization header for authenticated calls.
- Standard error handling using the API error shape.

