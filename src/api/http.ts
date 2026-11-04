import type { FieldError } from './types';

export const TOKEN_KEY = 'soulie_token';
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  if (!text) {
    if (res.status === 401) return 'Faça login para continuar.';
    if (res.status === 403) return 'Acesso negado.';
    if (res.status === 404) return 'Não encontramos o que você procurou.';
    if (res.status === 429) return 'Muitas requisições. Tente de novo em instantes.';
    return `Algo deu errado (${res.status}).`;
  }

  try {
    const json: unknown = JSON.parse(text);
    if (Array.isArray(json) && json.length && typeof json[0] === 'object' && json[0] !== null) {
      const first = json[0] as FieldError;
      return first.message || text;
    }
    if (typeof json === 'object' && json !== null && 'message' in json) {
      return String((json as { message: string }).message);
    }
    if (typeof json === 'string') return json;
  } catch {
    return text;
  }

  return text;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  auth?: boolean;
};

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = getToken();

  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const nextHeaders = new Headers(headers);
  if (!isForm && body !== undefined) nextHeaders.set('Content-Type', 'application/json');
  nextHeaders.set('Accept', 'application/json');
  if (auth && token) nextHeaders.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: nextHeaders,
    body: isForm ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    onUnauthorized?.();
    throw new ApiError(await parseError(res), 401);
  }

  if (res.status === 204) return undefined as T;

  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) return undefined as T;
  return res.json() as Promise<T>;
}

export function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return 'Não foi possível falar com o servidor. Confira se a API está no ar.';
}
