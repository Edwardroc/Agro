import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Mail, Phone, MapPin, Edit2, X } from 'lucide-react';
import '../styles/dashboard.css';

export const ProfilePage: React.FC = () => {
  const { mongoUser, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    telefono: mongoUser?.telefono || '',
    direccion: {
      departamento: mongoUser?.direccion?.departamento || '',
      ciudad: mongoUser?.direccion?.ciudad || '',
      detalle: mongoUser?.direccion?.detalle || ''
    }
  });

  if (loading) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="loader-container">
            <div className="loader"></div>
            <p>Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!mongoUser) {
    return (
      <>
        <Header />
        <main className="main-content">
          <div className="page-container">
            <p>Error: No se pudo cargar el perfil</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setEditing(false);
  };

  const getInitial = (): string => {
    if (!mongoUser?.primer_nombre) return '?';
    return mongoUser.primer_nombre.charAt(0).toUpperCase();
  };

  const getFullName = (): string => {
    const primer = mongoUser?.primer_nombre || '';
    const segundo = mongoUser?.segundo_nombre || '';
    const apellido = mongoUser?.primer_apellido || '';
    const segundo_apellido = mongoUser?.segundo_apellido || '';
    return `${primer} ${segundo} ${apellido} ${segundo_apellido}`.trim();
  };

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="page-container">
          <div className="profile-page">
            <div className="profile-header">
              <h1>Mi Perfil</h1>
              {!editing && (
                <button
                  className="btn-primary"
                  onClick={() => setEditing(true)}
                >
                  <Edit2 size={18} />
                  Editar Perfil
                </button>
              )}
            </div>

            {!editing ? (
              <div className="profile-display">
                <div className="profile-avatar-large">
                  <div className="avatar-circle-large">
                    {getInitial()}
                  </div>
                </div>

                <div className="profile-info-grid">
                  <div className="info-card">
                    <div className="info-header">
                      <h3>Información Personal</h3>
                    </div>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="info-label">Nombre Completo</span>
                        <span className="info-value">{getFullName()}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Rol</span>
                        <span className="info-value role-badge" style={{ textTransform: 'capitalize' }}>
                          {mongoUser.rol || 'No disponible'}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Estado</span>
                        <span className={`info-value status-badge ${mongoUser.estado}`}>
                          {mongoUser.estado || 'No disponible'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="info-card">
                    <div className="info-header">
                      <Mail size={20} />
                      <h3>Contacto</h3>
                    </div>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="info-label">Email</span>
                        <span className="info-value">{mongoUser.email || 'No disponible'}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Teléfono</span>
                        <span className="info-value">
                          {mongoUser.telefono ? (
                            <a href={`tel:${mongoUser.telefono}`}>{mongoUser.telefono}</a>
                          ) : (
                            'No registrado'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {mongoUser.direccion && (
                    <div className="info-card full-width">
                      <div className="info-header">
                        <MapPin size={20} />
                        <h3>Dirección</h3>
                      </div>
                      <div className="info-list">
                        <div className="info-item">
                          <span className="info-label">Departamento</span>
                          <span className="info-value">
                            {mongoUser.direccion.departamento || 'No registrado'}
                          </span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Ciudad</span>
                          <span className="info-value">
                            {mongoUser.direccion.ciudad || 'No registrado'}
                          </span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Dirección Detallada</span>
                          <span className="info-value">
                            {mongoUser.direccion.detalle || 'No registrada'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="profile-edit">
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="form-section">
                    <h3>Información de Contacto</h3>
                    
                    <div className="form-group">
                      <label htmlFor="telefono">Teléfono</label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="3001234567"
                      />
                    </div>
                  </div>

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
                        />
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="detalle">Dirección Detallada</label>
                      <input
                        type="text"
                        id="detalle"
                        name="direccion.detalle"
                        value={formData.direccion.detalle}
                        onChange={handleChange}
                        placeholder="Calle 123 #45-67, Apartamento 10"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditing(false)}
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};