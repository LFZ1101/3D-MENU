import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@menuar/shared';

const product: Product = {
  id: 'p1',
  restaurantId: 'r1',
  categoryId: 'c1',
  name: 'Burger Brasa',
  slug: 'burger-brasa',
  shortDescription: 'Blend na brasa',
  description: null,
  priceCents: 4290,
  currency: 'BRL',
  servesMin: 1,
  servesMax: 1,
  widthCm: 14,
  heightCm: 8,
  depthCm: 14,
  ingredients: [],
  allergenNotes: null,
  isVegetarian: false,
  isVegan: false,
  isGlutenFree: false,
  isSpicy: false,
  isFeatured: true,
  isAvailable: true,
  has3d: true,
  sortOrder: 1,
  imageUrl: null,
  posterUrl: null,
  glbUrl: null,
  usdzUrl: null,
  scaleVerified: false,
};

describe('ProductCard', () => {
  it('renders product essentials without loading GLB', () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} restaurantSlug="casa-fogo" />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Burger Brasa' })).toBeInTheDocument();
    expect(screen.getByText('Ver em 3D')).toBeInTheDocument();
    expect(screen.queryByText(/model-viewer/i)).not.toBeInTheDocument();
  });
});
