import { Link } from 'react-router-dom';
import { FOUNDING_SETUP_FEE_CENTS, PLANS, formatBRL } from '@menuar/shared';
import { SiteFooter, SiteHeader } from '@/components/layout/site-chrome';
import { ProductModelViewer } from '@/components/3d/product-model-viewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appConfig, whatsappLink } from '@/lib/config';

const faqs = [
  {
    q: 'Preciso de aplicativo?',
    a: 'Não. O cliente abre o cardápio pelo navegador após escanear o QR Code.',
  },
  {
    q: 'A realidade aumentada funciona em todos os celulares?',
    a: 'Não. A AR depende de dispositivo e navegador compatíveis. Quando a AR não estiver disponível, a visualização 3D e a fotografia continuam funcionando.',
  },
  {
    q: 'Todos os pratos precisam de modelo 3D?',
    a: 'Não. O recomendado é começar com poucos pratos estratégicos e manter fotografia para o restante do cardápio.',
  },
  {
    q: 'Isso substitui meu PDV?',
    a: 'Não. O MenuAR é uma camada visual premium que funciona sozinha ou ao lado do sistema que você já usa.',
  },
];

export function LandingPage() {
  const contact = whatsappLink() ?? `mailto:${appConfig.contactEmail}`;

  return (
    <div className="bg-ink text-white">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(57,215,162,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(17,138,104,0.2),transparent_30%),linear-gradient(180deg,#091014_0%,#111a1e_60%,#162126_100%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24">
            <div className="animate-fade-up space-y-6">
              <p className="font-display text-4xl font-bold tracking-tight text-jade sm:text-5xl lg:text-6xl">
                {appConfig.name}
              </p>
              <h1 className="max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Seu cliente vê o prato antes de pedir.
              </h1>
              <p className="max-w-xl text-base text-white/70 sm:text-lg">
                Transforme os principais pratos do seu restaurante em experiências 3D que podem ser
                visualizadas sobre a própria mesa, diretamente pelo navegador.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/demo">Experimentar agora</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white">
                  <a href={contact}>Quero no meu restaurante</a>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/60">
                <Badge className="border-0 bg-white/10 text-white">Sem download</Badge>
                <Badge className="border-0 bg-white/10 text-white">QR Code</Badge>
                <Badge className="border-0 bg-white/10 text-white">Analytics de interesse</Badge>
              </div>
            </div>
            <div className="animate-fade-up [animation-delay:120ms]">
              <ProductModelViewer
                glbUrl={appConfig.demoGlbUrl || null}
                usdzUrl={appConfig.demoUsdzUrl || null}
                posterUrl={appConfig.demoPosterUrl || null}
                alt="Prato demonstrativo MenuAR"
                className="border-white/10 bg-surface-dark shadow-soft"
              />
            </div>
          </div>
        </section>

        <section id="demonstracao" className="bg-paper px-4 py-20 text-ink">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-3xl font-semibold">Demonstração do produto</h2>
              <p className="text-muted">
                Abra o restaurante demonstrativo Casa Fogo e navegue como um cliente no salão.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                'Escaneie o QR e entre no cardápio',
                'Explore categorias e abra um prato',
                'Ative 3D e AR quando disponível',
              ].map((item, index) => (
                <div key={item} className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-sm font-semibold text-jade-dark">Passo {index + 1}</p>
                  <p className="mt-2 font-display text-lg font-semibold">{item}</p>
                </div>
              ))}
            </div>
            <Button asChild size="lg">
              <Link to="/demo">Abrir Casa Fogo</Link>
            </Button>
          </div>
        </section>

        <section className="bg-white px-4 py-20 text-ink">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold">A dúvida da porção some na mesa</h2>
              <p className="mt-4 text-muted">
                Fotos ajudam, mas nem sempre mostram tamanho e volume. Com 3D e AR, o cliente entende
                melhor o que está pedindo — sem instalar aplicativo.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ['Foto', 'Rápida e leve para todo o cardápio'],
                ['3D', 'Exploração em 360° sob demanda'],
                ['AR', 'Referência visual sobre a mesa'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-line bg-paper p-4">
                  <p className="font-display font-semibold">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-paper px-4 py-20 text-ink">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-semibold">Para o consumidor</h2>
              <ul className="space-y-3 text-muted">
                <li>1. Escaneia o QR da mesa, bio ou material impresso</li>
                <li>2. Navega sem cadastro</li>
                <li>3. Vê foto, preço, porção e alergênicos</li>
                <li>4. Explora 3D e, se compatível, AR</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-semibold">Para o restaurante</h2>
              <ul className="space-y-3 text-muted">
                <li>1. Implantação com branding e cardápio</li>
                <li>2. Produção dos pratos estratégicos em 3D</li>
                <li>3. QR Codes por mesa e origem</li>
                <li>4. Analytics de interesse e interação</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-20 text-ink">
          <div className="mx-auto max-w-6xl space-y-8">
            <h2 className="font-display text-3xl font-semibold">Pratos ideais para começar</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {['Hambúrgueres', 'Combinados', 'Porções', 'Sobremesas de destaque'].map((item) => (
                <div key={item} className="rounded-2xl border border-line bg-paper p-5 font-display text-lg font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="bg-paper px-4 py-20 text-ink">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-3xl font-semibold">Planos</h2>
              <p className="text-muted">
                A implantação cobre configuração e produção inicial. A mensalidade sustenta hospedagem,
                painel, analytics e evolução.
              </p>
            </div>
            {appConfig.pricingEnabled ? (
              <div className="grid gap-4 lg:grid-cols-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.code}
                    className={`rounded-2xl border bg-white p-5 ${
                      plan.recommended ? 'border-jade shadow-soft' : 'border-line'
                    }`}
                  >
                    {plan.recommended ? (
                      <Badge className="mb-3 border-0 bg-jade text-ink">Recomendado para piloto</Badge>
                    ) : null}
                    <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-semibold text-jade-dark">
                      {formatBRL(plan.monthlyPriceCents)}
                      <span className="text-sm font-normal text-muted">/mês</span>
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-muted">
                      <li>Até {plan.max3dModels} modelos 3D</li>
                      <li>Até {plan.maxUnits} unidade(s)</li>
                      <li>Analytics ({plan.analyticsRetentionDays} dias)</li>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-xl font-semibold">Planos personalizados</h3>
                <p className="mt-2 text-muted">
                  Conte-nos sobre o restaurante e montamos a oferta ideal para o piloto.
                </p>
                <Button asChild className="mt-4">
                  <a href={contact}>Falar com o time</a>
                </Button>
              </div>
            )}
            <p className="text-sm text-muted">
              Implantação sugerida do piloto: {formatBRL(FOUNDING_SETUP_FEE_CENTS)} (configuração,
              cardápio, QR e produção inicial dos modelos).
            </p>
          </div>
        </section>

        <section id="faq" className="bg-white px-4 py-20 text-ink">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="font-display text-3xl font-semibold">Perguntas frequentes</h2>
            {faqs.map((item) => (
              <details key={item.q} className="rounded-2xl border border-line p-5">
                <summary className="cursor-pointer font-display text-lg font-semibold">{item.q}</summary>
                <p className="mt-3 text-muted">{item.a}</p>
              </details>
            ))}
            <div className="rounded-2xl border border-dashed border-line bg-paper p-5">
              <p className="font-display font-semibold">Espaço reservado para futuros cases.</p>
              <p className="mt-1 text-sm text-muted">
                Não utilizamos depoimentos ou estatísticas inventadas.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-ink px-4 py-20">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold">Pronto para o piloto?</h2>
              <p className="mt-2 text-white/70">
                Comece com poucos pratos estratégicos e meça o interesse real dos clientes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/demo">Ver demonstração</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-transparent text-white">
                <a href={contact}>Quero testar no meu restaurante</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
