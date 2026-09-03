import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/pages/public/landing-page';
import { MenuPage } from '@/pages/public/menu-page';
import { ProductPage } from '@/pages/public/product-page';
import { QrRedirectPage } from '@/pages/public/qr-redirect-page';
import { ForgotPasswordPage, LoginPage, ResetPasswordPage } from '@/pages/auth/auth-pages';
import { AdminShell, AppShell } from '@/layouts/shells';
import { Skeleton } from '@/components/ui/skeleton';

const AppDashboardPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppDashboardPage })),
);
const AppMenuPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppMenuPage })),
);
const AppProductsPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppProductsPage })),
);
const AppModelsPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppModelsPage })),
);
const AppQrCodesPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppQrCodesPage })),
);
const AppAnalyticsPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppAnalyticsPage })),
);
const AppSettingsPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppSettingsPage })),
);
const AppTeamPage = lazy(() =>
  import('@/pages/app/app-pages').then((m) => ({ default: m.AppTeamPage })),
);

const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((m) => ({ default: m.AdminDashboardPage })),
);
const AdminRestaurantsPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((m) => ({ default: m.AdminRestaurantsPage })),
);
const AdminRestaurantDetailPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((m) => ({ default: m.AdminRestaurantDetailPage })),
);
const AdminModelRequestsPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((m) => ({ default: m.AdminModelRequestsPage })),
);
const AdminPlaceholderPage = lazy(() =>
  import('@/pages/admin/admin-pages').then((m) => ({ default: m.AdminPlaceholderPage })),
);

function LazyFrame({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Skeleton className="h-64 w-full" />}>{children}</Suspense>;
}

function RequireSession({
  children,
  admin = false,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  const raw = sessionStorage.getItem('menuar_session');
  if (!raw) return <Navigate to="/login" replace />;
  if (admin) {
    try {
      const session = JSON.parse(raw) as { role?: string };
      if (session.role !== 'super_admin') return <Navigate to="/app" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<Navigate to="/r/casa-fogo" replace />} />
      <Route path="/r/:restaurantSlug" element={<MenuPage />} />
      <Route path="/r/:restaurantSlug/p/:productSlug" element={<ProductPage />} />
      <Route path="/q/:qrCode" element={<QrRedirectPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        path="/app"
        element={
          <RequireSession>
            <AppShell />
          </RequireSession>
        }
      >
        <Route
          index
          element={
            <LazyFrame>
              <AppDashboardPage />
            </LazyFrame>
          }
        />
        <Route
          path="menu"
          element={
            <LazyFrame>
              <AppMenuPage />
            </LazyFrame>
          }
        />
        <Route
          path="products"
          element={
            <LazyFrame>
              <AppProductsPage />
            </LazyFrame>
          }
        />
        <Route
          path="models"
          element={
            <LazyFrame>
              <AppModelsPage />
            </LazyFrame>
          }
        />
        <Route
          path="qr-codes"
          element={
            <LazyFrame>
              <AppQrCodesPage />
            </LazyFrame>
          }
        />
        <Route
          path="analytics"
          element={
            <LazyFrame>
              <AppAnalyticsPage />
            </LazyFrame>
          }
        />
        <Route
          path="settings"
          element={
            <LazyFrame>
              <AppSettingsPage />
            </LazyFrame>
          }
        />
        <Route
          path="team"
          element={
            <LazyFrame>
              <AppTeamPage />
            </LazyFrame>
          }
        />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireSession admin>
            <AdminShell />
          </RequireSession>
        }
      >
        <Route
          index
          element={
            <LazyFrame>
              <AdminDashboardPage />
            </LazyFrame>
          }
        />
        <Route
          path="restaurants"
          element={
            <LazyFrame>
              <AdminRestaurantsPage />
            </LazyFrame>
          }
        />
        <Route
          path="restaurants/:id"
          element={
            <LazyFrame>
              <AdminRestaurantDetailPage />
            </LazyFrame>
          }
        />
        <Route
          path="model-requests"
          element={
            <LazyFrame>
              <AdminModelRequestsPage />
            </LazyFrame>
          }
        />
        <Route
          path="models"
          element={
            <LazyFrame>
              <AdminPlaceholderPage title="Modelos publicados" />
            </LazyFrame>
          }
        />
        <Route
          path="subscriptions"
          element={
            <LazyFrame>
              <AdminPlaceholderPage title="Assinaturas" />
            </LazyFrame>
          }
        />
        <Route
          path="analytics"
          element={
            <LazyFrame>
              <AdminPlaceholderPage title="Analytics global" />
            </LazyFrame>
          }
        />
        <Route
          path="audit-logs"
          element={
            <LazyFrame>
              <AdminPlaceholderPage title="Logs de auditoria" />
            </LazyFrame>
          }
        />
        <Route
          path="settings"
          element={
            <LazyFrame>
              <AdminPlaceholderPage title="Configurações internas" />
            </LazyFrame>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
