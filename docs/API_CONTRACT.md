# API Contract (Phase 2 Active)

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

## Phase 2 Endpoints (ACTIVE)

### Maintenance Requests
Permissions
- Resident: create + view own
- Manager/Admin: list + view all + manage

Status values
- `new`, `in_review`, `assigned`, `in_progress`, `completed`, `closed`

Allowed transitions
- new → in_review → assigned → in_progress → completed → closed
- any → closed (Admin only)

#### GET /api/maintenance-requests/
Filtering (Manager/Admin only)
- `status`, `priority`, `assigned_to`, `resident_id`, `created_from`, `created_to`, `q`

Resident behavior
- Returns only requests for the authenticated resident; ignores `resident_id`.

Response 200
```
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 42,
      "resident": 12,
      "title": "Leaky faucet",
      "description": "...",
      "status": "new",
      "priority": "medium",
      "assigned_to": null,
      "completion_notes": null,
      "created_at": "2026-01-23T00:00:00Z",
      "updated_at": "2026-01-23T00:00:00Z"
    }
  ]
}
```

#### POST /api/maintenance-requests/ (Resident)
Request
```
{ "title": "...", "description": "...", "priority": "high" }
```
Response 201
```
{
  "id": 43,
  "resident": 12,
  "title": "...",
  "description": "...",
  "status": "new",
  "priority": "high",
  "assigned_to": null,
  "completion_notes": null,
  "created_at": "2026-01-23T00:00:00Z",
  "updated_at": "2026-01-23T00:00:00Z"
}
```

#### GET /api/maintenance-requests/{id}/
- Resident can only access own request.
- Manager/Admin can access any request.

#### PATCH /api/maintenance-requests/{id}/ (Manager/Admin)
Rules
- Status must follow allowed transitions.
- `assigned_to` must reference a staff user.
- `completion_notes` required when setting status to `completed`.

Request
```
{ "status": "assigned", "assigned_to": 3 }
```

Response 200
```
{
  "id": 42,
  "status": "assigned",
  "assigned_to": 3,
  "completion_notes": null,
  "updated_at": "2026-01-23T00:00:00Z"
}
```

Error example (invalid transition) 400
```
{
  "error": {
    "code": "invalid_transition",
    "message": "Cannot transition from new to completed.",
    "details": { "from": "new", "to": "completed" }
  }
}
```

Comments/Notes (Phase 2)
- Only `completion_notes` is supported.
- No threaded comments or attachments in Phase 2.

---

FUTURE PHASE — DO NOT IMPLEMENT
- File uploads/photos
- Notifications
- Payments
- Vendor marketplace
