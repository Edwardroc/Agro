import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { OrderList } from '../components/orders/OrderList';

export const MyOrdersPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <OrderList />
        </div>
      </main>
      <Footer />
    </>
  );
};