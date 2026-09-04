import { useEffect, useId, useRef, useState } from 'react';
import { scaleLabel } from '@menuar/shared';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ModelViewerProps {
  glbUrl?: string | null;
  usdzUrl?: string | null;
  posterUrl?: string | null;
  alt: string;
  scaleVerified?: boolean;
  onLoadStart?: () => void;
  onLoadComplete?: (durationMs: number) => void;
  onLoadError?: (errorCode: string) => void;
  onArStart?: () => void;
  onArUnavailable?: () => void;
  className?: string;
}

let modelViewerLoader: Promise<void> | null = null;

function loadModelViewerScript(): Promise<void> {
  if (customElements.get('model-viewer')) return Promise.resolve();
  if (modelViewerLoader) return modelViewerLoader;
  modelViewerLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('model_viewer_script_failed'));
    document.head.appendChild(script);
  });
  return modelViewerLoader;
}

export function ProductModelViewer({
  glbUrl,
  usdzUrl,
  posterUrl,
  alt,
  scaleVerified = false,
  onLoadStart,
  onLoadComplete,
  onLoadError,
  onArStart,
  onArUnavailable,
  className,
}: ModelViewerProps) {
  const labelId = useId();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const startedAt = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadModelViewerScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        if (!cancelled) setError('Não foi possível carregar o visualizador 3D.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!activated || !ready || !glbUrl || !hostRef.current) return;

    const host = hostRef.current;
    host.innerHTML = '';

    const el = document.createElement('model-viewer') as HTMLElement & {
      canActivateAR?: boolean;
      activateAR?: () => void;
    };
    el.setAttribute('src', glbUrl);
    if (usdzUrl) el.setAttribute('ios-src', usdzUrl);
    if (posterUrl) el.setAttribute('poster', posterUrl);
    el.setAttribute('alt', alt);
    el.setAttribute('ar', '');
    el.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    el.setAttribute('ar-scale', 'fixed');
    el.setAttribute('ar-placement', 'floor');
    el.setAttribute('camera-controls', '');
    el.setAttribute('touch-action', 'pan-y');
    el.setAttribute('shadow-intensity', '1');
    el.setAttribute('environment-image', 'neutral');
    el.setAttribute('exposure', '1');
    el.setAttribute('loading', 'lazy');
    el.setAttribute('reveal', 'auto');
    el.style.width = '100%';
    el.style.height = '360px';
    el.style.background = 'transparent';

    const handleLoad = () => {
      setLoading(false);
      const duration = startedAt.current ? performance.now() - startedAt.current : 0;
      onLoadComplete?.(Math.round(duration));
    };
    const handleError = () => {
      setLoading(false);
      setError('Falha ao carregar o modelo 3D.');
      onLoadError?.('model_load_failed');
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    host.appendChild(el);

    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      host.innerHTML = '';
    };
  }, [
    activated,
    ready,
    glbUrl,
    usdzUrl,
    posterUrl,
    alt,
    onLoadComplete,
    onLoadError,
  ]);

  if (!glbUrl) {
    return (
      <div
        className={cn(
          'flex min-h-[320px] flex-col justify-end rounded-3xl border border-dashed border-line bg-ink p-6 text-white',
          className,
        )}
      >
        <Badge className="mb-3 w-fit border-0 bg-white/10 text-white">Modelo demonstrativo</Badge>
        <h3 className="font-display text-xl font-semibold">Modelo 3D ainda não configurado</h3>
        <p className="mt-2 max-w-md text-sm text-white/70">
          Defina <code className="text-jade">VITE_DEMO_GLB_URL</code> e opcionalmente{' '}
          <code className="text-jade">VITE_DEMO_USDZ_URL</code> para ativar a experiência. A fotografia e o
          cardápio continuam disponíveis.
        </p>
        <Button className="mt-4 w-fit" variant="outline" disabled>
          Ver na minha mesa
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-3xl border border-line bg-white', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p id={labelId} className="font-display text-sm font-semibold text-ink">
            Experiência 3D
          </p>
          <p className="text-xs text-muted">{scaleLabel(scaleVerified)}</p>
        </div>
        {!usdzUrl ? (
          <Badge>AR depende de dispositivo compatível</Badge>
        ) : (
          <Badge className="border-0 bg-jade-soft text-jade-dark">AR disponível</Badge>
        )}
      </div>

      {!activated ? (
        <div className="relative flex min-h-[360px] flex-col items-start justify-end bg-gradient-to-br from-ink via-surface-dark to-ink p-6">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(57,215,162,0.25),transparent_45%)]" />
          )}
          <div className="relative space-y-3">
            <h3 className="font-display text-2xl font-semibold text-white">Explorar em 3D</h3>
            <p className="max-w-sm text-sm text-white/70">
              O arquivo é baixado sob demanda para preservar a performance do cardápio.
            </p>
            <Button
              onClick={() => {
                setActivated(true);
                setLoading(true);
                setError(null);
                startedAt.current = performance.now();
                onLoadStart?.();
              }}
            >
              Explorar em 3D
            </Button>
          </div>
        </div>
      ) : null}

      {activated && ready ? (
        <div className="relative min-h-[360px] bg-paper">
          <div ref={hostRef} />
          {loading ? (
            <p
              className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs text-muted"
              aria-live="polite"
            >
              Carregando modelo…
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 border-t border-line p-4">
            <Button
              type="button"
              onClick={() => {
                const el = hostRef.current?.querySelector('model-viewer') as
                  | (HTMLElement & { canActivateAR?: boolean; activateAR?: () => void })
                  | null
                  | undefined;
                if (el?.canActivateAR && el.activateAR) {
                  onArStart?.();
                  el.activateAR();
                } else {
                  onArUnavailable?.();
                }
              }}
            >
              Ver na minha mesa
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActivated(false);
                setError(null);
              }}
            >
              Fechar 3D
            </Button>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="space-y-3 border-t border-line p-4">
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setError(null);
              setActivated(true);
              setLoading(true);
              startedAt.current = performance.now();
              onLoadStart?.();
            }}
          >
            Tentar novamente
          </Button>
        </div>
      ) : null}
    </div>
  );
}
