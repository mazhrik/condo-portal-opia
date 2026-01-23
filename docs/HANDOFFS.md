# Handoffs (Append-Only)

## 2026-01-23
**Decisions**
- Active phase set to Phase 0: Foundation & Auth Hardening.
- JWT auth endpoints confirmed as `/api/token/` and `/api/token/refresh/`.
- Token storage strategy chosen: access token in memory, refresh token in localStorage.
- `/api/me` endpoint required to return user + role.
- Roles defined: Admin (superuser/staff), Property Manager (Staff profile), Resident (Resident profile).
- dj-rest-auth endpoints are installed but not wired; no implementation until URLs are added.

**Assumptions**
- DRF defaults require JWT auth and authenticated access for API endpoints.
- Pagination will be standardized as limit/offset when Phase 0 work is implemented.

**Ready for BE/FE/QA**
- Backend: implement `/api/me`, RBAC rules, pagination, and ensure auth endpoints match contract.
- Frontend: implement token handling, auth guard, and refresh flow.
- QA: execute Phase 0 JWT + RBAC test plan.
