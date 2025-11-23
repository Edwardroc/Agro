import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from 'contexts/AuthContext';
import {ProtectedRoute} from "./components/auth/ProtectedRoute";

// Pages
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {ProductsPage} from "./pages/ProductsPage";
import {ProductDetailPage} from "./pages/ProductDetailPage";
import {CartPage} from "./pages/CartPage";
import {CheckoutPage} from "./pages/CheckoutPage";
import {DashboardPage }from "./pages/DashboardPage";
import {NotFoundPage} from "./pages/NotFoundPage";

// Dashboard Components
import {AdminDashboard} from "./components/dashboard/AdminDashboard";
import {VendedorDashboard} from "./components/dashboard/VendedorDashboard";
import {CompradorDashboard} from "./components/dashboard/CompradorDashboard";

const AppRoutes = () => {
  const { mongoUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={mongoUser ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={mongoUser ? <Navigate to="/dashboard" /> : <RegisterPage />} 
      />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
        {/* Dashboard según rol */}
        <Route path="/dashboard" element={<DashboardPage />}>
          <Route 
            index 
            element={
              mongoUser?.rol === "admin" ? <AdminDashboard /> :
              mongoUser?.rol === "vendedor" ? <VendedorDashboard /> :
              <CompradorDashboard />
            } 
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;