// Thin fetch wrapper shared by every endpoint function in endpoints.js.
//
// Configuration (see .env.example):
//   VITE_API_BASE_URL   e.g. http://localhost:4000/api
//   VITE_USE_MOCK_DATA   "true" (default) keeps the app fully working with
//                         in-memory seed data and no network calls at all —
//                         useful while the backend doesn't exist yet or is down.
//                         Set to "false" once real endpoints are ready.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
export const USE_MOCK_DATA = (import.meta.env.VITE_USE_MOCK_DATA ?? "true") !== "false";

const TOKEN_KEY = "goalsave_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage errors (e.g. private browsing) */
  }
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Core request helper. Throws ApiError on any non-2xx response or network failure.
 * Every function in endpoints.js is a thin, typed wrapper around this.
 */
export async function request(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      "Couldn't reach the server. Check your connection or that the API is running.",
      0,
      null
    );
  }

  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${response.status})`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
