export const APP_CONFIG = {
  name: 'MenuAR',
  slug: 'menuar',
  tagline: 'Seu cliente vê o prato antes de pedir.',
  description:
    'Transforme os principais pratos do seu restaurante em experiências 3D que podem ser visualizadas sobre a própria mesa, diretamente pelo navegador.',
  defaultLocale: 'pt-BR',
  defaultCurrency: 'BRL',
  defaultTimezone: 'America/Sao_Paulo',
} as const;

export const BRAND_TOKENS = {
  ink: '#091014',
  inkSoft: '#111a1e',
  surfaceDark: '#162126',
  paper: '#f4f7f6',
  white: '#ffffff',
  text: '#1d292f',
  muted: '#68777d',
  line: '#d9e2df',
  jade: '#39d7a2',
  jadeDark: '#118a68',
  jadeSoft: '#e8f8f2',
  danger: '#d65c5c',
  warning: '#f4b942',
} as const;

export const UPLOAD_LIMITS = {
  imageMaxBytes: 10 * 1024 * 1024,
  videoMaxBytes: 100 * 1024 * 1024,
  modelMaxBytes: 25 * 1024 * 1024,
  modelPublishRecommendedBytes: 5 * 1024 * 1024,
  modelTargetBytes: 2 * 1024 * 1024,
} as const;

export const ALLOWED_IMAGE_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const ALLOWED_VIDEO_MIME = ['video/mp4', 'video/quicktime'] as const;

export const ALLOWED_MODEL_MIME = [
  'model/gltf-binary',
  'model/vnd.usdz+zip',
  'application/octet-stream',
] as const;

export const MODEL_REQUEST_STATUSES = [
  'draft',
  'submitted',
  'material_review',
  'needs_new_capture',
  'processing',
  'internal_review',
  'customer_review',
  'changes_requested',
  'approved',
  'published',
  'rejected',
  'archived',
] as const;

export const SUBSCRIPTION_STATUSES = [
  'trialing',
  'active',
  'past_due',
  'grace_period',
  'suspended',
  'canceled',
] as const;

export const MEMBER_ROLES = ['owner', 'manager', 'editor', 'viewer'] as const;

export const GLOBAL_ROLES = ['user', 'operator_3d', 'super_admin'] as const;

export const QR_SOURCE_TYPES = [
  'table',
  'counter',
  'menu_print',
  'instagram',
  'whatsapp',
  'delivery_package',
  'event',
  'campaign',
  'other',
] as const;

export const ANALYTICS_EVENTS = [
  'menu_view',
  'category_view',
  'search_performed',
  'product_view',
  'product_share',
  'product_interest',
  'model_requested',
  'model_load_started',
  'model_load_completed',
  'model_load_failed',
  'model_interaction',
  'ar_button_view',
  'ar_started',
  'ar_unavailable',
  'ar_failed',
  'waiter_call_clicked',
  'whatsapp_clicked',
  'qr_scanned',
] as const;

export const PLANS = [
  {
    code: 'founder',
    name: 'Piloto fundador',
    monthlyPriceCents: 9900,
    maxUnits: 1,
    maxProducts: 100,
    max3dModels: 5,
    analyticsRetentionDays: 30,
    customDomainEnabled: false,
    recommended: true,
  },
  {
    code: 'essential',
    name: 'Essencial',
    monthlyPriceCents: 14900,
    maxUnits: 1,
    maxProducts: 150,
    max3dModels: 5,
    analyticsRetentionDays: 60,
    customDomainEnabled: false,
    recommended: false,
  },
  {
    code: 'experience',
    name: 'Experiência',
    monthlyPriceCents: 24900,
    maxUnits: 1,
    maxProducts: 300,
    max3dModels: 12,
    analyticsRetentionDays: 90,
    customDomainEnabled: false,
    recommended: false,
  },
  {
    code: 'premium',
    name: 'Premium',
    monthlyPriceCents: 44900,
    maxUnits: 3,
    maxProducts: 500,
    max3dModels: 30,
    analyticsRetentionDays: 180,
    customDomainEnabled: true,
    recommended: false,
  },
] as const;

export const FOUNDING_SETUP_FEE_CENTS = 79000;
