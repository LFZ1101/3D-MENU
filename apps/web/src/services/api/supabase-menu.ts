import type {
  Category,
  Product,
  QrCode,
  Restaurant,
  Unit,
} from '@menuar/shared';
import { getSupabaseClient } from '@/lib/supabase';

function mapRestaurant(row: Record<string, unknown>): Restaurant {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: (row.description as string | null) ?? null,
    logoUrl: (row.logo_url as string | null) ?? null,
    coverUrl: (row.cover_url as string | null) ?? null,
    primaryColor: String(row.primary_color ?? '#39d7a2'),
    secondaryColor: String(row.secondary_color ?? '#118a68'),
    backgroundColor: String(row.background_color ?? '#f4f7f6'),
    textColor: String(row.text_color ?? '#1d292f'),
    theme: (row.theme as 'light' | 'dark') ?? 'light',
    phone: (row.phone as string | null) ?? null,
    whatsapp: (row.whatsapp as string | null) ?? null,
    instagram: (row.instagram as string | null) ?? null,
    website: (row.website as string | null) ?? null,
    timezone: String(row.timezone ?? 'America/Sao_Paulo'),
    currency: String(row.currency ?? 'BRL'),
    locale: String(row.locale ?? 'pt-BR'),
    status: (row.status as Restaurant['status']) ?? 'draft',
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id),
    name: String(row.name),
    slug: String(row.slug),
    description: (row.description as string | null) ?? null,
    sortOrder: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id),
    categoryId: String(row.category_id),
    name: String(row.name),
    slug: String(row.slug),
    shortDescription: (row.short_description as string | null) ?? null,
    description: (row.description as string | null) ?? null,
    priceCents: Number(row.price_cents ?? 0),
    currency: String(row.currency ?? 'BRL'),
    servesMin: (row.serves_min as number | null) ?? null,
    servesMax: (row.serves_max as number | null) ?? null,
    widthCm: (row.width_cm as number | null) ?? null,
    heightCm: (row.height_cm as number | null) ?? null,
    depthCm: (row.depth_cm as number | null) ?? null,
    ingredients: (row.ingredients as string[]) ?? [],
    allergenNotes: (row.allergen_notes as string | null) ?? null,
    isVegetarian: Boolean(row.is_vegetarian),
    isVegan: Boolean(row.is_vegan),
    isGlutenFree: Boolean(row.is_gluten_free),
    isSpicy: Boolean(row.is_spicy),
    isFeatured: Boolean(row.is_featured),
    isAvailable: Boolean(row.is_available),
    has3d: Boolean(row.has_3d),
    sortOrder: Number(row.sort_order ?? 0),
    imageUrl: null,
    posterUrl: null,
    glbUrl: null,
    usdzUrl: null,
    scaleVerified: false,
  };
}

function mapUnit(row: Record<string, unknown>): Unit {
  return {
    id: String(row.id),
    restaurantId: String(row.restaurant_id),
    name: String(row.name),
    slug: String(row.slug),
    address: (row.address as string | null) ?? null,
    city: (row.city as string | null) ?? null,
    state: (row.state as string | null) ?? null,
    postalCode: (row.postal_code as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    whatsapp: (row.whatsapp as string | null) ?? null,
    openingHours: (row.opening_hours as Unit['openingHours']) ?? null,
    active: Boolean(row.active),
  };
}

export const supabaseMenuApi = {
  async getBySlug(slug: string) {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle();

    if (error || !restaurant) return null;

    const restaurantId = String(restaurant.id);
    const [{ data: categories }, { data: products }, { data: units }] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('active', true)
        .is('archived_at', null)
        .order('sort_order'),
      supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .is('archived_at', null)
        .order('sort_order'),
      supabase.from('units').select('*').eq('restaurant_id', restaurantId).eq('active', true).limit(1),
    ]);

    return {
      restaurant: mapRestaurant(restaurant),
      unit: units?.[0] ? mapUnit(units[0]) : null,
      categories: (categories ?? []).map(mapCategory),
      products: (products ?? []).map(mapProduct),
    };
  },

  async resolveQr(shortCode: string): Promise<{ qr: QrCode; restaurant: Restaurant } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data: qr, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('short_code', shortCode)
      .eq('active', true)
      .maybeSingle();

    if (error || !qr) return null;

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', qr.restaurant_id)
      .maybeSingle();

    if (!restaurant) return null;

    return {
      restaurant: mapRestaurant(restaurant),
      qr: {
        id: String(qr.id),
        shortCode: String(qr.short_code),
        restaurantId: String(qr.restaurant_id),
        unitId: (qr.unit_id as string | null) ?? null,
        tableLabel: (qr.table_label as string | null) ?? null,
        campaignName: (qr.campaign_name as string | null) ?? null,
        sourceType: qr.source_type,
        destinationPath: String(qr.destination_path),
        active: Boolean(qr.active),
      },
    };
  },
};
