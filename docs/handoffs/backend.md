Date: 2026-01-23
Branch + commit hash: main @ TBD
What changed:
- Refresh endpoint aligned to SimpleJWT access-only response (disabled refresh rotation).
- Added refresh contract assertion in auth tests.

Tests run:
- source backend_env/bin/activate && python manage.py migrate (OK; NotOpenSSLWarning from urllib3/LibreSSL)
- source backend_env/bin/activate && python manage.py test (PASS; 51 tests; warnings for naive datetimes in Event.date and Package.pickup_date + NotOpenSSLWarning)

Notes:
- Test warnings persist: urllib3 NotOpenSSLWarning (LibreSSL) and naive datetime RuntimeWarning for Event.date and Package.pickup_date.
