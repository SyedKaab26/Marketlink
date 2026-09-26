const STORAGE_KEY = 'marketlink_current_user';

export function getStoredUser() {
  if (typeof window === 'undefined') return null;

  try {
    const rawUser = window.localStorage.getItem(STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') return;

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
