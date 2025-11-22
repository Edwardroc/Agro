import { Request, Response } from "express";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/products.model";
import { NotificationModel } from "../models/notification.model";


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { comprador_uid, productos, total } = req.body;

    if (!comprador_uid || !productos?.length) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // 1️⃣ Validar y actualizar stock de productos
    for (const item of productos) {
      const product = await ProductModel.findById(item.producto_id);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.producto_id}` });
      }
      if (product.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.nombre}` });
      }
      product.stock -= item.cantidad;
      await product.save();
    }

    // 2️⃣ Crear el pedido
    const order = await OrderModel.create({
      comprador_uid,
      productos,
      total,
      estado: "pendiente",
      fecha_pedido: new Date(),
    });

    // 3️⃣ Crear notificación para el comprador
    await NotificationModel.create({
      usuario_uid: comprador_uid,
      mensaje: `Tu pedido #${order._id} fue creado con éxito 🛒`,
      tipo: "pedido",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("❌ Error creando pedido:", error);
    res.status(500).json({ message: "Error al crear pedido" });
  }
};

/**
 * 🔵 Obtener todos los pedidos (solo admin)
 */
export const getOrders = async (_: Request, res: Response) => {
  try {
    const orders = await OrderModel.find().populate("productos.producto_id");
    res.json(orders);
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

/**
 * 🔍 Obtener pedido por ID
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate("productos.producto_id");
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(order);
  } catch (error) {
    console.error("❌ Error al obtener pedido:", error);
    res.status(500).json({ message: "Error al obtener pedido" });
  }
};

/**
 * 🟠 Actualizar estado del pedido (solo admin o vendedor)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    // Crear notificación al comprador
    await NotificationModel.create({
      usuario_uid: order.comprador_uid,
      mensaje: `Tu pedido #${order._id} cambió su estado a: ${estado.toUpperCase()} 📦`,
      tipo: "pedido",
    });

    res.json({ message: "Estado actualizado", order });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

/**
 * 🔴 Eliminar pedido (opcional, solo admin)
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const deleted = await OrderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json({ message: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar pedido:", error);
    res.status(500).json({ message: "Error al eliminar pedido" });
  }
};
