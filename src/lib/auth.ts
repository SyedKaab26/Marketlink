import type { User } from './types';

const STORAGE_KEY = 'marketlink_current_user';

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const rawUser = window.localStorage.getItem(STORAGE_KEY);
    return rawUser ? (JSON.parse(rawUser) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem('marketlink_admin_auth');
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  if (user.role === 'admin') {
    window.localStorage.setItem('marketlink_admin_auth', 'true');
  } else {
    window.localStorage.removeItem('marketlink_admin_auth');
  }
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem('marketlink_admin_auth');
}
