Date: 2026-01-23
Branch: main
Commit: 2b9786a7bec3b0f541b34947e1059c60347aa287
ACTIVE PHASE: Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes

Docs created/updated:
- docs/PHASES.md
- docs/PRD.md
- docs/ARCHITECTURE.md
- docs/API_CONTRACT.md
- docs/FRONTEND_CONTRACT.md

Key decisions:
- JWT flow uses POST /api/token/ and /api/token/refresh/ with email+password.
- Token storage: access in memory; refresh in localStorage key auth.refreshToken.
- RBAC derives roles from profiles: Admin (is_superuser/is_staff), Manager (Staff), Resident (Resident).

Assumptions/open questions:
- /api/me and /api/health will be implemented in Phase 0 as documented.
- SimpleJWT refresh rotation + blacklist implies adding token blacklist app if required.
- Confirm whether dj-rest-auth endpoints will be wired or remain unused.
