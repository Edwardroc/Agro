import { Request, Response } from "express";
import { NotificationModel } from "../models/notification.model";


export const createNotification = async (req: Request, res: Response) => {
  try {
    const { usuario_uid, mensaje, tipo } = req.body;

    if (!usuario_uid || !mensaje) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const notification = await NotificationModel.create({
      usuario_uid,
      mensaje,
      tipo,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error al crear notificación:", error);
    res.status(500).json({ message: "Error al crear notificación" });
  }
};


export const getNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const notifications = await NotificationModel.find({ usuario_uid: uid }).sort({ fecha: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};


export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { leido: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.status(200).json({
      message: "Notificación marcada como leída",
      notification,
    });
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
};


export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await NotificationModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    res.json({ message: "Notificación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar notificación:", error);
    res.status(500).json({ message: "Error al eliminar notificación" });
  }
};


export const clearNotificationsByUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    await NotificationModel.deleteMany({ usuario_uid: uid });

    res.json({ message: "Todas las notificaciones del usuario fueron eliminadas" });
  } catch (error) {
    console.error("Error al limpiar notificaciones:", error);
    res.status(500).json({ message: "Error al limpiar notificaciones" });
  }
};

