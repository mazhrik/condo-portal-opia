# Frontend Contract

## Phase 0 — Auth & Routing (ACTIVE)
### Token Storage Strategy
- **Access token:** in-memory (React state or in a client-side auth store).
- **Refresh token:** `localStorage` key `condo.refreshToken`.
- **Rationale:** minimizes XSS exposure for access token while allowing session recovery via refresh.

### Login Flow
1. User submits email + password.
2. `POST /api/token/` returns `{ access, refresh }`.
3. Store `refresh` in localStorage; store `access` in memory.
4. Navigate to authenticated route (e.g., `/dashboard`).

### Refresh Flow
- On app load, if `condo.refreshToken` exists, call `POST /api/token/refresh/` to obtain a new access token.
- On 401 from API calls, attempt a single refresh; if refresh fails, clear tokens and redirect to `/login`.

### Logout Flow
- Clear access token (memory) and `condo.refreshToken` (localStorage).
- Redirect to `/login`.

### Protected Routes (react-router-dom)
- Wrap authenticated routes with an auth guard that requires a valid access token in memory.
- If token missing/expired and refresh fails, redirect to `/login`.

### Axios Conventions
- **Request interceptor:** attach `Authorization: Bearer <access>` when present.
- **Response interceptor:** on `401`, attempt refresh once and retry original request.

### User Bootstrap
- After successful token acquisition/refresh, call `POST /api/me` to retrieve user + role.
- Store role in app state for RBAC-driven UI.

---

## Phase 1 — Announcements & Dashboard
**Routes**
- `/dashboard` (summary + latest announcements)
- `/announcements` (list)
- `/announcements/:id` (detail)

**Components**
- `AnnouncementsList`
- `AnnouncementDetail`
- `DashboardSummary`

---

## Phase 2 — Maintenance Requests
**Routes**
- `/maintenance` (list)
- `/maintenance/new` (create)
- `/maintenance/:id` (detail)

**Components**
- `MaintenanceList`
- `MaintenanceCreate`
- `MaintenanceDetail`

---

## Phase 3 — Buildings/Units/Directory
**Routes (planned)**
- `/buildings`
- `/units`
- `/directory`

**Components (planned)**
- `BuildingList`
- `UnitList`
- `ResidentDirectory`

---

## Phase 4 — Enhancements (FUTURE PHASE — DO NOT IMPLEMENT YET)
- Uploads, payments, notifications, audit logs, analytics UI.
