# Frontend Contract (Phase 1 Active)

## Tech Stack
- React + Vite + TypeScript
- react-router-dom
- axios
- @tanstack/react-query

## Phase 1 Routes
- /dashboard (protected)
- /announcements (protected)
- /announcements/:id (protected)

## Data Fetching Patterns
- Use react-query for all network calls.
- Cache keys:
  - `announcements:list`
  - `announcements:detail:{id}`
  - `dashboard:summary`
- Announcements list default filter `is_active=true` for residents.
- Admin/Manager screens may toggle `is_active=false` for management views.

## Error and Loading States
- List and detail pages show skeleton/loading state while fetching.
- Errors render a standard inline error banner with retry button.
- Dashboard widgets handle partial failures (render available widgets, show error state per widget).

## Role-aware UI
- Admin/Manager: show create/edit/deactivate controls for announcements.
- Resident: read-only announcements views.

## FUTURE PHASE — DO NOT IMPLEMENT
- File uploads
- Notifications
- Payments
- Audit logs
