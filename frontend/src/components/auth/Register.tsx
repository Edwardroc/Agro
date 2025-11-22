import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/auth.css';
import { RegisterData } from '../../interfaces/user.interface'; // Importar RegisterData

// ⚠️ NOTA IMPORTANTE:
// Asegúrate de que tu RegisterData en '../../interfaces/user.interface.ts'
// SÍ tenga los 4 campos (primerNombre, segundoNombre, primerApellido, segundoApellido).

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    
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

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    // ❌ ELIMINAMOS LA CONCATENACIÓN DEL NOMBRE COMPLETO ❌
    // El servicio authService.ts ahora espera los campos separados.
    const dataToSend: RegisterData = {
      primerNombre: formData.primerNombre,
      segundoNombre: formData.segundoNombre,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      rol: formData.rol,
      direccion: formData.direccion,
    };
    // -------------------------------------------------------------
    
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
            
            {/* CAMPOS DE NOMBRE/APELLIDO - NO SE MODIFICAN AQUI, YA ESTABAN BIEN */}
            <div className="form-row-grid">
              <div className="form-group">
                <label htmlFor="primerNombre">Primer Nombre *</label>
                <input
                  type="text"
                  id="primerNombre"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  required
                  placeholder="Juan"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="segundoNombre">Segundo Nombre</label>
                <input
                  type="text"
                  id="segundoNombre"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  placeholder="Camilo"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label htmlFor="primerApellido">Primer Apellido *</label>
                <input
                  type="text"
                  id="primerApellido"
                  name="primerApellido"
                  value={formData.primerApellido}
                  onChange={handleChange}
                  required
                  placeholder="Pérez"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="segundoApellido">Segundo Apellido</label>
                <input
                  type="text"
                  id="segundoApellido"
                  name="segundoApellido"
                  value={formData.segundoApellido}
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