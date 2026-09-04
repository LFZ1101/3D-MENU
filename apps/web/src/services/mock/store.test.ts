import { beforeEach, describe, expect, it } from 'vitest';
import { mockStore } from './store';

describe('mockStore CRUD', () => {
  beforeEach(() => {
    // Store is module-level; tests assert incremental behavior carefully.
  });

  it('creates category and product', () => {
    const category = mockStore.createCategory({ name: 'Entradas Teste' });
    expect(category.slug).toContain('entradas');
    const product = mockStore.createProduct({
      name: 'Bruscheta',
      categoryId: category.id,
      priceCents: 2590,
    });
    expect(product.priceCents).toBe(2590);
    expect(mockStore.getProducts().some((item) => item.id === product.id)).toBe(true);
  });

  it('creates model request and notification', () => {
    const products = mockStore.getProducts();
    const request = mockStore.createModelRequest({
      productId: products[0].id,
      widthCm: 10,
      heightCm: 5,
      depthCm: 10,
      notes: 'teste',
    });
    expect(request.status).toBe('submitted');
    expect(mockStore.getNotifications()[0]?.title).toMatch(/Solicitação 3D/i);
  });

  it('creates qr code and rejects duplicates', () => {
    const code = `mesa-${Date.now().toString().slice(-5)}`;
    const qr = mockStore.createQrCode({
      shortCode: code,
      sourceType: 'table',
      tableLabel: 'Mesa X',
    });
    expect(qr.shortCode).toBe(code);
    expect(() =>
      mockStore.createQrCode({ shortCode: code, sourceType: 'table' }),
    ).toThrow(/já existe/i);
  });
});
