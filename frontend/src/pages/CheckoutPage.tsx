import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { toast } from 'react-toastify';
import '../styles/cart.css';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { mongoUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Redirigir si no hay carrito
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      setRedirecting(true);
      const timer = setTimeout(() => navigate('/cart'), 100);
      return () => clearTimeout(timer);
    }
  }, [cart, navigate]);

  const [formData, setFormData] = useState({
    metodo_pago: 'transferencia',
    direccion_envio: {
      departamento: mongoUser?.direccion?.departamento || '',
      ciudad: mongoUser?.direccion?.ciudad || '',
      detalle: mongoUser?.direccion?.detalle || ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        direccion_envio: {
          ...formData.direccion_envio,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart || !mongoUser) return;

    // Validar dirección
    if (!formData.direccion_envio.departamento || !formData.direccion_envio.ciudad || !formData.direccion_envio.detalle) {
      toast.error('Por favor completa la dirección de envío');
      return;
    }

    setLoading(true);

    try {
      await orderService.create({
        comprador_uid: mongoUser.uid,
        items: cart.items,
        total: cart.total,
        metodo_pago: formData.metodo_pago,
        direccion_envio: formData.direccion_envio,
        estado: 'pendiente'
      });

      await clearCart();
      toast.success('¡Pedido realizado exitosamente!');
      navigate('/my-orders');
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar el pedido');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si está redirigiendo, mostrar pantalla de carga
  if (redirecting) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="loader-container">
            <div className="loader"></div>
            <p>Redirigiendo...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="checkout-page">
            <h1>Finalizar Compra</h1>

            <div className="checkout-content">
              <form onSubmit={handleSubmit} className="checkout-form">
                <section className="checkout-section">
                  <h2>Información de Envío</h2>
                  
                  <div className="form-group">
                    <label htmlFor="departamento">Departamento *</label>
                    <input
                      type="text"
                      id="departamento"
                      name="direccion.departamento"
                      value={formData.direccion_envio.departamento}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ciudad">Ciudad *</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="direccion.ciudad"
                      value={formData.direccion_envio.ciudad}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="detalle">Dirección Detallada *</label>
                    <input
                      type="text"
                      id="detalle"
                      name="direccion.detalle"
                      value={formData.direccion_envio.detalle}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                </section>

                <section className="checkout-section">
                  <h2>Método de Pago</h2>
                  
                  <div className="form-group">
                    <label htmlFor="metodo_pago">Selecciona el método *</label>
                    <select
                      id="metodo_pago"
                      name="metodo_pago"
                      value={formData.metodo_pago}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="transferencia">Transferencia Bancaria</option>
                      <option value="efectivo">Efectivo contra entrega</option>
                      <option value="tarjeta">Tarjeta de Crédito</option>
                    </select>
                  </div>
                </section>

                <div className="checkout-actions">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate('/cart')}
                    disabled={loading}
                  >
                    Volver al Carrito
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                </div>
              </form>

              <div className="checkout-summary">
                <h3>Resumen del Pedido</h3>
                
                <div className="order-items">
                  {cart.items.map((item) => (
                    <div key={item.producto_id} className="order-item">
                      <span>{item.nombre} x{item.cantidad}</span>
                      <span>${(item.cantidad * item.precio_unitario).toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="order-total">
                  <strong>Total a Pagar:</strong>
                  <strong>${cart.total.toLocaleString('es-CO')}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};