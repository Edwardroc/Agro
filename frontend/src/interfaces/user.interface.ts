export interface Direccion {
  departamento: string;
  ciudad: string;
  detalle: string;
}

export interface User {
  _id?: string;
  uid: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email: string;
  telefono?: string;
  rol: "admin" | "vendedor" | "comprador";
  direccion?: Direccion;
  foto_perfil?: string;
  fecha_registro?: string;
  estado?: "activo" | "pendiente" | "bloqueado" | "aprobado" | "rechazado";
}

export interface RegisterData {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email: string;
  password: string;
  telefono?: string;
  rol: "vendedor" | "comprador";
  direccion?: Direccion;
}

export interface LoginData {
  email: string;
  password: string;
}