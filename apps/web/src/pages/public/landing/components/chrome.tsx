import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { appConfig } from '@/lib/config';
import { LandingButton } from '../ui/primitives';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '#demonstracao', label: 'Demonstração' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#beneficios', label: 'Benefícios' },
  { href: '#planos', label: 'Planos' },
  { href: '#faq', label: 'FAQ' },
] as const;

export function LandingHeader({ contactHref }: { contactHref: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,border-color,height] duration-200',
        scrolled
          ? 'border-b border-white/10 bg-[#050706]/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="lp-container flex h-[72px] items-center justify-between gap-4 md:h-20">
        <Link to="/" className="group flex min-h-11 items-center gap-3" onClick={() => setOpen(false)}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lp-accent)] font-display text-lg font-bold text-[#050706] transition group-hover:scale-[1.03]">
            M
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-[var(--lp-text)]">
            {appConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--lp-text-2)] lg:flex" aria-label="Principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-[var(--lp-text)]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden min-h-11 items-center px-3 text-sm font-medium text-[var(--lp-text-2)] transition hover:text-[var(--lp-text)] md:inline-flex"
          >
            Entrar
          </Link>
          <LandingButton asChild variant="secondary" className="hidden min-h-11 px-4 lg:inline-flex">
            <Link to="/demo">Ver demonstração</Link>
          </LandingButton>
          <LandingButton asChild variant="primary" className="hidden min-h-11 px-4 sm:inline-flex">
            <a href={contactHref}>Quero no meu restaurante</a>
          </LandingButton>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-[var(--lp-text)] lg:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      <div
        id="landing-mobile-nav"
        className={cn(
          'border-t border-white/10 bg-[#050706] lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <nav className="lp-container flex flex-col gap-1 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="min-h-11 rounded-xl px-3 py-3 text-sm text-[var(--lp-text-2)] hover:bg-white/5 hover:text-[var(--lp-text)]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            className="min-h-11 rounded-xl px-3 py-3 text-sm text-[var(--lp-text-2)] hover:bg-white/5"
            onClick={() => setOpen(false)}
          >
            Entrar
          </Link>
          <LandingButton asChild className="mt-2">
            <Link to="/demo" onClick={() => setOpen(false)}>
              Ver demonstração ao vivo
            </Link>
          </LandingButton>
          <LandingButton asChild variant="secondary" className="mt-2">
            <a href={contactHref} onClick={() => setOpen(false)}>
              Quero no meu restaurante
            </a>
          </LandingButton>
        </nav>
      </div>
    </header>
  );
}

export function LandingFooter({ contactHref }: { contactHref: string }) {
  return (
    <footer className="border-t border-white/10 bg-[#070a08]">
      <div className="lp-container grid gap-10 py-14 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <p className="font-display text-2xl font-semibold text-[var(--lp-text)]">{appConfig.name}</p>
          <p className="max-w-md text-sm leading-relaxed text-[var(--lp-text-2)]">
            Cardápio digital com fotos, 3D e realidade aumentada no navegador — para o cliente ver o
            prato com mais clareza antes de pedir.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-[var(--lp-text)]">Produto</p>
            <a href="#como-funciona" className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              Como funciona
            </a>
            <a href="#demonstracao" className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              Demonstração
            </a>
            <Link to="/demo" className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              Casa Fogo
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-[var(--lp-text)]">Comercial</p>
            <a href="#planos" className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              Planos
            </a>
            <a href={contactHref} className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              Contato
            </a>
            <a href="#faq" className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              FAQ
            </a>
          </div>
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-[var(--lp-text)]">Acesso</p>
            <Link to="/login" className="text-[var(--lp-text-2)] hover:text-[var(--lp-text)]">
              Entrar
            </Link>
            <a
              href={`mailto:${appConfig.contactEmail}`}
              className="break-all text-[var(--lp-text-2)] hover:text-[var(--lp-text)]"
            >
              {appConfig.contactEmail}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 py-5 text-center text-xs text-[var(--lp-text-3)]">
        © {new Date().getFullYear()} {appConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
