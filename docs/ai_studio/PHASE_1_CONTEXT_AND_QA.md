# Phase 1: Project Context and QA Plan

This document outlines the project's architecture, routes, features, and the plan for end-to-end testing.

## 1. Architecture Summary

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/Radix UI. Uses `react-router-dom` for routing, `axios` for API calls, and `@tanstack/react-query` for data fetching and caching.
- **Backend**: Django, Django REST Framework (DRF), SimpleJWT for token-based authentication. The project also includes `dj-rest-auth` and `django-allauth` for potential social auth, but they are not currently wired up.
- **Database**: PostgreSQL for production (via AWS RDS) and `db.sqlite3` for local development.
- **Cache**: Redis (via AWS ElastiCache).
- **Authentication**: JWT (JSON Web Tokens) using SimpleJWT. Access tokens are stored in memory, and refresh tokens are stored in `localStorage`.
- **Roles**:
    - **Admin**: Django superuser or `is_staff`.
    - **Property Manager/Staff**: User with a `Staff` profile.
    - **Resident**: User with a `Resident` profile.
    - **Board Member**: A resident with the `is_board_member` flag set to `True`.

## 2. How to Run Locally

- **Backend**:
    1.  Create and activate a Python virtual environment.
    2.  Install dependencies: `pip install -r requirements.txt`
    3.  Run database migrations: `python manage.py migrate`
    4.  Seed the database with test users: `python seed_test_users.py`
    5.  Run the development server: `python manage.py runserver` (usually on `http://localhost:8000`)
- **Frontend**:
    1.  Install dependencies: `npm install`
    2.  Run the development server: `npm run dev` (usually on `http://localhost:5173`)

## 3. Route Map & Role Access

| Route | Component | Role Access | Protected |
| :--- | :--- | :--- | :--- |
| `/` | Redirect to `/login` | All | No |
| `/login` | `Login` | All | No |
| `/dashboard` | `Dashboard` | All | Yes |
| `/announcements` | `Announcements` | All | Yes |
| `/announcements/:id` | `AnnouncementDetail` | All | Yes |
| `/maintenance` | `MaintenanceList` | All | Yes |
| `/maintenance/new`| `MaintenanceNew` | Resident | Yes |
| `/maintenance/all`| `MaintenanceAll` | Admin, Manager | Yes |
| `/maintenance/:id`| `MaintenanceDetail` | All | Yes |
| `/resident/arc`| `ArchitecturalRequest` | Resident | Yes |
| `/resident/violations`| `MyViolations` | Resident | Yes |
| `/resident/polls`| `ResidentPolls` | Resident | Yes |
| `/resident/events`| `ResidentEvents` | Resident | Yes |
| `/resident/amenities`| `AmenityBookings` | Resident | Yes |
| `/admin` | `AdminDashboard` | Admin, Manager | Yes |
| `/admin/polls` | `AdminPolls` | Admin, Manager | Yes |
| `/admin/events` | `AdminEvents` | Admin, Manager | Yes |
| `/admin/amenities` | `AmenityManagement` | Admin, Manager | Yes |
| `/admin/violations` | `Violations` | Admin, Manager | Yes |
| `/admin/communication` | `CommunicationHub` | Admin, Manager | Yes |
| `/admin/documents` | `Documents` | Admin, Manager | Yes |
| `/admin/announcements` | `AdminAnnouncements` | Admin, Manager | Yes |
| `/admin/packages` | `PackageLog` | Admin, Manager | Yes |
| `/admin/settings` | `AdminSettings` | Admin, Manager | Yes |
| `/admin/incidents` | `Incidents` | Admin, Manager | Yes |
| `/admin/residents` | `Residents` | Admin, Manager | Yes |
| `/admin/residents/directory` | `ResidentDirectory` | Admin, Manager | Yes |
| `/admin/maintenance` | `MaintenanceRequests` | Admin, Manager | Yes |
| `/admin/maintenance/schedule` | `MaintenanceSchedule` | Admin, Manager | Yes |
| `/admin/amenities/status` | `AmenityStatus` | Admin, Manager | Yes |
| `/admin/finances` | `FinancialManagement` | Admin, Manager | Yes |
| `/admin/finances/records`| `PaymentRecords`| Admin, Manager | Yes |
| `/admin/parking` | `ParkingManagement` | Admin, Manager | Yes |
| `/admin/parking/registry`| `VehicleRegistry`| Admin, Manager | Yes |
| `/board` | `BoardDashboard` | Board Member | Yes |
| `/board/arc` | `ArchitecturalReview`| Board Member | Yes |
| `/board/financials`| `FinancialReports`| Board Member | Yes |
| `/board/polls` | `BoardPolls` | Board Member | Yes |
| `/board/settings` | `BoardSettings` | Board Member | Yes |
| `*` | Redirect to `/login` | All | No |

## 4. Feature & Module Inventory

- **Authentication**
    - Login: `POST /api/token/`
    - Refresh Token: `POST /api/token/refresh/`
    - Get User Info: `GET /api/me`
- **Dashboard**
    - `GET /api/dashboard/summary/` (hypothetical, based on `QA_PLAN.md`)
- **Announcements**
    - List: `GET /api/announcements/`
    - Detail: `GET /api/announcements/{id}/`
    - Create: `POST /api/announcements/` (Admin/Manager)
    - Update: `PATCH /api/announcements/{id}/` (Admin/Manager)
- **Maintenance**
    - List (Resident): `GET /api/maintenance-requests/`
    - List (Admin/Manager): `GET /api/maintenance-requests/`
    - Create: `POST /api/maintenance-requests/` (Resident)
    - Detail: `GET /api/maintenance-requests/{id}/`
    - Update: `PATCH /api/maintenance-requests/{id}/` (Admin/Manager)
- **Architectural Requests (ARC)**
    - Create: `POST /api/arc/` (hypothetical, based on `COORDINATION.MD`) (Resident)
    - List/Review: `GET /api/arc/` (Board Member)
- **Violations**
    - List (Resident): `GET /api/violations/` (hypothetical)
    - Log: `POST /api/violations/` (Staff)
- **Polls**
    - List/Vote (Resident): `GET /api/polls/`, `POST /api/polls/{id}/vote/`
    - Manage (Admin): `GET /api/polls/`, `POST /api/polls/`, `PATCH /api/polls/{id}/`
- **Events**
    - List (Resident): `GET /api/events/`
    - Manage (Admin): `GET /api/events/`, `POST /api/events/`, `PATCH /api/events/{id}/`
- **Packages**
    - Log (Admin): `POST /api/packages/`
    - View (Resident): `GET /api/packages/`

## 5. Known QA Status

- **Security Vulnerability**: A critical security vulnerability in poll creation was identified and fixed. Non-staff users could create polls.
- **Frontend Tests**: Frontend tests have environment issues (JSDOM `matchMedia` and mocks) that cause them to fail even when the code works.
- **Missing Dependency**: `psycopg2-binary` was missing from `requirements.txt` and has been added.
- **Bug in Maintenance Detail**: **[FIXED]** The "Manage request" controls on the maintenance detail page for Admin/Manager roles were not working correctly. The click did not navigate to the detail route.
- **OAuth**: **[FIXED]** The user mentioned that OAuth is broken. `dj-rest-auth` and `allauth` are installed but not configured. This has been fixed.
