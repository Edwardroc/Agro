import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../config/api';
import { Package, Calendar, DollarSign, MapPin } from 'lucide-react';

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
  metodo_pago?: string;
  direccion_envio?: {
    departamento: string;
    ciudad: string;
    detalle: string;
  };
}

export const OrderList = () => {
  const { mongoUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [mongoUser]);

  const loadOrders = async () => {
    if (!mongoUser?.uid) return;

    try {
      setLoading(true);
      const response = await api.get('/order');
      
      let userOrders = response.data;
      if (mongoUser.rol === 'comprador') {
        userOrders = response.data.filter(
          (order: Order) => order.comprador_uid === mongoUser.uid
        );
      } else if (mongoUser.rol === 'vendedor') {
        userOrders = response.data.filter(
          (order: Order) => order.vendedor_uid === mongoUser.uid
        );
      }
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'all') return orders;
    return orders.filter(order => order.estado === filterStatus);
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: 'warning',
      enviado: 'info',
      entregado: 'success',
      cancelado: 'danger'
    };
    return colors[estado] || 'default';
  };

  const getStatusIcon = (estado: string) => {
    switch(estado) {
      case 'pendiente': return '⏳';
      case 'enviado': return '📦';
      case 'entregado': return '✅';
      case 'cancelado': return '❌';
      default: return '📋';
    }
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page-header">
        <div className="header-content">
          <h1>Mis Pedidos</h1>
          <p>Gestiona y sigue el estado de tus compras</p>
        </div>
        
        <div className="orders-stats">
          <div className="stat-mini">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-label">Total</span>
              <span className="stat-value">{orders.length}</span>
            </div>
          </div>
          
          <div className="stat-mini">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-label">En Proceso</span>
              <span className="stat-value">{orders.filter(o => o.estado === 'pendiente').length}</span>
            </div>
          </div>
          
          <div className="stat-mini">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-label">Entregados</span>
              <span className="stat-value">{orders.filter(o => o.estado === 'entregado').length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="orders-filters">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Todos
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pendiente' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pendiente')}
        >
          ⏳ Pendientes
        </button>
        <button
          className={`filter-btn ${filterStatus === 'enviado' ? 'active' : ''}`}
          onClick={() => setFilterStatus('enviado')}
        >
          📦 Enviados
        </button>
        <button
          className={`filter-btn ${filterStatus === 'entregado' ? 'active' : ''}`}
          onClick={() => setFilterStatus('entregado')}
        >
          ✅ Entregados
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📭</div>
          <h2>Sin pedidos</h2>
          <p>
            {filterStatus === 'all'
              ? 'Aún no tienes ningún pedido realizado'
              : `No hay pedidos con estado: ${filterStatus}`}
          </p>
          {mongoUser?.rol === 'comprador' && (
            <button
              className="btn-primary"
              onClick={() => navigate('/products')}
            >
              Explorar Productos
            </button>
          )}
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders
            .sort((a, b) => 
              new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime()
            )
            .map(order => (
              <div key={order._id} className="order-card-enhanced">
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`status-badge ${getStatusColor(order.estado)}`}>
                      {getStatusIcon(order.estado)} {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                    </span>
                  </div>
                  <span className="order-date">
                    <Calendar size={16} />
                    {new Date(order.fecha_pedido).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="order-summary">
                  <div className="summary-item">
                    <Package size={16} />
                    <span>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="summary-item">
                    <DollarSign size={16} />
                    <span className="price">${order.total.toLocaleString('es-CO')}</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="item-preview">
                      <span className="item-name">{item.nombre}</span>
                      <span className="item-qty">x{item.cantidad}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <div className="items-more">
                      +{order.items.length - 2} más
                    </div>
                  )}
                </div>

                {order.direccion_envio && (
                  <div className="order-location">
                    <MapPin size={14} />
                    <span>
                      {order.direccion_envio.ciudad}, {order.direccion_envio.departamento}
                    </span>
                  </div>
                )}

                <div className="order-payment-method">
                  <span className="method-label">Pago:</span>
                  <span className="method-value">{order.metodo_pago || 'Transferencia'}</span>
                </div>

                <button
                  className="btn-view-details"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  Ver Detalles →
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};