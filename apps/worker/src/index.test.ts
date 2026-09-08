import { describe, expect, it } from 'vitest';
import app from './index';

describe('worker health', () => {
  it('returns ok', async () => {
    const response = await app.request('/health');
    expect(response.status).toBe(200);
    const json = (await response.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});

describe('analytics validation', () => {
  it('rejects invalid events', async () => {
    const response = await app.request('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: 'not_allowed' }),
    });
    expect(response.status).toBe(400);
  });
});

describe('qr resolve', () => {
  it('returns mock qr contract without supabase', async () => {
    const response = await app.request('/api/qr/mesa12');
    expect(response.status).toBe(200);
    const json = (await response.json()) as { qr: { short_code: string; mock?: boolean } };
    expect(json.qr.short_code).toBe('mesa12');
    expect(json.qr.mock).toBe(true);
  });
});

describe('upload sign', () => {
  it('requires auth', async () => {
    const response = await app.request('/api/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(401);
  });

  it('validates payload', async () => {
    const response = await app.request('/api/uploads/sign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test',
      },
      body: JSON.stringify({
        restaurantId: '11111111-1111-4111-8111-111111111111',
        key: 'restaurants/11111111-1111-4111-8111-111111111111/products/p1/images/a.webp',
        contentType: 'image/webp',
        sizeBytes: 1024,
        kind: 'image',
      }),
    });
    expect(response.status).toBe(200);
  });
});
