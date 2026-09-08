import type {
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

export const DEMO_RESTAURANT_ID = '11111111-1111-4111-8111-111111111111';
export const DEMO_UNIT_ID = '22222222-2222-4222-8222-222222222222';

export const demoRestaurant: Restaurant = {
  id: DEMO_RESTAURANT_ID,
  name: 'Casa Fogo',
  slug: 'casa-fogo',
  description: 'Restaurante demonstrativo — experiência MenuAR com pratos visuais.',
  logoUrl: null,
  coverUrl: null,
  primaryColor: '#39d7a2',
  secondaryColor: '#118a68',
  backgroundColor: '#f4f7f6',
  textColor: '#1d292f',
  theme: 'light',
  phone: '(43) 99999-0000',
  whatsapp: '5543999990000',
  instagram: '@casafogo.demo',
  website: null,
  timezone: 'America/Sao_Paulo',
  currency: 'BRL',
  locale: 'pt-BR',
  status: 'active',
  isDemo: true,
};

export const demoUnit: Unit = {
  id: DEMO_UNIT_ID,
  restaurantId: DEMO_RESTAURANT_ID,
  name: 'Unidade Centro',
  slug: 'centro',
  address: 'Rua das Brasas, 120',
  city: 'Londrina',
  state: 'PR',
  postalCode: '86010-000',
  phone: '(43) 3333-0000',
  whatsapp: '5543999990000',
  openingHours: {
    mon: { open: '11:30', close: '23:00' },
    tue: { open: '11:30', close: '23:00' },
    wed: { open: '11:30', close: '23:00' },
    thu: { open: '11:30', close: '23:00' },
    fri: { open: '11:30', close: '00:00' },
    sat: { open: '12:00', close: '00:00' },
    sun: { open: '12:00', close: '22:00' },
  },
  active: true,
};

export const demoCategories: Category[] = [
  {
    id: 'c1',
    restaurantId: DEMO_RESTAURANT_ID,
    name: 'Hambúrgueres',
    slug: 'hamburgueres',
    description: 'Clássicos na brasa',
    sortOrder: 1,
    active: true,
  },
  {
    id: 'c2',
    restaurantId: DEMO_RESTAURANT_ID,
    name: 'Porções',
    slug: 'porcoes',
    description: 'Para compartilhar',
    sortOrder: 2,
    active: true,
  },
  {
    id: 'c3',
    restaurantId: DEMO_RESTAURANT_ID,
    name: 'Pratos',
    slug: 'pratos',
    description: 'Principais',
    sortOrder: 3,
    active: true,
  },
  {
    id: 'c4',
    restaurantId: DEMO_RESTAURANT_ID,
    name: 'Sobremesas',
    slug: 'sobremesas',
    description: 'Finais doces',
    sortOrder: 4,
    active: true,
  },
  {
    id: 'c5',
    restaurantId: DEMO_RESTAURANT_ID,
    name: 'Bebidas',
    slug: 'bebidas',
    description: 'Acompanhamentos',
    sortOrder: 5,
    active: true,
  },
];

function product(
  partial: Partial<Product> &
    Pick<
      Product,
      | 'id'
      | 'categoryId'
      | 'name'
      | 'slug'
      | 'shortDescription'
      | 'description'
      | 'priceCents'
      | 'ingredients'
      | 'allergenNotes'
      | 'isVegetarian'
      | 'isSpicy'
      | 'isFeatured'
      | 'isAvailable'
      | 'has3d'
      | 'sortOrder'
      | 'imageUrl'
    >,
): Product {
  return {
    restaurantId: DEMO_RESTAURANT_ID,
    currency: 'BRL',
    isVegan: false,
    isGlutenFree: false,
    posterUrl: null,
    glbUrl: null,
    usdzUrl: null,
    scaleVerified: false,
    servesMin: null,
    servesMax: null,
    widthCm: null,
    heightCm: null,
    depthCm: null,
    ...partial,
  };
}

export const demoProducts: Product[] = [
  product({
    id: 'p1',
    categoryId: 'c1',
    name: 'Burger Brasa',
    slug: 'burger-brasa',
    shortDescription: 'Blend 180g, queijo maturado e cebola caramelizada.',
    description:
      'Hambúrguer artesanal grelhado na brasa, pão brioche tostado, queijo maturado, cebola caramelizada e maionese da casa.',
    priceCents: 4290,
    servesMin: 1,
    servesMax: 1,
    widthCm: 14,
    heightCm: 8,
    depthCm: 14,
    ingredients: ['Blend bovino 180g', 'Pão brioche', 'Queijo maturado', 'Cebola caramelizada'],
    allergenNotes: 'Contém glúten e lactose.',
    isVegetarian: false,
    isSpicy: false,
    isFeatured: true,
    isAvailable: true,
    has3d: Boolean(appConfig.demoGlbUrl),
    sortOrder: 1,
    imageUrl: null,
    glbUrl: appConfig.demoGlbUrl || null,
    usdzUrl: appConfig.demoUsdzUrl || null,
    posterUrl: appConfig.demoPosterUrl || null,
    scaleVerified: false,
  }),
  product({
    id: 'p2',
    categoryId: 'c2',
    name: 'Porção da Casa',
    slug: 'porcao-da-casa',
    shortDescription: 'Batatas crocantes, anéis e molhos.',
    description: 'Porção generosa para compartilhar com batatas crocantes, anéis de cebola e três molhos.',
    priceCents: 5490,
    servesMin: 2,
    servesMax: 3,
    widthCm: 28,
    heightCm: 8,
    depthCm: 20,
    ingredients: ['Batata', 'Cebola', 'Molhos da casa'],
    allergenNotes: 'Pode conter glúten.',
    isVegetarian: true,
    isSpicy: false,
    isFeatured: true,
    isAvailable: true,
    has3d: false,
    sortOrder: 1,
    imageUrl: null,
  }),
  product({
    id: 'p3',
    categoryId: 'c3',
    name: 'Fettuccine Cremoso',
    slug: 'fettuccine-cremoso',
    shortDescription: 'Massa fresca ao molho de queijos.',
    description: 'Fettuccine artesanal com molho cremoso de queijos e toque de ervas frescas.',
    priceCents: 4890,
    servesMin: 1,
    servesMax: 1,
    widthCm: 24,
    heightCm: 5,
    depthCm: 24,
    ingredients: ['Massa fresca', 'Queijos', 'Ervas'],
    allergenNotes: 'Contém glúten e lactose.',
    isVegetarian: true,
    isSpicy: false,
    isFeatured: false,
    isAvailable: true,
    has3d: false,
    sortOrder: 1,
    imageUrl: null,
  }),
  product({
    id: 'p4',
    categoryId: 'c3',
    name: 'Combinado Especial',
    slug: 'combinado-especial',
    shortDescription: 'Seleção de peixes e acompanhamentos.',
    description: 'Combinado com cortes selecionados, arroz, gengibre e wasabi.',
    priceCents: 8990,
    servesMin: 1,
    servesMax: 2,
    widthCm: 30,
    heightCm: 6,
    depthCm: 20,
    ingredients: ['Salmão', 'Atum', 'Arroz', 'Nori'],
    allergenNotes: 'Contém peixe e soja.',
    isVegetarian: false,
    isSpicy: true,
    isFeatured: true,
    isAvailable: true,
    has3d: false,
    sortOrder: 2,
    imageUrl: null,
  }),
  product({
    id: 'p5',
    categoryId: 'c4',
    name: 'Sobremesa Vulcão',
    slug: 'sobremesa-vulcao',
    shortDescription: 'Chocolate quente com centro cremoso.',
    description: 'Petit gateau de chocolate com centro derretido e sorvete de creme.',
    priceCents: 2890,
    servesMin: 1,
    servesMax: 1,
    widthCm: 10,
    heightCm: 8,
    depthCm: 10,
    ingredients: ['Chocolate belga', 'Manteiga', 'Sorvete'],
    allergenNotes: 'Contém lactose e ovo.',
    isVegetarian: true,
    isSpicy: false,
    isFeatured: false,
    isAvailable: true,
    has3d: false,
    sortOrder: 1,
    imageUrl: null,
  }),
  product({
    id: 'p6',
    categoryId: 'c5',
    name: 'Limonada da Casa',
    slug: 'limonada-da-casa',
    shortDescription: 'Fresca, com hortelã.',
    description: 'Limonada artesanal com hortelã e gelo.',
    priceCents: 1290,
    servesMin: 1,
    servesMax: 1,
    widthCm: 8,
    heightCm: 14,
    depthCm: 8,
    ingredients: ['Limão', 'Hortelã', 'Açúcar'],
    allergenNotes: null,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true,
    isSpicy: false,
    isFeatured: false,
    isAvailable: true,
    has3d: false,
    sortOrder: 1,
    imageUrl: null,
  }),
];

export const demoQrCodes: QrCode[] = [
  {
    id: 'q1',
    shortCode: 'mesa12',
    restaurantId: DEMO_RESTAURANT_ID,
    unitId: DEMO_UNIT_ID,
    tableLabel: 'Mesa 12',
    campaignName: null,
    sourceType: 'table',
    destinationPath: '/r/casa-fogo',
    active: true,
  },
  {
    id: 'q2',
    shortCode: 'bio-ig',
    restaurantId: DEMO_RESTAURANT_ID,
    unitId: DEMO_UNIT_ID,
    tableLabel: null,
    campaignName: 'Instagram bio',
    sourceType: 'instagram',
    destinationPath: '/r/casa-fogo',
    active: true,
  },
];

export const demoSubscription: Subscription = {
  id: 's1',
  restaurantId: DEMO_RESTAURANT_ID,
  planId: 'plan-founder',
  status: 'trialing',
  monthlyPriceCents: 9900,
  startedAt: new Date().toISOString(),
  trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString(),
  currentPeriodEnd: null,
  graceEndsAt: null,
  notes: 'Piloto demonstrativo',
};

export const demoModelRequests: ModelRequest[] = [
  {
    id: 'mr1',
    restaurantId: DEMO_RESTAURANT_ID,
    productId: 'p1',
    status: 'customer_review',
    widthCm: 14,
    heightCm: 8,
    depthCm: 14,
    notes: 'Priorizar textura do pão',
    internalNotes: null,
    submittedAt: new Date().toISOString(),
    dueAt: null,
    createdAt: new Date().toISOString(),
    productName: 'Burger Brasa',
  },
];

export const demoAnalytics: AnalyticsSummary = {
  menuViews: 428,
  productViews: 912,
  modelOpens: 146,
  arActivations: 38,
  arUnavailable: 21,
  shares: 54,
  interests: 67,
  topProducts: [
    { productId: 'p1', name: 'Burger Brasa', views: 210 },
    { productId: 'p4', name: 'Combinado Especial', views: 168 },
    { productId: 'p2', name: 'Porção da Casa', views: 141 },
  ],
  daily: Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toISOString().slice(0, 10),
      views: 40 + index * 8,
      modelOpens: 10 + index * 2,
      arActivations: 3 + (index % 3),
    };
  }),
};

export const secondRestaurant: Restaurant = {
  ...demoRestaurant,
  id: '33333333-3333-4333-8333-333333333333',
  name: 'Outro Restaurante',
  slug: 'outro-restaurante',
  isDemo: false,
};
