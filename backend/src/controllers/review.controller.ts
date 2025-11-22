import { Request, Response } from "express";
import { ReviewModel } from "../models/review.model";
import mongoose from "mongoose";
import { NotificationModel } from "../models/notification.model";
import { ProductModel } from "../models/products.model";

export const createReview = async (req: Request, res: Response) => {
  try {
    const { usuario_uid, producto_id, puntuacion, comentario } = req.body;

    // 1️⃣ Validar datos obligatorios
    if (!usuario_uid || !producto_id || !puntuacion) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // 2️⃣ Validar rango de puntuación
    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ message: "La puntuación debe estar entre 1 y 5" });
    }

    // 3️⃣ Validar que el producto exista
    const producto = await ProductModel.findById(producto_id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 4️⃣ Crear la reseña
    const review = await ReviewModel.create({
      usuario_uid,
      producto_id,
      puntuacion,
      comentario,
      fecha: new Date(),
    });

    // 5️⃣ Crear notificación para el vendedor
    await NotificationModel.create({
      usuario_uid: producto.vendedor_uid,
      mensaje: `Tu producto "${producto.nombre}" ha recibido una nueva reseña ⭐ (${puntuacion}/5)`,
      tipo: "producto",
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("❌ Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

// 🔵 Obtener reseñas de un producto
export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "ID de producto no válido" });
    }

    const reviews = await ReviewModel.find({ producto_id: productId })
      .populate("producto_id", "nombre precio");

    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// 🟡 Obtener todas las reseñas (solo admin)
export const getAllReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await ReviewModel.find()
      .populate("producto_id", "nombre precio");
    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

// ✏️ Actualizar reseña
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await ReviewModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Reseña no encontrada" });
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    res.status(500).json({ message: "Error al actualizar reseña" });
  }
};

// ❌ Eliminar reseña
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ReviewModel.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Reseña no encontrada" });
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};
