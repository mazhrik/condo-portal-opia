# Architecture

## System Overview
- Frontend: React + Vite + TypeScript, react-router-dom, axios, @tanstack/react-query.
- Backend: Django + DRF + SimpleJWT + dj-rest-auth + allauth.
- API base: /api/ (Django)

## Phase 1 Entities
- Announcement
  - Fields: title, content, is_active, created_at, updated_at
  - Visibility: all authenticated users can read active announcements
  - Management: Admin/Manager can create/update/deactivate

## Relationships and Access
- Residents can read announcements and dashboard summary.
- Managers/Admins can create/update/deactivate announcements.

## Auth Configuration (Phase 0 Completed)
- JWT auth enabled via DRF DEFAULT_AUTHENTICATION_CLASSES.
- DEFAULT_PERMISSION_CLASSES = IsAuthenticated.
- SimpleJWT access/refresh rotation with 60m/1d lifetimes.

## Observability & Health
- /api/health returns { status: "ok" }.

## FUTURE PHASE — DO NOT IMPLEMENT
- File uploads
- Notifications
- Payments
- Audit logs
