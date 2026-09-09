import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { appConfig } from '@/lib/config';
import { LANDING_IMAGES } from '../assets';
import { DeviceMockup, Eyebrow, LandingButton } from '../ui/primitives';

export function HeroSection({ contactHref }: { contactHref: string }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse || window.innerWidth < 1024) return;

    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty('--mx', `${x * 8}px`);
      stage.style.setProperty('--my', `${y * 6}px`);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <img
        src={LANDING_IMAGES.heroAmbient}
        alt=""
        aria-hidden
        width={1800}
        height={1200}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,6,0.55)_0%,rgba(5,7,6,0.82)_45%,#050706_100%)]" />
      <div className="lp-noise" />

      <div className="lp-container relative grid min-h-[100svh] gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-20 lg:pt-8">
        <div className="space-y-7">
          <p className="lp-reveal font-display text-4xl font-extrabold tracking-tight text-[var(--lp-accent)] sm:text-5xl">
            {appConfig.name}
          </p>
          <Eyebrow className="lp-reveal lp-reveal-d1">Cardápio 3D · Realidade aumentada</Eyebrow>
          <h1 className="lp-reveal lp-reveal-d1 lp-hero-title max-w-[11ch] text-[var(--lp-text)]">
            O prato chega à mesa{' '}
            <span className="text-[var(--lp-accent)]">antes do pedido.</span>
          </h1>
          <p className="lp-reveal lp-reveal-d2 lp-subtitle">
            Seu cliente abre o cardápio pelo QR Code e visualiza pratos-destaque em 3D e tamanho real —
            direto no navegador, sem instalar nada.
          </p>
          <div className="lp-reveal lp-reveal-d3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LandingButton asChild>
              <Link to="/demo">Ver demonstração ao vivo</Link>
            </LandingButton>
            <LandingButton asChild variant="secondary">
              <a href={contactHref}>Quero no meu restaurante</a>
            </LandingButton>
          </div>
          <p className="lp-reveal lp-reveal-d4 text-sm text-[var(--lp-text-3)]">
            Sem aplicativo · Sem cadastro · Direto no celular
          </p>
        </div>

        <div
          ref={stageRef}
          className="lp-reveal lp-reveal-d2 relative mx-auto flex w-full max-w-lg items-end justify-center pb-6 lg:max-w-none"
          style={{ transform: 'translate3d(var(--mx, 0), var(--my, 0), 0)' }}
        >
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(84,225,166,0.18),transparent_60%)] blur-2xl" />
          <DeviceMockup className="relative z-10 translate-x-[-8%] sm:translate-x-[-12%]" />
          <div className="absolute bottom-0 right-0 z-20 w-[68%] max-w-[280px] sm:right-[-2%] sm:w-[72%]">
            <img
              src={LANDING_IMAGES.heroDish}
              alt="Hambúrguer artesanal em destaque"
              width={600}
              height={600}
              className="lp-dish-float aspect-square w-full rounded-[2rem] object-cover ring-1 ring-white/15"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold text-[var(--lp-text)] backdrop-blur">
                Tamanho real
              </span>
              <span className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs font-semibold text-[var(--lp-text-2)] backdrop-blur">
                Arraste para girar no 3D
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
