# API Contract

Base URL
- /api

Auth
- Authorization header: `Authorization: Bearer <access_token>`
- Access token obtained via POST /api/token/
- Refresh via POST /api/token/refresh/

Error Shape (Phase 0 standard)
```
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Pagination (Phase 0 standard)
- List endpoints should return:
```
{
  "count": 123,
  "next": "<url or null>",
  "previous": "<url or null>",
  "results": [ ... ]
}
```

---

## Phase 0 Endpoints (ACTIVE)

### POST /api/token/
Request
```
{
  "email": "user@example.com",
  "password": "string"
}
```
Response 200
```
{
  "access": "jwt",
  "refresh": "jwt",
  "user_id": 1,
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "is_staff": false,
  "is_superuser": false
}
```

### POST /api/token/refresh/
Request
```
{ "refresh": "jwt" }
```
Response 200
```
{ "access": "jwt" }
```

### GET /api/me
Auth required.
Response 200
```
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "resident",
  "resident": {
    "id": 12,
    "unit_number": "A-203",
    "phone_number": "555-0101",
    "move_in_date": "2024-01-15"
  },
  "staff": null
}
```
Role values: `admin` | `manager` | `resident`.

### GET /api/health
Response 200
```
{ "status": "ok" }
```

---

## Phase 1 Endpoints (Announcements)

### GET /api/announcements/
Query params
- `is_active` (bool, optional; default true)

Response 200
```
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 10,
      "title": "Pool Closure",
      "content": "...",
      "is_active": true,
      "created_at": "2026-01-23T00:00:00Z",
      "updated_at": "2026-01-23T00:00:00Z"
    }
  ]
}
```

### GET /api/announcements/{id}/
Response 200
```
{
  "id": 10,
  "title": "Pool Closure",
  "content": "...",
  "is_active": true,
  "created_at": "2026-01-23T00:00:00Z",
  "updated_at": "2026-01-23T00:00:00Z"
}
```

### POST /api/announcements/ (Admin/Manager)
Request
```
{ "title": "...", "content": "...", "is_active": true }
```

### PATCH /api/announcements/{id}/ (Admin/Manager)
Request
```
{ "title": "...", "content": "...", "is_active": false }
```

---

## Phase 2 Endpoints (Maintenance)

### GET /api/maintenance-requests/
- Residents: only own requests.
- Admin/Manager: all requests.

Response item
```
{
  "id": 5,
  "resident": 12,
  "title": "Leaky faucet",
  "description": "...",
  "status": "pending",
  "priority": "medium",
  "assigned_to": 3,
  "completion_notes": null,
  "created_at": "2026-01-23T00:00:00Z",
  "updated_at": "2026-01-23T00:00:00Z"
}
```

### POST /api/maintenance-requests/ (Resident)
Request
```
{ "title": "...", "description": "...", "priority": "high" }
```

### PATCH /api/maintenance-requests/{id}/ (Admin/Manager)
Request
```
{ "status": "in_progress", "assigned_to": 3, "completion_notes": "..." }
```

---

## Phase 3 Endpoints (Directory)

### GET /api/buildings/ (Admin/Manager)
### POST /api/buildings/ (Admin/Manager)
### GET /api/units/ (Admin/Manager)
### POST /api/units/ (Admin/Manager)
### GET /api/directory/ (Role-gated)

Response item (directory)
```
{
  "resident_id": 12,
  "full_name": "Jane Doe",
  "unit_number": "A-203",
  "email": "masked-or-full-based-on-role"
}
```
