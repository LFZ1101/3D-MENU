import type {
  AnalyticsEventInput,
  Category,
  ModelRequest,
  ModelRequestStatus,
  Product,
  QrCode,
  Restaurant,
  RestaurantMember,
  Subscription,
} from '@menuar/shared';
import { appConfig } from '@/lib/config';
import { shouldUseMockData } from '@/lib/supabase';
import { supabaseMenuApi } from '@/services/api/supabase-menu';
import { mockStore } from '@/services/mock/store';

export interface MenuBundle {
  restaurant: Restaurant;
  unit: ReturnType<typeof mockStore.getUnit> | null;
  categories: Category[];
  products: Product[];
}

export interface DashboardData {
  restaurant: Restaurant;
  subscription: Subscription;
  analytics: ReturnType<typeof mockStore.getAnalytics>;
  modelRequests: ModelRequest[];
  unavailableCount: number;
  qrCodes: QrCode[];
  notifications: ReturnType<typeof mockStore.getNotifications>;
}

export type TeamMember = RestaurantMember & { fullName: string; email: string };

const mockEvents: AnalyticsEventInput[] = [];

async function mockDelay(ms = 80): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const menuRepository = {
  async getBySlug(slug: string): Promise<MenuBundle | null> {
    if (!shouldUseMockData()) {
      return supabaseMenuApi.getBySlug(slug);
    }
    await mockDelay();
    const restaurant = mockStore.getRestaurant();
    if (slug !== restaurant.slug) return null;
    return {
      restaurant,
      unit: mockStore.getUnit(),
      categories: mockStore.getCategories(),
      products: mockStore.getProducts(),
    };
  },

  async getProduct(restaurantSlug: string, productSlug: string) {
    const menu = await this.getBySlug(restaurantSlug);
    if (!menu) return null;
    const product = menu.products.find((item) => item.slug === productSlug);
    if (!product) return null;
    const category = menu.categories.find((item) => item.id === product.categoryId) ?? null;
    return { restaurant: menu.restaurant, product, category };
  },

  async resolveQr(shortCode: string) {
    if (!shouldUseMockData()) {
      return supabaseMenuApi.resolveQr(shortCode);
    }
    await mockDelay(40);
    const qr = mockStore.getQrCodes().find((item) => item.shortCode === shortCode && item.active);
    if (!qr) return null;
    return { qr, restaurant: mockStore.getRestaurant() };
  },
};

export const dashboardRepository = {
  async getRestaurantDashboard(): Promise<DashboardData> {
    await mockDelay();
    const products = mockStore.getProducts();
    return {
      restaurant: mockStore.getRestaurant(),
      subscription: mockStore.getSubscription(),
      analytics: mockStore.getAnalytics(),
      modelRequests: mockStore.getModelRequests(),
      unavailableCount: products.filter((p) => !p.isAvailable).length,
      qrCodes: mockStore.getQrCodes(),
      notifications: mockStore.getNotifications(),
    };
  },

  async listCategories() {
    await mockDelay();
    return mockStore.getAllCategories();
  },

  async createCategory(input: { name: string; description?: string | null }) {
    await mockDelay();
    return mockStore.createCategory(input);
  },

  async updateCategory(id: string, input: Partial<Category>) {
    await mockDelay();
    return mockStore.updateCategory(id, input);
  },

  async archiveCategory(id: string) {
    await mockDelay();
    return mockStore.archiveCategory(id);
  },

  async reorderCategories(orderedIds: string[]) {
    await mockDelay();
    return mockStore.reorderCategories(orderedIds);
  },

  async listProducts(): Promise<Product[]> {
    await mockDelay();
    return mockStore.getProducts();
  },

  async createProduct(input: {
    name: string;
    categoryId: string;
    priceCents: number;
    shortDescription?: string | null;
    description?: string | null;
  }) {
    await mockDelay();
    return mockStore.createProduct(input);
  },

  async updateProduct(id: string, input: Partial<Product>) {
    await mockDelay();
    return mockStore.updateProduct(id, input);
  },

  async updateProductAvailability(productId: string, isAvailable: boolean) {
    return this.updateProduct(productId, { isAvailable });
  },

  async updateProductPrice(productId: string, priceCents: number) {
    return this.updateProduct(productId, { priceCents });
  },

  async duplicateProduct(id: string) {
    await mockDelay();
    return mockStore.duplicateProduct(id);
  },

  async updateBranding(input: Partial<Restaurant>) {
    await mockDelay();
    return mockStore.updateBranding(input);
  },

  async listModelRequests(): Promise<ModelRequest[]> {
    await mockDelay();
    return mockStore.getModelRequests();
  },

  async createModelRequest(input: {
    productId: string;
    widthCm?: number | null;
    heightCm?: number | null;
    depthCm?: number | null;
    notes?: string | null;
  }) {
    await mockDelay();
    return mockStore.createModelRequest(input);
  },

  async reviewModel(id: string, decision: 'approved' | 'changes_requested', comment?: string) {
    await mockDelay();
    return mockStore.reviewModel(id, decision, comment);
  },

  async createQrCode(input: {
    shortCode: string;
    sourceType: QrCode['sourceType'];
    tableLabel?: string | null;
    campaignName?: string | null;
  }) {
    await mockDelay();
    return mockStore.createQrCode(input);
  },

  async listMembers(): Promise<TeamMember[]> {
    await mockDelay();
    return mockStore.getMembers();
  },

  async addMember(input: { fullName: string; email: string; role: RestaurantMember['role'] }) {
    await mockDelay();
    return mockStore.addMember(input);
  },

  async markNotificationRead(id: string) {
    await mockDelay();
    return mockStore.markNotificationRead(id);
  },
};

