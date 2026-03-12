/**
 * Shared fetch wrapper that checks response status.
 * On non-OK responses, throws with an error message.
 * The router navigation guard handles 401 session expiry.
 */
export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, { credentials: "include", ...options });
  if (!response.ok) {
    const text = await response.text().catch(() => "Request failed");
    throw new Error(text || `HTTP ${response.status}`);
  }
  return response;
}

export async function apiFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  const response = await apiFetch(url, options);
  return response.json();
}
