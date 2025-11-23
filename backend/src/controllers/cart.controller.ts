import { Request, Response } from "express";
import { CartModel } from "../models/cart.model.js";

export const getCart = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    // Validar que el usuario solo vea su propio carrito
    if (req.uid !== uid) {
      return res.status(403).json({ message: "No tienes permiso para ver este carrito" });
    }

    const cart = await CartModel.findOne({ comprador_uid: uid })
      .populate("items.producto_id");

    res.status(200).json(cart || { message: "Carrito vacío", items: [], total: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener carrito" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { comprador_uid, producto_id, nombre, cantidad, precio_unitario } = req.body;

    // Validar datos
    if (!comprador_uid || !producto_id || !nombre || !cantidad || precio_unitario === undefined) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Validar cantidad positiva
    if (typeof cantidad !== 'number' || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser un número positivo" });
    }

    // Validar precio no negativo
    if (typeof precio_unitario !== 'number' || precio_unitario < 0) {
      return res.status(400).json({ message: "El precio no puede ser negativo" });
    }

    // Validar que el usuario pertenezca al comprador
    if (req.uid !== comprador_uid) {
      return res.status(403).json({ message: "No puedes agregar artículos al carrito de otro usuario" });
    }

    let cart = await CartModel.findOne({ comprador_uid });

    if (!cart) {
      // Crear carrito nuevo
      cart = await CartModel.create({
        comprador_uid,
        items: [{ producto_id, nombre, cantidad, precio_unitario }],
        total: cantidad * precio_unitario,
      });
    } else {
      // Buscar si el producto ya está en el carrito
      const existingItem = cart.items.find(item =>
        item.producto_id.toString() === producto_id
      );

      if (existingItem) {
        existingItem.cantidad += cantidad;
      } else {
        cart.items.push({ producto_id, nombre, cantidad, precio_unitario });
      }

      // Recalcular total
      cart.total = cart.items.reduce(
        (sum, item) => sum + item.cantidad * item.precio_unitario,
        0
      );

      cart.fecha_actualizacion = new Date().toISOString();
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar producto al carrito" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;

    // Validar que el usuario solo pueda limpiar su propio carrito
    if (req.uid !== uid) {
      return res.status(403).json({ message: "No tienes permiso para limpiar este carrito" });
    }

    await CartModel.findOneAndUpdate(
      { comprador_uid: uid },
      { items: [], total: 0, fecha_actualizacion: new Date() }
    );

    res.json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al vaciar carrito" });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const { uid, productId } = req.params;

    // Validar que el usuario solo pueda modificar su propio carrito
    if (req.uid !== uid) {
      return res.status(403).json({ message: "No tienes permiso para modificar este carrito" });
    }

    // Validar que productId sea válido
    if (!productId) {
      return res.status(400).json({ message: "ID de producto no proporcionado" });
    }

    const cart = await CartModel.findOne({ comprador_uid: uid });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Buscar el producto en el carrito
    const itemIndex = cart.items.findIndex(
      (item) => item.producto_id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

    // Reducir cantidad o eliminar el producto
    const item = cart.items[itemIndex];
    if (item.cantidad > 1) {
      item.cantidad -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    // Recalcular total
    cart.total = cart.items.reduce(
      (sum, i) => sum + i.cantidad * i.precio_unitario,
      0
    );

    cart.fecha_actualizacion = new Date().toISOString();
    await cart.save();

    res.status(200).json({
      message: "Producto actualizado en el carrito correctamente",
      carrito: cart,
    });
  } catch (error) {
    console.error("Error eliminando producto del carrito:", error);
    res.status(500).json({ message: "Error al eliminar producto del carrito" });
  }
};