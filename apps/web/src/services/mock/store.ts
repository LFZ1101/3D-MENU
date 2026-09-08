import type {
  Category,
  ModelRequest,
  ModelRequestStatus,
  Product,
  QrCode,
  Restaurant,
  RestaurantMember,
  Subscription,
} from '@menuar/shared';
import { slugify } from '@menuar/shared';
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
} from './data';

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const state = {
  restaurant: { ...demoRestaurant },
  unit: { ...demoUnit },
  categories: demoCategories.map((item) => ({ ...item })),
  products: demoProducts.map((item) => ({ ...item })),
  qrCodes: demoQrCodes.map((item) => ({ ...item })),
  modelRequests: demoModelRequests.map((item) => ({ ...item })),
  subscription: { ...demoSubscription },
  members: [
    {
      id: 'm1',
      restaurantId: demoRestaurant.id,
      userId: 'u-owner',
      role: 'owner' as const,
      active: true,
      fullName: 'Ana Owner',
      email: 'owner@casafogo.demo',
    },
    {
      id: 'm2',
      restaurantId: demoRestaurant.id,
      userId: 'u-editor',
      role: 'editor' as const,
      active: true,
      fullName: 'Bruno Editor',
      email: 'editor@casafogo.demo',
    },
  ] as Array<RestaurantMember & { fullName: string; email: string }>,
  notifications: [
    {
      id: 'n1',
      title: 'Modelo pronto para revisão',
      body: 'Burger Brasa aguarda aprovação do restaurante.',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ],
  subscriptions: [
    { ...demoSubscription },
    {
      id: 's2',
      restaurantId: secondRestaurant.id,
      planId: 'plan-essential',
      status: 'past_due' as const,
      monthlyPriceCents: 14900,
      startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
      trialEndsAt: null,
      currentPeriodEnd: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      graceEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString(),
      notes: 'Aguardando pagamento',
    },
  ] as Subscription[],
  restaurants: [demoRestaurant, secondRestaurant] as Restaurant[],
};

export const mockStore = {
  getRestaurant() {
    return { ...state.restaurant };
  },
  getUnit() {
    return { ...state.unit };
  },
  getCategories() {
    return state.categories
      .filter((item) => item.active)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((item) => ({ ...item }));
  },
  getAllCategories() {
    return state.categories.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((item) => ({ ...item }));
  },
  getProducts() {
    return state.products.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((item) => ({ ...item }));
  },
  getQrCodes() {
    return state.qrCodes.map((item) => ({ ...item }));
  },
  getModelRequests() {
    return state.modelRequests.map((item) => ({ ...item }));
  },
  getSubscription() {
    return { ...state.subscription };
  },
  getAnalytics() {
    return structuredClone(demoAnalytics);
  },
  getMembers() {
    return state.members.map((item) => ({ ...item }));
  },
  getNotifications() {
    return state.notifications.map((item) => ({ ...item }));
  },
  getRestaurants() {
    return state.restaurants.map((item) => ({ ...item }));
  },
  getSubscriptions() {
    return state.subscriptions.map((item) => ({ ...item }));
  },

  updateBranding(input: Partial<Restaurant>) {
    state.restaurant = { ...state.restaurant, ...input };
    return this.getRestaurant();
  },

  createCategory(input: { name: string; description?: string | null }) {
    const category: Category = {
      id: createId('cat'),
      restaurantId: state.restaurant.id,
      name: input.name,
      slug: slugify(input.name),
      description: input.description ?? null,
      sortOrder: state.categories.length + 1,
      active: true,
    };
    state.categories.push(category);
    return { ...category };
  },

  updateCategory(id: string, input: Partial<Category>) {
    const index = state.categories.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Categoria não encontrada');
    state.categories[index] = { ...state.categories[index], ...input };
    return { ...state.categories[index] };
  },

  archiveCategory(id: string) {
    return this.updateCategory(id, { active: false });
  },

  reorderCategories(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const category = state.categories.find((item) => item.id === id);
      if (category) category.sortOrder = index + 1;
    });
    return this.getAllCategories();
  },

  createProduct(input: {
    name: string;
    categoryId: string;
    priceCents: number;
    shortDescription?: string | null;
    description?: string | null;
  }) {
    const product: Product = {
      id: createId('prod'),
      restaurantId: state.restaurant.id,
      categoryId: input.categoryId,
      name: input.name,
      slug: slugify(input.name),
      shortDescription: input.shortDescription ?? null,
      description: input.description ?? null,
      priceCents: input.priceCents,
      currency: 'BRL',
      servesMin: 1,
      servesMax: 1,
      widthCm: null,
      heightCm: null,
      depthCm: null,
      ingredients: [],
      allergenNotes: null,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      isFeatured: false,
      isAvailable: true,
      has3d: false,
      sortOrder: state.products.length + 1,
      imageUrl: null,
      posterUrl: null,
      glbUrl: null,
      usdzUrl: null,
      scaleVerified: false,
    };
    state.products.push(product);
    return { ...product };
  },

  updateProduct(id: string, input: Partial<Product>) {
    const index = state.products.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Produto não encontrado');
    state.products[index] = { ...state.products[index], ...input };
    return { ...state.products[index] };
  },

  duplicateProduct(id: string) {
    const original = state.products.find((item) => item.id === id);
    if (!original) throw new Error('Produto não encontrado');
    return this.createProduct({
      name: `${original.name} (cópia)`,
      categoryId: original.categoryId,
      priceCents: original.priceCents,
      shortDescription: original.shortDescription,
      description: original.description,
    });
  },

  createModelRequest(input: {
    productId: string;
    widthCm?: number | null;
    heightCm?: number | null;
    depthCm?: number | null;
    notes?: string | null;
  }) {
    const product = state.products.find((item) => item.id === input.productId);
    if (!product) throw new Error('Produto não encontrado');
    const request: ModelRequest = {
      id: createId('mr'),
      restaurantId: state.restaurant.id,
      productId: product.id,
      status: 'submitted',
      widthCm: input.widthCm ?? null,
      heightCm: input.heightCm ?? null,
      depthCm: input.depthCm ?? null,
      notes: input.notes ?? null,
      internalNotes: null,
      submittedAt: new Date().toISOString(),
      dueAt: null,
      createdAt: new Date().toISOString(),
      productName: product.name,
    };
    state.modelRequests.unshift(request);
    state.notifications.unshift({
      id: createId('n'),
      title: 'Solicitação 3D enviada',
      body: `${product.name} entrou na fila de produção.`,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return { ...request };
  },

  updateModelRequestStatus(id: string, status: ModelRequestStatus, internalNotes?: string) {
    const index = state.modelRequests.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Solicitação não encontrada');
    state.modelRequests[index] = {
      ...state.modelRequests[index],
      status,
      internalNotes: internalNotes ?? state.modelRequests[index].internalNotes,
    };
    if (status === 'published') {
      const product = state.products.find((item) => item.id === state.modelRequests[index].productId);
      if (product) {
        product.has3d = true;
      }
    }
    return { ...state.modelRequests[index] };
  },

  reviewModel(id: string, decision: 'approved' | 'changes_requested', comment?: string) {
    const status: ModelRequestStatus = decision === 'approved' ? 'approved' : 'changes_requested';
    const updated = this.updateModelRequestStatus(id, status);
    state.notifications.unshift({
      id: createId('n'),
      title: decision === 'approved' ? 'Modelo aprovado' : 'Ajustes solicitados',
      body: comment || updated.productName || 'Atualização de modelo',
      read: false,
      createdAt: new Date().toISOString(),
    });
    return updated;
  },

  createQrCode(input: {
    shortCode: string;
    sourceType: QrCode['sourceType'];
    tableLabel?: string | null;
    campaignName?: string | null;
  }) {
    const existing = state.qrCodes.find((item) => item.shortCode === input.shortCode);
    if (existing) throw new Error('Código curto já existe');
    const qr: QrCode = {
      id: createId('qr'),
      shortCode: input.shortCode,
      restaurantId: state.restaurant.id,
      unitId: state.unit.id,
      tableLabel: input.tableLabel ?? null,
      campaignName: input.campaignName ?? null,
      sourceType: input.sourceType,
      destinationPath: `/r/${state.restaurant.slug}`,
      active: true,
    };
    state.qrCodes.unshift(qr);
    return { ...qr };
  },

  addMember(input: { fullName: string; email: string; role: RestaurantMember['role'] }) {
    const member = {
      id: createId('mem'),
      restaurantId: state.restaurant.id,
      userId: createId('user'),
      role: input.role,
      active: true,
      fullName: input.fullName,
      email: input.email,
    };
    state.members.push(member);
    return { ...member };
  },

  markNotificationRead(id: string) {
    const item = state.notifications.find((n) => n.id === id);
    if (item) item.read = true;
    return this.getNotifications();
  },

  updateRestaurantStatus(id: string, status: Restaurant['status']) {
    const index = state.restaurants.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Restaurante não encontrado');
    state.restaurants[index] = { ...state.restaurants[index], status };
    if (id === state.restaurant.id) {
      state.restaurant.status = status;
    }
    return { ...state.restaurants[index] };
  },

  updateSubscriptionStatus(id: string, status: Subscription['status']) {
    const index = state.subscriptions.findIndex((item) => item.id === id);
    if (index < 0) throw new Error('Assinatura não encontrada');
    state.subscriptions[index] = { ...state.subscriptions[index], status };
    if (id === state.subscription.id) {
      state.subscription.status = status;
    }
    return { ...state.subscriptions[index] };
  },
};
