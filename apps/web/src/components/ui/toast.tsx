import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type ToastTone = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  push: (input: { title: string; description?: string; tone?: ToastTone }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((input: { title: string; description?: string; tone?: ToastTone }) => {
    const id = crypto.randomUUID();
    const item: ToastItem = {
      id,
      title: input.title,
      description: input.description,
      tone: input.tone ?? 'info',
    };
    setItems((current) => [...current, item]);
    window.setTimeout(() => {
      setItems((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.map((item) => (
          <div
            key={item.id}
            role="status"
            className={cn(
              'pointer-events-auto w-full max-w-sm animate-fade-up rounded-xl border px-4 py-3 shadow-lift',
              item.tone === 'success' && 'border-jade/40 bg-white text-ink',
              item.tone === 'error' && 'border-danger/40 bg-white text-ink',
              item.tone === 'info' && 'border-line bg-white text-ink',
            )}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            {item.description ? <p className="mt-1 text-xs text-muted">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return ctx;
}
