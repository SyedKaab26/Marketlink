import test from 'node:test';
import assert from 'node:assert/strict';
import { getStoredUser, setStoredUser, clearStoredUser } from './auth.js';
import { hashPassword, verifyPassword } from './password.ts';

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

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage, dispatchEvent: () => true },
  });

  const user = { id: 1, email: 'admin@marketlink.pk', full_name: 'Admin', role: 'admin' as const };

  setStoredUser(user);
  assert.deepEqual(getStoredUser(), user);

  clearStoredUser();
  assert.equal(getStoredUser(), null);
});

test('passwords are salted, verifiable and support legacy migration', async () => {
  const password = 'a-long-test-password';
  const firstHash = await hashPassword(password);
  const secondHash = await hashPassword(password);

  assert.notEqual(firstHash, secondHash);
  assert.equal(await verifyPassword(password, firstHash), true);
  assert.equal(await verifyPassword('wrong-password', firstHash), false);
  assert.equal(await verifyPassword('legacy-password', 'legacy-password'), true);
});
