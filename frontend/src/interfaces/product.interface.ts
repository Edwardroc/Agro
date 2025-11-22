export interface Category {
  _id?: string;
  nombre: string;
  descripcion?: string;
  slug?: string;
}

export interface Product {
  _id?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: string | Category;
  vendedor_uid: string;
  imagenes?: string[];
  etiquetas?: string[];
  activo?: boolean;
  fecha_publicacion?: string;
}

export interface ProductFormData {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoria_id: string;
  imagenes?: string[];
  etiquetas?: string[];
}