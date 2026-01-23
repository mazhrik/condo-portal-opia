# Architecture

## High-Level Design
- **Frontend:** Vite + React + TypeScript using react-router-dom, axios, and @tanstack/react-query.
- **Backend:** Django + DRF with SimpleJWT authentication. Default authentication and permission classes require JWT and authenticated access for API endpoints.
- **Auth Integration:** SPA uses JWTs for authenticated API calls. Backend issues JWTs via `/api/token/` and refreshes via `/api/token/refresh/`.

## Entity Overview (Phases 1–3)
### Phase 1 — Announcements
- **Announcement**: title, content, created_at, updated_at, is_active.

### Phase 2 — Maintenance Requests
- **MaintenanceRequest**: resident, title, description, status, priority, assigned_to (staff), completion_notes, timestamps.
- **Resident**: user, unit_number, phone_number, move_in_date.
- **Staff**: user, position, department, hire_date.

### Phase 3 — Buildings/Units/Directory (Planned)
- **Building** (planned): name, address, metadata.
- **Unit** (planned): building, unit_number, occupancy status.
- **DirectoryEntry** (planned): resident profile details with role-gated visibility.

## Auth Approach (Current Config)
- **Backend:** DRF SimpleJWT with `JWTAuthentication` and `IsAuthenticated` configured as defaults.
- **JWT Claims:** Custom token serializer includes user email in the JWT payload.
- **SPA:** Uses access token for API calls and refresh token for renewing access (see Frontend Contract).

## Risks & Mitigations
1. **Token Storage Risk**
   - **Risk:** Storing tokens in localStorage exposes them to XSS.
   - **Mitigation:** Keep access tokens in memory, store refresh token in localStorage only, enforce Content Security Policy, and minimize token lifetime.
2. **CSRF Risk (if cookies used in future)**
   - **Risk:** If cookie-based auth is introduced later, CSRF protection must be enforced.
   - **Mitigation:** Keep JWTs in Authorization headers for Phase 0; revisit if switching to cookies.
3. **CORS Misconfiguration**
   - **Risk:** Frontend origin not allowed causes auth failures.
   - **Mitigation:** Maintain explicit Vite dev origin allowlist and verify in QA.
