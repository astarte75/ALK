---
phase: 04-core-pages
plan: 05
subsystem: contact-page
tags: [contact, form, nodemailer, api-route, i18n]
dependency_graph:
  requires: [04-01]
  provides: [contact-page, contact-api, contact-form]
  affects: [messages-it, messages-en]
tech_stack:
  added: [nodemailer, "@types/nodemailer"]
  patterns: [api-route, client-form, smtp-fallback]
key_files:
  created:
    - src/app/[locale]/contatti/page.tsx
    - src/components/forms/ContactForm.tsx
    - src/app/api/contact/route.ts
  modified:
    - src/messages/it.json
    - src/messages/en.json
    - package.json
    - package-lock.json
decisions:
  - "SMTP fallback logs to console when env vars not set"
  - "reCAPTCHA v3 structure predisposed but not active"
  - "All emails go to single configurable address"
metrics:
  duration: "2m 35s"
  completed: "2026-03-14"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 4 Plan 5: Contact Page Summary

Contact page with office locations from Contentful, styled form with 6 fields and validation, API route with nodemailer SMTP transport and console fallback when unconfigured.

## What Was Built

### Contact Page (`/contatti`)
- Server Component fetching offices from Contentful via `getOffices(locale)`
- Two-column layout: offices on left, form on right (stacked on mobile)
- Office cards with city name, HQ badge, address, and clickable phone link
- Page heading and subtitle from i18n messages

### Contact Form (Client Component)
- 6 fields: firstName, lastName, email, phone, requestType (select), message (textarea)
- Client-side validation with field-level error messages
- Submission states: idle, submitting, success, error
- Request type dropdown: Investitore / Opportunita / Segreteria
- reCAPTCHA v3 structure in place (token field, comments for integration)
- Styled inputs with focus states, grid layout (2-col for names)

### API Route (`/api/contact`)
- POST handler with JSON body parsing and validation
- Email format validation via regex
- reCAPTCHA verification when `RECAPTCHA_SECRET_KEY` is set
- SMTP transport via nodemailer when `SMTP_HOST` configured
- Console log fallback when SMTP not configured
- HTML + plain text email templates
- Proper error handling with try/catch

### i18n
- Added `contact` namespace to both `it.json` and `en.json`
- 17 translation keys including form labels, states, errors, request types

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 53945bc | Contact page, form component, i18n, nodemailer install |
| 2 | 8844bb9 | API route with nodemailer and SMTP fallback |

## Deviations from Plan

None - plan executed exactly as written.

## Environment Variables Required

| Variable | Purpose | Default |
|----------|---------|---------|
| `SMTP_HOST` | SMTP server hostname | (none - console fallback) |
| `SMTP_PORT` | SMTP port | 587 |
| `SMTP_USER` | SMTP auth username | (none) |
| `SMTP_PASS` | SMTP auth password | (none) |
| `SMTP_SECURE` | Use SSL (port 465) | false |
| `CONTACT_EMAIL_TO` | Recipient address | segreteria@alkemiacapital.com |
| `CONTACT_EMAIL_FROM` | Sender address | noreply@alkemiacapital.com |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret | (none - skipped) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key | (none - skipped) |
