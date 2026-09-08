import { describe, expect, it } from 'vitest';
import { canEditMenu, formatBRL, isAllowedMime, ALLOWED_IMAGE_MIME } from '@menuar/shared';

describe('shared commercial helpers via web', () => {
  it('formats money and checks permissions', () => {
    expect(formatBRL(14900)).toMatch(/149,00/);
    expect(canEditMenu('manager')).toBe(true);
    expect(isAllowedMime('image/webp', ALLOWED_IMAGE_MIME)).toBe(true);
  });
});
