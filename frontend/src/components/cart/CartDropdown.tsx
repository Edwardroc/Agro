import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import '../../styles/cart.css';

interface CartDropdownProps {
  onClose: () => void;
}

export const CartDropdown: React.FC<CartDropdownProps> = ({ onClose }) => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  return (
    <div className="cart-dropdown" ref={dropdownRef}>
      <div className="cart-dropdown-header">
        <h3>Carrito de Compras</h3>
      </div>

      <div className="cart-dropdown-items">
        {!cart || cart.items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={48} />
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.producto_id} className="cart-dropdown-item">
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>{item.cantidad} x ${item.precio_unitario.toLocaleString('es-CO')}</p>
                </div>
                <div className="item-total">
                  ${(item.cantidad * item.precio_unitario).toLocaleString('es-CO')}
                </div>
              </div>
            ))}

            <div className="cart-dropdown-footer">
              <div className="cart-total">
                <span>Total:</span>
                <strong>${cart.total.toLocaleString('es-CO')}</strong>
              </div>
              <button 
                className="btn-primary"
                onClick={handleViewCart}
              >
                Ver Carrito Completo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};