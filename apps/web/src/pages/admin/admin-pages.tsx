import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminRepository } from '@/services/repositories';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

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
  return (
    <div className="rounded-2xl bg-paper p-4 md:p-6">
      <EmptyState
        title="Detalhe do restaurante"
        description="Criação de usuários, planos, limites e visão de suporte entram com a integração Supabase."
      />
    </div>
  );
}

export function AdminModelRequestsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-model-requests'],
    queryFn: () => adminRepository.listModelRequests(),
  });

  if (isLoading || !data) return <Skeleton className="h-40 w-full rounded-2xl" />;

  return (
    <div className="space-y-4 rounded-2xl bg-paper p-4 md:p-6">
      <h1 className="font-display text-2xl font-semibold">Solicitações 3D</h1>
      <div className="grid gap-3">
        {data.map((request) => (
          <div key={request.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="font-display font-semibold">{request.productName}</p>
            <p className="text-sm text-muted">Status: {request.status}</p>
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
        description="Estrutura pronta no roteamento e no banco. Fluxos operacionais avançados serão ligados ao Worker + Supabase + R2."
      />
    </div>
  );
}
