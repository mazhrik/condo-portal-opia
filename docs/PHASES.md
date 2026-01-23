# Condo Portal Rollout Phases

> ACTIVE PHASE: Phase 1 — Announcements + Dashboard

## Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes (COMPLETE)
Objective
- Lock the authentication contract and role model so Frontend and Backend can implement without ambiguity.

Completed Scope
- JWT auth flow standardized (login/refresh/logout).
- /api/me and /api/health contracts defined.
- RBAC baseline defined (Admin, Property Manager, Resident).
- Frontend protected routes and auth guard behavior defined.

Exit Criteria
- Met and approved.

## Phase 1 — Announcements + Dashboard (ACTIVE)
Objective
- Deliver announcements and a lightweight dashboard summary for residents and staff.

Included
- Announcements CRUD (role-gated).
- Announcements list/detail views for residents.
- Dashboard summary endpoint and UI widgets.

Excluded
- Maintenance requests, directory, buildings/units.
- File uploads, notifications, payments, audit logs (FUTURE PHASE — DO NOT IMPLEMENT).

Exit Criteria
- Residents can read active announcements.
- Admin/Manager can create/update/deactivate announcements.
- Dashboard widgets render using summary endpoint.

## Phase 2 — Maintenance Requests
Objective
- Enable maintenance request lifecycle for residents and staff.

Included
- Resident create/view own requests.
- Staff/Admin update status, assign, add completion notes.

Excluded
- Directory and buildings/units.

Exit Criteria
- Status transitions are enforced and role-gated.

## Phase 3 — Buildings/Units/Resident Directory
Objective
- Provide authoritative building/unit inventory and resident directory views.

Included
- Buildings and Units entities with CRUD (Admin/Manager only).
- Resident directory with role-gated visibility.

Excluded
- Payments/Uploads/Notifications.

Exit Criteria
- Directory data is accurate and permissions enforced.

## Phase 4 — Enhancements
Objective
- Expand platform capabilities after core phases are stable.

Included
- FUTURE PHASE — DO NOT IMPLEMENT: File uploads, notifications, payments, audit logs.
- FUTURE PHASE — DO NOT IMPLEMENT: Analytics and advanced integrations.

Exit Criteria
- Defined when Phase 4 is explicitly activated.
