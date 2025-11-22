import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {api} from '../../config/api';
import '../../styles/dashboard.css';

interface User {
  _id: string;
  uid: string;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  fecha_registro: string;
}

interface DashboardStats {
  totalUsers: number;
  pendingUsers: number;
  totalProducts: number;
  totalOrders: number;
}

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingUsers: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/user'),
        api.get('/product/getProducts'),
        api.get('/order/getOrders')
      ]);

      const usersData = usersRes.data;
      setUsers(usersData);

      setStats({
        totalUsers: usersData.length,
        pendingUsers: usersData.filter((u: User) => u.estado === 'pendiente').length,
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length
      });
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      await api.patch(`/user/${userId}/estado`, { estado: 'aprobado' });
      await loadDashboardData();
      alert('Usuario aprobado correctamente');
    } catch (error) {
      console.error('Error aprobando usuario:', error);
      alert('Error al aprobar usuario');
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      await api.patch(`/user/${userId}/estado`, { estado: 'rechazado' });
      await loadDashboardData();
      alert('Usuario rechazado');
    } catch (error) {
      console.error('Error rechazando usuario:', error);
      alert('Error al rechazar usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await api.delete(`/user/${userId}`);
      await loadDashboardData();
      alert('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar usuario');
    }
  };

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
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Estadísticas
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestión de Usuarios
        </button>
      </div>

      {activeTab === 'stats' && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Usuarios</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Usuarios Pendientes</h3>
              <p className="stat-number">{stats.pendingUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Total Productos</h3>
              <p className="stat-number">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <h3>Total Pedidos</h3>
              <p className="stat-number">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-management">
          <h2>Gestión de Usuarios</h2>
          
          {users.filter(u => u.estado === 'pendiente').length > 0 && (
            <div className="pending-users-section">
              <h3>Usuarios Pendientes de Aprobación</h3>
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => u.estado === 'pendiente')
                      .map(user => (
                        <tr key={user._id}>
                          <td>{user.nombre}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.rol}`}>
                              {user.rol}
                            </span>
                          </td>
                          <td>
                            {new Date(user.fecha_registro).toLocaleDateString()}
                          </td>
                          <td className="action-buttons">
                            <button
                              className="btn-approve"
                              onClick={() => handleApproveUser(user._id)}
                            >
                              ✓ Aprobar
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleRejectUser(user._id)}
                            >
                              ✗ Rechazar
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="all-users-section">
            <h3>Todos los Usuarios</h3>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.nombre}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.rol}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.estado}`}>
                          {user.estado}
                        </span>
                      </td>
                      <td>
                        {new Date(user.fecha_registro).toLocaleDateString()}
                      </td>
                      <td className="action-buttons">
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};