import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[menuar:error-boundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4">
          <h1 className="font-display text-2xl font-semibold text-ink">Algo deu errado</h1>
          <p className="text-muted">
            Recarregue a página. Se o problema continuar, avise o suporte do MenuAR.
          </p>
          <Button onClick={() => window.location.assign('/')}>Voltar ao início</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
