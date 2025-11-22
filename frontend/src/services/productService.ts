import { api } from '../config/api';
import { Product, ProductFormData } from '../interfaces/product.interface';

export const productService = {
  // Obtener todos los productos
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/product/'); // ✅ Cambiado
    return response.data;
  },

  // Obtener producto por ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`); // ✅ Cambiado (también había error de sintaxis con backticks)
    return response.data;
  },

  // Crear producto (solo vendedor)
  create: async (data: ProductFormData): Promise<Product> => {
    const response = await api.post<Product>('/product/', data); // ✅ Cambiado
    return response.data;
  },

  // Actualizar producto
  update: async (id: string, data: Partial<ProductFormData>): Promise<Product> => {
    const response = await api.put<Product>(`/product/${id}`, data); // ✅ Cambiado (también había error de sintaxis)
    return response.data;
  },

  // Eliminar producto
  delete: async (id: string): Promise<void> => {
    await api.delete(`/product/${id}`); // ✅ Cambiado (también había error de sintaxis)
  },

  // Filtrar productos por vendedor
  getByVendor: async (vendedorUid: string): Promise<Product[]> => {
    const products = await productService.getAll();
    return products.filter(p => p.vendedor_uid === vendedorUid);
  }
};