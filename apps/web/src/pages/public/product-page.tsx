import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatBRL, formatServes } from '@menuar/shared';
import { menuRepository } from '@/services/repositories';
import { ProductModelViewer } from '@/components/3d/product-model-viewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';

export function ProductPage() {
  const { restaurantSlug = '', productSlug = '' } = useParams();
  const { track } = useAnalytics();

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
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState title="Prato não encontrado" description="Volte ao cardápio e escolha outro item." />
      </div>
    );
  }

  const { restaurant, product, category } = data;
  const serves = formatServes(product.servesMin, product.servesMax);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <Link to={`/r/${restaurant.slug}`} className="text-sm font-medium text-jade-dark">
          ← Voltar ao cardápio
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-line bg-ink">
              <div className="flex aspect-[4/3] items-end bg-gradient-to-br from-ink via-surface-dark to-ink p-6">
                <div>
                  <Badge className="mb-3 border-0 bg-white/10 text-white">
                    {category?.name ?? 'Prato'}
                  </Badge>
                  <h1 className="font-display text-3xl font-semibold text-white">{product.name}</h1>
                </div>
              </div>
            </div>

            <ProductModelViewer
              glbUrl={product.glbUrl}
              usdzUrl={product.usdzUrl}
              posterUrl={product.posterUrl}
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

          <div className="space-y-5">
            <div>
              <p className="text-2xl font-semibold text-jade-dark">{formatBRL(product.priceCents)}</p>
              {product.shortDescription ? (
                <p className="mt-2 text-muted">{product.shortDescription}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {serves ? <Badge>{serves}</Badge> : null}
              {product.isVegetarian ? <Badge>Vegetariano</Badge> : null}
              {product.isVegan ? <Badge>Vegano</Badge> : null}
              {product.isGlutenFree ? <Badge>Sem glúten</Badge> : null}
              {product.isSpicy ? <Badge>Picante</Badge> : null}
              {!product.isAvailable ? <Badge className="border-0 bg-danger text-white">Indisponível</Badge> : null}
            </div>

            {product.description ? (
              <div>
                <h2 className="font-display text-lg font-semibold">Descrição</h2>
                <p className="mt-2 text-sm text-muted">{product.description}</p>
              </div>
            ) : null}

            {product.ingredients.length > 0 ? (
              <div>
                <h2 className="font-display text-lg font-semibold">Ingredientes</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                  {product.ingredients.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.allergenNotes ? (
              <div className="rounded-2xl border border-line bg-white p-4 text-sm">
                <p className="font-semibold">Alérgicos</p>
                <p className="mt-1 text-muted">{product.allergenNotes}</p>
              </div>
            ) : null}

            {(product.widthCm || product.heightCm || product.depthCm) && (
              <div className="rounded-2xl border border-line bg-white p-4 text-sm">
                <p className="font-semibold">Dimensões aproximadas</p>
                <p className="mt-1 text-muted">
                  {product.widthCm ? `${product.widthCm} cm largura` : null}
                  {product.heightCm ? ` · ${product.heightCm} cm altura` : null}
                  {product.depthCm ? ` · ${product.depthCm} cm profundidade` : null}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    await navigator.share({ title: product.name, url });
                  } else {
                    await navigator.clipboard.writeText(url);
                  }
                  await track('product_share', {
                    restaurantId: restaurant.id,
                    productId: product.id,
                  });
                }}
                variant="outline"
              >
                Compartilhar
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  void track('product_interest', {
                    restaurantId: restaurant.id,
                    productId: product.id,
                  })
                }
              >
                Tenho interesse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
