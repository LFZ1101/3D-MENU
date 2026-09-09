import { useEffect, useId, useRef, useState } from 'react';
import { scaleLabel } from '@menuar/shared';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
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
  const [arMessage, setArMessage] = useState<string | null>(null);

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
    el.setAttribute('camera-controls', '');
    el.setAttribute('touch-action', 'pan-y');
    el.setAttribute('shadow-intensity', '0.7');
    el.setAttribute('environment-image', 'neutral');
    el.setAttribute('ar', '');
    el.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    el.setAttribute('ar-scale', 'fixed');
    el.setAttribute('ar-placement', 'floor');
    el.setAttribute('exposure', '1');
    el.style.width = '100%';
    el.style.height = '360px';
    el.setAttribute('aria-labelledby', labelId);

    const handleLoad = () => {
      setLoading(false);
      const duration = startedAt.current ? performance.now() - startedAt.current : 0;
      onLoadComplete?.(Math.round(duration));
    };
    const handleError = () => {
      setLoading(false);
      setError('Não foi possível carregar o modelo 3D. A foto do prato continua disponível.');
      onLoadError?.('model_load_failed');
    };
    const handleProgress = (event: Event) => {
      const detail = (event as CustomEvent<{ totalProgress?: number }>).detail;
      if (detail?.totalProgress != null && detail.totalProgress >= 1) {
        setLoading(false);
      }
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    el.addEventListener('progress', handleProgress);
    host.appendChild(el);

    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      el.removeEventListener('progress', handleProgress);
      host.innerHTML = '';
    };
  }, [
    activated,
    ready,
    glbUrl,
    usdzUrl,
    posterUrl,
    alt,
    labelId,
    onLoadComplete,
    onLoadError,
  ]);

  if (!glbUrl) {
    return (
      <div
        className={cn(
          'flex min-h-[280px] flex-col justify-end rounded-3xl border border-dashed border-line bg-ink p-6 text-white',
          className,
        )}
      >
        <StatusBadge label="Fotografia disponível" tone="info" className="mb-3 bg-white/10 text-white" />
        <h3 className="font-display text-xl font-semibold">Modelo 3D ainda não publicado</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
          Este prato ainda não tem arquivo 3D. Você continua vendo a fotografia e as informações do cardápio.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-3xl border border-line bg-white', className)}>
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p id={labelId} className="font-display text-sm font-semibold text-ink">
            Experiência 3D
          </p>
          <p className="text-xs text-muted">{scaleLabel(scaleVerified)}</p>
        </div>
        <StatusBadge
          label={usdzUrl ? 'AR pronta neste dispositivo*' : 'AR depende do celular/navegador'}
          tone={usdzUrl ? 'success' : 'info'}
        />
      </div>

      {!activated ? (
        <div className="relative flex min-h-[360px] flex-col items-start justify-end overflow-hidden bg-ink p-6">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={alt}
              width={800}
              height={600}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
            />
          ) : (
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(57,215,162,0.25),transparent_45%)]" />
          )}
          <div className="relative space-y-3">
            <h3 className="font-display text-2xl font-semibold text-white">Ver em 3D</h3>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              Gire o prato em todos os ângulos. O arquivo só é baixado quando você pedir — para o cardápio
              continuar rápido.
            </p>
            <Button
              onClick={() => {
                setActivated(true);
                setLoading(true);
                setError(null);
                setArMessage(null);
                startedAt.current = performance.now();
                onLoadStart?.();
              }}
            >
              Ver em 3D
            </Button>
          </div>
        </div>
      ) : null}

      {activated && ready ? (
        <div className="relative min-h-[360px] bg-paper">
          <div ref={hostRef} />
          {loading ? (
            <div
              className="absolute inset-x-4 top-4 rounded-xl border border-line bg-white/95 px-3 py-2 text-xs text-muted shadow-soft"
              aria-live="polite"
            >
              Carregando modelo 3D…
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full w-2/3 animate-shimmer rounded-full bg-jade" />
              </div>
            </div>
          ) : null}
          <div className="space-y-3 border-t border-line p-4">
            <p className="text-xs leading-relaxed text-muted">
              <strong className="text-ink">3D:</strong> gire com o dedo ou mouse.{" "}
              <strong className="text-ink">AR:</strong> aponta a câmera para uma superfície plana para ver o
              prato no ambiente.
            </p>
            {arMessage ? (
              <p className="text-sm text-muted" role="status">
                {arMessage}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => {
                  const el = hostRef.current?.querySelector('model-viewer') as
                    | (HTMLElement & { canActivateAR?: boolean; activateAR?: () => void })
                    | null
                    | undefined;
                  if (el?.canActivateAR && el.activateAR) {
                    setArMessage(null);
                    onArStart?.();
                    el.activateAR();
                  } else {
                    const message =
                      'Seu dispositivo não oferece realidade aumentada neste navegador. Você ainda pode explorar o prato em 3D.';
                    setArMessage(message);
                    onArUnavailable?.();
                  }
                }}
              >
                Ver no meu ambiente
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActivated(false);
                  setError(null);
                  setArMessage(null);
                }}
              >
                Fechar 3D
              </Button>
            </div>
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
