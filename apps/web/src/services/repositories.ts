import type {
  AnalyticsEventInput,
  AnalyticsSummary,
  Category,
  ModelRequest,
  Product,
  QrCode,
  Restaurant,
  Subscription,
  Unit,
} from '@menuar/shared';
import { appConfig } from '@/lib/config';
import {
  demoAnalytics,
  demoCategories,
  demoModelRequests,
  demoProducts,
  demoQrCodes,
  demoRestaurant,
  demoSubscription,
  demoUnit,
  secondRestaurant,
} from './mock/data';

export interface MenuBundle {
  restaurant: Restaurant;
  unit: Unit | null;
  categories: Category[];
  products: Product[];
}

export interface DashboardData {
  restaurant: Restaurant;
  subscription: Subscription;
  analytics: AnalyticsSummary;
  modelRequests: ModelRequest[];
  unavailableCount: number;
  qrCodes: QrCode[];
}

const mockEvents: AnalyticsEventInput[] = [];

async function mockDelay(ms = 120): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export const menuRepository = {
  async getBySlug(slug: string): Promise<MenuBundle | null> {
    if (!appConfig.useMockData) {
      // Integração real: consultar Supabase / Worker
      return null;
    }
    await mockDelay();
    if (slug !== demoRestaurant.slug) return null;
    return {
      restaurant: demoRestaurant,
      unit: demoUnit,
      categories: demoCategories,
      products: [...demoProducts],
    };
  },

  async getProduct(restaurantSlug: string, productSlug: string): Promise<{
    restaurant: Restaurant;
    product: Product;
    category: Category | null;
  } | null> {
    const menu = await this.getBySlug(restaurantSlug);
    if (!menu) return null;
    const product = menu.products.find((item) => item.slug === productSlug);
    if (!product) return null;
    const category = menu.categories.find((item) => item.id === product.categoryId) ?? null;
    return { restaurant: menu.restaurant, product, category };
  },

  async resolveQr(shortCode: string): Promise<{
    qr: QrCode;
    restaurant: Restaurant;
  } | null> {
    await mockDelay(60);
    const qr = demoQrCodes.find((item) => item.shortCode === shortCode && item.active);
    if (!qr) return null;
    return { qr, restaurant: demoRestaurant };
  },
};

export const dashboardRepository = {
  async getRestaurantDashboard(): Promise<DashboardData> {
    await mockDelay();
    return {
      restaurant: demoRestaurant,
      subscription: demoSubscription,
      analytics: demoAnalytics,
      modelRequests: demoModelRequests,
      unavailableCount: demoProducts.filter((p) => !p.isAvailable).length,
      qrCodes: demoQrCodes,
    };
  },

  async listProducts(): Promise<Product[]> {
    await mockDelay();
    return [...demoProducts];
  },

  async updateProductAvailability(productId: string, isAvailable: boolean): Promise<Product> {
    await mockDelay();
    const product = demoProducts.find((item) => item.id === productId);
    if (!product) throw new Error('Produto não encontrado');
    product.isAvailable = isAvailable;
    return { ...product };
  },

  async updateProductPrice(productId: string, priceCents: number): Promise<Product> {
    await mockDelay();
    const product = demoProducts.find((item) => item.id === productId);
    if (!product) throw new Error('Produto não encontrado');
    product.priceCents = priceCents;
    return { ...product };
  },

  async listModelRequests(): Promise<ModelRequest[]> {
    await mockDelay();
    return [...demoModelRequests];
  },
};

export const adminRepository = {
  async listRestaurants(): Promise<Restaurant[]> {
    await mockDelay();
    return [demoRestaurant, secondRestaurant];
  },

  async listModelRequests(): Promise<ModelRequest[]> {
    await mockDelay();
    return [...demoModelRequests];
  },

  async getOverview() {
    await mockDelay();
    return {
      activeRestaurants: 1,
      trialRestaurants: 1,
      pastDue: 0,
      totalModels: demoProducts.filter((p) => p.has3d).length,
      pendingRequests: demoModelRequests.length,
      avgArRate: 0.089,
    };
  },
};

export const analyticsRepository = {
  async track(event: AnalyticsEventInput): Promise<void> {
    if (appConfig.useMockData) {
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
