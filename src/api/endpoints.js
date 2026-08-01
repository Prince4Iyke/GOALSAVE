// One function per backend endpoint. See API_INTEGRATION.md at the project
// root for the full request/response contract each of these expects.
//
// NOTE: This file has been patched to match the ACTUAL routes implemented
// in Goalsave-api (see backend routes/index.js). Several endpoints the
// frontend originally called do not exist on the backend yet — those are
// marked with TODO below. Do not ship without resolving those.
//
// Every function here does exactly one job: call `request()` with the right
// method/path/body and return the parsed JSON. No React, no app state — this
// file can be unit-tested or swapped out on its own.

import { request, setToken } from "./client";

/* --------------------------------- AUTH ---------------------------------- */

export const AuthAPI = {
  // POST /api/auth/register { firstName, lastName, email, password } -> { token, user }
  // Backend route is /register, not /signup — renamed here to match.
  signup: async (payload) => {
    const data = await request("/auth/register", { method: "POST", body: payload, auth: false });
    if (data?.token) setToken(data.token);
    return data;
  },

  // POST /api/auth/login { email, password } -> { token, user }
  login: async (payload) => {
    const data = await request("/auth/login", { method: "POST", body: payload, auth: false });
    if (data?.token) setToken(data.token);
    return data;
  },

  // TODO: GET /api/auth/me does not exist on the backend yet.
  // Backend needs a protected route that decodes the JWT and returns the
  // current user (auth.middleware.js + a small controller method).
  // Left in place so the app doesn't crash on import, but this call WILL
  // 401/404 until the backend route is added.
  me: () => request("/auth/me"),

  logout: () => setToken(null),
};

/* -------------------------------- PROFILE --------------------------------- */

// TODO: No /profile route exists on the backend. The User model likely has
// the fields, but there's no controller/route exposing get/update yet.
// Consider whether this belongs under /api/auth or a new /api/profile module.
export const ProfileAPI = {
  get: () => request("/profile"),
  update: (payload) => request("/profile", { method: "PATCH", body: payload }),
};

/* --------------------------------- WALLETS ---------------------------------- */

export const WalletsAPI = {
  // GET /api/wallets -> [ Wallet ]
  list: () => request("/wallets"),

  // POST /api/wallets { name, balance?, currency?, color?, icon? } -> Wallet
  // Confirmed against wallet.validator.js — only `name` is required;
  // balance/currency/color/icon all default server-side if omitted.
  create: (payload) => request("/wallets", { method: "POST", body: payload }),
};

/* -------------------------------- CATEGORIES --------------------------------- */

export const CategoriesAPI = {
  // GET /api/categories -> [ Category ]
  list: () => request("/categories"),

  // POST /api/categories { name, type, color?, icon? } -> Category
  // Confirmed against category.validator.js — `name` and `type` are
  // required; type must be exactly "Income" or "Expense". Categories are
  // scoped by type, so a category created for one won't show up as valid
  // for the other.
  create: (payload) => request("/categories", { method: "POST", body: payload }),
};

/* --------------------------------- BUDGET ---------------------------------- */

// Confirmed against backend budget.router.js and budget.validator.js: the
// router only exposes POST /, GET /, GET /:id, PATCH /:id, DELETE /:id (no
// PUT), and each Budget document is ONE CATEGORY's budget — { title,
// category: ObjectId, amount, startDate, endDate } — not a single object
// holding income/currency/allocations for the whole user. The old `save()`
// called a nonexistent `PUT /budgets` with the wrong shape entirely.
export const BudgetAPI = {
  // GET /api/budgets -> [ Budget ] (one per category the user has budgeted)
  // Backend mounts this router as /budgets (plural) — see routes/index.js.
  get: () => request("/budgets"),

  // POST /api/budgets { title, category, amount, startDate, endDate } -> Budget
  // Matches router.post("/", validate(createBudgetSchema), ...). One call
  // per category being budgeted.
  create: (payload) => request("/budgets", { method: "POST", body: payload }),

  // PATCH /api/budgets/:id { title?, category?, amount?, startDate?, endDate?, status?, isActive? } -> Budget
  // Matches router.patch("/:id", validate(updateBudgetSchema), ...).
  update: (id, payload) => request(`/budgets/${id}`, { method: "PATCH", body: payload }),
};

/* ------------------------------ TRANSACTIONS ------------------------------- */

export const TransactionsAPI = {
  // GET /api/transactions?search=&page=&limit= -> paginated transactions
  // Backend mounts this router as /transactions (plural) — see routes/index.js.
  // Query param names still need confirming against transaction.validator.js —
  // backend docs mention search/page/limit, not category/sort, so double-check
  // before relying on those filters.
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "All")
    ).toString();
    return request(`/transactions${qs ? `?${qs}` : ""}`);
  },

  // POST /api/transactions -> Transaction
  // Confirmed against transaction.validator.js:
  // { wallet: ObjectId, category: ObjectId, type: "Income"|"Expense",
  //   amount: number, savingsGoal?: ObjectId|null, description?: string,
  //   transactionDate?: date }
  create: (payload) => request("/transactions", { method: "POST", body: payload }),
};

/* --------------------------------- GOALS ------------------------------------ */

// Backend calls this module "savings," not "goals" — renamed accordingly.
export const GoalsAPI = {
  // GET /api/savings -> [ Goal ] (with progress %)
  list: () => request("/savings"),

  // POST /api/savings { title, targetAmount } -> Goal
  // Confirmed against savings.validator.js (createSavingsSchema) via a live
  // 400 response — the backend requires `title`/`targetAmount`, NOT
  // `name`/`target` as this used to say.
  create: (payload) => request("/savings", { method: "POST", body: payload }),

  // PATCH /api/savings/:id/contribute { amount } -> Goal
  // Confirmed against backend routes/savings.routes.js — this route is
  // registered as PATCH, not PUT. A PUT here 404s with "Route not found"
  // since Express won't match a route across methods.
  contribute: (goalId, payload) =>
    request(`/savings/${goalId}/contribute`, { method: "PATCH", body: payload }),

  // TODO: No /goals/history (or /savings/history) route exists on the
  // backend. If you need a contribution history view, either add that
  // route on the backend or derive it from GET /api/savings itself if the
  // response already includes a contribution log per goal.
  history: () => request("/savings/history"),
};

/* ----------------------------- NOTIFICATIONS -------------------------------- */

// TODO: No /notifications module exists on the backend at all (not in
// routes/, controllers/, services/, or models/). This whole feature needs
// to be built server-side before these calls will work.
export const NotificationsAPI = {
  list: () => request("/notifications"),
  markRead: (id) => request(`/notifications/${id}`, { method: "PATCH", body: { unread: false } }),
  markAllRead: () => request("/notifications/read-all", { method: "PATCH" }),
};

/* -------------------------------- SECURITY ----------------------------------- */

// TODO: No /security module exists on the backend either (not in routes/,
// controllers/, services/, or models/). Same situation as notifications —
// needs to be built server-side (biometric/2FA/device/login-history
// tracking) before this will return anything but 404.
export const SecurityAPI = {
  get: () => request("/security"),
  update: (payload) => request("/security", { method: "PATCH", body: payload }),
};