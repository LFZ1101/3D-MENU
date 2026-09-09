import type { CSSProperties } from 'react';
import type { Restaurant } from '@menuar/shared';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace('#', '').trim();
  if (![3, 6].includes(cleaned.length)) return null;
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return null;
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const r = channel(rgb.r);
  const g = channel(rgb.g);
  const b = channel(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colors */
export function contrastRatio(a: string, b: string): number | null {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  if (l1 == null || l2 == null) return null;
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function safeRestaurantColors(
  restaurant: Pick<Restaurant, 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor'>,
) {
  const primary = restaurant.primaryColor || '#39D7A2';
  const secondary = restaurant.secondaryColor || '#118A68';
  let background = restaurant.backgroundColor || '#F4F7F6';
  let text = restaurant.textColor || '#1D292F';

  const ratio = contrastRatio(text, background);
  if (ratio != null && ratio < 4.5) {
    // Fallback seguro: texto escuro em papel claro
    background = '#F4F7F6';
    text = '#1D292F';
  }

  const primaryOnPaper = contrastRatio(primary, background);
  const action = primaryOnPaper != null && primaryOnPaper < 3 ? secondary : primary;

  return { primary: action, secondary, background, text };
}

export function restaurantThemeStyle(
  restaurant: Pick<Restaurant, 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor'>,
): CSSProperties {
  const colors = safeRestaurantColors(restaurant);
  return {
    ['--restaurant-primary' as string]: colors.primary,
    ['--restaurant-secondary' as string]: colors.secondary,
    ['--restaurant-bg' as string]: colors.background,
    ['--restaurant-fg' as string]: colors.text,
    background: 'var(--restaurant-bg)',
    color: 'var(--restaurant-fg)',
  };
}
