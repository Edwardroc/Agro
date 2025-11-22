import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: ('admin' | 'vendedor' | 'comprador')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { firebaseUser, mongoUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!firebaseUser || !mongoUser) {
    return <Navigate to="/login" replace />;
  }

  // Verificar estado del usuario
  if (mongoUser.estado === 'pendiente') {
    return (
      <div className="pending-approval">
        <h2>Cuenta Pendiente de Aprobación</h2>
        <p>Tu cuenta está siendo revisada por un administrador.</p>
        <p>Te notificaremos cuando sea aprobada.</p>
      </div>
    );
  }

  if (mongoUser.estado === 'bloqueado') {
    return (
      <div className="blocked-account">
        <h2>Cuenta Bloqueada</h2>
        <p>Tu cuenta ha sido suspendida. Contacta al administrador.</p>
      </div>
    );
  }

  // Verificar roles permitidos
  if (allowedRoles && !allowedRoles.includes(mongoUser.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};