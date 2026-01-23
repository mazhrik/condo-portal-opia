Phase 0
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

---

Phase 1
Date: 2026-01-23
Branch: main
Commit: 305fef400b7510528588559aa68f96e4759e9325
QA Status: PASS

Bugs open:
- None

What was tested:
- API: resident list/detail active-only, 403 on create/update, inactive detail hidden (404)
- API: admin/manager create/update/deactivate/reactivate, inactive filter
- API: dashboard summary shape (active_count + latest) and updates after create/deactivate
- UI: /dashboard widgets render, /announcements list/detail loads, role-gated controls enforced, manager create/deactivate flow

Evidence:
- Tests: `backend_env/bin/python manage.py test core.tests.test_announcements_dashboard`
- API smoke: local APIClient checks for list/detail, RBAC 403/404, create/update/deactivate, dashboard summary
- UI smoke: Playwright run against preview build (`npm run build` + `npm run preview`)

Test data (local only; passwords set locally):
- resident_phase1_ui@example.com (Resident)
- manager_phase1_ui@example.com (Manager)
- admin_phase1_ui@example.com (Admin)

Phase 1 exit criteria verified.
