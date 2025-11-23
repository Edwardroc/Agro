import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product } from '../../interfaces/product.interface';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import '../../styles/products.css';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const { mongoUser } = useAuth();
  const { addToCart } = useCart();

  const isOwner = mongoUser?.uid === product.vendedor_uid;
  const isComprador = mongoUser?.rol === 'comprador';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!product._id) {
      console.error('Producto sin ID');
      return;
    }
    
    await addToCart({
      producto_id: product._id,
      nombre: product.nombre,
      cantidad: 1,
      precio_unitario: product.precio
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && product._id) {
      if (window.confirm('¿Estás seguro de eliminar este producto?')) {
        onDelete(product._id);
      }
    }
  };

  const handleNavigate = () => {
    if (!product._id) {
      console.error('No se puede navegar: producto sin ID');
      return;
    }
    navigate(`/products/${product._id}`);
  };

  const getCategoryName = () => {
    if (typeof product.categoria_id === 'object' && product.categoria_id !== null) {
      return product.categoria_id.nombre || 'Sin categoría';
    }
    return 'Sin categoría';
  };

  return (
    <div 
      className="product-card"
      onClick={handleNavigate}
    >
      <div className="product-image">
        {product.imagenes && product.imagenes.length > 0 ? (
          <img src={product.imagenes[0]} alt={product.nombre} />
        ) : (
          <div className="product-image-placeholder">
            <span>🌱</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-badge">Agotado</div>
        )}
      </div>

      <div className="product-info">
        <div className="product-category">{getCategoryName()}</div>
        <h3 className="product-title">{product.nombre}</h3>
        
        {product.descripcion && (
          <p className="product-description">
            {product.descripcion.length > 80 
              ? `${product.descripcion.substring(0, 80)}...` 
              : product.descripcion}
          </p>
        )}

        <div className="product-footer">
          <div className="product-price-section">
            <span className="product-price">
              ${product.precio.toLocaleString('es-CO')}
            </span>
            <span className="product-stock">
              Stock: {product.stock}
            </span>
          </div>

          <div className="product-actions">
            {isOwner && (
              <>
                <button 
                  className="btn-icon btn-edit"
                  onClick={handleEdit}
                  title="Editar"
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="btn-icon btn-delete"
                  onClick={handleDelete}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}

            {isComprador && product.stock > 0 && (
              <button 
                className="btn-add-cart"
                onClick={handleAddToCart}
                title="Agregar al carrito"
              >
                <ShoppingCart size={18} />
                Agregar
              </button>
            )}
          </div>
        </div>

        {product.etiquetas && product.etiquetas.length > 0 && (
          <div className="product-tags">
            {product.etiquetas.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};