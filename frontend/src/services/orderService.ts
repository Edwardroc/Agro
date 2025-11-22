import { api } from '../config/api';
import { Order } from '../interfaces/order.interface';

export const orderService = {
  // Crear pedido
  create: async (data: Partial<Order>): Promise<Order> => {
    const response = await api.post<Order>('/order/', data);
    return response.data;
  },

  // Obtener todos los pedidos
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/order/');
    return response.data;
  },

  // Obtener pedido por ID
  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/order/${id}`);
    return response.data;
  },

  // Actualizar estado del pedido
  updateStatus: async (id: string, estado: string): Promise<Order> => {
    const response = await api.put<Order>(`/order/${id}/status`, { estado });
    return response.data;
  }
};