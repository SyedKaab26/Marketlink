import { useMemo, useSyncExternalStore } from 'react';
import { CartItem, Product } from './types';

const CART_STORAGE_KEY = 'marketlink_cart_v1';
const CART_UPDATED_EVENT = 'marketlink_cart_updated';

function getCartSnapshot() {
  try {
    return window.localStorage.getItem(CART_STORAGE_KEY) || '[]';
  } catch {
    return '[]';
  }
}

function subscribeToCart(listener: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CART_UPDATED_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load cart from localStorage', e);
    return [];
  }
}

export function saveStoredCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('marketlink_cart_updated'));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
}

export function addToCart(product: Product, quantity = 1) {
  const current = getStoredCart();
  const existingIndex = current.findIndex(
    (item) => item.product.id === product.id || item.product.name === product.name
  );
  if (existingIndex > -1) {
    current[existingIndex].quantity += quantity;
  } else {
    current.push({ product, quantity });
  }
  saveStoredCart(current);
}

export function updateCartQuantity(productId: number | string, delta: number) {
  const current = getStoredCart();
  const updated = current
    .map((item) => {
      if (item.product.id === productId || item.product.name === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    })
    .filter(Boolean) as CartItem[];
  saveStoredCart(updated);
}

export function clearCart() {
  saveStoredCart([]);
}

export function useCart() {
  const storedCart = useSyncExternalStore(subscribeToCart, getCartSnapshot, () => '[]');
  const cartItems = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(storedCart);
      return Array.isArray(parsed) ? parsed as CartItem[] : [];
    } catch {
      return [];
    }
  }, [storedCart]);
  const setCartItems = (items: CartItem[] | ((current: CartItem[]) => CartItem[])) => {
    saveStoredCart(typeof items === 'function' ? items(getStoredCart()) : items);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    setCartItems,
    totalCartCount,
    addToCart,
    updateQuantity: updateCartQuantity,
    clearCart,
  };
}
