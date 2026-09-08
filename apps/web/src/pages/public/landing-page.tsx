import { Link } from 'react-router-dom';
import { FOUNDING_SETUP_FEE_CENTS, PLANS, formatBRL } from '@menuar/shared';
import { SiteFooter, SiteHeader } from '@/components/layout/site-chrome';
import { Button } from '@/components/ui/button';
import { appConfig, whatsappLink } from '@/lib/config';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2400&q=80';

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
      <SiteHeader transparent />
      <main>
        <section className="relative isolate min-h-[100svh] overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="hero-pan pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className="surface-grain pointer-events-none absolute inset-0" />
          <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:pb-20 lg:justify-center lg:pb-24">
            <div className="max-w-2xl space-y-6">
              <p className="reveal font-display text-5xl font-extrabold tracking-tight text-jade sm:text-6xl lg:text-7xl">
                {appConfig.name}
              </p>
              <h1 className="reveal reveal-delay-1 max-w-xl font-display text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                Seu cliente vê o prato antes de pedir.
              </h1>
              <p className="reveal reveal-delay-2 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
                Experiência 3D e AR no navegador — sobre a mesa, sem instalar nada.
              </p>
              <div className="reveal reveal-delay-3 flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg">
                  <Link to="/demo">Experimentar agora</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/5 text-white backdrop-blur hover:border-jade hover:bg-jade hover:text-ink"
                >
                  <a href={contact}>Quero no meu restaurante</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="demonstracao" className="relative overflow-hidden bg-paper px-4 py-24 text-ink">
          <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-jade/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade-dark">Demonstração</p>
              <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Entre no salão da Casa Fogo
              </h2>
              <p className="max-w-xl text-lg text-muted">
                Navegue o cardápio como um cliente: categorias, pratos e a experiência visual sob demanda.
              </p>
              <Button asChild size="lg">
                <Link to="/demo">Abrir Casa Fogo</Link>
              </Button>
            </div>
            <ol className="space-y-6 border-l border-line pl-6">
              {[
                'Escaneie o QR e abra o cardápio',
                'Escolha um prato de destaque',
                'Explore 3D e AR quando disponível',
              ].map((item, index) => (
                <li key={item} className="relative">
                  <span className="absolute -left-[1.9rem] top-0 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-ink text-xs font-bold text-jade">
                    {index + 1}
                  </span>
                  <p className="font-display text-xl font-semibold leading-snug">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink px-4 py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(47,214,160,0.16),transparent_42%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <h2 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                A dúvida da porção some na mesa
              </h2>
              <p className="text-lg text-white/70">
                Foto para o cardápio inteiro. 3D e AR para os pratos que vendem a experiência.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ['Foto', 'Leve e rápida para todo o menu'],
                ['3D', 'Explore o prato em 360°'],
                ['AR', 'Referência de tamanho sobre a mesa'],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  className="border-t border-white/15 pt-4"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <p className="font-display text-2xl font-semibold text-jade">{title}</p>
                  <p className="mt-2 text-sm text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-white px-4 py-24 text-ink">
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
            <div className="space-y-5">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Para o consumidor</h2>
              <ul className="space-y-4 text-muted">
                {[
                  'Escaneia o QR da mesa, bio ou material impresso',
                  'Navega sem cadastro e sem download',
                  'Vê foto, preço, porção e alergênicos',
                  'Explora 3D e, se compatível, AR',
                ].map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="font-display text-lg font-bold text-jade-dark">{index + 1}</span>
                    <span className="pt-0.5 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">Para o restaurante</h2>
              <ul className="space-y-4 text-muted">
                {[
                  'Implantação com branding e cardápio',
                  'Produção dos pratos estratégicos em 3D',
                  'QR Codes por mesa e origem',
                  'Analytics de interesse e interação',
                ].map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="font-display text-lg font-bold text-jade-dark">{index + 1}</span>
                    <span className="pt-0.5 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-paper px-4 py-24 text-ink">
          <div className="mx-auto max-w-6xl">
            <h2 className="max-w-xl font-display text-4xl font-semibold leading-tight">
              Comece pelos pratos que contam a casa
            </h2>
            <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {['Hambúrgueres', 'Combinados', 'Porções', 'Sobremesas'].map((item) => (
                <p
                  key={item}
                  className="border-b border-line pb-4 font-display text-2xl font-semibold tracking-tight"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="bg-white px-4 py-24 text-ink">
          <div className="mx-auto max-w-6xl space-y-10">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-display text-4xl font-semibold">Planos</h2>
              <p className="text-lg text-muted">
                Implantação cobre configuração e produção inicial. A mensalidade sustenta hospedagem,
                painel e analytics.
              </p>
            </div>
            {appConfig.pricingEnabled ? (
              <div className="grid gap-6 lg:grid-cols-4">
                {PLANS.map((plan) => (
                  <div
                    key={plan.code}
                    className={`relative border-t-2 pt-5 ${
                      plan.recommended ? 'border-jade' : 'border-line'
                    }`}
                  >
                    {plan.recommended ? (
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-jade-dark">
                        Recomendado
                      </p>
                    ) : null}
                    <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
                    <p className="mt-3 font-display text-3xl font-semibold text-ink">
                      {formatBRL(plan.monthlyPriceCents)}
                      <span className="text-sm font-medium text-muted">/mês</span>
                    </p>
                    <ul className="mt-5 space-y-2 text-sm text-muted">
                      <li>Até {plan.max3dModels} modelos 3D</li>
                      <li>Até {plan.maxUnits} unidade(s)</li>
                      <li>Analytics ({plan.analyticsRetentionDays} dias)</li>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-w-xl space-y-4 border-t border-line pt-6">
                <h3 className="font-display text-2xl font-semibold">Planos personalizados</h3>
                <p className="text-muted">
                  Conte-nos sobre o restaurante e montamos a oferta ideal para o piloto.
                </p>
                <Button asChild>
                  <a href={contact}>Falar com o time</a>
                </Button>
              </div>
            )}
            <p className="text-sm text-muted">
              Implantação sugerida do piloto: {formatBRL(FOUNDING_SETUP_FEE_CENTS)}.
            </p>
          </div>
        </section>

        <section id="faq" className="bg-paper px-4 py-24 text-ink">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="font-display text-4xl font-semibold">Perguntas frequentes</h2>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-jade-dark transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 py-24">
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=80"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/80" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="font-display text-4xl font-semibold sm:text-5xl">Pronto para o piloto?</h2>
              <p className="text-lg text-white/70">
                Poucos pratos estratégicos. Interesse real medido na mesa.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/demo">Ver demonstração</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:border-jade hover:bg-jade hover:text-ink"
              >
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
