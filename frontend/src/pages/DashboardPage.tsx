import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductList } from '../components/products/ProductList';
import { Package, ShoppingBag, Users } from 'lucide-react';
import '../styles/dashboard.css';
import { Outlet } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { mongoUser } = useAuth();

  if (!mongoUser) return null;

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="dashboard">
            <div className="dashboard-header">
              <h1>Bienvenido, {mongoUser.primer_nombre}</h1>
              <p className="user-role-badge">{mongoUser.rol}</p>
            </div>

            {mongoUser.estado === 'pendiente' && (
              <div className="alert alert-warning">
                <strong>Cuenta Pendiente:</strong> Tu cuenta está siendo revisada por un administrador.
              </div>
            )}

            {mongoUser.estado === 'activo' && (
              <>
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <Package size={32} />
                    </div>
                    <div className="stat-info">
                      <h3>Productos</h3>
                      <p className="stat-value">--</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <ShoppingBag size={32} />
                    </div>
                    <div className="stat-info">
                      <h3>Pedidos</h3>
                      <p className="stat-value">--</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">
                      <Users size={32} />
                    </div>
                    <div className="stat-info">
                      <h3>Clientes</h3>
                      <p className="stat-value">--</p>
                    </div>
                  </div>
                </div>

                <section className="dashboard-section">
                  <h2>Productos Destacados</h2>
                  <ProductList />
                </section>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};