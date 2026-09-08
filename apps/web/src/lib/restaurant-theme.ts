import type { CSSProperties } from 'react';
import type { Restaurant } from '@menuar/shared';

export function restaurantThemeStyle(restaurant: Pick<
  Restaurant,
  'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor'
>): CSSProperties {
  return {
    ['--restaurant-primary' as string]: restaurant.primaryColor || 'var(--jade)',
    ['--restaurant-secondary' as string]: restaurant.secondaryColor || 'var(--jade-dark)',
    ['--restaurant-bg' as string]: restaurant.backgroundColor || 'var(--paper)',
    ['--restaurant-fg' as string]: restaurant.textColor || 'var(--text)',
    background: 'var(--restaurant-bg)',
    color: 'var(--restaurant-fg)',
  };
}
