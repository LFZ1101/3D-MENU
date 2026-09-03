/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_PUBLIC_PRICING_ENABLED?: string;
  readonly VITE_USE_MOCK_DATA?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_DEMO_GLB_URL?: string;
  readonly VITE_DEMO_USDZ_URL?: string;
  readonly VITE_DEMO_POSTER_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
