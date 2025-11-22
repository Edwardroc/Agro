import { useState, useEffect } from 'react';
import {api} from '../config/api';

interface Product {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: string;
  vendedor_uid: string;
  imagenes?: string[];
  etiquetas?: string[];
  activo: boolean;
  fecha_publicacion: string;
}

interface UseProductsOptions {
  vendedor_uid?: string;
  categoria_id?: string;
  activo?: boolean;
  autoLoad?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { vendedor_uid, categoria_id, activo = true, autoLoad = true } = options;

  useEffect(() => {
    if (autoLoad) {
      loadProducts();
    }
  }, [vendedor_uid, categoria_id, activo, autoLoad]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/product/getProducts');
      
      let filteredProducts = response.data;

      // Filtrar por vendedor si se especifica
      if (vendedor_uid) {
        filteredProducts = filteredProducts.filter(
          (p: Product) => p.vendedor_uid === vendedor_uid
        );
      }

      // Filtrar por categoría si se especifica
      if (categoria_id) {
        filteredProducts = filteredProducts.filter(
          (p: Product) => p.categoria_id === categoria_id
        );
      }

      // Filtrar por estado activo
      if (activo !== undefined) {
        filteredProducts = filteredProducts.filter(
          (p: Product) => p.activo === activo
        );
      }

      setProducts(filteredProducts);
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get(`/product/getProductById/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error obteniendo producto:', err);
      return null;
    }
  };

  const createProduct = async (productData: Omit<Product, '_id' | 'fecha_publicacion'>): Promise<Product> => {
    try {
      setLoading(true);
      const response = await api.post('/product/createProduct', productData);
      await loadProducts();
      return response.data;
    } catch (err: any) {
      console.error('Error creando producto:', err);
      throw new Error(err.response?.data?.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      setLoading(true);
      const response = await api.put(`/product/updateProduct/${id}`, productData);
      await loadProducts();
      return response.data;
    } catch (err: any) {
      console.error('Error actualizando producto:', err);
      throw new Error(err.response?.data?.message || 'Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await api.delete(`/product/deleteProduct/${id}`);
      await loadProducts();
    } catch (err: any) {
      console.error('Error eliminando producto:', err);
      throw new Error(err.response?.data?.message || 'Error al eliminar producto');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = (searchTerm: string): Product[] => {
    if (!searchTerm.trim()) return products;

    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.nombre.toLowerCase().includes(term) ||
      product.descripcion?.toLowerCase().includes(term) ||
      product.etiquetas?.some(tag => tag.toLowerCase().includes(term))
    );
  };

  const filterByPriceRange = (minPrice: number, maxPrice: number): Product[] => {
    return products.filter(product => 
      product.precio >= minPrice && product.precio <= maxPrice
    );
  };

  const sortProducts = (sortBy: 'price-asc' | 'price-desc' | 'name' | 'newest'): Product[] => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.precio - b.precio);
      case 'price-desc':
        return sorted.sort((a, b) => b.precio - a.precio);
      case 'name':
        return sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime()
        );
      default:
        return sorted;
    }
  };

  const getProductsByCategory = (categoria_id: string): Product[] => {
    return products.filter(p => p.categoria_id === categoria_id);
  };

  const getProductsBySeller = (vendedor_uid: string): Product[] => {
    return products.filter(p => p.vendedor_uid === vendedor_uid);
  };

  const getAvailableProducts = (): Product[] => {
    return products.filter(p => p.activo && p.stock > 0);
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByPriceRange,
    sortProducts,
    getProductsByCategory,
    getProductsBySeller,
    getAvailableProducts
  };
};