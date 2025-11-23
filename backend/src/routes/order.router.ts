import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from "../controllers/order.controller.js";

import { verifyFirebaseToken } from "../middlewares/verifyFirebase.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Crear pedido (solo comprador)
router.post("/", verifyFirebaseToken, checkRole(["comprador"]), createOrder);

// Obtener todos los pedidos (solo admin)
router.get("/", verifyFirebaseToken, checkRole(["admin"]), getOrders);

// Obtener pedido por ID (admin o comprador propietario)
router.get("/:id", verifyFirebaseToken, checkRole(["admin", "comprador"]), getOrderById);

// Actualizar estado (admin o vendedor)
router.patch("/:id/status", verifyFirebaseToken, checkRole(["admin", "vendedor"]), updateOrderStatus);

// Eliminar pedido (solo admin)
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteOrder);

export default router;