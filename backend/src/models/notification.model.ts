import { Schema, model, Model } from "mongoose";
import { Notification } from "../interfaces/notification.interface";

const NotificationSchema = new Schema<Notification>(
  {
    usuario_uid: { type: String, required: true }, // UID del usuario de Firebase
    mensaje: { type: String, required: true },
    tipo: { type: String, enum: ["sistema", "pedido", "producto", "general"], default: "general" },
    leido: { type: Boolean, default: false },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const NotificationModel = model<Notification>(
  "Notification",
  NotificationSchema
) as Model<Notification>;
