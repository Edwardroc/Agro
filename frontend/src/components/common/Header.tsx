import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { CartDropdown } from '../cart/CartDropdown';
import '../../styles/header.css';

export const Header: React.FC = () => {
  const { mongoUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  const getNombreCompleto = () => {
    if (!mongoUser) return '';
    const nombre = mongoUser.primer_nombre || '';
    const apellido = mongoUser.primer_apellido || '';
    return `${nombre} ${apellido}`.trim();
  };

  // Cerrar dropdown cuando haces click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserDropdown]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/dashboard" className="logo-link">
            🌱 Mercado Agrícola
          </Link>
        </div>

        {/* Menú Desktop */}
        <nav className="nav-links desktop-nav">
          <Link to="/dashboard">Inicio</Link>
          <Link to="/products">Productos</Link>
          {mongoUser?.rol === 'vendedor' && (
            <Link to="/my-products">Mis Productos</Link>
          )}
          {mongoUser?.rol === 'comprador' && (
            <Link to="/my-orders">Mis Pedidos</Link>
          )}
          {mongoUser?.rol === 'admin' && (
            <Link to="/dashboard">Panel Admin</Link>
          )}
        </nav>

        {/* Acciones Usuario */}
        <div className="header-actions">
          {mongoUser?.rol === 'comprador' && (
            <div className="cart-wrapper">
              <button
                className="icon-btn cart-btn"
                onClick={() => setShowCartDropdown(!showCartDropdown)}
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </button>
              {showCartDropdown && (
                <CartDropdown onClose={() => setShowCartDropdown(false)} />
              )}
            </div>
          )}

          <div className="user-menu" ref={userMenuRef}>
            <button 
              className="icon-btn user-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)} 
            >
              <User size={24} />
            </button>
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{getNombreCompleto()}</p>
                  <p className="user-role">{mongoUser?.rol}</p>
                </div>
                <hr />
                <Link 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setShowUserDropdown(false)}
                >
                  Mi Perfil
                </Link>
                <button 
                  onClick={() => {
                    setShowUserDropdown(false);
                    handleLogout();
                  }} 
                  className="dropdown-item logout"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón Menú Mobile */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      {showMobileMenu && (
        <nav className="mobile-nav">
          <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}>
            Inicio
          </Link>
          <Link to="/products" onClick={() => setShowMobileMenu(false)}>
            Productos
          </Link>
          {mongoUser?.rol === 'vendedor' && (
            <Link to="/my-products" onClick={() => setShowMobileMenu(false)}>
              Mis Productos
            </Link>
          )}
          {mongoUser?.rol === 'comprador' && (
            <Link to="/my-orders" onClick={() => setShowMobileMenu(false)}>
              Mis Pedidos
            </Link>
          )}
          {mongoUser?.rol === 'admin' && (
            <Link to="/dashboard" onClick={() => setShowMobileMenu(false)}>
              Panel Admin
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};