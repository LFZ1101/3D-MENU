import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { authRepository } from '@/services/repositories';
import { appConfig } from '@/lib/config';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@casafogo.demo');
  const [password, setPassword] = useState('demo-password');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <form
        className="w-full max-w-md space-y-4 rounded-3xl border border-line bg-white p-6 shadow-soft"
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
        <div>
          <p className="font-display text-2xl font-semibold text-ink">{appConfig.name}</p>
          <p className="text-sm text-muted">Acesse o painel do restaurante ou a operação interna.</p>
        </div>
        <label className="block space-y-1 text-sm">
          <span>E-mail</span>
          <input
            className="h-11 w-full rounded-xl border border-line px-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span>Senha</span>
          <input
            className="h-11 w-full rounded-xl border border-line px-3"
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
          <Link to="/forgot-password">Esqueci a senha</Link>
          <Link to="/">Voltar</Link>
        </div>
        {appConfig.useMockData ? (
          <p className="rounded-xl bg-jade-soft p-3 text-xs text-jade-dark">
            Modo demo: use qualquer e-mail válido. Inclua “admin” no e-mail para abrir o painel interno.
          </p>
        ) : null}
      </form>
    </div>
  );
}

export function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-display text-2xl font-semibold">Recuperar senha</h1>
      <p className="mt-2 text-muted">
        No MVP com mock, a recuperação real depende do Supabase Auth. Configure as credenciais para
        ativar o fluxo completo.
      </p>
      <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-jade-dark">
        Voltar ao login
      </Link>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-display text-2xl font-semibold">Redefinir senha</h1>
      <p className="mt-2 text-muted">Disponível após configurar Supabase Auth.</p>
      <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-jade-dark">
        Voltar ao login
      </Link>
    </div>
  );
}
