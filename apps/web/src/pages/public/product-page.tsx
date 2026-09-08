import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatBRL, formatServes } from '@menuar/shared';
import { menuRepository } from '@/services/repositories';
import { ProductModelViewer } from '@/components/3d/product-model-viewer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { restaurantThemeStyle } from '@/lib/restaurant-theme';

export function ProductPage() {
  const { restaurantSlug = '', productSlug = '' } = useParams();
  const { track } = useAnalytics();
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', restaurantSlug, productSlug],
    queryFn: () => menuRepository.getProduct(restaurantSlug, productSlug),
  });

  useEffect(() => {
    if (!data) return;
    void track('product_view', {
      restaurantId: data.restaurant.id,
      productId: data.product.id,
    });
  }, [data, track]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-[50vh] w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
        <EmptyState
          title="Prato não encontrado"
          description="Volte ao cardápio e escolha outro item."
          action={
            <Link to={`/r/${restaurantSlug || 'casa-fogo'}`} className="text-sm font-semibold text-jade-dark">
              Voltar ao cardápio
            </Link>
          }
        />
      </div>
    );
  }

  const { restaurant, product, category } = data;
  const serves = formatServes(product.servesMin, product.servesMax);
  const heroImage = product.imageUrl || product.posterUrl;

  return (
    <div className="min-h-screen pb-28" style={restaurantThemeStyle(restaurant)}>
      <div className="mx-auto max-w-5xl px-4 py-5">
        <Link
          to={`/r/${restaurant.slug}`}
          className="inline-flex text-sm font-semibold opacity-70 transition hover:opacity-100"
        >
          ← {restaurant.name}
        </Link>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-ink shadow-lift">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-end bg-[radial-gradient(circle_at_25%_20%,rgba(47,214,160,0.35),transparent_40%),linear-gradient(160deg,#071014,#152025)] p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      {category?.name ?? 'Prato'}
                    </p>
                    <h1 className="mt-2 font-display text-3xl font-semibold text-white">{product.name}</h1>
                  </div>
                </div>
              )}
            </div>

            <ProductModelViewer
              glbUrl={product.glbUrl}
              usdzUrl={product.usdzUrl}
              posterUrl={product.posterUrl || product.imageUrl}
              alt={`Modelo 3D de ${product.name}`}
              scaleVerified={product.scaleVerified}
              onLoadStart={() =>
                void track('model_load_started', {
                  restaurantId: restaurant.id,
                  productId: product.id,
                })
              }
              onLoadComplete={(durationMs) =>
                void track('model_load_completed', {
                  restaurantId: restaurant.id,
                  productId: product.id,
                  durationMs,
                })
              }
              onLoadError={(errorCode) =>
                void track('model_load_failed', {
                  restaurantId: restaurant.id,
                  productId: product.id,
                  errorCode,
                })
              }
              onArStart={() =>
                void track('ar_started', {
                  restaurantId: restaurant.id,
                  productId: product.id,
                })
              }
              onArUnavailable={() =>
                void track('ar_unavailable', {
                  restaurantId: restaurant.id,
                  productId: product.id,
                })
              }
            />
          </div>

          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                {category?.name ?? 'Prato'}
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">
                {product.name}
              </h1>
              <p
                className="font-display text-3xl font-semibold"
                style={{ color: 'var(--restaurant-secondary)' }}
              >
                {formatBRL(product.priceCents)}
              </p>
              {product.shortDescription ? (
                <p className="text-base leading-relaxed opacity-75">{product.shortDescription}</p>
              ) : null}
            </div>

            {(serves ||
              product.isVegetarian ||
              product.isVegan ||
              product.isGlutenFree ||
              product.isSpicy ||
              !product.isAvailable) && (
              <p className="text-sm font-medium opacity-70">
                {[
                  serves,
                  product.isVegetarian ? 'Vegetariano' : null,
                  product.isVegan ? 'Vegano' : null,
                  product.isGlutenFree ? 'Sem glúten' : null,
                  product.isSpicy ? 'Picante' : null,
                  !product.isAvailable ? 'Indisponível agora' : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            {product.description ? (
              <div className="space-y-2 border-t border-black/10 pt-5">
                <h2 className="font-display text-lg font-semibold">Descrição</h2>
                <p className="text-sm leading-relaxed opacity-70">{product.description}</p>
              </div>
            ) : null}

            {product.ingredients.length > 0 ? (
              <div className="space-y-2 border-t border-black/10 pt-5">
                <h2 className="font-display text-lg font-semibold">Ingredientes</h2>
                <ul className="space-y-1.5 text-sm opacity-70">
                  {product.ingredients.map((item) => (
                    <li key={item}>— {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.allergenNotes ? (
              <div className="border-t border-black/10 pt-5 text-sm">
                <p className="font-semibold">Alérgicos</p>
                <p className="mt-1 opacity-70">{product.allergenNotes}</p>
              </div>
            ) : null}

            {(product.widthCm || product.heightCm || product.depthCm) && (
              <div className="border-t border-black/10 pt-5 text-sm">
                <p className="font-semibold">Dimensões aproximadas</p>
                <p className="mt-1 opacity-70">
                  {[
                    product.widthCm ? `${product.widthCm} cm largura` : null,
                    product.heightCm ? `${product.heightCm} cm altura` : null,
                    product.depthCm ? `${product.depthCm} cm profundidade` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            )}

            {feedback ? (
              <p className="animate-fade-up text-sm font-semibold" style={{ color: 'var(--restaurant-secondary)' }} role="status">
                {feedback}
              </p>
            ) : null}

            <div className="hidden gap-3 lg:flex">
              <Button
                variant="outline"
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    await navigator.share({ title: product.name, url });
                    setFeedback('Link compartilhado');
                  } else {
                    await navigator.clipboard.writeText(url);
                    setFeedback('Link copiado');
                  }
                  await track('product_share', {
                    restaurantId: restaurant.id,
                    productId: product.id,
                  });
                }}
              >
                Compartilhar
              </Button>
              <Button
                onClick={() => {
                  setFeedback('Interesse registrado. Obrigado!');
                  void track('product_interest', {
                    restaurantId: restaurant.id,
                    productId: product.id,
                  });
                }}
              >
                Tenho interesse
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t px-4 py-3 backdrop-blur-md lg:hidden"
        style={{
          borderColor: 'color-mix(in srgb, var(--restaurant-fg) 12%, transparent)',
          background: 'color-mix(in srgb, var(--restaurant-bg) 90%, white)',
          paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="mx-auto flex max-w-5xl gap-3">
          <Button
            className="flex-1"
            variant="outline"
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) {
                await navigator.share({ title: product.name, url });
                setFeedback('Link compartilhado');
              } else {
                await navigator.clipboard.writeText(url);
                setFeedback('Link copiado');
              }
              await track('product_share', {
                restaurantId: restaurant.id,
                productId: product.id,
              });
            }}
          >
            Compartilhar
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setFeedback('Interesse registrado. Obrigado!');
              void track('product_interest', {
                restaurantId: restaurant.id,
                productId: product.id,
              });
            }}
          >
            Tenho interesse
          </Button>
        </div>
      </div>
    </div>
  );
}
