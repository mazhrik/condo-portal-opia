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

# Phase 2 — Maintenance Requests (ACTIVE)
## Goals
- Enable residents to submit and track maintenance requests.
- Enable staff/admins to triage, assign, and resolve requests.

## Non-Goals
- File uploads/photos, notifications, payments, vendor marketplace (FUTURE PHASE — DO NOT IMPLEMENT).
- Resident directory or buildings/units.

## Workflow States
- New → In Review → Assigned → In Progress → Completed → Closed
- Allowed transitions:
  - New → In Review
  - In Review → Assigned
  - Assigned → In Progress
  - In Progress → Completed
  - Completed → Closed
  - Any state → Closed (Admin only)

## Role Permissions
- Resident: create requests, view own requests, add description updates (no status changes).
- Manager/Admin: view all requests, update status, assign staff, add completion notes, close requests.

## User Stories and Acceptance Criteria
1. As a resident, I can create a maintenance request.
   - AC1: POST creates a request tied to my resident profile.
   - AC2: Required fields: title, description, priority.
2. As a resident, I can view my own requests.
   - AC1: List returns only my requests.
   - AC2: Detail shows status, priority, assigned staff (if any), and timestamps.
3. As a manager/admin, I can view and triage all requests.
   - AC1: List returns all requests with filters for status and priority.
   - AC2: I can update status following allowed transitions.
4. As a manager/admin, I can assign staff and complete a request.
   - AC1: Assignment is restricted to staff users.
   - AC2: Completion requires completion_notes.

---

# Phase 1 — Announcements + Dashboard (COMPLETE)
- Completed and approved.

# Phase 0 — JWT Auth Hardening + RBAC + /api/me + Health + Protected Routes (COMPLETE)
- Completed and approved.

# Phase 3 — Buildings/Units/Resident Directory
- Not active.

# Phase 4 — Enhancements
- FUTURE PHASE — DO NOT IMPLEMENT.