export const adminRepository = {
  async listRestaurants(): Promise<Restaurant[]> {
    await mockDelay();
    return mockStore.getRestaurants();
  },

  async getRestaurant(id: string) {
    await mockDelay();
    return mockStore.getRestaurants().find((item) => item.id === id) ?? null;
  },

  async updateRestaurantStatus(id: string, status: Restaurant['status']) {
    await mockDelay();
    return mockStore.updateRestaurantStatus(id, status);
  },

  async listModelRequests(): Promise<ModelRequest[]> {
    await mockDelay();
    return mockStore.getModelRequests();
  },

  async updateModelRequestStatus(id: string, status: ModelRequestStatus, notes?: string) {
    await mockDelay();
    return mockStore.updateModelRequestStatus(id, status, notes);
  },

  async listSubscriptions() {
    await mockDelay();
    return mockStore.getSubscriptions();
  },

  async updateSubscriptionStatus(id: string, status: Subscription['status']) {
    await mockDelay();
    return mockStore.updateSubscriptionStatus(id, status);
  },

  async getOverview() {
    await mockDelay();
    const restaurants = mockStore.getRestaurants();
    const subscriptions = mockStore.getSubscriptions();
    const products = mockStore.getProducts();
    const requests = mockStore.getModelRequests();
    return {
      activeRestaurants: restaurants.filter((r) => r.status === 'active').length,
      trialRestaurants: subscriptions.filter((s) => s.status === 'trialing').length,
      pastDue: subscriptions.filter((s) => s.status === 'past_due' || s.status === 'grace_period').length,
      totalModels: products.filter((p) => p.has3d).length,
      pendingRequests: requests.filter((r) =>
        ['submitted', 'material_review', 'processing', 'internal_review', 'customer_review'].includes(
          r.status,
        ),
      ).length,
      avgArRate: 0.089,
      storageMbApprox: 42,
    };
  },
};

export const analyticsRepository = {
  async track(event: AnalyticsEventInput): Promise<void> {
    if (shouldUseMockData()) {
      mockEvents.push(event);
      if (import.meta.env.DEV) {
        console.info('[analytics:mock]', event.eventName, event);
      }
      return;
    }

    await fetch(`${appConfig.apiUrl}/api/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  },

  getMockEvents(): AnalyticsEventInput[] {
    return [...mockEvents];
  },
};

export const authRepository = {
  async signIn(email: string, _password: string): Promise<{ email: string; role: string }> {
    await mockDelay();
    if (!email.includes('@')) throw new Error('E-mail inválido');
    return {
      email,
      role: email.includes('admin') ? 'super_admin' : 'owner',
    };
  },
};

export const uploadRepository = {
  async requestSignedUpload(input: {
    restaurantId: string;
    key: string;
    contentType: string;
    sizeBytes: number;
    kind: 'image' | 'model';
    token?: string;
  }) {
    const response = await fetch(`${appConfig.apiUrl}/api/uploads/sign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${input.token || 'mock-token'}`,
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error || 'Falha ao autorizar upload');
    }
    return response.json() as Promise<{
      uploadUrl: string;
      publicUrl: string | null;
      expiresIn: number;
    }>;
  },
};
