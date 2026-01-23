# Project Coordination & Architecture Guide

> [!IMPORTANT]
> This is a living document. All agents (Backend/Frontend) must check this file for the latest architectural standards, API contracts, and environment configurations.

## 1. Architecture Overview

- **Frontend**: React (Vite) + TypeScript + Tailwind + Radix UI.
- **Backend**: Django REST Framework + SimpleJWT.
- **Database**: PostgreSQL (AWS RDS).
- **Cache**: Redis/Valkey (AWS ElastiCache).
- **Infrastructure**: Kubernetes (AWS EKS), Dockerized containers.
- **Networking**: AWS API Gateway -> EKS Load Balancer.

## 2. Environment Strategy

| Env  | Role | Branch | Database | Debug |
| :--- | :--- | :--- | :--- | :--- |
| **DEV**  | Local Development | `dev` | `db.sqlite3` / Local Docker Postgres | `True` |
| **UAT**  | User Acceptance Testing | `staging` | AWS RDS (Staging Schema) | `False` |
| **PROD** | Production | `main` | AWS RDS (Prod Schema) | `False` |

## 3. Configuration & Secrets

### Backend (`.env`)
required env vars:
```bash
DJANGO_SECRET_KEY=...
DEBUG=False
ALLOWED_HOSTS=...
DATABASE_URL=postgres://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379/0
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://mycondo.com
```

### Frontend (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

## 4. API Standards

- **Auth Header**: `Authorization: Bearer <access_token>`
- **Response Format**: 
  - Standard 200/201: JSON object.
  - Error 400/500: `{ "detail": "Error message" }`
- **Prefix**: `/api/`

## 5. Deployment Workflow & Handover

1. **Backend Agent**:
   - Containerize app (`Dockerfile`).
   - Implement `dj-database-url` and `python-dotenv`.
   - Ensure `collectstatic` runs in build.
   - Output `k8s/deployment.yaml`.

2. **Frontend Agent**:
   - Update `api.ts` to use `import.meta.env.VITE_API_BASE_URL`.
   - Create `Dockerfile` (Nginx multi-stage).
   - Verify UI against new API endpoints.

### Local Verification (All Phases)
- Run `npm install` before starting work (or when dependencies change).
- Run `npm run dev` to validate the app boots locally.
- Run `npm run lint` and `npx vitest run` before handoff.

## 6. Shared Constants
*(Add shared enums/constants here as they are defined)*
- **User Roles**: `ADMIN`, `RESIDENT`, `STAFF`.
- **Request Status**: `PENDING`, `IN_PROGRESS`, `RESOLVED`.

## 7. Feature Completeness Audit

### ✅ Implemented
- **Core Models**: Residents, Staff, maintenance, Amenities, Packages, Parking.
- **Basic UI**: Admin and Resident dashboards, File Manager, Listings.
- **Polls & Voting**: Backend (`Poll`, `PollVote`) & Frontend (Admin Create, Resident Vote) ✅.
- **Incident Reports**: Backend (`IncidentReport`) & Frontend (Resident Report, Admin Manage) ✅.
- **Events Calendar**: Backend (`Event`) & Frontend (Admin Create, Resident View) ✅.
- **Package Tracking**: Full integration (Admin Log, Resident View) ✅.

### ⚠️ Partial / Missing Features (To Be Developed)
1.  **Notifications**: **Missing Entirely**. Need a Notification model and Websocket/Email integration for real-time alerts.
2.  **Payment Processing**: `Payment` model exists but lacks **Stripe/PayPal integration**. Currently manual entry only.
3.  **Security**: Verify `IsStaff` vs `IsResident` permission classes on all ViewSets.

## 8. Development Roadmap (Prioritized)

> [!NOTE]
> Features below have been approved for development following the Market Research Gap Analysis.

### Priority 1: Core HOA Governance (Phase 5 Implementation)
1.  **Architectural Requests (ARC)**
    *   **Status**: 🟢 APPROVED
    *   **Model**: `ArchitecturalRequest` (resident, description, attachments, status, board_vote_count).
    *   **Workflow**: Submission -> Board Vote -> Approval/Denial.

2.  **Violations & CC&R Enforcement**
    *   **Status**: 🟢 APPROVED
    *   **Model**: `Violation` (resident, rule_broken, photo_proof, status, fine_amount).
    *   **Workflow**: Log -> Notify -> Fine/Resolve.

3.  **Board Member Portal**
    *   **Status**: 🟢 APPROVED
    *   **Role**: New `BOARD_MEMBER` user role.
    *   **Access**: Exclusive dashboard for ARC votes and Violation review.

### Priority 2: Advanced Operations (Phase 6 Implementation)
1.  **Visitor Management & Gate Access**
    *   **Status**: 🟡 PLANNED
    *   **Expansion**: `VisitorAccess` with QR Codes/Passes.

2.  **Asset & Inventory Management**
    *   **Status**: 🟡 PLANNED
    *   **Model**: `Asset` linked to Maintenance Requests.

## 9. QA Status & Test Results

> [!NOTE]
> **Last Updated**: 2026-01-16 | **QA Engineer**: Senior QA Auditor

### Test Coverage Summary

| Component | Tests | Status | Coverage |
|-----------|-------|--------|----------|
| **Backend Models** | 16 | ✅ PASS | 100% |
| **Backend API Views** | 13 | ✅ PASS | 100% |
| **Backend Cache** | 13 | ✅ PASS | 100% |
| **Frontend Tests** | 42 | ⚠️ ENV ISSUE | N/A |
| **Browser E2E** | 4 flows | ✅ VERIFIED | Manual |

### Critical Issues Found

> [!CAUTION]
> **Security Vulnerability**: Poll creation has fallback logic that allows non-staff users to create polls. Fix required in `core/views.py:192`.

> [!WARNING]
> **Missing Dependency**: `psycopg2-binary` was missing from requirements.txt (now added). Must install before AWS RDS deployment.

### Bugs Fixed During QA

1. ✅ **Serializer Validation Bug**: Made `resident` field read-only in `MaintenanceRequestSerializer` and `IncidentReportSerializer`
2. ✅ **Missing PostgreSQL Driver**: Added `psycopg2-binary==2.9.10` to requirements.txt
3. ✅ **Test Infrastructure**: Created 42 backend tests (all passing)

### Required Actions Before Production

- [ ] **CRITICAL**: Fix poll creation security vulnerability
- [ ] **CRITICAL**: Install PostgreSQL driver (`pip install -r requirements.txt`)
- [ ] **HIGH**: Test AWS RDS connectivity in UAT
- [ ] **HIGH**: Test AWS ElastiCache integration in UAT
- [ ] **MEDIUM**: Fix frontend test environment (React global config)
- [ ] **MEDIUM**: Add explicit cache fallback for development
- [ ] **LOW**: Fix timezone warnings (use `timezone.now()`)

### Test Reports

- 📄 **Detailed Report**: [`TEST_REPORT.MD`](file:///Users/muneebmalik/condo-portal-opia/TEST_REPORT.MD)
- 📁 **Backend Tests**: `core/test_models.py`, `core/test_views.py`, `core/test_cache.py`
- 📁 **Frontend Tests**: `src/pages/admin/__tests__/`, `src/pages/resident/__tests__/`

### QA Batch Status

**Batch 1-4 (Polls, Events, Incidents, Packages)**: ✅ **PASSED**
- All backend features implemented and tested
- All API endpoints functional
- Frontend UI verified via browser testing
- **Recommendation**: Ready for UAT deployment after security fix
