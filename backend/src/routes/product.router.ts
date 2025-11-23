import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyFirebase.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Rutas públicas
router.get("/", getProducts);
router.get("/:id", getProductById);

// Rutas protegidas
router.post("/", verifyFirebaseToken, checkRole(["admin", "vendedor"]), createProduct);
router.put("/:id", verifyFirebaseToken, checkRole(["admin", "vendedor"]), updateProduct);
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteProduct);

export default router;