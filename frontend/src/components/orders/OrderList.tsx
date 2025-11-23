import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {api} from '../../config/api';

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
      const response = await api.get('/order/getOrders');
      
      // Filtrar órdenes según el rol
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

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return <div className="loader">Cargando órdenes...</div>;
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Mis Pedidos</h1>
        <div className="orders-filters">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todos ({orders.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pendiente')}
          >
            Pendientes ({orders.filter(o => o.estado === 'pendiente').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'enviado' ? 'active' : ''}`}
            onClick={() => setFilterStatus('enviado')}
          >
            Enviados ({orders.filter(o => o.estado === 'enviado').length})
          </button>
          <button
            className={`filter-btn ${filterStatus === 'entregado' ? 'active' : ''}`}
            onClick={() => setFilterStatus('entregado')}
          >
            Entregados ({orders.filter(o => o.estado === 'entregado').length})
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No hay pedidos</h2>
          <p>
            {filterStatus === 'all'
              ? 'Aún no tienes ningún pedido'
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
        <div className="orders-list">
          {filteredOrders
            .sort((a, b) => 
              new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime()
            )
            .map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">
                      {new Date(order.fecha_pedido).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusColor(order.estado)}`}>
                    {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-details">
                        <span className="item-name">{item.nombre}</span>
                        <span className="item-quantity">x{item.cantidad}</span>
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
                  <div className="order-payment">
                    <span className="payment-label">Método de pago:</span>
                    <span className="payment-method">
                      {order.metodo_pago || 'Transferencia'}
                    </span>
                  </div>
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>${order.total.toLocaleString()}</strong>
                  </div>
                  <button
                    className="btn-details"
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
  );
};