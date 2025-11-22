import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductList } from '../components/products/ProductList';
import { ProductForm } from '../components/products/ProductForm';
import { Product } from '../interfaces/product.interface';

export const MyProductsPage: React.FC = () => {
  const { mongoUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedProduct(undefined);
    window.location.reload(); // Recargar lista
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="my-products-page">
            <div className="page-header">
              <h1>Mis Productos</h1>
              <button 
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={20} />
                Nuevo Producto
              </button>
            </div>

            <ProductList 
              vendedorUid={mongoUser?.uid}
              onEdit={handleEdit}
            />

            {showForm && (
              <ProductForm
                product={selectedProduct}
                onSuccess={handleSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedProduct(undefined);
                }}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};