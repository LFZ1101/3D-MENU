import type { CSSProperties } from 'react';
import { formatBRL, formatServes } from '@menuar/shared';
import type { Product } from '@menuar/shared';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function ProductCard({
  product,
  restaurantSlug,
  className,
  style,
}: {
  product: Product;
  restaurantSlug: string;
  className?: string;
  style?: CSSProperties;
}) {
  const serves = formatServes(product.servesMin, product.servesMax);

  return (
    <Link
      to={`/r/${restaurantSlug}/p/${product.slug}`}
      style={style}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-white/80 shadow-soft ring-1 ring-black/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-lift',
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
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_30%_20%,rgba(47,214,160,0.35),transparent_45%),linear-gradient(160deg,#071014,#152025)] p-5">
            <p className="font-display text-2xl font-semibold text-white/90">{product.name}</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          {product.has3d ? (
            <span className="rounded-md bg-[var(--restaurant-primary,#2fd6a0)] px-2 py-1 text-xs font-bold text-ink">
              Ver em 3D
            </span>
          ) : (
            <span />
          )}
          {!product.isAvailable ? (
            <span className="rounded-md bg-ink/80 px-2 py-1 text-xs font-semibold text-white">
              Indisponível
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{product.name}</h3>
          <span className="shrink-0 text-sm font-bold text-[var(--restaurant-secondary,#0f8f6c)]">
            {formatBRL(product.priceCents)}
          </span>
        </div>
        {product.shortDescription ? (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
        ) : null}
        {(serves || product.isVegetarian || product.isSpicy) && (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted/90">
            {[serves, product.isVegetarian ? 'Vegetariano' : null, product.isSpicy ? 'Picante' : null]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>
    </Link>
  );
}
