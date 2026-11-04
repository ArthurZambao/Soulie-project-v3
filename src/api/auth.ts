import { request } from './http';
import type {
  ActivityResponse,
  TokenDataJWT,
  UserDataExport,
  UserProfileResponse,
  UserResponse,
  UserSettingsResponse,
} from './types';

export function registerUser(body: { name: string; email: string; password: string }) {
  return request<UserResponse>('/user', { method: 'POST', body, auth: false });
}

export function login(loginEmail: string, password: string) {
  return request<TokenDataJWT>('/login', {
    method: 'POST',
    body: { login: loginEmail, password },
    auth: false,
  });
}

export function getMe() {
  return request<UserProfileResponse>('/v1/users/me');
}

export function updateSettings(body: Partial<UserSettingsResponse>) {
  return request<UserProfileResponse>('/v1/users/me/settings', { method: 'PATCH', body });
}

export function updateAccount(body: { name?: string; email?: string; password?: string }) {
  return request<UserResponse>('/user', { method: 'PUT', body });
}

export function getActivities() {
  return request<ActivityResponse[]>('/v1/users/me/activities');
}

export function createActivity(body: { emoji?: string; label: string; xp?: number }) {
  return request<ActivityResponse>('/v1/users/me/activities', { method: 'POST', body });
}

export function exportMyData() {
  return request<UserDataExport>('/v1/users/me/export');
}

export function deleteMyAccount() {
  return request<void>('/v1/users/me', { method: 'DELETE' });
}

export function getHealth() {
  return request<{ status: string; database: string }>('/health', { auth: false });
}
