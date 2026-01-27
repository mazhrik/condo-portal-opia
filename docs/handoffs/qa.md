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

---

Phase 2
Date: 2026-01-26
Branch: main
Commit: 305fef400b7510528588559aa68f96e4759e9325
QA Status: FAIL

Bugs open:
- docs/bugs/BUG-002.md (High)

What was tested:
- API: resident create/list/detail; other resident access blocked; resident update blocked
- API: manager/admin list/detail; filters; status transitions; assignment; completion notes; admin close
- UI: resident create + list + detail; admin/manager list and detail
- Regression sanity: login, dashboard, announcements smoke

Gaps:
- Admin/Manager UI status update + assignment blocked by missing controls (see BUG-002)

Phase 2 exit criteria not met.

---

Phase 2
Date: 2026-01-27
Branch: main
Commit: 30742b437e193a1db2050f19815dfda884b5950d
QA Status: FAIL

Bugs open:
- docs/bugs/BUG-002.md (High, Reopened)

What was tested:
- Tests: core.tests.test_maintenance_requests
- API smoke: resident create + 403 on status update; manager lifecycle transitions + assignment + completion notes; admin close
- UI retest: manager maintenance detail still missing “Manage request” controls; resident cannot see admin controls
- Contract check: status transitions and completion_notes rules per docs/API_CONTRACT.md

Phase 2 exit criteria not met.

---

Phase 2
Date: 2026-01-27
Branch: main
Commit: 30742b437e193a1db2050f19815dfda884b5950d
QA Status: FAIL

Bugs open:
- docs/bugs/BUG-002.md (High, Reopened)

What was tested:
- Retest BUG-002 preview repro: manager opens /maintenance/all -> Manage -> detail
- UI role gating: resident does not see manage controls
- API smoke: resident create + 403 on update; manager lifecycle transitions + assignment + completion notes; admin close
- Frontend unit test: MaintenanceDetail.test.tsx (PASS)

Notes:
- Vitest passes but preview repro still fails to show Manage request controls.

Phase 2 exit criteria not met.
