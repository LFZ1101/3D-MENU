import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { menuRepository } from '@/services/repositories';
import { ProductCard } from '@/components/product/product-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
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
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
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

  return (
    <div
      className="min-h-screen"
      style={{ background: restaurant.backgroundColor, color: restaurant.textColor }}
    >
      <header className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(57,215,162,0.25),transparent_40%)]" />
        <div className="relative mx-auto max-w-5xl px-4 pb-8 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <Link to="/" className="text-sm text-white/70 hover:text-white">
              MenuAR
            </Link>
            {restaurant.isDemo ? <Badge className="border-0 bg-white/10 text-white">Demonstração</Badge> : null}
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-jade font-display text-xl font-bold text-ink">
                {restaurant.name.slice(0, 1)}
              </div>
              <h1 className="font-display text-3xl font-semibold">{restaurant.name}</h1>
              <p className="mt-2 max-w-xl text-white/70">{restaurant.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/60">
                {unit?.address ? <span>{unit.address}</span> : null}
                {unit?.city ? <span>· {unit.city}/{unit.state}</span> : null}
                <span>· Aberto conforme horário da unidade</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
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
              className="h-11 w-full rounded-xl border border-line bg-paper pl-10 pr-3 text-sm outline-none ring-jade focus:ring-2"
              aria-label="Buscar prato"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setCategorySlug('all')}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm',
                categorySlug === 'all' ? 'border-ink bg-ink text-white' : 'border-line bg-white',
              )}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setCategorySlug(category.slug);
                  void track('category_view', {
                    restaurantId: restaurant.id,
                    metadata: { category: category.slug },
                  });
                }}
                className={cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-sm',
                  categorySlug === category.slug
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-white',
                )}
              >
                {category.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setOnly3d((value) => !value)}
              className={cn(
                'shrink-0 rounded-full border px-3 py-1.5 text-sm',
                only3d ? 'border-jade bg-jade text-ink' : 'border-line bg-white',
              )}
            >
              Com 3D
            </button>
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
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} restaurantSlug={restaurant.slug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
