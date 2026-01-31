# QA Plan

## Phase 0 — Auth & RBAC (ACTIVE)
### JWT Flow Tests
1. **Login success**
   - POST `/api/token/` with valid credentials returns `access` + `refresh`.
2. **Login failure**
   - Invalid credentials return `401` with error detail.
3. **Refresh success**
   - POST `/api/token/refresh/` with valid refresh returns new access.
4. **Refresh expired/invalid**
   - Invalid refresh returns `401`; frontend clears tokens and redirects to login.

### RBAC Negative Tests
1. **Unauthenticated access**
   - GET protected endpoint (e.g., `/api/announcements/`) returns `401`.
2. **Role-based denial**
   - Resident attempts admin-only endpoint returns `403`.

### Session Handling
- Ensure access token kept in memory only; refresh token stored in localStorage.
- Ensure logout clears tokens and access to protected routes fails.

### Execution Results (Retest 2026-01-23)
JWT Flow Tests
- PASS: Login success — /api/token/ returns access + refresh + user metadata.
- PASS: Login failure — /api/token/ invalid credentials returns 401 with error payload.
- PASS: Refresh success — /api/token/refresh/ returns access only (contract match).
- PASS: Refresh expired/invalid — /api/token/refresh/ with invalid token returns 401 with error payload.

RBAC Negative Tests
- PASS: Unauthenticated access — /api/residents/ returns 401.
- PASS: Role-based denial — resident token to /api/residents/ returns 403.

Session Handling
- PASS: Access token is in-memory only; refresh token stored in localStorage (src/utils/auth.ts).
- PASS: Logout clears tokens and protected routes redirect to /login (src/context/AuthContext.tsx, src/components/ProtectedRoute.tsx).

Additional Phase 0 coverage
- PASS: /api/me returns role and profile payload with valid JWT.
- PASS: /api/health returns { "status": "ok" }.

Evidence
- Tests: `backend_env/bin/python manage.py test core.tests.test_auth core.tests.test_rbac core.tests.test_health`
- Manual API smoke (Django APIClient): login + refresh shape + /api/me + RBAC 401/403.

---

## Phase 1 — Announcements
### Functional Tests
- Resident list shows active announcements only (default `is_active=true`).
- Resident cannot create/update/deactivate announcements (403).
- Resident cannot view inactive announcement detail (hidden).
- Admin/Manager can create announcements.
- Admin/Manager can update announcements.
- Admin/Manager can deactivate/reactivate announcements.
- Admin/Manager can filter inactive announcements (`is_active=false`).
- Dashboard summary returns active count + latest list.
- Dashboard summary count updates after create/deactivate.

### Execution Results (2026-01-23)
API Tests
- PASS: Resident list returns active-only by default.
- PASS: Resident create/update blocked with 403.
- PASS: Resident cannot access inactive announcement detail (404).
- PASS: Admin/Manager can create announcement (201).
- PASS: Admin/Manager can update announcement (200).
- PASS: Admin/Manager can deactivate/reactivate announcement (200).
- PASS: Admin/Manager can filter inactive announcements (200 + inactive results).
- PASS: Dashboard summary shape includes active_count + latest list.
- PASS: Dashboard summary active_count reflects create/deactivate changes.

UI Tests
- PASS: /dashboard loads when logged in.
- PASS: Announcements list renders correctly.
- PASS: Announcement detail page works.
- PASS: Role gating controls (resident read-only, manager controls visible + usable).
- PASS: Loading/empty states smoke via UI flow (dashboard + announcements pages load without blocking errors).

Evidence
- Tests: `backend_env/bin/python manage.py test core.tests.test_announcements_dashboard`
- Manual APIClient smoke: list/detail, RBAC 403/404, create/update/deactivate, inactive filter, dashboard summary.
- UI smoke: Playwright script run against preview build (`npm run build` + `npm run preview`).

---

## Phase 2 — Maintenance Requests
### Functional Tests
- Resident can create a request (required fields validation).
- Resident can list own requests and view own detail.
- Resident cannot view other residents’ requests (403/404 per contract).
- Resident cannot update status or assignment (403).
- Manager/Admin can list all requests (filters/pagination when provided).
- Manager/Admin can view any request detail.
- Manager/Admin can update status following allowed transitions.
- Manager/Admin can assign/unassign staff (assigned_to must be staff).
- Completion requires completion_notes when status set to completed.
- Admin can close from any state.

### Execution Results (2026-01-31 Retest)
API Tests
- PASS: Resident create required-fields validation (400 when missing description/priority).
- PASS: Resident create request (201).
- PASS: Resident list returns own requests only.
- PASS: Resident detail allowed for own request; other resident detail blocked (404).
- PASS: Resident status/assignment update blocked (403).
- PASS: Manager/Admin list all requests (200) and filters work.
- PASS: Manager/Admin detail allowed for any request (200).
- PASS: Status transitions enforced (invalid transition returns 400 invalid_transition).
- PASS: Assignment requires staff (400 on invalid assigned_to).
- PASS: Completion requires notes (400 completion_notes_required; 200 with notes).
- PASS: Admin can close from any state (200 closed).

UI Tests
- PASS: Resident create request form submits and appears in My Requests list.
- PASS: Resident detail page shows status/priority and no admin controls.
- PASS: Admin/Manager All Requests list loads.
- FAIL: Admin/Manager maintenance detail does not show “Manage request” controls and Manage click does not navigate to detail route. See docs/bugs/BUG-002.md.
- PASS: Loading/error/empty states smoke on list pages.

Regression sanity (light)
- PASS: Login works.
- PASS: Dashboard and Announcements load (smoke via UI navigation).

Evidence
- Tests: `backend_env/bin/python manage.py test core.tests.test_maintenance_requests`
- Manual APIClient smoke: resident/manager/admin maintenance flows + transitions
- UI retest: Playwright on preview build (`npm run build` + `npm run preview`) still fails for manager controls (navigation stays on /maintenance/all)
- Frontend test: `npx vitest run src/pages/maintenance/__tests__/MaintenanceDetail.test.tsx` (PASS)

---

## Phase 3 — Buildings/Units/Directory
### Functional Tests
- Admin/Manager can manage buildings/units.
- Residents can view allowed directory fields only.

---

## Phase 4 — Enhancements (FUTURE PHASE — DO NOT IMPLEMENT YET)
- QA plan to be defined when Phase 4 activates.
