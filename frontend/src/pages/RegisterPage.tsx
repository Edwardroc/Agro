import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Register } from '../components/auth/Register';

export const RegisterPage: React.FC = () => {
  const { mongoUser, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Si es vendedor pendiente, mostrar página de aprobación
  if (mongoUser?.estado === 'pendiente' && mongoUser.rol === 'vendedor') {
    return (
      <div className="pending-approval-page">
        <div className="pending-container">
          <div className="pending-icon">📋</div>
          <h1>Cuenta Pendiente de Aprobación</h1>
          <p className="pending-message">
            ¡Bienvenido a Mercado Agrícola! Tu solicitud como vendedor ha sido registrada exitosamente.
          </p>
          
          <div className="pending-details">
            <div className="detail-card">
              <h3>¿Qué sucede ahora?</h3>
              <ul>
                <li>✓ Tu cuenta ha sido creada correctamente</li>
                <li>⏳ Estamos verificando tu información</li>
                <li>👨‍💼 Un administrador revisará tu solicitud</li>
                <li>📧 Recibirás un email cuando sea aprobada</li>
              </ul>
            </div>

            <div className="detail-card">
              <h3>Información de tu Solicitud</h3>
              <div className="info-box">
                <p><strong>Email:</strong> {mongoUser?.email}</p>
                <p><strong>Nombre:</strong> {mongoUser?.primer_nombre} {mongoUser?.primer_apellido}</p>
                <p><strong>Rol:</strong> Vendedor</p>
                <p><strong>Estado:</strong> <span className="status-pending">Pendiente de Aprobación</span></p>
              </div>
            </div>
          </div>

          <div className="pending-help">
            <h3>¿Necesitas ayuda?</h3>
            <p>Si tienes alguna pregunta, contacta con nuestro equipo de soporte en:</p>
            <a href="mailto:soporte@mercadoagricola.com" className="email-link">
              soporte@mercadoagricola.com
            </a>
          </div>

          <button 
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    );
  }

  // Si ya está logueado y no es pendiente, redirigir
  if (mongoUser && mongoUser.estado !== 'pendiente') {
    navigate('/dashboard');
    return null;
  }

  return <Register />;
};