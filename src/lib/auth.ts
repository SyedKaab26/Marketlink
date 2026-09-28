import { useMemo, useSyncExternalStore } from 'react';
import type { User } from './types';

const STORAGE_KEY = 'marketlink_current_user';
const USER_UPDATED_EVENT = 'marketlink_user_updated';

function subscribeToUser(listener: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', listener);
  window.addEventListener(USER_UPDATED_EVENT, listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener(USER_UPDATED_EVENT, listener);
  };
}

function getUserSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function useStoredUser(): User | null {
  const stored = useSyncExternalStore(subscribeToUser, getUserSnapshot, () => null);
  return useMemo(() => {
    try {
      return stored ? JSON.parse(stored) as User : null;
    } catch {
      return null;
    }
  }, [stored]);
}

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
    window.dispatchEvent(new Event(USER_UPDATED_EVENT));
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  if (user.role === 'admin') {
    window.localStorage.setItem('marketlink_admin_auth', 'true');
  } else {
    window.localStorage.removeItem('marketlink_admin_auth');
  }
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem('marketlink_admin_auth');
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}
