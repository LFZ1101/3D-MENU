import { z } from 'zod';
import {
  ANALYTICS_EVENTS,
  GLOBAL_ROLES,
  MEMBER_ROLES,
  MODEL_REQUEST_STATUSES,
  QR_SOURCE_TYPES,
  SUBSCRIPTION_STATUSES,
} from '../constants/index.js';

export const uuidSchema = z.string().uuid();

export const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug inválido');

export const moneyCentsSchema = z.number().int().nonnegative();

export const memberRoleSchema = z.enum(MEMBER_ROLES);
export const globalRoleSchema = z.enum(GLOBAL_ROLES);
export const modelRequestStatusSchema = z.enum(MODEL_REQUEST_STATUSES);
export const subscriptionStatusSchema = z.enum(SUBSCRIPTION_STATUSES);
export const qrSourceTypeSchema = z.enum(QR_SOURCE_TYPES);
export const analyticsEventNameSchema = z.enum(ANALYTICS_EVENTS);

export const restaurantPublicSchema = z.object({
  id: uuidSchema,
  name: z.string().min(2),
  slug: slugSchema,
  description: z.string().nullable(),
  logoUrl: z.string().url().nullable(),
  coverUrl: z.string().url().nullable(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  theme: z.enum(['light', 'dark']),
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  instagram: z.string().nullable(),
  website: z.string().url().nullable(),
  timezone: z.string(),
  currency: z.string(),
  locale: z.string(),
  status: z.enum(['draft', 'active', 'suspended', 'archived']),
});

export const productPublicSchema = z.object({
  id: uuidSchema,
  restaurantId: uuidSchema,
  categoryId: uuidSchema,
  name: z.string().min(1),
  slug: slugSchema,
  shortDescription: z.string().nullable(),
  description: z.string().nullable(),
  priceCents: moneyCentsSchema,
  currency: z.string().default('BRL'),
  servesMin: z.number().int().positive().nullable(),
  servesMax: z.number().int().positive().nullable(),
  widthCm: z.number().positive().nullable(),
  heightCm: z.number().positive().nullable(),
  depthCm: z.number().positive().nullable(),
  ingredients: z.array(z.string()).default([]),
  allergenNotes: z.string().nullable(),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  isGlutenFree: z.boolean(),
  isSpicy: z.boolean(),
  isFeatured: z.boolean(),
  isAvailable: z.boolean(),
  has3d: z.boolean(),
  sortOrder: z.number().int(),
  imageUrl: z.string().nullable(),
  posterUrl: z.string().nullable(),
  glbUrl: z.string().nullable(),
  usdzUrl: z.string().nullable(),
  scaleVerified: z.boolean().default(false),
});

export const categorySchema = z.object({
  id: uuidSchema,
  restaurantId: uuidSchema,
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().nullable(),
  sortOrder: z.number().int(),
  active: z.boolean(),
});

export const analyticsEventSchema = z.object({
  eventName: analyticsEventNameSchema,
  restaurantId: uuidSchema,
  unitId: uuidSchema.optional().nullable(),
  productId: uuidSchema.optional().nullable(),
  qrCodeId: uuidSchema.optional().nullable(),
  anonymousSessionId: z.string().uuid(),
  source: z.string().max(80).optional().nullable(),
  tableLabel: z.string().max(40).optional().nullable(),
  deviceType: z.string().max(40).optional().nullable(),
  browserFamily: z.string().max(40).optional().nullable(),
  osFamily: z.string().max(40).optional().nullable(),
  occurredAt: z.string().datetime().optional(),
  durationMs: z.number().int().nonnegative().optional().nullable(),
  errorCode: z.string().max(80).optional().nullable(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export const modelRequestCreateSchema = z.object({
  productId: uuidSchema,
  widthCm: z.number().positive().optional().nullable(),
  heightCm: z.number().positive().optional().nullable(),
  depthCm: z.number().positive().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  dishType: z.string().max(80).optional().nullable(),
  servesPeople: z.number().int().positive().optional().nullable(),
  plateStaticConfirmed: z.literal(true),
  processingAuthorized: z.literal(true),
  responsibilityAccepted: z.literal(true),
});

export const qrRedirectSchema = z.object({
  shortCode: z
    .string()
    .min(4)
    .max(32)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
export type ProductPublic = z.infer<typeof productPublicSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ModelRequestCreate = z.infer<typeof modelRequestCreateSchema>;
