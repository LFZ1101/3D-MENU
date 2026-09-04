import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatBRL, QR_SOURCE_TYPES, type QrSourceType } from '@menuar/shared';
import { dashboardRepository } from '@/services/repositories';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { buildQrPngDataUrl, buildQrSvg, downloadDataUrl, downloadTextFile } from '@/lib/qr';
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
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => dashboardRepository.markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
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
            <h2 className="font-display text-lg font-semibold">Notificações</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {data.notifications.slice(0, 4).map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted">{item.body}</p>
                  </div>
                  {!item.read ? (
                    <Button size="sm" variant="ghost" onClick={() => markRead.mutate(item.id)}>
                      Ler
                    </Button>
                  ) : (
                    <Badge>Lida</Badge>
                  )}
                </li>
              ))}
            </ul>
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

export function AppMenuPage() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['app-categories'],
    queryFn: () => dashboardRepository.listCategories(),
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createCategory = useMutation({
    mutationFn: () => dashboardRepository.createCategory({ name, description }),
    onSuccess: () => {
      setName('');
      setDescription('');
      void queryClient.invalidateQueries({ queryKey: ['app-categories'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  const archiveCategory = useMutation({
    mutationFn: (id: string) => dashboardRepository.archiveCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-categories'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  if (isLoading || !categories) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Cardápio · Categorias</h1>
      <form
        className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim()) return;
          createCategory.mutate();
        }}
      >
        <input
          className="h-11 rounded-xl border border-line px-3"
          placeholder="Nome da categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="h-11 rounded-xl border border-line px-3"
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit">Criar</Button>
      </form>

      <div className="grid gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="font-display font-semibold">{category.name}</p>
              <p className="text-sm text-muted">
                /{category.slug} · ordem {category.sortOrder}
                {!category.active ? ' · arquivada' : ''}
              </p>
            </div>
            {category.active ? (
              <Button size="sm" variant="outline" onClick={() => archiveCategory.mutate(category.id)}>
                Arquivar
              </Button>
            ) : (
              <Badge>Arquivada</Badge>
            )}
          </div>
        ))}
      </div>
      <Button asChild variant="outline">
        <Link to="/demo">Ver cardápio público</Link>
      </Button>
    </div>
  );
}

