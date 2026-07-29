// One function per backend endpoint. See API_INTEGRATION.md at the project
// root for the full request/response contract each of these expects.
//
// Every function here does exactly one job: call `request()` with the right
// method/path/body and return the parsed JSON. No React, no app state — this
// file can be unit-tested or swapped out on its own.

import { request, setToken } from "./client";

/* --------------------------------- AUTH ---------------------------------- */

export const AuthAPI = {
  // POST /auth/signup { fullName, email, phone, password } -> { userId, phone }
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload, auth: false }),

  // POST /auth/verify-otp { phone, code } -> { token, user }
  verifyOtp: async (payload) => {
    const data = await request("/auth/verify-otp", { method: "POST", body: payload, auth: false });
    if (data?.token) setToken(data.token);
    return data;
  },

  // POST /auth/resend-otp { phone } -> { success: true }
  resendOtp: (payload) => request("/auth/resend-otp", { method: "POST", body: payload, auth: false }),

  // POST /auth/login { phone, password } -> { token, user }
  login: async (payload) => {
    const data = await request("/auth/login", { method: "POST", body: payload, auth: false });
    if (data?.token) setToken(data.token);
    return data;
  },

  // POST /auth/forgot-password { phone } -> { success: true }
  forgotPassword: (payload) => request("/auth/forgot-password", { method: "POST", body: payload, auth: false }),

  // GET /auth/me -> { user }
  me: () => request("/auth/me"),

  logout: () => setToken(null),
};

/* -------------------------------- PROFILE --------------------------------- */

export const ProfileAPI = {
  // GET /profile -> { name, email, phone }
  get: () => request("/profile"),

  // PATCH /profile { name, email, phone } -> { name, email, phone }
  update: (payload) => request("/profile", { method: "PATCH", body: payload }),
};

/* --------------------------------- BUDGET ---------------------------------- */

export const BudgetAPI = {
  // GET /budget -> { income, currency, categories, allocations }
  get: () => request("/budget"),

  // PUT /budget { income, currency, categories, allocations } -> same shape
  save: (payload) => request("/budget", { method: "PUT", body: payload }),
};

/* ------------------------------ TRANSACTIONS ------------------------------- */

export const TransactionsAPI = {
  // GET /transactions?category=Food&search=lunch&sort=newest -> [ Transaction ]
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "All")
    ).toString();
    return request(`/transactions${qs ? `?${qs}` : ""}`);
  },

  // POST /transactions { cat, name, place, amount, date, time } -> Transaction
  create: (payload) => request("/transactions", { method: "POST", body: payload }),
};

/* --------------------------------- INCOME ----------------------------------- */

export const IncomeAPI = {
  // POST /income { amount, source, account, date, note } -> { totalIncome }
  add: (payload) => request("/income", { method: "POST", body: payload }),
};

/* --------------------------------- GOALS ------------------------------------ */

export const GoalsAPI = {
  // GET /goals -> [ Goal ]
  list: () => request("/goals"),

  // POST /goals { name, target } -> Goal
  create: (payload) => request("/goals", { method: "POST", body: payload }),

  // POST /goals/:id/contributions { amount } -> { goal: Goal, entry: HistoryEntry }
  contribute: (goalId, payload) =>
    request(`/goals/${goalId}/contributions`, { method: "POST", body: payload }),

  // GET /goals/history -> [ HistoryEntry ]
  history: () => request("/goals/history"),
};

/* ----------------------------- NOTIFICATIONS -------------------------------- */

export const NotificationsAPI = {
  // GET /notifications -> [ Notification ]
  list: () => request("/notifications"),

  // PATCH /notifications/:id { unread: false } -> Notification
  markRead: (id) => request(`/notifications/${id}`, { method: "PATCH", body: { unread: false } }),

  // PATCH /notifications/read-all -> { success: true }
  markAllRead: () => request("/notifications/read-all", { method: "PATCH" }),
};

/* -------------------------------- SECURITY ----------------------------------- */

export const SecurityAPI = {
  // GET /security -> { biometricEnabled, twoFactorEnabled, securityScore, devices, loginHistory }
  get: () => request("/security"),

  // PATCH /security { biometricEnabled?, twoFactorEnabled? } -> same shape
  update: (payload) => request("/security", { method: "PATCH", body: payload }),
};
