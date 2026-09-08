import type {
  ANALYTICS_EVENTS,
  GLOBAL_ROLES,
  MEMBER_ROLES,
  MODEL_REQUEST_STATUSES,
  QR_SOURCE_TYPES,
  SUBSCRIPTION_STATUSES,
} from '../constants/index.js';

export type MemberRole = (typeof MEMBER_ROLES)[number];
export type GlobalRole = (typeof GLOBAL_ROLES)[number];
export type ModelRequestStatus = (typeof MODEL_REQUEST_STATUSES)[number];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];
export type QrSourceType = (typeof QR_SOURCE_TYPES)[number];
export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];

export type RestaurantStatus = 'draft' | 'active' | 'suspended' | 'archived';
export type ThemeMode = 'light' | 'dark';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  theme: ThemeMode;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  timezone: string;
  currency: string;
  locale: string;
  status: RestaurantStatus;
  isDemo?: boolean;
}

export interface Unit {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  phone: string | null;
  whatsapp: string | null;
  openingHours: OpeningHours | null;
  active: boolean;
}

export interface OpeningHours {
  [weekday: string]: { open: string; close: string; closed?: boolean } | undefined;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  priceCents: number;
  currency: string;
  servesMin: number | null;
  servesMax: number | null;
  widthCm: number | null;
  heightCm: number | null;
  depthCm: number | null;
  ingredients: string[];
  allergenNotes: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  has3d: boolean;
  sortOrder: number;
  imageUrl: string | null;
  posterUrl: string | null;
  glbUrl: string | null;
  usdzUrl: string | null;
  scaleVerified: boolean;
}

export interface Model3d {
  id: string;
  restaurantId: string;
  productId: string;
  version: number;
  glbUrl: string | null;
  usdzUrl: string | null;
  posterUrl: string | null;
  widthCm: number | null;
  heightCm: number | null;
  depthCm: number | null;
  scaleVerified: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface ModelRequest {
  id: string;
  restaurantId: string;
  productId: string;
  status: ModelRequestStatus;
  widthCm: number | null;
  heightCm: number | null;
  depthCm: number | null;
  notes: string | null;
  internalNotes: string | null;
  submittedAt: string | null;
  dueAt: string | null;
  createdAt: string;
  productName?: string;
}

export interface QrCode {
  id: string;
  shortCode: string;
  restaurantId: string;
  unitId: string | null;
  tableLabel: string | null;
  campaignName: string | null;
  sourceType: QrSourceType;
  destinationPath: string;
  active: boolean;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  monthlyPriceCents: number;
  maxUnits: number;
  maxProducts: number;
  max3dModels: number;
  analyticsRetentionDays: number;
  customDomainEnabled: boolean;
  active: boolean;
}

export interface Subscription {
  id: string;
  restaurantId: string;
  planId: string;
  status: SubscriptionStatus;
  monthlyPriceCents: number;
  startedAt: string;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  graceEndsAt: string | null;
  notes: string | null;
}

export interface AnalyticsSummary {
  menuViews: number;
  productViews: number;
  modelOpens: number;
  arActivations: number;
  arUnavailable: number;
  shares: number;
  interests: number;
  topProducts: Array<{ productId: string; name: string; views: number }>;
  daily: Array<{ date: string; views: number; modelOpens: number; arActivations: number }>;
}

export interface Profile {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  phone: string | null;
  globalRole: GlobalRole;
}

export interface RestaurantMember {
  id: string;
  restaurantId: string;
  userId: string;
  role: MemberRole;
  active: boolean;
}
