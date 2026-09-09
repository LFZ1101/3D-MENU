import { describe, expect, it } from 'vitest';
import { contrastRatio, safeRestaurantColors } from '@/lib/restaurant-theme';

describe('restaurant-theme', () => {
  it('calcula contraste entre preto e branco', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeGreaterThan(20);
  });

  it('faz fallback quando texto e fundo têm contraste insuficiente', () => {
    const colors = safeRestaurantColors({
      primaryColor: '#39D7A2',
      secondaryColor: '#118A68',
      backgroundColor: '#eeeeee',
      textColor: '#dddddd',
    });
    expect(colors.background).toBe('#F4F7F6');
    expect(colors.text).toBe('#1D292F');
  });

  it('preserva cores legíveis', () => {
    const colors = safeRestaurantColors({
      primaryColor: '#39D7A2',
      secondaryColor: '#118A68',
      backgroundColor: '#F4F7F6',
      textColor: '#1D292F',
    });
    expect(colors.background).toBe('#F4F7F6');
    expect(colors.text).toBe('#1D292F');
  });
});
