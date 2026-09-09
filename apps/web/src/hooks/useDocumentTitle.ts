import { useEffect } from 'react';
import { appConfig } from '@/lib/config';

export function useDocumentTitle(title?: string | null, description?: string | null) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} · ${appConfig.name}` : `${appConfig.name} — Veja o prato antes de pedir`;

    let meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;
    if (description) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription != null) {
        meta.setAttribute('content', previousDescription);
      }
    };
  }, [title, description]);
}
