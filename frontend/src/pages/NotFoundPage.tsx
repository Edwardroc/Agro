import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe o ha sido movida.</p>
        <button 
          className="btn-primary"
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};