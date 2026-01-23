# Handoffs

## work
- Routes/components completed: `/login`, protected `/` dashboard, `AppShell`, `ProtectedRoute`, `AuthProvider`.
- How to run frontend: `npm install` then `npm run dev` (uses Vite default).
- Blockers/assumptions: Phase and contract docs referenced in prompt were not found in repo; implemented Phase 0 based on prompt requirements only. Backend `/api/token/` and `/api/token/refresh/` endpoints are assumed to exist.

## work (follow-up)
- Routes/components completed: `/login`, protected `/` dashboard, `AppShell`, `ProtectedRoute`, `AuthProvider` (login now posts `username` per backend token endpoint).
- How to run frontend: `npm install` then `npm run dev` (uses Vite default).
- Blockers/assumptions: Phase/contract docs referenced in prompt were not found in repo; aligned login payload with backend `core` token endpoint using `username` + `password`.

## work (dependency fix)
- Routes/components completed: unchanged from prior handoff.
- How to run frontend: `npm install` then `npm run dev` (uses Vite default).
- Blockers/assumptions: Resolved npm peer dependency conflict by aligning `date-fns` to v3 for `react-day-picker`.
