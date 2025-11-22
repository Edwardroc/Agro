import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../interfaces/product.interface';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Loader } from '../common/Loader';
import { toast } from 'react-toastify';
import '../../styles/products.css';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mongoUser } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await productService.getById(id);
      setProduct(data);
    } catch (error) {
      toast.error('Error al cargar producto');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product?._id) return;
    
    await addToCart({
      producto_id: product._id,
      nombre: product.nombre,
      cantidad: quantity,
      precio_unitario: product.precio
    });
  };

  const getCategoryName = () => {
    if (!product) return '';
    if (typeof product.categoria_id === 'object') {
      return product.categoria_id.nombre;
    }
    return 'Sin categoría';
  };

  if (loading) return <Loader />;
  if (!product) return <div>Producto no encontrado</div>;

  const isComprador = mongoUser?.rol === 'comprador';

  return (
    <div className="product-detail-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="product-detail">
        <div className="product-detail-images">
          {product.imagenes && product.imagenes.length > 0 ? (
            <img src={product.imagenes[0]} alt={product.nombre} />
          ) : (
            <div className="product-detail-placeholder">
              <span>🌱</span>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-category">{getCategoryName()}</div>
          <h1 className="product-detail-title">{product.nombre}</h1>
          
          {product.descripcion && (
            <p className="product-detail-description">{product.descripcion}</p>
          )}

          <div className="product-detail-price">
            ${product.precio.toLocaleString('es-CO')}
          </div>

          <div className="product-detail-stock">
            <strong>Disponible:</strong> {product.stock} unidades
          </div>

          {product.etiquetas && product.etiquetas.length > 0 && (
            <div className="product-detail-tags">
              {product.etiquetas.map((tag, index) => (
                <span key={index} className="product-tag">{tag}</span>
              ))}
            </div>
          )}

          {isComprador && product.stock > 0 && (
            <div className="product-detail-actions">
              <div className="quantity-selector">
                <label>Cantidad:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="btn-add-cart-large"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>
            </div>
          )}

          {product.stock === 0 && (
            <div className="out-of-stock-message">
              Este producto está agotado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};