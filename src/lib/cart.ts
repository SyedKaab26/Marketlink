import { useState, useEffect } from 'react';
import { CartItem, Product } from './types';

const CART_STORAGE_KEY = 'marketlink_cart_v1';

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getStoredCart());
    const handleUpdate = () => {
      setCartItems(getStoredCart());
    };
    window.addEventListener('marketlink_cart_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('marketlink_cart_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

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
