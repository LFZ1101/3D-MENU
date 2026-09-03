import { describe, expect, it } from 'vitest';
import app from './index';

describe('worker health', () => {
  it('returns ok', async () => {
    const response = await app.request('/health');
    expect(response.status).toBe(200);
    const json = (await response.json()) as { ok: boolean };
    expect(json.ok).toBe(true);
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
