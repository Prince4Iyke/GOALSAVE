

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3005/api/v1";
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
 * Sends API requests and returns the unwrapped response data.
 */
export async function request(path, { method = "GET", body, headers = {}, auth = true, timeoutMs = 60000 } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {

    console.log("REQUEST URL:", `${API_BASE_URL}${path}`);
    console.log("METHOD:", method);
    console.log("BODY:", body);

    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (networkErr) {
    const message = networkErr.name === "AbortError"
      ? "Server is taking too long to respond (it may be waking up — try again in a moment)."
      : "Couldn't reach the server. Check your connection or that the API is running.";
    throw new ApiError(message, 0, null);
  } finally {
    clearTimeout(timeoutId);
  }

  const text = await response.text();
const parsed = text ? safeJsonParse(text) : null;

console.log("STATUS:", response.status);
console.log("SERVER RESPONSE:", parsed);

  if (!response.ok) {
    const message =
      (parsed && (parsed.message || parsed.error || (Array.isArray(parsed.errors) && parsed.errors[0]))) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status, parsed);
  }

  
  if (parsed && typeof parsed === "object" && "data" in parsed && "success" in parsed) {
    return parsed.data;
  }

  return parsed;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}