import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/api';
import '../../styles/dashboard.css';

interface Product {
  _id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  activo: boolean;
  imagenes?: string[];
  fecha_publicacion: string;
}

interface Order {
  _id: string;
  comprador_uid: string;
  total: number;
  estado: string;
  fecha_pedido: string;
  items: Array<{
    producto_id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }>;
}

export const VendedorDashboard = () => {
  const { mongoUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    loadDashboardData();
  }, [mongoUser]);

  const loadDashboardData = async () => {
    if (!mongoUser?.uid) return;

    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/product'),
        api.get('/order')
      ]);

      // Filtrar productos del vendedor
      const vendorProducts = productsRes.data.filter(
        (p: Product & { vendedor_uid: string }) => p.vendedor_uid === mongoUser.uid
      );
      setProducts(vendorProducts);

      // Filtrar pedidos que contengan productos del vendedor
      const vendorOrders = ordersRes.data.filter((order: Order) =>
        order.items.some(item => {
          const product = vendorProducts.find((p: Product) => p._id === item.producto_id);
          return product !== undefined;
        })
      );
      setOrders(vendorOrders);
    } catch (error) {
      console.error('Error cargando datos del vendedor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProduct = async (productId: string, currentStatus: boolean) => {
    try {
      await api.put(`/product/${productId}`, {
        activo: !currentStatus
      });
      await loadDashboardData();
      alert(`Producto ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
    } catch (error) {
      console.error('Error actualizando producto:', error);
      alert('Error al actualizar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await api.delete(`/product/${productId}`);
      await loadDashboardData();
      alert('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.activo).length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.estado === 'pendiente').length;
    const totalRevenue = orders
      .filter(o => o.estado !== 'cancelado')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loader">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Vendedor</h1>
        <p>Bienvenido, {mongoUser?.primer_nombre}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Productos</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            <small>{stats.activeProducts} activos</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pedidos</h3>
            <p className="stat-number">{stats.totalOrders}</p>
            <small>{stats.pendingOrders} pendientes</small>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Ingresos Totales</h3>
            <p className="stat-number">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Mis Productos
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Pedidos
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="products-section">
          <div className="section-header">
            <h2>Mis Productos</h2>
            <button
              className="btn-primary"
              onClick={() => navigate('/products/new')}
            >
              + Agregar Producto
            </button>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <p>No tienes productos publicados</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/products/new')}
              >
                Crear tu primer producto
              </button>
            </div>
          ) : (
            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.imagenes?.[0] || '/placeholder.png'}
                          alt={product.nombre}
                          className="product-thumbnail"
                        />
                      </td>
                      <td>{product.nombre}</td>
                      <td>${product.precio.toLocaleString()}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`status-badge ${product.activo ? 'activo' : 'inactivo'}`}>
                          {product.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {new Date(product.fecha_publicacion).toLocaleDateString()}
                      </td>
                      <td className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/products/edit/${product._id}`)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleToggleProduct(product._id, product.activo)}
                          title={product.activo ? 'Desactivar' : 'Activar'}
                        >
                          {product.activo ? '🔒' : '🔓'}
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteProduct(product._id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <h2>Pedidos</h2>

          {orders.length === 0 ? (
            <div className="empty-state">
              <p>No tienes pedidos aún</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Pedido #{order._id.slice(-8)}</h3>
                      <p className="order-date">
                        {new Date(order.fecha_pedido).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`status-badge ${order.estado}`}>
                      {order.estado}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.nombre}</span>
                        <span>x{item.cantidad}</span>
                        <span>${item.precio_unitario.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <strong>Total: ${order.total.toLocaleString()}</strong>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};