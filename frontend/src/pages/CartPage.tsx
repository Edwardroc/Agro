import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CartItem } from '../components/cart/CartItem';
import '../styles/cart.css';

export const CartPage: React.FC = () => {
  const { cart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="cart-page">
            <div className="cart-header">
              <h1>
                <ShoppingCart size={32} />
                Mi Carrito
              </h1>
              {cart && cart.items.length > 0 && (
                <button 
                  className="btn-clear-cart"
                  onClick={clearCart}
                >
                  <Trash2 size={18} />
                  Vaciar Carrito
                </button>
              )}
            </div>

            {!cart || cart.items.length === 0 ? (
              <div className="empty-cart-page">
                <ShoppingCart size={80} />
                <h2>Tu carrito está vacío</h2>
                <p>Agrega productos para comenzar tu compra</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/products')}
                >
                  Ver Productos
                </button>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-items-section">
                  {cart.items.map((item) => (
                    <CartItem key={item.producto_id} item={item} />
                  ))}
                </div>

                <div className="cart-summary">
                  <h3>Resumen del Pedido</h3>
                  
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${cart.total.toLocaleString('es-CO')}</span>
                  </div>

                  <div className="summary-row">
                    <span>Envío:</span>
                    <span>Por calcular</span>
                  </div>

                  <hr />

                  <div className="summary-row total">
                    <strong>Total:</strong>
                    <strong>${cart.total.toLocaleString('es-CO')}</strong>
                  </div>

                  <button 
                    className="btn-checkout"
                    onClick={handleCheckout}
                  >
                    Proceder al Pago
                  </button>

                  <button 
                    className="btn-continue-shopping"
                    onClick={() => navigate('/products')}
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};