import { CartItem } from './cart.interface';
import { Direccion } from './user.interface';

export interface Order {
  _id?: string;
  comprador_uid: string;
  vendedor_uid?: string;
  items: CartItem[];
  total: number;
  metodo_pago?: string;
  direccion_envio?: Direccion;
  estado?: "pendiente" | "enviado" | "entregado" | "cancelado";
  fecha_pedido?: string;
}