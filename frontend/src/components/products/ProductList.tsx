import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { Product } from '../../interfaces/product.interface';
import { ProductCard } from './ProductCard';
import { Loader } from '../common/Loader';
import { toast } from 'react-toastify';
import '../../styles/products.css';

interface ProductListProps {
  vendedorUid?: string;
  onEdit?: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  vendedorUid, 
  onEdit 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = vendedorUid 
        ? await productService.getByVendor(vendedorUid)
        : await productService.getAll();
      
      setProducts(data.filter(p => p.activo !== false));
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [vendedorUid]);

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      toast.success('Producto eliminado');
      loadProducts();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h2>
          {vendedorUid ? 'Mis Productos' : 'Todos los Productos'}
        </h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos disponibles</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={vendedorUid ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};