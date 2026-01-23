# Product Requirements Document (PRD)

## Overview
This PRD is organized by phase. Each phase is independently releasable, and only the **ACTIVE PHASE** may be implemented.

## Goals
- Provide a secure JWT-authenticated experience with clear role-based access controls.
- Deliver features incrementally with explicit contracts for Backend, Frontend, and QA.
- Ensure each phase has verifiable exit criteria.

## Non-Goals
- Any Phase 4 feature work (uploads, payments, notifications, audit logs, analytics).
- Cross-phase functionality that is not explicitly listed as included.

## Roles & Permissions Matrix (Phase 0 Baseline)
Current data model uses Django `User` plus `Resident` and `Staff` profiles. Roles are defined as:
- **Admin**: Django superuser/staff with elevated privileges.
- **Property Manager**: User with a `Staff` profile.
- **Resident**: User with a `Resident` profile.

| Capability | Admin | Property Manager | Resident |
| --- | --- | --- | --- |
| Log in / Refresh / Logout | ✅ | ✅ | ✅ |
| View `/api/me` | ✅ | ✅ | ✅ |
| Announcements (read) | ✅ | ✅ | ✅ |
| Announcements (create/update/deactivate) | ✅ | ✅ | ❌ |
| Maintenance requests (read all) | ✅ | ✅ | ❌ |
| Maintenance requests (read own) | ✅ | ✅ | ✅ |
| Maintenance requests (create) | ✅ | ✅ | ✅ |
| Resident directory | ✅ | ✅ | ❌ |

> Backend/Frontend must implement permission enforcement matching this matrix during Phase 0 (for auth) and in later phases when features activate.

---

# Phase 0 — Foundation & Auth Hardening (ACTIVE)
### Goals
- Standardize JWT auth endpoints and SPA token handling.
- Provide a canonical `/api/me` endpoint for the frontend.
- Define API conventions for error shapes, pagination, and filtering.

### Non-Goals
- Implement Phase 1–4 features.

### User Stories & Acceptance Criteria
1. **As a user, I can log in via JWT and receive access + refresh tokens.**
   - **AC1:** POST `/api/token/` with email + password returns `access` and `refresh` tokens.
   - **AC2:** JWT `access` token contains `email` claim (custom serializer).
2. **As a user, I can refresh tokens without re-authenticating.**
   - **AC1:** POST `/api/token/refresh/` with a valid refresh token returns a new access token.
   - **AC2:** Invalid/expired refresh token returns `401 Unauthorized` with standard error shape.
3. **As a user, I can log out and clear tokens.**
   - **AC1:** Frontend clears stored tokens and redirects to login.
   - **AC2:** Authenticated routes are inaccessible after logout.
4. **As a user, I can load my profile and role from `/api/me`.**
   - **AC1:** Authenticated request returns user identity + role.
   - **AC2:** Unauthorized request returns `401 Unauthorized`.

---

# Phase 1 — Announcements & Dashboard
### Goals
- Provide announcement list/detail and a lightweight dashboard.

### Non-Goals
- Maintenance requests or resident directory.

### User Stories & Acceptance Criteria
1. **As a resident, I can view announcements.**
   - **AC1:** GET announcements list returns only active announcements.
   - **AC2:** Detail endpoint returns full content.
2. **As an admin/manager, I can create and manage announcements.**
   - **AC1:** Create, update, deactivate endpoints are role-gated (Admin/Manager only).

---

# Phase 2 — Maintenance Requests
### Goals
- Enable residents to create and view maintenance requests.
- Enable staff/admins to manage and update statuses.

### User Stories & Acceptance Criteria
1. **As a resident, I can submit a maintenance request.**
   - **AC1:** Request is associated with my resident profile.
   - **AC2:** I can see only my own requests.
2. **As a manager, I can update status/assignments.**
   - **AC1:** Status updates enforce valid transitions.

---

# Phase 3 — Buildings/Units/Resident Directory
### Goals
- Manage building/unit data and resident directory views.

### User Stories & Acceptance Criteria
1. **As a manager/admin, I can manage building/unit inventory.**
   - **AC1:** CRUD endpoints are role-gated.
2. **As a resident, I can view permitted directory information.**
   - **AC1:** Sensitive fields are hidden unless admin/manager.

---

# Phase 4 — Enhancements (FUTURE PHASE — DO NOT IMPLEMENT YET)
### Goals
- Uploads, payments, notifications, audit logs, analytics.

### User Stories & Acceptance Criteria
- **FUTURE PHASE — DO NOT IMPLEMENT YET**
