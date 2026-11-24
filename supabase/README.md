# Supabase backend

This folder documents the backend layout for Orasan. Add each directory with its first implementation.

| Location | Purpose |
| --- | --- |
| `migrations/` | Versioned SQL for client, time entry, invoice, and profile tables, with constraints, Row Level Security policies, and Storage policies. |
| `functions/` | Edge Functions for server-side actions such as sending invoice emails through Resend and handling payment webhooks when payments are added. |
| `tests/` | Database tests for ownership boundaries, invoice lifecycle rules, and other database constraints. |

Supabase Auth will handle email/password and Google sign-in. Supabase Storage will hold logos and generated invoice PDFs under policies that enforce ownership.

## Data and access rules

- Store PHP and USD amounts as integer centavos or cents with their currency code.
- Store timestamped events in UTC and display them in the user's timezone. Use a date-only value for an invoice due date.
- Void sent invoices when cancelling them and retain the records.
- Enforce freelancer ownership with Row Level Security, and test that different users cannot access or modify each other's records.
- Keep Resend and payment provider secrets in Edge Functions. Keep service-role keys and other server secrets out of the frontend bundle.
