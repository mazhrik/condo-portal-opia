# Product Requirements Document (PRD)

## Overview
This PRD defines the source-of-truth requirements for a phased rollout. Only the ACTIVE PHASE may be implemented.

## Goals
- Incremental delivery with explicit contracts for backend and frontend.
- Clear RBAC enforcement across all endpoints.
- Phase-by-phase acceptance criteria.

## Non-Goals
- Implementing any FUTURE PHASE items before activation.
- Cross-phase feature creep.

## Roles and RBAC Baseline
Roles are derived from Django User + profile relationships:
- Admin: `is_superuser` or `is_staff`.
- Property Manager: user with a `Staff` profile.
- Resident: user with a `Resident` profile.

---

# Phase 1 — Announcements + Dashboard (ACTIVE)
## Goals
- Deliver announcements list/detail with role-gated management.
- Provide a dashboard summary for quick at-a-glance metrics.

## Non-Goals
- File uploads, notifications, payments, audit logs (FUTURE PHASE — DO NOT IMPLEMENT).
- Maintenance requests or directory.

## Roles Involved
- Admin
- Property Manager
- Resident

## User Stories and Acceptance Criteria
1. As a resident, I can view active announcements.
   - AC1: Announcements list returns only active items by default.
   - AC2: Announcement detail returns full content and timestamps.
2. As an admin/manager, I can create and manage announcements.
   - AC1: Create/update/deactivate endpoints are RBAC-gated to Admin/Manager.
   - AC2: Deactivated announcements are hidden from resident list views.
3. As any authenticated user, I can see dashboard summary widgets.
   - AC1: Summary endpoint returns counts and latest announcements.
   - AC2: Data is scoped by role when applicable.

---

# Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes (COMPLETE)
- Completed and approved.

# Phase 2 — Maintenance Requests
- Not active.

# Phase 3 — Buildings/Units/Resident Directory
- Not active.

# Phase 4 — Enhancements
- FUTURE PHASE — DO NOT IMPLEMENT.
