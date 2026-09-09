import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { appConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const appLinks = [
  { to: '/app', label: 'Visão geral', end: true },
  { to: '/app/menu', label: 'Cardápio' },
  { to: '/app/products', label: 'Produtos' },
  { to: '/app/models', label: 'Modelos 3D' },
  { to: '/app/qr-codes', label: 'QR Codes' },
  { to: '/app/analytics', label: 'Métricas' },
  { to: '/app/settings', label: 'Aparência' },
  { to: '/app/team', label: 'Equipe' },
];

function logout(navigate: ReturnType<typeof useNavigate>) {
  sessionStorage.removeItem('menuar_session');
  navigate('/login');
}

export function AppShell() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper">
      <div className="sticky top-0 z-30 border-b border-line/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-display text-lg font-semibold text-ink">{appConfig.name}</span>
            <span className="rounded-md bg-jade-soft px-2 py-0.5 text-xs font-semibold text-jade-dark">
              Painel
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <NavLink to="/demo" className="hidden text-sm font-medium text-muted hover:text-ink sm:inline">
              Ver cardápio público
            </NavLink>
            <Button size="sm" variant="outline" onClick={() => logout(navigate)}>
              Sair
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <nav className="flex gap-1 lg:sticky lg:top-20 lg:flex-col lg:rounded-2xl lg:border lg:border-line lg:bg-white lg:p-3" aria-label="Painel do restaurante">
            {appLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'min-h-11 shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-jade-soft hover:text-ink',
                    isActive && 'bg-ink text-white hover:bg-ink hover:text-white',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const adminLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/restaurants', label: 'Restaurantes' },
  { to: '/admin/model-requests', label: 'Solicitações 3D' },
  { to: '/admin/subscriptions', label: 'Assinaturas' },
  { to: '/admin/models', label: 'Modelos', soon: true },
  { to: '/admin/analytics', label: 'Analytics', soon: true },
  { to: '/admin/audit-logs', label: 'Auditoria', soon: true },
  { to: '/admin/settings', label: 'Configurações', soon: true },
];

export function AdminShell() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-display text-lg font-semibold">{appConfig.name}</span>
            <span className="rounded-md bg-jade/20 px-2 py-0.5 text-xs font-semibold text-jade">Admin</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <NavLink to="/app" className="hidden text-sm text-white/70 hover:text-white sm:inline">
              Painel do restaurante
            </NavLink>
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 bg-transparent text-white"
              onClick={() => logout(navigate)}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <nav className="flex gap-1 lg:sticky lg:top-20 lg:flex-col lg:rounded-2xl lg:border lg:border-white/10 lg:bg-surface-dark lg:p-3" aria-label="Administração">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'min-h-11 shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white',
                    isActive && 'bg-jade text-ink hover:bg-jade hover:text-ink',
                  )
                }
              >
                <span className="inline-flex items-center gap-2">
                  {link.label}
                  {'soon' in link && link.soon ? (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                      Em breve
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
