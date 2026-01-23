# API Contract (Phase 1 Active)

Base URL
- /api

Auth
- Authorization header: `Authorization: Bearer <access_token>`

Error Shape
```
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Pagination
```
{
  "count": 123,
  "next": "<url or null>",
  "previous": "<url or null>",
  "results": [ ... ]
}
```

---

## Phase 1 Endpoints (ACTIVE)

### Announcements
Permissions
- Resident: read only
- Admin/Manager: CRUD

#### GET /api/announcements/
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

#### GET /api/announcements/{id}/
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

#### POST /api/announcements/ (Admin/Manager)
Request
```
{ "title": "...", "content": "...", "is_active": true }
```
Response 201
```
{
  "id": 11,
  "title": "...",
  "content": "...",
  "is_active": true,
  "created_at": "2026-01-23T00:00:00Z",
  "updated_at": "2026-01-23T00:00:00Z"
}
```

#### PATCH /api/announcements/{id}/ (Admin/Manager)
Request
```
{ "title": "...", "content": "...", "is_active": false }
```
Response 200
```
{
  "id": 11,
  "title": "...",
  "content": "...",
  "is_active": false,
  "created_at": "2026-01-23T00:00:00Z",
  "updated_at": "2026-01-23T00:00:00Z"
}
```

#### DELETE /api/announcements/{id}/ (Admin/Manager)
Response 204

### Dashboard Summary
Permissions
- Resident, Manager, Admin: read

#### GET /api/dashboard/summary
Response 200
```
{
  "announcements": {
    "active_count": 12,
    "latest": [
      {
        "id": 10,
        "title": "Pool Closure",
        "created_at": "2026-01-23T00:00:00Z"
      }
    ]
  }
}
```

---

FUTURE PHASE — DO NOT IMPLEMENT
- File uploads
- Notifications
- Payments
- Audit logs
