export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function formatBRL(cents: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100);
}

export function formatServes(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  if (min && max && min !== max) return `Serve ${min} a ${max} pessoas`;
  const value = min ?? max;
  return value === 1 ? 'Serve 1 pessoa' : `Serve ${value} pessoas`;
}

export function canEditMenu(role: string): boolean {
  return role === 'owner' || role === 'manager' || role === 'editor';
}

export function canManageTeam(role: string): boolean {
  return role === 'owner';
}

export function canManageModels(role: string): boolean {
  return role === 'owner' || role === 'manager';
}

export function canViewAnalytics(role: string): boolean {
  return role === 'owner' || role === 'manager' || role === 'viewer' || role === 'editor';
}

export function isSubscriptionEditable(status: string): boolean {
  return status === 'trialing' || status === 'active' || status === 'past_due' || status === 'grace_period';
}

export function isSubscriptionBlocked(status: string): boolean {
  return status === 'suspended' || status === 'canceled';
}

export function scaleLabel(verified: boolean): string {
  return verified ? 'Visualização em escala revisada' : 'Visualização aproximada';
}

export function buildMenuPath(restaurantSlug: string): string {
  return `/r/${restaurantSlug}`;
}

export function buildProductPath(restaurantSlug: string, productSlug: string): string {
  return `/r/${restaurantSlug}/p/${productSlug}`;
}

export function buildQrPath(shortCode: string): string {
  return `/q/${shortCode}`;
}

export function isAllowedMime(mime: string, allowlist: readonly string[]): boolean {
  return allowlist.includes(mime);
}

export function clampFileSize(sizeBytes: number, maxBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= maxBytes;
}

export function safeMetadata(
  input: Record<string, string | number | boolean | null> | undefined,
  maxKeys = 12,
): Record<string, string | number | boolean | null> {
  if (!input) return {};
  return Object.fromEntries(Object.entries(input).slice(0, maxKeys));
}
