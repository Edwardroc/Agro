import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {api} from '../config/api';

interface CartItem {
  producto_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

interface Cart {
  _id?: string;
  comprador_uid: string;
  items: CartItem[];
  total: number;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (user?.uid) {
      loadCart();
    } else {
      setCart(null);
      setItemCount(0);
    }
  }, [user]);

  useEffect(() => {
    if (cart) {
      const count = cart.items.reduce((sum, item) => sum + item.cantidad, 0);
      setItemCount(count);
    } else {
      setItemCount(0);
    }
  }, [cart]);

  const loadCart = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      const response = await api.get(`/cart/getcart/${user.uid}`);
      
      if (response.data.message === 'Carrito vacío') {
        setCart({
          comprador_uid: user.uid,
          items: [],
          total: 0
        });
      } else {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error cargando carrito:', error);
      setCart({
        comprador_uid: user.uid,
        items: [],
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    producto_id: string,
    nombre: string,
    precio_unitario: number,
    cantidad: number = 1
  ) => {
    if (!user?.uid) {
      throw new Error('Debes iniciar sesión para agregar al carrito');
    }

    try {
      setLoading(true);
      const response = await api.post('/cart/addTocart', {
        comprador_uid: user.uid,
        producto_id,
        nombre,
        precio_unitario,
        cantidad
      });

      setCart(response.data);
      return response.data;
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (producto_id: string, cantidad: number) => {
    if (!user?.uid || !cart) return;

    try {
      setLoading(true);
      
      // Encontrar el item en el carrito
      const item = cart.items.find(i => i.producto_id === producto_id);
      if (!item) throw new Error('Producto no encontrado en el carrito');

      // Calcular la diferencia
      const diferencia = cantidad - item.cantidad;

      if (diferencia !== 0) {
        await api.post('/cart/addTocart', {
          comprador_uid: user.uid,
          producto_id,
          nombre: item.nombre,
          precio_unitario: item.precio_unitario,
          cantidad: diferencia
        });

        await loadCart();
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (producto_id: string) => {
    if (!user?.uid || !cart) return;

    try {
      setLoading(true);
      
      // Actualizar el carrito localmente
      const updatedItems = cart.items.filter(item => item.producto_id !== producto_id);
      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + (item.cantidad * item.precio_unitario),
        0
      );

      // Aquí deberías tener un endpoint específico para eliminar items
      // Por ahora, vamos a usar clearCart y luego agregar los items restantes
      await api.delete(`/cart/clearCart/${user.uid}`);

      if (updatedItems.length > 0) {
        for (const item of updatedItems) {
          await api.post('/cart/addTocart', {
            comprador_uid: user.uid,
            producto_id: item.producto_id,
            nombre: item.nombre,
            precio_unitario: item.precio_unitario,
            cantidad: item.cantidad
          });
        }
      }

      await loadCart();
    } catch (error) {
      console.error('Error eliminando del carrito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      await api.delete(`/cart/clearCart/${user.uid}`);
      setCart({
        comprador_uid: user.uid,
        items: [],
        total: 0
      });
    } catch (error) {
      console.error('Error limpiando carrito:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = (): number => {
    return cart?.total || 0;
  };

  const getItemQuantity = (producto_id: string): number => {
    const item = cart?.items.find(i => i.producto_id === producto_id);
    return item?.cantidad || 0;
  };

  const isInCart = (producto_id: string): boolean => {
    return cart?.items.some(i => i.producto_id === producto_id) || false;
  };

  return {
    cart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartTotal,
    getItemQuantity,
    isInCart
  };
};