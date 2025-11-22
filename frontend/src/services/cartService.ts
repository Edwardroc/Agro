import { api } from '../config/api';
import { Cart } from '../interfaces/cart.interface';

export const cartService = {
  // Obtener carrito del usuario
  getCart: async (uid: string): Promise<Cart | null> => {
    try {
      const response = await api.get<Cart>(`/cart/${uid}`);
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Agregar producto al carrito
  addToCart: async (data: {
    comprador_uid: string;
    producto_id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }): Promise<Cart> => {
    const response = await api.post<Cart>('/cart', data);
    return response.data;
  },

  // Vaciar carrito
  clearCart: async (uid: string): Promise<void> => {
    await api.delete(`/cart/${uid}`);
  }
};