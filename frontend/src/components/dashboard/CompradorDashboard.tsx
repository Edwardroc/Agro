import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {api} from '../../config/api';
import '../../styles/dashboard.css';

interface Order {
  _id: string;
  comprador_uid: string;
  vendedor_uid?: string;
  items: Array<{
    producto_id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }>;
  total: number;
  estado: 'pendiente' | 'enviado' | 'entregado' | 'cancelado';
  fecha_pedido: string;
  direccion_envio?: {
    departamento: string;
    ciudad: string;
    detalle: string;
  };
}

interface UserProfile {
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: {
    departamento: string;
    ciudad: string;
    detalle: string;
  };
}

export const CompradorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      
      // Cargar pedidos del comprador
      const ordersRes = await api.get('/order/getOrders');
      const userOrders = ordersRes.data.filter(
        (order: Order) => order.comprador_uid === user.uid
      );
      setOrders(userOrders);

      // Cargar perfil
      const profileRes = await api.get(`/user/${user.uid}`);
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error cargando datos del comprador:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: 'warning',
      enviado: 'info',
      entregado: 'success',
      cancelado: 'danger'
    };
    return colors[estado] || 'default';
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.estado === 'pendiente').length;
    const completedOrders = orders.filter(o => o.estado === 'entregado').length;
    const totalSpent = orders
      .filter(o => o.estado !== 'cancelado')
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent
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
        <h1>Mi Panel de Compras</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Pedidos</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>En Proceso</h3>
            <p className="stat-number">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completados</h3>
            <p className="stat-number">{stats.completedOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Gastado</h3>
            <p className="stat-number">${stats.totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Mis Pedidos
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Mi Perfil
        </button>
      </div>

      {activeTab === 'orders' && (
        <div className="orders-section">
          <div className="section-header">
            <h2>Mis Pedidos</h2>
            <button
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Seguir Comprando
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No tienes pedidos aún</h3>
              <p>¡Explora nuestros productos y realiza tu primera compra!</p>
              <button
                className="btn-primary"
                onClick={() => navigate('/products')}
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders
                .sort((a, b) => 
                  new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime()
                )
                .map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>Pedido #{order._id.slice(-8).toUpperCase()}</h3>
                        <p className="order-date">
                          {new Date(order.fecha_pedido).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`status-badge ${getOrderStatusColor(order.estado)}`}>
                        {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                      </span>
                    </div>

                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{item.nombre}</span>
                            <span className="item-quantity">Cantidad: {item.cantidad}</span>
                          </div>
                          <span className="item-price">
                            ${(item.precio_unitario * item.cantidad).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.direccion_envio && (
                      <div className="order-address">
                        <strong>📍 Dirección de envío:</strong>
                        <p>
                          {order.direccion_envio.detalle}, {order.direccion_envio.ciudad},{' '}
                          {order.direccion_envio.departamento}
                        </p>
                      </div>
                    )}

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total:</strong>
                        <span className="total-amount">${order.total.toLocaleString()}</span>
                      </div>
                      <button
                        className="btn-secondary"
                        onClick={() => navigate(`/orders/${order._id}`)}
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="profile-section">
          <h2>Mi Perfil</h2>
          
          {profile && (
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-avatar">
                  <div className="avatar-circle">
                    {profile.nombre.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="profile-info">
                  <div className="info-group">
                    <label>Nombre</label>
                    <p>{profile.nombre}</p>
                  </div>

                  <div className="info-group">
                    <label>Email</label>
                    <p>{profile.email}</p>
                  </div>

                  <div className="info-group">
                    <label>Teléfono</label>
                    <p>{profile.telefono || 'No registrado'}</p>
                  </div>

                  {profile.direccion && (
                    <div className="info-group">
                      <label>Dirección</label>
                      <p>
                        {profile.direccion.detalle}<br />
                        {profile.direccion.ciudad}, {profile.direccion.departamento}
                      </p>
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Acciones Rápidas</h3>
                <div className="actions-grid">
                  <button
                    className="action-card"
                    onClick={() => navigate('/cart')}
                  >
                    <span className="action-icon">🛒</span>
                    <span>Ver Carrito</span>
                  </button>
                  <button
                    className="action-card"
                    onClick={() => navigate('/products')}
                  >
                    <span className="action-icon">🔍</span>
                    <span>Explorar Productos</span>
                  </button>
                  <button
                    className="action-card"
                    onClick={() => setActiveTab('orders')}
                  >
                    <span className="action-icon">📋</span>
                    <span>Mis Pedidos</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};