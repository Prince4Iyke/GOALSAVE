# API Integration Guide

This document is for whoever builds the backend for GoalSave. The frontend
is already wired to call these endpoints — you just need to implement a
server that responds with these shapes, at these paths.

## How the frontend decides mock vs. real data

Two environment variables control this (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:4000/api/v1/
VITE_USE_MOCK_DATA=true
```

- **`VITE_USE_MOCK_DATA=true`** (default) — the app never calls the network.
  It runs entirely on in-memory seed data from `src/data.js`. This is what
  lets frontend work continue while the backend doesn't exist yet.
- **`VITE_USE_MOCK_DATA=false`** — every action below calls the real API at
  `VITE_API_BASE_URL`. If a request fails, the app shows a toast with the
  error message and keeps whatever it had locally — it does not crash.

Flip the switch by copying `.env.example` to `.env` and editing it.

## Where this lives in the code

- `src/api/client.js` — the fetch wrapper. Attaches `Authorization: Bearer
  <token>` automatically (token is stored in `localStorage` after
  login/signup/OTP verification). Throws `ApiError` (with `.status` and
  `.message`) on any non-2xx response or network failure.
- `src/api/endpoints.js` — one function per endpoint below, grouped by
  resource (`AuthAPI`, `ProfileAPI`, `BudgetAPI`, `TransactionsAPI`,
  `IncomeAPI`, `GoalsAPI`, `NotificationsAPI`, `SecurityAPI`).
- `src/context/AppContext.jsx` — calls those functions from the actual user
  actions (login, save expense, contribute to a goal, etc.) and updates
  the UI from the response.

If you change a response shape, `src/context/AppContext.jsx` is the only
place that needs to change to match — no screen file touches the API
directly.

## Auth

All endpoints below except `/auth/*` require `Authorization: Bearer <token>`.

### `POST /auth/signup`
Request:
```json
{ "fullName": "Faith Adaeze", "email": "faith@example.com", "phone": "08012345678", "password": "Passw0rd!" }
```
Response: `200 OK`, body not required to contain a token yet (OTP happens next).
```json
{ "userId": "abc123", "phone": "08012345678" }
```

### `POST /auth/verify-otp`
Request:
```json
{ "phone": "08012345678", "code": "123456" }
```
Response:
```json
{
  "token": "eyJhbGciOi...",
  "user": { "name": "Faith Adaeze", "email": "faith@example.com", "phone": "08012345678" }
}
```
The frontend stores `token` in `localStorage` and attaches it to every
future request.

### `POST /auth/resend-otp`
Request: `{ "phone": "08012345678" }` → Response: `{ "success": true }`

### `POST /auth/login`
Request:
```json
{ "phone": "08012345678", "password": "Passw0rd!" }
```
Response: same shape as `verify-otp` — `{ "token": "...", "user": {...} }`

### `POST /auth/forgot-password`
Request: `{ "phone": "08012345678" }` → Response: `{ "success": true }`
(Always return success even if the phone isn't registered — don't leak
which numbers exist.)

### `GET /auth/me`
Response: `{ "user": { "name": "...", "email": "...", "phone": "..." } }`
Used to restore the session on page refresh.

---

## Profile

### `GET /profile`
Response: `{ "name": "Faith Adaeze", "email": "faith@example.com", "phone": "08012345678" }`

### `PATCH /profile`
Request: any subset of `{ "name", "email", "phone" }` → Response: the
updated `{ name, email, phone }`.

---

## Budget

### `GET /budget`
Response:
```json
{
  "income": 245000,
  "currency": "Nigerian Naira (\u20a6)",
  "categories": [
    { "key": "Food", "label": "Food & Dining", "checked": true }
  ],
  "allocations": { "Food": 60000, "Transport": 30000 }
}
```
Note: `categories` on the frontend also carries an `icon` component that
isn't serializable — the frontend merges your `categories` response into
its existing icon map by `key`, so you only need to send `key`, `label`,
and `checked`.

### `PUT /budget`
Request: same shape as the `GET` response → Response: the saved version
(echo it back).

---

## Transactions

### `GET /transactions`
Query params (all optional): `?category=Food&search=lunch&sort=newest`
Response: an array of:
```json
{
  "id": 1,
  "cat": "Food",
  "name": "Lunch",
  "place": "Restaurant",
  "amount": 2500,
  "date": "2026-07-28",
  "time": "12:45 PM",
  "group": "Today, 28 Jul"
}
```
`group` is a display label the frontend uses to header-group the list
("Today, 28 Jul" / "Yesterday, 27 Jul" / "3 Jul"). Compute it server-side
however you like, or return the raw `date` and let the frontend derive it
(the helper is `src/utils.js` → `shortGroupDate`).

### `POST /transactions`
Request:
```json
{ "cat": "Food", "name": "Lunch", "place": "Food", "amount": 2500, "date": "2026-07-28", "time": "12:45 PM" }
```
Response: the created transaction (same shape as above, with a real `id`).

---

## Income

### `POST /income`
Request:
```json
{ "amount": 150000, "source": "Salary", "account": "Main wallet", "date": "2026-07-28", "note": "July salary" }
```
Response: `{ "totalIncome": 395000 }` — the new running total. The frontend
sets its displayed Total Income directly from this number.

---

## Goals

### `GET /goals`
Response: an array of:
```json
{ "id": 1, "name": "Emergency Fund", "saved": 120000, "target": 500000, "due": "12th January, 2027", "featured": true }
```
`featured` marks the goal shown at the top of the Goals screen (there
should be exactly one). Other goals render in the "Others" list. Icons are
assigned client-side by name — if you introduce brand-new goal names,
they'll fall back to a generic icon.

### `POST /goals`
Request: `{ "name": "New Laptop", "target": 350000 }`
Response: the created goal — `{ "id", "name", "saved": 0, "target" }`.

### `POST /goals/:id/contributions`
Request: `{ "amount": 20000 }`
Response:
```json
{
  "goal": { "id": 1, "name": "Emergency Fund", "saved": 140000, "target": 500000 },
  "entry": { "id": 501, "goalName": "Emergency Fund", "amount": 20000, "time": "2:14 PM" }
}
```

### `GET /goals/history`
Response: an array of `{ "id", "goalName", "amount", "time" }` — used for
the "My saving history" list (most recent first).

---

## Notifications

### `GET /notifications`
Response: an array of:
```json
{
  "id": 1,
  "type": "Overspending Alert",
  "body": "You've spent 90% of your daily budget for Food.",
  "when": "10:30 AM",
  "group": "Today",
  "unread": true,
  "cat": "Alerts"
}
```
`cat` must be one of: `Alerts`, `Bills`, `Goals`, `Security` — the
frontend uses it both for the filter pills and to decide where tapping a
notification navigates to.

### `PATCH /notifications/:id`
Request: `{ "unread": false }` → Response: the updated notification.

### `PATCH /notifications/read-all`
No body → Response: `{ "success": true }`.

---

## Security

### `GET /security`
Response:
```json
{
  "biometricEnabled": true,
  "twoFactorEnabled": true,
  "securityScore": "Strong",
  "devices": 3,
  "loginHistory": []
}
```

### `PATCH /security`
Request: any subset of `{ "biometricEnabled", "twoFactorEnabled" }` →
Response: the updated settings object.

---

## Error format

Any non-2xx response should return JSON with a human-readable message:

```json
{ "message": "That phone number is already registered." }
```

The frontend shows `message` directly to the user (in a form's inline
error, or in the toast banner), so keep it short and end-user friendly —
not a stack trace or an error code.

## What's intentionally NOT covered

Google/Apple sign-in, Bank Accounts, Preferences, Change Password, Device
Management, Login History detail, and Help Center are UI-complete in the
frontend but currently just show a "not available in this demo yet"
message — there's no endpoint contract for them yet because they weren't
in scope for this pass. Happy to spec those out the same way once you're
ready for them.
