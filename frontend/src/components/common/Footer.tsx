import React from 'react';
import '../../styles/common.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© 2024 Mercado Agrícola 🌱 - Todos los derechos reservados</p>
        <div className="footer-links">
          <a href="/about">Acerca de</a>
          <a href="/terms">Términos</a>
          <a href="/privacy">Privacidad</a>
          <a href="/contact">Contacto</a>
        </div>
      </div>
    </footer>
  );
};