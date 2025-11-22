import React from 'react';
import { ProductList } from '../components/products/ProductList';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const ProductsPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <ProductList />
        </div>
      </main>
      <Footer />
    </>
  );
};