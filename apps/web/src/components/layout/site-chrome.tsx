import { Link } from 'react-router-dom';
import { appConfig } from '@/lib/config';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-jade text-ink font-display font-bold">
            M
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">{appConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/75 md:flex">
          <a href="/#como-funciona" className="hover:text-white">
            Como funciona
          </a>
          <a href="/#demonstracao" className="hover:text-white">
            Demonstração
          </a>
          <a href="/#planos" className="hover:text-white">
            Planos
          </a>
          <a href="/#faq" className="hover:text-white">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {appConfig.useMockData ? (
            <Badge className="hidden border-0 bg-white/10 text-white sm:inline-flex">Modo demo</Badge>
          ) : null}
          <Button asChild size="sm" variant="outline" className="border-white/20 bg-transparent text-white">
            <Link to="/demo">Ver demonstração</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{appConfig.name}</p>
          <p className="text-sm text-muted">Experiência visual premium para restaurantes.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link to="/demo">Demonstração</Link>
          <Link to="/login">Entrar</Link>
          <a href={`mailto:${appConfig.contactEmail}`}>Contato</a>
        </div>
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {appConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
