import test from 'node:test';
import assert from 'node:assert/strict';
import { getStoredUser, setStoredUser, clearStoredUser } from './auth.js';

test('auth user is persisted across sessions', () => {
  const store = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => (store.has(key) ? store.get(key) ?? null : null),
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  } as Storage;

  const globalWindow = globalThis as any;
  globalWindow.window = { localStorage };

  const user = { id: 1, email: 'admin@marketlink.pk', full_name: 'Admin', role: 'admin' as const };

  setStoredUser(user);
  assert.deepEqual(getStoredUser(), user);

  clearStoredUser();
  assert.equal(getStoredUser(), null);
});
