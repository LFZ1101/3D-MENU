import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FOUNDING_SETUP_FEE_CENTS, PLANS, formatBRL } from '@menuar/shared';
import { ProductModelViewer } from '@/components/3d/product-model-viewer';
import { appConfig } from '@/lib/config';
import { LANDING_IMAGES } from '../assets';
import { Eyebrow, LandingButton, SectionHeading } from '../ui/primitives';
import { cn } from '@/lib/utils';

export function BenefitStrip() {
  const items = [
    'Sem baixar aplicativo',
    'Visualização em tamanho real',
    'Cardápio atualizado pelo mesmo QR Code',
  ];
  return (
    <section className="border-y border-white/8 bg-[#070a08]" aria-label="Benefícios imediatos">
      <div className="lp-container grid gap-6 py-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/10">
        {items.map((item) => (
          <p
            key={item}
            className="font-display text-lg font-semibold tracking-tight text-[var(--lp-text)] md:px-8 md:text-center"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

export function ImmersiveDemoSection() {
  const hasModel = Boolean(appConfig.demoGlbUrl);

  return (
    <section id="demonstracao" className="lp-section lp-table-surface relative overflow-hidden scroll-mt-28">
      <div className="lp-noise opacity-[0.04]" />
      <div className="lp-container relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="lp-surface overflow-hidden">
          {hasModel ? (
            <div className="p-3 sm:p-4">
              <ProductModelViewer
                glbUrl={appConfig.demoGlbUrl}
                usdzUrl={appConfig.demoUsdzUrl || null}
                posterUrl={appConfig.demoPosterUrl || LANDING_IMAGES.heroDish}
                alt="Demonstração visual de prato em 3D"
                className="border-0 bg-transparent shadow-none"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={LANDING_IMAGES.heroDish}
                alt="Prato de demonstração para visualização em 3D"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--lp-accent)]">
                  Demonstração ao vivo
                </p>
                <p className="max-w-md font-display text-2xl font-semibold text-white">
                  Abra o cardápio da Casa Fogo e explore o prato no celular.
                </p>
                <p className="max-w-md text-sm text-white/75">
                  O arquivo 3D carrega sob demanda na página do produto — com poster, progresso e fallback
                  se a AR não estiver disponível.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Demonstração"
            title="Não imagine. Veja sobre a mesa."
            subtitle="Explore o prato em 3D e, em um dispositivo compatível, coloque-o no ambiente usando a câmera."
          />
          <ul className="space-y-3 text-sm text-[var(--lp-text-2)]">
            <li>• Arraste para girar quando o 3D estiver ativo</li>
            <li>• Ver na minha mesa — só quando o aparelho/navegador suportarem AR</li>
            <li>• Sem suporte a AR, a exploração 3D continua disponível</li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row">
            <LandingButton asChild>
              <Link to="/demo">Abrir Casa Fogo</Link>
            </LandingButton>
            <LandingButton asChild variant="secondary">
              <Link to="/r/casa-fogo/p/burger-brasa">Abrir prato de exemplo</Link>
            </LandingButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProblemComparisonSection() {
  return (
    <section className="lp-section bg-[var(--lp-bg-2)]">
      <div className="lp-container space-y-12">
        <SectionHeading
          eyebrow="Expectativa × realidade"
          title="Uma foto desperta vontade. O tamanho real traz confiança."
          subtitle="Fotos valorizam o prato, mas nem sempre mostram proporção, altura ou tamanho da porção. A visualização em 3D ajuda o cliente a entender melhor o que está escolhendo."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <figure className="lp-surface overflow-hidden">
            <img
              src={LANDING_IMAGES.photoClose}
              alt="Fotografia em close de um prato"
              width={1000}
              height={750}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lp-text-3)]">
                Na foto
              </p>
              <p className="font-display text-xl font-semibold">Bonito, mas sem referência de escala</p>
            </figcaption>
          </figure>
          <figure className="lp-surface overflow-hidden">
            <img
              src={LANDING_IMAGES.sizeContext}
              alt="Mesa de restaurante com prato em contexto"
              width={1200}
              height={800}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="space-y-2 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lp-accent)]">
                Em tamanho real
              </p>
              <p className="font-display text-xl font-semibold">Mais contexto para decidir</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function CustomerStepsSection() {
  const steps = [
    {
      n: '01',
      title: 'Escaneia',
      text: 'O cliente aponta a câmera para o QR Code da mesa, embalagem, balcão ou divulgação.',
    },
    {
      n: '02',
      title: 'Escolhe',
      text: 'O cardápio abre no navegador com fotos, descrições, preços e pratos disponíveis em 3D.',
    },
    {
      n: '03',
      title: 'Vê na mesa',
      text: 'Com um toque, o prato pode ser visualizado no ambiente e explorado em tamanho real.',
    },
  ];

  return (
    <section id="como-funciona" className="lp-section scroll-mt-28">
      <div className="lp-container space-y-12">
        <SectionHeading title="Da câmera à escolha em três passos." />
        <ol className="grid list-none gap-8 p-0 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.n} className="relative space-y-4 border-t border-white/10 pt-6">
              {index < steps.length - 1 ? (
                <span
                  className="pointer-events-none absolute right-0 top-6 hidden h-px w-1/3 bg-gradient-to-r from-white/20 to-transparent lg:block"
                  aria-hidden
                />
              ) : null}
              <p className="font-display text-5xl font-bold text-[var(--lp-accent)]" aria-hidden>
                {step.n}
              </p>
              <h3 className="font-display text-2xl font-semibold">
                <span className="sr-only">Passo {step.n}. </span>
                {step.title}
              </h3>
              <p className="text-[var(--lp-text-2)] leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function RestaurantBenefitsSection() {
  const benefits = [
    {
      title: 'Entendimento da porção',
      text: 'Mostre melhor a proporção dos pratos antes da escolha.',
      wide: true,
    },
    {
      title: 'Pratos-destaque valorizados',
      text: 'Dê mais presença aos produtos que representam melhor o restaurante.',
    },
    {
      title: 'Atendimento mais fluido',
      text: 'Responda visualmente perguntas recorrentes sobre tamanho, apresentação e composição.',
    },
    {
      title: 'Experiência memorável',
      text: 'Ofereça uma interação diferente, diretamente pelo celular do cliente.',
    },
  ];

  return (
    <section id="beneficios" className="lp-section scroll-mt-28 bg-[var(--lp-bg-2)]">
      <div className="lp-container space-y-12">
        <SectionHeading title="Menos dúvida na mesa. Mais valor em cada apresentação." />
        <div className="grid gap-4 md:grid-cols-2">
          {benefits.map((item) => (
            <article
              key={item.title}
              className={cn(
                'lp-surface p-6 sm:p-8',
                item.wide && 'md:col-span-2 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-8',
              )}
            >
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                <p className="text-[var(--lp-text-2)] leading-relaxed">{item.text}</p>
              </div>
              {item.wide ? (
                <img
                  src={LANDING_IMAGES.heroDish}
                  alt=""
                  aria-hidden
                  width={800}
                  height={600}
                  className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover md:mt-0"
                  loading="lazy"
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RestaurantTypesSection() {
  return (
    <section className="lp-section">
      <div className="lp-container space-y-10">
        <SectionHeading
          title="Do café ao jantar. Do salão ao delivery."
          subtitle="A mesma experiência se adapta a diferentes tipos de operação — com fotos no cardápio inteiro e 3D nos pratos estratégicos."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_IMAGES.types.map((item) => (
            <figure key={item.label} className="group relative overflow-hidden rounded-[1.5rem]">
              <img
                src={item.src}
                alt={item.label}
                width={800}
                height={600}
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <p className="font-display text-xl font-semibold">{item.label}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ImplementationProcessSection() {
  const steps = [
    {
      title: 'Seleção',
      text: 'Escolhemos os pratos que mais se beneficiam da visualização em 3D.',
    },
    {
      title: 'Captura',
      text: 'O prato é fotografado em diferentes ângulos e com uma medida real de referência.',
    },
    {
      title: 'Preparação',
      text: 'O modelo é tratado, otimizado e configurado para funcionar no navegador.',
    },
    {
      title: 'Publicação',
      text: 'Depois da aprovação, o prato entra no cardápio e pode ser acessado pelo QR Code.',
    },
  ];

  return (
    <section className="lp-section bg-[var(--lp-bg-2)]">
      <div className="lp-container space-y-12">
        <SectionHeading
          eyebrow="Implantação"
          title="Você prepara o prato. Nós transformamos a apresentação."
          subtitle="Processo honesto do MVP: produção cuidadosa dos modelos, sem promessas de geração mágica instantânea."
        />
        <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="space-y-3 border-t border-white/10 pt-5">
              <p className="text-sm font-semibold text-[var(--lp-accent)]">0{index + 1}</p>
              <h3 className="font-display text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--lp-text-2)]">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CommercialOfferSection({ contactHref }: { contactHref: string }) {
  if (!appConfig.pricingEnabled) {
    return (
      <section id="planos" className="lp-section scroll-mt-28">
        <div className="lp-container max-w-3xl space-y-6">
          <Eyebrow>Projeto piloto</Eyebrow>
          <h2 className="lp-section-title">Comece pelos pratos que mais representam o seu restaurante.</h2>
          <p className="lp-subtitle">
            Montamos uma primeira experiência com cardápio digital, QR Code e pratos estratégicos em 3D
            para validar o resultado com seus clientes.
          </p>
          <LandingButton asChild>
            <a href={contactHref}>Quero conhecer o projeto</a>
          </LandingButton>
        </div>
      </section>
    );
  }

  return (
    <section id="planos" className="lp-section scroll-mt-28">
      <div className="lp-container space-y-12">
        <SectionHeading
          eyebrow="Oferta"
          title="Escolha o ritmo do seu piloto."
          subtitle={`A implantação sugerida do piloto é ${formatBRL(FOUNDING_SETUP_FEE_CENTS)} — configuração, cardápio, QR e produção inicial dos modelos.`}
        />
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
            <article
              key={plan.code}
              className={cn(
                'lp-surface flex flex-col p-6',
                plan.recommended && 'ring-1 ring-[var(--lp-accent)]/50',
              )}
            >
              {plan.recommended ? (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lp-accent)]">
                  Recomendado
                </p>
              ) : (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lp-text-3)]">
                  Plano
                </p>
              )}
              <h3 className="font-display text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-4 font-display text-3xl font-semibold tabular-nums">
                {formatBRL(plan.monthlyPriceCents)}
                <span className="text-sm font-medium text-[var(--lp-text-3)]">/mês</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-[var(--lp-text-2)]">
                <li>Até {plan.max3dModels} modelos 3D</li>
                <li>Até {plan.maxUnits} unidade(s)</li>
                <li>Analytics ({plan.analyticsRetentionDays} dias)</li>
                <li>Até {plan.maxProducts} produtos</li>
              </ul>
              <LandingButton asChild className="mt-6" variant={plan.recommended ? 'primary' : 'secondary'}>
                <a href={contactHref}>Quero este plano</a>
              </LandingButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: 'O cliente precisa instalar algum aplicativo?',
    a: 'Não. O cardápio é aberto diretamente pelo navegador do celular.',
  },
  {
    q: 'Funciona em qualquer celular?',
    a: 'O cardápio e a visualização em 3D funcionam em navegadores modernos. A realidade aumentada depende da compatibilidade do aparelho e do navegador.',
  },
  {
    q: 'Todos os pratos precisam ter modelo 3D?',
    a: 'Não. O restaurante pode utilizar fotos em todo o cardápio e aplicar 3D apenas nos pratos estratégicos.',
  },
  {
    q: 'O QR Code precisa ser trocado quando o cardápio muda?',
    a: 'Não. O mesmo QR Code pode continuar direcionando para o cardápio atualizado.',
  },
  {
    q: 'Posso usar no delivery?',
    a: 'Sim. O link pode ser compartilhado em redes sociais, mensagens, embalagens e outros canais.',
  },
  {
    q: 'Como os modelos 3D são preparados?',
    a: 'Os pratos são registrados em diferentes ângulos e transformados em modelos otimizados para visualização no navegador.',
  },
] as const;

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="lp-section scroll-mt-28 bg-[var(--lp-bg-2)]">
      <div className="lp-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading title="Perguntas frequentes" />
        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.q} className="py-2">
                <h3>
                  <button
                    type="button"
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left font-display text-lg font-semibold text-[var(--lp-text)]"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    {item.q}
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-[var(--lp-accent)] transition',
                        open && 'rotate-45',
                      )}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 pr-10 text-[var(--lp-text-2)] leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCTASection({ contactHref }: { contactHref: string }) {
  return (
    <section className="relative overflow-hidden">
      <img
        src={LANDING_IMAGES.finalCta}
        alt=""
        aria-hidden
        width={1600}
        height={1000}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#050706]/88" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050706] via-transparent to-[#050706]/50" />
      <div className="lp-container relative flex min-h-[70vh] flex-col justify-end gap-8 py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <h2 className="lp-section-title text-white">
            Coloque seu melhor prato na mesa antes mesmo do pedido.
          </h2>
          <p className="lp-subtitle text-white/80">
            Apresente seu cardápio de uma forma mais clara, interativa e memorável.
          </p>
        </div>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row lg:w-auto lg:max-w-none">
          <LandingButton asChild>
            <a href={contactHref}>Quero no meu restaurante</a>
          </LandingButton>
          <LandingButton asChild variant="secondary">
            <Link to="/demo">Ver demonstração</Link>
          </LandingButton>
        </div>
      </div>
    </section>
  );
}
