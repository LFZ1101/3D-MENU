import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '@/lib/config';

let client: SupabaseClient | null = null;

export function hasSupabaseCredentials(): boolean {
  return Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey);
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!hasSupabaseCredentials()) return null;
  if (!client) {
    client = createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export function shouldUseMockData(): boolean {
  return appConfig.useMockData || !hasSupabaseCredentials();
}
