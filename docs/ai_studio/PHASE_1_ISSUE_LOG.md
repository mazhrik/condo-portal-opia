# Phase 1: Issue Log

This document tracks all issues identified during Phase 1 of the project, including their severity, status, and resolution.

---

### P0: Critical

- **Issue**: Broken OAuth and user registration
- **Severity**: P0
- **Affected Roles**: All
- **Route**: `/login`, `/register`
- **Repro Steps**:
    1. Navigate to `/login`.
    2. Attempt to log in with Google.
    3. Attempt to register a new account.
- **Expected**: Users should be able to log in with Google or register a new account.
- **Actual**: The application throws an error and the user is unable to log in or register.
- **Root Cause**: The main `urls.py` file was missing the necessary URL configurations for `django-allauth` and `dj-rest-auth`.
- **Fix Plan**: Update the `condo_backend/urls.py` file to include the required URL patterns.
- **Status**: **RESOLVED**

---

### P1: High

- **Issue**: "Manage request" controls not appearing for staff
- **Severity**: P1
- **Affected Roles**: Admin, Manager
- **Route**: `/maintenance/all`
- **Repro Steps**:
    1. Log in as an admin or manager.
    2. Navigate to `/maintenance/all`.
    3. Click the "Manage" button on a maintenance request.
- **Expected**: The user should be redirected to the maintenance detail page and should see the "Manage request" controls.
- **Actual**: The user is not redirected and the "Manage request" controls are not displayed.
- **Root Cause**: The "Manage" button's `onClick` handler was using `event.preventDefault()` and `event.stopPropagation()`, which prevented the browser from navigating to the detail page.
- **Fix Plan**: Remove the `event.preventDefault()` and `event.stopPropagation()` calls from the `onClick` handler.
- **Status**: **RESOLVED**

---

### P2: Medium

- **Issue**: Inconsistent routing and layout
- **Severity**: P2
- **Affected Roles**: All
- **Route**: All
- **Repro Steps**:
    1. Navigate through the application's routes.
- **Expected**: All routes should have a consistent layout and be organized in a logical manner.
- **Actual**: The resident routes were not nested under the `/resident` path, and some routes were not wrapped in the `AppShell` component.
- **Root Cause**: The `App.tsx` file had an inconsistent routing configuration.
- **Fix Plan**: Update the `App.tsx` file to nest all resident routes under the `/resident` path and to wrap all role-based routes in the `AppShell` component.
- **Status**: **RESOLVED**
