import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await api.get(`/order/getOrderById/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error cargando orden:', error);
      alert('Error al cargar la orden');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id || !order) return;

    if (!window.confirm(`¿Cambiar estado a "${newStatus}"?`)) return;

    try {
      setUpdating(true);
      await api.put(`/order/updateOrderStatus/${id}/status`, {
        estado: newStatus
      });
      await loadOrder();
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
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

  const canUpdateStatus = () => {
    if (!user || !order) return false;
    return user.rol === 'admin' || user.rol === 'vendedor';
  };

  const getAvailableStatuses = () => {
    if (!order) return [];
    
    const statusFlow: Record<string, string[]> = {
      pendiente: ['enviado', 'cancelado'],
      enviado: ['entregado', 'cancelado'],
      entregado: [],
      cancelado: []
    };

    return statusFlow[order.estado] || [];
  };

  if (loading) {
    return <div className="loader">Cargando detalles del pedido...</div>;
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Pedido no encontrado</h2>
        <button onClick={() => navigate('/orders')}>Volver a pedidos</button>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/orders')}>
          ← Volver
        </button>
        <h1>Detalle del Pedido</h1>
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-card">
            <div className="card-header">
              <div>
                <h2>Pedido #{order._id.slice(-8).toUpperCase()}</h2>
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
              <span className={`status-badge large ${getStatusColor(order.estado)}`}>
                {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
              </span>
            </div>

            <div className="order-timeline">
              <div className={`timeline-step ${['pendiente', 'enviado', 'entregado'].includes(order.estado) || order.estado === 'cancelado' ? 'completed' : ''}`}>
                <div className="step-circle">1</div>
                <div className="step-label">Pendiente</div>
              </div>
              <div className="timeline-line"></div>
              <div className={`timeline-step ${['enviado', 'entregado'].includes(order.estado) ? 'completed' : ''}`}>
                <div className="step-circle">2</div>
                <div className="step-label">Enviado</div>
              </div>
              <div className="timeline-line"></div>
              <div className={`timeline-step ${order.estado === 'entregado' ? 'completed' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-label">Entregado</div>
              </div>
            </div>

            <div className="items-section">
              <h3>Productos</h3>
              <div className="items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <div className="item-info">
                      <span className="item-name">{item.nombre}</span>
                      <span className="item-unit-price">
                        ${item.precio_unitario.toLocaleString()} c/u
                      </span>
                    </div>
                    <div className="item-quantity">x{item.cantidad}</div>
                    <div className="item-total">
                      ${(item.precio_unitario * item.cantidad).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${order.total.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <strong>Total:</strong>
                <strong>${order.total.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          {order.direccion_envio && (
            <div className="sidebar-card">
              <h3>📍 Dirección de Envío</h3>
              <div className="address-info">
                <p>{order.direccion_envio.detalle}</p>
                <p>{order.direccion_envio.ciudad}</p>
                <p>{order.direccion_envio.departamento}</p>
              </div>
            </div>
          )}

          <div className="sidebar-card">
            <h3>💳 Información de Pago</h3>
            <div className="payment-info">
              <p>
                <strong>Método:</strong> {order.metodo_pago || 'Transferencia'}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toLocaleString()}
              </p>
            </div>
          </div>

          {canUpdateStatus() && getAvailableStatuses().length > 0 && (
            <div className="sidebar-card">
              <h3>🔄 Actualizar Estado</h3>
              <div className="status-actions">
                {getAvailableStatuses().map(status => (
                  <button
                    key={status}
                    className={`btn-status ${status}`}
                    onClick={() => handleUpdateStatus(status)}
                    disabled={updating}
                  >
                    {updating ? 'Actualizando...' : `Marcar como ${status}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-card">
            <h3>ℹ️ Información Adicional</h3>
            <div className="additional-info">
              <p>
                <strong>ID de Pedido:</strong>
                <br />
                <code>{order._id}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};