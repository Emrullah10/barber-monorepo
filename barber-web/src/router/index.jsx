import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { RoleGuard } from '@/components/RoleGuard';
import { MainLayout } from '@/layouts';
import { AuthLayout } from '@/layouts';
import { BARBER_TYPES, MANAGER_TYPES, ADMIN_TYPES, DefaultRedirect } from './guards';

import { LoginPage } from '@/pages/Auth/LoginPage/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage/RegisterPage';
import CreateShopPage from '@/pages/CreateShopPage/CreateShopPage';
import LandingPage from '@/pages/LandingPage/LandingPage';
import DiscoverPage from '@/pages/DiscoverPage/DiscoverPage';
import ServicesPage from '@/pages/ServicesPage/ServicesPage';
import BarbersPage from '@/pages/BarbersPage/BarbersPage';
import BookingPage from '@/pages/BookingPage/BookingPage';
import MyAppointmentsPage from '@/pages/MyAppointmentsPage/MyAppointmentsPage';

import BarberDashboardPage from '@/pages/barber/BarberDashboardPage/BarberDashboardPage';
import BarberAppointmentsPage from '@/pages/barber/BarberAppointmentsPage/BarberAppointmentsPage';
import BarberProfilePage from '@/pages/barber/BarberProfilePage/BarberProfilePage';
import BarberAvailabilityPage from '@/pages/barber/BarberAvailabilityPage/BarberAvailabilityPage';
import BarberReportsPage from '@/pages/barber/BarberReportsPage/BarberReportsPage';
import BarberServicesPage from '@/pages/barber/BarberServicesPage/BarberServicesPage';

import AdminUsersPage from '@/pages/admin/AdminUsersPage/AdminUsersPage';
import AdminShopsPage from '@/pages/admin/AdminShopsPage/AdminShopsPage';
import ShopsPage from '@/pages/ShopsPage/ShopsPage';
import ShopDetailPage from '@/pages/ShopDetailPage/ShopDetailPage';
import ShopSettingsPage from '@/pages/barber/ShopSettingsPage/ShopSettingsPage';
import ShopBarbersPage from '@/pages/barber/ShopBarbersPage/ShopBarbersPage';

function AuthRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return isLoggedIn ? <DefaultRedirect /> : children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth layout (no navbar/footer) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
        </Route>

        {/* Main layout (navbar + footer) */}
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/barbers" element={<BarbersPage />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/shops/:slug" element={<ShopDetailPage />} />

          {/* Protected - any logged in user */}
          <Route element={<RoleGuard />}>
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/shops/:slug/booking" element={<BookingPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            <Route path="/create-shop" element={<CreateShopPage />} />
          </Route>

          {/* Barber routes */}
          <Route element={<RoleGuard allowedTypes={BARBER_TYPES} />}>
            <Route path="/barber/dashboard" element={<BarberDashboardPage />} />
            <Route path="/barber/appointments" element={<BarberAppointmentsPage />} />
            <Route path="/barber/profile" element={<BarberProfilePage />} />
            <Route path="/barber/availability" element={<BarberAvailabilityPage />} />
            <Route path="/barber/reports" element={<BarberReportsPage />} />
          </Route>

          {/* Manager routes */}
          <Route element={<RoleGuard allowedTypes={MANAGER_TYPES} />}>
            <Route path="/barber/services" element={<BarberServicesPage />} />
            <Route path="/barber/shop-settings" element={<ShopSettingsPage />} />
            <Route path="/barber/shop-barbers" element={<ShopBarbersPage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<RoleGuard allowedTypes={ADMIN_TYPES} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/shops" element={<AdminShopsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
