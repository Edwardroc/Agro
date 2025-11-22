import React from 'react';
import { ProductDetail } from '../components/products/ProductDetail';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const ProductDetailPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <ProductDetail />
        </div>
      </main>
      <Footer />
    </>
  );
};