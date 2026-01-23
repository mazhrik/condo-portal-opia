# Condo Portal Rollout Phases

> **ACTIVE PHASE: Phase 0 — Foundation & Auth Hardening**

## Phase 0 — Foundation & Auth Hardening (ACTIVE)
**Objective**
- Confirm and standardize JWT auth flows, frontend token handling, and RBAC baseline for the existing Django + DRF API.

**Included**
- Document current auth endpoints (/api/token/, /api/token/refresh/).
- Choose and document a token storage strategy for Vite React.
- Define login, refresh, and logout flows for the SPA.
- Add/standardize `/api/me` endpoint (user + role) as the auth bootstrap.
- Establish roles: Admin / Property Manager / Resident with permission matrix.
- Define API conventions (pagination, error shape, filtering).

**Excluded**
- Feature work in announcements, maintenance, buildings/units, etc.

**Dependencies**
- DRF SimpleJWT configured in `REST_FRAMEWORK` defaults.
- React app uses axios + react-router-dom + react-query.

**Exit Criteria**
- From React, a user can log in, call a protected endpoint, refresh token, log out, and role-based restrictions produce correct 401/403 behavior.

**Rollout Notes**
- Ship doc-first contract updates before implementation.
- Backend/Frontend/QA only implement Phase 0 scope.

## Phase 1 — Announcements & Dashboard
**Objective**
- Deliver announcements list/detail + lightweight dashboard.

**Included**
- Announcements CRUD (role-gated).
- Dashboard summary widgets (latest announcements, counts).

**Excluded**
- Maintenance requests, units directory, payments.

**Dependencies**
- Phase 0 auth + RBAC in place.

**Exit Criteria**
- Resident sees announcements list and detail; admins/managers can create/update/deactivate.

**Rollout Notes**
- Release independently of later phases.

## Phase 2 — Maintenance Requests
**Objective**
- Full maintenance request lifecycle.

**Included**
- Resident create/view own requests.
- Staff/Manager update status and assignments.

**Excluded**
- Buildings/Units/Directory.

**Dependencies**
- Phase 0 auth + RBAC.

**Exit Criteria**
- Requests can be created, viewed, updated, and status transitions enforced.

**Rollout Notes**
- Release independently once Phase 0 is stable.

## Phase 3 — Buildings/Units/Resident Directory
**Objective**
- Manage buildings/units and directory visibility.

**Included**
- Building/unit entities.
- Resident directory (role-gated views).

**Excluded**
- Payments/Uploads/Notifications.

**Dependencies**
- Phase 0 auth + Phase 1/2 conventions.

**Exit Criteria**
- Directory is accurate; role-gated admin/manager operations.

**Rollout Notes**
- May require data migration.

## Phase 4 — Enhancements (FUTURE PHASE — DO NOT IMPLEMENT YET)
**Objective**
- Expand platform with advanced features.

**Included**
- Uploads, payments, notifications, audit logs, analytics.

**Excluded**
- Any Phase 4 work prior to explicit activation.

**Dependencies**
- Phases 0–3 complete.

**Exit Criteria**
- Defined per feature when Phase 4 becomes active.

**Rollout Notes**
- Explicit future-only scope.
