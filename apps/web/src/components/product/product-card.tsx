import { formatBRL, formatServes } from '@menuar/shared';
import type { Product } from '@menuar/shared';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ProductCard({
  product,
  restaurantSlug,
  className,
}: {
  product: Product;
  restaurantSlug: string;
  className?: string;
}) {
  const serves = formatServes(product.servesMin, product.servesMax);

  return (
    <Link
      to={`/r/${restaurantSlug}/p/${product.slug}`}
      className={cn(
        'group overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-soft',
        !product.isAvailable && 'opacity-70',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink to-surface-dark">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            width={640}
            height={480}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-end p-4">
            <div className="h-24 w-24 rounded-full bg-jade/20 blur-2xl" />
            <p className="absolute bottom-4 left-4 font-display text-lg text-white/90">{product.name}</p>
          </div>
        )}
        {product.has3d ? (
          <Badge className="absolute left-3 top-3 border-0 bg-jade text-ink">Ver em 3D</Badge>
        ) : null}
        {!product.isAvailable ? (
          <Badge className="absolute right-3 top-3 border-0 bg-ink text-white">Indisponível</Badge>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-ink">{product.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-jade-dark">
            {formatBRL(product.priceCents)}
          </span>
        </div>
        {product.shortDescription ? (
          <p className="line-clamp-2 text-sm text-muted">{product.shortDescription}</p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {serves ? <Badge>{serves}</Badge> : null}
          {product.isVegetarian ? <Badge>Vegetariano</Badge> : null}
          {product.isSpicy ? <Badge>Picante</Badge> : null}
        </div>
      </div>
    </Link>
  );
}
