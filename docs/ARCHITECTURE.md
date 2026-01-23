# Architecture

## System Overview
- Frontend: React + Vite + TypeScript, react-router-dom, axios, @tanstack/react-query.
- Backend: Django + DRF + SimpleJWT + dj-rest-auth + allauth.
- API base: /api/ (Django)

## Phase 2 Entities
- MaintenanceRequest
  - Fields: resident_id, title, description, status, priority, assigned_to, completion_notes, created_at, updated_at
  - Status workflow: new → in_review → assigned → in_progress → completed → closed
  - Visibility: resident sees own; staff/admin sees all

## Relationships and Indexes (Minimal)
- MaintenanceRequest.resident_id → Resident
- MaintenanceRequest.assigned_to → Staff (nullable)
- Recommended indexes: resident_id, status, assigned_to, updated_at

## Auth Configuration (Phase 0 Completed)
- JWT auth enabled via DRF DEFAULT_AUTHENTICATION_CLASSES.
- DEFAULT_PERMISSION_CLASSES = IsAuthenticated.

## FUTURE PHASE — DO NOT IMPLEMENT
- File uploads/photos
- Notifications
- Payments
- Vendor marketplace
