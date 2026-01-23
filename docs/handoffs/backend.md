Date: 2026-01-23
Branch + commit hash: main @ 2013f1e
Endpoints implemented:
- POST /api/token/ (email login with user fields)
- POST /api/token/refresh/
- GET /api/me
- GET /api/health
RBAC:
- Resident endpoints restricted to admin/manager

Tests run:
- source backend_env/bin/activate && python manage.py migrate (OK; NotOpenSSLWarning from urllib3/LibreSSL)
- source backend_env/bin/activate && python manage.py test (PASS; 51 tests; warnings for naive datetimes in Event.date and Package.pickup_date + NotOpenSSLWarning)

Known issues/blockers:
- Test warnings: urllib3 NotOpenSSLWarning (LibreSSL) and naive datetime RuntimeWarning for Event.date and Package.pickup_date.
