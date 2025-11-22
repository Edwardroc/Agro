export interface CartItem {
  producto_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Cart {
  _id?: string;
  comprador_uid: string;
  items: CartItem[];
  total: number;
  fecha_actualizacion?: string;
}