import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const ComposePage = lazy(() =>
  import("./pages/Compose").then((m) => ({ default: m.ComposePage })),
);
const HistoryPage = lazy(() =>
  import("./pages/History").then((m) => ({ default: m.HistoryPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.SettingsPage })),
);
const AnalyticsPage = lazy(() =>
  import("./pages/Analytics").then((m) => ({ default: m.AnalyticsPage })),
);

function PageLoader() {
  return (
    <div className="flex-1 p-8 space-y-4 max-w-7xl mx-auto w-full">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/compose" });
  },
  component: () => null,
});

const composeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compose",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <ComposePage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <HistoryPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <SettingsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <AnalyticsPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  composeRoute,
  historyRoute,
  settingsRoute,
  analyticsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
