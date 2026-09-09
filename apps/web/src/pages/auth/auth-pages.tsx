import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authRepository } from '@/services/repositories';
import { appConfig } from '@/lib/config';

const AUTH_BG =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80';

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center px-4 py-10">
      <img src={AUTH_BG} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative w-full max-w-md animate-fade-up">{children}</div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@casafogo.demo');
  const [password, setPassword] = useState('demo-password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell>
      <form
        className="space-y-5 rounded-3xl border border-white/10 bg-white/95 p-6 shadow-lift backdrop-blur"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          try {
            const session = await authRepository.signIn(email, password);
            sessionStorage.setItem('menuar_session', JSON.stringify(session));
            navigate(session.role === 'super_admin' ? '/admin' : '/app');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Falha no login');
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="space-y-2">
          <p className="font-display text-3xl font-semibold text-ink">{appConfig.name}</p>
          <p className="text-sm text-muted">Acesse o painel do restaurante ou a operação interna.</p>
        </div>
        <label className="block space-y-1.5 text-sm font-medium text-ink">
          <span>E-mail</span>
          <input
            className="h-11 w-full rounded-xl border border-line bg-paper px-3 outline-none ring-jade focus:ring-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium text-ink">
          <span>Senha</span>
          <input
            className="h-11 w-full rounded-xl border border-line bg-paper px-3 outline-none ring-jade focus:ring-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button className="w-full" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
        <div className="flex justify-between text-sm text-muted">
          <Link to="/forgot-password" className="hover:text-ink">
            Esqueci a senha
          </Link>
          <Link to="/" className="hover:text-ink">
            Voltar
          </Link>
        </div>
        {appConfig.useMockData ? (
          <p className="rounded-xl bg-jade-soft p-3 text-xs leading-relaxed text-jade-dark">
            Modo demo: use qualquer e-mail válido. Inclua “admin” no e-mail para abrir o painel interno.
          </p>
        ) : null}
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/95 p-6 shadow-lift">
        <h1 className="font-display text-2xl font-semibold text-ink">Recuperar senha</h1>
        <p className="text-sm leading-relaxed text-muted">
          No MVP com mock, a recuperação real depende do Supabase Auth. Configure as credenciais para
          ativar o fluxo completo.
        </p>
        <Link to="/login" className="inline-block text-sm font-semibold text-jade-dark">
          Voltar ao login
        </Link>
      </div>
    </AuthShell>
  );
}

export function ResetPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-4 rounded-3xl border border-white/10 bg-white/95 p-6 shadow-lift">
        <h1 className="font-display text-2xl font-semibold text-ink">Redefinir senha</h1>
        <p className="text-sm leading-relaxed text-muted">Disponível após configurar Supabase Auth.</p>
        <Link to="/login" className="inline-block text-sm font-semibold text-jade-dark">
          Voltar ao login
        </Link>
      </div>
    </AuthShell>
  );
}
