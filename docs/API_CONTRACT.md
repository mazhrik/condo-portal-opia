# API Contract

Base URL: `/api`

## Conventions (Phase 0)
- **Auth header:** `Authorization: Bearer <access_token>`
- **Content-Type:** `application/json`
- **Error shape:**
  - Auth errors: `{ "detail": "..." }`
  - Validation errors: `{ "field": ["error message"] }`
- **Pagination:** Not currently configured in settings. Phase 0 requires standardizing on limit/offset pagination (planned), documented here for implementation.
  - Response: `{ "count": number, "next": string | null, "previous": string | null, "results": [...] }`
  - Query params: `?limit=<int>&offset=<int>`

---

# Phase 0 — Auth & RBAC (ACTIVE)
## Auth Endpoints (Confirmed in URLs)
### POST `/api/token/`
- **Purpose:** Obtain access + refresh JWTs.
- **Request Body:**
  ```json
  { "email": "user@example.com", "password": "..." }
  ```
- **Response 200:**
  ```json
  { "refresh": "<refresh_token>", "access": "<access_token>" }
  ```
- **Notes:** Custom token serializer adds `email` claim to JWT payload.

### POST `/api/token/refresh/`
- **Purpose:** Refresh access token.
- **Request Body:**
  ```json
  { "refresh": "<refresh_token>" }
  ```
- **Response 200:**
  ```json
  { "access": "<access_token>" }
  ```

### POST `/api/me` (Planned)
- **Purpose:** Return authenticated user identity and role.
- **Response 200:**
  ```json
  {
    "id": 123,
    "email": "user@example.com",
    "first_name": "...",
    "last_name": "...",
    "role": "admin|property_manager|resident"
  }
  ```

### dj-rest-auth Endpoints
- **Status:** `dj_rest_auth` is installed but **not wired in URLs**. Do not implement its endpoints until explicitly added to `urls.py`.

## RBAC Sample Endpoints (Existing)
These endpoints are in the router and require authentication by default.
- `GET /api/announcements/`
- `GET /api/maintenance-requests/`
- `GET /api/residents/`

---

# Phase 1 — Announcements
### GET `/api/announcements/`
- **Purpose:** List active announcements.
- **Permissions:** All roles (Admin/Property Manager/Resident).

### POST `/api/announcements/`
- **Purpose:** Create announcement.
- **Permissions:** Admin/Property Manager only.

### PATCH `/api/announcements/{id}/`
- **Purpose:** Update or deactivate (set `is_active=false`).
- **Permissions:** Admin/Property Manager only.

---

# Phase 2 — Maintenance Requests
### GET `/api/maintenance-requests/`
- **Purpose:** List maintenance requests.
- **Permissions:**
  - Admin/Property Manager: see all.
  - Resident: see own requests only.

### POST `/api/maintenance-requests/`
- **Purpose:** Create a maintenance request.
- **Permissions:** Admin/Property Manager/Resident.

### PATCH `/api/maintenance-requests/{id}/`
- **Purpose:** Update status/assignment.
- **Permissions:** Admin/Property Manager only.

---

# Phase 3 — Buildings/Units/Directory (Stub)
- **Endpoints TBD** (to be defined when Phase 3 becomes active).

---

# Phase 4 — Enhancements (FUTURE PHASE — DO NOT IMPLEMENT YET)
- Uploads, payments, notifications, audit logs, analytics endpoints to be defined in future.
