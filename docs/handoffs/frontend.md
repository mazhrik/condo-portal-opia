## 2026-01-23
- Branch: main @ d9ea911
- Routes/components: /login, /dashboard; AuthProvider, ProtectedRoute, AppShell, useMe hook
- Manual E2E: login success - not run; login fail - not run; protected route redirect - not run; /api/me call - not run
- Blockers: None

## 2026-01-23
- Branch: main @ 00b32a1
- Routes/components: /login, /dashboard; AuthProvider, ProtectedRoute, AppShell, useMe hook; DEV-only auth debug helper
- Manual E2E:
  - Login success (valid creds) - PASS (resident@example.com)
  - Login failure shows correct error state - PASS
  - Protected route redirect when logged out - PASS
  - After login, /api/me call succeeds - PASS
  - Refresh flow works (401 -> refresh -> retry) - PASS (triggered via DEV auth helper)
  - Logout clears auth and redirects - PASS
- Blockers: None

## 2026-01-23
- Phase: 1
- Branch: main @ b9e187f
- Routes/components: /dashboard, /announcements, /announcements/:id; Dashboard summary widgets; Announcements list/detail + role-gated CRUD
- Manual E2E:
  - Dashboard loads (authorized) - PASS
  - Announcement list loads (authorized) - PASS
  - Resident cannot see CRUD UI - PASS
  - Admin/Manager can create/edit/deactivate - PASS
- Blockers: None

## 2026-01-23
- Branch: main @ 5c3e98b
- Manual E2E (Phase 1 explicit evidence):
  - Dashboard widgets render - PASS (active count shows a number; latest list rendered items)
  - Announcements list - PASS
  - Announcement detail page - PASS (title/body render; read-only on detail)
- Notes: Role gating verified (resident read-only, admin controls present on list).

## 2026-01-23
- Phase: 2
- Branch: main @ c25118f
- Routes/components: /maintenance, /maintenance/new, /maintenance/all, /maintenance/:id; Maintenance list/detail/create/admin management UI; maintenance API bindings
- Manual E2E:
  - Resident can create request and see it in list - PASS
  - Resident can open detail - PASS
  - Resident cannot see admin controls - PASS
  - Admin/Manager can view all requests - PASS
  - Admin/Manager can change status (assignment if applicable) - PASS (new -> in_review)
  - Error + empty states render - PASS
- Blockers: None

## 2026-01-27
- Phase: 2
- Branch: main @ 4f380c7
- BUG-002 fix: Manager/Admin now see Manage request card on maintenance detail; resident remains read-only; added MaintenanceDetail role-gating test
- Manual E2E:
  - Manager maintenance detail shows Manage request controls - PASS (preview build)
  - Resident cannot see manage controls - PASS (preview build)
- Notes: Verified preview build (`npm run build` + `npm run preview`) and added Vitest coverage for role gating.
