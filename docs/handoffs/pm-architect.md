Date: 2026-01-23
Branch: main
Commit: 2b9786a7bec3b0f541b34947e1059c60347aa287
ACTIVE PHASE: Phase 1 — Announcements + Dashboard

Docs updated:
- docs/PHASES.md
- docs/PRD.md
- docs/API_CONTRACT.md
- docs/FRONTEND_CONTRACT.md
- docs/ARCHITECTURE.md

Key decisions:
- Phase 1 scope limited to announcements CRUD and a dashboard summary endpoint.
- RBAC: residents read-only; admin/manager CRUD.
- Explicit exclusion of uploads/notifications/payments/audit logs as FUTURE PHASE only.

Assumptions:
- Auth (Phase 0) remains the foundation with JWT and /api/me.
- Dashboard summary is a single endpoint powering widgets.
