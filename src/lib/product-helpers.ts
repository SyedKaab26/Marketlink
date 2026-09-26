export const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

export function buildProductSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function resolveProductImage(imageUrl?: string | null): string {
  const trimmed = imageUrl?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_PRODUCT_IMAGE;
}
