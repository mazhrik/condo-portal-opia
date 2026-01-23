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
