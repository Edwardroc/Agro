export interface Direccion {
  departamento: string;
  ciudad: string;
  detalle: string;
}

export interface User {
  _id?: string;
  uid: string;
  primerNombre: string;
  segundoNombre?: string; 
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  telefono?: string;
  rol: "admin" | "vendedor" | "comprador";
  direccion?: Direccion;
  foto_perfil?: string;
  fecha_registro?: string;
  estado?: "activo" | "pendiente" | "bloqueado";
}

export interface RegisterData {
  primerNombre: string;
  segundoNombre?: string; 
  primerApellido: string;
  segundoApellido?: string;
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