export function AppProductsPage() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useQuery({
    queryKey: ['app-products'],
    queryFn: () => dashboardRepository.listProducts(),
  });
  const { data: categories } = useQuery({
    queryKey: ['app-categories'],
    queryFn: () => dashboardRepository.listCategories(),
  });

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('29.90');
  const [shortDescription, setShortDescription] = useState('');

  const activeCategories = useMemo(
    () => (categories ?? []).filter((item) => item.active),
    [categories],
  );

  const createProduct = useMutation({
    mutationFn: () =>
      dashboardRepository.createProduct({
        name,
        categoryId: categoryId || activeCategories[0]?.id,
        priceCents: Math.round(Number(price) * 100),
        shortDescription,
      }),
    onSuccess: () => {
      setName('');
      setShortDescription('');
      void queryClient.invalidateQueries({ queryKey: ['app-products'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  const toggleAvailability = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      dashboardRepository.updateProductAvailability(id, isAvailable),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-products'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  const updatePrice = useMutation({
    mutationFn: ({ id, priceCents }: { id: string; priceCents: number }) =>
      dashboardRepository.updateProductPrice(id, priceCents),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-products'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  const duplicate = useMutation({
    mutationFn: (id: string) => dashboardRepository.duplicateProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['app-products'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  if (isLoading || !products) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Produtos</h1>

      <form
        className="grid gap-3 rounded-2xl border border-line bg-white p-4 lg:grid-cols-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!name.trim() || (!categoryId && !activeCategories[0])) return;
          createProduct.mutate();
        }}
      >
        <input
          className="h-11 rounded-xl border border-line px-3"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          className="h-11 rounded-xl border border-line px-3"
          value={categoryId || activeCategories[0]?.id || ''}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {activeCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          className="h-11 rounded-xl border border-line px-3"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-label="Preço"
        />
        <input
          className="h-11 rounded-xl border border-line px-3"
          placeholder="Resumo"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
        <Button type="submit">Adicionar</Button>
      </form>

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
            {products.map((product) => (
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
                  <div className="flex flex-wrap gap-2">
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
                      {product.isAvailable ? 'Indisponibilizar' : 'Disponibilizar'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => duplicate.mutate(product.id)}>
                      Duplicar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AppModelsPage() {
  const queryClient = useQueryClient();
  const { data: requests, isLoading } = useQuery({
    queryKey: ['model-requests'],
    queryFn: () => dashboardRepository.listModelRequests(),
  });
  const { data: products } = useQuery({
    queryKey: ['app-products'],
    queryFn: () => dashboardRepository.listProducts(),
  });

  const [productId, setProductId] = useState('');
  const [widthCm, setWidthCm] = useState('14');
  const [heightCm, setHeightCm] = useState('8');
  const [depthCm, setDepthCm] = useState('14');
  const [notes, setNotes] = useState('');
  const [confirmStatic, setConfirmStatic] = useState(false);
  const [confirmAuth, setConfirmAuth] = useState(false);
  const [confirmResp, setConfirmResp] = useState(false);

  const createRequest = useMutation({
    mutationFn: () =>
      dashboardRepository.createModelRequest({
        productId: productId || products?.[0]?.id || '',
        widthCm: Number(widthCm) || null,
        heightCm: Number(heightCm) || null,
        depthCm: Number(depthCm) || null,
        notes,
      }),
    onSuccess: () => {
      setNotes('');
      void queryClient.invalidateQueries({ queryKey: ['model-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const review = useMutation({
    mutationFn: ({
      id,
      decision,
    }: {
      id: string;
      decision: 'approved' | 'changes_requested';
    }) => dashboardRepository.reviewModel(id, decision),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['model-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading || !requests) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Modelos 3D</h1>

      <form
        className="space-y-3 rounded-2xl border border-line bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!confirmStatic || !confirmAuth || !confirmResp) return;
          createRequest.mutate();
        }}
      >
        <h2 className="font-display text-lg font-semibold">Nova solicitação</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <select
            className="h-11 rounded-xl border border-line px-3"
            value={productId || products?.[0]?.id || ''}
            onChange={(e) => setProductId(e.target.value)}
          >
            {(products ?? []).map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          <input className="h-11 rounded-xl border border-line px-3" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} placeholder="Largura cm" />
          <input className="h-11 rounded-xl border border-line px-3" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="Altura cm" />
          <input className="h-11 rounded-xl border border-line px-3" value={depthCm} onChange={(e) => setDepthCm(e.target.value)} placeholder="Profundidade cm" />
        </div>
        <textarea
          className="min-h-24 w-full rounded-xl border border-line px-3 py-2"
          placeholder="Observações para produção"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={confirmStatic} onChange={(e) => setConfirmStatic(e.target.checked)} />
          Confirmo que o prato permaneceu estático na captura
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={confirmAuth} onChange={(e) => setConfirmAuth(e.target.checked)} />
          Autorizo o processamento das imagens
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={confirmResp} onChange={(e) => setConfirmResp(e.target.checked)} />
          Assumo responsabilidade pelas informações enviadas
        </label>
        <Button type="submit" disabled={!confirmStatic || !confirmAuth || !confirmResp}>
          Enviar solicitação
        </Button>
      </form>

      {requests.length === 0 ? (
        <EmptyState
          title="Nenhuma solicitação"
          description="Envie fotos e medidas de um prato estratégico para iniciar a produção 3D."
        />
      ) : (
        <div className="grid gap-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-display font-semibold">{request.productName}</p>
                  <p className="text-sm text-muted">Status: {request.status}</p>
                </div>
                <Badge>{request.status}</Badge>
              </div>
              {request.status === 'customer_review' || request.status === 'internal_review' ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => review.mutate({ id: request.id, decision: 'approved' })}>
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => review.mutate({ id: request.id, decision: 'changes_requested' })}
                  >
                    Pedir ajuste
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppQrCodesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });
  const [shortCode, setShortCode] = useState('mesa-');
  const [sourceType, setSourceType] = useState<QrSourceType>('table');
  const [tableLabel, setTableLabel] = useState('Mesa 21');

  const createQr = useMutation({
    mutationFn: () =>
      dashboardRepository.createQrCode({
        shortCode: shortCode.replace(/\s+/g, '-').toLowerCase(),
        sourceType,
        tableLabel: sourceType === 'table' ? tableLabel : null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading || !data) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">QR Codes</h1>

      <form
        className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          createQr.mutate();
        }}
      >
        <input
          className="h-11 rounded-xl border border-line px-3"
          value={shortCode}
          onChange={(e) => setShortCode(e.target.value)}
          placeholder="Código curto"
          required
        />
        <select
          className="h-11 rounded-xl border border-line px-3"
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value as QrSourceType)}
        >
          {QR_SOURCE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          className="h-11 rounded-xl border border-line px-3"
          value={tableLabel}
          onChange={(e) => setTableLabel(e.target.value)}
          placeholder="Mesa / campanha"
        />
        <Button type="submit">Criar QR</Button>
      </form>

      <div className="grid gap-3">
        {data.qrCodes.map((qr) => (
          <div key={qr.id} className="rounded-2xl border border-line bg-white p-4">
            <p className="font-display font-semibold">/q/{qr.shortCode}</p>
            <p className="text-sm text-muted">
              {qr.sourceType}
              {qr.tableLabel ? ` · ${qr.tableLabel}` : ''}
              {qr.campaignName ? ` · ${qr.campaignName}` : ''}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to={`/q/${qr.shortCode}`}>Testar</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const svg = await buildQrSvg(qr.shortCode, data.restaurant.name);
                  downloadTextFile(`menuar-${qr.shortCode}.svg`, svg, 'image/svg+xml');
                }}
              >
                Baixar SVG
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  const png = await buildQrPngDataUrl(qr.shortCode);
                  downloadDataUrl(`menuar-${qr.shortCode}.png`, png);
                }}
              >
                Baixar PNG
              </Button>
            </div>
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

export function AppSettingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardRepository.getRestaurantDashboard(),
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#39d7a2');
  const [whatsapp, setWhatsapp] = useState('');

  const restaurant = data?.restaurant;
  const ready = Boolean(restaurant);

  const save = useMutation({
    mutationFn: () =>
      dashboardRepository.updateBranding({
        name: name || restaurant?.name,
        description: description || restaurant?.description,
        primaryColor,
        whatsapp: whatsapp || restaurant?.whatsapp,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      void queryClient.invalidateQueries({ queryKey: ['menu'] });
    },
  });

  if (!ready || !restaurant) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Configurações</h1>
      <div className="rounded-2xl border border-line bg-white p-4 text-sm">
        <p>
          <strong>Plano:</strong> {formatBRL(data.subscription.monthlyPriceCents)}/mês ·{' '}
          {data.subscription.status}
        </p>
      </div>
      <form
        className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <label className="space-y-1 text-sm">
          <span>Nome</span>
          <input
            className="h-11 w-full rounded-xl border border-line px-3"
            defaultValue={restaurant.name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>WhatsApp</span>
          <input
            className="h-11 w-full rounded-xl border border-line px-3"
            defaultValue={restaurant.whatsapp ?? ''}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span>Descrição</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-line px-3 py-2"
            defaultValue={restaurant.description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          <span>Cor principal</span>
          <input
            type="color"
            className="h-11 w-full rounded-xl border border-line px-2"
            defaultValue={restaurant.primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
          />
        </label>
        <div className="flex items-end">
          <Button type="submit">Salvar branding</Button>
        </div>
      </form>
    </div>
  );
}

export function AppTeamPage() {
  const queryClient = useQueryClient();
  const { data: members, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: () => dashboardRepository.listMembers(),
  });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'manager' | 'editor' | 'viewer'>('editor');

  const addMember = useMutation({
    mutationFn: () => dashboardRepository.addMember({ fullName, email, role }),
    onSuccess: () => {
      setFullName('');
      setEmail('');
      void queryClient.invalidateQueries({ queryKey: ['team'] });
    },
  });

  if (isLoading || !members) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Equipe</h1>
      <form
        className="grid gap-3 rounded-2xl border border-line bg-white p-4 md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          addMember.mutate();
        }}
      >
        <input className="h-11 rounded-xl border border-line px-3" placeholder="Nome" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className="h-11 rounded-xl border border-line px-3" placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select className="h-11 rounded-xl border border-line px-3" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
          <option value="manager">manager</option>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
        <Button type="submit">Convidar</Button>
      </form>
      <div className="grid gap-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between rounded-2xl border border-line bg-white p-4">
            <div>
              <p className="font-display font-semibold">{member.fullName}</p>
              <p className="text-sm text-muted">{member.email}</p>
            </div>
            <Badge>{member.role}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
