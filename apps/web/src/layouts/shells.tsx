import { NavLink, Outlet } from 'react-router-dom';
import { appConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

const appLinks = [
  { to: '/app', label: 'Visão geral', end: true },
  { to: '/app/menu', label: 'Cardápio' },
  { to: '/app/products', label: 'Produtos' },
  { to: '/app/models', label: 'Modelos 3D' },
  { to: '/app/qr-codes', label: 'QR Codes' },
  { to: '/app/analytics', label: 'Analytics' },
  { to: '/app/settings', label: 'Configurações' },
  { to: '/app/team', label: 'Equipe' },
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-ink">{appConfig.name}</span>
            <span className="rounded-full bg-jade-soft px-2 py-0.5 text-xs text-jade-dark">Painel</span>
          </div>
          <NavLink to="/demo" className="text-sm text-muted hover:text-ink">
            Ver cardápio público
          </NavLink>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-white p-3">
          <nav className="flex flex-col gap-1">
            {appLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-jade-soft hover:text-ink',
                    isActive && 'bg-ink text-white hover:bg-ink hover:text-white',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
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
  { to: '/admin/models', label: 'Modelos' },
  { to: '/admin/subscriptions', label: 'Assinaturas' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/audit-logs', label: 'Auditoria' },
  { to: '/admin/settings', label: 'Configurações' },
];

export function AdminShell() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold">{appConfig.name}</span>
            <span className="rounded-full bg-jade/20 px-2 py-0.5 text-xs text-jade">Admin</span>
          </div>
          <NavLink to="/app" className="text-sm text-white/70 hover:text-white">
            Ir ao painel do restaurante
          </NavLink>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-surface-dark p-3">
          <nav className="flex flex-col gap-1">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white',
                    isActive && 'bg-jade text-ink hover:bg-jade hover:text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="text-ink">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
