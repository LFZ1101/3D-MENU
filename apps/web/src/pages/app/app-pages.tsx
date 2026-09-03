import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatBRL } from '@menuar/shared';
import { dashboardRepository } from '@/services/repositories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export function AppDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });

  if (isLoading || !data) {
    return <Skeleton className="h-64 w-full" />;
  }

  const cards = [
    { label: 'Acessos (7 dias)', value: data.analytics.menuViews },
    { label: 'Visualizações', value: data.analytics.productViews },
    { label: 'Cliques 3D', value: data.analytics.modelOpens },
    { label: 'Ativações AR', value: data.analytics.arActivations },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{data.restaurant.name}</h1>
          <p className="text-sm text-muted">Visão geral dos últimos sete dias</p>
        </div>
        <Badge className="border-0 bg-jade-soft text-jade-dark">
          Assinatura: {data.subscription.status}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-line bg-white p-4">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-line bg-white p-4">
          <h2 className="font-display text-lg font-semibold">Evolução diária</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.analytics.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e2df" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#118a68" strokeWidth={2} />
                <Line type="monotone" dataKey="modelOpens" stroke="#39d7a2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-white p-4">
            <h2 className="font-display text-lg font-semibold">Maior interesse</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {data.analytics.topProducts.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span>{item.name}</span>
                  <span className="text-muted">{item.views} views</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Interesse ≠ venda. Métricas descrevem interação.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <h2 className="font-display text-lg font-semibold">Atalhos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to="/app/products">Produtos</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/app/models">Solicitações 3D</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/app/qr-codes">QR Codes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppProductsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['app-products'],
    queryFn: () => dashboardRepository.listProducts(),
  });

  const toggleAvailability = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      dashboardRepository.updateProductAvailability(id, isAvailable),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['app-products'] }),
  });

  const updatePrice = useMutation({
    mutationFn: ({ id, priceCents }: { id: string; priceCents: number }) =>
      dashboardRepository.updateProductPrice(id, priceCents),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['app-products'] }),
  });

  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Produtos</h1>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-paper text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted">{product.has3d ? 'Com 3D' : 'Somente foto'}</p>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    className="h-9 w-28 rounded-lg border border-line px-2"
                    defaultValue={(product.priceCents / 100).toFixed(2)}
                    step="0.01"
                    onBlur={(event) => {
                      const value = Number(event.target.value);
                      if (!Number.isFinite(value)) return;
                      updatePrice.mutate({ id: product.id, priceCents: Math.round(value * 100) });
                    }}
                    aria-label={`Preço de ${product.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  {product.isAvailable ? (
                    <Badge className="border-0 bg-jade-soft text-jade-dark">Disponível</Badge>
                  ) : (
                    <Badge className="border-0 bg-danger/10 text-danger">Indisponível</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleAvailability.mutate({
                        id: product.id,
                        isAvailable: !product.isAvailable,
                      })
                    }
                  >
                    {product.isAvailable ? 'Marcar indisponível' : 'Disponibilizar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted">Preços em Real brasileiro. Alterações no mock são locais à sessão.</p>
    </div>
  );
}

export function AppModelsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['model-requests'],
    queryFn: () => dashboardRepository.listModelRequests(),
  });

  if (isLoading || !data) return <Skeleton className="h-40 w-full" />;

  if (data.length === 0) {
    return (
      <EmptyState
        title="Nenhuma solicitação"
        description="Envie fotos e medidas de um prato estratégico para iniciar a produção 3D."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Modelos 3D</h1>
      <div className="grid gap-3">
        {data.map((request) => (
          <div key={request.id} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-semibold">{request.productName}</p>
                <p className="text-sm text-muted">Status: {request.status}</p>
              </div>
              <Badge>{request.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppQrCodesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });

  if (isLoading || !data) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">QR Codes</h1>
      <div className="grid gap-3">
        {data.qrCodes.map((qr) => (
          <div key={qr.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="font-display font-semibold">/{`q/${qr.shortCode}`}</p>
            <p className="text-sm text-muted">
              {qr.sourceType}
              {qr.tableLabel ? ` · ${qr.tableLabel}` : ''}
              {qr.campaignName ? ` · ${qr.campaignName}` : ''}
            </p>
            <Link className="mt-2 inline-block text-sm font-semibold text-jade-dark" to={`/q/${qr.shortCode}`}>
              Testar redirecionamento
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });

  if (isLoading || !data) return <Skeleton className="h-64 w-full" />;

  const arRate =
    data.analytics.modelOpens > 0
      ? ((data.analytics.arActivations / data.analytics.modelOpens) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm text-muted">Taxa de AR (sobre aberturas 3D)</p>
          <p className="mt-2 font-display text-3xl font-semibold">{arRate}%</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm text-muted">Compartilhamentos</p>
          <p className="mt-2 font-display text-3xl font-semibold">{data.analytics.shares}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-sm text-muted">Intenções registradas</p>
          <p className="mt-2 font-display text-3xl font-semibold">{data.analytics.interests}</p>
        </div>
      </div>
      <p className="text-sm text-muted">
        Estes indicadores medem interesse e interação. Não representam vendas confirmadas.
      </p>
    </div>
  );
}

export function AppMenuPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Cardápio</h1>
      <EmptyState
        title="Organização do cardápio"
        description="No MVP mock, categorias e ordenação estão na seed Casa Fogo. A edição completa fica disponível com Supabase."
        action={
          <Button asChild variant="outline">
            <Link to="/demo">Ver cardápio público</Link>
          </Button>
        }
      />
    </div>
  );
}

export function AppSettingsPage() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Configurações</h1>
      <div className="rounded-2xl border border-line bg-white p-4 text-sm">
        <p>
          <strong>Restaurante:</strong> {data?.restaurant.name}
        </p>
        <p className="mt-2">
          <strong>Plano:</strong> {formatBRL(data?.subscription.monthlyPriceCents ?? 0)}/mês
        </p>
        <p className="mt-2 text-muted">
          Branding, tema e identidade visual serão editáveis após conectar o Supabase.
        </p>
      </div>
    </div>
  );
}

export function AppTeamPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Equipe</h1>
      <EmptyState
        title="Gestão de membros"
        description="Papéis owner, manager, editor e viewer estão modelados no banco. Convites reais dependem do Auth."
      />
    </div>
  );
}
