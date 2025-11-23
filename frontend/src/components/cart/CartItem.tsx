import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../../interfaces/cart.interface';
import '../../styles/cart.css';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity?: (productoId: string, newQuantity: number) => void;
  onRemove?: (productoId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}) => {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <h4>{item.nombre}</h4>
        <p className="cart-item-price">
          ${item.precio_unitario.toLocaleString('es-CO')} x {item.cantidad}
        </p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button 
            onClick={() => onUpdateQuantity?.(item.producto_id, item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            <Minus size={16} />
          </button>
          <span>{item.cantidad}</span>
          <button 
            onClick={() => onUpdateQuantity?.(item.producto_id, item.cantidad + 1)}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="cart-item-total">
          ${(item.precio_unitario * item.cantidad).toLocaleString('es-CO')}
        </div>

        <button 
          className="btn-remove"
          onClick={() => onRemove?.(item.producto_id)}
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};