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

---

## Phase 1 — Announcements
### Functional Tests
- List announcements returns only active items.
- Admin/Manager can create/update/deactivate.
- Resident cannot create/update/deactivate.

---

## Phase 2 — Maintenance Requests
### Functional Tests
- Resident can create a request and see only their own requests.
- Manager/Admin can view all requests and update status.

---

## Phase 3 — Buildings/Units/Directory
### Functional Tests
- Admin/Manager can manage buildings/units.
- Residents can view allowed directory fields only.

---

## Phase 4 — Enhancements (FUTURE PHASE — DO NOT IMPLEMENT YET)
- QA plan to be defined when Phase 4 activates.
