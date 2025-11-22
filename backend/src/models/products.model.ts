import { Schema, model, Model } from "mongoose";
import { Product } from "../interfaces/product.interface";



const ProductSchema = new Schema<Product>({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  categoria_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  vendedor_uid: { type: String, required: true },
  imagenes: [String],
  etiquetas: [String],
  activo: { type: Boolean, default: true },
  fecha_publicacion: { type: Date, default: Date.now }
}, { timestamps: true });

export const ProductModel = model<Product>("Product", ProductSchema) as Model<Product>;
