# Architecture

## System Overview
- Frontend: React + Vite + TypeScript, react-router-dom, axios, @tanstack/react-query.
- Backend: Django + DRF + SimpleJWT + dj-rest-auth + allauth.
- API base: /api/ (Django)

## Current Auth Configuration (Verified)
- JWT auth enabled via DRF DEFAULT_AUTHENTICATION_CLASSES.
- DEFAULT_PERMISSION_CLASSES = IsAuthenticated (all endpoints require auth unless explicitly overridden).
- SimpleJWT settings: access 60 min, refresh 1 day, rotate refresh tokens, blacklist after rotation.
- Auth endpoints exposed in core urls:
  - POST /api/token/ (CustomTokenObtainPairView)
  - POST /api/token/refresh/
- CustomTokenObtainPairSerializer extends TokenObtainPairSerializer and adds email claim plus user fields in response.

Notes
- Token blacklist app is not currently installed. If refresh rotation + blacklist is required, add rest_framework_simplejwt.token_blacklist and migrate.
- dj-rest-auth and allauth are installed but not currently wired to URLs.

## Data Model (Phase 0 relevant)
- User (Django auth)
- Resident profile (one-to-one User)
- Staff profile (one-to-one User)
- Roles are derived from profiles + is_superuser/is_staff.

## Request Flow
1. SPA calls POST /api/token/ with email + password.
2. Backend returns access + refresh tokens and user identity fields.
3. SPA stores refresh token (durable) and keeps access token in memory.
4. SPA calls /api/me to hydrate profile and role.
5. Access token is attached as Authorization: Bearer <token>.
6. On 401 due to expiry, SPA calls /api/token/refresh/ and retries once.

## RBAC Policy
- Admin: is_superuser or is_staff (full access).
- Property Manager: Staff profile (privileged access, limited by feature).
- Resident: Resident profile (self-only access to resident-scoped resources).

## Observability & Health
- /api/health returns { status: "ok" } for uptime checks.

## Security Decisions (Phase 0)
- Access token lives in memory only.
- Refresh token stored in localStorage (single source of truth for rehydration).
- Logout clears both tokens and invalidates local session.

