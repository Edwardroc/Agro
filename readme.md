# 🌱 Mercado Agrícola - Plataforma de Comercio Electrónico Agrícola

Sistema de comercio electrónico que conecta productores agrícolas con consumidores, desarrollado con React (TypeScript), Node.js, MongoDB y Firebase.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades por Rol](#-funcionalidades-por-rol)
- [API Endpoints](#-api-endpoints)
- [Despliegue](#-despliegue)

---

## ✨ Características Principales

### Para Compradores
- 🛒 Sistema de carrito de compras
- 📦 Gestión de pedidos en tiempo real
- 🔍 Búsqueda y filtrado de productos
- 💳 Múltiples métodos de pago
- 📍 Gestión de direcciones de envío
- ⭐ Sistema de reseñas y calificaciones
- 🔔 Notificaciones de estado de pedidos

### Para Vendedores
- 📝 CRUD completo de productos
- 📊 Panel de control con estadísticas
- 📦 Gestión de inventario
- 🚚 Seguimiento de pedidos
- 💰 Reportes de ventas
- ✅ Sistema de aprobación de cuenta

### Para Administradores
- 👥 Gestión de usuarios
- ✅ Aprobación de vendedores
- 📊 Dashboard con métricas del sistema
- 🔐 Control de acceso y permisos
- 📈 Estadísticas globales

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **React Router v6** - Navegación
- **React Context API** - Gestión de estado global
- **Axios** - Cliente HTTP
- **React Toastify** - Notificaciones
- **Lucide React** - Iconos
- **CSS3** - Estilos personalizados

### Backend
- **Node.js** - Entorno de ejecución
- **Express 5** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Firebase Admin** - Autenticación y gestión

### Autenticación y Seguridad
- **Firebase Authentication** - Sistema de autenticación
- **JWT** - Tokens de acceso
- **Custom Claims** - Roles y permisos
- **Middleware de autorización** - Control de acceso por rol

### DevOps & Tools
- **Git** - Control de versiones
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Nodemon** - Desarrollo en caliente

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│          Cliente (React + TypeScript)       │
│  - Gestión de estado (Context API)         │
│  - Rutas protegidas                         │
│  - Componentes reutilizables               │
└──────────────────┬──────────────────────────┘
                   │ HTTP/HTTPS (REST API)
                   │
┌──────────────────▼──────────────────────────┐
│         API Backend (Node.js + Express)     │
│  - Autenticación con Firebase              │
│  - Middleware de roles                      │
│  - Validaciones                             │
│  - Manejo de errores                        │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼─────────┐
│   MongoDB      │   │  Firebase Auth   │
│  - Usuarios    │   │  - Tokens        │
│  - Productos   │   │  - Custom Claims │
│  - Pedidos     │   │  - Usuarios      │
│  - Carritos    │   │                  │
│  - Reseñas     │   │                  │
└────────────────┘   └──────────────────┘
```

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** v18+ ([Descargar](https://nodejs.org/))
- **npm** v9+ (viene con Node.js)
- **MongoDB** v5+ ([Descargar](https://www.mongodb.com/try/download/community))
- **Git** ([Descargar](https://git-scm.com/))
- Una cuenta de **Firebase** ([Crear cuenta](https://firebase.google.com/))

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/lauracast000009/proyectoFinal.git
cd proyectoFinal
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Editar .env con tus credenciales (ver sección de Variables de Entorno)
```

**Iniciar MongoDB localmente:**

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

**Ejecutar el servidor:**

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

El backend estará disponible en `http://localhost:3000`

### 3. Configurar el Frontend

```bash
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local

# Editar .env.local con la URL de tu backend y credenciales de Firebase
```

**Ejecutar la aplicación:**

```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

---

## 🔐 Variables de Entorno

### Backend (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mercado_agricola

# Firebase Admin SDK
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-client-email@tu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Server
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)

```env
# Backend API
REACT_APP_API_URL=http://localhost:3000/api

# Firebase Web Config
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
REACT_APP_FIREBASE_APP_ID=tu-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=tu-measurement-id
```

### 📝 Obtener Credenciales de Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. **Para el Backend (Admin SDK):**
   - Ve a Configuración del proyecto > Cuentas de servicio
   - Genera una nueva clave privada
   - Copia los valores de `project_id`, `client_email` y `private_key`
4. **Para el Frontend (Web App):**
   - Ve a Configuración del proyecto > General
   - En "Tus aplicaciones", selecciona la app web
   - Copia la configuración de Firebase

---

## 📁 Estructura del Proyecto

```
proyectoFinal/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts       # Conexión MongoDB
│   │   │   └── firebase.ts       # Configuración Firebase Admin
│   │   │
│   │   ├── controllers/          # Lógica de negocio
│   │   │   ├── cart.controller.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── review.controller.ts
│   │   │   └── user.controller.ts
│   │   │
│   │   ├── interfaces/           # Definiciones TypeScript
│   │   │   ├── cart.interface.ts
│   │   │   ├── order.interface.ts
│   │   │   ├── product.interface.ts
│   │   │   └── user.interface.ts
│   │   │
│   │   ├── middlewares/          # Middlewares personalizados
│   │   │   ├── checkRole.ts      # Verificación de roles
│   │   │   ├── errorHandler.ts   # Manejo de errores
│   │   │   └── verifyFirebase.ts # Verificación de tokens
│   │   │
│   │   ├── models/               # Modelos de Mongoose
│   │   │   ├── cart.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── notification.model.ts
│   │   │   ├── order.model.ts
│   │   │   ├── products.model.ts
│   │   │   ├── review.model.ts
│   │   │   └── user.model.ts
│   │   │
│   │   ├── routes/               # Definición de rutas
│   │   │   ├── cart.router.ts
│   │   │   ├── notification.router.ts
│   │   │   ├── order.router.ts
│   │   │   ├── product.router.ts
│   │   │   ├── review.router.ts
│   │   │   ├── user.router.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── scripts/              # Scripts de utilidad
│   │   │   └── setRole.ts        # Asignar roles a usuarios
│   │   │
│   │   └── index.ts              # Punto de entrada
│   │
│   ├── .env.example              # Ejemplo de variables de entorno
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   └── products/
│   │   │
│   │   ├── config/
│   │   │   ├── api.ts            # Configuración Axios
│   │   │   └── firebase.ts       # Configuración Firebase Client
│   │   │
│   │   ├── contexts/             # Context API
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   │
│   │   ├── hooks/                # Custom Hooks
│   │   │   ├── useCart.ts
│   │   │   └── useProducts.ts
│   │   │
│   │   ├── interfaces/           # Definiciones TypeScript
│   │   │   ├── cart.interface.ts
│   │   │   ├── order.interface.ts
│   │   │   ├── product.interface.ts
│   │   │   └── user.interface.ts
│   │   │
│   │   ├── pages/                # Páginas principales
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ProductsPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── MyOrdersPage.tsx
│   │   │
│   │   ├── services/             # Servicios de API
│   │   │   ├── authService.ts
│   │   │   ├── cartService.ts
│   │   │   ├── orderService.ts
│   │   │   └── productService.ts
│   │   │
│   │   ├── styles/               # Estilos CSS
│   │   │   ├── index.css
│   │   │   ├── auth.css
│   │   │   ├── cart.css
│   │   │   ├── dashboard.css
│   │   │   ├── products.css
│   │   │   └── responsive.css
│   │   │
│   │   ├── utils/                # Utilidades
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── App.tsx               # Componente principal
│   │   └── index.tsx             # Punto de entrada
│   │
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 👥 Funcionalidades por Rol

### 🛍 Comprador

| Funcionalidad | Descripción |
|---------------|-------------|
| Registro | Creación de cuenta con aprobación automática |
| Login | Autenticación con Firebase |
| Explorar productos | Ver catálogo completo con búsqueda y filtros |
| Carrito de compras | Agregar/eliminar productos, actualizar cantidades |
| Realizar pedidos | Checkout con selección de dirección y método de pago |
| Historial de pedidos | Ver todos los pedidos realizados |
| Seguimiento | Monitorear el estado de los pedidos |
| Reseñas | Calificar y comentar productos |
| Perfil | Gestionar información personal |

### 🌾 Vendedor

| Funcionalidad | Descripción |
|---------------|-------------|
| Registro | Solicitud de cuenta (requiere aprobación del admin) |
| Gestión de productos | CRUD completo de productos |
| Inventario | Control de stock y disponibilidad |
| Pedidos | Ver pedidos de sus productos |
| Estadísticas | Dashboard con métricas de ventas |
| Notificaciones | Alertas de nuevos pedidos |

### 🔧 Administrador

| Funcionalidad | Descripción |
|---------------|-------------|
| Dashboard | Vista general del sistema |
| Gestión de usuarios | Crear, editar, eliminar usuarios |
| Aprobación de vendedores | Aprobar/rechazar solicitudes |
| Gestión de productos | Control total sobre el catálogo |
| Gestión de pedidos | Supervisar todos los pedidos |
| Estadísticas globales | Métricas completas del sistema |

---

## 🔌 API Endpoints

### Autenticación

```
POST   /api/user              # Crear usuario
GET    /api/user              # Obtener todos los usuarios (admin)
GET    /api/user/:uid         # Obtener usuario por UID
PUT    /api/user/:id          # Actualizar usuario
DELETE /api/user/:id          # Eliminar usuario (admin)
PATCH  /api/user/:id/estado   # Aprobar/rechazar vendedor (admin)
```

### Productos

```
GET    /api/product           # Obtener todos los productos
GET    /api/product/:id       # Obtener producto por ID
POST   /api/product           # Crear producto (vendedor/admin)
PUT    /api/product/:id       # Actualizar producto (vendedor/admin)
DELETE /api/product/:id       # Eliminar producto (admin)
```

### Carrito

```
GET    /api/cart/:uid         # Obtener carrito del usuario
POST   /api/cart              # Agregar producto al carrito
DELETE /api/cart/:uid/clear   # Vaciar carrito
DELETE /api/cart/:uid/items/:productId  # Remover producto
```

### Pedidos

```
POST   /api/order             # Crear pedido (comprador)
GET    /api/order             # Obtener todos los pedidos (admin)
GET    /api/order/:id         # Obtener pedido por ID
PATCH  /api/order/:id/status  # Actualizar estado (admin/vendedor)
DELETE /api/order/:id         # Eliminar pedido (admin)
```

### Reseñas

```
POST   /api/review            # Crear reseña (comprador)
GET    /api/review/:productId # Obtener reseñas de un producto
GET    /api/review            # Obtener todas las reseñas (admin)
PUT    /api/review/:id        # Actualizar reseña
DELETE /api/review/:id        # Eliminar reseña
```

### Notificaciones

```
POST   /api/notification      # Crear notificación (admin)
GET    /api/notification/:uid # Obtener notificaciones del usuario
PATCH  /api/notification/:id/read  # Marcar como leída
DELETE /api/notification/:id       # Eliminar notificación
DELETE /api/notification/clear/:uid # Limpiar todas
```

---

## 🚀 Despliegue

### Despliegue Local para Desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - MongoDB (si no está como servicio)
mongod
```

### Despliegue en Producción

#### Backend (Railway, Render, Heroku)

1. **Preparar el proyecto:**
```bash
cd backend
npm run build
```

2. **Variables de entorno:**
   - Configura todas las variables de entorno en la plataforma
   - Asegúrate de tener `MONGODB_URI` con tu cluster de MongoDB Atlas

3. **Comando de inicio:**
```json
{
  "start": "node build/index.js"
}
```

#### Frontend (Vercel, Netlify)

1. **Build del proyecto:**
```bash
cd frontend
npm run build
```

2. **Variables de entorno:**
   - Configura `REACT_APP_API_URL` con la URL de tu backend
   - Configura todas las variables de Firebase

3. **Configuración de despliegue:**
   - Build command: `npm run build`
   - Output directory: `build`

#### MongoDB Atlas

1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configura IP Whitelist (0.0.0.0/0 para acceso desde cualquier IP)
3. Crea un usuario de base de datos
4. Obtén la connection string y úsala en `MONGODB_URI`

---

## 🔒 Seguridad

### Implementaciones de Seguridad

- ✅ **Autenticación con Firebase** - Tokens JWT seguros
- ✅ **Custom Claims** - Roles y permisos en tokens
- ✅ **Middleware de verificación** - Validación de tokens en cada request
- ✅ **Protección de rutas** - Acceso basado en roles
- ✅ **Validación de datos** - Sanitización en backend
- ✅ **CORS configurado** - Solo dominios permitidos
- ✅ **Variables de entorno** - Credenciales nunca en código
- ✅ **MongoDB con autenticación** - Base de datos protegida

### Mejores Prácticas

- 🔐 Nunca compartas las credenciales de Firebase
- 🔐 Usa HTTPS en producción
- 🔐 Implementa rate limiting en producción
- 🔐 Mantén las dependencias actualizadas
- 🔐 Realiza backups regulares de la base de datos

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📚 Scripts Útiles

### Backend

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Compilar TypeScript
npm start           # Producción
npm run set-role    # Asignar rol a usuario
```

### Frontend

```bash
npm start           # Desarrollo
npm run build       # Build de producción
npm test            # Ejecutar tests
```



---

## 👨‍💻 Autores

- **Edward Nicolas Ramírez Rocha** - *Desarrollador frontend y union de trabajo*
- **Ikhthys Felepe Bernal Pachon** - *DevOps & Backend*

---