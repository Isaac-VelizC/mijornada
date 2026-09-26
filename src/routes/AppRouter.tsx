import { lazy } from "react";
import { Route, Routes } from "react-router";

import { ROUTES } from "./routePath";
import AppLayout from "../components/layout/AppLayout";

const NotFound = lazy(() => import("../pages/NotFound"));

const Dashboard = lazy(() => import("../pages/Dashboard"));
const WorkDaysPage = lazy(() => import("../pages/WorkDaysPage"));
const PaymentsPage = lazy(() => import("../pages/PaymentsPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.dashboard} element={<Dashboard />} />

        <Route path={ROUTES.workDays} element={<WorkDaysPage />} />

        <Route path={ROUTES.payments} element={<PaymentsPage />} />

        <Route path={ROUTES.settings} element={<SettingsPage />} />
      </Route>

      <Route path={ROUTES.notFound} element={<NotFound />} />
    </Routes>
  );
}
