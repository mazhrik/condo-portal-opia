# Product Requirements Document (PRD)

## Overview
This PRD defines the source-of-truth requirements for a phased rollout. Only the ACTIVE PHASE may be implemented. Every feature is mapped to a phase.

## Goals
- Secure JWT authentication with a clear RBAC model.
- Incremental delivery with explicit API and frontend contracts.
- Phase-by-phase acceptance criteria with measurable exit criteria.

## Non-Goals
- Implementing any FUTURE PHASE items before activation.
- Cross-phase feature creep.

## Roles and RBAC Baseline (Phase 0)
Roles are derived from Django User + profile relationships:
- Admin: `is_superuser` or `is_staff` with elevated privileges.
- Property Manager: user with a `Staff` profile.
- Resident: user with a `Resident` profile.

Permission matrix (minimum baseline):
- Auth: all roles can login/refresh/logout.
- /api/me: all authenticated users.
- Announcements: read (all roles), write (Admin/Manager only).
- Maintenance: residents read/create own, staff/admin read all and update.
- Directory: admin/manager only (resident visibility controlled in Phase 3).

---

# Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes (ACTIVE)
## Goals
- Confirm JWT settings and endpoints used by the SPA.
- Standardize the auth flow and error handling.
- Establish /api/me and /api/health.
- Implement protected routes in the frontend.

## User Stories and Acceptance Criteria
1. As a user, I can log in with email and password.
   - AC1: POST /api/token/ returns access and refresh tokens.
   - AC2: Response includes user_id, email, first_name, last_name, is_staff, is_superuser.
2. As a user, I can refresh my session.
   - AC1: POST /api/token/refresh/ returns a new access token.
   - AC2: Invalid refresh returns 401 with the standard error shape.
3. As a user, I can log out.
   - AC1: Frontend clears tokens and user state.
   - AC2: Protected routes redirect to login after logout.
4. As a user, I can load my profile and role via /api/me.
   - AC1: Returns user + role + profile data.
   - AC2: Unauthorized requests return 401.
5. As an operator, I can check service health.
   - AC1: GET /api/health returns { status: "ok" } with 200.

---

# Phase 1 — Announcements + Dashboard
## Goals
- Deliver announcements and a lightweight dashboard.

## User Stories and Acceptance Criteria
1. As a resident, I can view active announcements.
   - AC1: List returns only active announcements by default.
   - AC2: Detail returns full content and metadata.
2. As an admin/manager, I can manage announcements.
   - AC1: Create/update/deactivate is RBAC-gated.

---

# Phase 2 — Maintenance Requests
## Goals
- Enable maintenance request lifecycle.

## User Stories and Acceptance Criteria
1. As a resident, I can create and view my requests.
   - AC1: Requests are tied to my resident profile.
   - AC2: I cannot view requests from other residents.
2. As a staff/admin, I can update status and assignments.
   - AC1: Status transitions are validated.

---

# Phase 3 — Buildings/Units/Resident Directory
## Goals
- Implement buildings/units inventory and directory.

## User Stories and Acceptance Criteria
1. As an admin/manager, I can CRUD buildings/units.
   - AC1: Only admin/manager can create or edit.
2. As a resident, I can view directory entries permitted by policy.
   - AC1: Sensitive fields are hidden for residents.

---

# Phase 4 — Enhancements
- FUTURE PHASE — DO NOT IMPLEMENT
