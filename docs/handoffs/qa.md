Date: 2026-01-23
Branch: main
Commit: 8f5d6d3ea2ac8f0e2445e36dfa5e6ad85803b424
QA Status: FAIL

Bugs:
- docs/bugs/BUG-001.md

What was tested:
- Phase 0 JWT login/refresh error handling + /api/me + /api/health (core/tests/test_auth.py, core/tests/test_health.py)
- Phase 0 RBAC 401/403 behavior on admin-only endpoint (core/tests/test_rbac.py)
- Frontend auth guard, token storage, and logout flow (code review)
