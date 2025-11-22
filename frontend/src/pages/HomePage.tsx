import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, Leaf } from 'lucide-react';
import '../styles/common.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🌱 Mercado Agrícola
          </h1>
          <p className="hero-subtitle">
            Conectando productores agrícolas con consumidores
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary btn-large"
              onClick={() => navigate('/register')}
            >
              Comenzar Ahora
            </button>
            <button 
              className="btn-secondary btn-large"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>¿Por qué elegirnos?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <ShoppingBag size={48} />
            </div>
            <h3>Productos Frescos</h3>
            <p>Directamente de los productores a tu mesa</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Users size={48} />
            </div>
            <h3>Comunidad</h3>
            <p>Apoyamos a los agricultores locales</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Leaf size={48} />
            </div>
            <h3>Sostenible</h3>
            <p>Promovemos prácticas agrícolas responsables</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>¿Listo para empezar?</h2>
        <p>Únete a nuestra comunidad de agricultores y consumidores</p>
        <button 
          className="btn-primary btn-large"
          onClick={() => navigate('/register')}
        >
          Crear Cuenta Gratis
        </button>
      </section>
    </div>
  );
};