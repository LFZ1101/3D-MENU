import { APP_CONFIG } from '@menuar/shared';

const env = import.meta.env;

const hasSupabase = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);

export const appConfig = {
  name: env.VITE_APP_NAME || APP_CONFIG.name,
  url: env.VITE_APP_URL || 'http://localhost:5173',
  apiUrl: env.VITE_API_URL || 'http://localhost:8787',
  // Mock fica ativo por padrão; desliga automaticamente quando Supabase está configurado,
  // a menos que VITE_USE_MOCK_DATA=true force o mock.
  useMockData:
    env.VITE_USE_MOCK_DATA === 'true'
      ? true
      : env.VITE_USE_MOCK_DATA === 'false'
        ? false
        : !hasSupabase,
  pricingEnabled: env.VITE_PUBLIC_PRICING_ENABLED !== 'false',
  supabaseUrl: env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY || '',
  demoGlbUrl: env.VITE_DEMO_GLB_URL || '',
  demoUsdzUrl: env.VITE_DEMO_USDZ_URL || '',
  demoPosterUrl: env.VITE_DEMO_POSTER_URL || '',
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || '',
  contactEmail: env.VITE_CONTACT_EMAIL || 'contato@menuar.app',
  sentryDsn: env.VITE_SENTRY_DSN || '',
} as const;

export function whatsappLink(message?: string): string | null {
  if (!appConfig.whatsappNumber) return null;
  const text = encodeURIComponent(message ?? 'Olá! Quero testar o MenuAR no meu restaurante.');
  return `https://wa.me/${appConfig.whatsappNumber.replace(/\D/g, '')}?text=${text}`;
}
