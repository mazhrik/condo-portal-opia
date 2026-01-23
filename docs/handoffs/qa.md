Date: 2026-01-23
Phase: 1
Branch: main
Commit: a67122e471b8c3d65f142b327e7226490432eab2
QA Status: BLOCKED

Bugs open:
- None

What was tested:
- Phase 1 API: announcements list/detail, RBAC 403/404, create/update/deactivate, inactive filter
- Phase 1 API: dashboard summary shape + counts (core.tests.test_announcements_dashboard + APIClient smoke)

Gaps:
- UI tests (manual browser smoke) not executed in this environment
