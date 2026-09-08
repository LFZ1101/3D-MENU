import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { MODEL_REQUEST_STATUSES, type ModelRequestStatus, type Subscription } from '@menuar/shared';
import { adminRepository } from '@/services/repositories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { ModelRequest } from '@menuar/shared';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => adminRepository.getOverview(),
  });

  if (isLoading || !data) return <Skeleton className="h-64 w-full rounded-2xl" />;

  const cards = [
    { label: 'Restaurantes ativos', value: data.activeRestaurants },
    { label: 'Em teste', value: data.trialRestaurants },
    { label: 'Assinaturas atrasadas', value: data.pastDue },
    { label: 'Modelos', value: data.totalModels },
    { label: 'Solicitações pendentes', value: data.pendingRequests },
    { label: 'Taxa média AR', value: `${(data.avgArRate * 100).toFixed(1)}%` },
    { label: 'Armazenamento approx.', value: `${data.storageMbApprox} MB` },
  ];

  return (
    <div className="space-y-6 rounded-2xl bg-paper p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Operação interna</h1>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminRestaurantsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: () => adminRepository.listRestaurants(),
  });

  if (isLoading || !data) return <Skeleton className="h-40 w-full rounded-2xl" />;

  return (
    <div className="space-y-4 rounded-2xl bg-paper p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold">Restaurantes</h1>
      <div className="grid gap-3">
        {data.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/admin/restaurants/${restaurant.id}`}
            className="rounded-2xl border border-line bg-white p-4 hover:border-jade"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold">{restaurant.name}</p>
                <p className="text-sm text-muted">/{restaurant.slug}</p>
              </div>
              <Badge>{restaurant.status}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function AdminRestaurantDetailPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-restaurant', id],
    queryFn: () => adminRepository.getRestaurant(id),
  });

  const updateStatus = useMutation({
    mutationFn: (status: 'active' | 'suspended' | 'draft' | 'archived') =>
      adminRepository.updateRestaurantStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-restaurant', id] });
      void queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
  });

  if (isLoading) return <Skeleton className="h-40 w-full rounded-2xl" />;
  if (!data) {
    return (
      <div className="rounded-2xl bg-paper p-4 md:p-6">
        <EmptyState title="Restaurante não encontrado" />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl bg-paper p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{data.name}</h1>
          <p className="text-sm text-muted">/{data.slug}</p>
        </div>
        <Badge>{data.status}</Badge>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4 text-sm">
        <p>{data.description}</p>
        <p className="mt-2 text-muted">WhatsApp: {data.whatsapp || '—'}</p>
        <p className="text-muted">Tema: {data.theme}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => updateStatus.mutate('active')}>
          Ativar
        </Button>
        <Button size="sm" variant="outline" onClick={() => updateStatus.mutate('suspended')}>
          Suspender
        </Button>
        <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate('archived')}>
          Arquivar
        </Button>
      </div>
    </div>
  );
}

const KANBAN_COLUMNS: ModelRequestStatus[] = [
  'submitted',
  'material_review',
  'processing',
  'customer_review',
  'approved',
  'published',
];

export function AdminModelRequestsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-model-requests'],
    queryFn: () => adminRepository.listModelRequests(),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ModelRequestStatus }) =>
      adminRepository.updateModelRequestStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-model-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['model-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
  });

  const grouped = useMemo(() => {
    const map: Record<string, ModelRequest[]> = Object.fromEntries(
      KANBAN_COLUMNS.map((status) => [status, []]),
    );
    for (const request of data ?? []) {
      if (!map[request.status]) map[request.status] = [];
      map[request.status].push(request);
    }
    return map;
  }, [data]);

  if (isLoading || !data) return <Skeleton className="h-40 w-full rounded-2xl" />;

  return (
    <div className="space-y-4 rounded-2xl bg-paper p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold">Solicitações 3D</h1>
      <div className="grid gap-3 xl:grid-cols-3">
        {KANBAN_COLUMNS.map((status) => (
          <div key={status} className="rounded-2xl border border-line bg-white p-3">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">{status}</p>
            <div className="space-y-2">
              {(grouped[status] ?? []).map((request) => (
                <div key={request.id} className="rounded-xl border border-line p-3">
                  <p className="font-medium">{request.productName}</p>
                  <select
                    className="mt-2 h-9 w-full rounded-lg border border-line px-2 text-sm"
                    value={request.status}
                    onChange={(e) =>
                      updateStatus.mutate({
                        id: request.id,
                        status: e.target.value as ModelRequestStatus,
                      })
                    }
                  >
                    {MODEL_REQUEST_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {(grouped[status] ?? []).length === 0 ? (
                <p className="text-xs text-muted">Sem itens</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSubscriptionsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => adminRepository.listSubscriptions(),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Subscription['status'] }) =>
      adminRepository.updateSubscriptionStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading || !data) return <Skeleton className="h-40 w-full rounded-2xl" />;

  return (
    <div className="space-y-4 rounded-2xl bg-paper p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold">Assinaturas</h1>
      <div className="grid gap-3">
        {data.map((subscription) => (
          <div key={subscription.id} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display font-semibold">{subscription.id}</p>
                <p className="text-sm text-muted">
                  Restaurante {subscription.restaurantId.slice(0, 8)} · plano {subscription.planId}
                </p>
              </div>
              <Badge>{subscription.status}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['trialing', 'active', 'past_due', 'grace_period', 'suspended', 'canceled'] as const).map(
                (status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={subscription.status === status ? 'primary' : 'outline'}
                    onClick={() => updateStatus.mutate({ id: subscription.id, status })}
                  >
                    {status}
                  </Button>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-2xl bg-paper p-4 md:p-6">
      <EmptyState
        title={title}
        description="Estrutura pronta no roteamento e no banco. Fluxos avançados entram com Worker + Supabase + R2."
      />
    </div>
  );
}
