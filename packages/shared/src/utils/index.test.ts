import { describe, expect, it } from 'vitest';
import {
  buildMenuPath,
  buildProductPath,
  canEditMenu,
  formatBRL,
  formatServes,
  isSubscriptionBlocked,
  scaleLabel,
  slugify,
} from './index.js';

describe('slugify', () => {
  it('normalizes accents and spaces', () => {
    expect(slugify('Burger Brasa Especial')).toBe('burger-brasa-especial');
    expect(slugify('Açaí & Cia')).toBe('acai-cia');
  });
});

describe('formatBRL', () => {
  it('formats cents as BRL', () => {
    expect(formatBRL(4590)).toMatch(/R\$\s*45,90/);
  });
});

describe('formatServes', () => {
  it('handles ranges and singles', () => {
    expect(formatServes(2, 3)).toBe('Serve 2 a 3 pessoas');
    expect(formatServes(1, 1)).toBe('Serve 1 pessoa');
  });
});

describe('permissions', () => {
  it('allows editors to change menu', () => {
    expect(canEditMenu('editor')).toBe(true);
    expect(canEditMenu('viewer')).toBe(false);
  });
});

describe('subscription helpers', () => {
  it('blocks suspended accounts', () => {
    expect(isSubscriptionBlocked('suspended')).toBe(true);
    expect(isSubscriptionBlocked('active')).toBe(false);
  });
});

describe('paths and scale', () => {
  it('builds public paths', () => {
    expect(buildMenuPath('casa-fogo')).toBe('/r/casa-fogo');
    expect(buildProductPath('casa-fogo', 'burger-brasa')).toBe('/r/casa-fogo/p/burger-brasa');
  });

  it('labels scale correctly', () => {
    expect(scaleLabel(false)).toContain('aproximada');
    expect(scaleLabel(true)).toContain('revisada');
  });
});
