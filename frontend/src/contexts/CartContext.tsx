import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { Cart, CartItem } from '../interfaces/cart.interface';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'producto_id'> & { producto_id: string }) => Promise<void>;
  removeFromCart: (producto_id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { mongoUser } = useAuth();

  const refreshCart = async () => {
    if (!mongoUser) return;
    
    setLoading(true);
    try {
      const cartData = await cartService.getCart(mongoUser.uid);
      setCart(cartData);
    } catch (error) {
      console.error('Error obteniendo carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [mongoUser]);

  const addToCart = async (item: Omit<CartItem, 'producto_id'> & { producto_id: string }) => {
    if (!mongoUser) {
      toast.error('Debes iniciar sesión para agregar al carrito');
      return;
    }

    try {
      await cartService.addToCart({
        comprador_uid: mongoUser.uid,
        producto_id: item.producto_id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      });
      
      await refreshCart();
      toast.success('Producto agregado al carrito');
    } catch (error: any) {
      toast.error(error.message || 'Error al agregar al carrito');
    }
  };

  const removeFromCart = async (producto_id: string) => {
    // Implementar lógica para remover item específico
    toast.info('Función en desarrollo');
  };

  const clearCart = async () => {
    if (!mongoUser) return;

    try {
      await cartService.clearCart(mongoUser.uid);
      setCart(null);
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar carrito');
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};