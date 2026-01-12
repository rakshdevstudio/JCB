import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Book from "./pages/Book";
import Offers from "./pages/Offers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Bookings from "./pages/admin/Bookings";
import Staff from "./pages/admin/Staff";
import Services from "./pages/admin/Services";
import Salons from "./pages/admin/Salons";
import Settings from "./pages/admin/Settings";
import AdminOffers from "./pages/admin/Offers";

const queryClient = new QueryClient();

const adminRoles = ["super_admin", "city_manager", "salon_manager", "staff"] as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/book" element={<Book />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[...adminRoles]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="staff" element={<Staff />} />
              <Route path="services" element={<Services />} />
              <Route
                path="salons"
                element={
                  <ProtectedRoute allowedRoles={["super_admin", "city_manager"]}>
                    <Salons />
                  </ProtectedRoute>
                }
              />
              <Route path="settings" element={<Settings />} />
              <Route
                path="offers"
                element={
                  <ProtectedRoute allowedRoles={["super_admin"]}>
                    <AdminOffers />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
