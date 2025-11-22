import express from "express";
// import { verifyFirebaseToken } from "../middlewares/verifyFirebase";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { verifyFirebaseToken } from "../middlewares/verifyFirebase";
import { checkRole } from "../middlewares/checkRole";
const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", verifyFirebaseToken, checkRole(["admin", "vendedor"]), createProduct);
router.put("/:id", verifyFirebaseToken, checkRole(["admin", "vendedor"]), updateProduct);
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteProduct);

export default router;