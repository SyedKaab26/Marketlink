import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProductSlug, resolveProductImage } from './product-helpers.ts';

test('buildProductSlug removes invalid characters and trims dashes', () => {
  assert.equal(buildProductSlug('  Fresh Mango & Banana  '), 'fresh-mango-banana');
  assert.equal(buildProductSlug('---Apple---'), 'apple');
});

test('resolveProductImage falls back to the default image when removed or blank', () => {
  assert.match(resolveProductImage(''), /images.unsplash.com/);
  assert.equal(resolveProductImage('https://example.com/pic.jpg'), 'https://example.com/pic.jpg');
});
