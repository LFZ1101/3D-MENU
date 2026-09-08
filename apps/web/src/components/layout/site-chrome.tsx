import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { appConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#como-funciona', label: 'Como funciona' },
  { href: '/#demonstracao', label: 'Demonstração' },
  { href: '/#planos', label: 'Planos' },
  { href: '/#faq', label: 'FAQ' },
];

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition',
        transparent
          ? 'border-transparent bg-ink/40 backdrop-blur-md'
          : 'border-white/10 bg-ink/92 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="group flex items-center gap-3 text-white" onClick={() => setOpen(false)}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jade font-display text-lg font-bold text-ink transition group-hover:scale-[1.03]">
            M
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">{appConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/demo">Experimentar</Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'border-t border-white/10 bg-ink md:hidden',
          open ? 'block animate-fade-up' : 'hidden',
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button asChild className="mt-2">
            <Link to="/demo" onClick={() => setOpen(false)}>
              Experimentar agora
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-2">
          <p className="font-display text-2xl font-semibold text-ink">{appConfig.name}</p>
          <p className="text-sm leading-relaxed text-muted">
            Cardápio visual com 3D e AR no navegador — para o cliente entender o prato antes de pedir.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-medium text-ink/70">
          <Link to="/demo" className="hover:text-ink">
            Demonstração
          </Link>
          <Link to="/login" className="hover:text-ink">
            Entrar
          </Link>
          <a href={`mailto:${appConfig.contactEmail}`} className="hover:text-ink">
            Contato
          </a>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {appConfig.name}
      </div>
    </footer>
  );
}
