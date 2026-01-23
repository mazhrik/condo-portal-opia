# Condo Portal Rollout Phases

> ACTIVE PHASE: Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes

## Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes (ACTIVE)
Objective
- Lock the authentication contract and role model so Frontend and Backend can implement without ambiguity.

Included
- Verify and document existing SimpleJWT configuration and endpoints.
- Standardize login/refresh/logout flows for SPA.
- Implement /api/me (user + role) as the bootstrap endpoint.
- Implement /api/health for uptime and readiness checks.
- Define RBAC baseline (Admin, Property Manager, Resident).
- Protect frontend routes and centralize auth guard behavior.

Excluded
- Announcements, Maintenance Requests, Directory features.

Exit Criteria
- Login, refresh, and logout flows work end-to-end.
- /api/me returns the correct role and profile data.
- RBAC produces expected 401/403 behavior across protected endpoints.

## Phase 1 — Announcements + Dashboard
Objective
- Deliver announcements with a lightweight dashboard summary.

Included
- Announcements list/detail for residents.
- Admin/Manager create/update/deactivate announcements.
- Dashboard widgets (latest announcements, counts).

Excluded
- Maintenance requests, directory, buildings/units.

Exit Criteria
- Residents can read active announcements.
- Admin/Manager can manage announcements.

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
- FUTURE PHASE — DO NOT IMPLEMENT: Payments, document uploads, notifications, audit logs, analytics.
- FUTURE PHASE — DO NOT IMPLEMENT: Advanced integrations (SMS/email, vendor portals).

Exit Criteria
- Defined when Phase 4 is explicitly activated.
