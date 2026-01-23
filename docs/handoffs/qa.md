Date: 2026-01-23
Branch: main
Commit: 00b32a18c698290d308fbfbd4b2c7fa6a905a57a
QA Status: PASS

Bugs open:
- None

What was tested:
- Phase 0 JWT login/refresh + /api/me + /api/health (core.tests.test_auth, core.tests.test_health)
- Phase 0 RBAC 401/403 behavior (core.tests.test_rbac)
- Manual APIClient smoke: login response shape, refresh access-only, /api/me, RBAC 401/403
- Frontend protected routes/auth flow (ProtectedRoute + AuthContext + Login redirect) smoke via code review
