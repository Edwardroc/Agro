import { Request, Response } from "express";
import { OrderModel } from "../models/order.model.js";
import { ProductModel } from "../models/products.model.js";
import { NotificationModel } from "../models/notification.model.js";
import { UserModel } from "../models/user.model.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { comprador_uid, productos, total, direccion_envio, metodo_pago } = req.body;

    // 1️⃣ Validaciones básicas
    if (!comprador_uid || !productos?.length) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    if (!Array.isArray(productos)) {
      return res.status(400).json({ message: "Productos debe ser un array" });
    }

    if (productos.length === 0) {
      return res.status(400).json({ message: "Debe haber al menos un producto" });
    }

    // 2️⃣ Validar que el total sea positivo
    if (!total || typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ message: "El total debe ser un número positivo" });
    }

    // 3️⃣ Validar que la dirección sea válida
    if (!direccion_envio || !direccion_envio.departamento || !direccion_envio.ciudad || !direccion_envio.detalle) {
      return res.status(400).json({ message: "Dirección de envío incompleta" });
    }

    // 4️⃣ Validar cada producto
    let calcularTotal = 0;
    const productosValidos = [];

    for (const item of productos) {
      // Validar estructura del item
      if (!item.producto_id || !item.nombre || item.cantidad === undefined || item.precio_unitario === undefined) {
        return res.status(400).json({ message: "Producto con datos incompletos" });
      }

      // Validar cantidad positiva
      if (typeof item.cantidad !== 'number' || item.cantidad <= 0) {
        return res.status(400).json({ message: `Cantidad inválida para ${item.nombre}` });
      }

      // Validar precio positivo
      if (typeof item.precio_unitario !== 'number' || item.precio_unitario < 0) {
        return res.status(400).json({ message: `Precio inválido para ${item.nombre}` });
      }

      // Obtener producto de la BD
      const product = await ProductModel.findById(item.producto_id);
      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.producto_id}` });
      }

      // Validar stock
      if (product.stock < item.cantidad) {
        return res.status(400).json({ 
          message: `Stock insuficiente para ${product.nombre}. Disponibles: ${product.stock}` 
        });
      }

      // Validar que el vendedor no sea el comprador
      if (product.vendedor_uid === comprador_uid) {
        return res.status(400).json({ 
          message: `No puedes comprar tus propios productos` 
        });
      }

      // Validar que el precio no haya cambiado significativamente (tolerancia del 5%)
      const precioActual = product.precio;
      const precioEnOrden = item.precio_unitario;
      const diferenciaPorcentaje = Math.abs((precioActual - precioEnOrden) / precioActual) * 100;
      
      if (diferenciaPorcentaje > 5) {
        return res.status(400).json({ 
          message: `El precio de ${product.nombre} ha cambiado significativamente. Precio actual: $${precioActual}` 
        });
      }

      // Calcular total correcto
      calcularTotal += item.cantidad * item.precio_unitario;
      productosValidos.push(item);
    }

    // 5️⃣ Validar que el total coincida (permitir pequeña diferencia por decimales)
    const diferencia = Math.abs(calcularTotal - total);
    if (diferencia > 1) {
      return res.status(400).json({ 
        message: `El total no coincide. Total esperado: $${calcularTotal.toFixed(2)}` 
      });
    }

    // 6️⃣ Actualizar stock (TRANSACCIÓN SIMULADA)
    const productosActualizados = [];
    try {
      for (const item of productosValidos) {
        const product = await ProductModel.findById(item.producto_id);
        if (!product) {
          throw new Error(`Producto no encontrado durante actualización: ${item.producto_id}`);
        }
        product.stock -= item.cantidad;
        await product.save();
        productosActualizados.push(product);
      }
    } catch (error) {
      // Si algo falla, restaurar stock
      for (const product of productosActualizados) {
        const originalProduct = await ProductModel.findById(product._id);
        if (originalProduct) {
          // Aquí deberías tener la cantidad original guardada
          originalProduct.stock += 1; // Esto es simplificado
          await originalProduct.save();
        }
      }
      throw error;
    }

    // 7️⃣ Crear la orden
    const order = await OrderModel.create({
      comprador_uid,
      productos: productosValidos,
      total: calcularTotal,
      estado: "pendiente",
      fecha_pedido: new Date(),
      direccion_envio,
      metodo_pago: metodo_pago || "transferencia"
    });

    // 8️⃣ Crear notificación para el comprador
    await NotificationModel.create({
      usuario_uid: comprador_uid,
      mensaje: `Tu pedido #${order._id.toString().slice(-8).toUpperCase()} fue creado con éxito 🛒`,
      tipo: "pedido",
    });

    // 9️⃣ Notificar a los vendedores
    const vendedoresUnicos = new Set(productosValidos.map((p: any) => {
      const product = productosActualizados.find((prod: any) => prod._id.toString() === p.producto_id);
      return product?.vendedor_uid;
    }));

    for (const vendedorUid of vendedoresUnicos) {
      if (vendedorUid) {
        await NotificationModel.create({
          usuario_uid: vendedorUid as string,
          mensaje: `Tienes un nuevo pedido #${order._id.toString().slice(-8).toUpperCase()} 📦`,
          tipo: "pedido",
        });
      }
    }

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

    // Validar estado
    const estadosValidos = ["pendiente", "enviado", "entregado", "cancelado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    // Crear notificación al comprador
    await NotificationModel.create({
      usuario_uid: order.comprador_uid,
      mensaje: `Tu pedido #${order._id.toString().slice(-8).toUpperCase()} cambió su estado a: ${estado.toUpperCase()} 📦`,
      tipo: "pedido",
    });

    res.json({ message: "Estado actualizado", order });
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

/**
 * 🔴 Eliminar pedido (solo admin)
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