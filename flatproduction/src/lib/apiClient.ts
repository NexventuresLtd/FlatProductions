/* Thin fetch wrapper for talking to the FastAPI backend. In dev, VITE_API_URL is
 * left empty and Vite's dev proxy (vite.config.ts) forwards /api and /uploads to
 * http://localhost:8000, so relative paths work with no CORS friction. In prod,
 * set VITE_API_URL to the deployed backend origin. */

export const AUTH_TOKEN_KEY = 'flat_admin_tok';

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try { detail = (await res.json())?.detail ?? detail; } catch { /* not JSON */ }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiGet    = <T,>(path: string) => request<T>('GET', path);
export const apiPost   = <T,>(path: string, body?: unknown) => request<T>('POST', path, body);
export const apiPut    = <T,>(path: string, body?: unknown) => request<T>('PUT', path, body);
export const apiPatch  = <T,>(path: string, body?: unknown) => request<T>('PATCH', path, body);
export const apiDelete = <T,>(path: string) => request<T>('DELETE', path);

export async function apiUploadFile<T>(path: string, file: File): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: form });

  if (!res.ok) {
    let detail = res.statusText;
    try { detail = (await res.json())?.detail ?? detail; } catch { /* not JSON */ }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}
