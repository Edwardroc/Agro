import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/auth.css';
import { RegisterData } from '../../interfaces/user.interface';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    rol: 'comprador' as 'comprador' | 'vendedor',
    direccion: {
      departamento: '',
      ciudad: '',
      detalle: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('direccion.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        direccion: {
          ...formData.direccion,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    const dataToSend: RegisterData = {
      primer_nombre: formData.primer_nombre,
      segundo_nombre: formData.segundo_nombre,
      primer_apellido: formData.primer_apellido,
      segundo_apellido: formData.segundo_apellido,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      rol: formData.rol,
      direccion: formData.direccion,
    };
    
    try {
      await register(dataToSend);

      toast.success('¡Cuenta creada exitosamente! Tu cuenta está pendiente de aprobación.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h2>🌱 Crear Cuenta</h2>
          <p>Únete al Mercado Agrícola</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Información Personal */}
          <div className="form-section">
            <h3>Información Personal</h3>
            
            <div className="form-row-grid">
              <div className="form-group">
                <label htmlFor="primer_nombre">Primer Nombre *</label>
                <input
                  type="text"
                  id="primer_nombre"
                  name="primer_nombre"
                  value={formData.primer_nombre}
                  onChange={handleChange}
                  required
                  placeholder="Juan"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="segundo_nombre">Segundo Nombre</label>
                <input
                  type="text"
                  id="segundo_nombre"
                  name="segundo_nombre"
                  value={formData.segundo_nombre}
                  onChange={handleChange}
                  placeholder="Camilo"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label htmlFor="primer_apellido">Primer Apellido *</label>
                <input
                  type="text"
                  id="primer_apellido"
                  name="primer_apellido"
                  value={formData.primer_apellido}
                  onChange={handleChange}
                  required
                  placeholder="Pérez"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="segundo_apellido">Segundo Apellido</label>
                <input
                  type="text"
                  id="segundo_apellido"
                  name="segundo_apellido"
                  value={formData.segundo_apellido}
                  onChange={handleChange}
                  placeholder="Rodríguez"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>
            
            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="3001234567"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rol">Tipo de Usuario *</label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </div>
          </div>

          {/* Dirección */}
          <div className="form-section">
            <h3>Dirección</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departamento">Departamento</label>
                <input
                  type="text"
                  id="departamento"
                  name="direccion.departamento"
                  value={formData.direccion.departamento}
                  onChange={handleChange}
                  placeholder="Cundinamarca"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="direccion.ciudad"
                  value={formData.direccion.ciudad}
                  onChange={handleChange}
                  placeholder="Bogotá"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="detalle">Dirección Detallada</label>
              <input
                type="text"
                id="detalle"
                name="direccion.detalle"
                value={formData.direccion.detalle}
                onChange={handleChange}
                placeholder="Calle 123 #45-67"
                disabled={loading}
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="form-section">
            <h3>Seguridad</h3>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
              />
              <small>Mínimo 6 caracteres</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};