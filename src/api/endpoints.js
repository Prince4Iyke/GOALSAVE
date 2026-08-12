

import { request, setToken } from "./client";

/* --------------------------------- AUTH ---------------------------------- */

export const AuthAPI = {
  signup: async (payload) => {
    const data = await request("/auth/signup", {
      method: "POST",
      body: payload,
      auth: false,
    });

    if (data?.token) {
      setToken(data.token);
    }

    return data;
  },

  login: async (payload) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });

    if (data?.token) {
      setToken(data.token);
    }

    return data;
  },

  me: () => request("/auth/me"),

  logout: () => {setToken(null);
  },
};

/* -------------------------------- PROFILE --------------------------------- */


export const ProfileAPI = {
  get: () => request("/users/profile"),

  update: (payload) =>
    request("/users/profile", {
      method: "PATCH",
      body: payload,
    }),
};

/* --------------------------------- WALLETS ---------------------------------- */

export const WalletsAPI = {
  list: () => request("/wallets"),

  get: (id) => request(`/wallets/${id}`),

  create: (payload) =>
    request("/wallets", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    request(`/wallets/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id) =>
    request(`/wallets/${id}`, {
      method: "DELETE",
    }),

  setDefault: (id) =>
    request(`/wallets/${id}/default`, {
      method: "PATCH",
    }),
};

/* -------------------------------- CATEGORIES --------------------------------- */

export const CategoriesAPI = {
  list: () => request("/categories"),

  get: (id) => request(`/categories/${id}`),

  create: (payload) =>
    request("/categories", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    request(`/categories/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),
};

/* --------------------------------- BUDGET ---------------------------------- */


export const BudgetAPI = {
  list: () => request("/budgets"),

  get: (id) =>
    request(`/budgets/${id}`),

  create: (payload) =>
    request("/budgets", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    request(`/budgets/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id) =>
    request(`/budgets/${id}`, {
      method: "DELETE",
    }),
};

/* ------------------------------ TRANSACTIONS ------------------------------- */

export const TransactionsAPI = {
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "All"
      )
    ).toString();

    return request(`/transactions${qs ? `?${qs}` : ""}`);
  },

  get: (id) =>
    request(`/transactions/${id}`),

  create: (payload) =>
    request("/transactions", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    request(`/transactions/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id) =>
    request(`/transactions/${id}`, {
      method: "DELETE",
    }),
};

/* --------------------------------- GOALS ------------------------------------ */


export const GoalsAPI = {
  list: () => request("/savings"),

  get: (id) =>
    request(`/savings/${id}`),

  create: (payload) =>
    request("/savings", {
      method: "POST",
      body: payload,
    }),

  update: (id, payload) =>
    request(`/savings/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  contribute: (id, payload) =>
    request(`/savings/${id}/contribute`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id) =>
    request(`/savings/${id}`, {
      method: "DELETE",
    }),
};

/* ----------------------------- NOTIFICATIONS -------------------------------- */


export const NotificationsAPI = {
  list: () => request("/notifications"),

  get: (id) =>
    request(`/notifications/${id}`),

  create: (payload) =>
    request("/notifications", {
      method: "POST",
      body: payload,
    }),

  markRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllRead: () =>
    request("/notifications/read-all", {
      method: "PATCH",
    }),

  stats: () =>
    request("/notifications/stats"),

  remove: (id) =>
    request(`/notifications/${id}`, {
      method: "DELETE",
    }),
};

export const DashboardAPI = {
  get: () => request("/dashboard"),
};

export const ReportsAPI = {
  monthly: () => request("/reports/monthly"),

  categories: () => request("/reports/categories"),
};

/* -------------------------------- SECURITY -------------------------------- */

export const SecurityAPI = {
  get: () => request("/security"),

  update: (payload) =>
    request("/security", {
      method: "PATCH",
      body: payload,
    }),

  changePassword: (payload) =>
    request("/security/change-password", {
      method: "PATCH",
      body: payload,
    }),
};

