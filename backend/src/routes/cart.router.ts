import express from "express";
import { addToCart, getCart, clearCart, removeItemFromCart } from "../controllers/cart.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebase.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Obtener carrito del usuario
router.get("/:uid", verifyFirebaseToken, checkRole(["comprador"]), getCart);

// Agregar producto al carrito
router.post("/", verifyFirebaseToken, checkRole(["comprador"]), addToCart);

// Vaciar carrito
router.delete("/:uid/clear", verifyFirebaseToken, checkRole(["comprador"]), clearCart);

// Remover producto específico del carrito
router.delete("/:uid/items/:productId", verifyFirebaseToken, checkRole(["comprador"]), removeItemFromCart);

export default router;