export interface Direccion {
  departamento?: string;
  ciudad?: string;
  detalle?: string;
}

export interface User {
  _id?: string;
  uid: string; // UID de Firebase
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email: string;
  telefono?: string;
  rol: "admin" | "vendedor" | "comprador";
  direccion?: Direccion;
  foto_perfil?: string;
  fecha_registro?: Date;
  estado?: "activo" | "pendiente" | "bloqueado" | "aprobado" | "rechazado";
}
