import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { menuRepository } from '@/services/repositories';
import { ProductCard } from '@/components/product/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { restaurantThemeStyle } from '@/lib/restaurant-theme';
import { cn } from '@/lib/utils';

export function MenuPage() {
  const { restaurantSlug = 'casa-fogo' } = useParams();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState<string>('all');
  const [only3d, setOnly3d] = useState(false);
  const { track } = useAnalytics();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['menu', restaurantSlug],
    queryFn: () => menuRepository.getBySlug(restaurantSlug),
  });

  useEffect(() => {
    if (!data) return;
    void track('menu_view', {
      restaurantId: data.restaurant.id,
      source: searchParams.get('src'),
      tableLabel: searchParams.get('mesa'),
      qrCodeId: searchParams.get('qr'),
    });
  }, [data, searchParams, track]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.products.filter((product) => {
      const matchesCategory =
        categorySlug === 'all' ||
        data.categories.find((c) => c.id === product.categoryId)?.slug === categorySlug;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(query.toLowerCase());
      const matches3d = !only3d || product.has3d;
      return matchesCategory && matchesQuery && matches3d;
    });
  }, [categorySlug, data, only3d, query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper">
        <Skeleton className="h-[42vh] w-full rounded-none" />
        <div className="mx-auto grid max-w-5xl gap-4 px-4 py-8 sm:grid-cols-2">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
        <EmptyState
          title="Cardápio não encontrado"
          description="Verifique o link ou o QR Code e tente novamente."
          action={
            <Link to="/demo" className="text-sm font-semibold text-jade-dark">
              Abrir demonstração
            </Link>
          }
        />
      </div>
    );
  }

  const { restaurant, unit, categories } = data;
  const cover =
    restaurant.coverUrl ||
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80';

  return (
    <div className="min-h-screen" style={restaurantThemeStyle(restaurant)}>
      <header className="relative isolate min-h-[44vh] overflow-hidden text-white sm:min-h-[48vh]">
        <img src={cover} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(7,16,20,0.35) 0%, rgba(7,16,20,0.72) 55%, color-mix(in srgb, var(--restaurant-bg) 92%, #071014) 100%)`,
          }}
        />
        <div className="relative mx-auto flex min-h-[44vh] max-w-5xl flex-col justify-between px-4 pb-8 pt-5 sm:min-h-[48vh]">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="text-sm text-white/70 transition hover:text-white">
              MenuAR
            </Link>
            {restaurant.isDemo ? (
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                Demonstração
              </span>
            ) : null}
          </div>

          <div className="animate-fade-up space-y-4 pb-2">
            <div className="flex items-end gap-4">
              {restaurant.logoUrl ? (
                <img
                  src={restaurant.logoUrl}
                  alt=""
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/20"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-ink"
                  style={{ background: 'var(--restaurant-primary)' }}
                >
                  {restaurant.name.slice(0, 1)}
                </div>
              )}
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  {restaurant.name}
                </h1>
                {(unit?.city || unit?.address) && (
                  <p className="mt-1 text-sm text-white/70">
                    {[unit?.address, unit?.city && `${unit.city}${unit.state ? `/${unit.state}` : ''}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
              </div>
            </div>
            {restaurant.description ? (
              <p className="max-w-2xl text-base leading-relaxed text-white/80">{restaurant.description}</p>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{
          borderColor: 'color-mix(in srgb, var(--restaurant-fg) 12%, transparent)',
          background: 'color-mix(in srgb, var(--restaurant-bg) 88%, white)',
        }}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-45" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (data && event.target.value.trim()) {
                  void track('search_performed', {
                    restaurantId: restaurant.id,
                    metadata: { q: event.target.value.slice(0, 40) },
                  });
                }
              }}
              placeholder="Buscar prato"
              className="h-11 w-full rounded-xl border bg-white/70 pl-10 pr-3 text-sm outline-none transition focus:ring-2"
              style={{
                borderColor: 'color-mix(in srgb, var(--restaurant-fg) 14%, transparent)',
                ['--tw-ring-color' as string]: 'var(--restaurant-primary)',
              }}
              aria-label="Buscar prato"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            <FilterTab
              active={categorySlug === 'all'}
              onClick={() => setCategorySlug('all')}
              label="Todos"
            />
            {categories.map((category) => (
              <FilterTab
                key={category.id}
                active={categorySlug === category.slug}
                label={category.name}
                onClick={() => {
                  setCategorySlug(category.slug);
                  void track('category_view', {
                    restaurantId: restaurant.id,
                    metadata: { category: category.slug },
                  });
                }}
              />
            ))}
            <FilterTab
              active={only3d}
              label="Com 3D"
              accent
              onClick={() => setOnly3d((value) => !value)}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum prato encontrado"
            description="Ajuste a busca ou os filtros para ver outros itens."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                restaurantSlug={restaurant.slug}
                style={{ animationDelay: `${Math.min(index, 6) * 50}ms` }}
                className="animate-rise-in"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterTab({
  active,
  label,
  onClick,
  accent = false,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 border-b-2 px-3 py-2 text-sm font-semibold transition',
        active
          ? accent
            ? 'border-[var(--restaurant-primary)] text-[var(--restaurant-secondary)]'
            : 'border-[var(--restaurant-fg)] text-[var(--restaurant-fg)]'
          : 'border-transparent opacity-55 hover:opacity-90',
      )}
    >
      {label}
    </button>
  );
}
