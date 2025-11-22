import { Schema, model, Model } from "mongoose";
import { User } from "../interfaces/user.interface";

const UserSchema = new Schema<User>(
  {
    uid: { type: String, required: true, unique: true },
    primer_nombre: { type: String, required: true },
    segundo_nombre: { type: String },
    primer_apellido: { type: String, required: true },
    segundo_apellido: { type: String },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    rol: {
      type: String,
      enum: ["admin", "vendedor", "comprador"],
      default: "comprador",
    },
    direccion: {
      departamento: String,
      ciudad: String,
      detalle: String,
    },
    foto_perfil: { type: String, default: "" },
    fecha_registro: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ["activo", "pendiente", "bloqueado", "aprobado", "rechazado"],
      default: "activo",
    },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema) as Model<User>;

