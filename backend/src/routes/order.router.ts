import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from "../controllers/order.controller";

import { verifyFirebaseToken } from "../middlewares/verifyFirebase";
import { checkRole } from "../middlewares/checkRole";

const router = express.Router();


router.post("/", verifyFirebaseToken, checkRole(["comprador"]), createOrder);
router.get("/", verifyFirebaseToken, checkRole(["admin"]), getOrders);
router.get("/:id", verifyFirebaseToken, checkRole(["admin", "comprador"]), getOrderById);
router.patch("/:id", verifyFirebaseToken, checkRole(["admin", "vendedor"]), updateOrderStatus);
router.delete("/:id", verifyFirebaseToken, checkRole(["admin"]), deleteOrder);

export default router;
