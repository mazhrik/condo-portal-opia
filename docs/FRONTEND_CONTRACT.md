# Frontend Contract (Phase 2 Active)

## Tech Stack
- React + Vite + TypeScript
- react-router-dom
- axios
- @tanstack/react-query

## Phase 2 Routes and Screens
Resident
- /maintenance/new (create request form)
- /maintenance (my requests list)
- /maintenance/:id (request detail)

Staff/Admin
- /maintenance/all (all requests list)
- /maintenance/:id (request detail with status + assign UI)

## Data Fetching Patterns
- Use react-query for all network calls.
- Cache keys:
  - `maintenance:list:mine`
  - `maintenance:list:all`
  - `maintenance:detail:{id}`
- List views support filters for status, priority, assigned_to, created_from/to (staff/admin only).

## UI Components
Resident
- Create Request form (title, description, priority)
- My Requests list (status, priority, updated_at)
- Request detail (status history placeholder, assigned staff, completion notes)

Staff/Admin
- All Requests list with filters
- Request detail with status transition controls
- Assign staff dropdown

## Error and Loading States
- Lists show skeleton while loading and empty-state when no results.
- Form submission shows inline validation errors and retry.
- Detail view shows 403/404 friendly state if unauthorized or missing.

## Role-aware UI
- Resident cannot see admin controls or all-requests list.
- Staff/Admin sees assign + status controls.

## FUTURE PHASE — DO NOT IMPLEMENT
- File uploads/photos
- Notifications
- Payments
- Vendor marketplace
